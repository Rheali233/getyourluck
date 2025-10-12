/**
 * Astrology Test Container Component
 * 星座模块的统一容器组件
 * 参照Tarot模块的TarotTestContainer设计
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface AstrologyTestContainerProps extends Omit<BaseComponentProps, 'className'> {
  children: React.ReactNode;
  className?: string | undefined;
}

export const AstrologyTestContainer: React.FC<AstrologyTestContainerProps> = ({
  children,
  className,
  testId = 'astrology-test-container',
  ...props
}) => {
  return (
    <div 
      className={cn("min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0B132B] via-[#1C2541] to-[#5F0F40]", className)} 
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
