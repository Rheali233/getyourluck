/**
 * 测试引擎模块索引
 * 遵循统一开发标准的模块导出规范
 */

import { BaseTestEngine, TestConfig, TestSession, TestProcessOptions } from './BaseTestEngine';
import { DatabaseService } from '../DatabaseService';
import { CacheService } from '../CacheService';
import { ModuleError, ERROR_CODES } from '../../../../shared/types/errors';

// 测试类型枚举
export enum TestTypes {
  MBTI = 'mbti',
  TAROT = 'tarot',
  ASTROLOGY = 'astrology',
  PSYCHOLOGY = 'psychology',
  CAREER = 'career',
  LEARNING = 'learning',
  RELATIONSHIP = 'relationship',
  NUMEROLOGY = 'numerology',
}

/**
 * 统一测试引擎服务类
 * 提供对所有测试类型的统一访问接口
 */
export class TestEngineService {
  private dbService: DatabaseService;
  private cacheService: CacheService;

  /**
   * 构造函数
   * @param dbService 数据库服务
   * @param cacheService 缓存服务
   */
  constructor(dbService: DatabaseService, cacheService: CacheService) {
    this.dbService = dbService;
    this.cacheService = cacheService;
  }

  async getTestTypes(activeOnly: boolean = true): Promise<any[]> {
    try {
      const testTypes = await this.dbService.testTypes.getAllActive();
      
      const filteredTypes = activeOnly 
        ? testTypes.filter((type: any) => type.is_active === 1) 
        : testTypes;
      
      return filteredTypes.map((type: any) => ({
        id: type.id,
        name: type.name || '',
        description: type.description || '',
        category: type.category || '',
        configData: type.configData,
        isActive: type.is_active === 1
      }));
    } catch (error) {
      throw new ModuleError(
        "Failed to retrieve test types",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  async getTestConfig(testType: string): Promise<any> {
    try {
      const config = await this.dbService.testTypes.findById(testType);
      if (!config) {
        throw new ModuleError(
          `Test type '${testType}' not found`,
          ERROR_CODES.TEST_NOT_FOUND,
          404
        );
      }
      return {
        id: config.id,
        name: config.name || '',
        description: config.description || '',
        category: config.category || '',
        configData: config.configData,
        isActive: config.isActive
      };
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
  }

  /**
   * 获取测试会话
   * @param sessionId 会话ID
   * @returns 测试会话
   */
  async getTestSession(sessionId: string): Promise<any> {
    try {
      const session = await this.dbService.testSessions.findById(sessionId);
      if (!session) {
        throw new ModuleError(
          `Test session not found: ${sessionId}`,
          ERROR_CODES.NOT_FOUND,
          404
        );
      }
      
      // 修复字段名映射问题：D1返回下划线格式，需要映射到驼峰格式
      return {
        id: session.id,
        testTypeId: session.testTypeId || (session as any).test_type_id,
        answersData: session.answersData || (session as any).answers_data,
        resultData: session.resultData || (session as any).result_data,
        userAgent: session.userAgent || (session as any).user_agent,
        ipAddressHash: session.ipAddressHash || (session as any).ip_address_hash,
        sessionDuration: session.sessionDuration || (session as any).session_duration,
        createdAt: session.createdAt || (session as any).created_at
      };
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve test session: ${sessionId}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  /**
   * 获取测试结果
   * @param sessionId 会话ID
   * @returns 测试结果
   */
  async getTestResult(sessionId: string): Promise<any> {
    try {
      // 从缓存获取
      const cacheKey = `test_result:${sessionId}`;
      const cachedResult = await this.cacheService.get(cacheKey);
      
      if (cachedResult) {
        return cachedResult;
      }

      // 从数据库获取
      const session = await this.dbService.testSessions.findById(sessionId);
      
      if (!session) {
        throw new ModuleError(
          `Test session '${sessionId}' not found`,
          ERROR_CODES.TEST_NOT_FOUND,
          404
        );
      }

      // 解析结果数据
      const resultData = typeof session.resultData === 'string'
        ? JSON.parse(session.resultData)
        : (session.resultData || {});
      
      // 格式化结果 - 从resultData中提取所有必要信息
      const result = {
        sessionId: session.id,
        testType: session.testTypeId || (session as any).test_type_id,
        scores: resultData.totalScore ? { totalScore: resultData.totalScore } : {},
        interpretation: resultData.interpretation || "",
        recommendations: resultData.recommendations || [],
        completedAt: typeof session.createdAt === 'string'
          ? session.createdAt
          : new Date().toISOString(),
        // 添加更多字段以提供完整的结果
        severity: resultData.severity,
        individualScores: resultData.individualScores,
        metadata: resultData.metadata,
        aiAnalysis: resultData.aiAnalysis
      };

      // 存入缓存
      await this.cacheService.set(cacheKey, result, { ttl: 86400 }); // 缓存24小时
      
      return result;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve result for session: ${sessionId}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  /**
   * 获取测试会话统计信息
   * @param testType 测试类型
   * @returns 统计信息
   */
  async getTestStats(testType: string): Promise<any> {
    try {
      const cacheKey = `test_stats:${testType}`;
      const cachedStats = await this.cacheService.get(cacheKey);
      
      if (cachedStats) {
        return cachedStats;
      }

      const stats = await this.dbService.testSessions.getStatsByTestType(testType);
      
      // 存入缓存
      await this.cacheService.set(cacheKey, stats, { ttl: 1800 }); // 30分钟缓存
      
      return stats;
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve test stats for: ${testType}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  /**
   * 保存测试会话
   * @param sessionData 会话数据
   * @returns 会话ID
   */
  async saveTestSession(sessionData: {
    testTypeId: string;
    answersData: any[];
    resultData: any;
    userAgent?: string | null;
    ipAddressHash?: string;
    sessionDuration?: number;
  }): Promise<string> {
    try {
      const sessionDataToCreate: any = {
        testTypeId: sessionData.testTypeId,
        answers: sessionData.answersData,
        result: sessionData.resultData,
        sessionDuration: sessionData.sessionDuration || 0
      };

      if (sessionData.userAgent) {
        sessionDataToCreate.userAgent = sessionData.userAgent;
      }
      if (sessionData.ipAddressHash) {
        sessionDataToCreate.ipAddress = sessionData.ipAddressHash;
      }

      return await this.dbService.testSessions.create(sessionDataToCreate);
    } catch (error) {
      throw new ModuleError(
        "Failed to save test session",
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }
}

// 导出测试引擎接口和基类
export { BaseTestEngine };
export type { TestConfig, TestSession, TestProcessOptions }; 