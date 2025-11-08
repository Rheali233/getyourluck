/**
 * 懒加载组件
 * 实现代码分割和按需加载
 */

import React, { Suspense, lazy, ComponentType, useState } from 'react';
import { cn } from '@/utils/classNames';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  className?: string;
  errorBoundary?: boolean;
}

// 加载中组件
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    'flex items-center justify-center p-8',
    className
  )}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Loading...</span>
  </div>
);

// 错误边界组件
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Error boundary implementation
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-8 text-red-600">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p>Failed to load component</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 懒加载组件包装器
export function createLazyComponent<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  // _options: LazyComponentProps = {}
) {
  const LazyComponent = lazy(importFunc);

  return React.forwardRef<any, T & LazyComponentProps>((props, ref) => {
    const { fallback, className, errorBoundary = true, ...restProps } = props as any;

    const component = (
      <Suspense fallback={fallback || <LoadingSpinner className={className} />}>
        <LazyComponent {...restProps} ref={ref} />
      </Suspense>
    );

    if (errorBoundary) {
      return (
        <LazyErrorBoundary fallback={fallback}>
          {component}
        </LazyErrorBoundary>
      );
    }

    return component;
  });
}

// 预加载函数
export function preloadComponent(importFunc: () => Promise<any>) {
  return () => {
    importFunc().catch(_error => {
      // Failed to preload component - handled silently in production
    });
  };
}

// 页面级别的懒加载组件 - 使用简单的React.lazy
export const LazyAboutPage = React.lazy(() => import('@/pages/AboutPage/AboutPage'));
export const LazyTestCenterPage = React.lazy(() => import('@/pages/TestCenter/TestCenterPage'));

// 预加载关键组件
export const preloadCriticalComponents = () => {
  // 预加载首页
  preloadComponent(() => import('@/modules/homepage/components/Homepage'))();
  
  // 预加载主要测试模块
  preloadComponent(() => import('@/modules/psychology/components/PsychologyHomePage'))();
  // 修复：注释掉 astrology 预加载，避免初始化顺序问题
  // preloadComponent(() => import('@/modules/astrology/components/AstrologyHomePage'))();
  preloadComponent(() => import('@/modules/tarot/components/TarotHomePage'))();
};

// 智能预加载Hook
export function useSmartPreload() {
  const [preloadedComponents, setPreloadedComponents] = useState<Set<string>>(new Set());

  const preloadComponent = (name: string, importFunc: () => Promise<any>) => {
    if (preloadedComponents.has(name)) return;

    importFunc()
      .then(() => {
        setPreloadedComponents(prev => new Set([...prev, name]));
      })
      .catch(_error => {
        // Failed to preload component - handled silently in production
      });
  };

  return { preloadComponent, preloadedComponents };
}
