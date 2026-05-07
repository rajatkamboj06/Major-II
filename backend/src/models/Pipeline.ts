import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'build', 'test', 'deploy'
  data: { type: mongoose.Schema.Types.Mixed, required: true },
});

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const pipelineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: { type: String, required: true },
  prompt: { type: String, required: true }, // The original natural language prompt
  githubRepo: { type: String, default: '' }, // GitHub repository URL
  githubBranch: { type: String, default: 'main' }, // Branch to checkout
  nodes: [nodeSchema], // The generated pipeline stages
  edges: [edgeSchema], // Connections between stages
  status: { 
    type: String, 
    enum: ['draft', 'running', 'success', 'failed'],
    default: 'draft'
  },
}, { timestamps: true });

const Pipeline = mongoose.model('Pipeline', pipelineSchema);
export default Pipeline;
