import express from 'express';
import { renderLiveDeployment } from '../controllers/deploymentController';

const router = express.Router();

// This returns the actual HTML page, not JSON. It's meant to be opened in a browser tab.
router.get('/:id', renderLiveDeployment as any);

export default router;
