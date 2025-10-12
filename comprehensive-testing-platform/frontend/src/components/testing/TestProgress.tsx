/**
 * 通用测试进度组件
 * 适用于所有测试类型的进度展示
 * 
 * @example
 * // 心理学测试使用
 * <TestProgress 
 *   current={5} 
 *   total={64} 
 *   theme="psychology" 
 * />
 * 
 * // 职业测试使用
 * <TestProgress 
 *   current={15} 
 *   total={60} 
 *   theme="career" 
 * />
 * 
 * @param current - 当前题目序号
 * @param total - 总题目数
 * @param theme - 主题配置
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestProgressProps extends BaseComponentProps {
  current: number;
  total: number;
  theme?: string;
  showPercentage?: boolean;
  showProgressBar?: boolean;
}

export const TestProgress: React.FC<TestProgressProps> = ({
  current,
  total,
  theme = 'psychology',
  showPercentage = true,
  showProgressBar = true,
  className,
  testId = 'test-progress',
  ...props
}) => {
  const progress = (current / total) * 100;

  return (
    <div 
      className={cn("", className)}
      data-testid={testId}
      {...props}
    >
      {/* 进度信息 */}
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Question {current} of {total}</span>
        {showPercentage && <span>{Math.round(progress)}%</span>}
      </div>

      {/* 进度条 */}
      {showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              "bg-blue-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
