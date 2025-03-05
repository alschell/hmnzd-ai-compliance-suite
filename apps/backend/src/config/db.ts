/**
 * Database Configuration
 * Current date: 2025-03-05 13:43:29
 * Current user: alschell
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmnzd-compliance';
    
    const conn = await mongoose.connect(MONGODB_URI);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
