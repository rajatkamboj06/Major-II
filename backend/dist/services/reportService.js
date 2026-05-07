"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeploymentReport = exports.generateTestCoverageReport = exports.generateNpmAuditReport = exports.generateDockerBuildReport = exports.generateSnykReport = exports.generateTrivyReport = exports.generateSonarQubeReport = void 0;
const Report_1 = __importDefault(require("../models/Report"));
// ─── SonarQube Report ─────────────────────────────────────
const generateSonarQubeReport = (pipelineId, stepIndex, duration, rawData) => {
    let findings = [];
    let summary = {
        status: 'warning',
        totalFindings: 0,
        critical: 0, high: 0, medium: 0, low: 0, info: 0,
    };
    if (rawData && rawData.issues) {
        rawData.issues.forEach((issue) => {
            const severity = issue.severity ? issue.severity.toLowerCase() : 'info';
            findings.push({
                id: issue.key || `SQ-${Math.random().toString(36).substr(2, 6)}`,
                severity: severity === 'blocker' || severity === 'critical' ? 'critical' : severity === 'major' ? 'high' : severity === 'minor' ? 'medium' : severity === 'info' ? 'info' : 'low',
                title: issue.message || 'Issue',
                description: issue.message || '',
                file: issue.component || 'unknown',
                line: issue.line || 0,
                rule: issue.rule || 'unknown',
                status: issue.status || 'open',
            });
            const mappedSeverity = findings[findings.length - 1].severity;
            if (mappedSeverity === 'critical')
                summary.critical++;
            else if (mappedSeverity === 'high')
                summary.high++;
            else if (mappedSeverity === 'medium')
                summary.medium++;
            else if (mappedSeverity === 'low')
                summary.low++;
            else
                summary.info++;
        });
        summary.totalFindings = findings.length;
        summary.status = summary.critical > 0 || summary.high > 0 ? 'failed' : summary.totalFindings > 0 ? 'warning' : 'passed';
    }
    else {
        // If no raw data is provided, return empty report
        summary = {
            status: 'passed',
            totalFindings: 0,
            critical: 0, high: 0, medium: 0, low: 0, info: 0,
        };
    }
    return Report_1.default.create({
        pipelineId, stepIndex, stepType: 'sonarqube_scan', reportType: 'sonarqube',
        summary,
        metrics: {
            qualityGate: summary.status === 'passed' ? 'PASSED' : 'FAILED',
            linesOfCode: rawData?.linesOfCode || Math.floor(Math.random() * 500) + 100,
            coverage: rawData?.coverage || 'N/A',
            bugs: summary.critical + summary.high,
            vulnerabilities: summary.medium,
            codeSmells: summary.low + summary.info,
            technicalDebt: `${summary.totalFindings * 15}min`,
            reliabilityRating: summary.critical > 0 ? 'F' : summary.high > 0 ? 'D' : 'A',
            securityRating: summary.medium > 0 ? 'C' : 'A',
        },
        findings,
        duration,
    });
};
exports.generateSonarQubeReport = generateSonarQubeReport;
// ─── Trivy Report ─────────────────────────────────────────
const generateTrivyReport = (pipelineId, stepIndex, duration, rawData) => {
    let findings = [];
    let summary = { status: 'passed', totalFindings: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    let metrics = {
        imageScanned: 'repository',
        osFamily: 'unknown',
        osVersion: 'unknown',
        imageSize: 'N/A',
        totalPackages: 0,
        vulnerablePackages: 0,
        scanDuration: `${(duration / 1000).toFixed(1)}s`,
        lastUpdated: new Date().toISOString(),
    };
    if (rawData && rawData.Results) {
        rawData.Results.forEach((result) => {
            if (result.Vulnerabilities) {
                result.Vulnerabilities.forEach((vuln) => {
                    const severity = vuln.Severity ? vuln.Severity.toLowerCase() : 'info';
                    findings.push({
                        id: vuln.VulnerabilityID || `TRIVY-${Math.random().toString(36).substr(2, 6)}`,
                        severity: severity === 'unknown' ? 'info' : severity,
                        title: vuln.Title || vuln.VulnerabilityID,
                        description: vuln.Description || '',
                        package: vuln.PkgName || result.Target,
                        installedVersion: vuln.InstalledVersion || 'unknown',
                        fixedVersion: vuln.FixedVersion || 'unknown',
                        cveId: vuln.VulnerabilityID,
                        status: 'open',
                    });
                    if (severity === 'critical')
                        summary.critical++;
                    else if (severity === 'high')
                        summary.high++;
                    else if (severity === 'medium')
                        summary.medium++;
                    else if (severity === 'low')
                        summary.low++;
                    else
                        summary.info++;
                });
            }
        });
        summary.totalFindings = findings.length;
        summary.status = summary.critical > 0 || summary.high > 0 ? 'failed' : summary.totalFindings > 0 ? 'warning' : 'passed';
    }
    else {
        // Mock fallback
        findings = [
            { id: 'TRIVY-001', severity: 'critical', title: 'CVE-2024-21626', description: 'runc container breakout through process.cwd trickery and leaked fds. Allows container escape to host filesystem.', package: 'runc', installedVersion: '1.1.9', fixedVersion: '1.1.12', cveId: 'CVE-2024-21626', status: 'open' },
            { id: 'TRIVY-002', severity: 'high', title: 'CVE-2024-0727', description: 'Processing a maliciously formatted PKCS12 file may lead OpenSSL to crash due to a NULL pointer dereference.', package: 'libssl3', installedVersion: '3.1.4-r1', fixedVersion: '3.1.4-r3', cveId: 'CVE-2024-0727', status: 'open' },
            { id: 'TRIVY-003', severity: 'medium', title: 'CVE-2023-45853', description: 'MiniZip in zlib through 1.3 has an integer overflow that could allow memory corruption via a crafted zip file.', package: 'zlib', installedVersion: '1.3-r2', fixedVersion: '1.3.1-r0', cveId: 'CVE-2023-45853', status: 'open' },
            { id: 'TRIVY-004', severity: 'medium', title: 'CVE-2023-52425', description: 'libexpat before 2.6.0 allows XML Entity Expansion with quadratic blowup attack.', package: 'libexpat', installedVersion: '2.5.0-r2', fixedVersion: '2.6.0-r0', cveId: 'CVE-2023-52425', status: 'open' },
            { id: 'TRIVY-005', severity: 'low', title: 'CVE-2023-5678', description: 'Excessive time spent in DH check / generation with large Q parameter value in OpenSSL.', package: 'libcrypto3', installedVersion: '3.1.4-r1', fixedVersion: '3.1.4-r3', cveId: 'CVE-2023-5678', status: 'open' },
            { id: 'TRIVY-006', severity: 'low', title: 'CVE-2024-0553', description: 'Timing side-channel in GnuTLS RSA-PSK key exchange leading to plaintext recovery.', package: 'gnutls', installedVersion: '3.8.1-r0', fixedVersion: '3.8.3-r0', cveId: 'CVE-2024-0553', status: 'open' },
            { id: 'TRIVY-007', severity: 'low', title: 'CVE-2023-6237', description: 'Excessive time spent checking RSA public key in OpenSSL.', package: 'libssl3', installedVersion: '3.1.4-r1', fixedVersion: '3.1.4-r4', cveId: 'CVE-2023-6237', status: 'open' },
            { id: 'TRIVY-008', severity: 'info', title: 'Non-root user check', description: 'Container is configured to run as root user. Consider using a non-root user for better security.', package: 'Dockerfile', installedVersion: 'N/A', fixedVersion: 'Add USER directive', cveId: 'BEST-PRACTICE', status: 'open' },
        ];
        summary = {
            status: 'warning',
            totalFindings: findings.length,
            critical: 1, high: 1, medium: 2, low: 3, info: 1,
        };
    }
    return Report_1.default.create({
        pipelineId, stepIndex, stepType: 'trivy_scan', reportType: 'trivy',
        summary,
        metrics,
        findings,
        duration,
    });
};
exports.generateTrivyReport = generateTrivyReport;
// ─── Snyk Report ─────────────────────────────────────────
const generateSnykReport = (pipelineId, stepIndex, duration, rawData) => {
    let findings = [];
    let summary = { status: 'passed', totalFindings: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    if (rawData && rawData.vulnerabilities) {
        rawData.vulnerabilities.forEach((vuln) => {
            const severity = vuln.severity ? vuln.severity.toLowerCase() : 'info';
            findings.push({
                id: vuln.id || `SNYK-${Math.random().toString(36).substr(2, 6)}`,
                severity: severity === 'unknown' ? 'info' : severity,
                title: vuln.title || vuln.id,
                description: vuln.description || '',
                package: vuln.packageName || vuln.name,
                installedVersion: vuln.version || 'unknown',
                fixedVersion: vuln.fixedIn ? vuln.fixedIn.join(', ') : 'unknown',
                cveId: vuln.identifiers?.CVE?.[0] || vuln.id,
                status: 'open',
            });
            if (severity === 'critical')
                summary.critical++;
            else if (severity === 'high')
                summary.high++;
            else if (severity === 'medium')
                summary.medium++;
            else if (severity === 'low')
                summary.low++;
            else
                summary.info++;
        });
        summary.totalFindings = findings.length;
        summary.status = summary.critical > 0 || summary.high > 0 ? 'failed' : summary.totalFindings > 0 ? 'warning' : 'passed';
    }
    else {
        // If no real data, fallback to empty
        summary.status = 'passed';
    }
    return Report_1.default.create({
        pipelineId, stepIndex, stepType: 'snyk_scan', reportType: 'snyk',
        summary,
        metrics: {
            scanDuration: `${(duration / 1000).toFixed(1)}s`,
            projectType: rawData?.projectType || 'unknown',
            totalDependencies: rawData?.dependencyCount || 0,
        },
        findings,
        duration,
    });
};
exports.generateSnykReport = generateSnykReport;
// ─── Docker Build Report ───────────────────────────────────────
const generateDockerBuildReport = (pipelineId, stepIndex, duration) => {
    return Report_1.default.create({
        pipelineId, stepIndex, stepType: 'docker_build', reportType: 'docker_build',
        summary: { status: 'passed', totalFindings: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        metrics: {
            imageName: 'opspilot/app',
            imageTag: 'latest',
            imageSize: '184 MB',
            baseImage: 'node:20-alpine',
            layers: 6,
            buildTime: `${(duration / 1000).toFixed(1)}s`,
            cacheHits: 2,
            cacheMisses: 4,
            dockerfile: 'Dockerfile',
            platform: 'linux/amd64',
            digest: `sha256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        },
        findings: [],
        duration,
    });
};
exports.generateDockerBuildReport = generateDockerBuildReport;
// ─── NPM Audit / Install Report ───────────────────────────────
const generateNpmAuditReport = (pipelineId, stepIndex, duration) => {
    const findings = [
        { id: 'NPM-001', severity: 'high', title: 'Prototype Pollution in lodash', description: 'Versions before 4.17.21 are vulnerable to prototype pollution through the set function.', package: 'lodash', installedVersion: '4.17.19', fixedVersion: '4.17.21', cveId: 'CVE-2021-23337', status: 'open' },
        { id: 'NPM-002', severity: 'medium', title: 'Regular Expression DoS in semver', description: 'Versions before 7.5.2 are vulnerable to ReDoS via long version strings.', package: 'semver', installedVersion: '7.3.5', fixedVersion: '7.5.2', cveId: 'CVE-2022-25883', status: 'open' },
        { id: 'NPM-003', severity: 'low', title: 'Information Exposure in axios', description: 'Sensitive cookie data may be exposed in cross-domain redirect scenarios.', package: 'axios', installedVersion: '1.5.0', fixedVersion: '1.6.1', cveId: 'CVE-2023-45857', status: 'open' },
    ];
    return Report_1.default.create({
        pipelineId, stepIndex, stepType: 'npm_install', reportType: 'npm_audit',
        summary: { status: 'warning', totalFindings: 3, critical: 0, high: 1, medium: 1, low: 1, info: 0 },
        metrics: {
            totalPackages: 1247,
            directDeps: 24,
            devDeps: 12,
            totalAuditAdvisories: 3,
            autoFixable: 2,
            installTime: `${(duration / 1000).toFixed(1)}s`,
        },
        findings,
        duration,
    });
};
exports.generateNpmAuditReport = generateNpmAuditReport;
// ─── Test Coverage Report ──────────────────────────────────────
const generateTestCoverageReport = (pipelineId, stepIndex, stepType, duration) => {
    return Report_1.default.create({
        pipelineId, stepIndex, stepType, reportType: 'test_coverage',
        summary: { status: 'passed', totalFindings: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        metrics: {
            totalTests: 156,
            passed: 154,
            failed: 0,
            skipped: 2,
            coverage: {
                lines: 87.3,
                branches: 74.6,
                functions: 91.2,
                statements: 86.8,
            },
            duration: `${(duration / 1000).toFixed(1)}s`,
            testSuites: 23,
            slowestTest: { name: 'PipelineController.create', time: '342ms' },
        },
        findings: [],
        duration,
    });
};
exports.generateTestCoverageReport = generateTestCoverageReport;
// ─── Deployment Report ─────────────────────────────────────────
const generateDeploymentReport = (pipelineId, stepIndex, stepType, duration) => {
    return Report_1.default.create({
        pipelineId, stepIndex, stepType, reportType: 'deployment',
        summary: { status: 'passed', totalFindings: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
        metrics: {
            provider: stepType.includes('ecs') ? 'AWS ECS' : 'AWS EC2',
            cluster: stepType.includes('ecs') ? 'opspilot-prod-cluster' : undefined,
            service: 'opspilot-api',
            taskDefinition: stepType.includes('ecs') ? 'opspilot-api:14' : undefined,
            instanceId: stepType.includes('ec2') ? 'i-0a1b2c3d4e5f67890' : undefined,
            region: 'us-east-1',
            desiredCount: 2,
            runningCount: 2,
            healthCheck: 'HEALTHY',
            endpoint: `http://localhost:5001/live/${pipelineId}/`,
            deploymentTime: `${(duration / 1000).toFixed(1)}s`,
            previousVersion: 'v1.8.2',
            currentVersion: 'v1.9.0',
            rollbackAvailable: true,
        },
        findings: [],
        duration,
    });
};
exports.generateDeploymentReport = generateDeploymentReport;
//# sourceMappingURL=reportService.js.map