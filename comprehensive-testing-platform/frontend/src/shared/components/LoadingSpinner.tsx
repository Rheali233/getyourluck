/**
 * LoadingSpinner组件
 * 提供不同尺寸的加载动画
 */

import React from 'react';
import { cn } from '../../utils/classNames';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
  color = 'primary',
  text
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-500',
    white: 'text-white'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className={cn('mt-2 text-sm', colorClasses[color])}>
          {text}
        </span>
      )}
    </div>
  );
};

// 导出不同尺寸的预设组件
export const SmallSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner {...props} size="small" />
);

export const MediumSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner {...props} size="medium" />
);

export const LargeSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner {...props} size="large" />
);

// 导出默认组件
export default LoadingSpinner;
