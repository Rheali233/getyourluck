/**
 * 反馈相关路由
 * 遵循统一开发标准的API路由规范
 */
import { Hono } from "hono";
import { validateFeedback } from "../../middleware/validation";
import { rateLimiter } from "../../middleware/rateLimiter";
import { ValidationService } from "../../services/ValidationService";
import { ContentFilterService, ContentFilterCategory } from "../../services/ContentFilterService";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
const feedbackRoutes = new Hono();
// 提交用户反馈
feedbackRoutes.post("/", rateLimiter(5, 60000), // 恢复速率限制
validateFeedback, // 验证中间件
async (c) => {
    try {
        const feedbackData = await c.req.json();
        const dbService = c.get("dbService");
        // 验证会话ID是否存在（如果提供）
        if (feedbackData.sessionId) {
            const session = await dbService.testSessions.findById(feedbackData.sessionId);
            if (!session) {
                throw new ModuleError(`Session ID '${feedbackData.sessionId}' not found`, ERROR_CODES.VALIDATION_ERROR, 404);
            }
        }
        // 对评论内容进行过滤检查
        let filteredComment = feedbackData.comment;
        let filterResult = null;
        if (feedbackData.comment) {
            // 进行内容过滤
            filterResult = ContentFilterService.validateContent(feedbackData.comment, [ContentFilterCategory.HATE_SPEECH, ContentFilterCategory.ADULT], // 严格过滤类别
            [ContentFilterCategory.PROFANITY, ContentFilterCategory.SPAM] // 警告过滤类别
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
        const response = {
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
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to submit feedback", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取反馈统计
feedbackRoutes.get("/stats", async (c) => {
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
            }
            else if (range === '30d') {
                startDate.setDate(startDate.getDate() - 30);
            }
            else if (range === '90d') {
                startDate.setDate(startDate.getDate() - 90);
            }
            stats = await dbService.userFeedback.getStatsByDateRange(startDate.toISOString(), endDate.toISOString());
        }
        else {
            // 获取所有时间的统计
            stats = await dbService.userFeedback.getStats();
        }
        const response = {
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
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve feedback statistics", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取用户评论
feedbackRoutes.get("/comments", async (c) => {
    try {
        const dbService = c.get("dbService");
        const limit = parseInt(c.req.query("limit") || "20");
        const page = parseInt(c.req.query("page") || "1");
        // 验证分页参数
        ValidationService.validatePagination(page, limit, 50);
        // 获取评论
        const comments = await dbService.userFeedback.getComments(limit);
        // 获取总评论数
        const stats = await dbService.userFeedback.getStats();
        const response = {
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
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve feedback comments", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取特定会话的反馈
feedbackRoutes.get("/session/:sessionId", async (c) => {
    try {
        const sessionId = c.req.param("sessionId");
        const dbService = c.get("dbService");
        // 验证会话ID
        ValidationService.validateUUID(sessionId);
        // 获取会话反馈
        const feedback = await dbService.userFeedback.findBySessionId(sessionId);
        const response = {
            success: true,
            data: feedback,
            message: `Feedback for session ${sessionId} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve session feedback", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
export { feedbackRoutes };
//# sourceMappingURL=index.js.map