import { Request, Response } from 'express';
import ExecutionLog from '../models/ExecutionLog';

export const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pipelineId, limit = '100' } = req.query;
    
    const filter: any = {};
    if (pipelineId) {
      filter.pipelineId = pipelineId;
    }

    const logs = await ExecutionLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string, 10))
      .populate('pipelineId', 'name status');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching logs' });
  }
};

export const getLogsByPipeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await ExecutionLog.find({ pipelineId: req.params.pipelineId })
      .sort({ createdAt: 1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pipeline logs' });
  }
};
