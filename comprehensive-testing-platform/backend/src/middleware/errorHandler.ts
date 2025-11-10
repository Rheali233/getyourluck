/**
 * 统一错误处理中间件
 * 负责捕获、记录和处理应用中的各种错误
 */

import { Context } from 'hono';
import type { APIResponse } from '../../../shared/types/apiResponse';
import {
  handleError as sharedHandleError
} from '../../../shared/utils/errorHandler';
import { ModuleError } from '../../../shared/types/errors';

// 自定义错误类型
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code: string | undefined;

  constructor(message: string, statusCode: number = 500, code?: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Workers 环境无需captureStackTrace
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', code?: string) {
    super(message, 401, code);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', code?: string) {
    super(message, 409, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', code?: string) {
    super(message, 429, code);
  }
}

// 错误代码映射
export const ERROR_CODES = {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  // 认证授权错误 (2000-2999)
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // 数据错误 (3000-3999)
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_CONFLICT: 'DATA_CONFLICT',
  DATA_INVALID: 'DATA_INVALID',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // 业务逻辑错误 (4000-4999)
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  INVALID_OPERATION: 'INVALID_OPERATION',
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',

  // 外部服务错误 (5000-5999)
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR'
} as const;

// 错误处理中间件
export const errorHandler = (err: unknown, c: Context) => {
  return handleError(err, c);
};

// 错误处理函数 - 使用共享的错误处理逻辑
export function handleError(error: unknown, c: Context) {
  // 转换为Error类型以便传递给共享处理器
  const errorToHandle = error instanceof Error ? error : new Error(String(error));
  
  // 使用共享的错误处理
  const moduleError = sharedHandleError(errorToHandle);

  // 记录错误（包含请求上下文）
  logError(error, c);

  // 格式化错误响应
  const { body, status } = formatErrorResponse(moduleError, c);
  c.status(status as any);
  c.header('Content-Type', 'application/json');

  // 返回错误响应
  return c.json(body);
}

// 记录错误
function logError(error: unknown, c: Context) {
  const requestId = c.get('requestId') || 'unknown';
  const timestamp = new Date().toISOString();
  const url = c.req.url;
  const method = c.req.method;
  const userAgent = c.req.header('User-Agent') || 'unknown';
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';

  // 构建错误日志
  const errorLog = {
    timestamp,
    requestId,
    url,
    method,
    userAgent,
    ip,
    error: {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof AppError ? error.code : undefined
    }
  };

  // 根据错误类型选择日志级别
  if (error instanceof AppError && error.isOperational) {
    // eslint-disable-next-line no-console
    console.warn('Operational Error:', errorLog);
  } else {
    // eslint-disable-next-line no-console
    console.error('System Error:', errorLog);
  }

  // 发送错误到监控系统（如果配置了）
  sendErrorToMonitoring(errorLog);
}

// 格式化错误响应
function formatErrorResponse(error: unknown, c?: Context): { body: APIResponse; status: number } {
  const requestId = c?.get('requestId') || 'unknown';
  
  if (error instanceof ModuleError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
  }

  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
  }

  // 未知错误类型
  return {
    status: 500,
    body: {
      success: false,
      error: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId
    }
  };
}

// 发送错误到监控系统
async function sendErrorToMonitoring(_errorLog: unknown) {
  // TODO: 集成外部监控系统时在此实现上报逻辑
}

// 异步错误包装器
export function asyncErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => fn(...args);
}

// 验证错误处理
export function handleValidationError(errors: any[]): ValidationError {
  const messages = errors.map(error => error.message).join('; ');
  return new ValidationError(messages, ERROR_CODES.VALIDATION_ERROR);
}

// 数据库错误处理
export function handleDatabaseError(error: any): AppError {
  if (error.code === 'SQLITE_CONSTRAINT') {
    return new ConflictError('Database constraint violation', ERROR_CODES.DATA_CONFLICT);
  }

  if (error.code === 'SQLITE_BUSY') {
    return new AppError('Database is busy, please retry later', 503, ERROR_CODES.DATABASE_ERROR);
  }

  return new AppError('Database operation failed', 500, ERROR_CODES.DATABASE_ERROR);
}

// 网络错误处理
export function handleNetworkError(error: any): AppError {
  if (error.code === 'ENOTFOUND') {
    return new AppError('Network connection failed', 503, ERROR_CODES.NETWORK_ERROR);
  }

  if (error.code === 'ETIMEDOUT') {
    return new AppError('Request timed out', 504, ERROR_CODES.TIMEOUT_ERROR);
  }

  return new AppError('Network error', 503, ERROR_CODES.NETWORK_ERROR);
}

// 类型已在上方导出class，无需重复导出type别名