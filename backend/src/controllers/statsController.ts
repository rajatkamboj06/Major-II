import { Request, Response } from 'express';
import Pipeline from '../models/Pipeline';
import ExecutionLog from '../models/ExecutionLog';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalPipelines = await Pipeline.countDocuments();
    const successCount = await Pipeline.countDocuments({ status: 'success' });
    const failedCount = await Pipeline.countDocuments({ status: 'failed' });
    const runningCount = await Pipeline.countDocuments({ status: 'running' });
    const draftCount = await Pipeline.countDocuments({ status: 'draft' });

    // Count security-related steps (sonarqube_scan, trivy_scan)
    const securityScans = await ExecutionLog.countDocuments({
      stepType: { $in: ['sonarqube_scan', 'trivy_scan'] },
      level: 'success',
    });

    const successRate = totalPipelines > 0 
      ? Math.round((successCount / totalPipelines) * 100) 
      : 0;

    // Get recent pipelines
    const recentPipelines = await Pipeline.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name status prompt createdAt');

    // --- New Metrics for Graphs ---
    
    // 1. History (Executions per day for last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // MongoDB aggregation to group pipelines by day
    const historyData = await Pipeline.aggregate([
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
    const logDistribution = await ExecutionLog.aggregate([
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const logs = { info: 0, warn: 0, error: 0, success: 0 };
    logDistribution.forEach(d => {
      if (logs[d._id as keyof typeof logs] !== undefined) {
        logs[d._id as keyof typeof logs] = d.count;
      }
    });

    // 3. Step execution times
    const stepTimesData = await ExecutionLog.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
