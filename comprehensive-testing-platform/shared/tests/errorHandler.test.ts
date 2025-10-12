/**
 * 错误处理工具测试
 */

import {
  BaseErrorHandler,
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
import { createMockContext, cleanup } from './setup';

describe('BaseErrorHandler', () => {
  // BaseErrorHandler 是一个静态类，不需要实例化

  afterEach(() => {
    cleanup();
  });

  describe('createError', () => {
    it('should create a ModuleError with correct properties', () => {
      const error = createError('VALIDATION_ERROR', 'Test message', 400);
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test message');
      expect((error as any).code).toBe('VALIDATION_ERROR');
      expect((error as any).statusCode).toBe(400);
    });

    it('should use default status code when not provided', () => {
      const error = createError('NETWORK_ERROR', 'Test message');
      
      expect((error as any).statusCode).toBe(500);
    });
  });

  describe('createValidationError', () => {
    it('should create validation error with field and value', () => {
      const error = createValidationError('Invalid input', 'email', 'test@');
      
      expect((error as any).code).toBe('VALIDATION_ERROR');
      expect((error as any).statusCode).toBe(400);
      expect((error as any).details).toEqual({ field: 'email', value: 'test@' });
    });

    it('should create validation error without field and value', () => {
      const error = createValidationError('Invalid input');
      
      expect((error as any).code).toBe('VALIDATION_ERROR');
      expect((error as any).details).toEqual({});
    });
  });

  describe('createNotFoundError', () => {
    it('should create not found error with resource and identifier', () => {
      const error = createNotFoundError('User', '123');
      
      expect((error as any).code).toBe('NOT_FOUND');
      expect((error as any).statusCode).toBe(404);
      expect(error.message).toBe('User with identifier \'123\' not found');
    });

    it('should create not found error without identifier', () => {
      const error = createNotFoundError('User');
      
      expect(error.message).toBe('User not found');
    });
  });

  describe('createUnauthorizedError', () => {
    it('should create unauthorized error with default message', () => {
      const error = createUnauthorizedError();
      
      expect((error as any).code).toBe('UNAUTHORIZED');
      expect((error as any).statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should create unauthorized error with custom message', () => {
      const error = createUnauthorizedError('Custom message');
      
      expect(error.message).toBe('Custom message');
    });
  });

  describe('createForbiddenError', () => {
    it('should create forbidden error with default message', () => {
      const error = createForbiddenError();
      
      expect((error as any).code).toBe('FORBIDDEN');
      expect((error as any).statusCode).toBe(403);
      expect(error.message).toBe('Access denied');
    });
  });

  describe('createNetworkError', () => {
    it('should create network error with default status code', () => {
      const error = createNetworkError('Network failed');
      
      expect((error as any).code).toBe('NETWORK_ERROR');
      expect((error as any).statusCode).toBe(500);
    });

    it('should create network error with custom status code', () => {
      const error = createNetworkError('Network failed', 502);
      
      expect((error as any).statusCode).toBe(502);
    });
  });

  describe('createDatabaseError', () => {
    it('should create database error', () => {
      const error = createDatabaseError('Database failed');
      
      expect((error as any).code).toBe('DATABASE_ERROR');
      expect((error as any).statusCode).toBe(500);
    });
  });

  describe('createAIServiceError', () => {
    it('should create AI service error', () => {
      const error = createAIServiceError('AI service failed');
      
      expect((error as any).code).toBe('AI_SERVICE_UNAVAILABLE');
      expect((error as any).statusCode).toBe(503);
    });
  });

  describe('createRateLimitError', () => {
    it('should create rate limit error without retry after', () => {
      const error = createRateLimitError('Rate limited');
      
      expect((error as any).code).toBe('RATE_LIMITED');
      expect((error as any).statusCode).toBe(429);
    });

    it('should create rate limit error with retry after', () => {
      const error = createRateLimitError('Rate limited', 60);
      
      expect((error as any).details).toEqual({ retryAfter: 60 });
    });
  });

  describe('isRetryable', () => {
    it('should return true for retryable errors', () => {
      const networkError = createNetworkError('Network failed');
      const rateLimitError = createRateLimitError('Rate limited');
      
      expect(isRetryable(networkError)).toBe(true);
      expect(isRetryable(rateLimitError)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const validationError = createValidationError('Invalid input');
      const notFoundError = createNotFoundError('Resource');
      
      expect(isRetryable(validationError)).toBe(false);
      expect(isRetryable(notFoundError)).toBe(false);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user-friendly message for known error codes', () => {
      const validationError = createValidationError('Invalid input');
      const notFoundError = createNotFoundError('Resource');
      
      expect(getUserFriendlyMessage(validationError)).toBe('Please check your input and try again.');
      expect(getUserFriendlyMessage(notFoundError)).toBe('The requested resource was not found.');
    });

    it('should return default message for unknown error codes', () => {
      const unknownError = createError('INTERNAL_ERROR', 'Unknown error');
      
      expect(getUserFriendlyMessage(unknownError)).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('handleError', () => {
    it('should handle ModuleError directly', () => {
      const moduleError = createValidationError('Invalid input');
      const result = handleError(moduleError);
      
      expect(result).toBe(moduleError);
    });

    it('should convert regular Error to ModuleError', () => {
      const regularError = new Error('Regular error');
      const result = handleError(regularError);
      
      expect(result).toBeInstanceOf(Error);
      expect((result as any).code).toBe('INTERNAL_ERROR');
    });

    it('should respect logError option', () => {
      const error = new Error('Test error');
      const result = handleError(error, { logError: false });
      
      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('BaseErrorHandler class', () => {
    it('should be a static class', () => {
      expect(BaseErrorHandler).toBeDefined();
      expect(typeof BaseErrorHandler.createError).toBe('function');
      expect(typeof BaseErrorHandler.createValidationError).toBe('function');
    });

    it('should handle errors with context', () => {
      const error = new Error('Test error');
      const context = createMockContext();
      
      const result = BaseErrorHandler.handleError(error, context);
      
      expect(result).toBeInstanceOf(Error);
    });

    it('should create module-specific errors', () => {
      const error = BaseErrorHandler.createError('INTERNAL_ERROR', 'Custom message', 418);
      
      expect((error as any).code).toBe('INTERNAL_ERROR');
      expect((error as any).statusCode).toBe(418);
    });
  });
});
