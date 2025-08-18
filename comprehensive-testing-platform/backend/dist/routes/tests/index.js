/**
 * 测试相关路由
 * 遵循统一开发标准的API路由规范
 */
import { Hono } from "hono";
import { validateTestSubmission } from "../../middleware/validation";
import { rateLimiter } from "../../middleware/rateLimiter";
import { ValidationService } from "../../services/ValidationService";
import { TestEngineService } from "../../services/testEngine";
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
const testRoutes = new Hono();
// 获取测试类型列表
testRoutes.get("/", async (c) => {
    try {
        const dbService = c.get("dbService");
        const cacheService = c.get("cacheService");
        const testEngineService = new TestEngineService(dbService, cacheService);
        const testTypes = await testEngineService.getTestTypes(true);
        const response = {
            success: true,
            data: testTypes,
            message: "Test types retrieved successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to retrieve test types", ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取特定测试的配置信息
testRoutes.get("/:testType", async (c) => {
    const testType = c.req.param("testType");
    try {
        ValidationService.sanitizeString(testType, 50);
        const dbService = c.get("dbService");
        const cacheService = c.get("cacheService");
        const testEngineService = new TestEngineService(dbService, cacheService);
        const testConfig = await testEngineService.getTestConfig(testType);
        const response = {
            success: true,
            data: testConfig,
            message: `Test configuration for ${testType} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve test configuration for: ${testType}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取特定测试的题目（这里返回配置，实际题目由前端生成或从配置中获取）
testRoutes.get("/:testType/questions", async (c) => {
    const testType = c.req.param("testType");
    try {
        ValidationService.sanitizeString(testType, 50);
        const dbService = c.get("dbService");
        const cacheService = c.get("cacheService");
        const testEngineService = new TestEngineService(dbService, cacheService);
        const testConfig = await testEngineService.getTestConfig(testType);
        // 解析配置数据
        const configData = typeof testConfig.configData === 'string'
            ? JSON.parse(testConfig.configData)
            : testConfig.configData;
        const response = {
            success: true,
            data: {
                testType: testConfig.id,
                name: testConfig.name,
                description: testConfig.description,
                category: testConfig.category,
                questionCount: configData.questionCount || 20,
                timeLimit: configData.timeLimit || 1800,
                instructions: configData.instructions || "请根据实际情况选择最符合的答案",
                // 实际的题目内容可能需要从其他地方获取或动态生成
            },
            message: `Questions configuration for ${testType} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve questions for test type: ${testType}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 提交测试答案
testRoutes.post("/submit", rateLimiter(10, 60000), // 每分钟最多10次提交
validateTestSubmission, async (c) => {
    try {
        const submission = await c.req.json();
        const dbService = c.get("dbService");
        const cacheService = c.get("cacheService");
        const testEngineService = new TestEngineService(dbService, cacheService);
        // 验证测试类型是否存在
        await testEngineService.getTestConfig(submission.testType);
        // 哈希IP地址
        const ipHash = await hashIP(c.req.header("CF-Connecting-IP") || "unknown");
        // 创建测试会话
        const sessionId = await testEngineService.saveTestSession({
            testTypeId: submission.testType,
            answersData: submission.answers,
            resultData: {}, // 暂时为空，后续计算结果后更新
            userAgent: submission.userInfo?.userAgent || null,
            ipAddressHash: ipHash,
            sessionDuration: 0, // 暂时为0，实际应该计算
        });
        // 这里应该调用相应的测试引擎计算结果
        // 暂时返回基本结果结构
        const result = {
            sessionId,
            testType: submission.testType,
            scores: {},
            interpretation: "测试结果正在计算中...",
            recommendations: [],
            completedAt: new Date().toISOString(),
        };
        const response = {
            success: true,
            data: result,
            message: "Test submitted successfully",
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError("Failed to process test submission", ERROR_CODES.CALCULATION_ERROR, 500);
    }
});
// 获取测试结果
testRoutes.get("/results/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    try {
        ValidationService.validateUUID(sessionId);
        const dbService = c.get("dbService");
        const cacheService = c.get("cacheService");
        const testEngineService = new TestEngineService(dbService, cacheService);
        const result = await testEngineService.getTestResult(sessionId);
        const response = {
            success: true,
            data: result,
            message: `Result for session ${sessionId} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve result for session: ${sessionId}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 获取测试统计信息
testRoutes.get("/stats/:testType", async (c) => {
    const testType = c.req.param("testType");
    try {
        ValidationService.sanitizeString(testType, 50);
        const dbService = c.get("dbService");
        // 获取基本统计
        const totalSessions = await dbService.testSessions.count({ testTypeId: testType });
        // 获取最近活动
        const recentSessions = await dbService.testSessions.findRecent(testType, 10);
        const response = {
            success: true,
            data: {
                testType,
                totalSessions,
                recentActivity: recentSessions.length,
                lastActivity: recentSessions[0]?.createdAt || null,
            },
            message: `Statistics for ${testType} retrieved successfully`,
            timestamp: new Date().toISOString(),
            requestId: c.get("requestId"),
        };
        return c.json(response);
    }
    catch (error) {
        if (error instanceof ModuleError) {
            throw error;
        }
        throw new ModuleError(`Failed to retrieve statistics for test type: ${testType}`, ERROR_CODES.DATABASE_ERROR, 500);
    }
});
// 辅助函数：哈希IP地址
async function hashIP(ip) {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export { testRoutes };
//# sourceMappingURL=index.js.map