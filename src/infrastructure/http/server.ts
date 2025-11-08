import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from '@/config/readers/appConfig.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';
import { mongoClient } from '@/infrastructure/database/mongo/mongoClient.js';
import { indexRouter } from './routes/index.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { morganMiddleware } from '@/shared/observability/logger/HTTPLogger.js';

class Server {
    private static instance: Server;
    private readonly app: Express;

    private constructor() {
        this.app = express();
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public async init(): Promise<void> {
        try {
            await this.initDependencies();
            this.handleProcessSignals();
            this.handleMiddlewares();
            this.handleRoutes();
            this.handleErrors();
            this.listen();
        } catch (error) {
            appLogger.error('Server', `Initialization failed: ${(error as Error).message}`);
            throw error;
        }
    }

    private async initDependencies(): Promise<void> {
       
            await mongoClient.connect();
            appLogger.info('Server', 'Database connected successfully');
        
    }

    private handleMiddlewares(): void {
        this.app.use(helmet());

        this.app.use(cors({
            origin: appConfig.app.allowedOrigin,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        }));

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(morganMiddleware);
    }

    private handleRoutes(): void {
        this.app.use('/api', indexRouter);
    }

    private handleErrors(): void {
        this.app.use(notFoundHandler);
        this.app.use(errorHandler);
    }

    private handleProcessSignals(): void {
        process.on('SIGTERM', async () => {
            appLogger.info('Process', 'SIGTERM received. Shutting down gracefully.');
            await mongoClient.disconnect();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            appLogger.info('Process', 'SIGINT (Ctrl+C) received. Shutting down gracefully.');
            await mongoClient.disconnect();
            process.exit(0);
        });

        process.on('uncaughtException', (err: Error) => {
            appLogger.error('Process', `Uncaught exception: ${err.message}`);
            process.exit(1);
        });

        process.on('unhandledRejection', (reason: any) => {
            appLogger.error('Process', `Unhandled rejection: ${reason}`);
            process.exit(1);
        });
    }

    private listen(): void {
        this.app.listen(appConfig.app.port, () => {
            appLogger.info('Server', `🚀 Template Store API is running on port ${appConfig.app.port}`);
            appLogger.info('Server', `Environment: ${appConfig.app.nodeEnv}`);
            appLogger.info('Server', `Health check: http://localhost:${appConfig.app.port}/api/health`);
        });
    }

    public getApp(): Express {
        return this.app;
    }
}

export const server = Server.getInstance();
