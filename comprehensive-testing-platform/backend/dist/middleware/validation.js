/**
 * 统一数据验证中间件
 * 遵循统一开发标准的验证规范
 */
import { z } from "zod";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
// 测试提交数据验证模式
const testSubmissionSchema = z.object({
    testType: z.string().min(1, "Test type is required"),
    answers: z.array(z.any()).min(1, "At least one answer is required"),
    userInfo: z.object({
        userAgent: z.string().optional(),
        timestamp: z.string().optional(),
    }).optional(),
});
// 反馈数据验证模式
const feedbackSchema = z.object({
    sessionId: z.string().uuid("Invalid session ID format"),
    feedback: z.enum(["like", "dislike"], {
        errorMap: () => ({ message: "Feedback must be 'like' or 'dislike'" }),
    }),
    comment: z.string().max(500, "Comment too long").optional(),
    rating: z.number().min(1).max(5).optional(),
});
// 分析事件验证模式
const analyticsEventSchema = z.object({
    eventType: z.string().min(1, "Event type is required"),
    data: z.any().optional(),
    sessionId: z.string().uuid("Invalid session ID format").optional(),
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
 * 通用验证函数
 */
const validateWithSchema = (schema) => {
    return async (c, next) => {
        try {
            const body = await c.req.json();
            schema.parse(body);
            return next();
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Validation error", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    };
};
/**
 * 分页参数验证
 */
export function validatePagination(page, limit, maxLimit = 100) {
    if (isNaN(page) || page < 1) {
        throw new ModuleError("Invalid page number", ERROR_CODES.VALIDATION_ERROR, 400);
    }
    if (isNaN(limit) || limit < 1 || limit > maxLimit) {
        throw new ModuleError(`Invalid limit (must be between 1 and ${maxLimit})`, ERROR_CODES.VALIDATION_ERROR, 400);
    }
}
export const validateTestSubmission = async (c, next) => {
    try {
        const body = await c.req.json();
        testSubmissionSchema.parse(body);
        return next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ModuleError("Invalid test submission data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
        }
        throw error;
    }
};
export const validateFeedback = async (c, next) => {
    console.log("validateFeedback middleware called");
    try {
        // 尝试解析JSON
        const body = await c.req.json();
        // 基本验证：检查必要字段
        if (!body || typeof body !== 'object') {
            throw new ModuleError("Invalid request body format", ERROR_CODES.VALIDATION_ERROR, 400);
        }
        if (!body.feedback || !['like', 'dislike'].includes(body.feedback)) {
            throw new ModuleError("Feedback must be 'like' or 'dislike'", ERROR_CODES.VALIDATION_ERROR, 400);
        }
        await next();
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        // JSON解析错误
        throw new ModuleError("Invalid JSON format", ERROR_CODES.VALIDATION_ERROR, 400);
    }
};
export const validateAnalyticsEvent = async (c, next) => {
    try {
        const body = await c.req.json();
        analyticsEventSchema.parse(body);
        await next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ModuleError("Invalid analytics event data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
        }
        throw error;
    }
};
export const validateBlogArticle = async (c, next) => {
    try {
        const body = await c.req.json();
        blogArticleSchema.parse(body);
        return next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            throw new ModuleError("Invalid blog article data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
        }
        throw error;
    }
};
//# sourceMappingURL=validation.js.map