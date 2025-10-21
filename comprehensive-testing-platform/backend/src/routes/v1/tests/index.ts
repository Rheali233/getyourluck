/**
 * 统一测试API路由
 * 整合所有测试类型的统一接口
 * 遵循RESTful API设计原则
 */

import { Hono } from "hono";
import type { Context } from "hono";
import type { AppContext } from "../../../types/env";
import { validateTestSubmission } from "../../../middleware/validation";
import { rateLimiter } from "../../../middleware/rateLimiter";
import { ValidationService } from "../../../services/ValidationService";
import { TestEngineService } from "../../../services/testEngine";
import { QuestionService } from "../../../services/QuestionService";
import { TestResultService } from "../../../services/TestResultService";
import { AIService } from "../../../services/AIService";
import type { APIResponse, TestSubmission } from "../../../types/v1Types";
import { ModuleError, ERROR_CODES } from "../../../types/v1Types";

const testRoutes = new Hono<AppContext>();

// 应用中间件
testRoutes.use("*", rateLimiter());

// 处理OPTIONS预检请求
testRoutes.options("*", (c) => {
  return c.text("", 204 as any);
});









// 获取所有测试类型列表
testRoutes.get("/", async (c: Context<AppContext>) => {
  try {
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);

    const testTypes = await testEngineService.getTestTypes(true);
    
    const response: APIResponse = {
      success: true,
      data: testTypes,
      message: "Test types retrieved successfully",
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
      "Failed to retrieve test types",
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定测试的配置信息
testRoutes.get("/:testType", async (c: Context<AppContext>) => {
  const testType = c.req.param("testType");

  try {
    ValidationService.sanitizeString(testType, 50);
    
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    
    const testConfig = await testEngineService.getTestConfig(testType);

    const response: APIResponse = {
      success: true,
      data: testConfig,
      message: `Test configuration for ${testType} retrieved successfully`,
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
      `Failed to retrieve test configuration for: ${testType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取特定测试的题目
testRoutes.get("/:testType/questions", async (c: Context<AppContext>) => {
  const testType = c.req.param("testType");
  const language = c.req.query("language") || "en";

  try {
    ValidationService.sanitizeString(testType, 50);
    ValidationService.sanitizeString(language, 10);
    
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    
    const questionService = new QuestionService(dbService, cacheService);
    

    const result = await questionService.getQuestionsByType(testType, language);

    const response: APIResponse = {
      success: result.success,
      data: result.data,
      message: result.message || `Questions for ${testType} retrieved successfully`,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: `Failed to retrieve questions for: ${testType}`,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response, 500);
  }
});

// 提交测试答案
testRoutes.post("/:testType/submit", 
  rateLimiter(10, 60000), // 每分钟最多10次提交
  validateTestSubmission,
  async (c: Context<AppContext>) => {
    try {
      const testType = c.req.param("testType");
      const submission: TestSubmission = await c.req.json();
      const dbService = c.get("dbService");
      const cacheService = c.get("cacheService");
      const testEngineService = new TestEngineService(dbService, cacheService);
      // 使用环境变量中的API密钥
      const testResultService = new TestResultService(dbService, cacheService, new AIService(c.env.DEEPSEEK_API_KEY || ''));
      
      // 验证测试类型是否存在
      await testEngineService.getTestConfig(testType);

      // 处理测试结果（添加性能监控）
      const processingStartTime = Date.now();
      const result = await testResultService.processTestSubmission(
        testType,
        submission.answers
      );
      const processingTime = Date.now() - processingStartTime;
      
      // 添加处理时间到结果元数据
      if (result.metadata) {
        result.metadata.processingTimeMs = processingTime;
      } else {
        result.metadata = { processingTimeMs: processingTime };
      }

      // 哈希IP地址
      const ipHash = await hashIP(c.req.header("CF-Connecting-IP") || "unknown");

      // 计算会话持续时间（基于用户提交时间戳）
      const sessionDuration = submission.userInfo?.timestamp 
        ? Date.now() - new Date(submission.userInfo.timestamp).getTime()
        : 0;

      // 创建测试会话
      const sessionId = await testEngineService.saveTestSession({
        testTypeId: testType,
        answersData: submission.answers,
        resultData: result,
        userAgent: submission.userInfo?.userAgent || null,
        ipAddressHash: ipHash,
        sessionDuration: Math.max(0, sessionDuration), // 确保非负数
      });

      // 更新结果中的会话ID
      result.sessionId = sessionId;

      const response: APIResponse<any> = {
        success: true,
        data: result,
        message: "Test submitted successfully",
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
        "Failed to process test submission",
        ERROR_CODES.CALCULATION_ERROR,
        500
      );
    }
  }
);

// 获取测试结果 - 完整实现
testRoutes.get("/:testType/results/:sessionId", async (c: Context<AppContext>) => {
  const testType = c.req.param("testType");
  const sessionId = c.req.param("sessionId");

  try {
    ValidationService.sanitizeString(testType, 50);
    ValidationService.sanitizeString(sessionId, 100);
    
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    
    // 获取测试会话
    const session = await testEngineService.getTestSession(sessionId);
    if (!session) {
      throw new ModuleError(
        `Test session not found: ${sessionId}`,
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    // 验证测试类型匹配 (暂时跳过，因为数据库结构可能有问题)
    if (session.testTypeId && session.testTypeId !== testType) {
      throw new ModuleError(
        `Test type mismatch: expected ${testType}, got ${session.testTypeId}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // 直接解析会话中的结果数据
    let resultData: any = {};
    try {
      resultData = typeof session.resultData === 'string'
        ? JSON.parse(session.resultData)
        : (session.resultData || {});
    } catch (parseError) {
      throw new ModuleError(
        `Failed to parse test result data from backend`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // 转换为前端期望的格式
    const formattedResult = {
      sessionId: session.id,
      testType: session.testTypeId || testType,
      scores: resultData.totalScore ? { totalScore: resultData.totalScore } : {},
      interpretation: resultData.interpretation || '',
      recommendations: resultData.recommendations || [],
      completedAt: session.createdAt || new Date().toISOString(),
      status: 'completed',
      metadata: resultData.metadata,
      aiAnalysis: resultData.aiAnalysis,
      // 添加更多字段
      severity: resultData.severity,
      individualScores: resultData.individualScores
    };

    const response: APIResponse = {
      success: true,
      data: formattedResult,
      message: "Test result retrieved successfully",
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
      `Failed to retrieve test result for session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 获取测试统计信息
testRoutes.get("/:testType/stats", async (c: Context<AppContext>) => {
  const testType = c.req.param("testType");

  try {
    ValidationService.sanitizeString(testType, 50);
    
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    
    const stats = await testEngineService.getTestStats(testType);

    const response: APIResponse = {
      success: true,
      data: stats,
      message: `Test statistics for ${testType} retrieved successfully`,
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
      `Failed to retrieve test statistics for: ${testType}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 新增: 通过会话ID获取结果 (兼容性路由)
testRoutes.get("/results/:sessionId", async (c: Context<AppContext>) => {
  const sessionId = c.req.param("sessionId");

  try {
    ValidationService.sanitizeString(sessionId, 100);
    
    const dbService = c.get("dbService");
    const cacheService = c.get("cacheService");
    const testEngineService = new TestEngineService(dbService, cacheService);
    
    // 获取测试会话
    const session = await testEngineService.getTestSession(sessionId);
    if (!session) {
      throw new ModuleError(
        `Test session not found: ${sessionId}`,
        ERROR_CODES.NOT_FOUND,
        404
      );
    }

    // 重定向到正确的路由
    return c.redirect(`/api/v1/tests/${session.testTypeId}/results/${sessionId}`);
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      `Failed to retrieve test result for session: ${sessionId}`,
      ERROR_CODES.DATABASE_ERROR,
      500
    );
  }
});

// 辅助函数：哈希IP地址
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export { testRoutes };
