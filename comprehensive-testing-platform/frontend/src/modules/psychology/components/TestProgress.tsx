/**
 * 测试进度组件
 * 显示当前测试的进度信息
 */

import React from 'react';
import type { TestProgressProps } from '../types';
import { cn } from '@/utils/classNames';

export const TestProgress: React.FC<TestProgressProps> = ({
  className,
  testId = 'test-progress',
  current,
  total,
  progress,
  timeElapsed,
  estimatedTimeRemaining,
  ...props
}) => {
  return (
    <div className={cn("bg-white shadow-sm border-b", className)} data-testid={testId} {...props}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* 进度信息 */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              题目 {current} / {total}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(progress)}%
            </div>
          </div>

          {/* 进度条 */}
          <div className="flex-1 max-w-md">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 时间信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {timeElapsed > 0 && (
              <div>已用时: {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, '0')}</div>
            )}
            {estimatedTimeRemaining > 0 && (
              <div>预计剩余: {Math.floor(estimatedTimeRemaining / 60)}:{String(estimatedTimeRemaining % 60).padStart(2, '0')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
