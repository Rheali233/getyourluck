import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  loadTime: number | null; // Page Load Time
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = process.env['NODE_ENV'] === 'development',
  onMetricsUpdate 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    loadTime: null,
  });

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const newMetrics: PerformanceMetrics = { ...metrics };

      // 测量页面加载时间
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        newMetrics.loadTime = loadTime;
        newMetrics.ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      }

      // 使用 Performance Observer API 测量 Core Web Vitals
      if ('PerformanceObserver' in window) {
        // First Contentful Paint
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              newMetrics.fcp = fcpEntry.startTime;
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (error) {
          console.warn('FCP measurement failed:', error);
        }

        // Largest Contentful Paint
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              newMetrics.lcp = lastEntry.startTime;
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP measurement failed:', error);
        }

        // First Input Delay
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (entry.processingStart && entry.startTime) {
                newMetrics.fid = entry.processingStart - entry.startTime;
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('FID measurement failed:', error);
        }

        // Cumulative Layout Shift
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            newMetrics.cls = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS measurement failed:', error);
        }
      }

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    };

    // 页面加载完成后测量
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // 定期更新指标
    const interval = setInterval(measurePerformance, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', measurePerformance);
    };
  }, [enabled, onMetricsUpdate]);

  // 开发环境下显示性能面板
  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-2 rounded-lg font-mono z-50 max-w-xs">
      <div className="font-bold mb-1">Performance Metrics</div>
      <div>FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}</div>
      <div>LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}</div>
      <div>FID: {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A'}</div>
      <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
      <div>TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}</div>
      <div>Load: {metrics.loadTime ? `${metrics.loadTime.toFixed(0)}ms` : 'N/A'}</div>
    </div>
  );
};

export default PerformanceMonitor;
