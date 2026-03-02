// src/lib/db.ts
import mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('🍃 MongoDB 连接成功');
  } catch (err) {
    console.error('❌ MongoDB 连接失败:', err);
    process.exit(1);
  }
};