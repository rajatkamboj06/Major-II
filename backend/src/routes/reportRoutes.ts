import express from 'express';
import { getReportsByPipeline, getReport, getAllReports } from '../controllers/reportController';

const router = express.Router();

router.get('/', getAllReports as any);
router.get('/:pipelineId', getReportsByPipeline as any);
router.get('/:pipelineId/:stepIndex', getReport as any);

export default router;
