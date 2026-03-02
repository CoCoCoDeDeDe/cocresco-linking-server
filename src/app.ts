// src\app.ts
// src/app.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// 中间件
app.use('*', logger());
app.use('*', cors());

// 基础路由
const routes = app.basePath('/api').get('/health', (c) => {
  return c.json({ status: 'ok', time: new Date().toISOString() });
});

// 导出类型供前端 React 使用
export type AppType = typeof routes;
export default app;
