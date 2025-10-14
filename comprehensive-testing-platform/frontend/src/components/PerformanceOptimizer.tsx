/**
 * 性能优化组件
 * 提供首屏性能优化和错误处理
 */

import React, { useEffect, useRef, useState } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  timeout?: number;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  fallback = <div className="h-64 bg-gray-100 animate-pulse rounded-lg mx-4 my-8"></div>,
  delay = 500,
  timeout = 10000
}) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timeoutIdRef = useRef<number | null>(null);
  const delayIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 延迟渲染，让首屏内容先加载
    delayIdRef.current = window.setTimeout(() => {
      setIsReady(true);
      // 一旦内容就绪，确保不触发超时占位
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      setHasError(false);
    }, delay);

    // 超时处理（仅在尚未就绪时生效）
    timeoutIdRef.current = window.setTimeout(() => {
      // 只有在未就绪的情况下才标记为超时
      setHasError(prev => (!isReady ? true : prev));
    }, timeout);

    return () => {
      if (delayIdRef.current !== null) {
        clearTimeout(delayIdRef.current);
        delayIdRef.current = null;
      }
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, [delay, timeout, isReady]);

  if (hasError && !isReady) {
    return <div className="text-center text-gray-500 py-8">Loading content...</div>;
  }

  if (!isReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// 图片懒加载优化
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image unavailable</div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};
