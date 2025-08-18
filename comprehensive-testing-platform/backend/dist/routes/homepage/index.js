/**
 * 首页模块API路由
 * 遵循统一开发标准的API路由规范
 */
import { Hono } from "hono";
import { HomepageModuleModel } from "../../models/HomepageModuleModel";
import { HomepageConfigModel } from "../../models/HomepageConfigModel";
import { AnalyticsEventModel } from "../../models/AnalyticsEventModel";
const homepageRoutes = new Hono();
// 获取首页配置
homepageRoutes.get("/config", async (c) => {
    try {
        const dbService = c.get("dbService");
        const configModel = new HomepageConfigModel(dbService.env);
        const configs = await configModel.getAllPublicConfigs();
        return c.json({
            success: true,
            data: configs,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error("获取首页配置失败:", error);
        return c.json({
            success: false,
            error: "获取首页配置失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
// 获取测试模块列表
homepageRoutes.get("/modules", async (c) => {
    try {
        const dbService = c.get("dbService");
        const moduleModel = new HomepageModuleModel(dbService.env);
        const modules = await moduleModel.getAllActiveModules();
        return c.json({
            success: true,
            data: modules,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error("获取测试模块列表失败:", error);
        return c.json({
            success: false,
            error: "获取测试模块列表失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
// 根据主题获取测试模块
homepageRoutes.get("/modules/:theme", async (c) => {
    try {
        const theme = c.req.param("theme");
        const dbService = c.get("dbService");
        const moduleModel = new HomepageModuleModel(dbService.env);
        const modules = await moduleModel.getModulesByTheme(theme);
        return c.json({
            success: true,
            data: modules,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error(`获取${c.req.param("theme")}主题测试模块失败:`, error);
        return c.json({
            success: false,
            error: "获取测试模块失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
// 获取首页统计数据
homepageRoutes.get("/stats", async (c) => {
    try {
        const dbService = c.get("dbService");
        // 直接测试数据库查询
        const testQuery = await dbService.db.prepare("SELECT COUNT(*) as count FROM homepage_modules").first();
        console.log("Test query result:", testQuery);
        const moduleModel = new HomepageModuleModel(dbService.env);
        const stats = await moduleModel.getModulesStats();
        return c.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error("获取首页统计数据失败:", error);
        return c.json({
            success: false,
            error: "获取统计数据失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
// 记录用户行为事件
homepageRoutes.post("/analytics", async (c) => {
    try {
        const body = await c.req.json();
        const { eventType, eventData, sessionId, pageUrl, referrer } = body;
        if (!eventType || !pageUrl) {
            return c.json({
                success: false,
                error: "缺少必要参数",
                timestamp: new Date().toISOString(),
                requestId: c.get("requestId") || "",
            }, 400);
        }
        const dbService = c.get("dbService");
        const analyticsModel = new AnalyticsEventModel(dbService.db);
        // 记录事件
        await analyticsModel.create({
            eventType: `homepage_${eventType}`,
            eventData: {
                ...eventData,
                pageUrl,
                referrer,
            },
            sessionId,
            userAgent: c.req.header("User-Agent") || "",
            ipAddress: c.req.header("CF-Connecting-IP") || "",
        });
        return c.json({
            success: true,
            message: "事件记录成功",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error("记录用户行为事件失败:", error);
        return c.json({
            success: false,
            error: "记录事件失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
// 获取特定配置
homepageRoutes.get("/config/:key", async (c) => {
    try {
        const key = c.req.param("key");
        const dbService = c.get("dbService");
        const configModel = new HomepageConfigModel(dbService.db);
        const config = await configModel.getConfigByKey(key);
        if (!config) {
            return c.json({
                success: false,
                error: "配置不存在",
                timestamp: new Date().toISOString(),
                requestId: c.get("requestId") || "",
            }, 404);
        }
        return c.json({
            success: true,
            data: config,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        });
    }
    catch (error) {
        console.error(`获取配置${c.req.param("key")}失败:`, error);
        return c.json({
            success: false,
            error: "获取配置失败",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId") || "",
        }, 500);
    }
});
export { homepageRoutes };
//# sourceMappingURL=index.js.map