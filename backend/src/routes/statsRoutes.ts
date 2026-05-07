import express from 'express';
import { getDashboardStats } from '../controllers/statsController';

const router = express.Router();

router.get('/', getDashboardStats as any);

export default router;
