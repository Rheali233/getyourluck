/**
 * 基础数据模型类
 * 遵循统一开发标准的数据访问层规范
 */
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors';
import { generateUUID, formatDate } from '../../../shared/utils';
export class BaseModel {
    db;
    kv;
    tableName;
    constructor(env, tableName) {
        this.db = env.DB;
        this.kv = env.KV;
        this.tableName = tableName;
    }
    /**
     * 执行数据库查询
     */
    async executeQuery(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            const result = params.length > 0
                ? await stmt.bind(...params).all()
                : await stmt.all();
            if (!result.success) {
                throw new ModuleError(`Database query failed: ${result.error}`, ERROR_CODES.DATABASE_ERROR, 500);
            }
            return result.results;
        }
        catch (error) {
            if (error instanceof ModuleError) {
                throw error;
            }
            throw new ModuleError(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 执行单条记录查询
     */
    async executeQueryFirst(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            const result = params.length > 0
                ? await stmt.bind(...params).first()
                : await stmt.first();
            return result;
        }
        catch (error) {
            throw new ModuleError(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 执行插入/更新/删除操作
     */
    async executeRun(query, params = []) {
        try {
            const stmt = this.db.prepare(query);
            const result = params.length > 0
                ? await stmt.bind(...params).run()
                : await stmt.run();
            if (!result.success) {
                throw new ModuleError(`Database operation failed: ${result.error}`, ERROR_CODES.DATABASE_ERROR, 500);
            }
            return result;
        }
        catch (error) {
            if (error instanceof ModuleError) {
                throw error;
            }
            throw new ModuleError(`Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 缓存数据
     */
    async setCache(key, data, ttl = 3600) {
        try {
            await this.kv.put(key, JSON.stringify(data), {
                expirationTtl: ttl,
            });
        }
        catch (error) {
            // 缓存失败不应该影响主要功能
            console.warn('Cache operation failed:', error);
        }
    }
    /**
     * 获取缓存数据
     */
    async getCache(key) {
        try {
            const cached = await this.kv.get(key);
            return cached ? JSON.parse(cached) : null;
        }
        catch (error) {
            console.warn('Cache retrieval failed:', error);
            return null;
        }
    }
    /**
     * 删除缓存
     */
    async deleteCache(key) {
        try {
            await this.kv.delete(key);
        }
        catch (error) {
            console.warn('Cache deletion failed:', error);
        }
    }
    /**
     * 生成新的ID
     */
    generateId() {
        return generateUUID();
    }
    /**
     * 格式化时间戳
     */
    formatTimestamp(date) {
        return formatDate(date || new Date());
    }
    /**
     * 验证必填字段
     */
    validateRequired(data, fields) {
        const missing = fields.filter(field => !data[field]);
        if (missing.length > 0) {
            throw new ModuleError(`Missing required fields: ${missing.join(', ')}`, ERROR_CODES.VALIDATION_ERROR, 400);
        }
    }
}
//# sourceMappingURL=BaseModel.js.map