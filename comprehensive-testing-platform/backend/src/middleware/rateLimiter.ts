/**
 * 速率限制中间件
 * 遵循统一开发标准的安全规范
 */

import type { Context, Next } from "hono";
import type { Env } from "../index";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";

export const rateLimiter = (requests: number = 100, windowMs: number = 60000) => {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const ip = c.req.header("CF-Connecting-IP") || 
               c.req.header("X-Forwarded-IP") || 
               "unknown";
    
    const key = `rate_limit:${ip}`;
    const windowSeconds = Math.floor(windowMs / 1000);

    try {
      // 检查KV是否可用
      if (!c.env.KV) {
        // 在开发环境中，KV可能不可用，这是正常的
        if ((c.env as any)['NODE_ENV'] === 'development') {
          // 开发环境不显示警告，直接跳过速率限制
          return next();
        } else {
          // 生产环境才显示警告
          // eslint-disable-next-line no-console
          console.warn("KV not available, skipping rate limiting");
          return next();
        }
      }

      const current = await c.env.KV.get(key);
      const count = current ? parseInt(current) : 0;

      if (count >= requests) {
        throw new ModuleError(
          "Too many requests, please try again later",
          ERROR_CODES.RATE_LIMITED,
          429
        );
      }

      // 增加计数器
      await c.env.KV.put(key, (count + 1).toString(), {
        expirationTtl: windowSeconds,
      });

      await next();
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      
      // KV存储失败时记录日志但不阻塞请求
      // eslint-disable-next-line no-console
      console.warn("Rate limiter KV operation failed:", error);
      await next();
    }
  };
};