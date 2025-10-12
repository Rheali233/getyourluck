/**
 * 性能监控Hook
 * 用于监控页面性能指标，包括Core Web Vitals
 */

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  });

  useEffect(() => {
    // 监控LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // 监控FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // 监控CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // 监控FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // 监控TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ 
        ...prev, 
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart 
      }));
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  // 性能评分计算
  const getPerformanceScore = () => {
    let score = 100;
    
    // LCP评分 (目标: < 2.5s)
    if (metrics.lcp && metrics.lcp > 2500) {
      score -= Math.min(30, (metrics.lcp - 2500) / 100);
    }
    
    // FID评分 (目标: < 100ms)
    if (metrics.fid && metrics.fid > 100) {
      score -= Math.min(25, (metrics.fid - 100) / 10);
    }
    
    // CLS评分 (目标: < 0.1)
    if (metrics.cls && metrics.cls > 0.1) {
      score -= Math.min(25, (metrics.cls - 0.1) * 100);
    }
    
    return Math.max(0, Math.round(score));
  };

  // 性能建议
  const getPerformanceSuggestions = () => {
    const suggestions: string[] = [];
    
    if (metrics.lcp && metrics.lcp > 2500) {
      suggestions.push('优化LCP: 考虑压缩图片、使用CDN、优化关键资源加载');
    }
    
    if (metrics.fid && metrics.fid > 100) {
      suggestions.push('优化FID: 减少JavaScript执行时间、使用代码分割');
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      suggestions.push('优化CLS: 为图片设置尺寸、避免动态内容插入');
    }
    
    if (metrics.fcp && metrics.fcp > 1800) {
      suggestions.push('优化FCP: 减少阻塞渲染的资源、优化CSS加载');
    }
    
    return suggestions;
  };

  return {
    metrics,
    score: getPerformanceScore(),
    suggestions: getPerformanceSuggestions(),
  };
};

/**
 * 页面加载时间监控Hook
 */
export const usePageLoadTime = () => {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    const measureLoadTime = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        setLoadTime(loadTime);
      }
    };

    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
      return () => window.removeEventListener('load', measureLoadTime);
    }
  }, []);

  return loadTime;
};