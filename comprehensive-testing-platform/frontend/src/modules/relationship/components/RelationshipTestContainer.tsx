/**
 * Relationship Test Container Component
 * 关系测试模块的统一容器组件
 * 遵循统一开发标准的容器架构
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface RelationshipTestContainerProps extends BaseComponentProps {
  children: React.ReactNode;
}

export const RelationshipTestContainer: React.FC<RelationshipTestContainerProps> = ({
  children,
  className,
  testId = 'relationship-test-container',
  ...props
}) => {
  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center(--tw-gradient-stops))] from-pink-100 via-rose-200 to-pink-400", className)} 
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