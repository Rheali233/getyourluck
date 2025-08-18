/**
 * 触摸友好的交互组件
 * 优化移动端触摸体验
 */

import React, { useState, useRef, useEffect } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface TouchFriendlyComponentsProps extends BaseComponentProps {
  children: React.ReactNode;
  onTap?: () => void;
  onLongPress?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export const TouchFriendlyComponents: React.FC<TouchFriendlyComponentsProps> = ({
  className,
  testId = 'touch-friendly-components',
  children,
  onTap,
  onLongPress,
  onSwipe,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  
  const elementRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout>();
  const isLongPressRef = useRef(false);

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartTime(Date.now());
    setStartPosition({ x: touch.clientX, y: touch.clientY });
    setCurrentPosition({ x: touch.clientX, y: touch.clientY });
    setIsPressed(true);
    isLongPressRef.current = false;

    // 长按检测
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress?.();
    }, 500);
  };

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setCurrentPosition({ x: touch.clientX, y: touch.clientY });
    
    // 如果移动距离过大，取消长按
    const deltaX = Math.abs(touch.clientX - startPosition.x);
    const deltaY = Math.abs(touch.clientY - startPosition.y);
    
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    }
  };

  // 触摸结束
  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPressed(false);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // 计算移动距离和方向
    const deltaX = currentPosition.x - startPosition.x;
    const deltaY = currentPosition.y - startPosition.y;
    const deltaTime = Date.now() - startTime;
    
    // 判断是否为滑动
    if (deltaTime < 300 && (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50)) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        onSwipe?.(deltaX > 0 ? 'right' : 'left');
      } else {
        // 垂直滑动
        onSwipe?.(deltaY > 0 ? 'down' : 'up');
      }
    } else if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // 点击
      if (!isLongPressRef.current) {
        onTap?.();
      }
    }
  };

  // 鼠标事件支持
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onTap?.();
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "touch-friendly-component select-none",
        isPressed && "scale-95 transition-transform duration-100",
        className
      )}
      data-testid={testId}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

// 触摸友好的按钮组件
export interface TouchFriendlyButtonProps extends BaseComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  className,
  testId = 'touch-friendly-button',
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const touchClasses = isPressed ? "scale-95" : "active:scale-95";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        touchClasses,
        className
      )}
      data-testid={testId}
      onClick={onClick}
      disabled={disabled || loading}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {children}
    </button>
  );
};

// 触摸友好的卡片组件
export interface TouchFriendlyCardProps extends BaseComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  interactive?: boolean;
}

export const TouchFriendlyCard: React.FC<TouchFriendlyCardProps> = ({
  className,
  testId = 'touch-friendly-card',
  children,
  onClick,
  hoverable = true,
  interactive = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const cardClasses = cn(
    "bg-white rounded-xl shadow-md transition-all duration-200",
    hoverable && "hover:shadow-lg",
    interactive && "cursor-pointer",
    isPressed && "scale-98 shadow-lg",
    className
  );

  const handleInteraction = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cardClasses}
      data-testid={testId}
      onClick={handleInteraction}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </div>
  );
};
