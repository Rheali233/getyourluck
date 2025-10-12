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
  ErrorSeverity,
  ErrorCategory,
  type ExtendedError,
  type ErrorResponse,
  type ErrorHandlingOptions,
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

// 测试相关类型
export {
  TestCategory,
  TestStatus,
  QuestionType,
  TestFlowState,
} from "./testing";

export type {
  BaseQuestion,
  MultipleChoiceQuestion,
  ScaleQuestion,
  TextQuestion,
  BooleanQuestion,
  RankingQuestion,
  QuestionOption,
  Question,
  BaseAnswer,
  MultipleChoiceAnswer,
  ScaleAnswer,
  TextAnswer,
  BooleanAnswer,
  RankingAnswer,
  Answer,
  TestSession,
  TestConfig,
  TestFlow,
  TestStep,
  TestAnalysis,
  AnalysisInsight,
  AnalysisRecommendation,
  AnalysisPattern,
  TestHistory,
  TestSessionSummary,
  TestStatistics,
  TestPreferences,
} from "./testing";

// 塔罗牌模块类型
export type {
  TarotCard,
  DrawnCard,
  QuestionCategory,
  TarotSpread,
  AIReading,
  BasicReading,
  TarotSession,
  TarotRecommendation,
  TarotDrawRequest,
  TarotDrawResponse,
  TarotFeedbackRequest,
} from "./tarot";

export {
  TarotTestType,
  TAROT_SUITS,
  TAROT_ELEMENTS,
  POSITION_MEANINGS,
} from "./tarot";

// 反馈类型
export type {
  FeedbackCategory,
  FeedbackPayload,
  FeedbackCreateResponse,
} from "./feedback";