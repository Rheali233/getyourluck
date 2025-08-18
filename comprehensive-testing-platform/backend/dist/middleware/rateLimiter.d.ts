/**
 * 速率限制中间件
 * 遵循统一开发标准的安全规范
 */
import type { Context, Next } from "hono";
export declare const rateLimiter: (requests: number, windowMs: number) => (c: Context, next: Next) => Promise<void>;
//# sourceMappingURL=rateLimiter.d.ts.map