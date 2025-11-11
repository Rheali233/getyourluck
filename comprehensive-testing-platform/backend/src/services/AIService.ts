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
  private async callDeepSeek(prompt: string, retryCount = 0, customTimeout?: number, maxTokens?: number, disableRetry = false): Promise<any> {
    try {
      // 使用自定义超时或默认超时
      const timeout = customTimeout || this.timeout;
      // 使用自定义max_tokens或默认值
      const tokens = maxTokens || 4000;
      // 保存 maxTokens 供后续 readTimeout 计算使用
      const responseMaxTokens = tokens;
      
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
      // 剩余时间 = 总超时时间 - 已用时间 - 缓冲时间
      // 对于大响应体（maxTokens >= 2500），减少缓冲时间以最大化读取时间
      const isLargeResponse = timeout >= 60000 && responseMaxTokens >= 2500;
      const initialBuffer = isLargeResponse ? 800 : 5000; // 大响应体进一步减少初始缓冲（从1000ms降到800ms）
      const remainingTime = timeout - fetchTime - initialBuffer;
      if (remainingTime < 10000) {
        // eslint-disable-next-line no-console
        console.warn(`[AI Debug] Low remaining time for response reading: ${remainingTime}ms`);
      }

      // 由于 content-length=null 表示流式传输，arrayBuffer() 读取可能很慢
      // 尝试使用 response.text() 方法，它可能比 arrayBuffer() 更快
      let data: any;
      const readStartTime = Date.now();
      
      try {
          // eslint-disable-next-line no-console
        console.log('[AI Debug] Reading response body using response.text() method');
        
        // 创建超时保护，确保在 Worker 超时前完成读取
        // 对于流式传输，需要更长的超时时间，但不超过 Worker 限制
        // 对于 VARK、Love Style 等类型，响应体可能较大，需要更长的读取时间
        // readTimeout 应该根据 customTimeout 动态调整：
        // - 如果 customTimeout >= 60000ms 且 maxTokens >= 4000，最大化读取时间（最多 timeout - 1000ms）
        // - 否则，使用默认的最大值 45000ms
        // 优化：对于大响应体，最小化缓冲时间，最大化读取时间
        const isLargeResponseForRead = timeout >= 60000 && responseMaxTokens >= 2500;
        const readBufferTime = isLargeResponseForRead ? 200 : 2000; // 大响应体只留0.2秒缓冲（从300ms降到200ms）
        const maxReadTimeout = timeout >= 60000 ? timeout - readBufferTime : 45000;
        const readTimeout = Math.max(30000, Math.min(remainingTime - 200, maxReadTimeout)); // 减少剩余时间计算中的缓冲（从300ms降到200ms）
          // eslint-disable-next-line no-console
        console.log(`[AI Debug] Response reading timeout set to ${readTimeout}ms, remaining time: ${remainingTime}ms, max read timeout: ${maxReadTimeout}ms, total timeout: ${timeout}ms`);
        
        // 使用 response.text() 而不是 arrayBuffer()，可能对流式传输更友好
        const responseText = await Promise.race([
          response.text(),
          new Promise<string>((_, reject) => {
            setTimeout(() => {
              reject(new Error(`Response body reading timeout after ${readTimeout}ms`));
            }, readTimeout);
          })
        ]);
        
        const readTime = Date.now() - readStartTime;
          // eslint-disable-next-line no-console
        console.log(`[AI Debug] Response text read in ${readTime}ms, length: ${responseText.length} chars`);
        
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response text from AI service');
        }
        
          // eslint-disable-next-line no-console
        console.log('[AI Debug] Response text preview (first 200 chars):', responseText.substring(0, 200));
        
        // 解析 JSON
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          // eslint-disable-next-line no-console
          console.error('[AI Debug] JSON parse error:', parseError);
          // eslint-disable-next-line no-console
          console.error('[AI Debug] Response text (first 500 chars):', responseText.substring(0, 500));
          // eslint-disable-next-line no-console
          console.error('[AI Debug] Response text (last 500 chars):', responseText.substring(Math.max(0, responseText.length - 500)));
          throw new Error(`Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
        
        const totalReadTime = Date.now() - readStartTime;
          // eslint-disable-next-line no-console
        console.log(`[AI Debug] Successfully parsed response in ${totalReadTime}ms`);
          
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
        
      } catch (parseError) {
        const totalReadTime = Date.now() - readStartTime;
        // eslint-disable-next-line no-console
        console.error('[AI Debug] Failed to read/parse response:', parseError);
        // eslint-disable-next-line no-console
        console.error('[AI Debug] Parse error details:', {
          name: parseError instanceof Error ? parseError.name : 'Unknown',
          message: parseError instanceof Error ? parseError.message : String(parseError),
          stack: parseError instanceof Error ? parseError.stack?.substring(0, 500) : 'No stack',
          fetchTime: fetchTime,
          readTime: totalReadTime,
          remainingTime: remainingTime
        });
        
        // 检查是否是超时错误
        if (parseError instanceof Error && (
          parseError.message.includes('timeout') || 
          parseError.message.includes('aborted') ||
          parseError.name === 'AbortError'
        )) {
          throw new Error(`Response body reading timeout after ${totalReadTime}ms. The AI response is too large or the connection is too slow. Remaining time: ${remainingTime}ms`);
        }
        
        // 检查是否是网络连接错误
        if (parseError instanceof Error && (
          parseError.message.includes('Network connection lost') ||
          parseError.message.includes('ERR_CONNECTION_CLOSED') ||
          parseError.message.includes('connection closed')
        )) {
          throw new Error(`Network connection lost while reading response body. The connection was closed before the response could be fully read. Read time: ${totalReadTime}ms`);
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

      if (retryCount < this.maxRetries && this.isRetryableError(error) && !disableRetry) {
        const delayMs = 1000 * Math.pow(2, retryCount);
        // eslint-disable-next-line no-console
        console.log(`[AI Debug] Retrying DeepSeek API call (attempt ${retryCount + 1}/${this.maxRetries}) after ${delayMs}ms delay`);
        await this.delay(delayMs);
        return this.callDeepSeek(prompt, retryCount + 1, customTimeout, maxTokens, disableRetry);
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
    // Love Style分析：降低max_tokens以减少响应体大小，确保在60秒内完成读取
    // 由于需要详细分析6个维度、心理分析、关系动态等，响应体可能较大
    // 降低 maxTokens 从 3000 到 2500，减少约17%的响应体大小，有助于在60秒内完成
    // 禁用重试机制，避免在60秒硬限制下浪费时间
    const customTimeout = 60000; // 60秒超时，readTimeout 将通过优化计算获得更长的时间
    const maxTokens = 2500; // 降低max_tokens以减少响应体大小
    const disableRetry = true; // 禁用重试，避免浪费60秒限制
    const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens, disableRetry);
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
    // VARK分析：增加max_tokens以确保完整响应（包含所有4个维度的分析）
    // 增加超时时间以应对大响应体的读取
    const customTimeout = 60000; // 60秒超时，给响应体读取更多时间
    const maxTokens = 5000; // 增加max_tokens以确保完整响应
    const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens);
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
      // Birth-chart分析：使用简化的schema，降低max_tokens以确保快速响应
      // 简化后的schema只包含核心行星解释，响应体更小，读取更快
      const customTimeout = 45000;
      const maxTokens = 1500; // 简化schema后，1500 tokens足够返回核心分析
      const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens);
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
    
    // 处理 ""json { 这种格式（移除开头的引号和 "json"）
    text = text.replace(/^["']*json\s*/i, '').trim();
    
    // 去掉 ```json ``` 或 ``` 包裹
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // 移除开头的引号（如果存在）
    if (text.startsWith('"') || text.startsWith("'")) {
      text = text.substring(1);
    }
    if (text.endsWith('"') || text.endsWith("'")) {
      text = text.substring(0, text.length - 1);
    }
    text = text.trim();
    
    // 截取第一个 { 到最后一个 } 之间内容
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end >= start) {
      text = text.slice(start, end + 1);
    }
    
    // 尝试修复常见的JSON格式问题
    // 1. 移除多余的逗号（在 } 或 ] 之前）
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
    
    // 5. 修复未闭合的字符串（如果最后一个字符不是 }，尝试修复）
    // 检查是否以 } 结尾，如果不是，尝试找到最后一个完整的对象
    if (!text.trim().endsWith('}')) {
      const lastBraceIndex = text.lastIndexOf('}');
      if (lastBraceIndex > 0) {
        // 检查最后一个 } 之前是否有未闭合的引号或括号
        const beforeLastBrace = text.substring(0, lastBraceIndex);
        const openBraces = (beforeLastBrace.match(/{/g) || []).length;
        const closeBraces = (beforeLastBrace.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          // 有未闭合的 {，尝试修复
          const missingBraces = openBraces - closeBraces;
          text = text.substring(0, lastBraceIndex + 1) + '}'.repeat(missingBraces);
        } else {
          // 直接截取到最后一个 }
          text = text.substring(0, lastBraceIndex + 1);
        }
      }
    }
    
    // 6. 修复未闭合的引号（如果字符串值没有正确闭合）
    // 查找所有未闭合的字符串引号
    let quoteCount = 0;
    let inString = false;
    let escapeNext = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        quoteCount++;
      }
    }
    // 如果引号数量是奇数，说明有未闭合的引号，尝试修复
    if (quoteCount % 2 !== 0 && inString) {
      // 在末尾添加闭合引号
      text = text + '"';
    }
    
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
        // eslint-disable-next-line no-console
        console.error('[AIService] Love Style response content is empty');
        throw new Error('Empty response content');
      }
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style raw response length: ${content.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style raw response preview (first 500 chars):`, content.substring(0, 500));
      
      // 处理模型返回中可能包含的 ```json 代码块，并使用健壮解析
      const cleaned = this.sanitizeAIJSON(content);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style cleaned response length: ${cleaned.length}`);
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style cleaned response preview (first 500 chars):`, cleaned.substring(0, 500));
      
      // 使用健壮的JSON解析方法，与Love Language保持一致
      const parsed = this.parseJSONRobust(cleaned, 'Love Style');
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style JSON parsed successfully, parsed keys:`, Object.keys(parsed));
      
      // eslint-disable-next-line no-console
      console.log(`[AIService] Love Style parse successful`);
      
      return parsed;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[AIService] Love Style parse error:', error);
      // eslint-disable-next-line no-console
      console.error('[AIService] Love Style parse error details:', error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 1000)
      } : error);
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
        console.error('[AIService] VARK response: Empty content');
        throw new Error('Empty response content');
      }
      
      console.log(`[AIService] VARK response content length: ${content.length} chars`);
      console.log(`[AIService] VARK response preview (first 500 chars): ${content.substring(0, 500)}`);
      
      // 处理模型返回中可能包含的 ```json 代码块
      const cleaned = this.sanitizeAIJSON(content);
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error('[AIService] VARK JSON parse error:', parseError instanceof Error ? parseError.message : 'Unknown error');
        console.error('[AIService] VARK cleaned content (first 1000 chars):', cleaned.substring(0, 1000));
        throw new Error(`Failed to parse VARK response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
      
      console.log('[AIService] VARK parsed JSON keys:', Object.keys(parsed || {}));
      console.log('[AIService] VARK parsed JSON preview (first 1000 chars):', JSON.stringify(parsed).substring(0, 1000));
      
      // 检查是否有 dimensionsAnalysis 在顶层
      if (parsed.dimensionsAnalysis && typeof parsed.dimensionsAnalysis === 'object') {
        console.log('[AIService] VARK found dimensionsAnalysis at top level, keys:', Object.keys(parsed.dimensionsAnalysis));
      } else {
        console.log('[AIService] VARK NO dimensionsAnalysis at top level');
      }
      
      // 现在AI应该直接返回我们期望的格式，不需要复杂的映射
      if (parsed && typeof parsed === 'object') {
        // 情况1：AI已返回统一schema（顶层包含 primaryStyle/scores）
        if (parsed.primaryStyle || parsed.scores) {
          // 验证必需字段是否存在，不允许使用默认值
          if (!parsed.primaryStyle) {
            throw new Error('Missing required VARK field: primaryStyle');
          }
          
          if (!parsed.scores || typeof parsed.scores !== 'object') {
            throw new Error('Missing required VARK field: scores');
          }
          
          if (!parsed.analysis || !String(parsed.analysis).trim()) {
            throw new Error('Missing required VARK field: analysis');
          }
          
          if (!parsed.dimensionsAnalysis || typeof parsed.dimensionsAnalysis !== 'object') {
            throw new Error('Missing required VARK field: dimensionsAnalysis');
          }
          
          // 验证所有4个维度的分析都存在
          const requiredDimensions = ['Visual', 'Auditory', 'Read/Write', 'Kinesthetic'];
          const missingDimensions = requiredDimensions.filter(dim => {
            const analysis = parsed.dimensionsAnalysis[dim];
            return !analysis || !String(analysis).trim();
          });
          
          if (missingDimensions.length > 0) {
            console.error('[AIService] VARK validation failed: missing dimensionsAnalysis for', missingDimensions);
            console.error('[AIService] VARK dimensionsAnalysis keys:', Object.keys(parsed.dimensionsAnalysis || {}));
            throw new Error(`Missing dimensionsAnalysis for: ${missingDimensions.join(', ')}. AI analysis is incomplete.`);
          }
          
          if (!parsed.learningStrategiesImplementation || typeof parsed.learningStrategiesImplementation !== 'object') {
            console.error('[AIService] VARK validation failed: missing learningStrategiesImplementation');
            console.error('[AIService] VARK parsed keys:', Object.keys(parsed || {}));
            throw new Error('Missing required VARK field: learningStrategiesImplementation');
          }
          
          console.log('[AIService] VARK validation passed: all required fields present');
          
          return {
            primaryStyle: parsed.primaryStyle,
            secondaryStyle: parsed.secondaryStyle || '',
            dominantStyle: parsed.primaryStyle,
            scores: parsed.scores,
            allScores: parsed.scores,
            analysis: parsed.analysis,
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
            studyTips: Array.isArray(parsed.studyTips) ? parsed.studyTips : [],
            learningStrategies: Array.isArray(parsed.learningStrategies) ? parsed.learningStrategies : [],
            learningProfile: parsed.learningProfile || {},
            learningStrategiesImplementation: parsed.learningStrategiesImplementation,
            learningEffectiveness: parsed.learningEffectiveness || {},
            dimensionsAnalysis: parsed.dimensionsAnalysis,
            encouragement: parsed.encouragement,
            environmentSuggestions: parsed.environmentSuggestions
          };
        }

        // 情况2：AI返回 analysis 对象（当前日志所示结构）
        if (parsed.analysis && typeof parsed.analysis === 'object') {
          console.log('[AIService] VARK processing analysis object format');
          const a = parsed.analysis as any;
          console.log('[AIService] VARK analysis object keys:', Object.keys(a || {}));
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

          // 构建 dimensionsAnalysis 字段（每个维度的个性化分析）
          // 必须从AI响应中提取，不允许使用默认值
          const buildDimensionsAnalysis = (): Record<string, string> => {
            const dimensionsAnalysis: Record<string, string> = {};
            const styleNames = ['Visual', 'Auditory', 'Read/Write', 'Kinesthetic'];
            const missingDimensions: string[] = [];
            
            // 尝试从AI响应中提取维度分析
            const modalityBreakdown = a.modality_breakdown || {};
            const detailedInsights = a.detailedInsights || a.detailed_insights || {};
            const learningStyleProfile = a.learningStyleProfile || a.learning_style_profile || a.learning_profile || {};
            
            console.log('[AIService] VARK buildDimensionsAnalysis - checking all possible sources');
            console.log('[AIService] VARK a object keys:', Object.keys(a || {}));
            console.log('[AIService] VARK learningStyleProfile keys:', Object.keys(learningStyleProfile));
            
            // 优先检查 parsed.dimensionsAnalysis（如果AI直接返回在顶层）
            if (parsed.dimensionsAnalysis && typeof parsed.dimensionsAnalysis === 'object') {
              styleNames.forEach(styleName => {
                const analysis = parsed.dimensionsAnalysis[styleName];
                if (analysis && String(analysis).trim()) {
                  dimensionsAnalysis[styleName] = String(analysis).trim();
                } else {
                  missingDimensions.push(styleName);
                }
              });
              
              if (missingDimensions.length === 0) {
                return dimensionsAnalysis;
              }
            }
            
            // 检查 a.dimensionsAnalysis（如果AI返回在analysis对象内）
            if (a.dimensionsAnalysis && typeof a.dimensionsAnalysis === 'object') {
              console.log('[AIService] VARK found dimensionsAnalysis in analysis object, keys:', Object.keys(a.dimensionsAnalysis));
              styleNames.forEach(styleName => {
                if (dimensionsAnalysis[styleName]) {
                  return; // 已存在，跳过
                }
                const analysis = a.dimensionsAnalysis[styleName];
                if (analysis && String(analysis).trim()) {
                  dimensionsAnalysis[styleName] = String(analysis).trim();
                } else {
                  if (!missingDimensions.includes(styleName)) {
                    missingDimensions.push(styleName);
                  }
                }
              });
              
              // 如果所有维度都找到了，返回结果
              const stillMissing = styleNames.filter(name => !dimensionsAnalysis[name]);
              if (stillMissing.length === 0) {
                console.log('[AIService] VARK successfully extracted all dimensionsAnalysis from analysis object');
                return dimensionsAnalysis;
              }
              console.log('[AIService] VARK still missing dimensionsAnalysis for:', stillMissing);
              // 否则继续尝试其他来源
            }
            
            // 尝试从 modality_breakdown 提取
            console.log('[AIService] VARK attempting to extract from modality_breakdown, keys:', Object.keys(modalityBreakdown));
            console.log('[AIService] VARK detailedInsights keys:', Object.keys(detailedInsights));
            
            styleNames.forEach(styleName => {
              if (dimensionsAnalysis[styleName]) {
                return; // 已存在，跳过
              }
              
              const key = styleName === 'Read/Write' ? 'read_write' : styleName.toLowerCase();
              const modality = modalityBreakdown[key] || {};
              
              console.log(`[AIService] VARK checking ${styleName} (key: ${key}), modality keys:`, Object.keys(modality));
              
              // 优先使用AI生成的维度分析
              const analysis = modality.analysis || modality.description || modality.interpretation || modality.summary;
              
              // 如果没有，尝试从其他字段提取
              if (!analysis) {
                if (styleName === 'Visual' && detailedInsights.visualAnalysis) {
                  dimensionsAnalysis[styleName] = String(detailedInsights.visualAnalysis).trim();
                  console.log(`[AIService] VARK extracted ${styleName} from detailedInsights.visualAnalysis`);
                } else if (styleName === 'Auditory' && detailedInsights.auditoryAnalysis) {
                  dimensionsAnalysis[styleName] = String(detailedInsights.auditoryAnalysis).trim();
                  console.log(`[AIService] VARK extracted ${styleName} from detailedInsights.auditoryAnalysis`);
                } else if (styleName === 'Read/Write' && detailedInsights.readWriteAnalysis) {
                  dimensionsAnalysis[styleName] = String(detailedInsights.readWriteAnalysis).trim();
                  console.log(`[AIService] VARK extracted ${styleName} from detailedInsights.readWriteAnalysis`);
                } else if (styleName === 'Kinesthetic' && detailedInsights.kinestheticAnalysis) {
                  dimensionsAnalysis[styleName] = String(detailedInsights.kinestheticAnalysis).trim();
                  console.log(`[AIService] VARK extracted ${styleName} from detailedInsights.kinestheticAnalysis`);
                } else {
                  if (!missingDimensions.includes(styleName)) {
                    missingDimensions.push(styleName);
                  }
                  console.log(`[AIService] VARK could not find analysis for ${styleName}`);
                }
              } else {
                dimensionsAnalysis[styleName] = String(analysis).trim();
                console.log(`[AIService] VARK extracted ${styleName} from modality_breakdown`);
              }
            });
            
            console.log('[AIService] VARK dimensionsAnalysis after extraction:', Object.keys(dimensionsAnalysis));
            console.log('[AIService] VARK missingDimensions:', missingDimensions);
            
            // 如果缺少任何维度的分析，抛出错误
            if (missingDimensions.length > 0) {
              console.error('[AIService] VARK buildDimensionsAnalysis failed - missing dimensions:', missingDimensions);
              console.error('[AIService] VARK extracted dimensionsAnalysis keys:', Object.keys(dimensionsAnalysis));
              console.error('[AIService] VARK modality_breakdown keys:', Object.keys(modalityBreakdown));
              console.error('[AIService] VARK detailedInsights keys:', Object.keys(detailedInsights));
              throw new Error(`Missing dimensionsAnalysis for: ${missingDimensions.join(', ')}. AI analysis is incomplete.`);
            }
            
            console.log('[AIService] VARK buildDimensionsAnalysis succeeded, all dimensions found');
            return dimensionsAnalysis;
          };
          
          resultObject.dimensionsAnalysis = buildDimensionsAnalysis();

          // 关键字段强校验 - 不允许使用默认值
          const hasScores = typeof resultObject.scores?.V === 'number'
            && typeof resultObject.scores?.A === 'number'
            && typeof resultObject.scores?.R === 'number'
            && typeof resultObject.scores?.K === 'number';
          
          // 验证必需字段是否存在且非空
          if (!resultObject.primaryStyle || !hasScores) {
            throw new Error('Missing required VARK fields: primaryStyle or scores');
          }
          
          if (!String(resultObject.analysis || '').trim()) {
            throw new Error('Missing required VARK field: analysis');
          }
          
          // 验证 dimensionsAnalysis 是否完整（所有4个维度都必须有分析）
          if (!resultObject.dimensionsAnalysis || typeof resultObject.dimensionsAnalysis !== 'object') {
            throw new Error('Missing required VARK field: dimensionsAnalysis');
          }
          
          const requiredDimensions = ['Visual', 'Auditory', 'Read/Write', 'Kinesthetic'];
          const missingDimensions = requiredDimensions.filter(dim => {
            const analysis = resultObject.dimensionsAnalysis[dim];
            return !analysis || !String(analysis).trim();
          });
          
          if (missingDimensions.length > 0) {
            throw new Error(`Missing dimensionsAnalysis for: ${missingDimensions.join(', ')}. AI analysis is incomplete.`);
          }
          
          // 验证 learningStrategiesImplementation 是否存在
          if (!resultObject.learningStrategiesImplementation || typeof resultObject.learningStrategiesImplementation !== 'object') {
            throw new Error('Missing required VARK field: learningStrategiesImplementation');
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
      
      // 为BaZi和Birth-chart分析设置较低的max_tokens以减少响应时间和响应体大小
      // 使用简化的schema后，可以进一步降低max_tokens
      let maxTokens: number;
      let customTimeout: number;
      
      if (data.testType === 'numerology') {
        maxTokens = 800; // BaZi/ZiWei分析：平衡内容详细度和响应时间
        customTimeout = 45000; // 45秒
      } else if (data.testType === 'birth-chart') {
        maxTokens = 1500; // Birth-chart：简化schema后，1500 tokens足够
        customTimeout = 45000; // 45秒
      } else if (data.testType === 'love_language') {
        maxTokens = 1500; // Love Language Test：降低max_tokens以避免响应体读取超时
        customTimeout = 30000; // 30秒
      } else if (data.testType === 'love_style') {
        maxTokens = 2500; // Love Style：进一步降低max_tokens以减少响应体大小，确保在60秒内完成读取
        // Love Style 的 prompt 更复杂（14984 chars vs interpersonal 6877 chars），响应体较大
        // 降低 maxTokens 从 3000 到 2500，减少约17%的响应体大小，有助于在60秒内完成
        // 禁用重试机制，避免在60秒硬限制下浪费时间
        customTimeout = 60000; // 60秒超时，readTimeout 将通过优化计算获得更长的时间
      } else if (data.testType === 'interpersonal') {
        maxTokens = 5000; // Interpersonal Skills：增加max_tokens以确保完整响应（包含4个维度的详细分析和专业洞察）
        customTimeout = 60000; // 60秒超时，给响应体读取更多时间
      } else if (data.testType === 'vark') {
        maxTokens = 5000; // VARK：增加max_tokens以确保完整响应（包含所有4个维度的分析）
        customTimeout = 60000; // 60秒超时，给响应体读取更多时间
      } else if (complexAnalysisTypes.includes(data.testType)) {
        maxTokens = 4000; // 其他复杂分析保持4000
        customTimeout = 45000; // 45秒
      } else {
        maxTokens = 3000; // 简单分析使用3000
        customTimeout = 30000; // 30秒
      }
      
      // 对于 love_style，禁用重试机制以避免在60秒硬限制下浪费时间
      const disableRetry = data.testType === 'love_style';
      const response = await this.callDeepSeek(prompt, 0, customTimeout, maxTokens, disableRetry);
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
          // BaZi 也先提取 content，与 ZiWei 保持一致
          const content = response.choices[0].message.content || '';
          if (!content) {
            throw new Error('Empty AI response content for numerology analysis');
          }
          parsedResult = this.parseNumerologyResponse(content);
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
    
    if (data.testType === 'vark') {
      // 转换answers格式以匹配VARK方法期望的格式
      // VARK是多选题，answer.value可能是数组（如['V', 'A', 'R']）或单个值
      const varkAnswers: UserAnswer[] = data.answers.map((answer: any) => {
        // 处理数组值：将数组转换为逗号分隔的字符串
        let answerValue: string | number;
        if (Array.isArray(answer.value)) {
          // 如果是数组，转换为逗号分隔的字符串，如 "V,A,R"
          answerValue = answer.value.join(',');
        } else if (answer.value !== undefined && answer.value !== null) {
          // 单个值直接使用
          answerValue = answer.value;
        } else {
          // 如果没有value，尝试使用selectedOptions（兼容旧格式）
          answerValue = Array.isArray(answer.selectedOptions) 
            ? answer.selectedOptions.join(',') 
            : '';
        }
        
        return {
          questionId: answer.questionId,
          answer: answerValue,
          score: 0 // VARK不需要分数，由AI根据答案分析
        };
      });
      
      const context: TestContext = {
        testType: data.testType,
        language: 'en'
      };
      
      return UnifiedPromptBuilder.buildPrompt(varkAnswers, context, 'vark');
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

Return JSON (detailed analysis):
{
  "analysis": {
    "testType": "numerology",
    "subtype": "${type}",
    "overview": "Comprehensive overview (3-4 sentences explaining the overall BaZi characteristics)",
    "keyInsights": [{"pillar": "Year", "element": "Metal over Dragon"}, {"pillar": "Month", "element": "Wood over Tiger"}, {"pillar": "Day", "element": "Fire over Horse"}, {"pillar": "Hour", "element": "Earth over Dog"}],
    "personalityTraits": ["3-4 key personality traits with brief explanations"],
    "careerGuidance": ["3-4 career suggestions with brief explanations"],
    "baZiAnalysis": {
      "dayMasterStrength": {
        "strength": "weak/balanced/strong",
        "description": "Detailed explanation of day master strength (2-3 sentences)",
        "recommendations": ["3-4 practical recommendations"]
      },
      "favorableElements": {
        "useful": ["2-3 elements with brief explanations"],
        "harmful": ["2-3 elements with brief explanations"],
        "neutral": ["1-2 elements with brief explanations"]
      },
      "fiveElements": {
        "elements": {"metal": 2, "wood": 3, "water": 1, "fire": 2, "earth": 2},
        "dominantElement": "Wood",
        "weakElement": "Water",
        "balance": "balanced/unbalanced",
        "analysis": "Detailed analysis of five elements balance (2-3 sentences)"
      },
      "tenGods": {
        "biJian": {"name": "Bi Jian", "element": "Metal", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "jieCai": {"name": "Jie Cai", "element": "Wood", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "shiShen": {"name": "Shi Shen", "element": "Fire", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "shangGuan": {"name": "Shang Guan", "element": "Earth", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "pianCai": {"name": "Pian Cai", "element": "Water", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "zhengCai": {"name": "Zheng Cai", "element": "Metal", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "qiSha": {"name": "Qi Sha", "element": "Wood", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "zhengGuan": {"name": "Zheng Guan", "element": "Fire", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "pianYin": {"name": "Pian Yin", "element": "Earth", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"},
        "zhengYin": {"name": "Zheng Yin", "element": "Water", "strength": "weak/balanced/strong", "meaning": "Brief meaning (5-8 words)"}
      }
    },
    "wealthAnalysis": {
      "wealthLevel": "low/medium/high",
      "wealthSource": ["2-3 sources with brief explanations"],
      "investmentAdvice": ["2-3 investment suggestions"]
    },
    "relationshipAnalysis": {
      "marriageTiming": "Detailed timing analysis (2-3 sentences)",
      "partnerCharacteristics": "Detailed partner characteristics (2-3 sentences)",
      "marriageAdvice": "Detailed marriage advice (2-3 sentences)"
    },
    "healthAnalysis": {
      "overallHealth": "good/fair/poor",
      "weakAreas": ["2-3 weak areas with brief explanations"],
      "beneficialActivities": ["2-3 beneficial activities"]
    },
    "fortuneAnalysis": {
      "currentYear": {
        "year": 2024,
        "overall": 7,
        "career": 7,
        "wealth": 6,
        "health": 7,
        "relationships": 8,
        "overallDescription": "Detailed year analysis (3-4 sentences)",
        "keyEvents": ["2-3 key events"],
        "advice": ["3-4 pieces of advice"]
      }
    },
    "luckyElements": {
      "colors": ["2-3 colors"],
      "numbers": [1, 3, 5],
      "directions": ["2-3 directions"]
    }
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no extra text. Start with { and end with }. Provide detailed and comprehensive analysis. English only.`;
  }

  async analyzeNumerology(analysisData: any): Promise<any> {
    const prompt = this.buildNumerologyPrompt(analysisData);
    const analysisType = analysisData?.type || 'bazi';
    // 将超时时间调整为45秒，确保在Cloudflare Workers执行时间限制内
    const customTimeout = 45000;
    // BaZi分析：使用详细schema，但限制max_tokens以避免响应体读取超时
    // 包含完整的分析字段：baZiAnalysis、wealthAnalysis、relationshipAnalysis、healthAnalysis、fortuneAnalysis
    // 降低到 800 tokens 以确保响应体能在超时时间内读取完成
    const maxTokens = 800; // 平衡内容详细度和响应时间
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

    // BaZi 也先提取 content，与 ZiWei 保持一致的处理方式
    const content = response?.choices?.[0]?.message?.content || '';
    if (!content) {
      throw new Error('Empty AI response content for numerology BaZi analysis');
    }
    return this.parseNumerologyResponse(content);
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
      // 返回默认星盘结构（与简化后的schema兼容）
      return {
        sunSign: 'unknown',
        moonSign: 'unknown',
        risingSign: 'unknown',
        planetaryPositions: {},
        personalityProfile: {
          coreTraits: ['Intuitive', 'Adaptable'],
          strengths: ['Natural leadership', 'Emotional intelligence'],
          challenges: ['Perfectionism', 'Overthinking'],
          lifePurpose: 'To inspire and guide others through your unique perspective'
        },
        corePlanetaryInterpretations: {
          sunInterpretation: 'Sun sign influence on core identity',
          moonInterpretation: 'Moon sign influence on emotional nature',
          risingInterpretation: 'Rising sign influence on outward personality'
        },
        lifeGuidance: {
          career: 'Focus on creative and leadership roles',
          relationships: 'Seek partners who appreciate your depth',
          personalGrowth: 'Develop emotional balance and trust',
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
  private parseNumerologyResponse(content: string): any {
    try {
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
        console.error('[AIService] Sanitized JSON (first 500 chars):', cleaned.substring(0, 500));
        console.error('[AIService] Sanitized JSON (last 500 chars):', cleaned.substring(Math.max(0, cleaned.length - 500)));
        
        // 尝试更激进的修复：如果错误位置已知，尝试在该位置修复
        if (parseError instanceof SyntaxError && parseError.message.includes('position')) {
          const positionMatch = parseError.message.match(/position (\d+)/);
          if (positionMatch) {
            const errorPosition = parseInt(positionMatch[1], 10);
            console.error(`[AIService] JSON error at position ${errorPosition}, attempting repair...`);
            
            // 尝试在错误位置附近修复
            let repaired = cleaned;
            
            // 策略1: 检查括号平衡并修复
            const openBraces = (cleaned.match(/{/g) || []).length;
            const closeBraces = (cleaned.match(/}/g) || []).length;
            const openBrackets = (cleaned.match(/\[/g) || []).length;
            const closeBrackets = (cleaned.match(/\]/g) || []).length;
            
            if (openBraces > closeBraces) {
              repaired = cleaned + '}'.repeat(openBraces - closeBraces);
              console.log(`[AIService] Added ${openBraces - closeBraces} closing braces`);
            }
            if (openBrackets > closeBrackets) {
              repaired = repaired + ']'.repeat(openBrackets - closeBrackets);
              console.log(`[AIService] Added ${openBrackets - closeBrackets} closing brackets`);
            }
            
            // 策略2: 如果错误位置在中间，尝试在该位置插入缺失的逗号或闭合括号
            if (errorPosition < cleaned.length * 0.9 && errorPosition > 100) {
              const beforeError = cleaned.substring(0, errorPosition);
              const afterError = cleaned.substring(errorPosition);
              
              // 检查错误位置前后的字符
              const charBefore = beforeError[beforeError.length - 1];
              const charAfter = afterError[0];
              
              // 如果错误位置前是值，后面是键，可能需要添加逗号和闭合括号
              if (charBefore === '"' && charAfter === '"') {
                // 可能是缺少逗号
                repaired = beforeError + ',' + afterError;
                console.log('[AIService] Attempted to add missing comma');
              } else if (charBefore === '}' && charAfter === '"') {
                // 可能是对象后缺少逗号
                repaired = beforeError + ',' + afterError;
                console.log('[AIService] Attempted to add comma after object');
              } else if (charBefore === ']' && charAfter === '"') {
                // 可能是数组后缺少逗号
                repaired = beforeError + ',' + afterError;
                console.log('[AIService] Attempted to add comma after array');
              }
            }
            
            // 尝试解析修复后的 JSON
            if (repaired !== cleaned) {
              try {
                parsed = JSON.parse(repaired);
                console.log('[AIService] Successfully repaired JSON');
              } catch (retryError) {
                console.error('[AIService] Repair attempt failed:', retryError);
              }
            }
            
            // 策略3: 如果修复失败，尝试截取到错误位置之前的内容
            if (!parsed && errorPosition > 100) {
              // 找到错误位置之前的最后一个完整的对象
              const beforeError = cleaned.substring(0, errorPosition);
              
              // 尝试找到最后一个完整的键值对
              let lastValidPosition = errorPosition;
              
              // 向后查找，找到最后一个完整的对象或数组
              for (let i = errorPosition - 1; i >= 0; i--) {
                const char = cleaned[i];
                if (char === '}') {
                  // 检查这个 } 是否完整
                  const testStr = cleaned.substring(0, i + 1);
                  try {
                    JSON.parse(testStr);
                    lastValidPosition = i + 1;
                    break;
                  } catch (e) {
                    // 继续查找
                  }
                } else if (char === ']') {
                  // 检查这个 ] 是否完整
                  const testStr = cleaned.substring(0, i + 1);
                  try {
                    JSON.parse(testStr);
                    lastValidPosition = i + 1;
                    break;
                  } catch (e) {
                    // 继续查找
                  }
                }
              }
              
              if (lastValidPosition < errorPosition && lastValidPosition > 100) {
                const truncated = cleaned.substring(0, lastValidPosition);
                // 确保截取后的 JSON 是完整的
                const openBracesInTruncated = (truncated.match(/{/g) || []).length;
                const closeBracesInTruncated = (truncated.match(/}/g) || []).length;
                const finalTruncated = truncated + '}'.repeat(openBracesInTruncated - closeBracesInTruncated);
                
                try {
                  parsed = JSON.parse(finalTruncated);
                  console.log(`[AIService] Successfully parsed truncated JSON at position ${lastValidPosition}`);
                } catch (truncateError) {
                  console.error('[AIService] Truncation attempt failed:', truncateError);
                }
              }
            }
          }
        }
        
        // 如果所有修复尝试都失败，抛出错误
        if (!parsed) {
        throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
        }
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
    return `Analyze ZiWei DouShu for: ${fullName}, born ${birthDate} ${birthTime}, ${gender}, ${birthPlace}, ${calendarType} calendar.

Return JSON (minimal schema for fast response):
{
  "analysis": {
    "testType": "numerology",
    "subtype": "ziwei",
    "overview": "Brief overview (1-2 sentences)",
    "ziWeiChart": {
      "palaces": {
        "life": {"mainStars": ["Zi Wei"], "element": "Metal", "meaning": "Brief"},
        "parents": {"mainStars": ["Tian Fu"], "element": "Wood", "meaning": "Brief"},
        "fortune": {"mainStars": ["Tian Ji"], "element": "Water", "meaning": "Brief"},
        "property": {"mainStars": ["Tai Yang"], "element": "Fire", "meaning": "Brief"},
        "career": {"mainStars": ["Wu Qu"], "element": "Earth", "meaning": "Brief"},
        "friends": {"mainStars": ["Tian Tong"], "element": "Metal", "meaning": "Brief"},
        "travel": {"mainStars": ["Lian Zhen"], "element": "Wood", "meaning": "Brief"},
        "health": {"mainStars": ["Tian Liang"], "element": "Water", "meaning": "Brief"},
        "wealth": {"mainStars": ["Tai Yin"], "element": "Fire", "meaning": "Brief"},
        "children": {"mainStars": ["Tan Lang"], "element": "Earth", "meaning": "Brief"},
        "marriage": {"mainStars": ["Ju Men"], "element": "Metal", "meaning": "Brief"},
        "siblings": {"mainStars": ["Po Jun"], "element": "Wood", "meaning": "Brief"}
      },
      "lifePalace": "Brief analysis (2-3 sentences)",
      "parentsPalace": "Brief analysis (2-3 sentences)",
      "fortunePalace": "Brief analysis (2-3 sentences)",
      "propertyPalace": "Brief analysis (2-3 sentences)",
      "careerPalace": "Brief analysis (2-3 sentences)",
      "friendsPalace": "Brief analysis (2-3 sentences)",
      "travelPalace": "Brief analysis (2-3 sentences)",
      "healthPalace": "Brief analysis (2-3 sentences)",
      "wealthPalace": "Brief analysis (2-3 sentences)",
      "childrenPalace": "Brief analysis (2-3 sentences)",
      "marriagePalace": "Brief analysis (2-3 sentences)",
      "siblingsPalace": "Brief analysis (2-3 sentences)"
    },
    "personalityTraits": ["2-3 items"],
    "careerGuidance": ["2 items"],
    "relationshipAdvice": ["2 items"],
        "luckyElements": {
      "colors": ["2 colors"],
      "numbers": [1, 3],
      "directions": ["2 directions"]
    }
  }
}

Focus on core: ALL 12 palaces with main stars. Provide brief analysis (2-3 sentences) for each palace. Use pinyin names only. English only. Return valid JSON only.`;
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
