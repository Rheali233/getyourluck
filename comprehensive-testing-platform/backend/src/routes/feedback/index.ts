/**
 * 反馈相关路由
 * 遵循统一开发标准的API路由规范
 */

import { Hono } from "hono";
import type { Context } from "hono";
import type { AppContext } from "../../types/env";
import { validateFeedback } from "../../middleware/validation";
import { rateLimiter } from "../../middleware/rateLimiter";
import { ValidationService } from "../../services/ValidationService";
import { ContentFilterService, ContentFilterCategory } from "../../services/ContentFilterService";
import type { APIResponse, PaginatedResponse } from "../../../../shared/types/apiResponse";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
import { FeedbackDetailsModel } from "../../models/FeedbackDetailsModel";

const feedbackRoutes = new Hono<AppContext>();

// 提交用户反馈
feedbackRoutes.post("/", 
  rateLimiter(5, 60000), // 恢复速率限制
  validateFeedback, // 验证中间件
  async (c: Context<AppContext>) => {
    try {
      const feedbackData = await c.req.json();
      const dbService = c.get("dbService");
      
      // Validate if session ID exists (if provided)
      if (feedbackData.sessionId) {
        const session = await dbService.testSessions.findById(feedbackData.sessionId);
        if (!session) {
          throw new ModuleError(
            `Session ID '${feedbackData.sessionId}' not found`,
            ERROR_CODES.VALIDATION_ERROR,
            404
          );
        }
      }

      // 对评论内容进行过滤检查
      let filteredComment = feedbackData.comment;
      let filterResult = null;
      
      if (feedbackData.comment) {
        // 进行内容过滤
        filterResult = ContentFilterService.validateContent(
          feedbackData.comment,
          [ContentFilterCategory.HATE_SPEECH, ContentFilterCategory.ADULT], // 严格过滤类别
          [ContentFilterCategory.PROFANITY, ContentFilterCategory.SPAM]     // 警告过滤类别
        );
        
        // 使用过滤后的内容
        filteredComment = filterResult.filteredContent;
      }
      
      // 保存反馈到数据库
      const feedbackId = await dbService.userFeedback.create({
        sessionId: feedbackData.sessionId,
        feedbackType: feedbackData.feedback,
        content: filteredComment,
        rating: feedbackData.rating || (feedbackData.feedback === 'like' ? 5 : 1),
      });

      // 记录分析事件
      await dbService.analyticsEvents.create({
        eventType: 'feedback_submitted',
        eventData: {
          feedbackType: feedbackData.feedback,
          hasComment: !!feedbackData.comment,
          wasFiltered: filterResult && !filterResult.isClean,
          sessionId: feedbackData.sessionId,
        },
        sessionId: feedbackData.sessionId,
        ipAddress: c.req.header('CF-Connecting-IP') || "",
        userAgent: c.req.header('User-Agent'),
      });

      const response: APIResponse = {
        success: true,
        data: {
          feedbackId,
          status: 'recorded',
          contentFiltered: filterResult && !filterResult.isClean,
        },
        message: "Feedback submitted successfully",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        "Failed to submit feedback",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
);

// 获取反馈统计
feedbackRoutes.get("/stats", async (c: Context<AppContext>) => {
  try {
    const dbService = c.get("dbService");
    
    // 获取时间范围参数
    const range = c.req.query("range"); // 7d, 30d, 90d, all
    
    let stats;
    if (range && range !== 'all') {
      // 计算时间范围
      const endDate = new Date();
      const startDate = new Date();
      
      if (range === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (range === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (range === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      }
      
      stats = await dbService.userFeedback.getStatsByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
    } else {
      // 获取所有时间的统计
      stats = await dbService.userFeedback.getStats();
    }

    const response: APIResponse = {
      success: true,
      data: {
        ...stats,
        timeRange: range || 'all',
        likeRatio: stats.totalFeedback > 0 
          ? Math.round((stats.positiveCount / stats.totalFeedback) * 100) 
          : 0,
      },
      message: "Feedback statistics retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve feedback statistics",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取用户评论
feedbackRoutes.get("/comments", async (c: Context<AppContext>) => {
  try {
    const dbService = c.get("dbService");
    
    const limit = parseInt(c.req.query("limit") || "20");
    const page = parseInt(c.req.query("page") || "1");
    
    // 验证分页参数
    ValidationService.validatePagination({ page, limit: Math.min(limit, 50) });
    
    // 获取评论
    const comments = await dbService.userFeedback.getComments(limit);
    
    // 获取总评论数
    const stats = await dbService.userFeedback.getStats();
    
    const response: PaginatedResponse = {
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total: stats.commentCount,
        totalPages: Math.ceil(stats.commentCount / limit),
        hasNext: page * limit < stats.commentCount,
        hasPrev: page > 1,
      },
      message: "Feedback comments retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve feedback comments",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定会话的反馈
feedbackRoutes.get("/session/:sessionId", async (c: Context<AppContext>) => {
  try {
    const sessionId = c.req.param("sessionId");
    const dbService = c.get("dbService");
    
    // 验证会话ID
    ValidationService.validateUUID(sessionId);
    
    // 获取会话反馈
    const feedback = await dbService.userFeedback.findBySessionId(sessionId);
    
    const response: APIResponse = {
      success: true,
      data: feedback,
      message: `Feedback for session ${sessionId} retrieved successfully`,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve session feedback",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 收集结构化详细反馈
feedbackRoutes.post('/collect', async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const required = ["testType", "rating", "category", "message", "client"] as const;
    for (const key of required) {
      if (!(key in body)) {
        throw new ModuleError(`Missing field: ${key}`, ERROR_CODES.VALIDATION_ERROR, 400);
      }
    }
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      throw new ModuleError("Invalid rating (1-5)", ERROR_CODES.VALIDATION_ERROR, 400);
    }
    if (typeof body.message !== 'string' || body.message.trim().length < 10) {
      throw new ModuleError("Message too short", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const ip = c.req.header('CF-Connecting-IP') || '';
    const ipHash = ip
      ? await crypto.subtle
          .digest('SHA-256', new TextEncoder().encode(ip))
          .then((buf) => Array.from(new Uint8Array(buf)).map((x) => x.toString(16).padStart(2, '0')).join(''))
      : undefined;

    const model = new FeedbackDetailsModel(c.env);
    const createData: any = {
      testType: body.testType,
      testId: body.testId,
      resultId: body.resultId,
      sessionId: body.sessionId,
      rating: body.rating,
      category: body.category,
      message: body.message,
      email: body.email,
      canContact: !!body.canContact,
      screenshotUrl: body.screenshotUrl,
      client: body.client,
    };
    if (Array.isArray(body.images)) {
      createData.images = body.images.slice(0, 5);
    }
    if (ipHash) {
      createData.ipHash = ipHash;
    }
    const feedbackId = await model.create(createData);

    const response: APIResponse = {
      success: true,
      data: { feedbackId },
      message: "Feedback collected",
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };
    return c.json(response, 201);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError("Failed to collect feedback", ERROR_CODES.DATABASE_ERROR, 500);
  }
});

export { feedbackRoutes };