/**
 * 统一数据验证中间件
 * 遵循统一开发标准的验证规范
 */

import type { Context, Next } from "hono";
import type { AppContext } from "../types/env";
import { z } from "zod";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";

// 测试答案验证模式
const testAnswerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  value: z.union([
    z.string().min(1, "Answer value cannot be empty"),
    z.number().min(0, "Answer value must be non-negative"),
    z.boolean(),
    z.array(z.string().min(1, "Array answer value cannot be empty"))
  ], {
    errorMap: () => ({ message: "Answer value must be string, number, boolean, or string array" })
  })
});

// 测试提交数据验证模式
const testSubmissionSchema = z.object({
  testType: z.string().min(1, "Test type is required").max(50, "Test type too long"),
  answers: z.array(testAnswerSchema).min(1, "At least one answer is required").max(200, "Too many answers"),
  userInfo: z.object({
    userAgent: z.string().max(500, "User agent too long").optional(),
    timestamp: z.string().datetime("Invalid timestamp format").optional(),
  }).optional(),
});

// 反馈数据验证模式 - 已移除，未使用

// 分析事件验证模式
const analyticsEventSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  sessionId: z.string().optional(),
  pageUrl: z.string().optional(),
  referrer: z.string().optional(),
  userId: z.string().optional(),
  device: z.any().optional(),
  performance: z.any().optional(),
  data: z.any().optional(),
  timestamp: z.string().optional(),
});

// 博客文章验证模式
const blogArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(300, "Excerpt too long").optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * 通用验证函数 - 已移除，未使用
 */

/**
 * 分页参数验证
 */
export function validatePagination(page: number, limit: number, maxLimit: number = 100): void {
  if (isNaN(page) || page < 1) {
    throw new ModuleError(
      "Invalid page number",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
  
  if (isNaN(limit) || limit < 1 || limit > maxLimit) {
    throw new ModuleError(
      `Invalid limit (must be between 1 and ${maxLimit})`,
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
}

export const validateTestSubmission = async (c: Context<AppContext>, next: Next) => {
  try {
    const body = await c.req.json();
    
    // 添加调试日志
    // eslint-disable-next-line no-console
    console.log(`Validating test submission: testType=${body.testType}, answersCount=${body.answers?.length || 0}`);
    
    testSubmissionSchema.parse(body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 提供更详细的验证错误信息
      const errorDetails = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      throw new ModuleError(
        `Validation failed: ${errorDetails.map(e => `${e.field}: ${e.message}`).join(', ')}`,
        ERROR_CODES.VALIDATION_ERROR,
        400,
        errorDetails
      );
    }
    throw error;
  }
};

export const validateFeedback = async (c: Context<AppContext>, next: Next) => {
  try {
    // 尝试解析JSON
    const body = await c.req.json();
    
    // 基本验证：检查必要字段
    if (!body || typeof body !== 'object') {
      throw new ModuleError(
        "Invalid request body format",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    if (!body.feedback || !['like', 'dislike'].includes(body.feedback)) {
      throw new ModuleError(
        "Feedback must be 'like' or 'dislike'",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }
    
    await next();
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    
    // JSON解析错误
    throw new ModuleError(
      "Invalid JSON format",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }
};

export const validateAnalyticsEvent = async (c: Context<AppContext>, next: Next) => {
  try {
    const body = await c.req.json();
    analyticsEventSchema.parse(body);
    await next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ModuleError(
        "Invalid analytics event data",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.errors
      );
    }
    throw error;
  }
};

export const validateBlogArticle = async (c: Context<AppContext>, next: Next) => {
  try {
    const body = await c.req.json();
    blogArticleSchema.parse(body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ModuleError(
        "Invalid blog article data",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.errors
      );
    }
    throw error;
  }
};