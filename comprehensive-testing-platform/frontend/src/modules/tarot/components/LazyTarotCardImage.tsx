/**
 * Lazy Tarot Card Image Component
 * 塔罗牌图片懒加载组件
 * 优化图片加载性能
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/classNames';

interface LazyTarotCardImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // 是否优先加载
}

export const LazyTarotCardImage: React.FC<LazyTarotCardImageProps> = ({
  src,
  alt,
  className,
  placeholder = '/images/tarot/placeholder.jpg',
  onLoad,
  onError,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // 优先加载的图片立即显示
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

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

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // 图片加载完成处理
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // 图片加载错误处理
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100 rounded-lg',
        className
      )}
    >
      {/* 占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-xs text-purple-600 font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Image unavailable</p>
          </div>
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <img
          src={hasError ? placeholder : src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

/**
 * 塔罗牌图片网格组件
 * 用于显示多张塔罗牌图片
 */
interface TarotCardGridProps {
  cards: Array<{
    id: string;
    name_en: string;
    name_zh: string;
    image_url: string;
  }>;
  onCardClick?: (cardId: string) => void;
  className?: string;
}

export const TarotCardGrid: React.FC<TarotCardGridProps> = ({
  cards,
  onCardClick,
  className
}) => {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4', className)}>
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="group cursor-pointer transform transition-transform duration-200 hover:scale-105"
          onClick={() => onCardClick?.(card.id)}
        >
          <LazyTarotCardImage
            src={card.image_url}
            alt={`${card.name_en} - ${card.name_zh}`}
            className="aspect-[2/3] rounded-lg shadow-md group-hover:shadow-lg"
            priority={index < 6} // 前6张图片优先加载
          />
          <div className="mt-2 text-center">
            <p className="text-xs font-medium text-gray-900 truncate">
              {card.name_en}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {card.name_zh}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
