/**
 * 通用组件索引文件
 * 导出所有通用UI组件
 */

// 基础UI组件
export { Card } from './Card';
export { Button } from './Button';
export { Modal } from './Modal';
export { TestNavigation } from './TestNavigation';
export { DateInput } from './DateInput';
export { TimeInput } from './TimeInput';
export { LocationInput } from './LocationInput';
export { LoadingSpinner } from './LoadingSpinner';
export { Select } from './Select';
export { Input } from './Input';

// 导航和页脚组件
export { Navigation } from './Navigation';
export { Footer } from './Footer';
export { Breadcrumb } from './Breadcrumb';
export { LazyLoad, createLazyComponent } from '../LazyLoad';
export { LazyImage, OptimizedImage } from '../LazyImage';
export { Preload, PreloadCriticalModules, PreloadImage, PreloadFont } from '../Preload';
export { 
  InternalLink, 
  KeywordLink, 
  RelatedTests, 
  ModuleRecommendations, 
  EnhancedBreadcrumb, 
  ContextualLinks 
} from '../InternalLinks';
export { SEODashboard } from '../SEODashboard';
export { 
  MobileOptimized, 
  TouchTarget, 
  MobileImage, 
  GestureHandler, 
  MobilePerformanceMonitor, 
  MobileNavigation 
} from '../MobileOptimized';
export { MobileSEOHead, MobilePerformanceHead } from '../MobileSEOHead';

// 布局组件
export { TestPreparationLayout } from './TestPreparationLayout';

// 通用内容组件
export { InfoCard } from './common/InfoCard';
export { InstructionList } from './common/InstructionList';
export { ArticleCard } from './common/ArticleCard';
export { ArticleMeta } from './common/ArticleMeta';
export { Pagination } from './common/Pagination';
export { ArticleContent } from './common/ArticleContent';
export { Skeleton, ArticleCardSkeleton } from './common/Skeleton';

// 结果页面组件
// ResultPageLayout已删除，现在使用专门的结果显示组件

// 数据展示组件
export { ScoreDisplay } from './common/ScoreDisplay';
export { ChartComponent } from './common/ChartComponent';

// 反馈组件
export { FeedbackFloatingWidget } from './FeedbackFloatingWidget';