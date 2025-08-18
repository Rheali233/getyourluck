/**
 * 统一请求验证中间件
 * 遵循统一开发标准的请求验证规范
 */
import type { Context, Next } from "hono";
export declare const requestValidator: (c: Context, next: Next) => Promise<void>;
//# sourceMappingURL=requestValidator.d.ts.map