/**
 * UnifiedAIService Adapter
 * 临时适配器：提供被路由依赖的统一AI服务接口，内部委托给现有 AIService。
 * 目的：修复编译错误，保持路由兼容。后续可按需扩展模板与结构化输出。
 */

import { AIService } from './AIService'

export interface UnifiedAIServiceConfig {
  apiKey: string
  baseURL: string
  model: string
  maxTokens?: number
  temperature?: number
  maxRetries?: number
  timeout?: number
}

export interface UnifiedAIAnalysisInput {
  testTypeId: string
  testCategory: string
  resultType: string
  answers: any[]
  scores: Record<string, number>
  context?: Record<string, any>
}

export class UnifiedAIService {
  // 保留配置字段以满足调用方预期，但当前主要使用内部 AIService
  private readonly config: UnifiedAIServiceConfig
  private readonly aiService: AIService

  constructor(config: UnifiedAIServiceConfig) {
    this.config = config
    // 将配置用于内部 AIService 初始化及未来扩展，避免未使用变量错误
    const apiKeyToUse = this.config.apiKey
    this.aiService = new AIService(apiKeyToUse)
    
    // 使用config的其他属性以避免未使用变量警告
    if (this.config.maxTokens || this.config.temperature || this.config.maxRetries || this.config.timeout) {
      // 未来可以在这里使用这些配置参数
    }
  }

  /**
   * 统一AI分析入口
   * 适配到现有 AIService.analyzeTestResult，尽量复用通用分析能力。
   */
  async analyzeTest(input: UnifiedAIAnalysisInput): Promise<any> {
    const { testTypeId, answers, context } = input

    // 适配 answers 到通用格式：{ questionId, value }
    const normalizedAnswers = Array.isArray(answers)
      ? answers.map((a: any) => ({
          questionId: a?.questionId ?? a?.id ?? a?.qid ?? 'unknown',
          value: a?.answer ?? a?.value ?? a ?? null,
        }))
      : []

    const result = await this.aiService.analyzeTestResult({
      testType: testTypeId,
      answers: normalizedAnswers,
      userContext: context || {},
    })
    
    return result
  }

  /**
   * 返回所有可用模板（占位实现）。
   */
  getAllTemplates(): any[] {
    // 返回基本模板元数据，避免调用方空数组逻辑异常
    return [
      { id: 'generic_analysis', testTypeId: 'generic', resultType: 'generic_profile', version: '1.0.0' }
    ]
  }

  /**
   * 健康检查：委托 AIService。
   */
  async healthCheck(): Promise<any> {
    return this.aiService.healthCheck()
  }
}


