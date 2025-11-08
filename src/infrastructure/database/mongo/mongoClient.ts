import mongoose from 'mongoose';
import { appConfig } from '@/config/readers/appConfig.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';

class MongoClient {
  private static instance: MongoClient;

  private constructor() {}

  public static getInstance(): MongoClient {
    if (!MongoClient.instance) {
      MongoClient.instance = new MongoClient();
    }
    return MongoClient.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(appConfig.db.mongoUri);
      appLogger.info('MongoDB', 'Connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err: any) => {
        appLogger.error('MongoDB', `Connection error: ${err.message}`);
      });

      mongoose.connection.on('disconnected', () => {
        appLogger.warn('MongoDB', 'Disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        appLogger.info('MongoDB', 'Reconnected');
      });

    } catch (error) {
      appLogger.error('MongoDB', `Connection failed: ${(error as Error).message}`);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      appLogger.info('MongoDB', 'Disconnected successfully');
    } catch (error) {
      appLogger.error('MongoDB', `Disconnection failed: ${(error as Error).message}`);
      throw error;
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

export const mongoClient = MongoClient.getInstance();
