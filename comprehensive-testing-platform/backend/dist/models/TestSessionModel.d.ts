/**
 * 测试会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import type { Env } from '../index';
export interface TestSession {
    id: string;
    testTypeId: string;
    answersData: string;
    resultData: string;
    userAgent?: string;
    ipAddressHash?: string;
    sessionDuration?: number;
    createdAt: string;
}
export interface CreateTestSessionData {
    testTypeId: string;
    answers: any[];
    result: any;
    userAgent?: string;
    ipAddress?: string;
    sessionDuration?: number;
}
export interface TestSessionStats {
    totalSessions: number;
    averageScore: number;
    completionRate: number;
}
export declare class TestSessionModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建测试会话
     */
    create(sessionData: CreateTestSessionData): Promise<string>;
    /**
     * 根据ID获取测试会话
     */
    findById(id: string): Promise<TestSession | null>;
    /**
     * 根据测试类型获取统计数据
     */
    getStatsByTestType(testTypeId: string): Promise<TestSessionStats>;
    /**
     * 获取最近的测试会话
     */
    getRecentSessions(limit?: number): Promise<TestSession[]>;
    /**
     * 根据时间范围获取会话数量
     */
    getSessionCountByDateRange(startDate: string, endDate: string, testTypeId?: string): Promise<number>;
    /**
     * 删除过期的测试会话（数据清理）
     */
    deleteExpiredSessions(daysOld?: number): Promise<number>;
    /**
     * 更新会话持续时间
     */
    updateSessionDuration(id: string, duration: number): Promise<void>;
}
//# sourceMappingURL=TestSessionModel.d.ts.map