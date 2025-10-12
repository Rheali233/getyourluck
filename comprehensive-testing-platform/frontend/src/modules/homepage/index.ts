/**
 * 首页模块索引文件
 * 遵循统一开发标准的模块导出规范
 */

// 导出组件
export { default as Homepage } from './components/Homepage';
export { default as HeroSection } from './components/HeroSection';
export { default as TestModulesGrid } from './components/TestModulesGrid';
export { CookiesBanner } from './components/CookiesBanner';
export { FeaturedTests } from './components/FeaturedTests';
export { PlatformFeatures } from './components/PlatformFeatures';
export { BlogRecommendations } from './components/BlogRecommendations';
export { FAQ } from './components/FAQ';
export { ResponsiveNavigation } from './components/ResponsiveNavigation';
export { TouchFriendlyComponents, TouchFriendlyButton, TouchFriendlyCard } from './components/TouchFriendlyComponents';
export { ResponsiveLayout, ResponsiveContainer, ResponsiveText, ResponsiveSpacing, ResponsiveVisibility } from './components/ResponsiveLayout';

export { TestModuleStats } from './components/TestModuleStats';
export { UserBehaviorTracker } from './components/UserBehaviorTracker';
export { OptimizedImage } from './components/OptimizedImage';
export { ErrorBoundary } from './components/ErrorBoundary';
// 已删除的测试套件组件：FunctionalTestSuite, UXTestSuite

// 导出状态管理
export { useHomepageStore } from './stores/useHomepageStore';

// 导出类型
export type {
  TestModule,
  PopularTest,
  BlogArticle,
  PlatformFeature,
  
  UserPreferences,
  HomepageStats,
  HomepageConfig,
  HomepageState,
  HomepageActions,
  HomepageModuleState,
  HeroSectionProps,
  TestModulesGridProps,
  PopularTestsProps,
  PlatformFeaturesProps,
  BlogSectionProps,
  
  CookiesBannerProps,
  CookiesSettingsProps,
} from './types'; 