/**
 * 移动端SEO Hook
 * 提供移动端SEO优化和监控功能
 */

import { useState, useEffect, useCallback } from 'react';
import { MOBILE_BREAKPOINTS, MOBILE_PERFORMANCE_MONITORING } from '@/config/mobileSEO';

export interface MobileSEOState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  performance: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
    score: number;
  };
  recommendations: string[];
}

export const useMobileSEO = (): MobileSEOState => {
  const [state, setState] = useState<MobileSEOState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenSize: 'desktop',
    orientation: 'portrait',
    touchSupport: false,
    performance: {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      score: 0
    },
    recommendations: []
  });

  // 检测屏幕尺寸
  const detectScreenSize = useCallback(() => {
    const width = window.innerWidth;
    
    let screenSize: 'mobile' | 'tablet' | 'desktop';
    if (width < 768) {
      screenSize = 'mobile';
    } else if (width < 1024) {
      screenSize = 'tablet';
    } else {
      screenSize = 'desktop';
    }

    setState(prev => ({
      ...prev,
      isMobile: screenSize === 'mobile',
      isTablet: screenSize === 'tablet',
      isDesktop: screenSize === 'desktop',
      screenSize
    }));
  }, []);

  // 检测设备方向
  const detectOrientation = useCallback(() => {
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    setState(prev => ({ ...prev, orientation }));
  }, []);

  // 检测触摸支持
  const detectTouchSupport = useCallback(() => {
    const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setState(prev => ({ ...prev, touchSupport }));
  }, []);

  // 监控移动端性能
  const monitorMobilePerformance = useCallback(() => {
    // LCP监控
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          lcp: lastEntry.startTime
        }
      }));
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID监控
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setState(prev => ({
          ...prev,
          performance: {
            ...prev.performance,
            fid: entry.processingStart - entry.startTime
          }
        }));
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS监控
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setState(prev => ({
            ...prev,
            performance: {
              ...prev.performance,
              cls: clsValue
            }
          }));
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // FCP监控
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setState(prev => ({
            ...prev,
            performance: {
              ...prev.performance,
              fcp: entry.startTime
            }
          }));
        }
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // TTFB监控
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setState(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        }
      }));
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  // 生成移动端优化建议
  const generateRecommendations = useCallback((performance: MobileSEOState['performance']) => {
    const recommendations: string[] = [];
    const thresholds = MOBILE_PERFORMANCE_MONITORING.thresholds;

    if (performance.lcp && performance.lcp > thresholds.LCP) {
      recommendations.push('Optimize Largest Contentful Paint for mobile devices');
    }

    if (performance.fid && performance.fid > thresholds.FID) {
      recommendations.push('Reduce First Input Delay for better mobile interactivity');
    }

    if (performance.cls && performance.cls > thresholds.CLS) {
      recommendations.push('Minimize Cumulative Layout Shift on mobile');
    }

    if (performance.fcp && performance.fcp > thresholds.FCP) {
      recommendations.push('Improve First Contentful Paint for mobile loading');
    }

    if (performance.ttfb && performance.ttfb > thresholds.TTFB) {
      recommendations.push('Optimize server response time for mobile users');
    }

    return recommendations;
  }, []);

  // 计算性能分数
  const calculatePerformanceScore = useCallback((performance: MobileSEOState['performance']) => {
    let score = 100;
    const thresholds = MOBILE_PERFORMANCE_MONITORING.thresholds;

    if (performance.lcp && performance.lcp > thresholds.LCP) {
      score -= Math.min(30, (performance.lcp - thresholds.LCP) / 100);
    }

    if (performance.fid && performance.fid > thresholds.FID) {
      score -= Math.min(25, (performance.fid - thresholds.FID) / 10);
    }

    if (performance.cls && performance.cls > thresholds.CLS) {
      score -= Math.min(25, (performance.cls - thresholds.CLS) * 100);
    }

    if (performance.fcp && performance.fcp > thresholds.FCP) {
      score -= Math.min(20, (performance.fcp - thresholds.FCP) / 100);
    }

    return Math.max(0, Math.round(score));
  }, []);

  // 更新性能分数和建议
  useEffect(() => {
    const score = calculatePerformanceScore(state.performance);
    const recommendations = generateRecommendations(state.performance);
    
    setState(prev => ({
      ...prev,
      performance: {
        ...prev.performance,
        score
      },
      recommendations
    }));
  }, [state.performance.lcp, state.performance.fid, state.performance.cls, state.performance.fcp, state.performance.ttfb, calculatePerformanceScore, generateRecommendations]);

  // 初始化
  useEffect(() => {
    detectScreenSize();
    detectOrientation();
    detectTouchSupport();
    
    const cleanup = monitorMobilePerformance();

    const handleResize = () => {
      detectScreenSize();
      detectOrientation();
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        detectScreenSize();
        detectOrientation();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      cleanup?.();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [detectScreenSize, detectOrientation, detectTouchSupport, monitorMobilePerformance]);

  return state;
};

// 移动端SEO工具函数
export const mobileSEOUtils = {
  // 检查是否为移动设备
  isMobileDevice: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // 检查是否为触摸设备
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // 获取设备类型
  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  // 检查移动端友好性
  isMobileFriendly: (): boolean => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    // 基本检查
    return width >= 320 && width <= 1200 && aspectRatio > 0.5 && aspectRatio < 2;
  },

  // 生成移动端特定的meta标签
  generateMobileMetaTags: () => {
    return {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
      'theme-color': '#6366f1',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no'
    };
  },

  // 优化移动端图片
  optimizeImageForMobile: (src: string, width?: number): string => {
    const mobileWidth = width || 800;
    return `${src}?w=${mobileWidth}&q=85&f=webp`;
  },

  // 检查移动端性能
  checkMobilePerformance: async (): Promise<{
    score: number;
    issues: string[];
  }> => {
    const issues: string[] = [];
    let score = 100;

    // 检查页面加载时间
    const loadTime = performance.now();
    if (loadTime > 3000) {
      issues.push('Page load time exceeds 3 seconds');
      score -= 20;
    }

    // 检查图片优化
    const images = document.querySelectorAll('img');
    const unoptimizedImages = Array.from(images).filter(img => {
      const src = img.getAttribute('src') || '';
      return !src.includes('w=') && !src.includes('q=');
    });
    
    if (unoptimizedImages.length > 0) {
      issues.push(`${unoptimizedImages.length} images not optimized for mobile`);
      score -= 10;
    }

    // 检查触摸目标大小
    const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
    const smallTargets = Array.from(touchTargets).filter(target => {
      const rect = target.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    });

    if (smallTargets.length > 0) {
      issues.push(`${smallTargets.length} touch targets too small`);
      score -= 15;
    }

    return {
      score: Math.max(0, score),
      issues
    };
  }
};
