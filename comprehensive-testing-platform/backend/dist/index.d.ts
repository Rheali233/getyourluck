/**
 * Cloudflare Workers 主入口文件
 * 遵循统一开发标准的API架构
 */
import { Hono } from "hono";
import { DatabaseService } from "./services/DatabaseService";
export interface Env {
    DB: D1Database;
    KV: KVNamespace;
    BUCKET: R2Bucket;
    ENVIRONMENT: string;
}
export interface AppContext {
    Bindings: Env;
    Variables: {
        dbService: DatabaseService;
        requestId: string;
    };
}
declare const app: Hono<AppContext, {}, "/">;
export default app;
//# sourceMappingURL=index.d.ts.map