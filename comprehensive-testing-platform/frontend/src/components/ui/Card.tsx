/**
 * 通用Card组件
 * 适用于所有测试模块的卡片展示
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface CardProps extends BaseComponentProps, React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  testId = 'card',
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300",
        className
      )}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
}; 