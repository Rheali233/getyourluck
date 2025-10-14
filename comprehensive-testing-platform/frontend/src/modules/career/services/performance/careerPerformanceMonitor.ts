/**
 * Career Module Performance Monitor
 * Tracks performance metrics for career testing functionality
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface PerformanceReport {
  sessionId: string;
  testType: string;
  startTime: number;
  endTime: number;
  duration: number;
  metrics: PerformanceMetric[];
  summary: {
    totalQuestions: number;
    averageResponseTime: number;
    cacheHitRate: number;
    aiAnalysisTime: number;
  };
}

export interface PerformanceThresholds {
  maxResponseTime: number;
  minCacheHitRate: number;
  maxAIAnalysisTime: number;
}

export class CareerPerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private sessions: Map<string, PerformanceReport> = new Map();
  private thresholds: PerformanceThresholds;

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    this.thresholds = {
      maxResponseTime: 2000, // 2 seconds
      minCacheHitRate: 0.7, // 70%
      maxAIAnalysisTime: 10000, // 10 seconds
      ...thresholds
    };
  }

  /**
   * Start performance monitoring for a session
   */
  startSession(sessionId: string, testType: string): void {
    const startTime = Date.now();
    
    this.sessions.set(sessionId, {
      sessionId,
      testType,
      startTime,
      endTime: 0,
      duration: 0,
      metrics: [],
      summary: {
        totalQuestions: 0,
        averageResponseTime: 0,
        cacheHitRate: 0,
        aiAnalysisTime: 0
      }
    });

    this.logMetric(sessionId, 'session_start', 0, 'ms', { testType });
  }

  /**
   * End performance monitoring for a session
   */
  endSession(sessionId: string): PerformanceReport | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const endTime = Date.now();
    const duration = endTime - session.startTime;

    session.endTime = endTime;
    session.duration = duration;

    // Calculate summary metrics
    this.calculateSessionSummary(sessionId);

    this.logMetric(sessionId, 'session_end', duration, 'ms');
    return session;
  }

  /**
   * Log a performance metric
   */
  logMetric(
    sessionId: string,
    name: string,
    value: number,
    unit: string,
    context?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context: context || {}
    };

    if (!this.metrics.has(sessionId)) {
      this.metrics.set(sessionId, []);
    }

    this.metrics.get(sessionId)!.push(metric);

    // Check thresholds and log warnings
    this.checkThresholds(sessionId, metric);
  }

  /**
   * Track question response time
   */
  trackQuestionResponse(sessionId: string, questionIndex: number, responseTime: number): void {
    this.logMetric(sessionId, 'question_response_time', responseTime, 'ms', {
      questionIndex,
      threshold: this.thresholds.maxResponseTime
    });
  }

  /**
   * Track cache performance
   */
  trackCachePerformance(sessionId: string, hit: boolean, responseTime: number): void {
    this.logMetric(sessionId, 'cache_performance', hit ? 1 : 0, 'boolean', {
      hit,
      responseTime,
      threshold: this.thresholds.minCacheHitRate
    });
  }

  /**
   * Track AI analysis performance
   */
  trackAIAnalysis(sessionId: string, analysisTime: number, success: boolean): void {
    this.logMetric(sessionId, 'ai_analysis_time', analysisTime, 'ms', {
      success,
      threshold: this.thresholds.maxAIAnalysisTime
    });
  }

  /**
   * Track test completion
   */
  trackTestCompletion(sessionId: string, totalQuestions: number, totalTime: number): void {
    this.logMetric(sessionId, 'test_completion', totalTime, 'ms', {
      totalQuestions,
      questionsPerMinute: (totalQuestions / (totalTime / 60000)).toFixed(2)
    });
  }

  /**
   * Get performance report for a session
   */
  getSessionReport(sessionId: string): PerformanceReport | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get all performance reports
   */
  getAllReports(): PerformanceReport[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Get performance summary for a test type
   */
  getTestTypeSummary(testType: string): {
    totalSessions: number;
    averageDuration: number;
    averageResponseTime: number;
    averageCacheHitRate: number;
    averageAIAnalysisTime: number;
  } {
    const typeSessions = Array.from(this.sessions.values())
      .filter(session => session.testType === testType);

    if (typeSessions.length === 0) {
      return {
        totalSessions: 0,
        averageDuration: 0,
        averageResponseTime: 0,
        averageCacheHitRate: 0,
        averageAIAnalysisTime: 0
      };
    }

    const totalDuration = typeSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalResponseTime = typeSessions.reduce((sum, session) => 
      sum + session.summary.averageResponseTime, 0);
    const totalCacheHitRate = typeSessions.reduce((sum, session) => 
      sum + session.summary.cacheHitRate, 0);
    const totalAIAnalysisTime = typeSessions.reduce((sum, session) => 
      sum + session.summary.aiAnalysisTime, 0);

    return {
      totalSessions: typeSessions.length,
      averageDuration: totalDuration / typeSessions.length,
      averageResponseTime: totalResponseTime / typeSessions.length,
      averageCacheHitRate: totalCacheHitRate / typeSessions.length,
      averageAIAnalysisTime: totalAIAnalysisTime / typeSessions.length
    };
  }

  /**
   * Check performance thresholds
   */
  private checkThresholds(_sessionId: string, metric: PerformanceMetric): void {
    switch (metric.name) {
      case 'question_response_time':
        if (metric.value > this.thresholds.maxResponseTime) {
          console.warn(`Question response time exceeded threshold: ${metric.value}ms`);
        }
        break;
      
      case 'cache_performance':
        // Cache hit rate is calculated over time, not per metric
        break;
      
      case 'ai_analysis_time':
        if (metric.value > this.thresholds.maxAIAnalysisTime) {
          console.warn(`AI analysis time exceeded threshold: ${metric.value}ms`);
        }
        break;
    }
  }

  /**
   * Calculate session summary metrics
   */
  private calculateSessionSummary(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const metrics = this.metrics.get(sessionId) || [];
    
    // Calculate average response time
    const responseTimeMetrics = metrics.filter(m => m.name === 'question_response_time');
    const totalResponseTime = responseTimeMetrics.reduce((sum, m) => sum + m.value, 0);
    session.summary.averageResponseTime = responseTimeMetrics.length > 0 
      ? totalResponseTime / responseTimeMetrics.length 
      : 0;

    // Calculate cache hit rate
    const cacheMetrics = metrics.filter(m => m.name === 'cache_performance');
    const hits = cacheMetrics.filter(m => m.context?.['hit'] === true).length;
    session.summary.cacheHitRate = cacheMetrics.length > 0 ? hits / cacheMetrics.length : 0;

    // Calculate AI analysis time
    const aiMetrics = metrics.filter(m => m.name === 'ai_analysis_time');
    const totalAITime = aiMetrics.reduce((sum, m) => sum + m.value, 0);
    session.summary.aiAnalysisTime = aiMetrics.length > 0 
      ? totalAITime / aiMetrics.length 
      : 0;

    // Set total questions (this should be set when starting the test)
    const completionMetric = metrics.find(m => m.name === 'test_completion');
    if (completionMetric) {
      session.summary.totalQuestions = completionMetric.context?.['totalQuestions'] || 0;
    }
  }

  /**
   * Clear old performance data
   */
  clearOldData(maxAge: number = 7 * 24 * 60 * 60 * 1000): void { // 7 days
    const cutoff = Date.now() - maxAge;
    
    // Clear old sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.startTime < cutoff) {
        this.sessions.delete(sessionId);
        this.metrics.delete(sessionId);
      }
    }
  }

  /**
   * Export performance data
   */
  exportData(): string {
    return JSON.stringify({
      sessions: Array.from(this.sessions.values()),
      metrics: Object.fromEntries(this.metrics),
      thresholds: this.thresholds
    }, null, 2);
  }

  /**
   * Reset all performance data
   */
  reset(): void {
    this.metrics.clear();
    this.sessions.clear();
  }
}

// Export singleton instance
export const careerPerformanceMonitor = new CareerPerformanceMonitor();
