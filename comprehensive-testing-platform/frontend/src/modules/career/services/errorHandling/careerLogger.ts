/**
 * Career Module Logger
 * Centralized logging for career testing functionality
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
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  testType?: string;
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  testType?: string;
  action?: string;
  [key: string]: any;
}

export class CareerLogger {
  private static instance: CareerLogger;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 100;

  private constructor() {}

  static getInstance(): CareerLogger {
    if (!CareerLogger.instance) {
      CareerLogger.instance = new CareerLogger();
    }
    return CareerLogger.instance;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Log test start event
   */
  logTestStart(testType: string, sessionId: string, userId?: string): void {
    const context: LogContext = {
      testType,
      sessionId,
      action: 'test_start'
    };
    if (userId) context.userId = userId;
    this.info('Career test started', context);
  }

  /**
   * Log test completion event
   */
  logTestCompletion(testType: string, sessionId: string, userId?: string, duration?: number): void {
    const context: LogContext = {
      testType,
      sessionId,
      action: 'test_completion'
    };
    if (userId) context.userId = userId;
    if (duration !== undefined) context['duration'] = duration;
    this.info('Career test completed', context);
  }

  /**
   * Log answer submission event
   */
  logAnswerSubmission(testType: string, sessionId: string, questionIndex: number, userId?: string): void {
    const context: LogContext = {
      testType,
      sessionId,
      action: 'answer_submission',
      questionIndex
    };
    if (userId) context.userId = userId;
    this.debug('Answer submitted', context);
  }

  /**
   * Log AI analysis event
   */
  logAIAnalysis(testType: string, sessionId: string, userId?: string, analysisType?: string): void {
    const context: LogContext = {
      testType,
      sessionId,
      action: 'ai_analysis'
    };
    if (userId) context.userId = userId;
    if (analysisType) context['analysisType'] = analysisType;
    this.info('AI analysis started', context);
  }

  /**
   * Log error event
   */
  logError(error: Error, context?: LogContext): void {
    this.error(`Career module error: ${error.message}`, {
      ...context,
      errorName: error.name,
      errorStack: error.stack,
      action: 'error_occurred'
    });
  }

  /**
   * Log performance metric
   */
  logPerformance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance metric: ${metric} = ${value}`, {
      ...context,
      action: 'performance_metric',
      metric,
      value
    });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(limit: number = 50): LogEntry[] {
    return this.logBuffer.slice(-limit);
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || {},
      userId: context?.userId || '',
      sessionId: context?.sessionId || '',
      testType: context?.testType || ''
    };

    // Add to buffer
    this.logBuffer.push(logEntry);
    
    // Maintain buffer size
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output for development
    const logMessage = `[Career Module] ${level}: ${message}`;
    const logData = context ? { ...context, timestamp: logEntry.timestamp } : { timestamp: logEntry.timestamp };

    switch (level) {
      case LogLevel.DEBUG:
        break;
      case LogLevel.INFO:
        break;
      case LogLevel.WARN:
        break;
      case LogLevel.ERROR:
        break;
    }

    // Production logging would be implemented here
  }
}

// Export singleton instance
export const careerLogger = CareerLogger.getInstance();
