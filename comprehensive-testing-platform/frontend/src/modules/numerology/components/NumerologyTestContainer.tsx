/**
 * Numerology Test Container Component
 * 命理分析模块的统一容器组件
 */

import React, { useEffect } from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface NumerologyTestContainerProps extends BaseComponentProps {
  children: React.ReactNode;
}

export const NumerologyTestContainer: React.FC<NumerologyTestContainerProps> = ({
  children,
  className,
  testId = 'numerology-test-container'
}) => {
  // Ensure page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center(--tw-gradient-stops))] from-red-600 via-red-700 to-red-900", className)} 
      data-testid={testId}
    >
      {/* 内容区域 - 与tarot模块保持一致的容器宽度 */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
};
