/**
 * 统一AI服务API路由
 * 整合所有AI分析相关的统一接口
 * 遵循RESTful API设计原则
 */

import { Hono } from "hono";
import type { Context } from "hono";
import type { AppContext } from "../../../types/env";
import { rateLimiter } from "../../../middleware/rateLimiter";
import { AIService } from "../../../services/AIService";
import { UnifiedAIService } from "../../../services/UnifiedAIService";
import { astrologyAIRoutes } from "../../ai/astrology";
import type { APIResponse } from "../../../types/v1Types";
import { ModuleError, ERROR_CODES } from "../../../types/v1Types";

const aiRoutes = new Hono<AppContext>();

// 应用中间件
aiRoutes.use("*", rateLimiter());

// 挂载占星AI路由
aiRoutes.route("/astrology", astrologyAIRoutes);

// AI分析测试结果
aiRoutes.post("/analyze", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const { testType, answers, userContext } = body;

    if (!testType || !answers) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "Test type and answers are required",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    const analysis = await aiService.analyzeTestResult({
      testType,
      answers,
      userContext: userContext || {}
    });

    const response: APIResponse = {
      success: true,
      data: analysis,
      message: "AI analysis completed successfully",
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
      "Failed to perform AI analysis",
      ERROR_CODES.AI_SERVICE_UNAVAILABLE,
      500
    );
  }
});

// AI生成个性化推荐
aiRoutes.post("/recommendations", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const { testType, results, userPreferences, context } = body;

    if (!testType || !results) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "Test type and results are required",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    const recommendations = await aiService.generateRecommendations({
      testType,
      results,
      userPreferences: userPreferences || {},
      context: context || {}
    });

    const response: APIResponse = {
      success: true,
      data: recommendations,
      message: "AI recommendations generated successfully",
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
      "Failed to generate AI recommendations",
      ERROR_CODES.AI_SERVICE_UNAVAILABLE,
      500
    );
  }
});

// AI解释测试结果
aiRoutes.post("/explain", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const { testType, scores, rawAnswers, language } = body;

    if (!testType || !scores) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "Test type and scores are required",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    const explanation = await aiService.explainTestResults({
      testType,
      scores,
      rawAnswers: rawAnswers || [],
      language: language || "en"
    });

    const response: APIResponse = {
      success: true,
      data: explanation,
      message: "AI explanation generated successfully",
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
      "Failed to generate AI explanation",
      ERROR_CODES.AI_SERVICE_UNAVAILABLE,
      500
    );
  }
});

// AI个性化建议
aiRoutes.post("/personalized-advice", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const { testType, results, userProfile, goals } = body;

    if (!testType || !results) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "Test type and results are required",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    const advice = await aiService.generatePersonalizedAdvice({
      testType,
      results,
      userProfile: userProfile || {},
      goals: goals || []
    });

    const response: APIResponse = {
      success: true,
      data: advice,
      message: "Personalized AI advice generated successfully",
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
      "Failed to generate personalized AI advice",
      ERROR_CODES.AI_SERVICE_UNAVAILABLE,
      500
    );
  }
});

// AI服务状态检查
aiRoutes.get("/health", async (c: Context<AppContext>) => {
  try {
    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    const status = await aiService.healthCheck();

    const response: APIResponse = {
      success: true,
      data: status,
      message: "AI service health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    const response: APIResponse = {
      success: false,
      error: "AI_SERVICE_UNAVAILABLE",
      message: "AI service is currently unavailable",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };
    
    return c.json(response, 503);
  }
});

// ==================== 统一AI服务端点 ====================

// 统一AI分析
aiRoutes.post("/unified/analyze", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json();
    const { testTypeId, testCategory, resultType, answers, scores, context } = body;

    if (!testTypeId || !testCategory || !resultType || !answers || !scores) {
      const response: APIResponse = {
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "Missing required fields: testTypeId, testCategory, resultType, answers, scores",
        timestamp: new Date().toISOString(),
        requestId: c.get("requestId"),
        version: "1.0.0"
      };
      return c.json(response, 400);
    }

    const unifiedAIService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY || '',
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    });

    const analysisResult = await unifiedAIService.analyzeTest({
      testTypeId,
      testCategory,
      resultType,
      answers,
      scores,
      context
    });

    const response: APIResponse = {
      success: true,
      data: analysisResult,
      message: "Unified AI analysis completed successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    console.error('Unified AI analysis error:', error);
    
    const response: APIResponse = {
      success: false,
      error: "AI_ANALYSIS_FAILED",
      message: "Unified AI analysis failed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };
    
    return c.json(response, 500);
  }
});

// 获取AI分析模板
aiRoutes.get("/unified/templates", async (c: Context<AppContext>) => {
  try {
    const unifiedAIService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY || '',
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    });

    const templates = unifiedAIService.getAllTemplates();

    const response: APIResponse = {
      success: true,
      data: templates,
      message: "AI analysis templates retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    console.error('Get templates error:', error);
    
    const response: APIResponse = {
      success: false,
      error: "TEMPLATES_RETRIEVAL_FAILED",
      message: "Failed to retrieve AI analysis templates",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };
    
    return c.json(response, 500);
  }
});

// 统一AI服务健康检查
aiRoutes.get("/unified/health", async (c: Context<AppContext>) => {
  try {
    const unifiedAIService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY || '',
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    });

    const healthStatus = await unifiedAIService.healthCheck();

    const response: APIResponse = {
      success: true,
      data: healthStatus,
      message: "Unified AI service health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };

    return c.json(response);
  } catch (error) {
    console.error('Unified AI health check error:', error);
    
    const response: APIResponse = {
      success: false,
      error: "UNIFIED_AI_SERVICE_UNAVAILABLE",
      message: "Unified AI service is currently unavailable",
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
      version: "1.0.0"
    };
    
    return c.json(response, 503);
  }
});

export { aiRoutes };
