/**
 * Analytics shared types
 * 说明：统一的埋点事件结构，供前后端共享使用（用户可见文本必须为英文）
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'time_on_page'
  | 'scroll_depth'
  | 'click'
  | 'interaction'
  | 'cta_click'
  | 'search_query'
  | 'test_start'
  | 'test_answer'
  | 'test_submit'
  | 'test_result_view'
  | 'performance'
  | 'error'
  | 'cookie_consent'
  | 'module_card_click'
  | 'article_click'
  | 'article_view'
  | 'module_visit'
  | 'test_card_click'
  | 'tool_use';

export interface AnalyticsDeviceInfo {
  userAgent?: string;
  screen?: string; // e.g. "390x844"
  language?: string;
  platform?: string;
}

export interface AnalyticsPerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  tti?: number;
}

/**
 * 客户端发送到后端的统一事件结构
 */
export interface AnalyticsEventPayload<TData = Record<string, unknown>> {
  eventType: AnalyticsEventType;
  sessionId?: string; // 推荐 UUID
  pageUrl: string;
  referrer?: string;
  timestamp: string; // ISO string
  userId?: string; // 建议匿名/哈希
  device?: AnalyticsDeviceInfo;
  performance?: AnalyticsPerformanceMetrics;
  data?: TData; // 事件特定负载
}

/**
 * 服务调用结果
 */
export interface AnalyticsRecordResponse {
  eventId?: string;
  status: 'recorded' | 'skipped';
}


