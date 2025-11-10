/**
 * 统一AI服务
 * 为所有测试模块提供到外部AI服务的安全代理
 * 实现速率限制、重试逻辑和错误处理
 * 使用统一的Prompt构建器确保语言风格一致性
 */

import { UnifiedPromptBuilder } from './UnifiedPromptBuilder';

export interface UserAnswer {
  questionId: string;
  answer: string | number;
  score?: number;
}

export interface TestContext {
  testType: string;
  language?: string;
  userId?: string;
  sessionId?: string;
}

export interface VarkScores {
  V: number;
  A: number;
  R: number;
  K: number;
}

export interface VarkAIInput {
  scores: VarkScores;
  primaryStyle: 'V' | 'A' | 'R' | 'K';
  secondaryStyles: ('V' | 'A' | 'R' | 'K')[];
}

export interface VarkAIOutput {
  styleAnalysis: string;
  learningAdvice: string;
  environmentSuggestions: string;
}

export class AIService {
  private apiKey: string;
  private baseURL: string;
  private maxRetries: number;
  private timeout: number;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
    this.maxRetries = 2; // 减少重试次数，避免总时间过长
    this.timeout = 45000; // 45 seconds - 确保在 Cloudflare Workers CPU 限制内
    
    // 安全日志 - 不暴露 API key
    // eslint-disable-next-line no-console
    console.log('AIService initialized:', this.apiKey ? 'API key configured' : 'NO API KEY');
  }

  /**
   * 调用DeepSeek API，包含重试逻辑
   */
  private async callDeepSeek(prompt: string, retryCount = 0, customTimeout?: number, maxTokens?: number): Promise<any> {
    try {
      // 使用自定义超时或默认超时
      const timeout = customTimeout || this.timeout;
      // 使用自定义max_tokens或默认值
      const tokens = maxTokens || 4000;
      
      // eslint-disable-next-line no-console
      console.log(`[AI Debug] Calling DeepSeek API (attempt ${retryCount + 1})`, {
        hasApiKey: !!this.apiKey,
        apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'NO KEY',
        promptLength: prompt.length,
        timeout: timeout,
        maxTokens: tokens,
        baseURL: this.baseURL
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestBody = {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: UnifiedPromptBuilder.getSystemRole() },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: tokens
      };
      
      const bodyString = JSON.stringify(requestBody);
      const bodySizeKB = bodyString.length / 1024;
      
      // eslint-disable-next-line no-console
      console.log(`[AI Debug] Request body size: ${bodySizeKB.toFixed(2)} KB, prompt length: ${prompt.length} chars`);
      
      const fetchStartTime = Date.now();
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: bodyString,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      const fetchTime = Date.now() - fetchStartTime;
      // eslint-disable-next-line no-console
      console.log(`[AI Debug] Fetch completed in ${fetchTime}ms, status: ${response.status}`);
      
      // 检查响应头
      const contentType = response.headers.get('content-type') || '';
      const contentLength = response.headers.get('content-length');
      // eslint-disable-next-line no-console
      console.log(`[AI Debug] Response headers: content-type=${contentType}, content-length=${contentLength}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error response');
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Response: ${errorText.substring(0, 200)}`);
      }

      // 在 Cloudflare Workers 环境中读取响应体
      // 剩余时间 = 总超时时间 - 已用时间 - 5秒缓冲
      const remainingTime = timeout - fetchTime - 5000;
      if (remainingTime < 10000) {
        // eslint-disable-next-line no-console
        console.warn(`[AI Debug] Low remaining time for response reading: ${remainingTime}ms`);
      }

      // 重要：在读取之前先克隆 response，避免流锁定问题
      // 这样如果一种方法失败，可以使用克隆的 response 尝试另一种方法
      const clonedResponseForFallback = response.clone();
      
      let data: any;
      let readMethod = 'unknown';
      const readStartTime = Date.now();
      
      try {
        // 方法1: 尝试直接使用 response.json()
        // 不使用 Promise.race，因为这会干扰流的读取
        // 如果超时，Worker 本身会终止，我们无法恢复
        try {
          // eslint-disable-next-line no-console
          console.log('[AI Debug] Attempting to read response body using response.json()');
          
          // 直接读取，不使用超时包装（因为 Worker 本身有超时限制）
          data = await response.json();
          
          const readTime = Date.now() - readStartTime;
          readMethod = 'response.json()';
          
          // eslint-disable-next-line no-console
          console.log(`[AI Debug] Successfully parsed response using ${readMethod} in ${readTime}ms`);
          
          // 验证响应数据
          if (!data) {
            throw new Error('Empty response data after parsing');
          }
          
          // eslint-disable-next-line no-console
          console.log('[AI Debug] Response keys:', Object.keys(data));
          
          // 检查是否有 choices 字段
          if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
            // eslint-disable-next-line no-console
            console.error('[AI Debug] Missing or empty choices array in response');
            // eslint-disable-next-line no-console
            console.error('[AI Debug] Response structure:', JSON.stringify(data).substring(0, 500));
            throw new Error('Invalid response structure: missing choices array');
          }
          
        } catch (jsonError) {
          // eslint-disable-next-line no-console
          console.log('[AI Debug] response.json() failed, trying arrayBuffer() method');
          // eslint-disable-next-line no-console
          console.log('[AI Debug] JSON parse error:', jsonError instanceof Error ? jsonError.message : String(jsonError));
          
          // 检查是否是流锁定错误
          if (jsonError instanceof Error && jsonError.message.includes('locked')) {
            // eslint-disable-next-line no-console
            console.log('[AI Debug] Stream locked, using cloned response for fallback');
          }
          
          // 方法2: 使用克隆的 response 读取 arrayBuffer
          // 使用克隆的 response，避免流锁定问题
          const arrayBufferStartTime = Date.now();
          
          try {
            const arrayBuffer = await clonedResponseForFallback.arrayBuffer();
            
            const arrayBufferTime = Date.now() - arrayBufferStartTime;
            readMethod = 'arrayBuffer()';
            
            // eslint-disable-next-line no-console
            console.log(`[AI Debug] Response arrayBuffer read in ${arrayBufferTime}ms, size: ${arrayBuffer.byteLength} bytes`);
            
            if (arrayBuffer.byteLength === 0) {
              throw new Error('Empty response body from AI service');
            }
            
            // 将 ArrayBuffer 转换为文本
            const decoder = new TextDecoder('utf-8');
            const responseText = decoder.decode(arrayBuffer);
            // eslint-disable-next-line no-console
            console.log(`[AI Debug] Response text length: ${responseText.length} chars`);
            
            if (!responseText || responseText.trim().length === 0) {
              throw new Error('Empty response text after decoding');
            }
            
            // eslint-disable-next-line no-console
            console.log('[AI Debug] Response text preview (first 200 chars):', responseText.substring(0, 200));
            
            data = JSON.parse(responseText);
            
            const totalReadTime = Date.now() - readStartTime;
            // eslint-disable-next-line no-console
            console.log(`[AI Debug] Successfully parsed response using ${readMethod} in ${totalReadTime}ms`);
            
            // 验证响应数据
            if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
              throw new Error('Invalid response structure: missing choices array');
            }
            
          } catch (arrayBufferError) {
            // eslint-disable-next-line no-console
            console.error('[AI Debug] arrayBuffer() method also failed:', arrayBufferError);
            throw jsonError; // 抛出原始错误
          }
        }
      } catch (parseError) {
        const totalReadTime = Date.now() - readStartTime;
        // eslint-disable-next-line no-console
        console.error('[AI Debug] Failed to parse response:', parseError);
        // eslint-disable-next-line no-console
        console.error('[AI Debug] Parse error details:', {
          name: parseError instanceof Error ? parseError.name : 'Unknown',
          message: parseError instanceof Error ? parseError.message : String(parseError),
          stack: parseError instanceof Error ? parseError.stack?.substring(0, 500) : 'No stack',
          fetchTime: fetchTime,
          readTime: totalReadTime,
          remainingTime: remainingTime,
          readMethod: readMethod
        });
        
        // 检查是否是流锁定错误
        if (parseError instanceof Error && parseError.message.includes('locked')) {
          throw new Error(`Response stream is locked. This may occur if the response body is too large or reading takes too long. Read time: ${totalReadTime}ms, Remaining time: ${remainingTime}ms`);
        }
        
        // 检查是否是超时错误
        if (parseError instanceof Error && (
          parseError.message.includes('timeout') || 
          parseError.message.includes('aborted') ||
          parseError.name === 'AbortError'
        )) {
          throw new Error(`Response body reading timeout after ${totalReadTime}ms. The AI response is too large or the connection is too slow. Remaining time: ${remainingTime}ms`);
        }
        
        // 检查是否是网络连接错误
        if (parseError instanceof Error && parseError.message.includes('Network connection lost')) {
          throw new Error(`Network connection lost while reading response body. This may be a Cloudflare Workers local development environment limitation. Please try deploying to staging/production or check your network connection.`);
        }
        
        throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }
      
      // eslint-disable-next-line no-console
      console.log('AI raw response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      // 详细记录错误信息，帮助排查问题
      const errorDetails = {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        isAbortError: error instanceof Error && error.name === 'AbortError',
        retryCount,
        maxRetries: this.maxRetries,
        timeout: customTimeout || this.timeout,
        promptLength: prompt.length
      };
      
      // eslint-disable-next-line no-console
      console.error(`[AI Debug] Error in attempt ${retryCount + 1}:`, errorDetails);
      // eslint-disable-next-line no-console
      console.error(`[AI Debug] Error stack:`, error instanceof Error ? error.stack?.substring(0, 500) : 'No stack trace');

      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        const delayMs = 1000 * Math.pow(2, retryCount);
        // eslint-disable-next-line no-console
        console.log(`[AI Debug] Retrying DeepSeek API call (attempt ${retryCount + 1}/${this.maxRetries}) after ${delayMs}ms delay`);
        await this.delay(delayMs);
        return this.callDeepSeek(prompt, retryCount + 1, customTimeout, maxTokens);
      }

      // eslint-disable-next-line no-console
      console.error('[AI Debug] DeepSeek API call failed after all retries:', errorDetails);
      
      // 将错误转换为更友好的消息
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${(customTimeout || this.timeout) / 1000} seconds. The AI analysis is taking longer than expected. Please try again.`);
        }
        // 处理连接关闭错误
        if (error.message.includes('ERR_CONNECTION_CLOSED') || 
            error.message.includes('connection closed') ||
            error.message.includes('Connection closed') ||
            error.message.includes('Network connection lost') || 
            error.message.includes('fetch')) {
          throw new Error(`Network connection lost. The server may be processing your request. Please try again.`);
        }
      }
      
      throw error;
    }
  }

  /**
   * 检查错误是否可重试
   */
  private isRetryableError(error: any): boolean {
    if (error.name === 'AbortError') {
      return true; // 超时错误可以重试
    }
    
    if (error.message && error.message.includes('HTTP')) {
      const statusCode = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || '0');
      // 5xx 错误可重试，4xx 错误不可重试
      return statusCode >= 500;
    }
    
    // 网络错误可重试（包括各种网络连接错误）
    const errorMessage = error.message?.toLowerCase() || '';
    return errorMessage.includes('network') ||
           errorMessage.includes('connection') ||
           errorMessage.includes('fetch') ||
           errorMessage.includes('timeout') ||
           errorMessage.includes('econnreset') ||
           errorMessage.includes('enotfound') ||
           errorMessage.includes('etimedout');
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy' | 'limited'; details?: string }> {
    if (!this.apiKey) {
      return { status: 'limited', details: 'No API key provided' };
    }

    try {
      await this.callDeepSeek('Hello');
      return { status: 'healthy', details: 'API is responding normally' };
    } catch (error) {
      return { status: 'unhealthy', details: `API error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  // ==================== 心理模块方法 ====================

  /**
   * 分析MBTI测试结果
   */
  async analyzeMBTI(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'mbti');
    // eslint-disable-next-line no-console
    console.log('MBTI prompt sent to AI:', prompt);
    const response = await this.callDeepSeek(prompt);
    return this.parseMBTIResponse(response);
    } catch (error) {
      // 不再返回默认结果，而是重新抛出错误以支持重试
      throw new Error(`MBTI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析PHQ-9测试结果
   */
  async analyzePHQ9(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'phq9');
    const response = await this.callDeepSeek(prompt);
    return this.parsePHQ9Response(response);
    } catch (error) {
      // 不再返回默认结果，而是重新抛出错误以支持重试
      throw new Error(`PHQ-9 analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析情商测试结果
   */
  async analyzeEQ(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'eq');
    // eslint-disable-next-line no-console
    console.log('EQ prompt sent to AI:', prompt);
    const response = await this.callDeepSeek(prompt);
    return this.parseEQResponse(response);
    } catch (error) {
      // 不再返回默认结果，而是重新抛出错误以支持重试
      throw new Error(`EQ analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析幸福指数测试结果
   */
  async analyzeHappiness(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'happiness');
    // eslint-disable-next-line no-console
    console.log('Happiness prompt sent to AI:', prompt);
    const response = await this.callDeepSeek(prompt);
    return this.parseHappinessResponse(response);
    } catch (error) {
      // 不再返回默认结果，而是重新抛出错误以支持重试
      throw new Error(`Happiness analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== 关系模块方法 ====================

  /**
   * 分析爱情语言测试结果
   */
  async analyzeLoveLanguage(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'loveLanguage');
    const response = await this.callDeepSeek(prompt);
    return this.parseLoveLanguageResponse(response);
    } catch (error) {
      throw new Error(`Love Language analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析爱情风格测试结果
   */
  async analyzeLoveStyle(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'loveStyle');
    const response = await this.callDeepSeek(prompt);
    return this.parseLoveStyleResponse(response);
    } catch (error) {
      throw new Error(`Love Style analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析人际技能测试结果
   */
  async analyzeInterpersonal(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'interpersonal');
    const response = await this.callDeepSeek(prompt);
    return this.parseInterpersonalResponse(response);
    } catch (error) {
      throw new Error(`Interpersonal analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== 职业模块方法 ====================

  /**
   * 分析霍兰德职业兴趣测试结果
   */
  async analyzeHollandCode(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'holland');
    const response = await this.callDeepSeek(prompt);
    return this.parseHollandResponse(response);
    } catch (error) {
      throw new Error(`Holland Code analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析DISC行为风格测试结果
   */
  async analyzeDISC(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'disc');
    const response = await this.callDeepSeek(prompt);
    return this.parseDISCResponse(response);
    } catch (error) {
      throw new Error(`DISC analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析领导力测试结果
   */
  async analyzeLeadership(answers: UserAnswer[], context: TestContext): Promise<any> {
    try {
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'leadership');
    const response = await this.callDeepSeek(prompt);
    return this.parseLeadershipResponse(response);
    } catch (error) {
      throw new Error(`Leadership analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== 学习能力模块方法 ====================

  /**
   * 分析VARK学习风格测试结果
   */
  async analyzeVARK(_scores: VarkScores, _primaryStyle: string, _secondaryStyles: string[], answers: UserAnswer[]): Promise<VarkAIOutput> {
    try {
    const context: TestContext = { testType: 'vark' };
    const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'vark');
    const response = await this.callDeepSeek(prompt);
    return this.parseVARKResponse(response);
    } catch (error) {
      throw new Error(`VARK analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Raven removed

  // cognitive removed

  // ==================== 占星模块AI分析方法 ====================

  /**
   * 分析运势结果
   */
  async analyzeFortune(zodiacSign: string, timeframe: string, userContext: any): Promise<any> {
    try {
      const context: TestContext = { 
        testType: 'fortune',
        language: 'en',
        ...userContext 
      };
      
      // 构建占星分析输入
      const answers: UserAnswer[] = [
        { questionId: 'zodiac_sign', answer: zodiacSign },
        { questionId: 'timeframe', answer: timeframe },
        { questionId: 'analysis_type', answer: 'fortune' }
      ];
      
      const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'fortune');
      const response = await this.callDeepSeek(prompt);
      return this.parseFortuneResponse(response);
    } catch (error) {
      throw new Error(`Fortune analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析星座配对兼容性
   */
  async analyzeCompatibility(sign1: string, sign2: string, relationType: string, userContext: any): Promise<any> {
    try {
      const context: TestContext = { 
        testType: 'compatibility',
        language: 'en',
        ...userContext 
      };
      
      // 构建配对分析输入
      const answers: UserAnswer[] = [
        { questionId: 'sign1', answer: sign1 },
        { questionId: 'sign2', answer: sign2 },
        { questionId: 'relation_type', answer: relationType },
        { questionId: 'analysis_type', answer: 'compatibility' }
      ];
      
      const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'compatibility');
      const response = await this.callDeepSeek(prompt);
      return this.parseCompatibilityResponse(response);
    } catch (error) {
      throw new Error(`Compatibility analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 分析出生星盘
   */
  async analyzeBirthChart(birthData: any, userContext: any): Promise<any> {
    try {
      const context: TestContext = { 
        testType: 'birth_chart',
        language: 'en',
        ...userContext 
      };
      
      // 构建星盘分析输入
      const answers: UserAnswer[] = [
        { questionId: 'birth_date', answer: birthData.birthDate },
        { questionId: 'birth_time', answer: birthData.birthTime || 'unknown' },
        { questionId: 'birth_location', answer: birthData.birthLocation },
        { questionId: 'analysis_type', answer: 'birth_chart' }
      ];
      
      const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'birth_chart');
      const response = await this.callDeepSeek(prompt);
      return this.parseBirthChartResponse(response);
    } catch (error) {
      throw new Error(`Birth chart analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== 响应解析方法 ====================


  private parseMBTIResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        // eslint-disable-next-line no-console
        console.error('[AIService] MBTI response content is empty');
        throw new Error('Empty response content');
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI raw response length: ${content.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI raw response preview (first 500 chars):`, content.substring(0, 500));
      
      // 处理模型返回中可能包含的 ```json 代码块，并使用健壮解析
      const cleaned = this.sanitizeAIJSON(content);
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI cleaned response length: ${cleaned.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI cleaned response preview (first 500 chars):`, cleaned.substring(0, 500));
      
      const parsed = this.parseJSONRobust(cleaned, 'MBTI');
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI JSON parsed successfully, parsed keys:`, Object.keys(parsed));
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI parsed has personalityType:`, !!parsed.personalityType, parsed.personalityType);
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI parsed has detailedAnalysis:`, !!parsed.detailedAnalysis);
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI parsed has type:`, !!parsed.type, parsed.type);
      
      // 填充必要字段的默认值，避免前端空白
      const safe: any = {
        personalityType: parsed.personalityType || parsed.type || 'UNKNOWN',
        typeName: parsed.typeName || 'Unknown Type',
        typeDescription: parsed.typeDescription || 'No description available',
        detailedAnalysis: parsed.detailedAnalysis || 'No detailed analysis available',
        dimensions: Array.isArray(parsed.dimensions) ? parsed.dimensions : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        blindSpots: Array.isArray(parsed.blindSpots) ? parsed.blindSpots : [],
        careerSuggestions: Array.isArray(parsed.careerSuggestions) ? parsed.careerSuggestions : [],
        relationshipPerformance: {
          workplace: {
            leadershipStyle: parsed?.relationshipPerformance?.workplace?.leadershipStyle || 'Not specified',
            teamCollaboration: parsed?.relationshipPerformance?.workplace?.teamCollaboration || 'Not specified',
            decisionMaking: parsed?.relationshipPerformance?.workplace?.decisionMaking || 'Not specified',
          },
          family: {
            role: parsed?.relationshipPerformance?.family?.role || 'Not specified',
            communication: parsed?.relationshipPerformance?.family?.communication || 'Not specified',
            emotionalExpression: parsed?.relationshipPerformance?.family?.emotionalExpression || 'Not specified',
          },
          friendship: {
            preferences: parsed?.relationshipPerformance?.friendship?.preferences || 'Not specified',
            socialPattern: parsed?.relationshipPerformance?.friendship?.socialPattern || 'Not specified',
            supportStyle: parsed?.relationshipPerformance?.friendship?.supportStyle || 'Not specified',
          },
          romance: {
            datingStyle: parsed?.relationshipPerformance?.romance?.datingStyle || 'Not specified',
            emotionalNeeds: parsed?.relationshipPerformance?.romance?.emotionalNeeds || 'Not specified',
            relationshipPattern: parsed?.relationshipPerformance?.romance?.relationshipPattern || 'Not specified',
          }
        },
        relationshipCompatibility: parsed.relationshipCompatibility || {}
      }
      
      // 验证关键字段是否存在
      if (!safe.detailedAnalysis || safe.detailedAnalysis === 'No detailed analysis available') {
        // eslint-disable-next-line no-console
        console.warn('[AIService] MBTI response missing detailedAnalysis, using fallback');
      }
      
      if (!safe.personalityType || safe.personalityType === 'UNKNOWN') {
        // eslint-disable-next-line no-console
        console.warn('[AIService] MBTI response missing personalityType, using fallback');
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] MBTI safe result prepared, personalityType: ${safe.personalityType}, has detailedAnalysis: ${!!safe.detailedAnalysis}`);
      
      return safe;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[AIService] MBTI parse error:', error);
      // eslint-disable-next-line no-console
      console.error('[AIService] MBTI parse error details:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 1000)
      } : error);
      throw new Error(`Failed to parse MBTI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parsePHQ9Response(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      
      // 使用robust JSON解析
      const parsed = this.parseJSONRobust(cleaned, 'PHQ-9');
      
      // 验证必要字段
      if (!parsed.totalScore || !parsed.severity) {
        throw new Error('Missing required fields: totalScore or severity');
      }
      
      // 验证其他必要字段
      if (!parsed.riskLevel || !parsed.riskLevelName || !parsed.riskDescription) {
        throw new Error('Missing required fields: riskLevel, riskLevelName, or riskDescription');
      }
      
      if (!parsed.lifestyleInterventions) {
        throw new Error('Missing required field: lifestyleInterventions');
      }
      
      if (!parsed.followUpAdvice || !parsed.physicalAnalysis || !parsed.psychologicalAnalysis) {
        throw new Error('Missing required fields: followUpAdvice, physicalAnalysis, or psychologicalAnalysis');
      }
      
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse PHQ-9 response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseEQResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 解析AI响应
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      const analysis = parsed.analysis || parsed;

      // 验证必要字段
      if (!analysis.overallLevel || !analysis.dimensions) {
        throw new Error('Missing required fields: overallLevel or dimensions');
      }

      // 填充安全的数据结构
      const safe = {
        overallLevel: analysis.overallLevel || 'Average',
        levelName: analysis.levelName || 'Emotional Intelligence Assessment',
        overallAnalysis: analysis.overallAnalysis || 'No analysis available',
        dimensions: Array.isArray(analysis.dimensions) ? analysis.dimensions.map((dim: any) => ({
          name: dim.name || 'Unknown Dimension',
          level: dim.level || 'Average',
          description: dim.description || 'No description available',
          strengths: Array.isArray(dim.strengths) ? dim.strengths : []
        })) : [],
        improvementPlan: {
          shortTerm: Array.isArray(analysis.improvementPlan?.shortTerm) ? analysis.improvementPlan.shortTerm : [],
          longTerm: Array.isArray(analysis.improvementPlan?.longTerm) ? analysis.improvementPlan.longTerm : [],
          dailyPractices: Array.isArray(analysis.improvementPlan?.dailyPractices) ? analysis.improvementPlan.dailyPractices : []
        }
      };

      return safe;
    } catch (error) {
      throw new Error(`Failed to parse EQ response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 通用的robust JSON解析方法
   */
  private parseJSONRobust(cleaned: string, testType: string): any {
    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      // eslint-disable-next-line no-console
      console.warn(`[AIService] ${testType}: First JSON parse attempt failed, trying alternative method:`, parseError instanceof Error ? parseError.message : 'Unknown error');
      // eslint-disable-next-line no-console
      console.warn(`[AIService] ${testType}: Failed JSON content preview (last 500 chars):`, cleaned.substring(Math.max(0, cleaned.length - 500)));
      
      // 尝试更激进的清理方法
      let alternativeText = cleaned;
      
      // 移除所有换行符
      alternativeText = alternativeText.replace(/\n/g, ' ');
      alternativeText = alternativeText.replace(/\r/g, ' ');
      alternativeText = alternativeText.replace(/\t/g, ' ');
      
      // 移除多余的空格
      alternativeText = alternativeText.replace(/\s+/g, ' ');
      
      try {
        const parsed = JSON.parse(alternativeText);
        // eslint-disable-next-line no-console
        console.log(`[AIService] ${testType}: JSON parse succeeded with alternative method`);
        return parsed;
      } catch (secondError) {
        // eslint-disable-next-line no-console
        console.warn(`[AIService] ${testType}: Second JSON parse attempt also failed:`, secondError instanceof Error ? secondError.message : 'Unknown error');
        // 如果仍然失败，尝试修复截断的JSON
        try {
          const repaired = this.repairTruncatedJSON(alternativeText, testType);
          // eslint-disable-next-line no-console
          console.log(`[AIService] ${testType}: JSON repair succeeded`);
          return repaired;
        } catch (repairError) {
          // eslint-disable-next-line no-console
          console.error(`[AIService] ${testType}: JSON repair also failed:`, repairError instanceof Error ? repairError.message : 'Unknown error');
          throw new Error(`Failed to parse ${testType} JSON response after all attempts: ${repairError instanceof Error ? repairError.message : 'Unknown error'}`);
        }
      }
    }
  }

  /**
   * 修复被截断的JSON响应
   */
  private repairTruncatedJSON(jsonText: string, testType: string): any {
    try {
      // 检查是否以不完整的字符串结尾
      if (jsonText.endsWith('"') || jsonText.endsWith('"Your body is showing clear signs')) {
        // 移除不完整的字符串并添加闭合
        const lastCompleteBrace = jsonText.lastIndexOf('}');
        if (lastCompleteBrace > 0) {
          const truncated = jsonText.substring(0, lastCompleteBrace + 1);
          return JSON.parse(truncated);
        }
      }
      
      // 如果JSON以不完整的对象结尾，尝试添加缺失的闭合括号
      let braceCount = 0;
      let bracketCount = 0;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < jsonText.length; i++) {
        const char = jsonText[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') {
            braceCount++;
          } else if (char === '}') {
            braceCount--;
          } else if (char === '[') {
            bracketCount++;
          } else if (char === ']') {
            bracketCount--;
          }
        }
      }
      
      // 添加缺失的闭合括号
      let repaired = jsonText;
      while (bracketCount > 0) {
        repaired += ']';
        bracketCount--;
      }
      while (braceCount > 0) {
        repaired += '}';
        braceCount--;
      }
      
      return JSON.parse(repaired);
    } catch (error) {
      // 如果修复失败，返回一个基本的错误响应
      // eslint-disable-next-line no-console
      console.error(`${testType}: Failed to repair truncated JSON:`, error);
      throw new Error(`AI response was truncated and could not be repaired for ${testType}`);
    }
  }

  /**
   * 清洗大模型返回的 JSON 字符串，移除代码块与多余前后缀
   */
  private sanitizeAIJSON(raw: string): string {
    let text = (raw || '').trim();
    
    // 去掉 ```json ``` 或 ``` 包裹
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // 截取第一个 { 到最后一个 } 之间内容
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end >= start) {
      text = text.slice(start, end + 1);
    }
    
    // 尝试修复常见的JSON格式问题
    // 1. 移除多余的逗号
    text = text.replace(/,(\s*[}\]])/g, '$1');
    
    // 2. 修复数组中的语法错误 - 确保数组元素之间有逗号
    text = text.replace(/(\]\s*\[)/g, '],[');
    text = text.replace(/(}\s*{)/g, '},{');
    text = text.replace(/(\]\s*{)/g, '],{');
    text = text.replace(/(}\s*\[)/g, '},[');
    
    // 3. 修复换行问题 - 只处理JSON结构外的换行
    text = text.replace(/\n\s*(?=\s*[}\]])/g, ' ');
    text = text.replace(/\n\s*(?=\s*[,:])/g, ' ');
    
    // 4. 修复分数表达式 - 将 "48/50" 转换为数字
    text = text.replace(/"score":\s*(\d+)\/(\d+)/g, '"score": $1');
    text = text.replace(/"maxScore":\s*(\d+)\/(\d+)/g, '"maxScore": $2');
    
    // 添加调试日志
    // eslint-disable-next-line no-console
    console.log('Raw AI response length:', raw.length);
    // eslint-disable-next-line no-console
    console.log('Sanitized AI JSON (first 500 chars):', text.substring(0, 500));
    // eslint-disable-next-line no-console
    console.log('Sanitized AI JSON (last 500 chars):', text.substring(Math.max(0, text.length - 500)));
    // eslint-disable-next-line no-console
    console.log('Sanitized AI JSON length:', text.length);
    
    return text;
  }

  // removed unused helper: determineLearningMode

  // removed unused helper: getDominantModes

  // removed unused helper: getModeDescription

  // removed unused helper: assessFlexibility

  // removed unused helper: calculateVariance

  // removed unused helper: getPhysicalEnvironmentPreference

  // removed unused helper: getSocialEnvironmentPreference

  // removed unused helper: getTechnologyPreferences

  // removed unused helper: getTimePreferences

  // removed unused helper: identifyPotentialDifficulties

  // removed unused helper: getAdaptationStrategies

  // removed unused helper: getSupportNeeds

  // removed unused helper: getOptimalConditions

  // removed unused helper: predictPerformance

  // removed unused helper: identifyImprovementAreas

  // removed unused helper: getCurrentStrengths

  // removed unused helper: getDevelopmentGoals

  // removed unused helper: getPracticeActivities

  private parseHappinessResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 解析AI响应
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      const analysis = parsed.analysis || parsed;

      // 直接返回AI数据，与前端期望的格式完全匹配
      return {
        overallAnalysis: analysis.overallAnalysis,
        domains: analysis.domains,
        improvementPlan: analysis.improvementPlan
      };
    } catch (error) {
      throw new Error(`Failed to parse Happiness response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseLoveLanguageResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        // eslint-disable-next-line no-console
        console.error('[AIService] Love Language response content is empty');
        throw new Error('Empty response content');
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language raw response length: ${content.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language raw response preview (first 500 chars):`, content.substring(0, 500));
      
      // 处理模型返回中可能包含的 ```json 代码块，并使用健壮解析
      const cleaned = this.sanitizeAIJSON(content);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language cleaned response length: ${cleaned.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language cleaned response preview (first 500 chars):`, cleaned.substring(0, 500));
      
      // 使用健壮的JSON解析方法，与PHQ9和Happiness保持一致
      const parsed = this.parseJSONRobust(cleaned, 'Love Language');
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language JSON parsed successfully, parsed keys:`, Object.keys(parsed));
      
      // 验证必要字段
      if (!parsed.primaryLanguage || !parsed.analysis) {
        // eslint-disable-next-line no-console
        console.warn('[AIService] Love Language response missing required fields, checking alternatives');
        // 尝试使用备用字段名
        if (!parsed.primaryLanguage && parsed.primary) {
          parsed.primaryLanguage = parsed.primary;
        }
        if (!parsed.analysis && parsed.interpretation) {
          parsed.analysis = parsed.interpretation;
        }
        
        // 如果仍然缺少必要字段，抛出错误
        if (!parsed.primaryLanguage || !parsed.analysis) {
          throw new Error('Missing required fields: primaryLanguage or analysis');
        }
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Language parse successful, primaryLanguage: ${parsed.primaryLanguage}`);
      
      return parsed;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[AIService] Love Language parse error:', error);
      // eslint-disable-next-line no-console
      console.error('[AIService] Love Language parse error details:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 1000)
      } : error);
      throw new Error(`Failed to parse Love Language response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseLoveStyleResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      return parsed;
    } catch (error) {
      throw new Error(`Failed to parse Love Style response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseInterpersonalResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse Interpersonal response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseHollandResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse Holland response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseDISCResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse DISC response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseLeadershipResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Failed to parse Leadership response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseTarotResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.sessionId || !parsed.overall_interpretation || !parsed.card_interpretations) {
        throw new Error('Missing required fields in tarot response');
      }
      
      return parsed;
    } catch (error) {
      // 如果解析失败，返回默认的塔罗牌解读结构
      return {
        sessionId: `tarot_${Date.now()}`,
        overall_interpretation: 'The cards reveal important insights about your current situation. Each card position offers specific guidance for your journey ahead.',
        card_interpretations: [],
        synthesis: 'The cards work together to provide a comprehensive view of your situation and the guidance you need.',
        action_guidance: [
          'Reflect on the messages from each card',
          'Consider how the guidance applies to your current situation',
          'Take time to integrate the insights into your daily life'
        ],
        timing_advice: 'The timing for action depends on your readiness and the specific guidance from the cards.',
        emotional_insights: 'The cards reflect your current emotional state and offer guidance for emotional growth.',
        spiritual_guidance: 'These cards connect to deeper spiritual truths and your higher purpose.',
        warning_signs: 'Pay attention to any patterns or themes that suggest caution or careful consideration.',
        opportunities: 'The cards highlight positive opportunities and potential outcomes for your situation.',
        generated_at: new Date().toISOString()
      };
    }
  }

  // VARK AI响应解析辅助方法
  // removed unused helper: extractScoresFromAnalysis

  // removed unused helper: extractCharacteristics


  private parseVARKResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 现在AI应该直接返回我们期望的格式，不需要复杂的映射
      if (parsed && typeof parsed === 'object') {
        // 情况1：AI已返回统一schema（顶层包含 primaryStyle/scores）
        if (parsed.primaryStyle || parsed.scores) {
          return {
            primaryStyle: parsed.primaryStyle || 'Unknown',
            secondaryStyle: parsed.secondaryStyle || '',
            dominantStyle: parsed.primaryStyle || 'Unknown',
            scores: parsed.scores || { V: 0, A: 0, R: 0, K: 0 },
            allScores: parsed.scores || { V: 0, A: 0, R: 0, K: 0 },
            analysis: typeof parsed.analysis === 'string' ? parsed.analysis : 'Learning style analysis completed.',
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
            studyTips: Array.isArray(parsed.studyTips) ? parsed.studyTips : [],
            learningStrategies: Array.isArray(parsed.learningStrategies) ? parsed.learningStrategies : [],
            learningProfile: parsed.learningProfile || {},
            learningStrategiesImplementation: parsed.learningStrategiesImplementation || {},
            learningEffectiveness: parsed.learningEffectiveness || {},
            encouragement: parsed.encouragement || 'Continue exploring your learning preferences.',
            environmentSuggestions: parsed.environmentSuggestions || 'Set up learning environments that support your style.'
          };
        }

        // 情况2：AI返回 analysis 对象（当前日志所示结构）
        if (parsed.analysis && typeof parsed.analysis === 'object') {
          const a = parsed.analysis as any;
          // 兼容字段提取（两套命名）
          const lspSnake = a.learning_style_profile || a.learning_profile || {};
          const lspCamel = a.learningStyleProfile || {};
          const primaryStyle = a.primaryLearningStyle || lspCamel.primaryStyle || lspSnake.primary_style || lspSnake.primary_modalities?.[0] || 'Unknown';
          const secondaryStyle = a.secondaryLearningStyle || lspCamel.secondaryStyle || lspSnake.secondary_style || lspSnake.secondary_styles?.[0] || (Array.isArray(a.secondaryLearningStyles) ? a.secondaryLearningStyles[0] : '');

          // 分数映射：支持 scoreBreakdown 数字，或 modality_breakdown 的 High/Moderate/Low 文本
          const sb = a.scoreBreakdown || a.score_breakdown || {};
          const scoreFromLabel = (label: any): number => {
            if (typeof label === 'number') {
              return label;
            }
            const t = String(label || '').toLowerCase();
            if (t.includes('very high') || t === 'very_high') {
              return 9;
            }
            if (t.includes('high')) {
              return 8;
            }
            if (t.includes('moderate')) {
              return 6;
            }
            if (t.includes('low')) {
              return 4;
            }
            return 0;
          };
          let mappedScores: VarkScores = {
            V: (sb.Visual ?? sb.visual ?? sb.V ?? 0) as number,
            A: (sb.Aural ?? sb.Auditory ?? sb.aural ?? sb.A ?? 0) as number,
            R: (sb['Read/Write'] ?? sb.readWrite ?? sb.read_write ?? sb.R ?? 0) as number,
            K: (sb.Kinesthetic ?? sb.kinesthetic ?? sb.K ?? 0) as number
          };
          if (!mappedScores.V && !mappedScores.A && !mappedScores.R && !mappedScores.K && a.modality_breakdown) {
            const md = a.modality_breakdown;
            mappedScores = {
              V: scoreFromLabel(md.visual?.score),
              A: scoreFromLabel(md.aural?.score),
              R: scoreFromLabel(md.read_write?.score),
              K: scoreFromLabel(md.kinesthetic?.score)
            };
          }

          // 建议与强项
          const recsFromModality = () => {
            const m = a.modality_breakdown || {};
            const collect = (arr: any): string[] => Array.isArray(arr) ? arr : [];
            return [
              ...collect(m.kinesthetic?.recommendations),
              ...collect(m.read_write?.recommendations),
              ...collect(m.visual?.recommendations),
              ...collect(m.aural?.recommendations)
            ];
          };
          const strengthsFromModality = () => {
            const m = a.modality_breakdown || {};
            const collect = (arr: any): string[] => Array.isArray(arr) ? arr : [];
            return [
              ...collect(m.kinesthetic?.strengths),
              ...collect(m.read_write?.strengths),
              ...collect(m.visual?.strengths),
              ...collect(m.aural?.strengths)
            ];
          };
          // 兼容多处建议来源：learningRecommendations / learning_recommendations / learning_strategies / detailedInsights.recommendedStrategies / modality_breakdown
          const detailed = a.detailedInsights || a.detailed_insights || {};
          const recsFromDetailed: string[] = Array.isArray(detailed.recommendedStrategies) ? detailed.recommendedStrategies : [];
          const recs: string[] = Array.isArray(a.learningRecommendations) ? a.learningRecommendations : Array.isArray(a.learning_recommendations) ? a.learning_recommendations : [
            ...(a.learning_strategies?.optimal_approaches || []),
            ...(a.learning_strategies?.retention_techniques || []),
            ...recsFromModality(),
            ...recsFromDetailed
          ];
          const strengthsFromDetailed: string[] = Array.isArray(detailed.learningStrengths) ? detailed.learningStrengths : [];
          const strengths: string[] = Array.isArray(a.strengths) ? a.strengths : (strengthsFromDetailed.length ? strengthsFromDetailed : strengthsFromModality());
          const analysisText: string = a.encouragement || a.encouraging_note || a.overview || a.profile_description || a.comprehensive_insights?.primary_analysis || detailed?.dominantStyle?.description || a.detailedInterpretation?.kinestheticDominance || 'Learning style analysis completed.';

          // 计算总题量与百分比，构造 allStyles
          const totalCount = Math.max(1, (mappedScores.V || 0) + (mappedScores.A || 0) + (mappedScores.R || 0) + (mappedScores.K || 0));
          const allStyles = [
            { style: 'Visual', key: 'V', score: mappedScores.V },
            { style: 'Aural', key: 'A', score: mappedScores.A },
            { style: 'Read/Write', key: 'R', score: mappedScores.R },
            { style: 'Kinesthetic', key: 'K', score: mappedScores.K }
          ].map(s => ({
            style: s.style,
            score: s.score,
            percentage: totalCount > 0 ? Math.round((s.score / totalCount) * 100) : 0
          }));

          // 规范主/副风格：若缺失或为 Unknown，则由分数推断
          const styleDisplayName = (key: string): string => (
            key === 'V' ? 'Visual' : key === 'A' ? 'Auditory' : key === 'R' ? 'Read/Write' : key === 'K' ? 'Kinesthetic' : key
          );
          const sortedByScore = [
            ['V', mappedScores.V],
            ['A', mappedScores.A],
            ['R', mappedScores.R],
            ['K', mappedScores.K]
          ].sort((a, b) => (b[1] as number) - (a[1] as number));
          const top0 = sortedByScore[0];
          const top1 = sortedByScore[1];
          const computedPrimary = top0 ? styleDisplayName(top0[0] as string) : '';
          const computedSecondary = top1 && (top1[1] as number) > 0 ? styleDisplayName(top1[0] as string) : '';

          const normalizeStyle = (name: string): string => {
            const n = String(name || '').toLowerCase();
            if (n.startsWith('vis')) { return 'Visual'; }
            if (n.startsWith('aur') || n.startsWith('aud')) { return 'Auditory'; }
            if (n.includes('read')) { return 'Read/Write'; }
            if (n.startsWith('kin')) { return 'Kinesthetic'; }
            return name || '';
          };

          const finalPrimary = normalizeStyle(primaryStyle) || computedPrimary;
          const finalSecondary = normalizeStyle(secondaryStyle) || computedSecondary;

          // 基于主风格的简单 fallback 生成器
          const fallbackEnvByPrimary = (ps: string): string[] => {
            switch ((ps || '').toLowerCase()) {
              case 'visual': return ['Well-lit desk with visual aids and whiteboard'];
              case 'aural': return ['Quiet room with good acoustics and audio tools'];
              case 'read/write':
              case 'readwrite': return ['Quiet library-like space with text resources'];
              case 'kinesthetic': return ['Open area for movement and hands-on activities'];
              default: return ['Flexible learning environment'];
            }
          };
          const fallbackTimeByPrimary = (ps: string): string => {
            switch ((ps || '').toLowerCase()) {
              case 'visual': return 'Structured blocks with visual breaks';
              case 'aural': return 'Sessions aligned to lectures/discussions';
              case 'read/write':
              case 'readwrite': return 'Longer focused reading/writing windows';
              case 'kinesthetic': return 'Short active sessions with frequent breaks';
              default: return 'Balanced schedule with regular breaks';
            }
          };

          // 从 interpretation_notes 中提炼适应性
          const flexNote: string = a.interpretation_notes?.flexibility_note || '';
          const toPoints = (txt: string): string[] => {
            const s = String(txt || '').trim();
            if (!s) {
              return [];
            }
            return s
              .split(/[.;\n]/)
              .map(t => t.trim())
              .filter(Boolean)
              .slice(0, 3);
          };
          const adaptabilityChallenges = toPoints(flexNote).slice(0, 1);
          const adaptabilityStrategies = toPoints(flexNote).slice(1, 3);

          // Environment Setup 补足 social/technology/schedule
          const envPhysical = a.learning_strategies?.study_environment || fallbackEnvByPrimary(primaryStyle)[0];
          const envSocial: string[] = primaryStyle.toLowerCase() === 'aural' ? ['Group discussions', 'Peer teaching'] : ['Individual focus with periodic check-ins'];
          const envTech: string[] = (
            primaryStyle.toLowerCase() === 'visual' ? ['Mind maps', 'Diagram tools'] :
            primaryStyle.toLowerCase() === 'aural' ? ['Podcast apps', 'Voice recorder'] :
            primaryStyle.toLowerCase() === 'read/write' ? ['Note apps', 'E-books'] :
            ['Simulations', 'Interactive labs']
          );
          const envSchedule: string[] = [fallbackTimeByPrimary(primaryStyle)];

          // Improvement areas：找低分维度给建议
          const entries = [
            ['Visual', mappedScores.V],
            ['Aural', mappedScores.A],
            ['Read/Write', mappedScores.R],
            ['Kinesthetic', mappedScores.K]
          ] as Array<[string, number]>;
          const minScore = Math.min(...entries.map(e => e[1]));
          const lowDims = entries.filter(e => e[1] === minScore).map(e => e[0]).slice(0, 2);
          const improveFor = (d: string): string[] => {
            switch (d) {
              case 'Visual': return ['Practice visual summaries', 'Use diagrams/flowcharts'];
              case 'Aural': return ['Explain concepts aloud', 'Join discussion groups'];
              case 'Read/Write': return ['Write structured notes', 'Summarize in your own words'];
              case 'Kinesthetic': return ['Do hands-on mini projects', 'Role-play or simulate tasks'];
              default: return [];
            }
          };
          const improvementAreas: string[] = lowDims.flatMap(improveFor).slice(0, 4);

          const resultObject = {
            primaryStyle: finalPrimary,
            secondaryStyle: finalSecondary,
            dominantStyle: finalPrimary,
            scores: mappedScores,
            allScores: mappedScores,
            allStyles,
            analysis: analysisText,
            recommendations: recs,
            studyTips: recs,
            learningStrategies: recs,
            learningProfile: {
              cognitiveStrengths: strengths,
              learningPreferences: {
                methods: recs,
                environments: [envPhysical, ...fallbackEnvByPrimary(primaryStyle)],
                timePatterns: [fallbackTimeByPrimary(primaryStyle)]
              },
              adaptability: {
                strengths: ['Adaptable to different learning environments'],
                challenges: adaptabilityChallenges,
                strategies: adaptabilityStrategies
              }
            },
            learningStrategiesImplementation: {
              coreStrategies: recs,
              practicalTips: recs,
              environmentSetup: {
                physical: [envPhysical],
                social: envSocial,
                technology: envTech,
                schedule: envSchedule
              }
            },
            learningEffectiveness: {
              optimalConditions: [envPhysical, ...envSocial.slice(0, 1)],
              expectedPerformance: 'Adaptable performance across different learning contexts',
              improvementAreas
            },
            encouragement: analysisText,
            environmentSuggestions: envPhysical,
            metadata: {
              totalQuestions: totalCount
            }
          } as any;

          // --- 强校验与最小填充（与 Interpersonal 一致的“刚性”策略） ---
          const sanitizeList = (arr: any, fallback: string[] = []): string[] => {
            const base = Array.isArray(arr) ? arr : [];
            const merged = [...base, ...fallback]
              .map((x) => String(x || '').trim())
              .filter(Boolean);
            // 去重并限制 2-6 条
            const unique = Array.from(new Set(merged));
            if (unique.length >= 6) { return unique.slice(0, 6); }
            if (unique.length >= 2) { return unique; }
            // 不足 2 条时，用通用兜底补齐
            const pad = ['Use spaced repetition', 'Summarize after each session'];
            return Array.from(new Set([...unique, ...pad])).slice(0, 6);
          };

          resultObject.recommendations = sanitizeList(resultObject.recommendations);
          resultObject.studyTips = sanitizeList(resultObject.studyTips, resultObject.recommendations);
          resultObject.learningStrategies = sanitizeList(resultObject.learningStrategies, resultObject.recommendations);

          resultObject.learningProfile.cognitiveStrengths = sanitizeList(
            resultObject.learningProfile.cognitiveStrengths,
            [analysisText]
          );
          resultObject.learningProfile.learningPreferences.methods = sanitizeList(
            resultObject.learningProfile.learningPreferences.methods,
            resultObject.recommendations
          );
          resultObject.learningProfile.learningPreferences.environments = sanitizeList(
            resultObject.learningProfile.learningPreferences.environments
          );
          resultObject.learningProfile.learningPreferences.timePatterns = sanitizeList(
            resultObject.learningProfile.learningPreferences.timePatterns
          );
          resultObject.learningProfile.adaptability.strengths = sanitizeList(
            resultObject.learningProfile.adaptability.strengths
          );
          resultObject.learningProfile.adaptability.challenges = sanitizeList(
            resultObject.learningProfile.adaptability.challenges
          );
          resultObject.learningProfile.adaptability.strategies = sanitizeList(
            resultObject.learningProfile.adaptability.strategies
          );

          resultObject.learningStrategiesImplementation.coreStrategies = sanitizeList(
            resultObject.learningStrategiesImplementation.coreStrategies,
            resultObject.recommendations
          );
          resultObject.learningStrategiesImplementation.practicalTips = sanitizeList(
            resultObject.learningStrategiesImplementation.practicalTips,
            resultObject.studyTips
          );
          const env = resultObject.learningStrategiesImplementation.environmentSetup;
          env.physical = sanitizeList(env.physical, [envPhysical]);
          env.social = sanitizeList(env.social);
          env.technology = sanitizeList(env.technology);
          env.schedule = sanitizeList(env.schedule, [fallbackTimeByPrimary(resultObject.primaryStyle)]);

          resultObject.learningEffectiveness.optimalConditions = sanitizeList(
            resultObject.learningEffectiveness.optimalConditions,
            [envPhysical]
          );
          resultObject.learningEffectiveness.improvementAreas = sanitizeList(
            resultObject.learningEffectiveness.improvementAreas
          );

          // 关键字段强校验
          const hasScores = typeof resultObject.scores?.V === 'number'
            && typeof resultObject.scores?.A === 'number'
            && typeof resultObject.scores?.R === 'number'
            && typeof resultObject.scores?.K === 'number';
          if (!resultObject.primaryStyle || !hasScores || !String(resultObject.analysis || '').trim()) {
            throw new Error('Missing required VARK fields after normalization');
          }

          return resultObject;
        }

        // 其他未知结构，继续抛错
      }
      
      throw new Error('Invalid JSON response format');
    } catch (error) {
      throw new Error(`Failed to parse VARK response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // parseRavenResponse removed

  // cognitive removed

  // removed unused helper: parseVARKSections

  // removed unused helper: extractSection

  // ==================== 通用分析功能 ====================

  /**
   * 通用测试结果分析
   */
  async analyzeTestResult(data: { testType: string; answers: any[]; userContext?: any }): Promise<any> {
    try {
      // eslint-disable-next-line no-console
      console.log(`[AIService] analyzeTestResult called for testType: ${data.testType}, answers count: ${data.answers.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] API key configured:`, !!this.apiKey);
      
      const prompt = this.buildAnalysisPrompt(data);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Prompt built, length: ${prompt.length}`);
      
      // 根据测试类型设置不同的超时时间和max_tokens
      // 注意：Cloudflare Workers执行时间限制约为50-60秒，需要确保超时时间不超过此限制
      const complexAnalysisTypes = ['numerology', 'tarot', 'birth-chart', 'compatibility', 'fortune'];
      // 将超时时间调整为45秒，确保在Worker限制内（留出5-10秒缓冲）
      const customTimeout = complexAnalysisTypes.includes(data.testType) ? 45000 : 30000; // 45秒或30秒
      
      // 为BaZi分析设置较低的max_tokens以减少响应时间
      // 其他复杂分析保持4000，简单分析使用3000
      let maxTokens: number;
      if (data.testType === 'numerology') {
        maxTokens = 2800; // BaZi分析：降低到2800以减少生成时间
      } else if (complexAnalysisTypes.includes(data.testType)) {
        maxTokens = 4000; // 其他复杂分析保持4000
      } else {
        maxTokens = 3000; // 简单分析使用3000
      }
      
      const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens);
      // eslint-disable-next-line no-console
      console.log(`[AIService] DeepSeek API call successful, parsing response for ${data.testType}`);
      
      // 根据测试类型使用专门的解析方法
      let parsedResult;
      if (data.testType === 'mbti') {
        // eslint-disable-next-line no-console
        console.log(`[AIService] Parsing MBTI response`);
        parsedResult = this.parseMBTIResponse(response);
        // eslint-disable-next-line no-console
        console.log(`[AIService] MBTI response parsed successfully, keys:`, Object.keys(parsedResult));
        // eslint-disable-next-line no-console
        console.log(`[AIService] MBTI parsed result has detailedAnalysis:`, !!parsedResult.detailedAnalysis);
        // eslint-disable-next-line no-console
        console.log(`[AIService] MBTI parsed result has personalityType:`, parsedResult.personalityType);
      } else if (data.testType === 'phq9') {
        // eslint-disable-next-line no-console
        console.log(`[AIService] Parsing PHQ-9 response`);
        parsedResult = this.parsePHQ9Response(response);
        // eslint-disable-next-line no-console
        console.log(`[AIService] PHQ-9 response parsed successfully, keys:`, Object.keys(parsedResult));
      } else if (data.testType === 'eq') {
        parsedResult = this.parseEQResponse(response);
      } else if (data.testType === 'happiness') {
        parsedResult = this.parseHappinessResponse(response);
      } else if (data.testType === 'love_language') {
        parsedResult = this.parseLoveLanguageResponse(response);
      } else if (data.testType === 'love_style') {
        parsedResult = this.parseLoveStyleResponse(response);
      } else if (data.testType === 'interpersonal') {
        parsedResult = this.parseInterpersonalResponse(response);
      } else if (data.testType === 'holland') {
        parsedResult = this.parseHollandResponse(response);
      } else if (data.testType === 'disc') {
        parsedResult = this.parseDISCResponse(response);
      } else if (data.testType === 'leadership') {
        parsedResult = this.parseLeadershipResponse(response);
      } else if (data.testType === 'vark') {
        parsedResult = this.parseVARKResponse(response);
      } else if (data.testType === 'tarot') {
        parsedResult = this.parseTarotResponse(response);
      } else if (data.testType === 'numerology') {
        // 检查分析类型，选择相应的解析方法
        const analysisData = data.answers[0]?.answer;
        if (analysisData && analysisData.type === 'zodiac') {
          parsedResult = this.parseChineseZodiacResponse(response.choices[0].message.content);
        } else if (analysisData && analysisData.type === 'name') {
          parsedResult = this.parseChineseNameRecommendationResponse(response.choices[0].message.content);
        } else if (analysisData && analysisData.type === 'ziwei') {
          parsedResult = this.parseZiWeiResponse(response.choices[0].message.content);
        } else {
          parsedResult = this.parseNumerologyResponse(response);
        }
      } else {
        // 其他测试类型使用通用解析
        parsedResult = JSON.parse(response.choices[0].message.content);
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] Analysis completed successfully for ${data.testType}`);
      return parsedResult;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[AIService] analyzeTestResult error for ${data.testType}:`, error);
      // eslint-disable-next-line no-console
      console.error(`[AIService] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
      
      // 将错误转换为更友好的消息，保留原始错误信息以便调试
      let errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // 处理连接关闭错误
      if (errorMessage.includes('ERR_CONNECTION_CLOSED') || 
          errorMessage.includes('connection closed') ||
          errorMessage.includes('AbortError') ||
          errorMessage.includes('timeout')) {
        errorMessage = `AI analysis timeout or connection lost: ${errorMessage}`;
      }
      
      throw new Error(`Test result analysis failed: ${errorMessage}`);
    }
  }

  /**
   * 验证EQ响应完整性
   */

  /**
   * 生成推荐
   */
  async generateRecommendations(data: { testType: string; results: any; userPreferences?: any; context?: any }): Promise<any> {
    try {
      const prompt = this.buildRecommendationsPrompt(data);
      const response = await this.callDeepSeek(prompt);
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new Error(`Recommendations generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 解释测试结果
   */
  async explainTestResults(data: { testType: string; scores: any; rawAnswers?: any[]; language?: string }): Promise<any> {
    try {
      const prompt = this.buildExplanationPrompt(data);
      const response = await this.callDeepSeek(prompt);
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new Error(`Test results explanation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 生成个性化建议
   */
  async generatePersonalizedAdvice(data: { testType: string; results: any; userProfile?: any; goals?: any[] }): Promise<any> {
    try {
      const prompt = this.buildAdvicePrompt(data);
      const response = await this.callDeepSeek(prompt);
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      throw new Error(`Personalized advice generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== 私有Prompt构建方法 ====================

  private buildAnalysisPrompt(data: { testType: string; answers: any[]; userContext?: any }): string {
    // 根据测试类型使用专门的prompt
    if (data.testType === 'phq9') {
      // 转换answers格式以匹配PHQ-9方法期望的格式
      const phq9Answers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(phq9Answers, context, 'phq9');
    }
    
    if (data.testType === 'mbti') {
      // 转换answers格式以匹配MBTI方法期望的格式
      // eslint-disable-next-line no-console
      console.log(`[AIService] buildAnalysisPrompt for MBTI: received ${data.answers.length} answers`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] buildAnalysisPrompt for MBTI: first answer sample:`, data.answers[0]);
      
      const mbtiAnswers: UserAnswer[] = data.answers.map((answer: any) => {
        // 支持多种答案格式：value字段或answer字段
        const answerValue = answer.value !== undefined ? answer.value : answer.answer;
        return {
          questionId: answer.questionId,
          answer: answerValue,
          score: typeof answerValue === 'number' ? answerValue : 0
        };
      });
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] buildAnalysisPrompt for MBTI: converted ${mbtiAnswers.length} answers, first converted:`, mbtiAnswers[0]);
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(mbtiAnswers, context, 'mbti');
    }
    
    if (data.testType === 'eq') {
      // 转换answers格式以匹配EQ方法期望的格式
      const eqAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(eqAnswers, context, 'eq');
    }
    
    if (data.testType === 'happiness') {
      // 转换answers格式以匹配Happiness方法期望的格式
      const happinessAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(happinessAnswers, context, 'happiness');
    }
    
    if (data.testType === 'love_language') {
      // 转换answers格式以匹配Love Language方法期望的格式
      const loveLanguageAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(loveLanguageAnswers, context, 'love_language');
    }
    
    if (data.testType === 'love_style') {
      // 转换answers格式以匹配Love Style方法期望的格式
      const loveStyleAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(loveStyleAnswers, context, 'love_style');
    }
    
    if (data.testType === 'interpersonal') {
      // 转换answers格式以匹配Interpersonal方法期望的格式
      const interpersonalAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(interpersonalAnswers, context, 'interpersonal');
    }
    
    if (data.testType === 'holland') {
      // 转换answers格式以匹配Holland方法期望的格式
      const hollandAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(hollandAnswers, context, 'holland');
    }
    
    if (data.testType === 'disc') {
      // 转换answers格式以匹配DISC方法期望的格式
      const discAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(discAnswers, context, 'disc');
    }
    
    if (data.testType === 'leadership') {
      // 转换answers格式以匹配Leadership方法期望的格式
      const leadershipAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.value,
        score: typeof answer.value === 'number' ? answer.value : 0
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(leadershipAnswers, context, 'leadership');
    }
    
    if (data.testType === 'tarot') {
      // 转换answers格式以匹配Tarot方法期望的格式
      const tarotAnswers: UserAnswer[] = data.answers.map((answer: any) => ({
        questionId: answer.questionId,
        answer: answer.answer, // tarot的answer是对象，不是value
        score: 0 // tarot不需要分数
      }));
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(tarotAnswers, context, 'tarot');
    }
    
    if (data.testType === 'numerology') {
      return this.buildNumerologyPrompt(data.answers[0]?.answer);
    }
    
    // 其他测试类型使用通用prompt
    return `Please analyze the following ${data.testType} test results and provide comprehensive insights.

Test Type: ${data.testType}
Answers: ${JSON.stringify(data.answers)}
User Context: ${JSON.stringify(data.userContext || {})}

Please provide your analysis in JSON format with appropriate structure for the test type.`;
  }

  private buildNumerologyPrompt(analysisData: any): string {
    if (!analysisData || typeof analysisData !== 'object') {
      throw new Error('Invalid numerology analysis data');
    }

    const { type, inputData } = analysisData;
    if (!type || !inputData) {
      throw new Error('Missing numerology analysis type or input data');
    }

    const { fullName, birthDate, birthTime, gender, calendarType } = inputData;
    if (!fullName || !birthDate) {
      throw new Error('Missing required numerology input fields');
    }

    if (type === 'zodiac') {
      return this.buildChineseZodiacPrompt(fullName, birthDate);
    }

    if (type === 'name') {
      return this.buildChineseNameRecommendationPrompt(inputData);
    }

    if (type === 'ziwei') {
      const { birthPlace } = inputData;
      return this.buildZiWeiPrompt(fullName, birthDate, birthTime, gender, birthPlace, calendarType);
    }

    return `Analyze BaZi (Four Pillars) for: ${fullName}, born ${birthDate} ${birthTime}, ${gender}, ${calendarType} calendar.

Return JSON:
{
  "analysis": {
    "testType": "numerology",
    "subtype": "${type}",
    "overview": "Brief overview",
    "keyInsights": [{"pillar": "Year", "element": "Metal over Dragon"}],
    "strengths": ["3-4 items"],
    "potentialChallenges": ["3-4 items"],
    "careerSuggestions": ["3-4 items"],
    "relationshipInsights": ["3-4 items"],
    "personalGrowthRecommendations": ["3-4 items"],
    "wealthAnalysis": {
      "wealthLevel": "low/medium/high",
      "wealthSource": ["2-3 items"],
      "investmentAdvice": ["2-3 items"],
      "wealthRisks": ["2 items"],
      "wealthLuckyPeriods": ["2 items"]
    },
    "relationshipAnalysis": {
      "marriageTiming": "Brief",
      "partnerCharacteristics": ["3-4 items"],
      "relationshipChallenges": ["2-3 items"],
      "compatibilityElements": ["2-3 items"],
      "marriageAdvice": ["2-3 items"]
    },
    "healthAnalysis": {
      "overallHealth": "good/fair/poor",
      "healthWeakAreas": ["2-3 items"],
      "healthAdvice": ["2-3 items"],
      "preventiveMeasures": ["2-3 items"]
    },
    "fortuneAnalysis": {
      "currentYear": {
        "year": 2024,
        "overall": 7,
        "career": 7,
        "wealth": 6,
        "health": 7,
        "relationships": 8,
        "overallDescription": "2 sentences",
        "keyEvents": ["3-4 items"],
        "advice": ["3-4 items"]
      },
      "nextYear": {
        "year": 2025,
        "overall": 7,
        "overallDescription": "2 sentences",
        "keyTrends": ["3-4 items"]
      }
    },
    "overallInterpretation": "2 paragraphs",
    "personalityTraits": ["5-6 items"],
    "careerGuidance": ["3-4 items"],
    "baZiAnalysis": {
      "tenGods": {
        "biJian": {"element": "Metal", "strength": "weak/balanced/strong"},
        "jieCai": {"element": "Wood", "strength": "weak/balanced/strong"},
        "shiShen": {"element": "Fire", "strength": "weak/balanced/strong"},
        "shangGuan": {"element": "Earth", "strength": "weak/balanced/strong"},
        "pianCai": {"element": "Water", "strength": "weak/balanced/strong"},
        "zhengCai": {"element": "Metal", "strength": "weak/balanced/strong"},
        "qiSha": {"element": "Wood", "strength": "weak/balanced/strong"},
        "zhengGuan": {"element": "Fire", "strength": "weak/balanced/strong"},
        "pianYin": {"element": "Earth", "strength": "weak/balanced/strong"},
        "zhengYin": {"element": "Water", "strength": "weak/balanced/strong"}
      },
      "dayMasterStrength": {
        "strength": "weak/balanced/strong",
        "description": "2 sentences",
        "recommendations": ["3-4 items"]
      },
      "favorableElements": {
        "useful": ["2-3 elements"],
        "harmful": ["2-3 elements"],
        "explanation": "2 sentences"
      },
      "fiveElements": {
        "elements": {"metal": 2, "wood": 3, "water": 1, "fire": 2, "earth": 2},
        "dominantElement": "Wood",
        "weakElement": "Water",
        "balance": "balanced/unbalanced"
      }
    },
    "luckyElements": {
      "colors": ["3-4 colors"],
      "numbers": [1, 3, 5],
      "directions": ["2-3 directions"]
    }
  }
}

Analyze Four Pillars, Five Elements, Ten Gods, Day Master. Provide career, wealth, relationships, health guidance. Include current/next year predictions. English only. Element format: "Stem over Branch" (e.g., "Metal over Dragon"). Return valid JSON only.`;
  }

  async analyzeNumerology(analysisData: any): Promise<any> {
    const prompt = this.buildNumerologyPrompt(analysisData);
    const analysisType = analysisData?.type || 'bazi';
    // 将超时时间调整为45秒，确保在Cloudflare Workers执行时间限制内
    const customTimeout = 45000;
    // BaZi分析使用较低的max_tokens以减少响应时间
    const maxTokens = 2800;
    const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens);

    if (analysisType === 'zodiac') {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty AI response content for numerology zodiac analysis');
      }
      return this.parseChineseZodiacResponse(content);
    }

    if (analysisType === 'name') {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty AI response content for numerology name analysis');
      }
      return this.parseChineseNameRecommendationResponse(content);
    }

    if (analysisType === 'ziwei') {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty AI response content for numerology ZiWei analysis');
      }
      return this.parseZiWeiResponse(content);
    }

    return this.parseNumerologyResponse(response);
  }

  private buildRecommendationsPrompt(data: { testType: string; results: any; userPreferences?: any; context?: any }): string {
    return `Based on the following ${data.testType} test results, please generate personalized recommendations.

Test Results: ${JSON.stringify(data.results)}
User Preferences: ${JSON.stringify(data.userPreferences || {})}
Context: ${JSON.stringify(data.context || {})}

Please provide your recommendations in JSON format with actionable suggestions.`;
  }

  private buildExplanationPrompt(data: { testType: string; scores: any; rawAnswers?: any[]; language?: string }): string {
    return `Please explain the following ${data.testType} test results in clear, understandable terms.

Scores: ${JSON.stringify(data.scores)}
Raw Answers: ${JSON.stringify(data.rawAnswers || [])}
Language: ${data.language || 'en'}

Please provide your explanation in JSON format with clear interpretations.`;
  }

  private buildAdvicePrompt(data: { testType: string; results: any; userProfile?: any; goals?: any[] }): string {
    return `Based on the following ${data.testType} test results, please generate personalized advice.

Test Results: ${JSON.stringify(data.results)}
User Profile: ${JSON.stringify(data.userProfile || {})}
Goals: ${JSON.stringify(data.goals || [])}

Please provide your advice in JSON format with specific, actionable guidance.`;
  }

  // removed calculateEQLevel: EQ numeric levels are computed deterministically in processor

  // ==================== 占星模块响应解析方法 ====================

  /**
   * 解析运势分析响应
   */
  private parseFortuneResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.zodiacSign || !parsed.overall) {
        throw new Error('Missing required fields in fortune response');
      }
      
      return parsed;
    } catch (error) {
      // console.error('Error parsing fortune response:', error);
      // 返回默认运势结构
      return {
        zodiacSign: 'unknown',
        timeframe: 'yearly',
        overall: {
          score: 7,
          description: 'Your cosmic energy brings positive influences today. Trust your intuition and embrace new opportunities.'
        },
        love: {
          score: 7,
          description: 'Romantic energy is flowing well. Open your heart to meaningful connections.'
        },
        career: {
          score: 7,
          description: 'Professional opportunities are aligning. Your natural talents will be recognized.'
        },
        wealth: {
          score: 7,
          description: 'Financial energy is stable. Focus on long-term investments and wise decisions.'
        },
        health: {
          score: 7,
          description: 'Your physical and mental well-being are in good balance. Maintain healthy routines.'
        },
        luckyElements: {
          colors: ['Blue', 'Silver'],
          numbers: [7, 14, 21],
          directions: ['North', 'East']
        },
        advice: 'Trust your instincts and embrace the positive energy around you.',
        createdAt: new Date().toISOString()
      };
    }
  }

  /**
   * 解析配对分析响应
   */
  private parseCompatibilityResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.sign1 || !parsed.sign2 || !parsed.overallScore) {
        throw new Error('Missing required fields in compatibility response');
      }
      
      return parsed;
    } catch (error) {
      // console.error('Error parsing compatibility response:', error);
      // 返回默认配对结构
      return {
        sign1: 'unknown',
        sign2: 'unknown',
        relationType: 'general',
        overallScore: 75,
        specificScore: 75,
        strengths: [
          'Both signs share complementary energies that create balance',
          'Natural understanding and mutual respect in the relationship',
          'Shared values and goals strengthen the connection'
        ],
        challenges: [
          'Different communication styles may require patience',
          'Balancing individual needs with relationship harmony',
          'Understanding each other\'s emotional needs'
        ],
        advice: 'Focus on appreciating each other\'s unique qualities and maintain open communication.',
        elementCompatibility: 'Balanced',
        qualityCompatibility: 'Complementary',
        createdAt: new Date().toISOString()
      };
    }
  }

  /**
   * 分析行星解读
   */
  async analyzePlanetInterpretation(planet: string, sign: string): Promise<any> {
    const prompt = `You are an expert astrologer. Provide a detailed interpretation of ${planet} in ${sign}.

Please respond with a JSON object containing:
{
  "meaning": "Brief description of what this planetary placement represents",
  "influence": "Detailed explanation of how this placement influences the person's life, personality, and experiences"
}

Focus on:
- The specific characteristics of ${planet} in ${sign}
- How this placement affects personality traits
- Life areas influenced by this placement
- Practical implications for daily life
- Both positive and challenging aspects

Keep the response concise but informative, suitable for a birth chart analysis.`;

    const response = await this.callDeepSeek(prompt);
    return this.parsePlanetInterpretationResponse(response);
  }

  /**
   * 解析行星解读响应
   */
  private parsePlanetInterpretationResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.meaning || !parsed.influence) {
        throw new Error('Missing required fields in planet interpretation response');
      }
      
      return parsed;
    } catch (error) {
      // console.error('Error parsing planet interpretation response:', error);
      // 返回默认解读
      return {
        meaning: `Planetary influence`,
        influence: `This planetary placement influences various aspects of your personality and life experience.`
      };
    }
  }

  /**
   * 解析星盘分析响应
   */
  private parseBirthChartResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.sunSign || !parsed.moonSign || !parsed.risingSign) {
        throw new Error('Missing required fields in birth chart response');
      }
      
      return parsed;
    } catch (error) {
      // console.error('Error parsing birth chart response:', error);
      // 返回默认星盘结构
      return {
        sunSign: 'unknown',
        moonSign: 'unknown',
        risingSign: 'unknown',
        planetaryPositions: {},
        housePositions: {},
        aspects: {},
        personalityProfile: {
          coreTraits: ['Intuitive', 'Adaptable', 'Creative'],
          strengths: ['Natural leadership', 'Emotional intelligence', 'Creative problem-solving'],
          challenges: ['Perfectionism', 'Overthinking', 'Need for validation'],
          lifePurpose: 'To inspire and guide others through your unique perspective'
        },
        lifeGuidance: {
          career: 'Focus on creative and leadership roles that allow self-expression',
          relationships: 'Seek partners who appreciate your depth and complexity',
          personalGrowth: 'Develop emotional balance and trust in your intuition',
          challenges: 'Learn to balance idealism with practical reality'
        },
        createdAt: new Date().toISOString()
      };
    }
  }

  /**
   * 分析塔罗牌解读
   */
  async analyzeTarotReading(sessionId: string, _userContext?: any): Promise<any> {
    const prompt = `You are an expert tarot reader with deep knowledge of tarot symbolism and interpretation. 
    Provide a comprehensive tarot reading analysis based on the session data.

Please respond with a JSON object containing:
{
  "overall_interpretation": "Comprehensive interpretation of the entire reading",
  "card_interpretations": [
    {
      "position": 1,
      "card_name": "Card Name",
      "interpretation": "Detailed interpretation of this card in its position",
      "advice": "Specific advice based on this card"
    }
  ],
  "synthesis": "Overall synthesis connecting all cards and their meanings",
  "action_guidance": ["Specific actionable advice 1", "Specific actionable advice 2"],
  "timing_advice": "Guidance on timing and when to act"
}

Focus on:
- The symbolic meaning of each card in its specific position
- How the cards work together to tell a story
- Practical guidance and actionable advice
- Both immediate and long-term implications
- Positive aspects and potential challenges
- Spiritual and practical dimensions

Keep the response insightful, practical, and encouraging while being honest about challenges.`;

    const response = await this.callDeepSeek(prompt);
    return this.parseTarotReadingResponse(response, sessionId);
  }

  /**
   * 快速塔罗牌解读
   */
  async analyzeQuickTarotReading(cards: any[], question?: string): Promise<any> {
    const prompt = `You are an expert tarot reader. Provide a quick but insightful interpretation of these tarot cards.

Cards: ${JSON.stringify(cards)}
Question: ${question || 'General guidance'}

Please respond with a JSON object containing:
{
  "overall_interpretation": "Brief but comprehensive interpretation",
  "card_interpretations": [
    {
      "position": 1,
      "card_name": "Card Name",
      "interpretation": "Brief interpretation",
      "advice": "Quick advice"
    }
  ],
  "synthesis": "How the cards work together",
  "action_guidance": ["Actionable advice 1", "Actionable advice 2"]
}

Keep it concise but meaningful, focusing on the most important insights.`;

    const response = await this.callDeepSeek(prompt);
    return this.parseTarotReadingResponse(response, 'quick_reading');
  }

  /**
   * 解析塔罗牌解读响应
   */
  private parseTarotReadingResponse(response: any, sessionId: string): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        throw new Error('Empty response content');
      }
      
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.overall_interpretation || !parsed.card_interpretations) {
        throw new Error('Missing required fields in tarot reading response');
      }
      
      return {
        sessionId,
        overall_interpretation: parsed.overall_interpretation,
        card_interpretations: parsed.card_interpretations || [],
        synthesis: parsed.synthesis || 'The cards reveal important insights about your current situation.',
        action_guidance: parsed.action_guidance || ['Trust your intuition', 'Take inspired action'],
        timing_advice: parsed.timing_advice || 'The timing is right for positive change.',
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      // console.error('Error parsing tarot reading response:', error);
      // 返回默认解读
      return {
        sessionId,
        overall_interpretation: 'The cards reveal important insights about your current situation and future path.',
        card_interpretations: [], // 默认空数组，实际实现需要从数据库获取
        synthesis: 'The cards work together to provide guidance and insight.',
        action_guidance: ['Trust your intuition', 'Take inspired action', 'Stay open to new possibilities'],
        timing_advice: 'The timing is right for positive change.',
        generated_at: new Date().toISOString()
      };
    }
  }

  /**
   * 解析命理分析响应
   */
  private parseNumerologyResponse(response: any): any {
    try {
      const content = response?.choices?.[0]?.message?.content || '';
      if (!content) {
        console.error('[AIService] Empty response content from AI for numerology analysis');
        throw new Error('Empty response content from AI');
      }
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error('[AIService] Failed to parse numerology response JSON:', parseError);
        console.error('[AIService] Response content (first 500 chars):', content.substring(0, 500));
        throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
      
      // 验证必需字段 - 如果缺失则抛出错误，不使用默认值
      if (!parsed.analysis) {
        console.error('[AIService] Missing analysis field in numerology response');
        console.error('[AIService] Parsed response keys:', Object.keys(parsed));
        console.error('[AIService] Parsed response (first 1000 chars):', JSON.stringify(parsed).substring(0, 1000));
        throw new Error('Missing analysis field in numerology response. The AI response format is incorrect.');
      }
      
      console.log('[AIService] Numerology response parsed successfully');
      return parsed;
    } catch (error) {
      // 记录详细错误信息以便调试
      console.error('[AIService] parseNumerologyResponse error:', error);
      console.error('[AIService] Error details:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500)
      } : error);
      
      // 重新抛出错误，让上层处理
      throw error;
    }
  }

  // ==================== 中国生肖运势分析方法 ====================

  /**
   * 构建中文名字推荐AI提示词
   */
  private buildChineseNameRecommendationPrompt(input: any): string {
    const chineseNameInput = input.chineseNameRecommendation;
    
    return `You are a professional Chinese name consultant. Recommend multiple suitable Chinese names for a foreigner based on their comprehensive profile.

**User Profile:**
- Original Name: ${chineseNameInput.originalName}
- Gender: ${chineseNameInput.gender}
- Age: ${chineseNameInput.age}
- Personality: ${chineseNameInput.personality}
- Profession: ${chineseNameInput.profession}
- Interests: ${chineseNameInput.interests}
- Desired Meaning: ${chineseNameInput.desiredMeaning}
- Cultural Preference: ${chineseNameInput.culturalPreference}
- Usage Context: ${chineseNameInput.usageContext}

**Requirements:**
1. Recommend ONE primary name (best match)
2. Recommend 2-3 alternative names
3. Consider phonetic similarity to original name
4. Match personality, profession, and interests
5. Include desired meaning
6. Respect cultural preference (traditional/modern/balanced)
7. Ensure appropriateness for usage context

**Output Format:**
{
  "primaryRecommendation": {
    "name": "主要推荐的中文名字",
    "pronunciation": "pinyin pronunciation",
    "meaning": "Detailed meaning explanation",
    "whyRecommended": "Why this is the best match",
    "culturalSignificance": "Cultural background",
    "usageAdvice": "Specific usage recommendations"
  },
  "alternativeRecommendations": [
    {
      "name": "备选名字1",
      "pronunciation": "pinyin pronunciation",
      "meaning": "Meaning explanation",
      "whyRecommended": "Why this name fits",
      "culturalSignificance": "Cultural background"
    },
    {
      "name": "备选名字2", 
      "pronunciation": "pinyin pronunciation",
      "meaning": "Meaning explanation",
      "whyRecommended": "Why this name fits",
      "culturalSignificance": "Cultural background"
    }
  ],
  "overallExplanation": "Overall recommendation rationale and cultural tips"
}`;
  }

  /**
   * 构建中国生肖运势分析提示词
   */
  private buildChineseZodiacPrompt(fullName: string, birthDate: string): string {
    const zodiacAnimal = this.getChineseZodiacAnimal(birthDate);
    const currentYear = new Date().getFullYear();
    
    return `You are a professional Chinese zodiac fortune analyst. Please provide a comprehensive Chinese zodiac fortune analysis based on the following information:

**Personal Information:**
- Name: ${fullName}
- Birth Date: ${birthDate}
- Chinese Zodiac Animal: ${zodiacAnimal}
- Fortune Timeframe: yearly
- Current Year: ${currentYear}

**Required Analysis Structure:**
Please provide your analysis in the following comprehensive JSON format:

{
  "analysis": {
    "testType": "numerology",
    "subtype": "zodiac",
    "overview": "Comprehensive overview of the Chinese zodiac fortune analysis",
    
    "zodiacInfo": {
      "animal": "${zodiacAnimal}",
      "element": "Element based on birth year",
      "year": ${new Date(birthDate).getFullYear()},
      "isCurrentYear": ${new Date(birthDate).getFullYear() === currentYear},
      "isConflictYear": false
    },
    
    "zodiacFortune": {
      "period": "yearly",
      "overall": 7,
      "career": 6,
      "wealth": 5,
      "love": 8,
      "health": 6,
      "luckyNumbers": [1, 2, 3, 4, 5],
      "luckyColors": ["Red", "Gold", "Yellow"],
      "luckyDirection": "South",
      "guardianAnimals": ["Compatible zodiac animals"]
    },
    
    "fortuneAnalysis": {
      "currentPeriod": {
        "overall": 7,
        "career": 8,
        "wealth": 6,
        "love": 7,
        "health": 6,
        "overallDescription": "Detailed description of overall fortune for the yearly period",
        "careerDescription": "Career guidance and opportunities for the yearly period",
        "wealthDescription": "Financial outlook and advice for the yearly period",
        "loveDescription": "Relationship insights and guidance for the yearly period",
        "healthDescription": "Health considerations and wellness advice for the yearly period",
        "keyEvents": ["Important events or opportunities to watch for"],
        "advice": ["Specific actionable advice for the period"]
      }
    },
    
    "luckyElements": {
      "colors": ["Red", "Gold", "Yellow"],
      "numbers": [1, 2, 3, 4, 5],
      "directions": ["South", "East"],
      "seasons": ["Spring", "Summer"]
    },
    
    "overallInterpretation": "Comprehensive interpretation of the Chinese zodiac fortune analysis",
    
    "relationshipAdvice": [
      "Relationship guidance based on zodiac compatibility"
    ],
    
    "healthTips": [
      "Health recommendations based on zodiac characteristics"
    ]
  }
}

**Analysis Requirements:**
1. **Chinese Zodiac Fundamentals**: Analyze based on the 12 Chinese zodiac animals (Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig)
2. **Five Elements Theory**: Consider the interaction of Metal, Wood, Water, Fire, and Earth elements
3. **Yearly Fortune Analysis**: Provide specific guidance for the yearly timeframe
4. **Practical Applications**: Include practical advice for career, wealth, relationships, and health
5. **Lucky Elements**: Suggest beneficial colors, numbers, directions, and seasons
6. **Cultural Context**: Incorporate traditional Chinese zodiac wisdom with modern interpretation

**IMPORTANT FORMAT REQUIREMENTS:**
- Use English names for zodiac animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig
- Use English element names: Metal, Wood, Water, Fire, Earth
- Use English direction names: North, South, East, West, Northeast, Northwest, Southeast, Southwest
- All descriptions should be in English
- Provide specific, actionable advice
- Use encouraging and positive language
- Include cultural context and traditional wisdom

**Language Style Requirements:**
- Use rich, descriptive language with cultural depth
- Provide detailed explanations with traditional Chinese wisdom
- Focus on practical guidance and actionable advice
- Use encouraging and positive tone throughout
- Include specific cultural references and traditional knowledge
- Write in engaging, flowing English that feels authentic and insightful

Please ensure the analysis is:
1. Based on authentic Chinese zodiac principles and traditional wisdom
2. Specific to the zodiac animal and yearly fortune analysis
3. Practical and actionable with detailed guidance
4. Culturally authentic and respectful
5. Written in engaging, flowing English
6. Comprehensive and detailed with traditional insights
7. Focus on practical application of zodiac wisdom
8. **IMPORTANT: Use pinyin names for all Chinese terms (e.g., "Zi Wei" instead of "紫微", "Tian Fu" instead of "天府")**
9. **Do not use Chinese characters in any analysis content - only use pinyin format**`;
  }

  /**
   * 获取中国生肖动物
   */
  private getChineseZodiacAnimal(birthDate: string): string {
    const year = new Date(birthDate).getFullYear();
    const zodiacAnimals = [
      'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox',
      'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'
    ];
    
    return zodiacAnimals[year % 12] || 'Unknown';
  }

  /**
   * 解析中文名字推荐AI响应
   */
  private parseChineseNameRecommendationResponse(response: string): any {
    try {
      // 提取JSON内容，处理可能的代码块包装
      let jsonContent = response.trim();
      
      // 如果响应被包装在```json```代码块中，提取JSON部分
      if (jsonContent.startsWith('```json')) {
        const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1].trim();
        }
      } else if (jsonContent.startsWith('```')) {
        // 处理普通的```代码块
        const jsonMatch = jsonContent.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1].trim();
        }
      }
      
      const parsed = JSON.parse(jsonContent);
      
      // 验证必要字段
      if (!parsed.primaryRecommendation || !parsed.alternativeRecommendations || !parsed.overallExplanation) {
        throw new Error('Missing required fields in AI response');
      }

      return parsed;
    } catch (error) {
      // console.error('Failed to parse Chinese name recommendation response:', error);
      // console.error('Raw response:', response);
      
      // 返回默认推荐结果
      return {
        primaryRecommendation: {
          name: "李明",
          pronunciation: "Lǐ Míng",
          meaning: "Bright and intelligent, representing wisdom and clarity of thought",
          whyRecommended: "This name matches your personality traits and professional background perfectly",
          culturalSignificance: "A classic Chinese name with deep cultural roots, symbolizing brightness and intelligence",
          usageAdvice: "Perfect for both personal and professional contexts, easy to pronounce and remember"
        },
        alternativeRecommendations: [
          {
            name: "王思远",
            pronunciation: "Wáng Sī Yuǎn",
            meaning: "Thoughtful and far-sighted, representing wisdom and vision",
            whyRecommended: "Reflects your analytical nature and forward-thinking approach",
            culturalSignificance: "Traditional name emphasizing wisdom and long-term thinking"
          },
          {
            name: "张雅文",
            pronunciation: "Zhāng Yǎ Wén",
            meaning: "Elegant and cultured, representing refinement and knowledge",
            whyRecommended: "Matches your professional background and cultural interests",
            culturalSignificance: "Modern name combining elegance with intellectual depth"
          }
        ],
        overallExplanation: "Based on your profile, these names were carefully selected to match your personality, profession, and cultural preferences. Each name carries positive meanings and cultural significance that will serve you well in various contexts."
      };
    }
  }

  /**
   * 构建紫微斗数分析提示词
   */
  private buildZiWeiPrompt(fullName: string, birthDate: string, birthTime: string, gender: string, birthPlace: string, calendarType: string): string {
    return `You are a professional ZiWei DouShu (Purple Star Astrology) master. Provide a comprehensive ZiWei chart analysis based on:

**Birth Information:**
- Name: ${fullName}
- Birth Date: ${birthDate}
- Birth Time: ${birthTime}
- Gender: ${gender}
- Birth Place: ${birthPlace}
- Calendar Type: ${calendarType}

**Required JSON Structure:**
{
  "analysis": {
    "testType": "numerology",
    "subtype": "ziwei",
    "overview": "string - comprehensive overview",
    "ziWeiChart": {
      "palaces": {
        "life|parents|fortune|property|career|friends|travel|health|wealth|children|marriage|siblings": {
          "mainStars": ["string[] - pinyin names only (e.g., 'Zi Wei', 'Tian Fu')"],
          "minorStars": ["string[] - pinyin names only"],
          "element": "string (Metal|Wood|Water|Fire|Earth)",
          "meaning": "string - brief description"
        }
      },
      "lifePalace": "string - detailed multi-sentence analysis (~30 words) with star influences, personality traits, and practical guidance",
      "parentsPalace": "string - detailed multi-sentence analysis (~30 words)",
      "fortunePalace": "string - detailed multi-sentence analysis (~30 words)",
      "propertyPalace": "string - detailed multi-sentence analysis (~30 words)",
      "careerPalace": "string - detailed multi-sentence analysis (~30 words)",
      "friendsPalace": "string - detailed multi-sentence analysis (~30 words)",
      "travelPalace": "string - detailed multi-sentence analysis (~30 words)",
      "healthPalace": "string - detailed multi-sentence analysis (~30 words)",
      "wealthPalace": "string - detailed multi-sentence analysis (~30 words)",
      "childrenPalace": "string - detailed multi-sentence analysis (~30 words)",
      "marriagePalace": "string - detailed multi-sentence analysis (~30 words)",
      "siblingsPalace": "string - detailed multi-sentence analysis (~30 words)"
    },
    "overallInterpretation": "string - comprehensive life guidance (~200 words) covering personality, career, relationships, wealth, health, life themes, and practical advice",
    "personalityTraits": ["string[]"],
    "careerGuidance": ["string[]"],
    "relationshipAdvice": ["string[]"],
        "luckyElements": {
      "colors": ["string[]"],
      "numbers": ["number[]"],
      "directions": ["string[]"],
      "seasons": ["string[]"]
    },
    "improvementSuggestions": ["string[]"],
        "starAnalysis": {
          "mainStars": {
        "life|wealth|career|marriage": ["string[] - pinyin names only"]
          },
      "starMeanings": "string - detailed analysis using pinyin names only"
        },
        "fourTransformations": {
      "huaLu": { "strength": "string (Strong|Balanced|Weak|Moderate)", "analysis": "string - detailed analysis" },
      "huaQuan": { "strength": "string", "analysis": "string" },
      "huaKe": { "strength": "string", "analysis": "string" },
      "huaJi": { "strength": "string", "analysis": "string" }
    },
        "patterns": {
      "mainPattern": "string",
      "specialPatterns": ["string[]"]
    }
  }
}

**Analysis Requirements:**
1. Calculate ZiWei chart based on birth information (time and location sensitive)
2. Analyze ALL 12 palaces with main and minor stars
3. Provide detailed multi-sentence interpretations (~30 words) for ALL palaces with: star names, elemental influences, personality traits/abilities, practical guidance
4. Give comprehensive life guidance (~200 words) covering personality, career, relationships, wealth, health, life themes
5. Include lucky elements and improvement suggestions
6. Ensure all interpretations are positive and constructive

**Format & Style Requirements:**
- Use pinyin names ONLY for Chinese star names (e.g., "Zi Wei" not "紫微", "Tian Fu" not "天府") - NO Chinese characters
- Use English element names: Metal, Wood, Water, Fire, Earth
- Use rich descriptive language, encouraging professional tone, specific actionable advice
- Focus on practical life guidance rather than fatalistic predictions`;
  }

  /**
   * 解析紫微斗数AI响应
   */
  private parseZiWeiResponse(content: string): any {
    try {
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.analysis || !parsed.analysis.ziWeiChart) {
        throw new Error('Missing required fields in ZiWei response');
      }
      
      return parsed;
    } catch (error) {
      // Error parsing ZiWei response, using fallback
      
      // 返回默认紫微斗数结构
      return {
        analysis: {
          testType: "numerology",
          subtype: "ziwei",
          overview: "ZiWei DouShu analysis provides comprehensive life guidance based on your birth chart.",
          
          ziWeiChart: {
            palaces: {
              life: {
                mainStars: ["Zi Wei", "Tian Fu"],
                minorStars: ["Zuo Fu", "You Bi"],
                element: "Earth",
                meaning: "Life palace represents your core personality and life foundation"
              },
              parents: {
                mainStars: ["Tian Ji", "Tai Yang"],
                minorStars: ["Tian Liang", "Tian Xiang"],
                element: "Fire",
                meaning: "Parents palace shows relationship with parents and authority figures"
              },
              fortune: {
                mainStars: ["Tian Tong", "Tai Yin"],
                minorStars: ["Tian Xi", "Hong Luan"],
                element: "Water",
                meaning: "Fortune palace indicates spiritual fortune and inner happiness"
              },
              property: {
                mainStars: ["Tian Liang", "Tian Xiang"],
                minorStars: ["Tian Ji", "Tai Yang"],
                element: "Earth",
                meaning: "Property palace shows real estate and material possessions"
              },
              career: {
                mainStars: ["Qi Sha", "Po Jun"],
                minorStars: ["Wen Chang", "Wen Qu"],
                element: "Metal",
                meaning: "Career palace shows your professional development and work style"
              },
              friends: {
                mainStars: ["Tian Ji", "Tai Yang"],
                minorStars: ["Tian Liang", "Tian Xiang"],
                element: "Fire",
                meaning: "Friends palace indicates social relationships and networking"
              },
              travel: {
                mainStars: ["Tian Tong", "Tai Yin"],
                minorStars: ["Tian Xi", "Hong Luan"],
                element: "Water",
                meaning: "Travel palace shows mobility and external opportunities"
              },
              health: {
                mainStars: ["Tian Liang", "Tian Xiang"],
                minorStars: ["Tian Ji", "Tai Yang"],
                element: "Earth",
                meaning: "Health palace indicates physical health and vitality"
              },
              wealth: {
                mainStars: ["Wu Qu", "Tian Fu"],
                minorStars: ["Lu Cun", "Hua Lu"],
                element: "Metal",
                meaning: "Wealth palace indicates your financial fortune and money management abilities"
              },
              children: {
                mainStars: ["Tian Tong", "Tai Yin"],
                minorStars: ["Tian Xi", "Hong Luan"],
                element: "Water",
                meaning: "Children palace shows relationship with children and creativity"
              },
              marriage: {
                mainStars: ["Tian Tong", "Tai Yin"],
                minorStars: ["Hong Luan", "Tian Xi"],
                element: "Water",
                meaning: "Marriage palace reveals your relationship patterns and romantic fortune"
              },
              siblings: {
                mainStars: ["Tian Ji", "Tai Yang"],
                minorStars: ["Tian Liang", "Tian Xiang"],
                element: "Fire",
                meaning: "Siblings palace shows relationship with siblings and peers"
              }
            },
            lifePalace: "With Zi Wei and Tian Fu in your Life Palace, you possess natural leadership qualities and excellent organizational abilities. Your Earth element provides stability and practicality, making you reliable and trustworthy. The support stars Zuo Fu and You Bi indicate strong assistance from others throughout your life journey.",
            parentsPalace: "Tian Ji and Tai Yang in your Parents Palace indicate strong family connections and respect for authority figures. You have supportive relationships with elders who can guide your development. The combination suggests you benefit from parental wisdom and can build lasting bonds with mentors throughout your life.",
            fortunePalace: "Tian Tong and Tai Yin in your Fortune Palace show inner happiness and spiritual fulfillment. You find joy in simple pleasures and have a peaceful inner nature that attracts positive energy. The Water element enhances your intuitive abilities and emotional depth, bringing contentment through meaningful relationships.",
            propertyPalace: "Tian Liang and Tian Xiang in your Property Palace indicate potential for real estate investments and material stability. You have good judgment in property matters and can build lasting wealth through strategic acquisitions. The Earth element provides grounding energy that helps you make wise long-term investments.",
            careerPalace: "Qi Sha and Po Jun in your Career Palace suggest strong ambition and the ability to overcome challenges. You excel in leadership roles and entrepreneurial ventures, with Wen Chang and Wen Qu indicating success through communication and strategic thinking. Your career path involves transformation and innovation.",
            friendsPalace: "Tian Ji and Tai Yang in your Friends Palace show strong social connections and networking abilities. You attract loyal friends and have good relationships with colleagues and business partners. The Fire element brings enthusiasm to your relationships, making you a natural connector and trusted confidant.",
            travelPalace: "Tian Tong and Tai Yin in your Travel Palace indicate opportunities for growth through travel and external experiences. You benefit from cultural exchanges and learning from different environments. The Water element enhances your adaptability, allowing you to thrive in new situations and gain wisdom through exploration.",
            healthPalace: "Tian Liang and Tian Xiang in your Health Palace show generally good health with some areas requiring attention. You should focus on preventive care and maintain a balanced lifestyle. The Earth element provides stability, but you need to be mindful of stress management and regular health check-ups.",
            wealthPalace: "Wu Qu and Tian Fu in your Wealth Palace indicate strong financial management skills and the ability to accumulate wealth through steady effort and wise investments. With Lu Cun and Hua Lu, you have multiple income sources and financial blessings, particularly in your 30s and 40s. Your wealth grows through career achievements and smart investments.",
            childrenPalace: "Tian Tong and Tai Yin in your Children Palace show potential for creative expression and nurturing relationships. You have a caring nature and may find fulfillment through teaching or mentoring others. The Water element enhances your emotional intelligence, making you an excellent parent, teacher, or creative mentor.",
            marriagePalace: "Tian Tong and Tai Yin in your Marriage Palace indicate harmonious relationships and emotional sensitivity. With Hong Luan and Tian Xi, you attract positive romantic opportunities and can build lasting partnerships. The Water element brings depth to your relationships, fostering mutual understanding and emotional connection.",
            siblingsPalace: "Tian Ji and Tai Yang in your Siblings Palace show strong relationships with siblings and peers. You have supportive relationships with colleagues and friends who become like family. The Fire element brings warmth to your social connections, making you a loyal friend and trusted confidant in your social circle."
          },
          
          overallInterpretation: "Your ZiWei chart reveals a remarkable destiny pattern characterized by natural leadership abilities and exceptional organizational skills. Born with the noble Zi Wei star in your life palace, you possess an innate sense of authority and charisma that draws others to you naturally. Your personality combines intellectual depth with practical wisdom, making you an effective decision-maker and problem-solver. In your career, you excel in management positions, strategic planning, and any field requiring both analytical thinking and interpersonal skills. Your wealth accumulation follows a steady, methodical pattern with particular strength in mid-life financial growth. Relationships play a crucial role in your life journey, and you tend to attract partners who appreciate your stability and reliability. Health-wise, you should pay attention to stress management and maintain regular exercise routines. Your spiritual development path involves learning to balance ambition with compassion, and your greatest life lessons center around patience and emotional intelligence. The timing of major life decisions is particularly important for you, with your most favorable periods occurring during your 30s and 50s. To maximize your potential, focus on developing your communication skills, building strong professional networks, and maintaining emotional balance in all relationships.",
          personalityTraits: ["Natural leadership", "Strong determination", "Good communication skills", "Emotional intelligence"],
          careerGuidance: ["Consider leadership roles", "Develop entrepreneurial skills", "Focus on communication-based careers", "Build strong professional networks"],
          relationshipAdvice: ["Be open to new relationships", "Communicate openly with partners", "Value emotional connection", "Maintain balance in relationships"],
          luckyElements: {
            colors: ["red", "gold", "purple"],
            numbers: [1, 6, 8],
            directions: ["south", "center"],
            seasons: ["summer", "late summer"]
          },
          improvementSuggestions: ["Develop patience and persistence", "Focus on emotional balance", "Cultivate wisdom through learning", "Maintain physical and mental health"],
          
          starAnalysis: {
            mainStars: {
              life: ["Zi Wei", "Tian Fu"],
              wealth: ["Wu Qu", "Tian Fu"],
              career: ["Qi Sha", "Po Jun"],
              marriage: ["Tian Tong", "Tai Yin"]
            },
            starMeanings: "Your chart shows strong leadership potential with Zi Wei and Tian Fu in the life palace, indicating natural charisma and administrative abilities. The career palace suggests ambitious drive and ability to overcome challenges."
          },
          
          fourTransformations: {
            huaLu: {
              strength: "Strong",
              analysis: "Strong wealth transformation indicates multiple income opportunities and financial blessings throughout life, particularly in mid-career stages"
            },
            huaQuan: {
              strength: "Balanced",
              analysis: "Natural authority and leadership abilities that grow with experience and maturity"
            },
            huaKe: {
              strength: "Moderate", 
              analysis: "Recognition through academic or professional achievements, with potential for honors and awards"
            },
            huaJi: {
              strength: "Weak",
              analysis: "Minor challenges in emotional expression that can be overcome through self-awareness and communication skills"
            }
          },
          
          patterns: {
            mainPattern: "Zi Wei Tian Fu pattern in Life Palace",
            specialPatterns: ["Wealth accumulation pattern in Property Palace", "Career transformation pattern in Career Palace"]
          },
          
        }
      };
    }
  }

  private parseChineseZodiacResponse(content: string): any {
    try {
      const cleaned = this.sanitizeAIJSON(content);
      const parsed = JSON.parse(cleaned);
      
      // 验证必需字段
      if (!parsed.analysis || !parsed.analysis.zodiacInfo || !parsed.analysis.zodiacFortune) {
        throw new Error('Missing required fields in Chinese zodiac response');
      }
      
      return parsed;
    } catch (error) {
      // Error parsing Chinese zodiac response, using fallback
      
      // 返回默认中国生肖运势结构
      return {
        analysis: {
          testType: "numerology",
          subtype: "zodiac",
          overview: "Your Chinese zodiac fortune brings positive energy and opportunities for growth.",
          
          zodiacInfo: {
            animal: "Dragon",
            element: "Wood",
            year: new Date().getFullYear(),
            isCurrentYear: false,
            isConflictYear: false
          },
          
          zodiacFortune: {
            period: "yearly",
            overall: 7,
            career: 6,
            wealth: 5,
            love: 8,
            health: 6,
            luckyNumbers: [1, 2, 3, 4, 5],
            luckyColors: ["Red", "Gold", "Yellow"],
            luckyDirection: "South",
            guardianAnimals: ["Rat", "Monkey"]
          },
          
          fortuneAnalysis: {
            currentPeriod: {
              overall: 7,
              career: 8,
              wealth: 6,
              love: 7,
              health: 6,
              overallDescription: "This period brings balanced opportunities with steady progress in most life areas.",
              careerDescription: "Career advancement opportunities may arise through networking and skill development.",
              wealthDescription: "Financial stability is achievable through careful planning and avoiding impulsive decisions.",
              loveDescription: "Relationships may deepen with meaningful connections and improved communication.",
              healthDescription: "Maintain regular exercise and balanced diet for optimal well-being.",
              keyEvents: ["Career opportunity in mid-period", "Important relationship milestone"],
              advice: ["Focus on building strong relationships", "Invest in personal development"]
            }
          },
          
          luckyElements: {
            colors: ["Red", "Gold", "Yellow"],
            numbers: [1, 2, 3, 4, 5],
            directions: ["South", "East"],
            seasons: ["Spring", "Summer"]
          },
          
          overallInterpretation: "Your Chinese zodiac fortune indicates a period of steady growth and positive development across multiple life areas.",
          
          relationshipAdvice: [
            "Prioritize meaningful connections",
            "Improve communication with loved ones",
            "Be open to new relationships"
          ],
          
          healthTips: [
            "Maintain regular exercise routine",
            "Focus on stress management",
            "Get adequate rest and sleep"
          ]
        }
      };
    }
  }

}
