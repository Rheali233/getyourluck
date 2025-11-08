import { DatabaseService } from './DatabaseService';
import { CacheService } from './CacheService';
import { AIService } from './AIService';
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors';
import { TestResultProcessorFactory, MBTIResultProcessor, PHQ9ResultProcessor, EQResultProcessor, HappinessResultProcessor, HollandResultProcessor, DISCResultProcessor, LeadershipResultProcessor, LoveLanguageResultProcessor, LoveStyleResultProcessor, InterpersonalResultProcessor, VARKResultProcessor, TarotResultProcessor, NumerologyResultProcessor } from './testEngine/processors';

/**
 * 统一测试结果处理服务
 * 使用策略模式处理所有测试类型的结果计算和分析
 */
export class TestResultService {
  private processorFactory: TestResultProcessorFactory;
  private cacheService: CacheService;
  private aiService: AIService;

  constructor(_dbService: DatabaseService, cacheService: CacheService, aiService: AIService, _env?: any) {
    this.cacheService = cacheService;
    this.aiService = aiService;
    
    // 初始化处理器工厂
    this.processorFactory = new TestResultProcessorFactory();
    this.initializeProcessors();
  }

  /**
   * 初始化所有测试结果处理器
   */
  private initializeProcessors(): void {
    // 注册所有支持的测试类型处理器
    this.processorFactory.register('mbti', new MBTIResultProcessor());
    this.processorFactory.register('phq9', new PHQ9ResultProcessor());
    this.processorFactory.register('eq', new EQResultProcessor());
    this.processorFactory.register('happiness', new HappinessResultProcessor());
    this.processorFactory.register('holland', new HollandResultProcessor());
    this.processorFactory.register('disc', new DISCResultProcessor());
    this.processorFactory.register('leadership', new LeadershipResultProcessor());
    this.processorFactory.register('love_language', new LoveLanguageResultProcessor());
    this.processorFactory.register('love_style', new LoveStyleResultProcessor());
    this.processorFactory.register('interpersonal', new InterpersonalResultProcessor());
    this.processorFactory.register('vark', new VARKResultProcessor());
    // cognitive removed
    this.processorFactory.register('tarot', new TarotResultProcessor());
    this.processorFactory.register('numerology', new NumerologyResultProcessor());
    
    // All supported test type processors have been registered
  }

  /**
   * 处理测试提交并计算结果
   * @param testType 测试类型
   * @param answers 答案数据
   * @param userInfo 用户信息
   * @returns 测试结果
   */
  async processTestSubmission(
    testType: string,
    answers: any[]
  ): Promise<any> {
    try {
      // 使用策略模式获取对应的处理器
      if (!this.processorFactory.supports(testType)) {
        throw new ModuleError(
          `Unsupported test type: ${testType}`,
          ERROR_CODES.TEST_NOT_FOUND,
          404
        );
      }

      // 为塔罗牌模块添加缓存机制
      if (testType === 'tarot' && this.cacheService) {
        const cacheKey = this.generateTarotCacheKey(answers);
        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
          // console.log(`Tarot reading cache hit for key: ${cacheKey}`);
          return cached;
        }
      }

      const processor = this.processorFactory.getProcessor(testType);
      
      // 先获取AI分析结果（如果支持）
      // 对于需要 AI 的测试类型，设置超时保护
      let aiAnalysis = null;
      let aiAnalysisFailed = false;
      let aiError: string | null = null;
      let aiStartTime: number | null = null; // 在更外层作用域声明，以便在 catch 块中使用
      if (this.aiService) {
        const aiTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'disc', 'holland', 'leadership', 'love_language', 'love_style', 'interpersonal', 'vark', 'tarot', 'numerology', 'birth-chart', 'compatibility', 'fortune'];
        const needsAI = aiTestTypes.includes(testType);
        
        if (needsAI) {
          aiStartTime = Date.now(); // 在 try 块外定义，以便在 catch 块中使用
          try {
            console.log(`[TestResultService] Starting AI analysis for ${testType} with ${answers.length} answers`);
            
            // 根据测试类型设置不同的超时时间
            // 复杂分析（如 numerology, tarot, birth-chart）需要更长时间
            // 注意：超时控制由 AIService 内部的 AbortController 处理
            
            // 直接调用 AI 服务，超时控制由 AIService 内部的 AbortController 处理
            // 移除 Promise.race，避免双重超时机制冲突导致的 "Network connection lost" 错误
            // AIService 已经根据测试类型设置了合适的超时时间（120秒或45秒）
            if (testType === 'numerology') {
              const numerologyAnswer = answers[0]?.answer;
              if (!numerologyAnswer) {
                throw new Error('Invalid numerology analysis data');
              }
              aiAnalysis = await this.aiService.analyzeNumerology(numerologyAnswer);
            } else {
              aiAnalysis = await this.aiService.analyzeTestResult({ testType, answers, userContext: {} });
            }
            
            const aiTime = aiStartTime ? Date.now() - aiStartTime : 0;
            console.log(`[TestResultService] AI analysis completed for ${testType} in ${aiTime}ms`);
            console.log(`[TestResultService] AI analysis result keys:`, aiAnalysis ? Object.keys(aiAnalysis) : 'null');
            
          } catch (aiErrorCaught) {
            // AI分析失败时记录警告，但不阻止测试结果处理
            const aiTime = aiStartTime ? Date.now() - aiStartTime : 0;
            const errorMessage = aiErrorCaught instanceof Error ? aiErrorCaught.message : 'Unknown error';
            aiError = errorMessage;
            aiAnalysisFailed = true;
            
            console.error(`[TestResultService] AI analysis failed for ${testType} after ${aiTime}ms:`, errorMessage);
            console.error(`[TestResultService] AI error details:`, aiErrorCaught instanceof Error ? {
              name: aiErrorCaught.name,
              message: aiErrorCaught.message,
              stack: aiErrorCaught.stack?.substring(0, 500)
            } : aiErrorCaught);
            // 确保 aiAnalysis 保持为 null，这样处理器会使用基础结果
            aiAnalysis = null;
          }
        } else {
          console.log(`[TestResultService] Skipping AI analysis for ${testType} (not an AI-powered test)`);
        }
      } else {
        console.warn(`[TestResultService] No AI service available for ${testType}`);
      }
      
      // 将AI分析结果传递给处理器（如果处理器支持）
      // 检查处理器是否支持AI分析参数
      let result;
      if ((processor as any).process.length > 1) {
        // 所有支持AI分析的处理器都传递aiAnalysis参数
        result = await (processor as any).process(answers, aiAnalysis);
      } else {
        result = await processor.process(answers);
        if (aiAnalysis) {
          Object.assign(result, aiAnalysis);
        }
      }
      
      // 对于需要AI分析的测试类型，如果AI分析失败，抛出错误
      // 注意：tarot 测试的 AI 分析失败不应该阻止结果返回，因为基础解读仍然可用
      const criticalAITestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'disc', 'holland', 'leadership', 'love_language', 'love_style', 'interpersonal', 'vark'];
      if (criticalAITestTypes.includes(testType) && aiAnalysisFailed) {
        throw new ModuleError(
          `AI analysis failed for ${testType}: ${aiError || 'Unknown error'}. Please try again.`,
          ERROR_CODES.INTERNAL_ERROR,
          500
        );
      }

      // 添加 AI 分析状态信息到结果中
      if (aiAnalysisFailed) {
        result.aiAnalysisFailed = true;
        result.aiError = aiError;
      } else if (aiAnalysis) {
        result.aiAnalysisFailed = false;
      }

      // 添加testType字段到结果中
      result.testType = testType;

      // 为塔罗牌模块缓存结果
      if (testType === 'tarot' && this.cacheService) {
        const cacheKey = this.generateTarotCacheKey(answers);
        const cacheTTL = 3600; // 1小时缓存
        await this.cacheService.set(cacheKey, result, { ttl: cacheTTL });
        // console.log(`Tarot reading cached with key: ${cacheKey}`);
      }

      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`[TestResultService] Error processing ${testType} submission:`, error);
      // eslint-disable-next-line no-console
      console.error(`[TestResultService] Error details:`, error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error);
      
      if (error instanceof ModuleError) {
        throw error;
      }
      
      // 提供更详细的错误信息
      const errorMessage = error instanceof Error 
        ? `Failed to calculate test results: ${error.message}`
        : 'Failed to calculate test results';
      
      throw new ModuleError(
        errorMessage,
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  }

  /**
   * 生成塔罗牌缓存键
   */
  private generateTarotCacheKey(answers: any[]): string {
    // 基于卡牌ID、位置和正逆位生成缓存键
    const cardData = answers.map(answer => {
      const card = answer.answer.card;
      return `${card.id}_${answer.answer.position}_${answer.answer.isReversed ? 'R' : 'U'}`;
    }).sort().join('|');
    
    const questionCategory = answers[0]?.answer?.questionCategory || 'general';
    const spreadType = answers[0]?.answer?.spreadType || 'single_card';
    
    return `tarot:${spreadType}:${questionCategory}:${cardData}`;
  }

  /**
   * 获取支持的测试类型列表
   * @returns 支持的测试类型数组
   */
  getSupportedTestTypes(): string[] {
    return this.processorFactory.getSupportedTypes();
  }

  /**
   * 检查是否支持指定的测试类型
   * @param testType 测试类型
   * @returns 是否支持
   */
  supportsTestType(testType: string): boolean {
    return this.processorFactory.supports(testType);
  }

  /**
   * 获取测试结果处理器的统计信息
   * @returns 处理器统计信息
   */
  getProcessorStats(): any {
    const supportedTypes = this.processorFactory.getSupportedTypes();
    return {
      totalSupportedTypes: supportedTypes.length,
      supportedTypes,
      timestamp: new Date().toISOString()
    };
  }


}

// 单例实例已移除 - 应该通过依赖注入使用
