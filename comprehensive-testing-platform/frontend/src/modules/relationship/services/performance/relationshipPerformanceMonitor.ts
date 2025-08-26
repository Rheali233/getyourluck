/**
 * Relationship Module Performance Monitor
 * Tracks performance metrics for relationship testing functionality
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface PerformanceReport {
  testType: string;
  sessionId: string;
  totalQuestions: number;
  averageAnswerTime: number;
  totalTestTime: number;
  aiAnalysisTime: number;
  memoryUsage?: number;
  networkRequests: number;
  errors: number;
  timestamp: number;
}

export class RelationshipPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private sessionStartTime: number = 0;
  private questionStartTime: number = 0;
  private answerTimes: number[] = [];
  private networkRequestCount: number = 0;
  private errorCount: number = 0;

  /**
   * Start monitoring a test session
   */
  startSession(testType: string, sessionId: string): void {
    this.sessionStartTime = performance.now();
    this.resetMetrics();
    
    this.recordMetric('session_start', performance.now(), 'timestamp', {
      testType,
      sessionId
    });
  }

  /**
   * Start monitoring a question
   */
  startQuestion(): void {
    this.questionStartTime = performance.now();
  }

  /**
   * Record answer submission
   */
  recordAnswer(): void {
    if (this.questionStartTime > 0) {
      const answerTime = performance.now() - this.questionStartTime;
      this.answerTimes.push(answerTime);
      
      this.recordMetric('answer_time', answerTime, 'milliseconds');
      this.questionStartTime = 0;
    }
  }

  /**
   * Record network request
   */
  recordNetworkRequest(): void {
    this.networkRequestCount++;
  }

  /**
   * Record error
   */
  recordError(): void {
    this.errorCount++;
  }

  /**
   * Record AI analysis time
   */
  recordAIAnalysisTime(startTime: number): void {
    const analysisTime = performance.now() - startTime;
    this.recordMetric('ai_analysis_time', analysisTime, 'milliseconds');
  }

  /**
   * Generate performance report
   */
  generateReport(testType: string, sessionId: string, totalQuestions: number): PerformanceReport {
    const totalTestTime = performance.now() - this.sessionStartTime;
    const averageAnswerTime = this.answerTimes.length > 0 
      ? this.answerTimes.reduce((sum, time) => sum + time, 0) / this.answerTimes.length 
      : 0;

    const report: PerformanceReport = {
      testType,
      sessionId,
      totalQuestions,
      averageAnswerTime,
      totalTestTime,
      aiAnalysisTime: 0, // Will be set separately
      memoryUsage: this.getMemoryUsage() || 0,
      networkRequests: this.networkRequestCount,
      errors: this.errorCount,
      timestamp: Date.now()
    };

    return report;
  }

  /**
   * Get memory usage (if available)
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, value: number, unit: string, context?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context: context || {}
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Reset metrics for new session
   */
  private resetMetrics(): void {
    this.answerTimes = [];
    this.networkRequestCount = 0;
    this.errorCount = 0;
    this.questionStartTime = 0;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Export singleton instance
export const relationshipPerformanceMonitor = new RelationshipPerformanceMonitor();
