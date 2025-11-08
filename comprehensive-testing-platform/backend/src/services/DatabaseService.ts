/**
 * 统一数据库服务
 * 遵循统一开发标准的数据访问层规范
 */

import type { Env } from "../types/env";
import { MigrationRunner } from "../utils/migrationRunner";
import { getAllMigrations } from "../utils/migrations";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
import {
  TestTypeModel,
  TestSessionModel,
  BlogArticleModel,
  UserFeedbackModel,
  AnalyticsEventModel,
  PsychologySessionModel,
  AstrologySessionModel,
  TarotSessionModel,
  CareerSessionModel,
  LearningSessionModel,
  RelationshipSessionModel,
  NumerologySessionModel,
  QuestionBankModel,
} from "../models";

export class DatabaseService {
  private migrationRunner: MigrationRunner;
  
  // 暴露数据库连接供路由使用
  public get db(): D1Database {
    if (!this.env.DB) {
      throw new Error('Database connection not available');
    }
    return this.env.DB;
  }

  // 模型实例 - 延迟初始化
  private _testTypes?: TestTypeModel;
  private _testSessions?: TestSessionModel;
  private _blogArticles?: BlogArticleModel;
  private _userFeedback?: UserFeedbackModel;
  private _analyticsEvents?: AnalyticsEventModel;
  private _psychologySessions?: PsychologySessionModel;
  private _astrologySessions?: AstrologySessionModel;
  private _tarotSessions?: TarotSessionModel;
  private _careerSessions?: CareerSessionModel;
  private _learningSessions?: LearningSessionModel;
  private _relationshipSessions?: RelationshipSessionModel;
  private _numerologySessions?: NumerologySessionModel;
  private _questionBank?: QuestionBankModel;

  constructor(private env: Env) {
    this.migrationRunner = new MigrationRunner(env);
  }

  // 延迟初始化的getter方法
  get testTypes(): TestTypeModel {
    if (!this._testTypes) {
      this._testTypes = new TestTypeModel(this.env);
    }
    return this._testTypes;
  }

  get testSessions(): TestSessionModel {
    if (!this._testSessions) {
      this._testSessions = new TestSessionModel(this.env);
    }
    return this._testSessions;
  }

  get blogArticles(): BlogArticleModel {
    if (!this._blogArticles) {
      this._blogArticles = new BlogArticleModel(this.env);
    }
    return this._blogArticles;
  }

  get userFeedback(): UserFeedbackModel {
    if (!this._userFeedback) {
      this._userFeedback = new UserFeedbackModel(this.env);
    }
    return this._userFeedback;
  }

  get analyticsEvents(): AnalyticsEventModel {
    if (!this._analyticsEvents) {
      this._analyticsEvents = new AnalyticsEventModel(this.env);
    }
    return this._analyticsEvents;
  }

  get psychologySessions(): PsychologySessionModel {
    if (!this._psychologySessions) {
      this._psychologySessions = new PsychologySessionModel(this.env);
    }
    return this._psychologySessions;
  }

  get astrologySessions(): AstrologySessionModel {
    if (!this._astrologySessions) {
      this._astrologySessions = new AstrologySessionModel(this.env);
    }
    return this._astrologySessions;
  }

  get tarotSessions(): TarotSessionModel {
    if (!this._tarotSessions) {
      this._tarotSessions = new TarotSessionModel(this.env);
    }
    return this._tarotSessions;
  }

  get careerSessions(): CareerSessionModel {
    if (!this._careerSessions) {
      this._careerSessions = new CareerSessionModel(this.env);
    }
    return this._careerSessions;
  }

  get learningSessions(): LearningSessionModel {
    if (!this._learningSessions) {
      this._learningSessions = new LearningSessionModel(this.env);
    }
    return this._learningSessions;
  }

  get relationshipSessions(): RelationshipSessionModel {
    if (!this._relationshipSessions) {
      this._relationshipSessions = new RelationshipSessionModel(this.env);
    }
    return this._relationshipSessions;
  }

  get numerologySessions(): NumerologySessionModel {
    if (!this._numerologySessions) {
      this._numerologySessions = new NumerologySessionModel(this.env);
    }
    return this._numerologySessions;
  }

  get questionBank(): QuestionBankModel {
    if (!this._questionBank) {
      this._questionBank = new QuestionBankModel(this.env);
    }
    return this._questionBank;
  }

  /**
   * 初始化数据库
   * 运行所有待执行的迁移
   */
  async initialize(): Promise<void> {
    try {
      // 获取所有迁移并运行
      const migrations = getAllMigrations();
      await this.migrationRunner.runMigrations(migrations);
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization failed:", error);
      throw new ModuleError(
        "Failed to initialize database",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * 检查数据库健康状态
   */
  async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    details: {
      connection: boolean;
      migrations: boolean;
      tables: string[];
    };
  }> {
    try {
      const connectionTest = await this.db.prepare("SELECT 1").first();
      const connectionHealthy = connectionTest !== null;

      const migrationsHealthy = true;

      const tablesResult = await this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
      const tables = (tablesResult.results || []).map((row: any) => row.name);

      const requiredTables = [
        "test_types",
        "test_sessions",
        "blog_articles",
        "user_feedback",
        "analytics_events",
        "sys_configs",
      ];
      const tablesHealthy = requiredTables.every(table => tables.includes(table));

      const isHealthy = connectionHealthy && migrationsHealthy && tablesHealthy;

      return {
        status: isHealthy ? "healthy" : "unhealthy",
        details: {
          connection: connectionHealthy,
          migrations: migrationsHealthy,
          tables,
        },
      };
    } catch (error) {
      console.error("Database health check failed:", error);
      return {
        status: "unhealthy",
        details: {
          connection: false,
          migrations: false,
          tables: [],
        },
      };
    }
  }

  /**
   * 获取数据库统计信息
   */
  async getStatistics(): Promise<{
    totalTestSessions: number;
    totalBlogArticles: number;
    totalFeedback: number;
    totalAnalyticsEvents: number;
    moduleSessionCounts: Record<string, number>;
    recentActivity: {
      testsLast24h: number;
      feedbackLast24h: number;
      articlesLast7d: number;
    };
  }> {
    try {
      const [
        testSessionsCount,
        blogArticlesCount,
        feedbackCount,
        analyticsEventsCount,
        psychologyCount,
        astrologyCount,
        tarotCount,
        careerCount,
        learningCount,
        relationshipCount,
        numerologyCount,
        recentTests,
        recentFeedback,
        recentArticles,
      ] = await Promise.all([
        this.testSessions.count(),
        this.blogArticles.count(),
        this.userFeedback.count(),
        this.analyticsEvents.count(),
        this.psychologySessions.count(),
        this.astrologySessions.count(),
        this.tarotSessions.count(),
        this.careerSessions.count(),
        this.learningSessions.count(),
        this.relationshipSessions.count(),
        this.numerologySessions.count(),
        this.getRecentTestsCount(24), // 24小时内
        this.getRecentFeedbackCount(24), // 24小时内
        this.getRecentArticlesCount(7), // 7天内
      ]);

      return {
        totalTestSessions: testSessionsCount,
        totalBlogArticles: blogArticlesCount,
        totalFeedback: feedbackCount,
        totalAnalyticsEvents: analyticsEventsCount,
        moduleSessionCounts: {
          psychology: psychologyCount,
          astrology: astrologyCount,
          tarot: tarotCount,
          career: careerCount,
          learning: learningCount,
          relationship: relationshipCount,
          numerology: numerologyCount,
        },
        recentActivity: {
          testsLast24h: recentTests,
          feedbackLast24h: recentFeedback,
          articlesLast7d: recentArticles,
        },
      };
    } catch (error) {
      console.error("Failed to get database statistics:", error);
      throw new ModuleError(
        "Failed to retrieve database statistics",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * 清理过期数据
   */
  async cleanupExpiredData(retentionDays: number = 90): Promise<{
    deletedSessions: number;
    deletedEvents: number;
    deletedFeedback: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffISO = cutoffDate.toISOString();

      const deletedSessions = await this.db
        .prepare("DELETE FROM test_sessions WHERE created_at < ?")
        .bind(cutoffISO)
        .run();

      const deletedEvents = await this.db
        .prepare("DELETE FROM analytics_events WHERE timestamp < ?")
        .bind(cutoffISO)
        .run();

      const feedbackCutoff = new Date();
      feedbackCutoff.setDate(feedbackCutoff.getDate() - 30);
      const deletedFeedback = await this.db
        .prepare("DELETE FROM user_feedback WHERE created_at < ?")
        .bind(feedbackCutoff.toISOString())
        .run();

      return {
        deletedSessions: (deletedSessions as any).changes || 0,
        deletedEvents: (deletedEvents as any).changes || 0,
        deletedFeedback: (deletedFeedback as any).changes || 0,
      };
    } catch (error) {
      console.error("Failed to cleanup expired data:", error);
      throw new ModuleError(
        "Failed to cleanup expired data",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  /**
   * 备份数据库
   */
  async createBackup(): Promise<{
    backupId: string;
    timestamp: string;
    size: number;
  }> {
    try {
      const backupId = `backup_${Date.now()}`;
      const timestamp = new Date().toISOString();

      // 这里应该实现实际的备份逻辑
      // 在Cloudflare环境中，可能需要使用R2存储
      console.log(`Creating backup: ${backupId} at ${timestamp}`);

      return {
        backupId,
        timestamp,
        size: 0, // 实际实现时应该返回备份文件大小
      };
    } catch (error) {
      console.error("Failed to create backup:", error);
      throw new ModuleError(
        "Failed to create database backup",
        ERROR_CODES.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  // 私有辅助方法
  private async getRecentTestsCount(hours: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    const result = await this.db
      .prepare("SELECT COUNT(*) as count FROM test_sessions WHERE created_at > ?")
      .bind(cutoffDate.toISOString())
      .first();
    return (result?.['count'] as number) || 0;
  }

  private async getRecentFeedbackCount(hours: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    const result = await this.db
      .prepare("SELECT COUNT(*) as count FROM user_feedback WHERE created_at > ?")
      .bind(cutoffDate.toISOString())
      .first();
    return (result?.['count'] as number) || 0;
  }

  private async getRecentArticlesCount(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const result = await this.db
      .prepare("SELECT COUNT(*) as count FROM blog_articles WHERE created_at > ?")
      .bind(cutoffDate.toISOString())
      .first();
    return (result?.['count'] as number) || 0;
  }

  // 提供最小化count实现，供统计使用 - 未使用，暂时注释
  // private async countTable(_tableName: string): Promise<number> {
  //   const result = await this.db
  //     .prepare(`SELECT COUNT(*) as count FROM ${_tableName}`)
  //     .first();
  //   return (result?.['count'] as number) || 0;
  // }
}