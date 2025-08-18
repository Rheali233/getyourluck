/**
 * 统一数据库服务
 * 遵循统一开发标准的数据访问层规范
 */
import type { Env } from "../index";
import { TestTypeModel, TestSessionModel, BlogArticleModel, UserFeedbackModel, AnalyticsEventModel, PsychologySessionModel, AstrologySessionModel, TarotSessionModel, CareerSessionModel, LearningSessionModel, RelationshipSessionModel, NumerologySessionModel } from "../models";
export declare class DatabaseService {
    private env;
    private dbManager;
    private migrationRunner;
    get db(): D1Database;
    testTypes: TestTypeModel;
    testSessions: TestSessionModel;
    blogArticles: BlogArticleModel;
    userFeedback: UserFeedbackModel;
    analyticsEvents: AnalyticsEventModel;
    psychologySessions: PsychologySessionModel;
    astrologySessions: AstrologySessionModel;
    tarotSessions: TarotSessionModel;
    careerSessions: CareerSessionModel;
    learningSessions: LearningSessionModel;
    relationshipSessions: RelationshipSessionModel;
    numerologySessions: NumerologySessionModel;
    constructor(env: Env);
    /**
     * 初始化数据库
     * 运行所有待执行的迁移
     */
    initialize(): Promise<void>;
    /**
     * 检查数据库健康状态
     */
    healthCheck(): Promise<{
        status: "healthy" | "unhealthy";
        details: {
            connection: boolean;
            migrations: boolean;
            tables: string[];
        };
    }>;
    /**
     * 获取数据库统计信息
     */
    getStatistics(): Promise<{
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
    }>;
    /**
     * 清理过期数据
     */
    cleanupExpiredData(retentionDays?: number): Promise<{
        deletedSessions: number;
        deletedEvents: number;
        deletedFeedback: number;
    }>;
    /**
     * 备份数据库
     */
    createBackup(): Promise<{
        backupId: string;
        timestamp: string;
        size: number;
    }>;
    private getRecentTestsCount;
    private getRecentFeedbackCount;
    private getRecentArticlesCount;
}
//# sourceMappingURL=DatabaseService.d.ts.map