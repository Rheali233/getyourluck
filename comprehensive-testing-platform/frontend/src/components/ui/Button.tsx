/**
 * 按钮组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { ButtonProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

/**
 * 按钮组件
 * 用于用户交互的主要操作元素，支持多种样式变体和尺寸
 */
export const Button: React.FC<ButtonProps> = ({
  className,
  testId = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children,
  ...props
}) => {
  // 变体样式
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  // 尺寸样式
  const sizeStyles = {
    small: 'text-xs px-2.5 py-1.5',
    medium: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
  };
  
  // 加载状态
  const LoadingIcon = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
  
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-colors ease-in-out duration-200',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      {loading && <LoadingIcon />}
      {children}
    </button>
  );
};

export default Button; 