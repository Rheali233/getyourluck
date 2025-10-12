/**
 * 通用测试控制组件
 * 适用于所有测试类型的控制按钮
 * 
 * @example
 * // 心理学测试使用
 * <TestControls 
 *   current={5} 
 *   total={64} 
 *   onPrevious={handlePrevious} 
 *   onNext={handleNext} 
 *   onComplete={handleComplete} 
 *   theme="psychology" 
 * />
 * 
 * // 职业测试使用
 * <TestControls 
 *   current={15} 
 *   total={60} 
 *   onPrevious={handlePrevious} 
 *   onNext={handleNext} 
 *   onComplete={handleComplete} 
 *   theme="career" 
 * />
 * 
 * @param current - 当前题目序号
 * @param total - 总题目数
 * @param onPrevious - 上一题回调
 * @param onNext - 下一题回调
 * @param onComplete - 完成测试回调
 * @param theme - 主题配置
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestControlsProps extends BaseComponentProps {
  current: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  theme?: string;
  canGoNext?: boolean;
  canComplete?: boolean;
  showReset?: boolean;
  onReset?: () => void;
}

export const TestControls: React.FC<TestControlsProps> = ({
  current,
  total,
  onPrevious,
  onNext,
  onComplete,
  theme = 'psychology',
  canGoNext = true,
  canComplete = true,
  showReset = true,
  onReset,
  className,
  testId = 'test-controls',
  ...props
}) => {
  const isFirstQuestion = current === 1;
  const isLastQuestion = current === total;

  return (
    <div 
      className={cn("flex justify-between items-center", className)}
      data-testid={testId}
      {...props}
    >
      {/* 左侧：上一题按钮 */}
      <button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        className={cn(
          "px-6 py-3 rounded-lg transition-colors",
          isFirstQuestion
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
      >
        Previous
      </button>

      {/* 右侧：下一题/完成按钮 */}
      <div className="flex space-x-4">
        {showReset && onReset && (
          <button
            onClick={onReset}
            className="px-4 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            Reset Test
          </button>
        )}

        {!isLastQuestion ? (
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={cn(
              "px-6 py-3 rounded-lg transition-colors",
              !canGoNext
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            Next
          </button>
        ) : (
          <button
            onClick={onComplete}
            disabled={!canComplete}
            className={cn(
              "px-8 py-3 rounded-lg font-medium transition-colors",
              !canComplete
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg"
            )}
          >
            Complete Test
          </button>
        )}
      </div>
    </div>
  );
};
