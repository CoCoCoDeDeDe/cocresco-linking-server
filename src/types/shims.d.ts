// src/types/shims.d.ts

// 告诉 TypeScript：aedes-persistence-mongodb 这个模块我心里有数，请把它当做 'any' 类型处理
declare module 'aedes-persistence-mongodb';

// 如果后续 websocket-stream 还有类似报错，也可以一并写在这里
declare module 'websocket-stream';