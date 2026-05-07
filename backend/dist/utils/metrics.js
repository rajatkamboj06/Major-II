"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCounter = exports.vulnerabilitiesGauge = exports.stepDurationHistogram = exports.pipelineTotalCounter = exports.register = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Registry
exports.register = new prom_client_1.default.Registry();
// Add default metrics (CPU, Memory, etc.)
prom_client_1.default.collectDefaultMetrics({ register: exports.register });
// Define Custom Metrics
// Counter for total pipelines executed
exports.pipelineTotalCounter = new prom_client_1.default.Counter({
    name: 'opspilot_pipelines_total',
    help: 'Total number of pipelines executed',
    labelNames: ['status'],
});
exports.register.registerMetric(exports.pipelineTotalCounter);
// Histogram for step duration
exports.stepDurationHistogram = new prom_client_1.default.Histogram({
    name: 'opspilot_step_duration_seconds',
    help: 'Duration of pipeline steps in seconds',
    labelNames: ['step_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300], // custom buckets
});
exports.register.registerMetric(exports.stepDurationHistogram);
// Gauge for vulnerabilities found
exports.vulnerabilitiesGauge = new prom_client_1.default.Gauge({
    name: 'opspilot_vulnerabilities_current',
    help: 'Current number of vulnerabilities found in the latest scan',
    labelNames: ['severity', 'scanner'],
});
exports.register.registerMetric(exports.vulnerabilitiesGauge);
// Counter for log messages
exports.logCounter = new prom_client_1.default.Counter({
    name: 'opspilot_logs_total',
    help: 'Total number of log messages emitted',
    labelNames: ['level'],
});
exports.register.registerMetric(exports.logCounter);
//# sourceMappingURL=metrics.js.map