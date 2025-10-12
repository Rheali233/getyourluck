/**
 * 统一错误处理类型定义
 * 遵循统一开发标准中的ModuleError规范
 */

export class ModuleError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = "ModuleError";
  }
}

export const ERROR_CODES = {
  // 通用错误
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  
  // 测试相关错误
  TEST_NOT_FOUND: "TEST_NOT_FOUND",
  TEST_ALREADY_STARTED: "TEST_ALREADY_STARTED",
  TEST_NOT_STARTED: "TEST_NOT_STARTED",
  TEST_ALREADY_COMPLETED: "TEST_ALREADY_COMPLETED",
  QUESTION_NOT_FOUND: "QUESTION_NOT_FOUND",
  ANSWER_INVALID: "ANSWER_INVALID",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  
  // AI服务相关错误
  AI_SERVICE_UNAVAILABLE: "AI_SERVICE_UNAVAILABLE",
  AI_ANALYSIS_FAILED: "AI_ANALYSIS_FAILED",
  AI_RATE_LIMITED: "AI_RATE_LIMITED",
  AI_INVALID_RESPONSE: "AI_INVALID_RESPONSE",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  
  // 数据库相关错误
  DATABASE_ERROR: "DATABASE_ERROR",
  DATABASE_CONNECTION_FAILED: "DATABASE_CONNECTION_FAILED",
  DATABASE_QUERY_FAILED: "DATABASE_QUERY_FAILED",
  DATABASE_TRANSACTION_FAILED: "DATABASE_TRANSACTION_FAILED",
  
  // 缓存相关错误
  CACHE_ERROR: "CACHE_ERROR",
  CACHE_KEY_NOT_FOUND: "CACHE_KEY_NOT_FOUND",
  CACHE_EXPIRED: "CACHE_EXPIRED",
  
  // 文件相关错误
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  FILE_DOWNLOAD_FAILED: "FILE_DOWNLOAD_FAILED",
  FILE_INVALID_FORMAT: "FILE_INVALID_FORMAT",
  
  // 用户相关错误
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_INVALID_CREDENTIALS: "USER_INVALID_CREDENTIALS",
  USER_ACCOUNT_LOCKED: "USER_ACCOUNT_LOCKED",
  
  // 权限相关错误
  PERMISSION_DENIED: "PERMISSION_DENIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  ROLE_NOT_FOUND: "ROLE_NOT_FOUND",
  
  // 配置相关错误
  CONFIGURATION_ERROR: "CONFIGURATION_ERROR",
  ENVIRONMENT_VARIABLE_MISSING: "ENVIRONMENT_VARIABLE_MISSING",
  INVALID_CONFIGURATION: "INVALID_CONFIGURATION",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// 错误分类
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  CACHE = 'CACHE',
  AI_SERVICE = 'AI_SERVICE',
  FILE = 'FILE',
  USER = 'USER',
  CONFIGURATION = 'CONFIGURATION',
  SYSTEM = 'SYSTEM'
}

// 扩展的错误接口
export interface ExtendedError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  severity: ErrorSeverity;
  category: ErrorCategory;
  details?: any;
  timestamp: string;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  context?: Record<string, any>;
}

// 错误响应格式
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

// 错误处理选项
export interface ErrorHandlingOptions {
  logError?: boolean;
  notifyUser?: boolean;
  retryable?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  fallbackResponse?: any;
}