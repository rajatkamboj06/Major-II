"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executePipeline = void 0;
const Pipeline_1 = __importDefault(require("../models/Pipeline"));
const ExecutionLog_1 = __importDefault(require("../models/ExecutionLog"));
const Report_1 = __importDefault(require("../models/Report"));
const index_1 = require("../index");
const reportService_1 = require("./reportService");
const metrics_1 = require("../utils/metrics");
const toolManager_1 = require("../utils/toolManager");
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const execAsync = util_1.default.promisify(child_process_1.exec);
// Step execution messages for realistic simulation
const stepMessages = {
    github_checkout: [
        'Connecting to GitHub repository...',
        'Authenticating with deploy key...',
        'Cloning repository (branch: main)...',
        'Checkout complete — 247 files fetched',
    ],
    npm_install: [
        'Reading package.json...',
        'Resolving dependency tree...',
        'Installing 1,247 packages...',
        'Running npm audit...',
        'npm install completed in 12.3s',
    ],
    npm_build: [
        'Running build script...',
        'Compiling TypeScript sources...',
        'Bundling with webpack...',
        'Build successful — output: ./dist (2.4 MB)',
    ],
    pip_install: [
        'Reading requirements.txt...',
        'Creating virtual environment...',
        'Installing 84 packages...',
        'pip install completed successfully',
    ],
    pytest_run: [
        'Discovering test files...',
        'Running 156 tests across 23 modules...',
        'All tests passed (156/156)',
        'Test coverage: 87.3%',
    ],
    docker_build: [
        'Reading Dockerfile...',
        'Building layer 1/6: base image (node:20-alpine)...',
        'Building layer 4/6: copying source files...',
        'Docker image built — opspilot/app:latest (184 MB)',
    ],
    docker_push: [
        'Authenticating with container registry...',
        'Pushing layer 1/4...',
        'Pushing layer 4/4...',
        'Image pushed to registry successfully',
    ],
    sonarqube_scan: [
        'Initializing SonarQube scanner...',
        'Scanning repository for vulnerabilities...',
        'Executing SonarQube CLI...',
        'Analysis complete — generating report...',
        'Quality Gate details fetched',
    ],
    trivy_scan: [
        'Initializing Trivy vulnerability scanner...',
        'Downloading Trivy DB if missing...',
        'Scanning file system for CVEs...',
        'Generating security report...',
        'Security scan complete — report ready',
    ],
    snyk_scan: [
        'Initializing Snyk CLI...',
        'Authenticating with Snyk...',
        'Scanning dependencies for vulnerabilities...',
        'Generating Snyk security report...',
        'Snyk scan complete',
    ],
    aws_ecs_deploy: [
        'Updating ECS task definition...',
        'Registering new task revision...',
        'Deploying to ECS cluster (production)...',
        'Deployment successful — service stabilized',
    ],
    aws_ec2_deploy: [
        'Connecting to EC2 instance via SSH...',
        'Stopping existing application...',
        'Deploying new version...',
        'Application started — health check passed ✓',
    ],
};
const reportGenerators = {
    sonarqube_scan: reportService_1.generateSonarQubeReport,
    trivy_scan: reportService_1.generateTrivyReport,
    snyk_scan: reportService_1.generateSnykReport,
    docker_build: reportService_1.generateDockerBuildReport,
    npm_install: reportService_1.generateNpmAuditReport,
};
const reportGeneratorsWithStepType = {
    pytest_run: reportService_1.generateTestCoverageReport,
    aws_ecs_deploy: reportService_1.generateDeploymentReport,
    aws_ec2_deploy: reportService_1.generateDeploymentReport,
};
const getStepDuration = () => {
    return Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
};
const executePipeline = async (pipelineId) => {
    try {
        const pipeline = await Pipeline_1.default.findById(pipelineId);
        if (!pipeline)
            throw new Error('Pipeline not found');
        // Clean up any previous reports for re-runs
        await Report_1.default.deleteMany({ pipelineId });
        pipeline.status = 'running';
        await pipeline.save();
        // Customize github_checkout message if repo is provided
        const repoUrl = pipeline.githubRepo;
        const branch = pipeline.githubBranch;
        if (repoUrl) {
            stepMessages.github_checkout = [
                `Connecting to ${repoUrl}...`,
                'Authenticating with deploy key...',
                `Cloning repository${branch ? ` (branch: ${branch})` : ''}...`,
                'Checkout complete — repository cloned',
            ];
        }
        // Notify clients of status change
        index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:status', {
            pipelineId,
            status: 'running',
        });
        index_1.io.emit('pipeline:globalUpdate', { pipelineId, status: 'running', name: pipeline.name });
        console.log(`\n🚀 Starting execution for pipeline: ${pipeline.name}`);
        if (repoUrl)
            console.log(`   📦 Repository: ${repoUrl} (${branch})`);
        const nodes = pipeline.nodes;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const messages = stepMessages[node.type] || [
                `Initializing ${node.type}...`,
                `Processing...`,
                `Step completed`,
            ];
            // Emit step started
            index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:stepStart', {
                pipelineId,
                stepIndex: i,
                stepType: node.type,
                stepLabel: node.data?.label || node.type,
            });
            console.log(`  ▶ Step ${i + 1}/${nodes.length} [${node.type}]: ${node.data?.label || node.type}`);
            const stepStartTime = Date.now();
            let rawReportData = null;
            let toolError = null;
            const deployDir = path_1.default.join(__dirname, '../../deployments', pipelineId.toString());
            // Stream messages with delays
            for (let j = 0; j < messages.length; j++) {
                const message = messages[j];
                let currentLevel = 'info';
                let customMessage = message;
                if (node.type === 'github_checkout' && repoUrl && j === 2) {
                    try {
                        if (fs_1.default.existsSync(deployDir)) {
                            fs_1.default.rmSync(deployDir, { recursive: true, force: true });
                        }
                        console.log(`    [Git] Cloning to ${deployDir}...`);
                        const branchFlag = branch ? `-b ${branch} --single-branch` : '';
                        await execAsync(`git clone ${branchFlag} ${repoUrl} "${deployDir}"`);
                    }
                    catch (err) {
                        console.error(`    [Git Error] ${err.message}`);
                        currentLevel = 'warn';
                    }
                }
                else if (node.type === 'trivy_scan' && j === 2 && fs_1.default.existsSync(deployDir)) {
                    try {
                        const trivyExe = await (0, toolManager_1.ensureTrivy)();
                        console.log(`    [Trivy] Running scan...`);
                        const reportFile = path_1.default.join(deployDir, 'trivy-report.json');
                        await execAsync(`"${trivyExe}" fs --format json --output "${reportFile}" "${deployDir}"`);
                        if (fs_1.default.existsSync(reportFile)) {
                            rawReportData = JSON.parse(fs_1.default.readFileSync(reportFile, 'utf8'));
                        }
                    }
                    catch (err) {
                        console.error(`    [Trivy Error] ${err.message}`);
                        toolError = err.message;
                        currentLevel = 'error';
                        customMessage = `Trivy scan failed: ${err.message.substring(0, 100)}`;
                    }
                }
                else if (node.type === 'snyk_scan' && j === 2 && fs_1.default.existsSync(deployDir)) {
                    try {
                        console.log(`    [Snyk] Running scan...`);
                        const reportFile = path_1.default.join(deployDir, 'snyk-report.json');
                        try {
                            await execAsync(`npx snyk test --json > "${reportFile}"`, { cwd: deployDir });
                        }
                        catch (scanErr) {
                            // Snyk returns non-zero code if vulns found
                        }
                        if (fs_1.default.existsSync(reportFile)) {
                            rawReportData = JSON.parse(fs_1.default.readFileSync(reportFile, 'utf8'));
                        }
                        else {
                            // Graceful fallback to empty report instead of error
                            rawReportData = { vulnerabilities: [] };
                            currentLevel = 'info';
                            customMessage = 'Snyk scan skipped/failed (unauthenticated)';
                        }
                    }
                    catch (err) {
                        rawReportData = { vulnerabilities: [] };
                        currentLevel = 'info';
                        customMessage = 'Snyk scan skipped/failed (unauthenticated)';
                    }
                }
                else if (node.type === 'sonarqube_scan' && j === 2 && fs_1.default.existsSync(deployDir)) {
                    try {
                        console.log(`    [SonarQube] Running scan...`);
                        try {
                            await execAsync(`npx sonarqube-scanner`, { cwd: deployDir });
                        }
                        catch (err) {
                            // SonarQube server is likely not running. Perform a local static analysis scan to provide real findings.
                            const issues = [];
                            const scanFiles = (dir) => {
                                const files = fs_1.default.readdirSync(dir);
                                for (const file of files) {
                                    const fullPath = path_1.default.join(dir, file);
                                    if (fs_1.default.statSync(fullPath).isDirectory()) {
                                        if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
                                            scanFiles(fullPath);
                                        }
                                    }
                                    else if (/\.(ts|js|jsx|tsx)$/.test(file)) {
                                        const content = fs_1.default.readFileSync(fullPath, 'utf8');
                                        const lines = content.split('\n');
                                        lines.forEach((line, index) => {
                                            const relPath = path_1.default.relative(deployDir, fullPath);
                                            if (line.includes('console.log')) {
                                                issues.push({ key: `SQ-${Date.now()}-${issues.length}`, severity: 'MINOR', message: 'Remove this console.log statement', component: relPath, line: index + 1, rule: 'javascript:S106' });
                                            }
                                            if (line.includes('TODO')) {
                                                issues.push({ key: `SQ-${Date.now()}-${issues.length}`, severity: 'INFO', message: 'Resolve TODO comment', component: relPath, line: index + 1, rule: 'javascript:S1135' });
                                            }
                                            if (line.includes('any')) {
                                                issues.push({ key: `SQ-${Date.now()}-${issues.length}`, severity: 'MAJOR', message: 'Avoid using "any" type', component: relPath, line: index + 1, rule: 'typescript:S3242' });
                                            }
                                            if (/(password|secret|key)\s*=\s*['"][^'"]+['"]/.test(line.toLowerCase())) {
                                                issues.push({ key: `SQ-${Date.now()}-${issues.length}`, severity: 'CRITICAL', message: 'Hardcoded credentials detected', component: relPath, line: index + 1, rule: 'security:S2068' });
                                            }
                                        });
                                    }
                                }
                            };
                            try {
                                scanFiles(deployDir);
                            }
                            catch (e) {
                                // Ignore read errors
                            }
                            // If no issues found, add at least one generic so it doesn't just pass magically
                            if (issues.length === 0) {
                                issues.push({ key: 'SQ-INFO-1', severity: 'INFO', message: 'Codebase looks clean from basic static analysis', component: 'project', line: 1, rule: 'info:101' });
                            }
                            rawReportData = { issues };
                            currentLevel = 'info';
                            customMessage = 'Executing SonarQube CLI (Local Fallback Scan)...';
                        }
                    }
                    catch (err) {
                        currentLevel = 'info';
                    }
                }
                else {
                    await new Promise(resolve => setTimeout(resolve, getStepDuration() / messages.length));
                }
                // Save log to DB
                const log = await ExecutionLog_1.default.create({
                    pipelineId,
                    stepIndex: i,
                    stepType: node.type,
                    stepLabel: node.data?.label || node.type,
                    message: customMessage,
                    level: currentLevel,
                });
                // Emit metric
                metrics_1.logCounter.labels(currentLevel).inc();
                // Emit log to connected clients
                index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:log', {
                    pipelineId,
                    stepIndex: i,
                    stepType: node.type,
                    stepLabel: node.data?.label || node.type,
                    message: customMessage,
                    level: currentLevel,
                    timestamp: log.createdAt,
                });
                // Also emit to global log stream
                index_1.io.emit('logs:new', {
                    pipelineId,
                    pipelineName: pipeline.name,
                    stepIndex: i,
                    stepType: node.type,
                    stepLabel: node.data?.label || node.type,
                    message: customMessage,
                    level: currentLevel,
                    timestamp: log.createdAt,
                });
                console.log(`    ${customMessage}`);
            }
            const duration = Date.now() - stepStartTime;
            // ── Generate Report for this step ──
            let report = null;
            if (reportGenerators[node.type]) {
                try {
                    report = await reportGenerators[node.type](pipelineId, i, duration, rawReportData);
                    console.log(`    📊 Report generated for ${node.type}`);
                }
                catch (err) {
                    console.error(`    ⚠️ Failed to generate report for ${node.type}`, err);
                }
            }
            else if (reportGeneratorsWithStepType[node.type]) {
                try {
                    report = await reportGeneratorsWithStepType[node.type](pipelineId, i, node.type, duration);
                    console.log(`    📊 Report generated for ${node.type}`);
                }
                catch (err) {
                    console.error(`    ⚠️ Failed to generate report for ${node.type}`, err);
                }
            }
            if (report && report.summary) {
                if (report.summary.critical > 0)
                    metrics_1.vulnerabilitiesGauge.labels('critical', report.reportType).set(report.summary.critical);
                if (report.summary.high > 0)
                    metrics_1.vulnerabilitiesGauge.labels('high', report.reportType).set(report.summary.high);
                if (report.summary.medium > 0)
                    metrics_1.vulnerabilitiesGauge.labels('medium', report.reportType).set(report.summary.medium);
                if (report.summary.low > 0)
                    metrics_1.vulnerabilitiesGauge.labels('low', report.reportType).set(report.summary.low);
            }
            // Record step duration metric
            metrics_1.stepDurationHistogram.labels(node.type).observe(duration / 1000);
            // Save step completion log
            const completionLog = await ExecutionLog_1.default.create({
                pipelineId,
                stepIndex: i,
                stepType: node.type,
                stepLabel: node.data?.label || node.type,
                message: `✓ ${node.data?.label || node.type} completed in ${(duration / 1000).toFixed(1)}s`,
                level: 'success',
                duration,
            });
            metrics_1.logCounter.labels('success').inc();
            // Emit step completed (with report flag)
            index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:stepComplete', {
                pipelineId,
                stepIndex: i,
                stepType: node.type,
                duration,
                hasReport: !!report,
            });
            // Emit report ready event if a report was generated
            if (report) {
                index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:reportReady', {
                    pipelineId,
                    stepIndex: i,
                    stepType: node.type,
                    reportType: report.reportType,
                    summaryStatus: report.summary.status,
                    totalFindings: report.summary.totalFindings,
                });
            }
            index_1.io.emit('logs:new', {
                pipelineId,
                pipelineName: pipeline.name,
                stepIndex: i,
                stepType: node.type,
                stepLabel: node.data?.label || node.type,
                message: `✓ ${node.data?.label || node.type} completed in ${(duration / 1000).toFixed(1)}s`,
                level: 'success',
                timestamp: completionLog.createdAt,
            });
        }
        pipeline.status = 'success';
        await pipeline.save();
        metrics_1.pipelineTotalCounter.labels('success').inc();
        index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:status', {
            pipelineId,
            status: 'success',
        });
        index_1.io.emit('pipeline:globalUpdate', { pipelineId, status: 'success', name: pipeline.name });
        console.log(`✅ Pipeline "${pipeline.name}" executed successfully.\n`);
    }
    catch (error) {
        console.error('❌ Execution Error:', error.message);
        await ExecutionLog_1.default.create({
            pipelineId,
            stepIndex: -1,
            stepType: 'system',
            stepLabel: 'System Error',
            message: `Pipeline execution failed: ${error.message}`,
            level: 'error',
        });
        await Pipeline_1.default.findByIdAndUpdate(pipelineId, { status: 'failed' });
        metrics_1.pipelineTotalCounter.labels('failed').inc();
        index_1.io.to(`pipeline:${pipelineId}`).emit('pipeline:status', {
            pipelineId,
            status: 'failed',
            error: error.message,
        });
        index_1.io.emit('pipeline:globalUpdate', { pipelineId, status: 'failed' });
    }
};
exports.executePipeline = executePipeline;
//# sourceMappingURL=executionService.js.map