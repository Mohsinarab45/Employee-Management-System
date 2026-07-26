import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ems_db';
    console.log(`[Database] Connecting to MongoDB...`);
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB:`, error);
    // Don't crash process completely so app stays resilient
  }
};
