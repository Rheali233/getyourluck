/**
 * 基础数据模型类
 * 遵循统一开发标准的数据访问层规范
 */
import type { Env } from '../index';
export declare abstract class BaseModel {
    protected db: D1Database;
    protected kv: KVNamespace;
    protected tableName: string;
    constructor(env: Env, tableName: string);
    /**
     * 执行数据库查询
     */
    protected executeQuery<T = any>(query: string, params?: any[]): Promise<T[]>;
    /**
     * 执行单条记录查询
     */
    protected executeQueryFirst<T = any>(query: string, params?: any[]): Promise<T | null>;
    /**
     * 执行插入/更新/删除操作
     */
    protected executeRun(query: string, params?: any[]): Promise<D1Result>;
    /**
     * 缓存数据
     */
    protected setCache(key: string, data: any, ttl?: number): Promise<void>;
    /**
     * 获取缓存数据
     */
    protected getCache<T = any>(key: string): Promise<T | null>;
    /**
     * 删除缓存
     */
    protected deleteCache(key: string): Promise<void>;
    /**
     * 生成新的ID
     */
    protected generateId(): string;
    /**
     * 格式化时间戳
     */
    protected formatTimestamp(date?: Date): string;
    /**
     * 验证必填字段
     */
    protected validateRequired(data: Record<string, any>, fields: string[]): void;
}
//# sourceMappingURL=BaseModel.d.ts.map