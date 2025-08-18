/**
 * 用户偏好设置数据模型
 * 遵循统一开发标准的Cookies管理实现
 */
import { BaseModel } from './BaseModel';
export interface UserPreferencesData {
    id: string;
    sessionId?: string;
    language: string;
    theme: string;
    cookiesConsent: boolean;
    analyticsConsent: boolean;
    marketingConsent: boolean;
    notificationEnabled: boolean;
    searchHistoryEnabled: boolean;
    personalizedContent: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CookiesConsentData {
    sessionId?: string;
    cookiesConsent: boolean;
    analyticsConsent: boolean;
    marketingConsent: boolean;
    timestamp: Date;
}
export declare class UserPreferencesModel extends BaseModel {
    constructor(env: any);
    /**
     * 创建或更新用户偏好设置
     */
    upsertPreferences(preferences: Omit<UserPreferencesData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
    /**
     * 根据会话ID获取用户偏好设置
     */
    getPreferencesBySessionId(sessionId: string): Promise<UserPreferencesData | null>;
    /**
     * 更新Cookies同意状态
     */
    updateCookiesConsent(sessionId: string, consent: CookiesConsentData): Promise<void>;
    /**
     * 获取Cookies同意统计
     */
    getCookiesConsentStats(): Promise<{
        totalUsers: number;
        cookiesConsent: number;
        analyticsConsent: number;
        marketingConsent: number;
        consentRate: number;
    }>;
    /**
     * 清理过期的用户偏好设置
     */
    cleanupExpiredPreferences(daysOld?: number): Promise<number>;
    /**
     * 获取用户偏好设置列表
     */
    getPreferencesList(limit?: number, offset?: number): Promise<UserPreferencesData[]>;
    /**
     * 删除用户偏好设置
     */
    deletePreferences(id: string): Promise<void>;
    /**
     * 将数据库行映射为UserPreferencesData对象
     */
    private mapDatabaseRowToPreferences;
}
//# sourceMappingURL=UserPreferencesModel.d.ts.map