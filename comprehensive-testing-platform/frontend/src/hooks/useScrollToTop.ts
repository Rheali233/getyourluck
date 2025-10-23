/**
 * 页面滚动到顶部Hook
 * 在路由切换时自动滚动到页面顶部
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseScrollToTopOptions {
  /** 是否启用滚动到顶部 */
  enabled?: boolean;
  /** 滚动行为 */
  behavior?: ScrollBehavior;
  /** 延迟时间（毫秒） */
  delay?: number;
  /** 是否在开发环境下显示调试信息 */
  debug?: boolean;
}

/**
 * 页面滚动到顶部Hook
 * 在路由变化时自动滚动到页面顶部
 */
export const useScrollToTop = (options: UseScrollToTopOptions = {}) => {
  const {
    enabled = true,
    behavior = 'smooth',
    delay = 0,
    debug = process.env['NODE_ENV'] === 'development'
  } = options;

  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const scrollToTop = () => {
      if (debug) {
        console.log('Scrolling to top for route:', location.pathname);
      }

      // 使用requestAnimationFrame确保DOM更新完成
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior
        });
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [location.pathname, enabled, behavior, delay, debug]);
};

/**
 * 立即滚动到顶部（不等待路由变化）
 */
export const scrollToTopImmediate = (behavior: ScrollBehavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

/**
 * 滚动到指定元素
 */
export const scrollToElement = (
  elementId: string, 
  behavior: ScrollBehavior = 'smooth',
  offset: number = 0
) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      left: 0,
      behavior
    });
  }
};
