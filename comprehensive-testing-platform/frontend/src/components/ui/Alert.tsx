/**
 * 警告组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { BaseComponentProps } from '../../types/componentTypes';
import { cn } from '../../utils/classNames';

export interface AlertProps extends BaseComponentProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  showIcon?: boolean;
}

/**
 * 警告组件
 * 用于显示不同类型的消息提示，支持成功、警告、错误和信息等状态
 */
export const Alert: React.FC<AlertProps> = ({
  className,
  testId = 'alert',
  variant = 'info',
  title,
  message,
  onClose,
  showIcon = true,
  ...props
}) => {
  // 变体样式映射
  const variantStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      closeButton: 'text-green-400 hover:bg-green-100',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      closeButton: 'text-yellow-400 hover:bg-yellow-100',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      closeButton: 'text-red-400 hover:bg-red-100',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      closeButton: 'text-blue-400 hover:bg-blue-100',
    },
  };

  // 图标映射
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'border rounded-md p-4',
        styles.container,
        className
      )}
      data-testid={testId}
      role="alert"
      {...props}
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0">
            <span className={cn('text-lg font-bold', styles.icon)}>
              {icons[variant]}
            </span>
          </div>
        )}
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {message}
          </div>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.closeButton
              )}
              onClick={onClose}
              aria-label="Close alert"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 