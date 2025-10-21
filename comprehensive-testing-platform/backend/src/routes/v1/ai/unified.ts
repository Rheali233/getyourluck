/**
 * 统一AI分析路由
 * 整合所有测试类型的AI分析功能，提供统一的接口
 * 遵循统一开发标准的路由规范
 */

import { Hono } from 'hono'
import { Context } from 'hono'
import { UnifiedAIService, type UnifiedAIAnalysisInput } from '../../../services/UnifiedAIService'
import { rateLimiter } from '../../../middleware/rateLimiter'
import { ModuleError, ERROR_CODES } from '../../../../../shared/types/errors'

import type { AppContext } from '../../../types/env'

const unifiedAIRoutes = new Hono<AppContext>()

// 应用速率限制中间件
unifiedAIRoutes.use("*", rateLimiter())

/**
 * 执行AI分析
 * POST /api/v1/ai/analyze
 */
unifiedAIRoutes.post("/analyze", async (c: Context<AppContext>) => {
  try {
    const body = await c.req.json()
    const { testTypeId, testCategory, resultType, answers, scores, context } = body

    // 验证必需字段
    if (!testTypeId || !testCategory || !resultType || !answers || !scores) {
      throw new ModuleError(
        "Missing required fields: testTypeId, testCategory, resultType, answers, scores",
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }

    // 验证测试类型和结果类型
    const validTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'holland', 'disc', 'leadership', 'love_language', 'love_style', 'interpersonal', 'vark']
    const validResultTypes = ['personality_profile', 'screening_result', 'dimension_profile', 'career_profile', 'relationship_profile', 'learning_profile', 'wellness_profile']
    
    if (!validTestTypes.includes(testTypeId)) {
      throw new ModuleError(
        `Invalid test type: ${testTypeId}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }

    if (!validResultTypes.includes(resultType)) {
      throw new ModuleError(
        `Invalid result type: ${resultType}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }

    // 创建AI服务实例
    const aiService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    })

    // 构建分析输入
    const analysisInput: UnifiedAIAnalysisInput = {
      testTypeId,
      testCategory,
      resultType,
      answers,
      scores,
      context
    }

    // 执行AI分析
    const analysisResult = await aiService.analyzeTest(analysisInput)

    return c.json({
      success: true,
      data: analysisResult,
      message: "AI analysis completed successfully",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    })

  } catch (error) {
    
    if (error instanceof ModuleError) {
      return c.json({
        success: false,
        error: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID') || 'unknown',
        version: "1.0.0"
      }, error.statusCode as any)
    }

    return c.json({
      success: false,
      error: ERROR_CODES.CALCULATION_ERROR,
      message: "AI analysis failed",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    }, 500 as any)
  }
})

/**
 * 获取AI分析模板
 * GET /api/v1/ai/templates
 */
unifiedAIRoutes.get("/templates", async (c: Context<AppContext>) => {
  try {
    // 创建AI服务实例
    const aiService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    })

    // 获取所有模板
    const templates: any[] = aiService.getAllTemplates()

    return c.json({
      success: true,
      data: templates,
      message: "AI analysis templates retrieved successfully",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    })

  } catch (error) {
    
    return c.json({
      success: false,
      error: ERROR_CODES.DATABASE_ERROR,
      message: "Failed to retrieve AI analysis templates",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    }, 500 as any)
  }
})

/**
 * 获取特定测试类型的AI分析模板
 * GET /api/v1/ai/templates/:testTypeId
 */
unifiedAIRoutes.get("/templates/:testTypeId", async (c: Context<AppContext>) => {
  try {
    const testTypeId = c.req.param('testTypeId')
    
    if (!testTypeId) {
      throw new ModuleError(
        "Missing test type ID",
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }

    // 创建AI服务实例
    const aiService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    })

    // 获取所有模板
    const allTemplates: any[] = aiService.getAllTemplates()
    
    // 过滤特定测试类型的模板
    const templates = allTemplates.filter(template => template.testTypeId === testTypeId)

    return c.json({
      success: true,
      data: templates,
      message: `AI analysis templates for ${testTypeId} retrieved successfully`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    })

  } catch (error) {
    
    if (error instanceof ModuleError) {
      return c.json({
        success: false,
        error: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID') || 'unknown',
        version: "1.0.0"
      }, error.statusCode as any)
    }

    return c.json({
      success: false,
      error: ERROR_CODES.DATABASE_ERROR,
      message: "Failed to retrieve AI analysis templates",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    }, 500 as any)
  }
})

/**
 * AI服务健康检查
 * GET /api/v1/ai/health
 */
unifiedAIRoutes.get("/health", async (c: Context<AppContext>) => {
  try {
    // 创建AI服务实例
    const aiService = new UnifiedAIService({
      apiKey: c.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      maxRetries: 3,
      timeout: 30000
    })

    // 执行健康检查
    const healthStatus = await aiService.healthCheck()

    return c.json({
      success: true,
      data: healthStatus,
      message: "AI service health check completed",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    })

  } catch (error) {
    
    return c.json({
      success: false,
      error: ERROR_CODES.NETWORK_ERROR,
      message: "AI service health check failed",
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID') || 'unknown',
      version: "1.0.0"
    }, 500 as any)
  }
})

export default unifiedAIRoutes
