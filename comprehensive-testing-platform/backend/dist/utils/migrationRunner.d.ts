/**
 * 数据库迁移运行器
 * 遵循统一开发标准的数据库迁移规范
 */
import type { Env } from '../index';
export interface Migration {
    id: string;
    name: string;
    sql: string;
    appliedAt?: string;
}
export declare class MigrationRunner {
    private db;
    constructor(env: Env);
    /**
     * 初始化迁移表
     */
    private initMigrationTable;
    /**
     * 获取已应用的迁移
     */
    private getAppliedMigrations;
    /**
     * 应用单个迁移
     */
    private applyMigration;
    /**
     * 运行所有待应用的迁移
     */
    runMigrations(migrations: Migration[]): Promise<void>;
    /**
     * 获取迁移状态
     */
    getMigrationStatus(migrations: Migration[]): Promise<{
        applied: Migration[];
        pending: Migration[];
    }>;
}
//# sourceMappingURL=migrationRunner.d.ts.map