/**
 * 懒加载图片组件
 * 优化图片加载性能，支持WebP格式和懒加载
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string | undefined;
  placeholder?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  fallback,
  loading = 'lazy',
  onLoad,
  onError,
  sizes,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-50',
        isError && 'opacity-75',
        className
      )}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      sizes={sizes}
      {...props}
    />
  );
};

/**
 * 优化的图片组件，支持WebP格式
 */
interface OptimizedImageProps extends LazyImageProps {
  webpSrc?: string;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  webpSrc,
  alt,
  className,
  sizes = '100vw',
  ...props
}) => {
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    // 检测浏览器是否支持WebP
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    setSupportsWebP(canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
  }, []);

  const imageSrc = supportsWebP && webpSrc ? webpSrc : src;

  return (
    <picture>
      {webpSrc && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <LazyImage
        src={imageSrc}
        alt={alt}
        className={className}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
};
