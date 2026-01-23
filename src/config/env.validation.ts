import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().min(1000).default(3000), 
  
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().default(3306),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_URL: z.string().url(), 
  JWT_SECRET: z.string().min(1),  
  THROTTLE_TTL: z.coerce.number().default(60000), 
  THROTTLE_LIMIT: z.coerce.number().default(10),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }

  return result.data;
}