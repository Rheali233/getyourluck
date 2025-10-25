/**
 * 优化图片组件
 * 支持懒加载、WebP格式、响应式图片
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';
import { getCdnBaseUrl } from '@/config/environment';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8vPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  lazy = true,
  priority = false,
  sizes = '100vw',
  quality: _quality = 85
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 懒加载逻辑
  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  // 监听src变化，重置状态
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // 生成WebP URL (暂时未使用)
  // const _getWebPUrl = (originalSrc: string): string => {
  //   // 这里可以集成图片优化服务，如Cloudinary、ImageKit等
  //   // 暂时返回原始URL
  //   return originalSrc;
  // };

  // 生成响应式图片URLs
  const getResponsiveUrls = (originalSrc: string) => {
    // 🔥 修复：为相对路径添加CDN前缀
    const processedSrc = originalSrc.startsWith('/') 
      ? `${getCdnBaseUrl()}${originalSrc}` 
      : originalSrc;
    
    const baseUrl = processedSrc.split('.')[0];
    const extension = processedSrc.split('.').pop();
    
    return {
      webp: `${baseUrl}.webp`,
      fallback: processedSrc,
      // 可以添加不同尺寸的URL
      sizes: {
        small: `${baseUrl}-400w.${extension}`,
        medium: `${baseUrl}-800w.${extension}`,
        large: `${baseUrl}-1200w.${extension}`
      }
    };
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    // 防止无限重试
    if (target.dataset['retry']) {
      setHasError(true);
      return;
    }
    target.dataset['retry'] = 'true';
    
    // 尝试fallback图片
    const fallbackUrl = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    } else {
      setHasError(true);
    }
  };

  const urls = getResponsiveUrls(src);

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ width, height }}
    >
      {/* 占位符 */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Failed to load</div>
        </div>
      )}

      {/* 实际图片 */}
      {isInView && !hasError && (
        <picture>
          {/* WebP格式 */}
          <source
            srcSet={urls.webp}
            type="image/webp"
            sizes={sizes}
          />
          
          {/* 响应式图片 */}
          <source
            media="(max-width: 400px)"
            srcSet={urls.sizes.small}
            sizes="400px"
          />
          <source
            media="(max-width: 800px)"
            srcSet={urls.sizes.medium}
            sizes="800px"
          />
          <source
            media="(min-width: 801px)"
            srcSet={urls.sizes.large}
            sizes="1200px"
          />
          
          {/* 回退图片 */}
          <img
            src={urls.fallback}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? 'lazy' : 'eager'}
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

// 图片懒加载Hook
export function useImageLazyLoad() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const loadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  return { loadImage, loadedImages };
}
