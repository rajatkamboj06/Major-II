"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const pipelineRoutes_1 = __importDefault(require("./routes/pipelineRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const statsRoutes_1 = __importDefault(require("./routes/statsRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const metrics_1 = require("./utils/metrics");
dotenv_1.default.config();
// Connect to MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Socket.io for Real-Time Logs
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/pipelines', pipelineRoutes_1.default);
app.use('/api/logs', logRoutes_1.default);
app.use('/api/stats', statsRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
// Static hosting for deployed GitHub repositories
app.use('/live', express_1.default.static(path_1.default.join(__dirname, '../deployments')));
// Basic Route
app.get('/', (req, res) => {
    res.send('OpsPilot API is Running');
});
// Metrics Route
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics_1.register.contentType);
    res.send(await metrics_1.register.metrics());
});
// Socket.io connection Event
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    // Join a pipeline-specific room for targeted updates
    socket.on('pipeline:join', (pipelineId) => {
        socket.join(`pipeline:${pipelineId}`);
        console.log(`  → Client ${socket.id} joined room pipeline:${pipelineId}`);
    });
    // Leave a pipeline room
    socket.on('pipeline:leave', (pipelineId) => {
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
//# sourceMappingURL=index.js.map