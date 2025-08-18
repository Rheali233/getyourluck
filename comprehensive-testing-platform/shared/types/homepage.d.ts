/**
 * 首页模块共享类型定义
 * 遵循统一开发标准的类型定义规范
 */
export interface HomepageModule {
    id: string;
    name: string;
    description: string;
    icon: string;
    theme: 'psychology' | 'astrology' | 'tarot' | 'career' | 'numerology' | 'learning' | 'relationship';
    testCount: number;
    rating: number;
    isActive: boolean;
    route: string;
    features: string[];
    estimatedTime: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface HomepageConfig {
    heroSection: {
        title: string;
        subtitle: string;
        description: string;
        features: string[];
        ctaText: string;
        ctaRoute: string;
    };
    testModules: HomepageModule[];
    platformFeatures: PlatformFeature[];
    seoMeta: {
        title: string;
        description: string;
        keywords: string;
    };
}
export interface PlatformFeature {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}
export interface HomepageStats {
    totalModules: number;
    totalTests: number;
    averageRating: number;
    activeThemes: string[];
}
export interface HomepageAnalyticsEvent {
    eventType: 'page_view' | 'module_click' | 'search_query' | 'cta_click' | 'scroll_depth';
    eventData?: Record<string, any>;
    sessionId?: string;
    pageUrl: string;
    referrer?: string;
}
export interface SearchSuggestion {
    id: string;
    text: string;
    type: 'test' | 'blog' | 'category';
    relevance: number;
}
export interface SearchHistory {
    id: string;
    query: string;
    timestamp: string;
    resultCount: number;
}
export interface UserPreferences {
    language: 'zh-CN' | 'en-US';
    theme: 'light' | 'dark' | 'auto';
    cookiesConsent: boolean;
    analyticsConsent: boolean;
    marketingConsent: boolean;
    notificationEnabled: boolean;
    searchHistoryEnabled: boolean;
    personalizedContent: boolean;
}
export interface HomepageConfigResponse {
    success: boolean;
    data: HomepageConfig;
    timestamp: string;
    requestId?: string;
}
export interface HomepageModulesResponse {
    success: boolean;
    data: HomepageModule[];
    timestamp: string;
    requestId?: string;
}
export interface HomepageStatsResponse {
    success: boolean;
    data: HomepageStats;
    timestamp: string;
    requestId?: string;
}
export interface HomepageAnalyticsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    requestId?: string;
}
//# sourceMappingURL=homepage.d.ts.map