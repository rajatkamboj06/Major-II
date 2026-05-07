"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer = null;
const connectDB = async () => {
    try {
        const externalUri = process.env.MONGODB_URI;
        // Try connecting to external MongoDB first
        if (externalUri && externalUri !== 'mongodb://localhost:27017/opspilot') {
            const conn = await mongoose_1.default.connect(externalUri);
            console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
            return;
        }
        // Try external MongoDB
        try {
            const conn = await mongoose_1.default.connect(externalUri || 'mongodb://localhost:27017/opspilot', {
                serverSelectionTimeoutMS: 3000,
            });
            console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
            return;
        }
        catch {
            // Fall back to in-memory MongoDB
            console.log('⚠️  External MongoDB not available, starting in-memory database...');
        }
        // Start in-memory MongoDB
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`📦 In-Memory MongoDB Started: ${conn.connection.host}`);
        console.log('   ℹ️  Data will be lost when server restarts');
    }
    catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map