/**
 * AI服务基类
 * 提供通用的AI分析功能，各模块可以继承并定制
 */

import { createError, createAIServiceError, createRateLimitError } from '../utils/errorHandler';

export interface AIAnalysisRequest {
  testType: string;
  answers: any[];
  context?: Record<string, any>;
  options?: {
    language?: string;
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
    includeRecommendations?: boolean;
    includeInsights?: boolean;
  };
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    scores?: Record<string, number>;
    personality?: Record<string, any>;
    compatibility?: Record<string, any>;
  };
  metadata: {
    model: string;
    processingTime: number;
    timestamp: string;
    requestId: string;
  };
  data?: any;
  error?: string;
}

export interface AIAnalysisError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  retryAfter?: number;
}

export abstract class BaseAIService {
  protected apiKey: string;
  protected baseUrl: string;
  protected model: string;
  protected maxRetries: number;
  protected retryDelay: number;

  constructor(
    apiKey: string,
    baseUrl: string,
    model: string = 'deepseek-chat',
    maxRetries: number = 3,
    retryDelay: number = 1000
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  /**
   * 执行AI分析
   */
  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      // 验证请求
      this.validateRequest(request);
      
      // 构建提示词
      const prompt = this.buildPrompt(request);
      
      // 生成请求ID
      const requestId = this.generateRequestId();
      
      // 调用API
      const response = await this.makeAPIRequest(prompt);
      
      // 解析响应
      const analysis = this.parseResponse(response, request);
      
      // 计算处理时间
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        analysis,
        metadata: {
          requestId,
          processingTime,
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: this.handleAIError(error).message,
        analysis: {
          summary: 'Analysis failed',
          insights: [],
          recommendations: []
        },
        metadata: {
          requestId: this.generateRequestId(),
          processingTime,
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 验证请求参数
   */
  protected validateRequest(request: AIAnalysisRequest): void {
    if (!request.testType) {
      throw createError('VALIDATION_ERROR', 'Test type is required');
    }
    
    if (!Array.isArray(request.answers) || request.answers.length === 0) {
      throw createError('VALIDATION_ERROR', 'Answers array is required and cannot be empty');
    }
  }

  /**
   * 构建AI提示词
   */
  protected abstract buildPrompt(request: AIAnalysisRequest): string;

  /**
   * 调用AI服务
   */
  protected async callAIService(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const startTime = Date.now();
    
    try {
      // 验证请求
      this.validateRequest(request);
      
      // 构建提示词
      const prompt = this.buildPrompt(request);
      
      // 生成请求ID
      const requestId = this.generateRequestId();
      
      // 调用API
      const response = await this.makeAPIRequest(prompt);
      
      // 解析响应
      const analysis = this.parseResponse(response, request);
      
      // 计算处理时间
      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        analysis,
        metadata: {
          requestId,
          processingTime,
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      return {
        success: false,
        error: this.handleAIError(error).message,
        analysis: {
          summary: 'Analysis failed',
          insights: [],
          recommendations: []
        },
        metadata: {
          requestId: this.generateRequestId(),
          processingTime,
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 执行API请求
   */
  protected async makeAPIRequest(
    prompt: string,
    options?: AIAnalysisRequest['options']
  ): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.getMaxTokens(options),
        temperature: this.getTemperature(options),
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw this.createAPIError(response.status, errorData);
    }

    return await response.json();
  }

  /**
   * 判断是否应该重试
   */
  protected shouldRetry(error: Error, attempt: number): boolean {
    if (attempt >= this.maxRetries) {
      return false;
    }
    
    // 检查错误类型
    const retryableErrors = [
      'NETWORK_ERROR',
      'RATE_LIMITED',
      'AI_SERVICE_UNAVAILABLE'
    ];
    
    return retryableErrors.some(code => error.message.includes(code));
  }

  /**
   * 延迟函数
   */
  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 解析AI响应
   */
  protected abstract parseResponse(response: any, request: AIAnalysisRequest): AIAnalysisResponse['analysis'];

  /**
   * 处理AI错误
   */
  protected handleAIError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    
    // 处理API错误
    if (error.status === 429) {
      return createRateLimitError('AI service rate limited', error.retryAfter);
    }
    
    if (error.status >= 500) {
      return createAIServiceError('AI service temporarily unavailable');
    }
    
    return createAIServiceError('AI analysis failed');
  }

  /**
   * 创建API错误
   */
  protected createAPIError(status: number, data: any): Error {
    switch (status) {
      case 400:
        return createError('VALIDATION_ERROR', 'Invalid request to AI service');
      case 401:
        return createError('UNAUTHORIZED', 'Invalid API key for AI service');
      case 403:
        return createError('FORBIDDEN', 'Access denied to AI service');
      case 429:
        return createRateLimitError('AI service rate limited', data.retryAfter);
      case 500:
        return createAIServiceError('AI service internal error');
      case 503:
        return createAIServiceError('AI service unavailable');
      default:
        return createAIServiceError(`AI service error: ${status}`);
    }
  }

  /**
   * 获取系统提示词
   */
  protected getSystemPrompt(): string {
    return `You are an expert psychological and career assessment analyst. 
    Your task is to analyze test responses and provide insightful, accurate, and helpful analysis.
    Always respond in English and maintain a professional, supportive tone.
    Focus on providing actionable insights and practical recommendations.`;
  }

  /**
   * 获取最大token数
   */
  protected getMaxTokens(options?: AIAnalysisRequest['options']): number {
    switch (options?.detailLevel) {
      case 'comprehensive':
        return 2000;
      case 'detailed':
        return 1500;
      default:
        return 1000;
    }
  }

  /**
   * 获取温度参数
   */
  protected getTemperature(_options?: AIAnalysisRequest['options']): number {
    return 0.7; // 平衡创造性和一致性
  }

  /**
   * 生成请求ID
   */
  protected generateRequestId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取服务状态
   */
  async getServiceStatus(): Promise<{
    available: boolean;
    model: string;
    lastCheck: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return {
        available: response.ok,
        model: this.model,
        lastCheck: new Date().toISOString()
      };
    } catch {
      return {
        available: false,
        model: this.model,
        lastCheck: new Date().toISOString()
      };
    }
  }
}
