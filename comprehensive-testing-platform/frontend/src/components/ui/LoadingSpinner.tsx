/**
 * 加载旋转器组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { LoadingProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';

/**
 * 加载旋转器组件
 * 用于显示加载状态的动画组件，支持多种尺寸和文本
 */
export const LoadingSpinner: React.FC<LoadingProps> = ({
  className,
  testId = 'loading-spinner',
  isLoading = true,
  size = 'medium',
  text,
  ...props
}) => {
  if (!isLoading) {
    return null;
  }

  // 尺寸样式映射
  const sizeStyles: Record<NonNullable<LoadingProps['size']>, string> = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  // 文本尺寸映射
  const textSizeStyles: Record<NonNullable<LoadingProps['size']>, string> = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "text-center",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-primary-600",
          sizeStyles[size]
        )}
        role="status"
        aria-label="加载中"
      />
      
      {text && (
        <p className={cn(
          "mt-2 text-gray-600",
          textSizeStyles[size]
        )}>
          {text}
        </p>
      )}
      
      <span className="sr-only">加载中...</span>
    </div>
  );
};

export default LoadingSpinner; 