/**
 * 首页模块API路由
 * 遵循统一开发标准的API路由规范
 */

import { Hono } from "hono";
import { HomepageModuleModel } from "../../models/HomepageModuleModel";
import { HomepageConfigModel } from "../../models/HomepageConfigModel";
import { AnalyticsEventModel } from "../../models/AnalyticsEventModel";
import type { AppContext } from "../../types/env";
import type { APIResponse } from "../../../../shared/types/apiResponse";

const homepageRoutes = new Hono<AppContext>();

// 首页模块根路径
homepageRoutes.get("/", async (c) => {
  const response: APIResponse = {
    success: true,
    data: {
              name: "Homepage Module",
      description: "Provides homepage configuration and test module management functionality",
      endpoints: {
        config: "/config",
        modules: "/modules",
        modulesByTheme: "/modules/:theme",
        stats: "/stats"
      },
      version: "1.0.0"
    },
    message: "Homepage module information",
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId") || "",
  };

  return c.json(response);
});

// 获取首页配置
homepageRoutes.get("/config", async (c) => {
  try {
    const configModel = new HomepageConfigModel(c.env);
    
    const configs = await configModel.getAllPublicConfigs();
    
    return c.json({
      success: true,
      data: configs,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    });
  } catch (error) {
    console.error("Failed to get homepage configuration:", error);
    return c.json({
      success: false,
      error: "Failed to get homepage configuration",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    }, 500);
  }
});

// 获取测试模块列表
homepageRoutes.get("/modules", async (c) => {
  try {
    const moduleModel = new HomepageModuleModel(c.env);
    
    const modules = await moduleModel.getAllActiveModules();
    // short-term caching headers
    c.header('Cache-Control', 'public, max-age=60, s-maxage=60');

    return c.json({
      success: true,
      data: modules,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    });
  } catch (error) {
    console.error("Failed to get test module list:", error);
    return c.json({
      success: false,
      error: "Failed to get test module list",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    }, 500);
  }
});

// 根据主题获取测试模块
homepageRoutes.get("/modules/:theme", async (c) => {
  try {
    const theme = c.req.param("theme");
    const moduleModel = new HomepageModuleModel(c.env);
    
    const modules = await moduleModel.getModulesByTheme(theme);
    
    return c.json({
      success: true,
      data: modules,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    });
  } catch (error) {
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
    
    // Test database connection
    await dbService.db.prepare("SELECT COUNT(*) as count FROM homepage_modules").first();
    
    const moduleModel = new HomepageModuleModel(c.env);
    
    const stats = await moduleModel.getModulesStats();
    
    return c.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId") || "",
    });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
