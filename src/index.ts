// src\index.ts
// src/index.ts
import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './app';
import { initMQTT } from './mqtt';
import { connectDB } from './lib/db';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/iot';
const HTTP_PORT = Number(process.env.PORT) || 3000;
const MQTT_PORT = Number(process.env.MQTT_PORT) || 1883;

async function bootstrap() {
  // 1. 连接数据库
  await connectDB(MONGO_URI);

  // 2. 启动 MQTT Broker
  const { server: mqttServer } = initMQTT(MONGO_URI);
  mqttServer.listen(MQTT_PORT, () => {
    console.log(`🚀 MQTT Broker 运行在端口 ${MQTT_PORT}`);
  });

  // 3. 启动 Hono HTTP 服务
  console.log(`🌐 Web API 运行在端口 ${HTTP_PORT}`);
  serve({
    fetch: app.fetch,
    port: HTTP_PORT,
  });
}

bootstrap();

// src/index.ts 启动了多个服务（Hono, Aedes, MongoDB）。如果直接杀掉进程，可能会导致数据库连接未关闭或 MQTT 离线消息处理不完整。