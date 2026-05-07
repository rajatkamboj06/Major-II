"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReports = exports.getReport = exports.getReportsByPipeline = void 0;
const Report_1 = __importDefault(require("../models/Report"));
const getReportsByPipeline = async (req, res) => {
    try {
        const reports = await Report_1.default.find({ pipelineId: req.params.pipelineId })
            .sort({ stepIndex: 1 });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching reports' });
    }
};
exports.getReportsByPipeline = getReportsByPipeline;
const getReport = async (req, res) => {
    try {
        const report = await Report_1.default.findOne({
            pipelineId: req.params.pipelineId,
            stepIndex: parseInt(req.params.stepIndex, 10),
        });
        if (report) {
            res.json(report);
        }
        else {
            res.status(404).json({ message: 'Report not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching report' });
    }
};
exports.getReport = getReport;
const getAllReports = async (_req, res) => {
    try {
        const reports = await Report_1.default.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('pipelineId', 'name status githubRepo');
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching reports' });
    }
};
exports.getAllReports = getAllReports;
//# sourceMappingURL=reportController.js.map