/**
 * Cloudflare Workers 主入口文件
 * 遵循统一开发标准的API架构
 */
import { Hono } from "hono";
export interface Env {
    DB?: D1Database;
    KV?: KVNamespace;
    BUCKET?: R2Bucket;
    ENVIRONMENT: string;
    [key: string]: any;
}
declare const app: Hono<{
    Bindings: Env;
}, {}, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map