import { z } from 'zod';
import {config} from "dotenv"
import { envSchema } from '../schema/envParser.js';

// Load environment file based on NODE_ENV (only for development/local)
if (process.env.NODE_ENV !== 'production') {
    config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
}

export class EnvValidator {
    private static instance: EnvValidator;
    private readonly env: z.infer<typeof envSchema>;

    private constructor() {
        this.env = this.validator();
    }

    public static getInstance = (): EnvValidator => {
        if (!EnvValidator.instance) {
            EnvValidator.instance = new EnvValidator();
        }
        return EnvValidator.instance;
    }
    private validator = () => {
        const valid = envSchema.safeParse(process.env)
        if (!valid.data) {
            process.exit(1)
        }
        return valid.data;
    }
    public init = (): z.infer<typeof envSchema> => {
        return this.env;
    }
}
export const env = EnvValidator.getInstance().init()