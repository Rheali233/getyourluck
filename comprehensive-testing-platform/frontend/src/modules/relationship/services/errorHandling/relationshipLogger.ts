/**
 * Relationship Module Logger
 * Centralized logging for relationship testing functionality
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  testType?: string;
}

export class RelationshipLogger {
  private static isDevelopment = process.env['NODE_ENV'] === 'development';
  private static logBuffer: LogEntry[] = [];
  private static maxBufferSize = 100;

  /**
   * Log debug message
   */
  static debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  static info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  static warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  static error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log test start event
   */
  static logTestStart(testType: string, sessionId: string, userId?: string): void {
    this.info('Test started', {
      testType,
      sessionId,
      userId,
      event: 'TEST_START'
    });
  }

  /**
   * Log test completion event
   */
  static logTestCompletion(testType: string, sessionId: string, userId?: string, duration?: number): void {
    this.info('Test completed', {
      testType,
      sessionId,
      userId,
      duration,
      event: 'TEST_COMPLETION'
    });
  }

  /**
   * Log answer submission event
   */
  static logAnswerSubmission(sessionId: string, questionId: string, answer: any, userId?: string): void {
    this.debug('Answer submitted', {
      sessionId,
      questionId,
      answer,
      userId,
      event: 'ANSWER_SUBMISSION'
    });
  }

  /**
   * Log AI analysis event
   */
  static logAIAnalysis(sessionId: string, testType: string, duration?: number, userId?: string): void {
    this.info('AI analysis completed', {
      sessionId,
      testType,
      duration,
      userId,
      event: 'AI_ANALYSIS'
    });
  }

  /**
   * Log user feedback event
   */
  static logUserFeedback(sessionId: string, feedback: 'like' | 'dislike', userId?: string): void {
    this.info('User feedback received', {
      sessionId,
      feedback,
      userId,
      event: 'USER_FEEDBACK'
    });
  }

  /**
   * Get log buffer
   */
  static getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  static clearLogBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs for debugging
   */
  static exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  /**
   * Internal logging method
   */
  private static log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      context: context || {},
      timestamp: new Date().toISOString()
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console logging in development
    if (this.isDevelopment) {
      const logMethod = level === LogLevel.ERROR ? 'error' : 
                       level === LogLevel.WARN ? 'warn' : 
                       level === LogLevel.INFO ? 'info' : 'log';
      
      console[logMethod](`[${level}] ${message}`, context || '');
    }

    // TODO: Send to logging service in production
    // TODO: Send to analytics service
  }
}
