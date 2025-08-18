/**
 * 用户反馈数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import type { Env } from '../index';
export interface UserFeedback {
    id: string;
    sessionId?: string;
    feedbackType: 'like' | 'dislike' | 'comment';
    content?: string;
    rating?: number;
    createdAt: string;
}
export interface CreateUserFeedbackData {
    sessionId?: string;
    feedbackType: 'like' | 'dislike' | 'comment';
    content?: string;
    rating?: number;
}
export interface FeedbackStats {
    totalFeedback: number;
    positiveCount: number;
    negativeCount: number;
    averageRating: number;
    commentCount: number;
}
export declare class UserFeedbackModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建用户反馈
     */
    create(feedbackData: CreateUserFeedbackData): Promise<string>;
    /**
     * 获取反馈统计
     */
    getStats(): Promise<FeedbackStats>;
    /**
     * 根据会话ID获取反馈
     */
    findBySessionId(sessionId: string): Promise<UserFeedback[]>;
    /**
     * 获取最近的反馈
     */
    getRecentFeedback(limit?: number): Promise<UserFeedback[]>;
    /**
     * 获取评论反馈
     */
    getComments(limit?: number): Promise<UserFeedback[]>;
    /**
     * 根据时间范围获取反馈统计
     */
    getStatsByDateRange(startDate: string, endDate: string): Promise<FeedbackStats>;
    /**
     * 删除过期的反馈（数据清理）
     */
    deleteExpiredFeedback(daysOld?: number): Promise<number>;
}
//# sourceMappingURL=UserFeedbackModel.d.ts.map