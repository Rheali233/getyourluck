/**
 * 统一类型定义导出文件
 * 集中导出所有共享类型定义
 */

// 组件接口
export type {
  BaseComponentProps,
  LoadingProps,
  ButtonProps,
  CardProps,
  PageHeaderProps,
} from "./componentInterfaces";

// 状态管理接口
export type {
  ModuleState,
  ModuleActions,
  TestModuleState,
  TestModuleActions,
} from "./moduleState";

// API响应接口
export type {
  APIResponse,
  PaginatedResponse,
  TestResult,
  TestSubmission,
} from "./apiResponse";

// 错误处理
export {
  ModuleError,
  ERROR_CODES,
  type ErrorCode,
} from "./errors";

// 首页模块类型
export type {
  HomepageModule,
  HomepageConfig,
  PlatformFeature,
  HomepageStats,
  HomepageAnalyticsEvent,
  SearchSuggestion,
  SearchHistory,
  UserPreferences,
  HomepageConfigResponse,
  HomepageModulesResponse,
  HomepageStatsResponse,
  HomepageAnalyticsResponse,
} from "./homepage";