import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

const connectDB = async () => {
  try {
    const externalUri = process.env.MONGODB_URI;
    
    // Try connecting to external MongoDB first
    if (externalUri && externalUri !== 'mongodb://localhost:27017/opspilot') {
      const conn = await mongoose.connect(externalUri);
      console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    // Try external MongoDB
    try {
      const conn = await mongoose.connect(externalUri || 'mongodb://localhost:27017/opspilot', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch {
      // Fall back to in-memory MongoDB
      console.log('⚠️  External MongoDB not available, starting in-memory database...');
    }

    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const conn = await mongoose.connect(mongoUri);
    console.log(`📦 In-Memory MongoDB Started: ${conn.connection.host}`);
    console.log('   ℹ️  Data will be lost when server restarts');
  } catch (error: any) {
    console.error(`❌ Database Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
