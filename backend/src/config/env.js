// runtime config
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/feedants_assignment'),
  CORS_ORIGIN: z.string().default('*'),
  PUBLIC_BASE_URL: z.string().url().optional()
});

const parsed = envSchema.parse(process.env);

export const env = {
  nodeEnv: parsed.NODE_ENV,
  port: parsed.PORT,
  mongoUri: parsed.MONGODB_URI,
  corsOrigin: parsed.CORS_ORIGIN,
  publicBaseUrl: parsed.PUBLIC_BASE_URL ?? `http://localhost:${parsed.PORT}`
};
