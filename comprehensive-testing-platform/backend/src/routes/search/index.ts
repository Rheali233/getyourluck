/**
 * 搜索功能API路由
 * 遵循统一开发标准的搜索API实现
 */

import { Hono } from "hono";
import { SearchIndexModel } from "../../models/SearchIndexModel";
import { AnalyticsEventModel } from "../../models/AnalyticsEventModel";
import type { AppContext } from "../../index";

const searchRoutes = new Hono<AppContext>();

// 搜索内容
searchRoutes.get("/", async (c) => {
  try {
    const query = c.req.query("q");
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "20");

    if (!query || query.trim().length === 0) {
      return c.json({
        success: false,
        error: "搜索关键词不能为空",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      }, 400);
    }

    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);

    // 执行搜索
    const results = await searchModel.search(query.trim(), language, limit);

    // 记录搜索事件
    await analyticsModel.create({
      eventType: "search_query",
      eventData: {
        query: query.trim(),
        language,
        resultCount: results.length,
        limit,
      },
      userAgent: c.req.header("User-Agent"),
      ipAddress: c.req.header("CF-Connecting-IP"),
    });

    // 记录搜索关键词
    await searchModel.recordSearchKeyword(query.trim(), language);

    return c.json({
      success: true,
      data: {
        query: query.trim(),
        results,
        total: results.length,
        language,
      },
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("搜索失败:", error);
    console.error("错误详情:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return c.json({
      success: false,
      error: "搜索失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 获取搜索建议
searchRoutes.get("/suggestions", async (c) => {
  try {
    const query = c.req.query("q");
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "10");

    if (!query || query.trim().length === 0) {
      return c.json({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      });
    }

    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);

    const suggestions = await searchModel.getSearchSuggestions(query.trim(), language, limit);

    return c.json({
      success: true,
      data: suggestions,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取搜索建议失败:", error);
    return c.json({
      success: false,
      error: "获取搜索建议失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 获取热门搜索关键词
searchRoutes.get("/popular", async (c) => {
  try {
    const language = c.req.query("lang") || "zh-CN";
    const limit = parseInt(c.req.query("limit") || "10");

    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);

    const keywords = await searchModel.getPopularKeywords(language, limit);

    return c.json({
      success: true,
      data: keywords,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取热门关键词失败:", error);
    return c.json({
      success: false,
      error: "获取热门关键词失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 搜索统计信息
searchRoutes.get("/stats", async (c) => {
  try {
    const dbService = c.get("dbService");
    
    // 获取搜索相关统计
    const totalSearches = await dbService.db
      .prepare("SELECT COUNT(*) as count FROM analytics_events WHERE event_type LIKE 'search_%'")
      .first();

    const totalKeywords = await dbService.db
      .prepare("SELECT COUNT(*) as count FROM popular_search_keywords")
      .first();

    const recentSearches = await dbService.db
      .prepare(`
        SELECT event_data, timestamp 
        FROM analytics_events 
        WHERE event_type = 'search_query' 
        ORDER BY timestamp DESC 
        LIMIT 10
      `)
      .all();

    const stats = {
      totalSearches: totalSearches?.count as number || 0,
      totalKeywords: totalKeywords?.count as number || 0,
      recentSearches: recentSearches.results?.map(row => ({
        data: JSON.parse(row.event_data as string),
        timestamp: row.timestamp,
      })) || [],
    };

    return c.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("获取搜索统计失败:", error);
    return c.json({
      success: false,
      error: "获取搜索统计失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

// 增加搜索结果点击次数
searchRoutes.post("/click", async (c) => {
  try {
    const body = await c.req.json();
    const { searchIndexId, resultType, resultId } = body;

    if (!searchIndexId) {
      return c.json({
        success: false,
        error: "缺少必要参数",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      }, 400);
    }

    const dbService = c.get("dbService");
    const searchModel = new SearchIndexModel(dbService.env);
    const analyticsModel = new AnalyticsEventModel(dbService.env);

    // 增加搜索次数
    await searchModel.incrementSearchCount(searchIndexId);

    // 记录点击事件
    await analyticsModel.createEvent({
      eventType: "search_result_click",
      eventData: JSON.stringify({
        searchIndexId,
        resultType,
        resultId,
      }),
      pageUrl: c.req.url,
      userAgent: c.req.header("User-Agent"),
      ipAddress: c.req.header("CF-Connecting-IP"),
    });

    return c.json({
      success: true,
      message: "点击记录成功",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    });
  } catch (error) {
    console.error("记录搜索结果点击失败:", error);
    return c.json({
      success: false,
      error: "记录点击失败",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    }, 500);
  }
});

export { searchRoutes };
