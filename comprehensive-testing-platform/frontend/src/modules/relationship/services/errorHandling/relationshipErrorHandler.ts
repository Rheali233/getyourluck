/**
 * Relationship Module Error Handler
 * Centralized error handling for relationship testing functionality
 */

export enum RelationshipErrorType {
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

export interface RelationshipError {
  type: RelationshipErrorType;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export class RelationshipErrorHandler {
  /**
   * Handle and process errors
   */
  static handleError(
    error: Error | string,
    type: RelationshipErrorType,
    context?: Record<string, any>
  ): RelationshipError {
    const relationshipError: RelationshipError = {
      type,
      message: typeof error === 'string' ? error : error.message,
      originalError: typeof error === 'string' ? new Error('String error') : error,
      context: context || {},
      timestamp: new Date().toISOString(),
      sessionId: context?.['sessionId'],
      userId: context?.['userId']
    };

    // Log the error
    this.logError(relationshipError);

    // Return user-friendly error
    return relationshipError;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: RelationshipError): string {
    switch (error.type) {
      case RelationshipErrorType.TEST_START_FAILED:
        return 'Unable to start the test. Please try again or contact support if the problem persists.';
      
      case RelationshipErrorType.QUESTION_LOAD_FAILED:
        return 'Unable to load test questions. Please check your internet connection and try again.';
      
      case RelationshipErrorType.ANSWER_SUBMISSION_FAILED:
        return 'Unable to save your answer. Your progress has been saved locally.';
      
      case RelationshipErrorType.TEST_SUBMISSION_FAILED:
        return 'Unable to complete the test. Please try again or contact support.';
      
      case RelationshipErrorType.AI_ANALYSIS_FAILED:
        return 'Unable to analyze your results at this time. Please try again later.';
      
      case RelationshipErrorType.RESULT_RETRIEVAL_FAILED:
        return 'Unable to retrieve your test results. Please check your session or try again.';
      
      case RelationshipErrorType.FEEDBACK_SUBMISSION_FAILED:
        return 'Unable to submit your feedback. This won\'t affect your test results.';
      
      case RelationshipErrorType.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      
      case RelationshipErrorType.NETWORK_ERROR:
        return 'Network connection issue. Please check your internet connection and try again.';
      
      case RelationshipErrorType.UNKNOWN_ERROR:
      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverable(error: RelationshipError): boolean {
    const recoverableTypes = [
      RelationshipErrorType.NETWORK_ERROR,
      RelationshipErrorType.VALIDATION_ERROR,
      RelationshipErrorType.QUESTION_LOAD_FAILED
    ];
    
    return recoverableTypes.includes(error.type);
  }

  /**
   * Get retry recommendation
   */
  static getRetryRecommendation(error: RelationshipError): string | null {
    if (this.isRecoverable(error)) {
      return 'This error may be temporary. Please try again in a few moments.';
    }
    
    return null;
  }

  /**
   * Log error for debugging
   */
  private static logError(error: RelationshipError): void {
    // Production error tracking would be implemented here
  }
}
