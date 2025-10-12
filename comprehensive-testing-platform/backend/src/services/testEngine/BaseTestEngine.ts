/**
 * 统一测试引擎基类
 * 遵循统一开发标准的测试引擎规范
 */

import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
import { TestResult, TestSubmission } from "../../../../shared/types/apiResponse";
import { DatabaseService } from "../DatabaseService";
import { CacheService, CacheOptions } from "../CacheService";

// 测试题目配置接口
export interface TestConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  configData: any;
  isActive: boolean;
}

// 测试会话接口
export interface TestSession {
  id: string;
  testTypeId: string;
  answersData: any[];
  resultData: any;
  userAgent?: string;
  ipAddressHash?: string;
  sessionDuration: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// 测试处理选项接口
export interface TestProcessOptions {
  includeDetails?: boolean;
  cacheResults?: boolean;
  validateAnswers?: boolean;
}

// 测试会话创建数据接口
export interface TestEngineSessionData {
  testTypeId: string;
  answersData: any[];
  resultData: any;
  userAgent?: string;
  ipAddressHash?: string;
  sessionDuration?: number;
}

/**
 * 测试引擎基类
 * 所有具体测试类型的引擎都应该继承此类
 */
export abstract class BaseTestEngine {
  protected testType: string;
  protected dbService: DatabaseService;
  protected cacheService: CacheService;
  protected cacheKeyPrefix: string;

  /**
   * 构造函数
   * @param testType 测试类型
   * @param dbService 数据库服务
   * @param cacheService 缓存服务
   */
  constructor(testType: string, dbService: DatabaseService, cacheService: CacheService) {
    this.testType = testType;
    this.dbService = dbService;
    this.cacheService = cacheService;
    this.cacheKeyPrefix = `test_engine:${this.testType}:`;
  }

  /**
   * 获取测试配置
   * @returns 测试配置
   */
  async getTestConfig(): Promise<TestConfig> {
    // 尝试从缓存获取
    const cacheKey = `${this.cacheKeyPrefix}config`;
    const cachedConfig = await this.cacheService.get<TestConfig>(cacheKey);
    
    if (cachedConfig) {
      return cachedConfig;
    }

    // 从数据库获取
    const config = await this.dbService.testTypes.findById(this.testType);
    
    if (!config) {
      throw new ModuleError(
        `Test type '${this.testType}' not found`,
        ERROR_CODES.TEST_NOT_FOUND,
        404
      );
    }

    // 转换为TestConfig类型
    const testConfig: TestConfig = {
      id: config.id,
      name: config.name || '',
      description: config.description || '',
      category: config.category || '',
      configData: config.configData,
      isActive: config.isActive || false
    };

    // 存入缓存
    const cacheOptions: CacheOptions = { ttl: 3600 }; // 缓存1小时
    await this.cacheService.set(cacheKey, testConfig, cacheOptions);
    
    return testConfig;
  }

  /**
   * 获取测试题目
   * @returns 测试题目数据
   */
  async getQuestions(): Promise<any> {
    const config = await this.getTestConfig();
    
    // 解析配置数据
    const configData = typeof config.configData === 'string'
      ? JSON.parse(config.configData)
      : config.configData;

    return {
      testType: config.id,
      name: config.name,
      description: config.description,
      category: config.category,
      questionCount: configData.questionCount || 0,
      timeLimit: configData.timeLimit || 0,
      instructions: configData.instructions || "",
      questions: await this.generateQuestions(configData),
    };
  }

  /**
   * 处理测试提交
   * @param submission 测试提交数据
   * @param options 处理选项
   * @returns 测试结果
   */
  async processSubmission(
    submission: TestSubmission,
    options: TestProcessOptions = { validateAnswers: true, cacheResults: true }
  ): Promise<TestResult> {
    // 验证测试类型
    if (submission.testType !== this.testType) {
      throw new ModuleError(
        `Invalid test type: ${submission.testType}, expected: ${this.testType}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    // 验证答案（如果启用验证）
    if (options.validateAnswers) {
      await this.validateAnswers(submission.answers);
    }

    // 计算结果
    const result = await this.calculateResult(submission);

    // 创建或更新测试会话
    const sessionId = await this.saveSession(submission, result);

    // 组装返回结果
    const testResult: TestResult = {
      sessionId,
      testType: this.testType,
      scores: result.scores || {},
      interpretation: result.interpretation || "",
      recommendations: result.recommendations || [],
      completedAt: new Date().toISOString(),
      status: 'completed',
    };

    // 缓存结果（如果启用）
    if (options.cacheResults) {
      const cacheKey = `${this.cacheKeyPrefix}result:${sessionId}`;
      const cacheOptions: CacheOptions = { ttl: 86400 }; // 缓存24小时
      await this.cacheService.set(cacheKey, testResult, cacheOptions);
    }

    return testResult;
  }

  /**
   * 获取测试结果
   * @param sessionId 会话ID
   * @returns 测试结果
   */
  async getResult(sessionId: string): Promise<TestResult> {
    // 尝试从缓存获取
    const cacheKey = `${this.cacheKeyPrefix}result:${sessionId}`;
    const cachedResult = await this.cacheService.get<TestResult>(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    // 从数据库获取
    const session = await this.dbService.testSessions.findById(sessionId);
    
    if (!session || session.testTypeId !== this.testType) {
      throw new ModuleError(
        `Test session '${sessionId}' not found or invalid type`,
        ERROR_CODES.TEST_NOT_FOUND,
        404
      );
    }

    // 构建结果
    const resultData = typeof session.resultData === 'string' 
      ? JSON.parse(session.resultData) 
      : (session.resultData || {});

    // 处理日期格式
    let completedAt = new Date().toISOString();
    if (typeof session.createdAt === 'string') {
      completedAt = session.createdAt;
    } else if (session.createdAt && typeof session.createdAt === 'object') {
      try {
        completedAt = (session.createdAt as Date).toISOString();
      } catch (e) {
        completedAt = new Date().toISOString();
      }
    }

    const result: TestResult = {
      sessionId: session.id,
      testType: session.testTypeId,
      scores: resultData.scores || {},
      interpretation: resultData.interpretation || "",
      recommendations: resultData.recommendations || [],
      completedAt: completedAt,
      status: 'completed',
    };

    // 存入缓存
    const cacheOptions: CacheOptions = { ttl: 86400 }; // 缓存24小时
    await this.cacheService.set(cacheKey, result, cacheOptions);
    
    return result;
  }

  /**
   * 创建或更新测试会话
   * @param submission 测试提交数据
   * @param result 计算结果
   * @returns 会话ID
   */
  protected async saveSession(
    submission: TestSubmission,
    result: any
  ): Promise<string> {
    // 创建测试会话数据
    return await this.dbService.testSessions.create({
      testTypeId: this.testType,
      answers: submission.answers,
      result: result,
      userAgent: submission.userInfo?.userAgent ?? "", // 使用空字符串代替null
      ipAddress: "", // 空字符串代替undefined
      sessionDuration: 0, // 可以在前端计算并提交
    });
  }

  /**
   * 生成测试题目（由子类实现）
   * @param configData 配置数据
   */
  protected abstract generateQuestions(configData: any): Promise<any[]>;

  /**
   * 验证答案（由子类实现）
   * @param answers 答案数据
   */
  protected abstract validateAnswers(answers: any[]): Promise<void>;

  /**
   * 计算测试结果（由子类实现）
   * @param submission 测试提交数据
   */
  protected abstract calculateResult(submission: TestSubmission): Promise<any>;
} 