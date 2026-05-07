import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import pipelineRoutes from './routes/pipelineRoutes';
import logRoutes from './routes/logRoutes';
import statsRoutes from './routes/statsRoutes';
import reportRoutes from './routes/reportRoutes';
import deploymentRoutes from './routes/deploymentRoutes';
import { register } from './utils/metrics';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io for Real-Time Logs
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pipelines', pipelineRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportRoutes);

// Static hosting for deployed GitHub repositories
app.use('/live', express.static(path.join(__dirname, '../deployments')));

// Basic Route
app.get('/', (req, res) => {
  res.send('OpsPilot API is Running');
});

// Metrics Route
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

// Socket.io connection Event
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join a pipeline-specific room for targeted updates
  socket.on('pipeline:join', (pipelineId: string) => {
    socket.join(`pipeline:${pipelineId}`);
    console.log(`  → Client ${socket.id} joined room pipeline:${pipelineId}`);
  });

  // Leave a pipeline room
  socket.on('pipeline:leave', (pipelineId: string) => {
    socket.leave(`pipeline:${pipelineId}`);
    console.log(`  ← Client ${socket.id} left room pipeline:${pipelineId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 OpsPilot Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for real-time connections`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

export { io };
