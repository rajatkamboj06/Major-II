"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rerunPipeline = exports.deletePipeline = exports.getPipelineById = exports.getUserPipelines = exports.createPipelineFromPrompt = void 0;
const Pipeline_1 = __importDefault(require("../models/Pipeline"));
const ExecutionLog_1 = __importDefault(require("../models/ExecutionLog"));
const aiService_1 = require("../services/aiService");
const executionService_1 = require("../services/executionService");
const createPipelineFromPrompt = async (req, res) => {
    try {
        const { prompt, name, githubRepo, githubBranch } = req.body;
        if (!prompt || !name) {
            res.status(400).json({ message: 'Name and prompt are required' });
            return;
        }
        // Call the AI Service
        const aiResponse = await (0, aiService_1.generatePipelineFromPrompt)(prompt);
        // Save to Database
        const pipeline = await Pipeline_1.default.create({
            userId: null,
            name,
            prompt,
            githubRepo: githubRepo || '',
            githubBranch: githubBranch || 'main',
            nodes: aiResponse.nodes || [],
            edges: aiResponse.edges || [],
            status: 'draft',
        });
        res.status(201).json(pipeline);
        // Trigger Execution asynchronously
        (0, executionService_1.executePipeline)(pipeline._id.toString());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error generating pipeline' });
    }
};
exports.createPipelineFromPrompt = createPipelineFromPrompt;
const getUserPipelines = async (_req, res) => {
    try {
        const pipelines = await Pipeline_1.default.find().sort({ createdAt: -1 });
        res.json(pipelines);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching pipelines' });
    }
};
exports.getUserPipelines = getUserPipelines;
const getPipelineById = async (req, res) => {
    try {
        const pipeline = await Pipeline_1.default.findById(req.params.id);
        if (pipeline) {
            res.json(pipeline);
        }
        else {
            res.status(404).json({ message: 'Pipeline not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching pipeline' });
    }
};
exports.getPipelineById = getPipelineById;
const deletePipeline = async (req, res) => {
    try {
        const pipeline = await Pipeline_1.default.findById(req.params.id);
        if (!pipeline) {
            res.status(404).json({ message: 'Pipeline not found' });
            return;
        }
        // Don't allow deleting running pipelines
        if (pipeline.status === 'running') {
            res.status(400).json({ message: 'Cannot delete a running pipeline' });
            return;
        }
        // Delete associated logs
        await ExecutionLog_1.default.deleteMany({ pipelineId: pipeline._id });
        await Pipeline_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pipeline deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error deleting pipeline' });
    }
};
exports.deletePipeline = deletePipeline;
const rerunPipeline = async (req, res) => {
    try {
        const pipeline = await Pipeline_1.default.findById(req.params.id);
        if (!pipeline) {
            res.status(404).json({ message: 'Pipeline not found' });
            return;
        }
        if (pipeline.status === 'running') {
            res.status(400).json({ message: 'Pipeline is already running' });
            return;
        }
        // Clear old logs
        await ExecutionLog_1.default.deleteMany({ pipelineId: pipeline._id });
        // Reset status
        pipeline.status = 'draft';
        await pipeline.save();
        res.json(pipeline);
        // Trigger execution
        (0, executionService_1.executePipeline)(pipeline._id.toString());
    }
    catch (error) {
        res.status(500).json({ message: 'Server error re-running pipeline' });
    }
};
exports.rerunPipeline = rerunPipeline;
//# sourceMappingURL=pipelineController.js.map