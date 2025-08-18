/**
 * 用户行为数据收集和分析组件
 * 负责收集用户交互数据，支持个性化推荐和内容优化
 */

import React, { useEffect, useRef, useCallback } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface UserBehaviorTrackerProps extends BaseComponentProps {
  sessionId?: string;
  userId?: string;
  pageType: 'homepage' | 'test' | 'blog' | 'search';
  autoTrack?: boolean;
  onDataCollected?: (data: UserBehaviorData) => void;
}

export interface UserBehaviorData {
  sessionId: string;
  userId?: string;
  pageType: string;
  timestamp: string;
  url: string;
  referrer: string;
  userAgent: string;
  screenResolution: string;
  timeOnPage: number;
  scrollDepth: number;
  clicks: ClickEvent[];
  interactions: InteractionEvent[];
  performance: PerformanceMetrics;
}

export interface ClickEvent {
  element: string;
  text: string;
  position: { x: number; y: number };
  timestamp: number;
}

export interface InteractionEvent {
  type: 'hover' | 'focus' | 'blur' | 'input' | 'submit';
  element: string;
  value?: string;
  timestamp: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

export const UserBehaviorTracker: React.FC<UserBehaviorTrackerProps> = ({
  className,
  testId = 'user-behavior-tracker',
  sessionId,
  userId,
  pageType,
  autoTrack = true,
  onDataCollected,
  ...props
}) => {
  const startTime = useRef<number>(Date.now());
  const scrollDepth = useRef<number>(0);
  const clicks = useRef<ClickEvent[]>([]);
  const interactions = useRef<InteractionEvent[]>([]);
  const performanceData = useRef<PerformanceMetrics | null>(null);
  const isTracking = useRef<boolean>(false);

  // 生成会话ID
  const getSessionId = useCallback((): string => {
    if (sessionId) return sessionId;
    
    let existingSessionId = localStorage.getItem('user_session_id');
    if (!existingSessionId) {
      existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_session_id', existingSessionId);
    }
    return existingSessionId;
  }, [sessionId]);

  // 收集性能指标
  const collectPerformanceMetrics = useCallback((): PerformanceMetrics => {
    if (performanceData.current) return performanceData.current;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0] as PerformanceEntry;

    const metrics: PerformanceMetrics = {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: lcpEntry?.startTime || 0
    };

    performanceData.current = metrics;
    return metrics;
  }, []);

  // 记录点击事件
  const handleClick = useCallback((event: MouseEvent) => {
    if (!isTracking.current) return;

    const target = event.target as HTMLElement;
    const clickEvent: ClickEvent = {
      element: target.tagName.toLowerCase(),
      text: target.textContent?.trim() || '',
      position: { x: event.clientX, y: event.clientY },
      timestamp: Date.now()
    };

    clicks.current.push(clickEvent);
  }, []);

  // 记录交互事件
  const handleInteraction = useCallback((event: Event) => {
    if (!isTracking.current) return;

    const target = event.target as HTMLElement;
    let interactionType: InteractionEvent['type'] = 'hover';

    switch (event.type) {
      case 'focus':
        interactionType = 'focus';
        break;
      case 'blur':
        interactionType = 'blur';
        break;
      case 'input':
        interactionType = 'input';
        break;
      case 'submit':
        interactionType = 'submit';
        break;
      default:
        return;
    }

    const interactionEvent: InteractionEvent = {
      type: interactionType,
      element: target.tagName.toLowerCase(),
      value: target instanceof HTMLInputElement ? target.value : undefined,
      timestamp: Date.now()
    };

    interactions.current.push(interactionEvent);
  }, []);

  // 记录滚动深度
  const handleScroll = useCallback(() => {
    if (!isTracking.current) return;

    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    
    scrollDepth.current = Math.max(scrollDepth.current, scrollPercentage);
  }, []);

  // 收集行为数据
  const collectBehaviorData = useCallback((): UserBehaviorData => {
    const currentTime = Date.now();
    const timeOnPage = currentTime - startTime.current;

    return {
      sessionId: getSessionId(),
      userId,
      pageType,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timeOnPage,
      scrollDepth: scrollDepth.current,
      clicks: [...clicks.current],
      interactions: [...interactions.current],
      performance: collectPerformanceMetrics()
    };
  }, [getSessionId, userId, pageType, collectPerformanceMetrics]);

  // 发送数据到服务器
  const sendBehaviorData = useCallback(async (data: UserBehaviorData) => {
    try {
      const response = await fetch('/api/homepage/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'user_behavior',
          data
        })
      });

      if (response.ok) {
        onDataCollected?.(data);
      }
    } catch (error) {
      console.error('Failed to send behavior data:', error);
    }
  }, [onDataCollected]);

  // 开始跟踪
  const startTracking = useCallback(() => {
    if (isTracking.current) return;

    isTracking.current = true;
    startTime.current = Date.now();

    // 添加事件监听器
    document.addEventListener('click', handleClick);
    document.addEventListener('focus', handleInteraction);
    document.addEventListener('blur', handleInteraction);
    document.addEventListener('input', handleInteraction);
    document.addEventListener('submit', handleInteraction);
    window.addEventListener('scroll', handleScroll);

    // 页面可见性变化时记录
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 页面隐藏时发送数据
        const data = collectBehaviorData();
        sendBehaviorData(data);
      }
    });
  }, [handleClick, handleInteraction, handleScroll, collectBehaviorData, sendBehaviorData]);

  // 停止跟踪
  const stopTracking = useCallback(() => {
    if (!isTracking.current) return;

    isTracking.current = false;

    // 移除事件监听器
    document.removeEventListener('click', handleClick);
    document.removeEventListener('focus', handleInteraction);
    document.removeEventListener('blur', handleInteraction);
    document.removeEventListener('input', handleInteraction);
    document.removeEventListener('submit', handleInteraction);
    window.removeEventListener('scroll', handleScroll);

    // 发送最终数据
    const data = collectBehaviorData();
    sendBehaviorData(data);
  }, [handleClick, handleInteraction, handleScroll, collectBehaviorData, sendBehaviorData]);

  // 手动触发数据收集
  const triggerDataCollection = useCallback(() => {
    const data = collectBehaviorData();
    sendBehaviorData(data);
    return data;
  }, [collectBehaviorData, sendBehaviorData]);

  // 组件挂载时开始跟踪
  useEffect(() => {
    if (autoTrack) {
      startTracking();
    }

    // 组件卸载时停止跟踪
    return () => {
      if (autoTrack) {
        stopTracking();
      }
    };
  }, [autoTrack, startTracking, stopTracking]);

  // 暴露方法给父组件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).userBehaviorTracker = {
        startTracking,
        stopTracking,
        triggerDataCollection,
        collectBehaviorData
      };
    }
  }, [startTracking, stopTracking, triggerDataCollection, collectBehaviorData]);

  // 这个组件不渲染任何UI，只负责数据收集
  return null;
};
