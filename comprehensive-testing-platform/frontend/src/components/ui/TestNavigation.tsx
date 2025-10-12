/**
 * 通用测试导航组件
 * 适用于所有测试模块的导航
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestNavigationProps extends BaseComponentProps {
  moduleName: string;
  backPath: string;
  className?: string;
}

export const TestNavigation: React.FC<TestNavigationProps> = ({
  moduleName,
  backPath,
  className,
  testId = 'test-navigation',
  ...props
}) => {
  return (
    <nav 
      className={cn(
        "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to={backPath}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {moduleName}
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* 右侧区域预留，可以根据需要添加其他元素 */}
          </div>
        </div>
      </div>
    </nav>
  );
};
