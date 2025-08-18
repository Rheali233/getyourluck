/**
 * 首页模块共享类型定义
 * 遵循统一开发标准的类型定义规范
 */

// 测试模块信息
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

// 首页配置
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

// 平台特色功能
export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// 首页统计数据
export interface HomepageStats {
  totalModules: number;
  totalTests: number;
  averageRating: number;
  activeThemes: string[];
}

// 用户行为事件
export interface HomepageAnalyticsEvent {
  eventType: 'page_view' | 'module_click' | 'search_query' | 'cta_click' | 'scroll_depth';
  eventData?: Record<string, any>;
  sessionId?: string;
  pageUrl: string;
  referrer?: string;
}

// 搜索建议
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'test' | 'blog' | 'category';
  relevance: number;
}

// 搜索历史
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

// 用户偏好设置
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

// API响应类型
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
