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
  private env: any;

  constructor(_dbService: DatabaseService, cacheService: CacheService, aiService: AIService, env?: any) {
    this.cacheService = cacheService;
    this.aiService = aiService;
    this.env = env;
    
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
      if (this.aiService) {
        const aiTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'birth-chart', 'compatibility', 'fortune'];
        const needsAI = aiTestTypes.includes(testType);
        
        if (needsAI) {
          try {
            const aiStartTime = Date.now();
            console.log(`[TestResultService] Starting AI analysis for ${testType} with ${answers.length} answers`);
            
            // 设置 AI 分析超时（30秒，确保在 Workers CPU 限制内）
            const aiTimeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('AI analysis timeout')), 30000);
            });
            
            const aiAnalysisPromise = this.aiService.analyzeTestResult({ testType, answers, userContext: {} });
            
            aiAnalysis = await Promise.race([aiAnalysisPromise, aiTimeoutPromise]) as any;
            
            const aiTime = Date.now() - aiStartTime;
            console.log(`[TestResultService] AI analysis completed for ${testType} in ${aiTime}ms`);
            console.log(`[TestResultService] AI analysis result keys:`, aiAnalysis ? Object.keys(aiAnalysis) : 'null');
            
          } catch (aiError) {
            // AI分析失败时记录警告，但不阻止测试结果处理
            const aiTime = Date.now() - aiStartTime;
            console.error(`[TestResultService] AI analysis failed for ${testType} after ${aiTime}ms:`, aiError instanceof Error ? aiError.message : 'Unknown error');
            console.error(`[TestResultService] AI error details:`, aiError instanceof Error ? {
              name: aiError.name,
              message: aiError.message,
              stack: aiError.stack?.substring(0, 500)
            } : aiError);
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
        // 对于VARK处理器，传递env参数
        if (testType === 'vark') {
          result = await (processor as any).process(answers, this.env);
        } else {
          result = await (processor as any).process(answers, aiAnalysis);
        }
      } else {
        result = await processor.process(answers);
        if (aiAnalysis) {
          Object.assign(result, aiAnalysis);
        }
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
