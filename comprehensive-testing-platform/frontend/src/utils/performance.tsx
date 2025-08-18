/**
 * 前端性能优化工具
 * 提供懒加载、代码分割和性能监控功能
 */

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { useState } from 'react';

// 性能监控接口
export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

// 懒加载组件包装器
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 rounded h-32"></div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// 图片懒加载Hook
export function useImageLazyLoading() {
  const loadImage = (src: string, placeholder?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      
      img.src = src;
    });
  };

  const preloadImage = (src: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };

  return { loadImage, preloadImage };
}

// 资源预加载
export function preloadResource(href: string, as: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  document.head.appendChild(link);
}

// 预加载关键资源
export function preloadCriticalResources(): void {
  // 预加载关键CSS
  preloadResource('/src/styles/critical.css', 'style');
  
  // 预加载关键字体
  preloadResource('/src/fonts/inter-var.woff2', 'font');
  
  // 预加载关键图片
  preloadResource('/src/assets/logo.svg', 'image');
}

// 性能监控
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics | null = null;
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 开始监控
  startMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      // 监控LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (this.metrics) {
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // 监控FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        if (this.metrics && firstEntry) {
          this.metrics.firstInputDelay = firstEntry.processingStart - firstEntry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // 监控CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        if (this.metrics) {
          this.metrics.cumulativeLayoutShift = clsValue;
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // 初始化指标
      this.initializeMetrics();
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  // 停止监控
  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // 初始化性能指标
  private initializeMetrics(): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    this.metrics = {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0
    };
  }

  // 获取性能指标
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  // 发送性能指标到服务器
  async sendMetrics(): Promise<boolean> {
    if (!this.metrics) return false;

    try {
      const response = await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'performance_metrics',
          data: this.metrics,
          timestamp: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send performance metrics:', error);
      return false;
    }
  }

  // 记录自定义性能标记
  mark(name: string): void {
    if (typeof window === 'undefined') return;
    performance.mark(name);
  }

  // 测量两个标记之间的时间
  measure(name: string, startMark: string, endMark: string): void {
    if (typeof window === 'undefined') return;
    try {
      performance.measure(name, startMark, endMark);
    } catch (error) {
      console.warn('Failed to measure performance:', error);
    }
  }

  // 获取测量结果
  getMeasurements(): PerformanceEntry[] {
    if (typeof window === 'undefined') return [];
    return performance.getEntriesByType('measure');
  }
}

// 代码分割工具
export function createCodeSplit<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  chunkName?: string
) {
  // 添加webpack chunk名称注释
  if (chunkName && typeof window !== 'undefined') {
    // @ts-ignore
    if (import.meta?.webpackChunkName) {
      // @ts-ignore
      import.meta.webpackChunkName = chunkName;
    }
  }

  return lazy(importFunc);
}

// 资源加载优化
export function optimizeResourceLoading(): void {
  if (typeof window === 'undefined') return;

  // 设置资源提示
  const resourceHints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
    { rel: 'preconnect', href: '//fonts.googleapis.com' },
    { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: 'anonymous' }
  ];

  resourceHints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
}

// 防抖Hook
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

// 节流Hook
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let lastCall = 0;

  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  }) as T;
}

// 虚拟滚动优化
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStartIndex, visibleEndIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStartIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
}

// 导出性能监控实例
export const performanceMonitor = PerformanceMonitor.getInstance();

// 默认导出
export default {
  createLazyComponent,
  useImageLazyLoading,
  preloadResource,
  preloadCriticalResources,
  PerformanceMonitor,
  performanceMonitor,
  createCodeSplit,
  optimizeResourceLoading,
  useDebounce,
  useThrottle,
  useVirtualScroll
};
