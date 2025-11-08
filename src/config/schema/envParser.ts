import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform((val: string) => parseInt(val, 10)),
  
  MONGO_URI: z.string(),
  
  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  
  CLIENT_URL: z.string(),
  
  SESSION_SECRET: z.string(),
  
  ALLOWED_ORIGIN: z.string(),
});