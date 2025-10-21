/**
 * 错误处理基类
 * 提供通用的错误处理功能，各模块可以继承并定制
 */

import { 
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
} from '../utils/errorHandler';
import { ERROR_CODES } from '../types/errors';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  testType?: string;
  action?: string;
  [key: string]: any;
}

export interface ErrorLogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  code: string;
  context: ErrorContext;
  stack: string;
  metadata?: Record<string, any>;
}

export abstract class BaseErrorHandler {
  protected moduleName: string;
  protected logErrors: boolean;
  protected notifyUsers: boolean;
  protected errorLog: ErrorLogEntry[] = [];

  constructor(
    moduleName: string,
    options: {
      logErrors?: boolean;
      notifyUsers?: boolean;
    } = {}
  ) {
    this.moduleName = moduleName;
    this.logErrors = options.logErrors ?? true;
    this.notifyUsers = options.notifyUsers ?? true;
  }

  /**
   * 处理错误
   */
  handleError(
    error: Error | any,
    context: ErrorContext = {}
  ): Error {
    const processedError = handleError(error, {
      logError: this.logErrors
    });

    if (this.logErrors) {
      this.logError(processedError, context);
    }

    return processedError;
  }

  /**
   * 创建模块特定的错误
   */
  createModuleError(
    code: keyof typeof ERROR_CODES,
    message: string,
    statusCode: number = 500,
    details?: any
  ): Error {
    return createError(code, message, statusCode, details);
  }

  /**
   * 创建验证错误
   */
  createValidationError(
    message: string,
    field?: string,
    value?: any,
    context?: ErrorContext
  ): Error {
    const error = createValidationError(message, field, value);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建未找到错误
   */
  createNotFoundError(
    resource: string,
    identifier?: string,
    context?: ErrorContext
  ): Error {
    const error = createNotFoundError(resource, identifier);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建未授权错误
   */
  createUnauthorizedError(
    message: string = 'Authentication required',
    context?: ErrorContext
  ): Error {
    const error = createUnauthorizedError(message);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建禁止访问错误
   */
  createForbiddenError(
    message: string = 'Access denied',
    context?: ErrorContext
  ): Error {
    const error = createForbiddenError(message);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建网络错误
   */
  createNetworkError(
    message: string = 'Network request failed',
    statusCode?: number,
    context?: ErrorContext
  ): Error {
    const error = createNetworkError(message, statusCode);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建数据库错误
   */
  createDatabaseError(
    message: string = 'Database operation failed',
    context?: ErrorContext
  ): Error {
    const error = createDatabaseError(message);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建AI服务错误
   */
  createAIServiceError(
    message: string = 'AI service unavailable',
    context?: ErrorContext
  ): Error {
    const error = createAIServiceError(message);
    this.logError(error, context);
    return error;
  }

  /**
   * 创建速率限制错误
   */
  createRateLimitError(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    context?: ErrorContext
  ): Error {
    const error = createRateLimitError(message, retryAfter);
    this.logError(error, context);
    return error;
  }

  /**
   * 判断错误是否可重试
   */
  isRetryable(error: Error): boolean {
    return isRetryable(error as any);
  }

  /**
   * 获取用户友好的错误消息
   */
  getUserFriendlyMessage(error: Error): string {
    return getUserFriendlyMessage(error as any);
  }

  /**
   * 记录错误
   */
  protected logError(error: Error, context: ErrorContext = {}): void {
    const logEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      code: String((error as any).code || ERROR_CODES.INTERNAL_ERROR),
      context: { ...context, module: this.moduleName },
      stack: error.stack || '',
      metadata: {
        name: error.name,
        statusCode: (error as any).statusCode
      }
    };

    this.writeLog(logEntry);
  }

  /**
   * 写入日志
   */
  protected writeLog(logEntry: ErrorLogEntry): void {
    // 控制台输出
    console.error(`[${this.moduleName}] Error:`, logEntry);

    // Production logging would be implemented here
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByCode: Record<string, number>;
    errorsByLevel: Record<string, number>;
  } {
    // TODO: 实现错误统计功能
    return {
      totalErrors: 0,
      errorsByCode: {},
      errorsByLevel: {}
    };
  }

  /**
   * 清理错误日志
   */
  clearErrorLogs(): void {
    // TODO: 实现错误日志清理功能
  }

  /**
   * 导出错误日志
   */
  exportErrorLogs(): ErrorLogEntry[] {
    // TODO: 实现错误日志导出功能
    return [];
  }
}

// 重新导出工具函数，保持向后兼容
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
};
