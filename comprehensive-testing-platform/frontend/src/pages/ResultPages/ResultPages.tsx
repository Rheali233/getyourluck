/**
 * 结果页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card } from '@/components/ui';

interface ResultPagesProps extends BaseComponentProps {}

export const ResultPages: React.FC<ResultPagesProps> = ({
  className,
  testId = 'result-pages',
  ...props
}) => {
  return (
    <div 
      className={className}
      data-testid={testId}
      {...props}
    >
      <Routes>
        <Route path="/:sessionId" element={<TestResult />} />
      </Routes>
    </div>
  );
};

const TestResult: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">测试结果</h1>
          <p className="text-gray-600">您的测试结果将在这里显示</p>
        </div>
        
        <Card title="测试结果" description="测试结果组件将在后续任务中实现">
          <p className="text-center text-gray-500">
            测试结果组件将在后续任务中实现
          </p>
        </Card>
      </div>
    </div>
  );
};