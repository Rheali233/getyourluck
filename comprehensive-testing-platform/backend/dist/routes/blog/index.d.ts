/**
 * 博客相关路由
 * 遵循统一开发标准的API路由规范
 */
import { Hono } from "hono";
import type { Env } from "../../index";
declare const blogRoutes: Hono<{
    Bindings: Env;
}, {}, "/">;
export { blogRoutes };
//# sourceMappingURL=index.d.ts.map