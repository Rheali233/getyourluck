/**
 * 统一会话管理API路由
 * 整合所有测试会话相关的统一接口
 * 遵循RESTful API设计原则
 */

import { Hono } from "hono";
import type { Context } from "hono";
import type { AppContext } from "../../../types/env";
import { rateLimiter } from "../../../middleware/rateLimiter";
import { TestSessionModel } from "../../../models/TestSessionModel";
import type { APIResponse } from "../../../types/v1Types";
import { ModuleError, ERROR_CODES } from "../../../types/v1Types";

const sessionRoutes = new Hono<AppContext>();

// 应用中间件
sessionRoutes.use("*", rateLimiter());

// 获取最近的会话 - 必须在 /:sessionId 之前
sessionRoutes.get("/recent", async (c: Context<AppContext>) => {
  const limit = parseInt(c.req.query("limit") || "10");

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    const sessions = await sessionModel.getRecentSessions(limit);

    const response: APIResponse = {
      success: true,
      data: sessions,
      message: "Recent sessions retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      "Failed to retrieve recent sessions",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取测试类型统计 - 必须在 /:sessionId 之前
sessionRoutes.get("/stats/:testTypeId", async (c: Context<AppContext>) => {
  const testTypeId = c.req.param("testTypeId");

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    const stats = await sessionModel.getStatsByTestType(testTypeId);

    const response: APIResponse = {
      success: true,
      data: stats,
      message: "Test statistics retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve statistics for test type: ${testTypeId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取用户的所有会话 - 必须在 /:sessionId 之前
sessionRoutes.get("/user/:userId", async (c: Context<AppContext>) => {
  const userId = c.req.param("userId");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    const sessions = await sessionModel.getSessionsByUserId(userId, limit, offset);

    const response: APIResponse = {
      success: true,
      data: sessions,
      message: "User sessions retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve sessions for user: ${userId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取会话信息
sessionRoutes.get("/:sessionId", async (c: Context<AppContext>) => {
  const sessionId = c.req.param("sessionId");

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    const session = await sessionModel.findById(sessionId);

    if (!session) {
      const response: APIResponse = {
        success: false,
        error: "SESSION_NOT_FOUND",
        message: "Session not found",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 404);
    }

    const response: APIResponse = {
      success: true,
      data: session,
      message: "Session retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 更新会话状态
sessionRoutes.patch("/:sessionId", async (c: Context<AppContext>) => {
  const sessionId = c.req.param("sessionId");
  const body = await c.req.json();

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    // 验证更新字段
    const allowedFields = ["sessionDuration", "resultData"];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      const response: APIResponse = {
        success: false,
        error: "NO_VALID_FIELDS",
        message: "No valid fields to update",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const updatedSession = await sessionModel.updateSession(sessionId, updateData);

    const response: APIResponse = {
      success: true,
      data: updatedSession,
      message: "Session updated successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to update session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 删除会话
sessionRoutes.delete("/:sessionId", async (c: Context<AppContext>) => {
  const sessionId = c.req.param("sessionId");

  try {
    const dbService = c.get("dbService");
    const sessionModel = new TestSessionModel(dbService.env);
    
    await sessionModel.deleteSession(sessionId);

    const response: APIResponse = {
      success: true,
      message: "Session deleted successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to delete session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

export { sessionRoutes };
