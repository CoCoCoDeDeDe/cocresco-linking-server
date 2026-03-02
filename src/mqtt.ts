// src/mqtt.ts
import aedes from 'aedes';
import { createServer } from 'net';
import aedesPersistence from 'aedes-persistence-mongodb';

export const initMQTT = (mongoUri: string) => {
  // 1. 设置持久化，防止掉线数据丢失
  const persistence = aedesPersistence({
    url: mongoUri,
    ttl: {
      packets: 1000 * 60 * 60 * 24, // 24小时
      subscriptions: 1000 * 60 * 60 * 24 * 30 // 30天
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

  return { broker, server };
};