// src/mqtt.ts
/**
 * 协议鉴权 (Authentication)：你需要重写 broker.authenticate 钩子，通过 MongoDB 校验设备连接的用户名和密码。
 * WebSocket 支持：package.json 中已经安装了 ws，但尚未在 index.ts 或 mqtt.ts 中初始化。
 * 如果你希望 React 前端能直接通过网页订阅 MQTT 消息，需要开启 WebSocket 监听端口（.env 中已预留 WS_PORT=8888）。
 */
import aedes from 'aedes';
import { createServer } from 'net';
import aedesPersistence from 'aedes-persistence-mongodb';

export const initMQTT = (mongoUri: string) => {
  // 1. 设置持久化，防止掉线数据丢失
  const persistence = aedesPersistence({
    url: mongoUri,
    ttl: {
      // MongoDB 的 expireAfterSeconds 字段要求必须在 32 位有符号整数范围内
      packets: 60 * 60 * 24 * 15,
      subscriptions: 60 * 60 * 24 * 15
    }
  });

  const broker = new aedes({ persistence });
  const server = createServer(broker.handle);

  // 2. 核心：监听设备消息
  broker.on('publish', (packet, client) => {
    if (client) {
      const payload = packet.payload.toString();
      console.log(`📡 [MQTT] 设备 ${client.id} 发送: [${packet.topic}] ${payload}`);
      // 这里未来将调用规则引擎
    }
  });

  broker.on('client', (client) => {
    console.log(`✨ [MQTT] 设备连接: ${client.id}`);
  });

  broker.on('publish', async (packet, client) => {
    if (client) {
      const topic = packet.topic;
      const payload = packet.payload.toString();

      // 1. 尝试解析 JSON 数据
      try {
        const data = JSON.parse(payload);
        console.log(`📡 [数据上报] 来自设备: ${client.id}, 主题: ${topic}, 数据:`, data);

        // 2. 这里后续直接对接你的核心 Service
        // await TelemetryService.saveData(client.id, data);
        // await RuleEngine.process(client.id, data);

      } catch (e) {
        console.log(`⚠️ [解析失败] 设备 ${client.id} 发送了非 JSON 数据`);
      }
    }
  });

  return { broker, server };
};
