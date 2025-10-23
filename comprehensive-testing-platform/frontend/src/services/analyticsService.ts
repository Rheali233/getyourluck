/**
 * Analytics service
 * 说明：统一埋点上报工具，默认上报到 /api/analytics/events
 */

import { apiClient } from './apiClient'
import type {
  AnalyticsEventPayload,
  AnalyticsEventType,
  AnalyticsRecordResponse,
} from '../../../shared/types'
import { getApiBaseUrl } from '../config/environment'

// 简单采样控制（可按需外部配置）
const DEFAULT_SAMPLING: Partial<Record<AnalyticsEventType, number>> = {
  click: 0.3, // 降低点击事件采样率到30%
  interaction: 0.2, // 降低交互事件采样率到20%
  scroll_depth: 0.1, // 降低滚动深度采样率到10%
  time_on_page: 0.1, // 降低页面停留时间采样率到10%
}

function shouldSample(eventType: AnalyticsEventType): boolean {
  const rate = DEFAULT_SAMPLING[eventType]
  if (rate === undefined) return true
  return Math.random() < rate
}

const EVENT_QUEUE_KEY = 'analytics_event_queue_v1'
const MAX_QUEUE_SIZE = 50
const FLUSH_INTERVAL_MS = 30000 // 增加队列刷新间隔到30秒
let flushTimer: number | null = null

function enqueueEvent(payload: AnalyticsEventPayload) {
  try {
    const raw = localStorage.getItem(EVENT_QUEUE_KEY)
    const queue: AnalyticsEventPayload[] = raw ? JSON.parse(raw) : []
    queue.push(payload)
    // 控制队列大小
    while (queue.length > MAX_QUEUE_SIZE) queue.shift()
    localStorage.setItem(EVENT_QUEUE_KEY, JSON.stringify(queue))
  } catch {}
}

async function flushQueue(): Promise<void> {
  try {
    const raw = localStorage.getItem(EVENT_QUEUE_KEY)
    const queue: AnalyticsEventPayload[] = raw ? JSON.parse(raw) : []
    if (!queue.length) return
    localStorage.removeItem(EVENT_QUEUE_KEY)
    const events = queue.map(e => ({
      eventType: e.eventType,
      sessionId: e.sessionId,
      pageUrl: e.pageUrl,
      referrer: e.referrer,
      timestamp: e.timestamp,
      userId: e.userId,
      device: e.device,
      performance: e.performance,
      data: e.data,
    }))
    const res = await apiClient.post<AnalyticsRecordResponse>('/api/analytics/events/batch', { events })
    void res
  } catch {
    // 失败不再回灌，避免无限增长；下次继续补偿
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = window.setInterval(() => { void flushQueue() }, FLUSH_INTERVAL_MS)
}

export async function trackEvent(payload: AnalyticsEventPayload): Promise<AnalyticsRecordResponse> {
  // Cookie 同意控制：未同意 analytics 则仅允许必要事件（如 error）
  try {
    const consentRaw = localStorage.getItem('cookie_consent')
    if (consentRaw) {
      const consent = JSON.parse(consentRaw) as { necessary?: boolean; analytics?: boolean }
      const analyticsAllowed = consent?.analytics !== false
      const isNecessary = payload.eventType === 'error'
      if (!analyticsAllowed && !isNecessary) {
        return { status: 'skipped' }
      }
    }
  } catch {
    // 若解析失败，按允许处理，避免阻断必要事件
  }
  if (!shouldSample(payload.eventType)) {
    return { status: 'skipped' }
  }

  // 与后端 /api/analytics/events 的契约对齐
  const body = {
    eventType: payload.eventType,
    sessionId: payload.sessionId,
    pageUrl: payload.pageUrl,
    referrer: payload.referrer,
    timestamp: payload.timestamp,
    userId: payload.userId,
    device: payload.device,
    performance: payload.performance,
    data: payload.data,
  }

  // 使用统一 apiClient（其会拼接 baseURL）；失败则入队批量上报
  try {
    const res = await apiClient.post<AnalyticsRecordResponse>('/api/analytics/events', body)
    return res.data ?? { status: 'recorded' }
  } catch (e) {
    enqueueEvent(payload)
    scheduleFlush()
    return { status: 'recorded' }
  }
}

export function buildBaseContext(): Pick<AnalyticsEventPayload, 'pageUrl' | 'referrer' | 'timestamp' | 'device'> {
  return {
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    timestamp: new Date().toISOString(),
    device: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      screen: typeof window !== 'undefined' && window.screen ? `${window.screen.width}x${window.screen.height}` : undefined,
      language: typeof navigator !== 'undefined' ? navigator.language : undefined,
      platform: typeof navigator !== 'undefined' ? navigator.platform : undefined,
    },
  }
}


