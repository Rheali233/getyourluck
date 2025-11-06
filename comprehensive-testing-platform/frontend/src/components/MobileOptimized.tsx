/**
 * 移动端优化组件
 * 提供移动端特定的优化和功能
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/classNames';
import { useMobileSEO } from '@/hooks/useMobileSEO';
import { MOBILE_TOUCH_TARGETS } from '@/config/mobileSEO';
import { getSiteOrigin } from '@/config/seo';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
  enableTouchOptimization?: boolean;
  enablePerformanceOptimization?: boolean;
  enableResponsiveImages?: boolean;
}

/**
 * 移动端优化包装器组件
 */
export const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  className,
  enableTouchOptimization = true,
  enablePerformanceOptimization = true,
  enableResponsiveImages = true,
}) => {
  const { touchSupport } = useMobileSEO();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟显示以优化性能
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const mobileClasses = cn(
    // 基础移动端优化
    'mobile-optimized',
    // 触摸优化
    enableTouchOptimization && touchSupport && 'touch-optimized',
    // 性能优化
    enablePerformanceOptimization && 'performance-optimized',
    // 响应式图片
    enableResponsiveImages && 'responsive-images',
    className
  );

  if (!isVisible) {
    return <div className="mobile-optimized-skeleton" />;
  }

  return (
    <div className={mobileClasses}>
      {children}
    </div>
  );
};

/**
 * 移动端触摸目标组件
 */
interface TouchTargetProps {
  children: React.ReactNode;
  minSize?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const TouchTarget: React.FC<TouchTargetProps> = ({
  children,
  minSize = MOBILE_TOUCH_TARGETS.minSize,
  className,
  onClick,
  disabled = false,
}) => {
  const { touchSupport } = useMobileSEO();

  return (
    <button
      className={cn(
        'touch-target',
        'flex items-center justify-center',
        'transition-all duration-200',
        'active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        touchSupport && 'hover:scale-105',
        className
      )}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

/**
 * 移动端响应式图片组件
 */
interface MobileImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export const MobileImage: React.FC<MobileImageProps> = ({
  src,
  alt,
  className,
  sizes = '100vw',
  priority = false,
  quality = 85,
}) => {
  const { isMobile, isTablet } = useMobileSEO();
  const [isLoaded, setIsLoaded] = useState(false);

  // 根据设备类型优化图片
  const getOptimizedSrc = () => {
    const url = new URL(src, getSiteOrigin());
    
    if (isMobile) {
      url.searchParams.set('w', '800');
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('f', 'webp');
    } else if (isTablet) {
      url.searchParams.set('w', '1200');
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('f', 'webp');
    }
    
    return url.toString();
  };

  return (
    <div className={cn('mobile-image-container', className)}>
      <img
        src={getOptimizedSrc()}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          'w-full h-auto',
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

/**
 * 移动端手势支持组件
 */
interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onLongPress?: () => void;
  className?: string;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  onLongPress,
  className,
}) => {
  const { touchSupport } = useMobileSEO();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!touchSupport) return;
    
    const touch = e.touches[0];
    const startTime = Date.now();
    
    if (touch) {
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: startTime
      });
    }

    // 长按检测
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress();
      }, 500);
      setLongPressTimer(timer as unknown as number);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchSupport || !touchStart) return;

    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.changedTouches[0];
    if (touch && touchStart) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;

    // 检测滑动
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;

    if (deltaTime < maxSwipeTime) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > minSwipeDistance && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < -minSwipeDistance && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // 垂直滑动
        if (deltaY > minSwipeDistance && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < -minSwipeDistance && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

      // 检测点击
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200 && onTap) {
        onTap();
      }

      setTouchStart(null);
    }
  };

  const handleTouchMove = () => {
    // 清除长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  if (!touchSupport) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn('gesture-handler', className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
};

/**
 * 移动端性能监控组件
 */
interface MobilePerformanceMonitorProps {
  onPerformanceUpdate?: (score: number, issues: string[]) => void;
  className?: string;
}

export const MobilePerformanceMonitor: React.FC<MobilePerformanceMonitorProps> = ({
  onPerformanceUpdate,
  className,
}) => {
  const { performance, recommendations } = useMobileSEO();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在移动端显示
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsVisible(isMobile);
  }, []);

  useEffect(() => {
    if (onPerformanceUpdate && performance.score > 0) {
      onPerformanceUpdate(performance.score, recommendations);
    }
  }, [performance.score, recommendations, onPerformanceUpdate]);

  if (!isVisible) return null;

  return (
    <div className={cn('mobile-performance-monitor', className)}>
      <div className="text-xs text-gray-500">
        Mobile Score: {performance.score}/100
      </div>
      {recommendations.length > 0 && (
        <div className="text-xs text-yellow-600">
          {recommendations.length} optimization(s) needed
        </div>
      )}
    </div>
  );
};

/**
 * 移动端导航组件
 */
interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onToggle,
  children,
  className,
}) => {
  const { isMobile } = useMobileSEO();

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('mobile-navigation', className)}>
      {/* 汉堡菜单按钮 */}
      <TouchTarget
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-2"
      >
        <div className={cn(
          'w-6 h-6 flex flex-col justify-center space-y-1',
          isOpen && 'transform rotate-45'
        )}>
          <div className={cn(
            'w-full h-0.5 bg-gray-800 transition-all duration-300',
            isOpen && 'transform rotate-90 translate-y-1'
          )} />
          <div className={cn(
            'w-full h-0.5 bg-gray-800 transition-all duration-300',
            isOpen && 'opacity-0'
          )} />
          <div className={cn(
            'w-full h-0.5 bg-gray-800 transition-all duration-300',
            isOpen && 'transform -rotate-90 -translate-y-1'
          )} />
        </div>
      </TouchTarget>

      {/* 导航菜单 */}
      <div className={cn(
        'fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div className={cn(
          'absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}>
          <div className="p-6 pt-20">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
