// src\lib\config.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  MONGO_URI: z.string().url(),
  MQTT_PORT: z.string().default('1883').transform(Number),
});

export const config = envSchema.parse(process.env);
