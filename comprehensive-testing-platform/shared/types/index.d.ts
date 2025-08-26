/**
 * 统一类型定义导出文件
 * 集中导出所有共享类型定义
 */
export type { BaseComponentProps, LoadingProps, ButtonProps, CardProps, PageHeaderProps, } from "./componentInterfaces";
export type { ModuleState, ModuleActions, TestModuleState, TestModuleActions, } from "./moduleState";
export type { APIResponse, PaginatedResponse, TestResult, TestSubmission, } from "./apiResponse";
export { ModuleError, ERROR_CODES, type ErrorCode, } from "./errors";
export type { HomepageModule, HomepageConfig, PlatformFeature, HomepageStats, HomepageAnalyticsEvent, SearchSuggestion, SearchHistory, UserPreferences, HomepageConfigResponse, HomepageModulesResponse, HomepageStatsResponse, HomepageAnalyticsResponse, } from "./homepage";
