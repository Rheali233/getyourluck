/**
 * Cookies管理API路由
 * 遵循统一开发标准的GDPR合规Cookies管理
 */

import { Hono } from "hono";
import { UserPreferencesModel } from "../../models/UserPreferencesModel";
import { AnalyticsEventModel } from "../../models/AnalyticsEventModel";
import type { AppContext } from "../../index";

const cookiesRoutes = new Hono<AppContext>();

// 获取Cookies同意状态
cookiesRoutes.get("/consent/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);

    const preferences = await preferencesModel.getPreferencesBySessionId(sessionId);

    if (!preferences) {
      return c.json({
        success: true,
        data: {
          cookiesConsent: false,
          analyticsConsent: false,
          marketingConsent: false,
          hasPreferences: false,
        },
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      });
    }

    return c.json({
      success: true,
      data: {
        cookiesConsent: preferences.cookiesConsent,
        analyticsConsent: preferences.analyticsConsent,
        marketingConsent: preferences.marketingConsent,
        hasPreferences: true,
        language: preferences.language,
        theme: preferences.theme,
      },
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取Cookies同意状态失败:", error);
    return c.json({
      success: false,
      error: "获取Cookies同意状态失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 更新Cookies同意状态
cookiesRoutes.post("/consent", async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, cookiesConsent, analyticsConsent, marketingConsent } = body;

    if (!sessionId || typeof cookiesConsent !== 'boolean') {
      return c.json({
        success: false,
        error: "缺少必要参数",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      }, 400);
    }

    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);

    // 更新同意状态
    await preferencesModel.updateCookiesConsent(sessionId, {
      sessionId,
      cookiesConsent,
      analyticsConsent: analyticsConsent || false,
      marketingConsent: marketingConsent || false,
      timestamp: new Date(),
    });

    // 记录同意事件
    await analyticsModel.createEvent({
      eventType: "cookies_consent_updated",
      eventData: JSON.stringify({
        sessionId,
        cookiesConsent,
        analyticsConsent: analyticsConsent || false,
        marketingConsent: marketingConsent || false,
      }),
      pageUrl: c.req.url,
      userAgent: c.req.header("User-Agent"),
      ipAddress: c.req.header("CF-Connecting-IP"),
    });

    return c.json({
      success: true,
      message: "Cookies同意状态更新成功",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("更新Cookies同意状态失败:", error);
    return c.json({
      success: false,
      error: "更新Cookies同意状态失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 获取用户偏好设置
cookiesRoutes.get("/preferences/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);

    const preferences = await preferencesModel.getPreferencesBySessionId(sessionId);

    if (!preferences) {
      return c.json({
        success: false,
        error: "用户偏好设置不存在",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      }, 404);
    }

    return c.json({
      success: true,
      data: preferences,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取用户偏好设置失败:", error);
    return c.json({
      success: false,
      error: "获取用户偏好设置失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 更新用户偏好设置
cookiesRoutes.put("/preferences/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const body = await c.req.json();
    const { language, theme, notificationEnabled, searchHistoryEnabled, personalizedContent } = body;

    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);

    // 获取现有偏好设置
    const existingPreferences = await preferencesModel.getPreferencesBySessionId(sessionId);
    
    if (!existingPreferences) {
      return c.json({
        success: false,
        error: "用户偏好设置不存在",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      }, 404);
    }

    // 更新偏好设置
    const updatedPreferences = {
      ...existingPreferences,
      language: language || existingPreferences.language,
      theme: theme || existingPreferences.theme,
      notificationEnabled: notificationEnabled !== undefined ? notificationEnabled : existingPreferences.notificationEnabled,
      searchHistoryEnabled: searchHistoryEnabled !== undefined ? searchHistoryEnabled : existingPreferences.searchHistoryEnabled,
      personalizedContent: personalizedContent !== undefined ? personalizedContent : existingPreferences.personalizedContent,
    };

    await preferencesModel.upsertPreferences(updatedPreferences);

    return c.json({
      success: true,
      message: "用户偏好设置更新成功",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("更新用户偏好设置失败:", error);
    return c.json({
      success: false,
      error: "更新用户偏好设置失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 获取Cookies统计信息
cookiesRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);

    const stats = await preferencesModel.getCookiesConsentStats();

    return c.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取Cookies统计信息失败:", error);
    return c.json({
      success: false,
      error: "获取Cookies统计信息失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 清理过期的用户偏好设置
cookiesRoutes.post("/cleanup", async (c) => {
  try {
    const body = await c.req.json();
    const { daysOld = 365 } = body;

    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);

    const deletedCount = await preferencesModel.cleanupExpiredPreferences(daysOld);

    return c.json({
      success: true,
      data: {
        deletedCount,
        message: `已清理${daysOld}天前的过期偏好设置`,
      },
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("清理过期用户偏好设置失败:", error);
    return c.json({
      success: false,
      error: "清理过期用户偏好设置失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 撤回Cookies同意
cookiesRoutes.post("/withdraw/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    const preferencesModel = new UserPreferencesModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);

    // 撤回所有同意
    await preferencesModel.updateCookiesConsent(sessionId, {
      sessionId,
      cookiesConsent: false,
      analyticsConsent: false,
      marketingConsent: false,
      timestamp: new Date(),
    });

    // 记录撤回事件
    await analyticsModel.createEvent({
      eventType: "cookies_consent_withdrawn",
      eventData: JSON.stringify({
        sessionId,
        timestamp: new Date().toISOString(),
      }),
      pageUrl: c.req.url,
      userAgent: c.req.header("User-Agent"),
      ipAddress: c.req.header("CF-Connecting-IP"),
    });

    return c.json({
      success: true,
      message: "Cookies同意已撤回",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("撤回Cookies同意失败:", error);
    return c.json({
      success: false,
      error: "撤回Cookies同意失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

export { cookiesRoutes };
