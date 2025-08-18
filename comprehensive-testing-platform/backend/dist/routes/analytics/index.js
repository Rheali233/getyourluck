/**
 * 分析统计相关路由
 * 遵循统一开发标准的API路由规范
 */
import { Hono } from "hono";
import { rateLimiter } from "../../middleware/rateLimiter";
import { validateAnalyticsEvent } from "../../middleware/validation";
import { ValidationService } from "../../services/ValidationService";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
const analyticsRoutes = new Hono();
// 记录分析事件
analyticsRoutes.post("/events", rateLimiter(100, 60000), // 每分钟最多100次事件记录
validateAnalyticsEvent, async (c) => {
    try {
        const eventData = await c.req.json();
        const dbService = c.get("dbService");
        // 保存分析事件到数据库
        const eventId = await dbService.analyticsEvents.create({
            eventType: eventData.eventType,
            eventData: eventData.data,
            sessionId: eventData.sessionId,
            ipAddress: c.req.header("CF-Connecting-IP") || "",
            userAgent: c.req.header("User-Agent"),
        });
        const response = {
            success: true,
            data: {
                eventId,
                status: "recorded"
            },
            message: "Analytics event recorded successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to record analytics event", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 批量记录分析事件
analyticsRoutes.post("/events/batch", rateLimiter(20, 60000), // 每分钟最多20次批量事件记录
async (c) => {
    try {
        const { events } = await c.req.json();
        const dbService = c.get("dbService");
        if (!Array.isArray(events) || events.length === 0) {
            throw new ModuleError("Invalid batch events data", ERROR_CODES.VALIDATION_ERROR, 400);
        }
        // 验证每个事件数据
        events.forEach(event => {
            if (!event.eventType) {
                throw new ModuleError("Each event must have an eventType", ERROR_CODES.VALIDATION_ERROR, 400);
            }
        });
        // 准备批量事件数据
        const ipAddress = c.req.header("CF-Connecting-IP") || "";
        const userAgent = c.req.header("User-Agent") || "";
        const eventsToCreate = events.map(event => ({
            eventType: event.eventType,
            eventData: event.data,
            sessionId: event.sessionId,
            ipAddress,
            userAgent,
        }));
        // 批量保存事件
        const count = await dbService.analyticsEvents.createBatch(eventsToCreate);
        const response = {
            success: true,
            data: {
                eventCount: count,
                status: "recorded"
            },
            message: "Batch analytics events recorded successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to record batch analytics events", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取基础统计数据
analyticsRoutes.get("/stats", async (c) => {
    const timeRange = c.req.query("range") || "7d"; // 7d, 30d, 90d, all
    try {
        const dbService = c.get("dbService");
        // 计算时间范围
        let startDate;
        let endDate;
        if (timeRange !== "all") {
            endDate = new Date().toISOString();
            const start = new Date();
            if (timeRange === "7d") {
                start.setDate(start.getDate() - 7);
            }
            else if (timeRange === "30d") {
                start.setDate(start.getDate() - 30);
            }
            else if (timeRange === "90d") {
                start.setDate(start.getDate() - 90);
            }
            else {
                throw new ModuleError(`Invalid time range: ${timeRange}`, ERROR_CODES.VALIDATION_ERROR, 400);
            }
            startDate = start.toISOString();
        }
        // 获取分析概览
        const overview = await dbService.analyticsEvents.getOverview(startDate, endDate);
        // 获取每日统计数据
        const daysToFetch = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const dailyStats = await dbService.analyticsEvents.getDailyStats(daysToFetch);
        const response = {
            success: true,
            data: {
                overview,
                dailyStats,
                timeRange,
                generatedAt: new Date().toISOString(),
            },
            message: "Analytics statistics retrieved successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve analytics statistics", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取特定事件类型的统计
analyticsRoutes.get("/stats/:eventType", async (c) => {
    const eventType = c.req.param("eventType");
    const timeRange = c.req.query("range") || "30d"; // 7d, 30d, 90d, all
    try {
        const dbService = c.get("dbService");
        ValidationService.sanitizeString(eventType, 100);
        // 计算时间范围
        let startDate;
        let endDate;
        if (timeRange !== "all") {
            endDate = new Date().toISOString();
            const start = new Date();
            if (timeRange === "7d") {
                start.setDate(start.getDate() - 7);
            }
            else if (timeRange === "30d") {
                start.setDate(start.getDate() - 30);
            }
            else if (timeRange === "90d") {
                start.setDate(start.getDate() - 90);
            }
            else {
                throw new ModuleError(`Invalid time range: ${timeRange}`, ERROR_CODES.VALIDATION_ERROR, 400);
            }
            startDate = start.toISOString();
        }
        // 获取每日统计数据
        const daysToFetch = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
        const dailyStats = await dbService.analyticsEvents.getDailyStats(daysToFetch, eventType);
        // 获取最近的事件数据（分页）
        const limit = parseInt(c.req.query("limit") || "20");
        const recentEvents = await dbService.analyticsEvents.findByEventType(eventType, limit, startDate, endDate);
        const response = {
            success: true,
            data: {
                eventType,
                totalEvents: dailyStats.reduce((sum, day) => sum + day.count, 0),
                dailyStats,
                recentEvents,
                timeRange,
            },
            message: `Statistics for event type '${eventType}' retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve statistics for event type: ${eventType}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取用户行为路径（会话分析）
analyticsRoutes.get("/sessions/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    try {
        const dbService = c.get("dbService");
        ValidationService.validateUUID(sessionId);
        // 获取会话的所有事件
        const events = await dbService.analyticsEvents.findBySessionId(sessionId);
        // 获取会话信息
        const session = await dbService.testSessions.findById(sessionId);
        if (!events.length) {
            throw new ModuleError(`No events found for session ID: ${sessionId}`, ERROR_CODES.NOT_FOUND, 404);
        }
        const response = {
            success: true,
            data: {
                sessionId,
                sessionData: session,
                events,
                eventCount: events.length,
                firstEventTime: events[0].timestamp,
                lastEventTime: events[events.length - 1].timestamp,
            },
            message: `User journey for session ${sessionId} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve user journey for session: ${sessionId}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取热门测试类型
analyticsRoutes.get("/popular-tests", async (c) => {
    const timeRange = c.req.query("range") || "30d"; // 7d, 30d, 90d, all
    try {
        const dbService = c.get("dbService");
        // 计算时间范围
        let startDate;
        let endDate;
        if (timeRange !== "all") {
            endDate = new Date().toISOString();
            const start = new Date();
            if (timeRange === "7d") {
                start.setDate(start.getDate() - 7);
            }
            else if (timeRange === "30d") {
                start.setDate(start.getDate() - 30);
            }
            else if (timeRange === "90d") {
                start.setDate(start.getDate() - 90);
            }
            else {
                throw new ModuleError(`Invalid time range: ${timeRange}`, ERROR_CODES.VALIDATION_ERROR, 400);
            }
            startDate = start.toISOString();
        }
        // 获取热门测试类型（分析test_started事件）
        const popularTests = await dbService.analyticsEvents.getEventStats(startDate, endDate, 10);
        // 过滤只保留测试开始事件
        const testEvents = popularTests.filter(event => event.eventType.startsWith('test_started_'));
        // 获取热门测试的详情
        const testTypesPromises = testEvents.map(async (event) => {
            const testType = event.eventType.replace('test_started_', '');
            try {
                return await dbService.testTypes.findById(testType);
            }
            catch (e) {
                return null;
            }
        });
        const testTypes = (await Promise.all(testTypesPromises))
            .filter(test => test !== null);
        const response = {
            success: true,
            data: {
                popularTests: testEvents.map((event, index) => ({
                    testType: event.eventType.replace('test_started_', ''),
                    count: event.count,
                    percentage: event.percentage,
                    name: testTypes[index]?.name || 'Unknown Test',
                    description: testTypes[index]?.description || '',
                })),
                timeRange,
            },
            message: "Popular tests retrieved successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve popular tests", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
export { analyticsRoutes };
//# sourceMappingURL=index.js.map