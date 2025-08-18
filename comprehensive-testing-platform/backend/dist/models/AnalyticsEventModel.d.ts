/**
 * 分析事件数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import type { Env } from '../index';
export interface AnalyticsEvent {
    id: string;
    eventType: string;
    eventData?: string;
    sessionId?: string;
    ipAddressHash?: string;
    userAgent?: string;
    timestamp: string;
}
export interface CreateAnalyticsEventData {
    eventType: string;
    eventData?: any;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface EventStats {
    eventType: string;
    count: number;
    percentage: number;
}
export interface AnalyticsOverview {
    totalEvents: number;
    uniqueSessions: number;
    topEvents: EventStats[];
    timeRange: string;
}
export declare class AnalyticsEventModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建分析事件
     */
    create(eventData: CreateAnalyticsEventData): Promise<string>;
    /**
     * 获取事件统计
     */
    getEventStats(startDate?: string, endDate?: string, limit?: number): Promise<EventStats[]>;
    /**
     * 获取分析概览
     */
    getOverview(startDate?: string, endDate?: string): Promise<AnalyticsOverview>;
    /**
     * 根据事件类型获取事件
     */
    findByEventType(eventType: string, limit?: number, startDate?: string, endDate?: string): Promise<AnalyticsEvent[]>;
    /**
     * 根据会话ID获取事件
     */
    findBySessionId(sessionId: string): Promise<AnalyticsEvent[]>;
    /**
     * 获取每日事件统计
     */
    getDailyStats(days?: number, eventType?: string): Promise<Array<{
        date: string;
        count: number;
    }>>;
    /**
     * 获取用户行为路径
     */
    getUserJourney(sessionId: string): Promise<AnalyticsEvent[]>;
    /**
     * 删除过期的分析事件（数据清理）
     */
    deleteExpiredEvents(daysOld?: number): Promise<number>;
    /**
     * 批量创建事件（用于高频事件）
     */
    createBatch(events: CreateAnalyticsEventData[]): Promise<number>;
}
//# sourceMappingURL=AnalyticsEventModel.d.ts.map