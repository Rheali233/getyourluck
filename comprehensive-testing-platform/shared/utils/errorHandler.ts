/**
 * 统一错误处理工具类
 * 提供标准的错误处理方法，供各模块使用
 */

import { ModuleError, ERROR_CODES, ErrorSeverity, ErrorCategory, type ErrorHandlingOptions } from '../types/errors';

export class BaseErrorHandler {
  /**
   * 创建标准错误
   */
  static createError(
    code: keyof typeof ERROR_CODES,
    message: string,
    statusCode: number = 500,
    details?: any
  ): ModuleError {
    return new ModuleError(message, ERROR_CODES[code], statusCode, details);
  }

  /**
   * 创建验证错误
   */
  static createValidationError(
    message: string,
    field?: string,
    value?: any
  ): ModuleError {
    return this.createError(
      'VALIDATION_ERROR',
      message,
      400,
      { field, value }
    );
  }

  /**
   * 创建未找到错误
   */
  static createNotFoundError(
    resource: string,
    identifier?: string
  ): ModuleError {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    
    return this.createError('NOT_FOUND', message, 404, { resource, identifier });
  }

  /**
   * 创建未授权错误
   */
  static createUnauthorizedError(
    message: string = 'Authentication required',
    details?: any
  ): ModuleError {
    return this.createError('UNAUTHORIZED', message, 401, details);
  }

  /**
   * 创建禁止访问错误
   */
  static createForbiddenError(
    message: string = 'Access denied',
    details?: any
  ): ModuleError {
    return this.createError('FORBIDDEN', message, 403, details);
  }

  /**
   * 创建网络错误
   */
  static createNetworkError(
    message: string = 'Network request failed',
    statusCode?: number,
    details?: any
  ): ModuleError {
    return this.createError('NETWORK_ERROR', message, statusCode || 500, details);
  }

  /**
   * 创建数据库错误
   */
  static createDatabaseError(
    message: string = 'Database operation failed',
    details?: any
  ): ModuleError {
    return this.createError('DATABASE_ERROR', message, 500, details);
  }

  /**
   * 创建AI服务错误
   */
  static createAIServiceError(
    message: string = 'AI service unavailable',
    details?: any
  ): ModuleError {
    return this.createError('AI_SERVICE_UNAVAILABLE', message, 503, details);
  }

  /**
   * 创建速率限制错误
   */
  static createRateLimitError(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    details?: any
  ): ModuleError {
    const error = this.createError('RATE_LIMITED', message, 429, details);
    if (retryAfter) {
      error.details = { ...error.details, retryAfter };
    }
    return error;
  }

  /**
   * 判断错误是否可重试
   */
  static isRetryable(error: ModuleError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'DATABASE_CONNECTION_FAILED',
      'AI_SERVICE_UNAVAILABLE',
      'RATE_LIMITED'
    ];
    
    return retryableCodes.includes(error.code);
  }

  /**
   * 获取错误严重程度
   */
  static getErrorSeverity(error: ModuleError): ErrorSeverity {
    const criticalCodes = ['DATABASE_ERROR', 'CONFIGURATION_ERROR'];
    const highCodes = ['AI_SERVICE_UNAVAILABLE', 'NETWORK_ERROR'];
    const mediumCodes = ['VALIDATION_ERROR', 'RATE_LIMITED'];
    
    if (criticalCodes.includes(error.code)) return ErrorSeverity.CRITICAL;
    if (highCodes.includes(error.code)) return ErrorSeverity.HIGH;
    if (mediumCodes.includes(error.code)) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  /**
   * 获取错误分类
   */
  static getErrorCategory(error: ModuleError): ErrorCategory {
    const categoryMap: Record<string, ErrorCategory> = {
      'VALIDATION_ERROR': ErrorCategory.VALIDATION,
      'UNAUTHORIZED': ErrorCategory.AUTHENTICATION,
      'FORBIDDEN': ErrorCategory.AUTHORIZATION,
      'NETWORK_ERROR': ErrorCategory.NETWORK,
      'DATABASE_ERROR': ErrorCategory.DATABASE,
      'CACHE_ERROR': ErrorCategory.CACHE,
      'AI_SERVICE_UNAVAILABLE': ErrorCategory.AI_SERVICE,
      'FILE_NOT_FOUND': ErrorCategory.FILE,
      'USER_NOT_FOUND': ErrorCategory.USER,
      'CONFIGURATION_ERROR': ErrorCategory.CONFIGURATION
    };
    
    return categoryMap[error.code] || ErrorCategory.SYSTEM;
  }

  /**
   * 格式化错误响应
   */
  static formatErrorResponse(
    error: ModuleError,
    requestId?: string
  ): any {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
        severity: this.getErrorSeverity(error),
        category: this.getErrorSeverity(error)
      }
    };
  }

  /**
   * 处理错误并返回用户友好的消息
   */
  static getUserFriendlyMessage(error: ModuleError): string {
    const userMessages: Record<string, string> = {
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'NOT_FOUND': 'The requested resource was not found.',
      'UNAUTHORIZED': 'Please log in to access this resource.',
      'FORBIDDEN': 'You do not have permission to access this resource.',
      'NETWORK_ERROR': 'Network connection issue. Please try again.',
      'DATABASE_ERROR': 'Service temporarily unavailable. Please try again later.',
      'AI_SERVICE_UNAVAILABLE': 'Analysis service is temporarily unavailable.',
      'RATE_LIMITED': 'Too many requests. Please wait a moment and try again.',
      'TEST_NOT_FOUND': 'Test not found. Please check the test type.',
      'SESSION_EXPIRED': 'Your session has expired. Please start the test again.',
      'QUESTION_NOT_FOUND': 'Question not found. Please refresh and try again.'
    };
    
    return userMessages[error.code] || 'An unexpected error occurred. Please try again.';
  }

  /**
   * 记录错误日志
   */
  static logError(
    error: ModuleError,
    context?: Record<string, any>
  ): void {
    const logData = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      severity: this.getErrorSeverity(error),
      category: this.getErrorCategory(error),
      details: error.details,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    // 根据严重程度选择日志级别
    const severity = this.getErrorSeverity(error);
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        console.error('[CRITICAL ERROR]', logData);
        break;
      case ErrorSeverity.HIGH:
        console.error('[HIGH ERROR]', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('[MEDIUM ERROR]', logData);
        break;
      case ErrorSeverity.LOW:
        console.info('[LOW ERROR]', logData);
        break;
    }
    
    // TODO: 在生产环境中，发送到错误监控服务
    // TODO: 发送到日志聚合服务
  }

  /**
   * 处理错误并应用选项
   */
  static handleError(
    error: Error | ModuleError,
    options: ErrorHandlingOptions = {}
  ): ModuleError {
    // 如果已经是ModuleError，直接使用
    if (error instanceof ModuleError) {
          if (options.logError !== false) {
      this.logError(error);
    }
      return error;
    }
    
    // 如果是普通Error，转换为ModuleError
    const moduleError = this.createError(
      'INTERNAL_ERROR',
      error.message,
      500,
      { originalError: error.message, stack: error.stack }
    );
    
    if (options.logError !== false) {
      this.logError(moduleError);
    }
    
    return moduleError;
  }
}

// 导出便捷方法
export const createError = BaseErrorHandler.createError.bind(BaseErrorHandler);
export const createValidationError = BaseErrorHandler.createValidationError.bind(BaseErrorHandler);
export const createNotFoundError = BaseErrorHandler.createNotFoundError.bind(BaseErrorHandler);
export const createUnauthorizedError = BaseErrorHandler.createUnauthorizedError.bind(BaseErrorHandler);
export const createForbiddenError = BaseErrorHandler.createForbiddenError.bind(BaseErrorHandler);
export const createNetworkError = BaseErrorHandler.createNetworkError.bind(BaseErrorHandler);
export const createDatabaseError = BaseErrorHandler.createDatabaseError.bind(BaseErrorHandler);
export const createAIServiceError = BaseErrorHandler.createAIServiceError.bind(BaseErrorHandler);
export const createRateLimitError = BaseErrorHandler.createRateLimitError.bind(BaseErrorHandler);
export const isRetryable = BaseErrorHandler.isRetryable.bind(BaseErrorHandler);
export const getUserFriendlyMessage = BaseErrorHandler.getUserFriendlyMessage.bind(BaseErrorHandler);
export const handleError = BaseErrorHandler.handleError.bind(BaseErrorHandler);
