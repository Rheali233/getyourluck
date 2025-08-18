import { D1Database } from '@cloudflare/workers-types';
interface PrivacyConfig {
    enableDataAnonymization: boolean;
    enableGdprCompliance: boolean;
    enableDataRetention: boolean;
    dataRetentionDays: number;
    enableUserConsent: boolean;
    enableDataPortability: boolean;
    enableRightToBeForgotten: boolean;
}
export declare enum ConsentType {
    NECESSARY = "necessary",
    ANALYTICS = "analytics",
    MARKETING = "marketing",
    THIRD_PARTY = "third_party"
}
export interface UserConsent {
    sessionId: string;
    consentType: ConsentType;
    granted: boolean;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt?: string;
}
export interface AnonymizationOptions {
    hashPersonalData: boolean;
    removeIdentifiers: boolean;
    aggregateData: boolean;
    pseudonymizeData: boolean;
}
export declare class PrivacyService {
    private db;
    private config;
    constructor(db: D1Database, config?: Partial<PrivacyConfig>);
    /**
     * 记录用户同意
     */
    recordUserConsent(consent: UserConsent): Promise<void>;
    /**
     * 获取用户同意状态
     */
    getUserConsent(sessionId: string, consentType: ConsentType): Promise<boolean>;
    /**
     * 检查GDPR合规性
     */
    checkGdprCompliance(sessionId: string): Promise<{
        compliant: boolean;
        missingConsents: ConsentType[];
        dataRetentionStatus: string;
    }>;
    /**
     * 检查数据保留状态
     */
    checkDataRetention(sessionId: string): Promise<string>;
    /**
     * 匿名化用户数据
     */
    anonymizeUserData(sessionId: string, options?: AnonymizationOptions): Promise<void>;
    /**
     * 哈希个人数据
     */
    private hashPersonalData;
    /**
     * 移除标识符
     */
    private removeIdentifiers;
    /**
     * 聚合数据
     */
    private aggregateData;
    /**
     * 伪匿名化数据
     */
    private pseudonymizeData;
    /**
     * 实现被遗忘权
     */
    implementRightToBeForgotten(sessionId: string): Promise<void>;
    /**
     * 数据可携带性
     */
    exportUserData(sessionId: string): Promise<{
        userPreferences: any;
        consentHistory: any[];
        searchHistory: any[];
        exportTimestamp: string;
    }>;
    /**
     * 清理过期数据
     */
    cleanupExpiredData(): Promise<{
        deletedRecords: number;
        anonymizedRecords: number;
    }>;
    /**
     * 获取隐私报告
     */
    getPrivacyReport(sessionId: string): Promise<{
        dataRetentionStatus: string;
        gdprCompliance: boolean;
        dataTypes: string[];
        lastDataAccess: string;
        consentStatus: Record<ConsentType, boolean>;
    }>;
    /**
     * 获取最后数据访问时间
     */
    private getLastDataAccess;
}
export {};
//# sourceMappingURL=PrivacyService.d.ts.map