/**
 * 测试会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants';
async function hashString(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export class TestSessionModel extends BaseModel {
    constructor(env) {
        super(env, DB_TABLES.TEST_SESSIONS);
    }
    /**
     * 创建测试会话
     */
    async create(sessionData) {
        this.validateRequired(sessionData, ['testTypeId', 'answers', 'result']);
        const id = this.generateId();
        const now = this.formatTimestamp();
        // 哈希IP地址以保护隐私
        const ipAddressHash = sessionData.ipAddress
            ? await hashString(sessionData.ipAddress)
            : null;
        const query = `
      INSERT INTO ${this.tableName} (
        id, test_type_id, answers_data, result_data,
        user_agent, ip_address_hash, session_duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            id,
            sessionData.testTypeId,
            JSON.stringify(sessionData.answers),
            JSON.stringify(sessionData.result),
            sessionData.userAgent || null,
            ipAddressHash,
            sessionData.sessionDuration || null,
            now,
        ];
        await this.executeRun(query, params);
        // 缓存测试结果
        const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
        await this.setCache(cacheKey, {
            id,
            testTypeId: sessionData.testTypeId,
            result: sessionData.result,
            createdAt: now,
        }, 86400); // 24小时缓存
        return id;
    }
    /**
     * 根据ID获取测试会话
     */
    async findById(id) {
        // 先尝试从缓存获取
        const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const result = await this.executeQueryFirst(query, [id]);
        if (result) {
            // 缓存结果
            await this.setCache(cacheKey, result, 3600); // 1小时缓存
        }
        return result;
    }
    /**
     * 根据测试类型获取统计数据
     */
    async getStatsByTestType(testTypeId) {
        const cacheKey = `test_stats:${testTypeId}`;
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `
      SELECT 
        COUNT(*) as total_sessions,
        AVG(CAST(json_extract(result_data, '$.overallScore') AS REAL)) as avg_score,
        COUNT(CASE WHEN json_extract(result_data, '$.completed') = 'true' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
      FROM ${this.tableName} 
      WHERE test_type_id = ?
    `;
        const result = await this.executeQueryFirst(query, [testTypeId]);
        const stats = {
            totalSessions: result?.total_sessions || 0,
            averageScore: result?.avg_score || 0,
            completionRate: result?.completion_rate || 0,
        };
        // 缓存统计数据
        await this.setCache(cacheKey, stats, 1800); // 30分钟缓存
        return stats;
    }
    /**
     * 获取最近的测试会话
     */
    async getRecentSessions(limit = 10) {
        const query = `
      SELECT * FROM ${this.tableName} 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
        return this.executeQuery(query, [limit]);
    }
    /**
     * 根据时间范围获取会话数量
     */
    async getSessionCountByDateRange(startDate, endDate, testTypeId) {
        let query = `
      SELECT COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE created_at BETWEEN ? AND ?
    `;
        const params = [startDate, endDate];
        if (testTypeId) {
            query += ' AND test_type_id = ?';
            params.push(testTypeId);
        }
        const result = await this.executeQueryFirst(query, params);
        return result?.count || 0;
    }
    /**
     * 删除过期的测试会话（数据清理）
     */
    async deleteExpiredSessions(daysOld = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const cutoffTimestamp = this.formatTimestamp(cutoffDate);
        const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`;
        const result = await this.executeRun(query, [cutoffTimestamp]);
        return result.changes || 0;
    }
    /**
     * 更新会话持续时间
     */
    async updateSessionDuration(id, duration) {
        const query = `
      UPDATE ${this.tableName} 
      SET session_duration = ? 
      WHERE id = ?
    `;
        await this.executeRun(query, [duration, id]);
        // 清除相关缓存
        const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
        await this.deleteCache(cacheKey);
    }
}
//# sourceMappingURL=TestSessionModel.js.map