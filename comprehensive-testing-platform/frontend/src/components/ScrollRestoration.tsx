/**
 * 滚动恢复组件
 * 全局处理页面路由切换时的滚动行为
 */

import React from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface ScrollRestorationProps {
  /** 是否启用滚动恢复 */
  enabled?: boolean;
  /** 滚动行为 */
  behavior?: ScrollBehavior;
  /** 延迟时间（毫秒） */
  delay?: number;
  /** 是否在开发环境下显示调试信息 */
  debug?: boolean;
}

/**
 * 滚动恢复组件
 * 在路由切换时自动滚动到页面顶部
 */
export const ScrollRestoration: React.FC<ScrollRestorationProps> = ({
  enabled = true,
  behavior = 'smooth',
  delay = 100, // 稍微延迟确保页面渲染完成
  debug = process.env['NODE_ENV'] === 'development'
}) => {
  useScrollToTop({
    enabled,
    behavior,
    delay,
    debug
  });

  // 这个组件不渲染任何内容，只处理滚动逻辑
  return null;
};

/**
 * 默认滚动恢复组件
 * 使用推荐的配置
 */
export const DefaultScrollRestoration: React.FC = () => (
  <ScrollRestoration
    enabled={true}
    behavior="smooth"
    delay={100}
    debug={process.env['NODE_ENV'] === 'development'}
  />
);
