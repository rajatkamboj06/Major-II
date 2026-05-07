"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const executionLogSchema = new mongoose_1.default.Schema({
    pipelineId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Pipeline', required: true },
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
const ExecutionLog = mongoose_1.default.model('ExecutionLog', executionLogSchema);
exports.default = ExecutionLog;
//# sourceMappingURL=ExecutionLog.js.map