/**
 * 数据库管理器
 * 遵循统一开发标准的数据库连接和管理规范
 */
import type { Env } from '../index';
export declare class DatabaseManager {
    private env;
    private migrationRunner;
    constructor(env: Env);
    /**
     * 初始化数据库
     */
    initialize(): Promise<void>;
    /**
     * 检查数据库健康状态
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'unhealthy';
        details: {
            connection: boolean;
            migrations: boolean;
            tables: string[];
        };
    }>;
    /**
     * 获取数据库统计信息
     */
    getStats(): Promise<{
        tables: Array<{
            name: string;
            rowCount: number;
            size: string;
        }>;
        totalRows: number;
    }>;
    /**
     * 执行数据库清理
     */
    cleanup(options?: {
        expiredSessions?: number;
        expiredFeedback?: number;
        expiredEvents?: number;
    }): Promise<{
        sessionsDeleted: number;
        feedbackDeleted: number;
        eventsDeleted: number;
    }>;
    /**
     * 备份数据库（导出为SQL）
     */
    backup(): Promise<string>;
}
//# sourceMappingURL=databaseManager.d.ts.map