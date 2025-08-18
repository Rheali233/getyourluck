/**
 * 用户反馈数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import { DB_TABLES } from '../../../shared/constants';
export class UserFeedbackModel extends BaseModel {
    constructor(env) {
        super(env, DB_TABLES.USER_FEEDBACK);
    }
    /**
     * 创建用户反馈
     */
    async create(feedbackData) {
        this.validateRequired(feedbackData, ['feedbackType']);
        const id = this.generateId();
        const now = this.formatTimestamp();
        const query = `
      INSERT INTO ${this.tableName} (
        id, session_id, feedback_type, content, rating, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [
            id,
            feedbackData.sessionId || null,
            feedbackData.feedbackType,
            feedbackData.content || null,
            feedbackData.rating || null,
            now,
        ];
        await this.executeRun(query, params);
        // 清除统计缓存
        await this.deleteCache('feedback_stats');
        return id;
    }
    /**
     * 获取反馈统计
     */
    async getStats() {
        const cacheKey = 'feedback_stats';
        const cached = await this.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        const query = `
      SELECT 
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN feedback_type = 'like' THEN 1 END) as positive_count,
        COUNT(CASE WHEN feedback_type = 'dislike' THEN 1 END) as negative_count,
        AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
        COUNT(CASE WHEN feedback_type = 'comment' THEN 1 END) as comment_count
      FROM ${this.tableName}
    `;
        const result = await this.executeQueryFirst(query);
        const stats = {
            totalFeedback: result?.total_feedback || 0,
            positiveCount: result?.positive_count || 0,
            negativeCount: result?.negative_count || 0,
            averageRating: result?.average_rating || 0,
            commentCount: result?.comment_count || 0,
        };
        // 缓存统计数据
        await this.setCache(cacheKey, stats, 1800); // 30分钟缓存
        return stats;
    }
    /**
     * 根据会话ID获取反馈
     */
    async findBySessionId(sessionId) {
        const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY created_at DESC
    `;
        return this.executeQuery(query, [sessionId]);
    }
    /**
     * 获取最近的反馈
     */
    async getRecentFeedback(limit = 20) {
        const query = `
      SELECT * FROM ${this.tableName} 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
        return this.executeQuery(query, [limit]);
    }
    /**
     * 获取评论反馈
     */
    async getComments(limit = 50) {
        const query = `
      SELECT * FROM ${this.tableName} 
      WHERE feedback_type = 'comment' AND content IS NOT NULL
      ORDER BY created_at DESC 
      LIMIT ?
    `;
        return this.executeQuery(query, [limit]);
    }
    /**
     * 根据时间范围获取反馈统计
     */
    async getStatsByDateRange(startDate, endDate) {
        const query = `
      SELECT 
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN feedback_type = 'like' THEN 1 END) as positive_count,
        COUNT(CASE WHEN feedback_type = 'dislike' THEN 1 END) as negative_count,
        AVG(CASE WHEN rating IS NOT NULL THEN rating END) as average_rating,
        COUNT(CASE WHEN feedback_type = 'comment' THEN 1 END) as comment_count
      FROM ${this.tableName}
      WHERE created_at BETWEEN ? AND ?
    `;
        const result = await this.executeQueryFirst(query, [startDate, endDate]);
        return {
            totalFeedback: result?.total_feedback || 0,
            positiveCount: result?.positive_count || 0,
            negativeCount: result?.negative_count || 0,
            averageRating: result?.average_rating || 0,
            commentCount: result?.comment_count || 0,
        };
    }
    /**
     * 删除过期的反馈（数据清理）
     */
    async deleteExpiredFeedback(daysOld = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const cutoffTimestamp = this.formatTimestamp(cutoffDate);
        const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`;
        const result = await this.executeRun(query, [cutoffTimestamp]);
        // 清除统计缓存
        await this.deleteCache('feedback_stats');
        return result.changes || 0;
    }
}
//# sourceMappingURL=UserFeedbackModel.js.map