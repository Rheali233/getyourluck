/**
 * Career Test Container Component
 * 职业测试模块的统一容器组件
 * 遵循统一开发标准的容器架构，使用绿色主题
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface CareerTestContainerProps extends BaseComponentProps {
  children: React.ReactNode;
}

export const CareerTestContainer: React.FC<CareerTestContainerProps> = ({
  children,
  className,
  testId = 'career-test-container',
  ...props
}) => {
  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-100 via-emerald-200 to-teal-400", className)} 
      data-testid={testId}
      {...props}
    >
      {/* 内容区域 - 与Psychology模块保持一致的6xl容器宽度 */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
};