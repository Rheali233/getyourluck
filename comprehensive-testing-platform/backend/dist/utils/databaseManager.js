/**
 * 数据库管理器
 * 遵循统一开发标准的数据库连接和管理规范
 */
import { MigrationRunner } from './migrationRunner';
import { migrations } from './migrations';
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors';
export class DatabaseManager {
    env;
    migrationRunner;
    constructor(env) {
        this.env = env;
        this.migrationRunner = new MigrationRunner(env);
    }
    /**
     * 初始化数据库
     */
    async initialize() {
        try {
            console.log('Initializing database...');
            // 运行数据库迁移
            await this.migrationRunner.runMigrations(migrations);
            console.log('Database initialized successfully');
        }
        catch (error) {
            console.error('Database initialization failed:', error);
            throw new ModuleError(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 检查数据库健康状态
     */
    async healthCheck() {
        try {
            // 测试数据库连接
            const connectionTest = await this.env.DB.prepare('SELECT 1 as test').first();
            const connectionHealthy = connectionTest !== null;
            // 检查迁移状态
            const migrationStatus = await this.migrationRunner.getMigrationStatus(migrations);
            const migrationsHealthy = migrationStatus.pending.length === 0;
            // 获取表列表
            const tablesResult = await this.env.DB.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
            const tables = tablesResult.success
                ? tablesResult.results.map((row) => row.name)
                : [];
            const isHealthy = connectionHealthy && migrationsHealthy && tables.length > 0;
            return {
                status: isHealthy ? 'healthy' : 'unhealthy',
                details: {
                    connection: connectionHealthy,
                    migrations: migrationsHealthy,
                    tables,
                },
            };
        }
        catch (error) {
            console.error('Database health check failed:', error);
            return {
                status: 'unhealthy',
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
    async getStats() {
        try {
            const tablesResult = await this.env.DB.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'migrations'
        ORDER BY name
      `).all();
            if (!tablesResult.success) {
                throw new Error('Failed to get table list');
            }
            const tables = [];
            let totalRows = 0;
            for (const table of tablesResult.results) {
                try {
                    const countResult = await this.env.DB.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).first();
                    const rowCount = countResult?.count || 0;
                    tables.push({
                        name: table.name,
                        rowCount,
                        size: 'N/A', // SQLite doesn't provide easy table size info
                    });
                    totalRows += rowCount;
                }
                catch (error) {
                    console.warn(`Failed to get stats for table ${table.name}:`, error);
                    tables.push({
                        name: table.name,
                        rowCount: 0,
                        size: 'Error',
                    });
                }
            }
            return {
                tables,
                totalRows,
            };
        }
        catch (error) {
            throw new ModuleError(`Failed to get database stats: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 执行数据库清理
     */
    async cleanup(options = {}) {
        try {
            const { expiredSessions = 90, expiredFeedback = 365, expiredEvents = 90, } = options;
            let sessionsDeleted = 0;
            let feedbackDeleted = 0;
            let eventsDeleted = 0;
            // 清理过期的测试会话
            if (expiredSessions > 0) {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - expiredSessions);
                const cutoffTimestamp = cutoffDate.toISOString();
                const sessionResult = await this.env.DB
                    .prepare('DELETE FROM test_sessions WHERE created_at < ?')
                    .bind(cutoffTimestamp)
                    .run();
                sessionsDeleted = sessionResult.changes || 0;
            }
            // 清理过期的用户反馈
            if (expiredFeedback > 0) {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - expiredFeedback);
                const cutoffTimestamp = cutoffDate.toISOString();
                const feedbackResult = await this.env.DB
                    .prepare('DELETE FROM user_feedback WHERE created_at < ?')
                    .bind(cutoffTimestamp)
                    .run();
                feedbackDeleted = feedbackResult.changes || 0;
            }
            // 清理过期的分析事件
            if (expiredEvents > 0) {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - expiredEvents);
                const cutoffTimestamp = cutoffDate.toISOString();
                const eventsResult = await this.env.DB
                    .prepare('DELETE FROM analytics_events WHERE timestamp < ?')
                    .bind(cutoffTimestamp)
                    .run();
                eventsDeleted = eventsResult.changes || 0;
            }
            console.log(`Database cleanup completed: ${sessionsDeleted} sessions, ${feedbackDeleted} feedback, ${eventsDeleted} events deleted`);
            return {
                sessionsDeleted,
                feedbackDeleted,
                eventsDeleted,
            };
        }
        catch (error) {
            throw new ModuleError(`Database cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 备份数据库（导出为SQL）
     */
    async backup() {
        try {
            // 注意：Cloudflare D1 不支持直接导出，这里提供一个概念性实现
            // 实际使用时需要通过 wrangler d1 命令行工具进行备份
            const tables = ['test_types', 'test_sessions', 'user_feedback', 'blog_articles', 'analytics_events', 'sys_configs'];
            const backupSQL = [];
            for (const table of tables) {
                try {
                    const result = await this.env.DB.prepare(`SELECT * FROM ${table}`).all();
                    if (result.success && result.results.length > 0) {
                        backupSQL.push(`-- Backup for table: ${table}`);
                        // 这里应该生成INSERT语句，但由于复杂性，暂时只记录表名
                        backupSQL.push(`-- ${result.results.length} rows in ${table}`);
                    }
                }
                catch (error) {
                    console.warn(`Failed to backup table ${table}:`, error);
                }
            }
            return backupSQL.join('\n');
        }
        catch (error) {
            throw new ModuleError(`Database backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
}
//# sourceMappingURL=databaseManager.js.map