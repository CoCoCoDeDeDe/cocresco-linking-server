// src/index.ts
import { serve } from '@hono/node-server';
import mongoose from 'mongoose';
import app from './app';
import { initMQTT } from './mqtt';
import { connectDB } from './lib/db';
import { config } from './lib/config'; // 引入验证后的配置

async function bootstrap() {
  // 1. 连接数据库
  await connectDB(config.MONGO_URI);

  // 2. 启动 MQTT Broker
  const { server: mqttServer, broker } = initMQTT(config.MONGO_URI);
  
  mqttServer.listen(config.MQTT_PORT, () => {
    console.log(`🚀 MQTT Broker 运行在端口 ${config.MQTT_PORT}`);
  });

  // 3. 启动 Hono HTTP 服务
  console.log(`🌐 Web API 运行在端口 ${config.PORT}`);
  const httpServer = serve({
    fetch: app.fetch,
    port: config.PORT,
  });

  // 4. 优雅停机处理 (Graceful Shutdown)
  const handleShutdown = async (signal: string) => {
    console.log(`\n收到 ${signal}，正在关闭服务...`);
    
    // 关闭 MQTT Broker
    broker.close(() => {
      console.log('📡 MQTT Broker 已关闭');
    });

    // 关闭 HTTP 服务
    httpServer.close();
    
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('🍃 MongoDB 连接已安全断开');
    
    process.exit(0);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

bootstrap();
