import mongoose from 'mongoose';

const executionLogSchema = new mongoose.Schema({
  pipelineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pipeline', required: true },
  stepIndex: { type: Number, required: true },
  stepType: { type: String, required: true },
  stepLabel: { type: String, required: true },
  message: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['info', 'warn', 'error', 'success'],
    default: 'info'
  },
  duration: { type: Number }, // ms taken for step
}, { timestamps: true });

executionLogSchema.index({ pipelineId: 1, createdAt: -1 });

const ExecutionLog = mongoose.model('ExecutionLog', executionLogSchema);
export default ExecutionLog;
