/**
 * 图片优化组件
 * 支持懒加载、压缩、响应式图片和性能优化
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface OptimizedImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  placeholder?: string;
  lazy?: boolean;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  responsive?: boolean;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  imgClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  className,
  testId = 'optimized-image',
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  placeholder,
  lazy = true,
  priority = false,
  quality = 80,
  format = 'webp',
  responsive = true,
  fallback,
  onLoad,
  onError,
  imgClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 生成优化后的图片URL
  const generateOptimizedUrl = useCallback((imageSrc: string, targetWidth?: number, targetFormat?: string) => {
    if (!imageSrc) return '';
    
    // 如果是外部图片，直接返回
    if (imageSrc.startsWith('http') && !imageSrc.includes('cloudflare.com')) {
      return imageSrc;
    }

    // 如果是Cloudflare图片，使用图片优化服务
    if (imageSrc.includes('cloudflare.com') || imageSrc.includes('imagedelivery.net')) {
      const params = new URLSearchParams();
      if (targetWidth) params.append('w', targetWidth.toString());
      if (targetFormat) params.append('f', targetFormat);
      params.append('q', quality.toString());
      
      return `${imageSrc}?${params.toString()}`;
    }

    // 本地图片，使用Vite的图片优化
    return imageSrc;
  }, [quality]);

  // 生成响应式图片源
  const generateResponsiveSources = useCallback(() => {
    if (!responsive || !width) return [];

    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const sources = [];

    for (const breakpoint of breakpoints) {
      if (breakpoint <= width) {
        sources.push({
          srcSet: generateOptimizedUrl(src, breakpoint, format),
          media: `(max-width: ${breakpoint}px)`,
          sizes: `${breakpoint}px`
        });
      }
    }

    return sources;
  }, [src, width, format, responsive, generateOptimizedUrl]);

  // 处理图片加载
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  // 处理图片错误
  const handleImageError = useCallback(() => {
    setIsError(true);
    setIsLoaded(false);
    
    // 尝试使用fallback图片
    if (fallback && fallback !== src) {
      setCurrentSrc(fallback);
    }
    
    onError?.();
  }, [fallback, src, onError]);

  // 设置当前图片源
  useEffect(() => {
    if (isInView) {
      const optimizedSrc = generateOptimizedUrl(src, width, format);
      setCurrentSrc(optimizedSrc);
    }
  }, [src, width, format, isInView, generateOptimizedUrl]);

  // 设置懒加载观察器
  useEffect(() => {
    if (!lazy || priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, priority]);

  // 组件卸载时清理观察器
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 预加载图片（如果优先级高）
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = generateOptimizedUrl(src, width, format);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, width, format, generateOptimizedUrl]);

  // 渲染占位符
  if (!isInView && placeholder) {
    return (
      <div 
        className={cn(
          "bg-gray-200 animate-pulse rounded",
          className
        )}
        style={{ width, height }}
        data-testid={testId}
        {...props}
      >
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (isError && !fallback) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-500 rounded",
          className
        )}
        style={{ width, height }}
        data-testid={testId}
        {...props}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">🖼️</div>
                        <div className="text-sm">Image loading failed</div>
        </div>
      </div>
    );
  }

  // 渲染图片
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      {/* 响应式图片源 */}
      {responsive && generateResponsiveSources().length > 0 && (
        <picture>
          {generateResponsiveSources().map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              media={source.media}
              sizes={source.sizes}
            />
          ))}
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding="async"
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? 'opacity-100' : 'opacity-0',
              imgClassName
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      )}

      {/* 普通图片 */}
      {(!responsive || generateResponsiveSources().length === 0) && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* 加载指示器 */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};
