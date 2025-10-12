/**
 * 首页模块类型定义
 * 遵循统一开发标准的类型定义规范
 */

import type { BaseComponentProps } from '@/types/componentTypes';

// 测试模块信息
export interface TestModule {
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
}

// 热门测试
export interface PopularTest {
  id: string;
  name: string;
  description: string;
  testType: string;
  rating: number;
  testCount: number;
  image?: string;
  route: string;
}

// 博客文章
export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readCount: number;
  category: string;
  tags: string[];
  image?: string;
  slug: string;
}

// 平台特色
export interface PlatformFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// 已移除搜索模块相关类型

// 用户偏好
export interface UserPreferences {
  language: 'zh-CN' | 'en-US';
  theme: 'light' | 'dark' | 'auto';
  cookiesConsent: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
}

// 首页统计数据
export interface HomepageStats {
  totalUsers: number;
  totalTests: number;
  totalArticles: number;
  averageRating: number;
  activeModules: number;
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
  testModules: TestModule[];
  popularTests: PopularTest[];
  platformFeatures: PlatformFeature[];
  blogArticles: BlogArticle[];
  // removed search config
}

// 首页状态
export interface HomepageState {
  config: HomepageConfig | null;
  stats: HomepageStats | null;
  // removed search state
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

// 首页操作
export interface HomepageActions {
  // 配置管理
  loadConfig: () => Promise<void>;
  updateConfig: (config: Partial<HomepageConfig>) => void;
  
  // 统计数据
  loadStats: () => Promise<void>;
  
  // removed search actions
  
  // 用户偏好
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  saveUserPreferences: () => Promise<void>;
  loadUserPreferences: () => Promise<void>;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// 首页模块状态（继承统一接口）
export interface HomepageModuleState extends HomepageState, HomepageActions {}

// 组件属性接口
export interface HeroSectionProps extends BaseComponentProps {
  config: HomepageConfig['heroSection'];
  onStartTest: () => void;
}

export interface TestModulesGridProps extends BaseComponentProps {
  modules: TestModule[];
  onModuleClick: (module: TestModule) => void;
}

export interface PopularTestsProps extends BaseComponentProps {
  tests: PopularTest[];
  onTestClick: (test: PopularTest) => void;
}

export interface PlatformFeaturesProps extends BaseComponentProps {
  features: PlatformFeature[];
}

export interface BlogSectionProps extends BaseComponentProps {
  articles: BlogArticle[];
  onArticleClick: (article: BlogArticle) => void;
  onViewMore: () => void;
}

// removed SearchSectionProps

export interface CookiesBannerProps extends BaseComponentProps {
  isVisible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onSettings: () => void;
}

export interface CookiesSettingsProps extends BaseComponentProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onClose: () => void;
  onSave: (preferences: UserPreferences) => void;
} 