/**
 * 统一数据库服务
 * 遵循统一开发标准的数据访问层规范
 */
import { DatabaseManager } from "../utils/databaseManager";
import { MigrationRunner } from "../utils/migrationRunner";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
import { TestTypeModel, TestSessionModel, BlogArticleModel, UserFeedbackModel, AnalyticsEventModel, PsychologySessionModel, AstrologySessionModel, TarotSessionModel, CareerSessionModel, LearningSessionModel, RelationshipSessionModel, NumerologySessionModel, } from "../models";
export class DatabaseService {
    env;
    dbManager;
    migrationRunner;
    // 模型实例
    testTypes;
    testSessions;
    blogArticles;
    userFeedback;
    analyticsEvents;
    psychologySessions;
    astrologySessions;
    tarotSessions;
    careerSessions;
    learningSessions;
    relationshipSessions;
    numerologySessions;
    constructor(env) {
        this.env = env;
        this.dbManager = new DatabaseManager(env);
        this.migrationRunner = new MigrationRunner(env);
        // 初始化所有模型实例
        this.testTypes = new TestTypeModel(env);
        this.testSessions = new TestSessionModel(env);
        this.blogArticles = new BlogArticleModel(env);
        this.userFeedback = new UserFeedbackModel(env);
        this.analyticsEvents = new AnalyticsEventModel(env);
        this.psychologySessions = new PsychologySessionModel(env);
        this.astrologySessions = new AstrologySessionModel(env);
        this.tarotSessions = new TarotSessionModel(env);
        this.careerSessions = new CareerSessionModel(env);
        this.learningSessions = new LearningSessionModel(env);
        this.relationshipSessions = new RelationshipSessionModel(env);
        this.numerologySessions = new NumerologySessionModel(env);
    }
    /**
     * 初始化数据库
     * 运行所有待执行的迁移
     */
    async initialize() {
        try {
            await this.migrationRunner.runMigrations();
            console.log("Database initialized successfully");
        }
        catch (error) {
            console.error("Database initialization failed:", error);
            throw new ModuleError("Failed to initialize database", ERROR_CODES.DATABASE_ERROR, 500, error);
        }
    }
    /**
     * 检查数据库健康状态
     */
    async healthCheck() {
        try {
            // 检查数据库连接
            const connectionTest = await this.env.DB.prepare("SELECT 1").first();
            const connectionHealthy = connectionTest !== null;
            // 检查迁移状态
            const migrationStatus = await this.migrationRunner.getMigrationStatus();
            const migrationsHealthy = migrationStatus.pendingMigrations.length === 0;
            // 检查核心表是否存在
            const tables = await this.dbManager.listTables();
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
        }
        catch (error) {
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
    async getStatistics() {
        try {
            const [testSessionsCount, blogArticlesCount, feedbackCount, analyticsEventsCount, psychologyCount, astrologyCount, tarotCount, careerCount, learningCount, relationshipCount, numerologyCount, recentTests, recentFeedback, recentArticles,] = await Promise.all([
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
        }
        catch (error) {
            console.error("Failed to get database statistics:", error);
            throw new ModuleError("Failed to retrieve database statistics", ERROR_CODES.DATABASE_ERROR, 500, error);
        }
    }
    /**
     * 清理过期数据
     */
    async cleanupExpiredData(retentionDays = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
            const cutoffISO = cutoffDate.toISOString();
            // 删除过期的测试会话（级联删除相关的模块会话）
            const deletedSessions = await this.env.DB
                .prepare("DELETE FROM test_sessions WHERE created_at < ?")
                .bind(cutoffISO)
                .run();
            // 删除过期的分析事件
            const deletedEvents = await this.env.DB
                .prepare("DELETE FROM analytics_events WHERE timestamp < ?")
                .bind(cutoffISO)
                .run();
            // 删除过期的反馈（保留时间较短）
            const feedbackCutoff = new Date();
            feedbackCutoff.setDate(feedbackCutoff.getDate() - 30); // 30天
            const deletedFeedback = await this.env.DB
                .prepare("DELETE FROM user_feedback WHERE created_at < ?")
                .bind(feedbackCutoff.toISOString())
                .run();
            return {
                deletedSessions: deletedSessions.changes || 0,
                deletedEvents: deletedEvents.changes || 0,
                deletedFeedback: deletedFeedback.changes || 0,
            };
        }
        catch (error) {
            console.error("Failed to cleanup expired data:", error);
            throw new ModuleError("Failed to cleanup expired data", ERROR_CODES.DATABASE_ERROR, 500, error);
        }
    }
    /**
     * 备份数据库
     */
    async createBackup() {
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
        }
        catch (error) {
            console.error("Failed to create backup:", error);
            throw new ModuleError("Failed to create database backup", ERROR_CODES.DATABASE_ERROR, 500, error);
        }
    }
    // 私有辅助方法
    async getRecentTestsCount(hours) {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - hours);
        const result = await this.env.DB
            .prepare("SELECT COUNT(*) as count FROM test_sessions WHERE created_at > ?")
            .bind(cutoffDate.toISOString())
            .first();
        return result?.count || 0;
    }
    async getRecentFeedbackCount(hours) {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - hours);
        const result = await this.env.DB
            .prepare("SELECT COUNT(*) as count FROM user_feedback WHERE created_at > ?")
            .bind(cutoffDate.toISOString())
            .first();
        return result?.count || 0;
    }
    async getRecentArticlesCount(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const result = await this.env.DB
            .prepare("SELECT COUNT(*) as count FROM blog_articles WHERE created_at > ?")
            .bind(cutoffDate.toISOString())
            .first();
        return result?.count || 0;
    }
}
//# sourceMappingURL=DatabaseService.js.map