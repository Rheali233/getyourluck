/**
 * 卡片组件
 * 遵循统一开发标准的UI组件
 */

import React from 'react';
import type { CardProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

/**
 * 卡片组件
 * 用于展示内容的容器组件，支持标题、描述和操作按钮
 */
export const Card: React.FC<CardProps> = ({
  className,
  testId = 'card',
  title,
  description,
  actions,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden",
        className
      )}
      data-testid={testId}
      {...props}
    >
      {(title || description) && (
        <div className="p-5 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      
      <div className="p-5">{children}</div>
      
      {actions && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card; 