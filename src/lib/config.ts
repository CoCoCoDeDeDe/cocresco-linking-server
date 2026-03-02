// src/lib/config.ts
import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // 基础服务配置
  PORT: z.string().default('3000').transform(Number),
  MONGO_URI: z.string().url(),
  
  // MQTT 协议配置
  MQTT_PORT: z.string().default('1883').transform(Number),
  WS_PORT: z.string().default('8888').transform(Number), // 预留给 WebSocket 联调
  
  // 运行环境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// 解析并导出配置对象
export const config = envSchema.parse(process.env);

// 导出类型方便其他模块引用提示
export type Config = z.infer<typeof envSchema>;