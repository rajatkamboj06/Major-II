import { Request, Response } from 'express';
import Report from '../models/Report';

export const getReportsByPipeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find({ pipelineId: req.params.pipelineId })
      .sort({ stepIndex: 1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};

export const getReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await Report.findOne({
      pipelineId: req.params.pipelineId,
      stepIndex: parseInt(req.params.stepIndex as string, 10),
    });
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching report' });
  }
};

export const getAllReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('pipelineId', 'name status githubRepo');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching reports' });
  }
};
