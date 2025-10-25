/**
 * GlobalAnalyticsTracker
 * 说明：全局页面级采集容器（懒加载使用），负责 page_view、time_on_page、scroll_depth 基本行为
 */

import React, { useEffect, useRef } from 'react'
import { trackEvent, buildBaseContext } from '@/services/analyticsService'
import type { AnalyticsEventPayload } from '../../../shared/types'

interface GlobalAnalyticsTrackerProps {
  sessionId?: string;
  enabled?: boolean;
  samplingRateHeartbeat?: number; // 心跳采样率（0-1）
  heartbeatIntervalMs?: number; // 心跳上报间隔
}

export const GlobalAnalyticsTracker: React.FC<GlobalAnalyticsTrackerProps> = ({
  sessionId,
  enabled = true,
  samplingRateHeartbeat = 0.1, // 降低采样率到10%
  heartbeatIntervalMs = 60000, // 增加心跳间隔到60秒
}) => {
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    // page_view
    const base = buildBaseContext()
    const pageView: AnalyticsEventPayload = {
      eventType: 'page_view',
      sessionId,
      ...base,
      data: {
        route: typeof window !== 'undefined' ? window.location.pathname : '',
      },
    }
    trackEvent(pageView)

    // scroll_depth（记录最大值）
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const percentage = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      if (percentage > maxScrollRef.current) {
        maxScrollRef.current = percentage
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // heartbeat: time_on_page + scroll_depth
    const sendHeartbeat = () => {
      if (Math.random() > samplingRateHeartbeat) return
      const baseCtx = buildBaseContext()
      trackEvent({
        eventType: 'time_on_page',
        sessionId,
        ...baseCtx,
        data: {
          ms: Date.now() - startTimeRef.current,
          scrollDepth: maxScrollRef.current,
        },
      })
    }
    timerRef.current = window.setInterval(sendHeartbeat, heartbeatIntervalMs)

    const onBeforeUnload = () => {
      // 尝试用 sendBeacon 兜底上报最后一次心跳
      try {
        const payload = {
          eventType: 'time_on_page',
          ...buildBaseContext(),
          data: { ms: Date.now() - startTimeRef.current, scrollDepth: maxScrollRef.current },
        } as any
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        navigator.sendBeacon?.('/analytics/events', blob)
      } catch {}
    }
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', onBeforeUnload)
      if (timerRef.current) window.clearInterval(timerRef.current)
      // 离开前最后一次 time_on_page
      const baseCtx = buildBaseContext()
      trackEvent({
        eventType: 'time_on_page',
        sessionId,
        ...baseCtx,
        data: {
          ms: Date.now() - startTimeRef.current,
          scrollDepth: maxScrollRef.current,
        },
      })
    }
  }, [enabled, sessionId, samplingRateHeartbeat, heartbeatIntervalMs])

  return null
}


