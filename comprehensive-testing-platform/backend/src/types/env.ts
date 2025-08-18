import { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types';

// 环境变量接口
export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  STORAGE: R2Bucket;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  ENABLE_ANALYTICS: string;
  ENABLE_CACHE: string;
  CACHE_TTL: string;
  MAX_REQUEST_SIZE: string;
  RATE_LIMIT_WINDOW: string;
  RATE_LIMIT_MAX: string;
}

// 应用上下文接口 - 使用Hono的Context类型
export interface AppContext {
  Bindings: Env;
  Variables: {
    requestId: string;
    dbService: any;
  };
}

// 请求上下文接口
export interface RequestContext {
  env: Env;
  requestId: string;
  dbService: any;
  cacheService: any;
}
