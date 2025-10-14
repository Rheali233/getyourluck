/**
 * Tarot Test Container Component
 * 塔罗牌模块的统一容器组件
 */

import React, { useEffect } from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface TarotTestContainerProps extends BaseComponentProps {
  children: React.ReactNode;
}

export const TarotTestContainer: React.FC<TarotTestContainerProps> = ({
  children,
  className,
  testId = 'tarot-test-container',
  ...props
}) => {
  // Ensure page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center(--tw-gradient-stops))] from-violet-200 via-violet-300 to-violet-500", className)} 
      data-testid={testId}
      {...props}
    >
      {/* 内容区域 - 与原型保持 6xl 容器宽度 */}
      <div className="max-w-6xl mx-auto py-8 px-4">
        {children}
      </div>
    </div>
  );
};
