/**
 * 懒加载组件
 * 用于优化页面加载性能，按需加载组件
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface LazyLoadProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 懒加载包装器组件
 */
export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  fallback = <LoadingSpinner message="Loading..." />, 
  children 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

/**
 * 创建懒加载组件的工厂函数
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return React.forwardRef<any, any>((props, ref) => (
    <LazyLoad fallback={fallback}>
      <LazyComponent {...(props as any)} ref={ref as any} />
    </LazyLoad>
  ));
}

/**
 * 预定义的懒加载组件
 */
export const LazyMBTIResultDisplay = createLazyComponent(
  () => import('../modules/psychology/components/MBTIResultDisplay').then(m => ({ default: m.MBTIResultDisplay })),
  <LoadingSpinner message="Loading MBTI results..." />
);

export const LazyPHQ9ResultDisplay = createLazyComponent(
  () => import('../modules/psychology/components/PHQ9ResultDisplay').then(m => ({ default: m.PHQ9ResultDisplay })),
  <LoadingSpinner message="Loading PHQ-9 results..." />
);

export const LazyEQResultDisplay = createLazyComponent(
  () => import('../modules/psychology/components/EQResultDisplay').then(m => ({ default: m.EQResultDisplay })),
  <LoadingSpinner message="Loading EQ results..." />
);

export const LazyHappinessResultDisplay = createLazyComponent(
  () => import('../modules/psychology/components/HappinessResultDisplay').then(m => ({ default: m.HappinessResultDisplay })),
  <LoadingSpinner message="Loading happiness results..." />
);

export const LazyHollandResultDisplay = createLazyComponent(
  () => import('../modules/career/components/HollandResultDisplay').then(m => ({ default: m.HollandResultDisplay })),
  <LoadingSpinner message="Loading Holland results..." />
);

export const LazyDISCResultDisplay = createLazyComponent(
  () => import('../modules/career/components/DISCResultDisplay').then(m => ({ default: m.DISCResultDisplay })),
  <LoadingSpinner message="Loading DISC results..." />
);

export const LazyLeadershipResultDisplay = createLazyComponent(
  () => import('../modules/career/components/LeadershipResultDisplay').then(m => ({ default: m.LeadershipResultDisplay })),
  <LoadingSpinner message="Loading leadership results..." />
);

export const LazyVARKResultDisplay = createLazyComponent(
  () => import('../modules/learning-ability/components/VARKResultDisplay').then(m => ({ default: m.VARKResultDisplay })),
  <LoadingSpinner message="Loading VARK results..." />
);

// Raven removed

export const LazyLoveLanguageResultDisplay = createLazyComponent(
  () => import('../modules/relationship/components/LoveLanguageResultDisplay').then(m => ({ default: m.LoveLanguageResultDisplay })),
  <LoadingSpinner message="Loading love language results..." />
);

export const LazyLoveStyleResultDisplay = createLazyComponent(
  () => import('../modules/relationship/components/LoveStyleResultDisplay').then(m => ({ default: m.LoveStyleResultDisplay })),
  <LoadingSpinner message="Loading love style results..." />
);

export const LazyInterpersonalResultDisplay = createLazyComponent(
  () => import('../modules/relationship/components/InterpersonalResultDisplay').then(m => ({ default: m.InterpersonalResultDisplay })),
  <LoadingSpinner message="Loading interpersonal results..." />
);
