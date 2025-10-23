/**
 * Tarot Performance Monitor
 * 塔罗牌页面性能监控组件
 * 监控加载时间和用户体验指标
 */

import React, { useEffect, useState } from 'react';
import { trackEvent } from '@/services/analyticsService';

interface PerformanceMetrics {
  pageLoadTime: number;
  dataLoadTime: number;
  imageLoadTime: number;
  firstCardRender: number;
  userInteractionTime: number;
}

interface TarotPerformanceMonitorProps {
  enabled?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const TarotPerformanceMonitor: React.FC<TarotPerformanceMonitorProps> = ({
  enabled = process.env['NODE_ENV'] === 'development',
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    dataLoadTime: 0,
    imageLoadTime: 0,
    firstCardRender: 0,
    userInteractionTime: 0
  });

  const [startTime] = useState(Date.now());
  const [dataLoadStartTime, setDataLoadStartTime] = useState<number | null>(null);
  const [imageLoadStartTime, setImageLoadStartTime] = useState<number | null>(null);
  const [firstCardRendered, setFirstCardRendered] = useState(false);

  // 监控页面加载时间
  useEffect(() => {
    if (!enabled) return;

    const handleLoad = () => {
      const loadTime = Date.now() - startTime;
      setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
      
      trackEvent({
        eventType: 'performance_metric',
        data: {
          metric: 'page_load_time',
          value: loadTime,
          page: 'tarot',
          unit: 'ms'
        }
      });
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [enabled, startTime]);

  // 监控数据加载时间
  const startDataLoad = () => {
    if (enabled && !dataLoadStartTime) {
      setDataLoadStartTime(Date.now());
    }
  };

  const endDataLoad = () => {
    if (enabled && dataLoadStartTime) {
      const loadTime = Date.now() - dataLoadStartTime;
      setMetrics(prev => ({ ...prev, dataLoadTime: loadTime }));
      
      trackEvent({
        eventType: 'performance_metric',
        data: {
          metric: 'data_load_time',
          value: loadTime,
          page: 'tarot',
          unit: 'ms'
        }
      });
    }
  };

  // 监控图片加载时间
  const startImageLoad = () => {
    if (enabled && !imageLoadStartTime) {
      setImageLoadStartTime(Date.now());
    }
  };

  const endImageLoad = () => {
    if (enabled && imageLoadStartTime) {
      const loadTime = Date.now() - imageLoadStartTime;
      setMetrics(prev => ({ ...prev, imageLoadTime: loadTime }));
      
      trackEvent({
        eventType: 'performance_metric',
        data: {
          metric: 'image_load_time',
          value: loadTime,
          page: 'tarot',
          unit: 'ms'
        }
      });
    }
  };

  // 监控首次卡片渲染
  const markFirstCardRender = () => {
    if (enabled && !firstCardRendered) {
      const renderTime = Date.now() - startTime;
      setMetrics(prev => ({ ...prev, firstCardRender: renderTime }));
      setFirstCardRendered(true);
      
      trackEvent({
        eventType: 'performance_metric',
        data: {
          metric: 'first_card_render',
          value: renderTime,
          page: 'tarot',
          unit: 'ms'
        }
      });
    }
  };

  // 监控用户交互时间
  const markUserInteraction = () => {
    if (enabled) {
      const interactionTime = Date.now() - startTime;
      setMetrics(prev => ({ ...prev, userInteractionTime: interactionTime }));
      
      trackEvent({
        eventType: 'performance_metric',
        data: {
          metric: 'user_interaction_time',
          value: interactionTime,
          page: 'tarot',
          unit: 'ms'
        }
      });
    }
  };

  // 更新指标回调
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  // 暴露方法给父组件使用
  React.useImperativeHandle(React.forwardRef(() => null), () => ({
    startDataLoad,
    endDataLoad,
    startImageLoad,
    endImageLoad,
    markFirstCardRender,
    markUserInteraction
  }));

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50 text-xs opacity-90 max-w-xs">
      <h3 className="font-bold mb-2 text-yellow-400">Tarot Performance</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Page Load:</span>
          <span className={metrics.pageLoadTime > 2000 ? 'text-red-400' : 'text-green-400'}>
            {metrics.pageLoadTime}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Data Load:</span>
          <span className={metrics.dataLoadTime > 1000 ? 'text-red-400' : 'text-green-400'}>
            {metrics.dataLoadTime}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Image Load:</span>
          <span className={metrics.imageLoadTime > 1500 ? 'text-red-400' : 'text-green-400'}>
            {metrics.imageLoadTime}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>First Card:</span>
          <span className={metrics.firstCardRender > 1500 ? 'text-red-400' : 'text-green-400'}>
            {metrics.firstCardRender}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Interaction:</span>
          <span className={metrics.userInteractionTime > 3000 ? 'text-red-400' : 'text-green-400'}>
            {metrics.userInteractionTime}ms
          </span>
        </div>
      </div>
    </div>
  );
};

// Hook for using performance monitor
export const useTarotPerformance = () => {
  const [monitorRef, setMonitorRef] = useState<any>(null);

  const startDataLoad = () => monitorRef?.startDataLoad();
  const endDataLoad = () => monitorRef?.endDataLoad();
  const startImageLoad = () => monitorRef?.startImageLoad();
  const endImageLoad = () => monitorRef?.endImageLoad();
  const markFirstCardRender = () => monitorRef?.markFirstCardRender();
  const markUserInteraction = () => monitorRef?.markUserInteraction();

  return {
    setMonitorRef,
    startDataLoad,
    endDataLoad,
    startImageLoad,
    endImageLoad,
    markFirstCardRender,
    markUserInteraction
  };
};
