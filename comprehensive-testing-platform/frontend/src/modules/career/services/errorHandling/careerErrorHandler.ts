/**
 * Career Module Error Handler
 * Centralized error handling for career testing functionality
 */

export enum CareerErrorType {
  TEST_START_FAILED = 'TEST_START_FAILED',
  QUESTION_LOAD_FAILED = 'QUESTION_LOAD_FAILED',
  ANSWER_SUBMISSION_FAILED = 'ANSWER_SUBMISSION_FAILED',
  TEST_SUBMISSION_FAILED = 'TEST_SUBMISSION_FAILED',
  AI_ANALYSIS_FAILED = 'AI_ANALYSIS_FAILED',
  RESULT_RETRIEVAL_FAILED = 'RESULT_RETRIEVAL_FAILED',
  FEEDBACK_SUBMISSION_FAILED = 'FEEDBACK_SUBMISSION_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface CareerError {
  type: CareerErrorType;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export class CareerErrorHandler {
  /**
   * Handle and process errors
   */
  static handleError(
    error: Error | string,
    type: CareerErrorType,
    context?: Record<string, any>
  ): CareerError {
    const careerError: CareerError = {
      type,
      message: typeof error === 'string' ? error : error.message,
      originalError: typeof error === 'string' ? new Error('String error') : error,
      context: context || {},
      timestamp: new Date().toISOString(),
      sessionId: context?.['sessionId'],
      userId: context?.['userId']
    };

    // Log the error
    this.logError(careerError);

    // Return user-friendly error
    return careerError;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: CareerError): string {
    switch (error.type) {
      case CareerErrorType.TEST_START_FAILED:
        return 'Unable to start the test. Please try again or contact support if the problem persists.';
      
      case CareerErrorType.QUESTION_LOAD_FAILED:
        return 'Unable to load test questions. Please check your internet connection and try again.';
      
      case CareerErrorType.ANSWER_SUBMISSION_FAILED:
        return 'Unable to save your answer. Your progress has been saved locally.';
      
      case CareerErrorType.TEST_SUBMISSION_FAILED:
        return 'Unable to complete the test. Please try again or contact support.';
      
      case CareerErrorType.AI_ANALYSIS_FAILED:
        return 'Unable to analyze your results at this time. Please try again later.';
      
      case CareerErrorType.RESULT_RETRIEVAL_FAILED:
        return 'Unable to retrieve your test results. Please check your session or try again.';
      
      case CareerErrorType.FEEDBACK_SUBMISSION_FAILED:
        return 'Unable to submit your feedback. This won\'t affect your test results.';
      
      case CareerErrorType.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      
      case CareerErrorType.NETWORK_ERROR:
        return 'Network connection issue. Please check your internet connection and try again.';
      
      case CareerErrorType.UNKNOWN_ERROR:
      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: CareerError): boolean {
    const recoverableTypes = [
      CareerErrorType.NETWORK_ERROR,
      CareerErrorType.VALIDATION_ERROR,
      CareerErrorType.QUESTION_LOAD_FAILED
    ];
    
    return recoverableTypes.includes(error.type);
  }

  /**
   * Log error for debugging
   */
  private static logError(error: CareerError): void {
    // In production, this would send to a logging service
    // For now, just console.error for development
    }

  /**
   * Create error from exception
   */
  static fromException(
    exception: Error,
    type: CareerErrorType = CareerErrorType.UNKNOWN_ERROR,
    context?: Record<string, any>
  ): CareerError {
    return this.handleError(exception, type, context);
  }

  /**
   * Create validation error
   */
  static validationError(
    message: string,
    field?: string,
    value?: any
  ): CareerError {
    const context: Record<string, any> = {};
    if (field) context['field'] = field;
    if (value !== undefined) context['value'] = value;
    
    return {
      type: CareerErrorType.VALIDATION_ERROR,
      message,
      context,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create network error
   */
  static networkError(
    message: string = 'Network request failed',
    statusCode?: number
  ): CareerError {
    const context: Record<string, any> = {};
    if (statusCode) context['statusCode'] = statusCode;
    
    return {
      type: CareerErrorType.NETWORK_ERROR,
      message,
      context,
      timestamp: new Date().toISOString()
    };
  }
}
