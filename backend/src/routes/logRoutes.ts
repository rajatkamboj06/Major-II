import express from 'express';
import { getLogs, getLogsByPipeline } from '../controllers/logController';

const router = express.Router();

router.get('/', getLogs as any);
router.get('/pipeline/:pipelineId', getLogsByPipeline as any);

export default router;
