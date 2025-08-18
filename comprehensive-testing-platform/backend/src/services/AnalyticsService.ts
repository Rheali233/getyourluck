import { D1Database } from '@cloudflare/workers-types';

// 用户行为事件类型
export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  SEARCH = 'search',
  TEST_START = 'test_start',
  TEST_COMPLETE = 'test_complete',
  COOKIE_CONSENT = 'cookie_consent',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  USER_ENGAGEMENT = 'user_engagement'
}

// 事件数据接口
export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: EventType;
  eventData: Record<string, any>;
  timestamp: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenResolution: string;
  };
  performanceMetrics?: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
}

// 用户行为分析结果
export interface UserBehaviorAnalysis {
  sessionId: string;
  totalEvents: number;
  eventBreakdown: Record<EventType, number>;
  sessionDuration: number;
  pagesVisited: string[];
  searchQueries: string[];
  testEngagement: {
    testsStarted: number;
    testsCompleted: number;
    completionRate: number;
  };
  deviceUsage: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  engagementScore: number;
  lastActivity: string;
}

// 性能指标
export interface PerformanceMetrics {
  pageUrl: string;
  avgLoadTime: number;
  avgDomContentLoaded: number;
  avgFirstContentfulPaint: number;
  avgLargestContentfulPaint: number;
  sampleCount: number;
  p95LoadTime: number;
  p99LoadTime: number;
  lastUpdated: string;
}

// 搜索分析
export interface SearchAnalytics {
  query: string;
  searchCount: number;
  resultCount: number;
  clickThroughRate: number;
  avgTimeToClick: number;
  popularResults: Array<{
    contentId: string;
    contentType: string;
    clickCount: number;
  }>;
  lastSearched: string;
}

export class AnalyticsService {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * 记录用户行为事件
   */
  async recordEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await this.db.prepare(`
        INSERT INTO analytics_events (
          id, session_id, event_type, event_data, timestamp, page_url, 
          referrer, user_agent, ip_address, device_info, performance_metrics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        event.id,
        event.sessionId,
        event.eventType,
        JSON.stringify(event.eventData),
        event.timestamp,
        event.pageUrl,
        event.referrer || null,
        event.userAgent || null,
        event.ipAddress || null,
        event.deviceInfo ? JSON.stringify(event.deviceInfo) : null,
        event.performanceMetrics ? JSON.stringify(event.performanceMetrics) : null
      ).run();
    } catch (error) {
      console.error('记录分析事件失败:', error);
      throw new Error('无法记录分析事件');
    }
  }

  /**
   * 批量记录事件
   */
  async recordEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO analytics_events (
          id, session_id, event_type, event_data, timestamp, page_url, 
          referrer, user_agent, ip_address, device_info, performance_metrics
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const batch = events.map(event => stmt.bind(
        event.id,
        event.sessionId,
        event.eventType,
        JSON.stringify(event.eventData),
        event.timestamp,
        event.pageUrl,
        event.referrer || null,
        event.userAgent || null,
        event.ipAddress || null,
        event.deviceInfo ? JSON.stringify(event.deviceInfo) : null,
        event.performanceMetrics ? JSON.stringify(event.performanceMetrics) : null
      ));

      await this.db.batch(batch);
    } catch (error) {
      console.error('批量记录分析事件失败:', error);
      throw new Error('无法批量记录分析事件');
    }
  }

  /**
   * 获取用户行为分析
   */
  async getUserBehaviorAnalysis(sessionId: string, timeRange?: { start: string; end: string }): Promise<UserBehaviorAnalysis> {
    try {
      let timeFilter = '';
      let params: any[] = [sessionId];

      if (timeRange) {
        timeFilter = 'AND timestamp BETWEEN ? AND ?';
        params.push(timeRange.start, timeRange.end);
      }

      // 获取事件统计
      const eventsResult = await this.db.prepare(`
        SELECT event_type, COUNT(*) as count, 
               MIN(timestamp) as first_event,
               MAX(timestamp) as last_event
        FROM analytics_events 
        WHERE session_id = ? ${timeFilter}
        GROUP BY event_type
      `).bind(...params).all<{
        event_type: string;
        count: number;
        first_event: string;
        last_event: string;
      }>();

      // 获取页面访问记录
      const pagesResult = await this.db.prepare(`
        SELECT DISTINCT page_url 
        FROM analytics_events 
        WHERE session_id = ? AND event_type = 'page_view' ${timeFilter}
        ORDER BY timestamp
      `).bind(...params).all<{ page_url: string }>();

      // 获取搜索查询
      const searchResult = await this.db.prepare(`
        SELECT event_data 
        FROM analytics_events 
        WHERE session_id = ? AND event_type = 'search' ${timeFilter}
        ORDER BY timestamp
      `).bind(...params).all<{ event_data: string }>();

      // 计算会话时长
      const firstEvent = eventsResult.results?.[0]?.first_event;
      const lastEvent = eventsResult.results?.[0]?.last_event;
      const sessionDuration = firstEvent && lastEvent 
        ? new Date(lastEvent).getTime() - new Date(firstEvent).getTime()
        : 0;

      // 统计事件类型
      const eventBreakdown: Record<EventType, number> = {
        [EventType.PAGE_VIEW]: 0,
        [EventType.CLICK]: 0,
        [EventType.SEARCH]: 0,
        [EventType.TEST_START]: 0,
        [EventType.TEST_COMPLETE]: 0,
        [EventType.COOKIE_CONSENT]: 0,
        [EventType.ERROR]: 0,
        [EventType.PERFORMANCE]: 0,
        [EventType.USER_ENGAGEMENT]: 0
      };

      eventsResult.results?.forEach(event => {
        eventBreakdown[event.event_type as EventType] = event.count;
      });

      // 计算测试参与度
      const testsStarted = eventBreakdown[EventType.TEST_START];
      const testsCompleted = eventBreakdown[EventType.TEST_COMPLETE];
      const completionRate = testsStarted > 0 ? testsCompleted / testsStarted : 0;

      // 计算参与度分数
      const engagementScore = this.calculateEngagementScore(eventBreakdown, sessionDuration);

      return {
        sessionId,
        totalEvents: eventsResult.results?.reduce((sum, event) => sum + event.count, 0) || 0,
        eventBreakdown,
        sessionDuration,
        pagesVisited: pagesResult.results?.map(p => p.page_url) || [],
        searchQueries: searchResult.results?.map(s => JSON.parse(s.event_data).query || '') || [],
        testEngagement: {
          testsStarted,
          testsCompleted,
          completionRate
        },
        deviceUsage: {
          desktop: 0, // 需要从device_info中统计
          mobile: 0,
          tablet: 0
        },
        engagementScore,
        lastActivity: lastEvent || new Date().toISOString()
      };
    } catch (error) {
      console.error('获取用户行为分析失败:', error);
      throw new Error('无法获取用户行为分析');
    }
  }

  /**
   * 获取性能指标
   */
  async getPerformanceMetrics(pageUrl: string, timeRange?: { start: string; end: string }): Promise<PerformanceMetrics> {
    try {
      let timeFilter = '';
      let params: any[] = [pageUrl];

      if (timeRange) {
        timeFilter = 'AND timestamp BETWEEN ? AND ?';
        params.push(timeRange.start, timeRange.end);
      }

      const result = await this.db.prepare(`
        SELECT 
          AVG(CAST(json_extract(performance_metrics, '$.loadTime') AS REAL)) as avg_load_time,
          AVG(CAST(json_extract(performance_metrics, '$.domContentLoaded') AS REAL)) as avg_dom_content_loaded,
          AVG(CAST(json_extract(performance_metrics, '$.firstContentfulPaint') AS REAL)) as avg_first_contentful_paint,
          AVG(CAST(json_extract(performance_metrics, '$.largestContentfulPaint') AS REAL)) as avg_largest_contentful_paint,
          COUNT(*) as sample_count,
          MAX(timestamp) as last_updated
        FROM analytics_events 
        WHERE page_url = ? AND event_type = 'performance' 
          AND performance_metrics IS NOT NULL ${timeFilter}
      `).bind(...params).first<{
        avg_load_time: number;
        avg_dom_content_loaded: number;
        avg_first_contentful_paint: number;
        avg_largest_contentful_paint: number;
        sample_count: number;
        last_updated: string;
      }>();

      if (!result) {
        throw new Error('未找到性能数据');
      }

      // 计算百分位数
      const p95LoadTime = await this.calculatePercentile(pageUrl, 'loadTime', 95, timeRange);
      const p99LoadTime = await this.calculatePercentile(pageUrl, 'loadTime', 99, timeRange);

      return {
        pageUrl,
        avgLoadTime: result.avg_load_time || 0,
        avgDomContentLoaded: result.avg_dom_content_loaded || 0,
        avgFirstContentfulPaint: result.avg_first_contentful_paint || 0,
        avgLargestContentfulPaint: result.avg_largest_contentful_paint || 0,
        sampleCount: result.sample_count || 0,
        p95LoadTime,
        p99LoadTime,
        lastUpdated: result.last_updated || new Date().toISOString()
      };
    } catch (error) {
      console.error('获取性能指标失败:', error);
      throw new Error('无法获取性能指标');
    }
  }

  /**
   * 获取搜索分析
   */
  async getSearchAnalytics(timeRange?: { start: string; end: string }): Promise<SearchAnalytics[]> {
    try {
      let timeFilter = '';
      let params: any[] = [];

      if (timeRange) {
        timeFilter = 'WHERE timestamp BETWEEN ? AND ?';
        params.push(timeRange.start, timeRange.end);
      }

      const result = await this.db.prepare(`
        SELECT 
          json_extract(event_data, '$.query') as query,
          COUNT(*) as search_count,
          AVG(CAST(json_extract(event_data, '$.resultCount') AS INTEGER)) as avg_result_count,
          MAX(timestamp) as last_searched
        FROM analytics_events 
        ${timeFilter}
        AND event_type = 'search'
        GROUP BY json_extract(event_data, '$.query')
        ORDER BY search_count DESC
        LIMIT 100
      `).bind(...params).all<{
        query: string;
        search_count: number;
        avg_result_count: number;
        last_searched: string;
      }>();

      return result.results?.map(row => ({
        query: row.query || '',
        searchCount: row.search_count || 0,
        resultCount: Math.round(row.avg_result_count || 0),
        clickThroughRate: 0, // 需要计算点击率
        avgTimeToClick: 0, // 需要计算平均点击时间
        popularResults: [], // 需要获取热门结果
        lastSearched: row.last_searched || new Date().toISOString()
      })) || [];
    } catch (error) {
      console.error('获取搜索分析失败:', error);
      throw new Error('无法获取搜索分析');
    }
  }

  /**
   * 计算百分位数
   */
  private async calculatePercentile(pageUrl: string, metric: string, percentile: number, timeRange?: { start: string; end: string }): Promise<number> {
    try {
      let timeFilter = '';
      let params: any[] = [pageUrl];

      if (timeRange) {
        timeFilter = 'AND timestamp BETWEEN ? AND ?';
        params.push(timeRange.start, timeRange.end);
      }

      const result = await this.db.prepare(`
        SELECT CAST(json_extract(performance_metrics, '$.${metric}') AS REAL) as value
        FROM analytics_events 
        WHERE page_url = ? AND event_type = 'performance' 
          AND performance_metrics IS NOT NULL ${timeFilter}
        ORDER BY value
      `).bind(...params).all<{ value: number }>();

      if (!result.results || result.results.length === 0) {
        return 0;
      }

      const values = result.results.map(r => r.value).sort((a, b) => a - b);
      const index = Math.ceil((percentile / 100) * values.length) - 1;
      return values[Math.max(0, index)] || 0;
    } catch (error) {
      console.error('计算百分位数失败:', error);
      return 0;
    }
  }

  /**
   * 计算参与度分数
   */
  private calculateEngagementScore(eventBreakdown: Record<EventType, number>, sessionDuration: number): number {
    let score = 0;
    
    // 页面浏览权重
    score += eventBreakdown[EventType.PAGE_VIEW] * 10;
    
    // 点击权重
    score += eventBreakdown[EventType.CLICK] * 5;
    
    // 搜索权重
    score += eventBreakdown[EventType.SEARCH] * 15;
    
    // 测试参与权重
    score += eventBreakdown[EventType.TEST_START] * 20;
    score += eventBreakdown[EventType.TEST_COMPLETE] * 30;
    
    // 会话时长权重
    score += Math.min(sessionDuration / 1000 / 60, 10) * 5; // 每分钟5分，最多10分钟
    
    return Math.min(score, 100); // 最高100分
  }

  /**
   * 清理过期数据
   */
  async cleanupOldData(retentionDays: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await this.db.prepare(`
        DELETE FROM analytics_events 
        WHERE timestamp < ?
      `).bind(cutoffDate.toISOString()).run();

      return result.changes || 0;
    } catch (error) {
      console.error('清理过期分析数据失败:', error);
      return 0;
    }
  }
}
