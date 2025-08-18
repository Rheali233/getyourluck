/**
 * 统一错误处理中间件
 * 负责捕获、记录和处理应用中的各种错误
 */

import { Context, Next } from 'hono';
import type { APIResponse } from '../../../shared/types/apiResponse';

// 自定义错误类型
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '认证失败', code?: string) {
    super(message, 401, code);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = '权限不足', code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = '资源未找到', code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = '资源冲突', code?: string) {
    super(message, 409, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁', code?: string) {
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
export const errorHandler = async (err: Error, c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    return handleError(error, c);
  }
};

// 错误处理函数
export function handleError(error: unknown, c: Context) {
  // 记录错误
  logError(error, c);

  // 格式化错误响应
  const errorResponse = formatErrorResponse(error);

  // 设置响应头
  c.status(errorResponse.statusCode);
  c.header('Content-Type', 'application/json');

  // 返回错误响应
  return c.json(errorResponse);
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
    console.warn('Operational Error:', errorLog);
  } else {
    console.error('System Error:', errorLog);
  }

  // 发送错误到监控系统（如果配置了）
  sendErrorToMonitoring(errorLog);
}

// 格式化错误响应
function formatErrorResponse(error: unknown): APIResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code || ERROR_CODES.UNKNOWN_ERROR,
      timestamp: new Date().toISOString(),
      requestId: 'unknown'
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: ERROR_CODES.UNKNOWN_ERROR,
      timestamp: new Date().toISOString(),
      requestId: 'unknown'
    };
  }

  // 未知错误类型
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: ERROR_CODES.UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
    requestId: 'unknown'
  };
}

// 发送错误到监控系统
async function sendErrorToMonitoring(errorLog: any) {
  try {
    // 这里可以集成第三方监控服务，如Sentry、LogRocket等
    // 暂时只是记录到控制台
    if (process.env.ERROR_MONITORING_ENDPOINT) {
      await fetch(process.env.ERROR_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog)
      });
    }
  } catch (monitoringError) {
    console.error('Failed to send error to monitoring:', monitoringError);
  }
}

// 异步错误包装器
export function asyncErrorHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // 重新抛出错误，让错误处理中间件处理
      throw error;
    }
  };
}

// 验证错误处理
export function handleValidationError(errors: any[]): ValidationError {
  const messages = errors.map(error => error.message).join('; ');
  return new ValidationError(messages, ERROR_CODES.VALIDATION_ERROR);
}

// 数据库错误处理
export function handleDatabaseError(error: any): AppError {
  if (error.code === 'SQLITE_CONSTRAINT') {
    return new ConflictError('数据约束冲突', ERROR_CODES.DATA_CONFLICT);
  }
  
  if (error.code === 'SQLITE_BUSY') {
    return new AppError('数据库繁忙，请稍后重试', 503, ERROR_CODES.DATABASE_ERROR);
  }
  
  return new AppError('数据库操作失败', 500, ERROR_CODES.DATABASE_ERROR);
}

// 网络错误处理
export function handleNetworkError(error: any): AppError {
  if (error.code === 'ENOTFOUND') {
    return new AppError('网络连接失败', 503, ERROR_CODES.NETWORK_ERROR);
  }
  
  if (error.code === 'ETIMEDOUT') {
    return new AppError('请求超时', 504, ERROR_CODES.TIMEOUT_ERROR);
  }
  
  return new AppError('网络错误', 503, ERROR_CODES.NETWORK_ERROR);
}

// 导出错误类型
export type { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError };