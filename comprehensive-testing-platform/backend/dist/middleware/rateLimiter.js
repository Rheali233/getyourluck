/**
 * 速率限制中间件
 * 遵循统一开发标准的安全规范
 */
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
export const rateLimiter = (requests, windowMs) => {
    return async (c, next) => {
        const ip = c.req.header("CF-Connecting-IP") ||
            c.req.header("X-Forwarded-For") ||
            "unknown";
        const key = `rate_limit:${ip}`;
        const windowSeconds = Math.floor(windowMs / 1000);
        try {
            const current = await c.env.KV.get(key);
            const count = current ? parseInt(current) : 0;
            if (count >= requests) {
                throw new ModuleError("Too many requests, please try again later", ERROR_CODES.RATE_LIMITED, 429);
            }
            // 增加计数器
            await c.env.KV.put(key, (count + 1).toString(), {
                expirationTtl: windowSeconds,
            });
            await next();
        }
        catch (error) {
            if (error instanceof ModuleError) {
                throw error;
            }
            // KV存储失败时记录日志但不阻塞请求
            console.warn("Rate limiter KV operation failed:", error);
            await next();
        }
    };
};
//# sourceMappingURL=rateLimiter.js.map