import client from 'prom-client';

// Create a Registry
export const register = new client.Registry();

// Add default metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register });

// Define Custom Metrics

// Counter for total pipelines executed
export const pipelineTotalCounter = new client.Counter({
  name: 'opspilot_pipelines_total',
  help: 'Total number of pipelines executed',
  labelNames: ['status'],
});
register.registerMetric(pipelineTotalCounter);

// Histogram for step duration
export const stepDurationHistogram = new client.Histogram({
  name: 'opspilot_step_duration_seconds',
  help: 'Duration of pipeline steps in seconds',
  labelNames: ['step_type'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300], // custom buckets
});
register.registerMetric(stepDurationHistogram);

// Gauge for vulnerabilities found
export const vulnerabilitiesGauge = new client.Gauge({
  name: 'opspilot_vulnerabilities_current',
  help: 'Current number of vulnerabilities found in the latest scan',
  labelNames: ['severity', 'scanner'],
});
register.registerMetric(vulnerabilitiesGauge);

// Counter for log messages
export const logCounter = new client.Counter({
  name: 'opspilot_logs_total',
  help: 'Total number of log messages emitted',
  labelNames: ['level'],
});
register.registerMetric(logCounter);
