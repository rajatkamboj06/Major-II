import mongoose from 'mongoose';

const findingSchema = new mongoose.Schema({
  id: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String },
  line: { type: Number },
  package: { type: String },
  installedVersion: { type: String },
  fixedVersion: { type: String },
  cveId: { type: String },
  rule: { type: String },
  status: { type: String, enum: ['open', 'fixed', 'ignored'], default: 'open' },
}, { _id: false });

const reportSchema = new mongoose.Schema({
  pipelineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pipeline', required: true },
  stepIndex: { type: Number, required: true },
  stepType: { type: String, required: true },
  reportType: {
    type: String,
    enum: ['sonarqube', 'snyk', 'trivy', 'docker_build', 'npm_audit', 'test_coverage', 'deployment'],
    required: true,
  },
  summary: {
    status: { type: String, enum: ['passed', 'failed', 'warning'], required: true },
    totalFindings: { type: Number, default: 0 },
    critical: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    info: { type: Number, default: 0 },
  },
  metrics: { type: mongoose.Schema.Types.Mixed },
  findings: [findingSchema],
  duration: { type: Number },
}, { timestamps: true });

reportSchema.index({ pipelineId: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
