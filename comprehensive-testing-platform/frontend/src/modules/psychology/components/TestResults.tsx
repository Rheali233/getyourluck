/**
 * 测试结果组件
 * 显示测试完成后的结果信息
 */

import React from 'react';
import type { TestResult } from '../types';
import { cn } from '@/utils/classNames';

interface TestResultsProps {
  results: TestResult;
  onReset: () => void;
  onBackToHome: () => void;
  className?: string;
  testId?: string;
}

export const TestResults: React.FC<TestResultsProps> = ({
  className,
  testId = 'test-results',
  results,
  onReset,
  onBackToHome,
  ...props
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50 py-8 px-4", className)} data-testid={testId} {...props}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              测试完成！
            </h1>
            <p className="text-gray-600">
              您的测试结果已生成，请查看详细分析。
            </p>
          </div>

          {/* 结果内容 */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-center">
                结果展示组件开发中...
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReset}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              重新测试
            </button>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
