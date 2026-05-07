"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogsByPipeline = exports.getLogs = void 0;
const ExecutionLog_1 = __importDefault(require("../models/ExecutionLog"));
const getLogs = async (req, res) => {
    try {
        const { pipelineId, limit = '100' } = req.query;
        const filter = {};
        if (pipelineId) {
            filter.pipelineId = pipelineId;
        }
        const logs = await ExecutionLog_1.default.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit, 10))
            .populate('pipelineId', 'name status');
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching logs' });
    }
};
exports.getLogs = getLogs;
const getLogsByPipeline = async (req, res) => {
    try {
        const logs = await ExecutionLog_1.default.find({ pipelineId: req.params.pipelineId })
            .sort({ createdAt: 1 });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching pipeline logs' });
    }
};
exports.getLogsByPipeline = getLogsByPipeline;
//# sourceMappingURL=logController.js.map