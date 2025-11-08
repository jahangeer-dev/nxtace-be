import Redis from 'ioredis';
import { appConfig } from '../../../config/readers/appConfig';

class RedisClient {
    private client: Redis;
    private static instance: RedisClient;

    private constructor() {
        this.client = new Redis(
            appConfig.db.redisPort,
            appConfig.db.redisHost,
            {
                password: appConfig.db.redisPassword,
                enableReadyCheck: true,
                maxRetriesPerRequest: 3,
            });

        this.client.on('connect', () => {
            console.log('Redis connected');
        });

        this.client.on('error', (err: Error) => {
            console.error('Redis error:', err);
        });
    }

    static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setex(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async scan(cursor: string, pattern: string, count: number = 10): Promise<[string, string[]]> {
        const result = await this.client.scan(cursor, 'MATCH', pattern, 'COUNT', count);
        return result;
    }

    async disconnect(): Promise<void> {
        await this.client.quit();
    }
}

export const redisClient = RedisClient.getInstance();
