import express from 'express';
import {
  createPipelineFromPrompt,
  getUserPipelines,
  getPipelineById,
  deletePipeline,
  rerunPipeline,
} from '../controllers/pipelineController';

const router = express.Router();

router.route('/')
  .post(createPipelineFromPrompt as any)
  .get(getUserPipelines as any);

router.route('/:id')
  .get(getPipelineById as any)
  .delete(deletePipeline as any);

router.post('/:id/rerun', rerunPipeline as any);

export default router;
