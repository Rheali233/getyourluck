 /**
 * Psychology Test Container Component
 * 心理学模块的统一容器组件
 * 遵循统一开发标准的容器架构
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface PsychologyTestContainerProps extends BaseComponentProps {
  children: React.ReactNode;
}

export const PsychologyTestContainer: React.FC<PsychologyTestContainerProps> = ({
  children,
  className,
  testId = 'psychology-test-container',
  ...props
}) => {
  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 via-blue-200 to-blue-400", className)} 
      data-testid={testId}
      {...props}
    >
      {/* 内容区域 - 与Tarot模块保持一致的6xl容器宽度 */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
};
