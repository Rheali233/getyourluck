import { D1Database } from '@cloudflare/workers-types';
export declare enum EventType {
    PAGE_VIEW = "page_view",
    CLICK = "click",
    SEARCH = "search",
    TEST_START = "test_start",
    TEST_COMPLETE = "test_complete",
    COOKIE_CONSENT = "cookie_consent",
    ERROR = "error",
    PERFORMANCE = "performance",
    USER_ENGAGEMENT = "user_engagement"
}
export interface AnalyticsEvent {
    id: string;
    sessionId: string;
    eventType: EventType;
    eventData: Record<string, any>;
    timestamp: string;
    pageUrl: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
    deviceInfo?: {
        type: 'desktop' | 'mobile' | 'tablet';
        os: string;
        browser: string;
        screenResolution: string;
    };
    performanceMetrics?: {
        loadTime: number;
        domContentLoaded: number;
        firstContentfulPaint: number;
        largestContentfulPaint: number;
    };
}
export interface UserBehaviorAnalysis {
    sessionId: string;
    totalEvents: number;
    eventBreakdown: Record<EventType, number>;
    sessionDuration: number;
    pagesVisited: string[];
    searchQueries: string[];
    testEngagement: {
        testsStarted: number;
        testsCompleted: number;
        completionRate: number;
    };
    deviceUsage: {
        desktop: number;
        mobile: number;
        tablet: number;
    };
    engagementScore: number;
    lastActivity: string;
}
export interface PerformanceMetrics {
    pageUrl: string;
    avgLoadTime: number;
    avgDomContentLoaded: number;
    avgFirstContentfulPaint: number;
    avgLargestContentfulPaint: number;
    sampleCount: number;
    p95LoadTime: number;
    p99LoadTime: number;
    lastUpdated: string;
}
export interface SearchAnalytics {
    query: string;
    searchCount: number;
    resultCount: number;
    clickThroughRate: number;
    avgTimeToClick: number;
    popularResults: Array<{
        contentId: string;
        contentType: string;
        clickCount: number;
    }>;
    lastSearched: string;
}
export declare class AnalyticsService {
    private db;
    constructor(db: D1Database);
    /**
     * 记录用户行为事件
     */
    recordEvent(event: AnalyticsEvent): Promise<void>;
    /**
     * 批量记录事件
     */
    recordEvents(events: AnalyticsEvent[]): Promise<void>;
    /**
     * 获取用户行为分析
     */
    getUserBehaviorAnalysis(sessionId: string, timeRange?: {
        start: string;
        end: string;
    }): Promise<UserBehaviorAnalysis>;
    /**
     * 获取性能指标
     */
    getPerformanceMetrics(pageUrl: string, timeRange?: {
        start: string;
        end: string;
    }): Promise<PerformanceMetrics>;
    /**
     * 获取搜索分析
     */
    getSearchAnalytics(timeRange?: {
        start: string;
        end: string;
    }): Promise<SearchAnalytics[]>;
    /**
     * 计算百分位数
     */
    private calculatePercentile;
    /**
     * 计算参与度分数
     */
    private calculateEngagementScore;
    /**
     * 清理过期数据
     */
    cleanupOldData(retentionDays?: number): Promise<number>;
}
//# sourceMappingURL=AnalyticsService.d.ts.map