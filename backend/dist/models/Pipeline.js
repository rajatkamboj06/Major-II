"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const nodeSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true }, // e.g., 'build', 'test', 'deploy'
    data: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
});
const edgeSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
});
const pipelineSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: false },
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
const Pipeline = mongoose_1.default.model('Pipeline', pipelineSchema);
exports.default = Pipeline;
//# sourceMappingURL=Pipeline.js.map