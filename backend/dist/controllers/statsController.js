"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Pipeline_1 = __importDefault(require("../models/Pipeline"));
const ExecutionLog_1 = __importDefault(require("../models/ExecutionLog"));
const getDashboardStats = async (_req, res) => {
    try {
        const totalPipelines = await Pipeline_1.default.countDocuments();
        const successCount = await Pipeline_1.default.countDocuments({ status: 'success' });
        const failedCount = await Pipeline_1.default.countDocuments({ status: 'failed' });
        const runningCount = await Pipeline_1.default.countDocuments({ status: 'running' });
        const draftCount = await Pipeline_1.default.countDocuments({ status: 'draft' });
        // Count security-related steps (sonarqube_scan, trivy_scan)
        const securityScans = await ExecutionLog_1.default.countDocuments({
            stepType: { $in: ['sonarqube_scan', 'trivy_scan'] },
            level: 'success',
        });
        const successRate = totalPipelines > 0
            ? Math.round((successCount / totalPipelines) * 100)
            : 0;
        // Get recent pipelines
        const recentPipelines = await Pipeline_1.default.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name status prompt createdAt');
        // --- New Metrics for Graphs ---
        // 1. History (Executions per day for last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        // MongoDB aggregation to group pipelines by day
        const historyData = await Pipeline_1.default.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    success: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
                    failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
                    total: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        const history = historyData.map(d => ({
            date: d._id,
            success: d.success,
            failed: d.failed,
            total: d.total
        }));
        // 2. Logs distribution
        const logDistribution = await ExecutionLog_1.default.aggregate([
            {
                $group: {
                    _id: "$level",
                    count: { $sum: 1 }
                }
            }
        ]);
        const logs = { info: 0, warn: 0, error: 0, success: 0 };
        logDistribution.forEach(d => {
            if (logs[d._id] !== undefined) {
                logs[d._id] = d.count;
            }
        });
        // 3. Step execution times
        const stepTimesData = await ExecutionLog_1.default.aggregate([
            { $match: { duration: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: "$stepType",
                    avgDuration: { $avg: "$duration" }
                }
            },
            { $sort: { avgDuration: -1 } },
            { $limit: 10 }
        ]);
        const stepTimes = stepTimesData.map(d => ({
            name: d._id,
            time: Math.round(d.avgDuration / 100) / 10 // time in seconds, rounded to 1 decimal
        }));
        res.json({
            totalPipelines,
            successCount,
            failedCount,
            runningCount,
            draftCount,
            securityScans,
            successRate,
            recentPipelines,
            history,
            logs,
            stepTimes
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=statsController.js.map