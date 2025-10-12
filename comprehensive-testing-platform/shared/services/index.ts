/**
 * 共享服务导出
 * 集中导出所有共享服务
 */

// 基础服务类
export {
  BaseAIService,
  type AIAnalysisRequest,
  type AIAnalysisResponse,
  type AIAnalysisError
} from './BaseAIService';

export {
  BaseErrorHandler,
  type ErrorContext,
  type ErrorLogEntry
} from './BaseErrorHandler';

// 结果检索服务
export {
  ResultRetrievalService,
  resultRetrievalService,
  type ResultRetrievalOptions,
  type ResultRetrievalResponse
} from './ResultRetrievalService';

// 错误处理工具函数
export {
  createError,
  createValidationError,
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  createNetworkError,
  createDatabaseError,
  createAIServiceError,
  createRateLimitError,
  isRetryable,
  getUserFriendlyMessage,
  handleError
} from './BaseErrorHandler';

// 环境配置
export {
  Environment,
  type EnvironmentConfig,
  detectEnvironment,
  getEnvironmentConfig,
  validateEnvironmentConfig,
  isDevelopment,
  isStaging,
  isProduction,
  isTest,
  config
} from '../config/environment';

// 安全中间件
export {
  InputValidator,
  OutputSanitizer,
  createCORSMiddleware,
  createRequestSizeLimitMiddleware,
  createSecurityHeadersMiddleware,
  commonValidationRules,
  type ValidationRule,
  type ValidationResult,
  type ValidationError,
  type CORSConfig
} from '../middleware/security';
