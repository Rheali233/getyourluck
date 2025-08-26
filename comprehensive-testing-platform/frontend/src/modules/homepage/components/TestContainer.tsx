import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestContainerProps extends BaseComponentProps {
  testType?: string;
}

export const TestContainer: React.FC<TestContainerProps> = ({
  className,
  testId = 'test-container',
  testType
}) => {
  const navigate = useNavigate();

  // 开始测试
  const handleStartTest = () => {
    if (testType) {
      // 开始测试逻辑
    }
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className={`test-container ${className}`} data-testid={testId}>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">准备开始测试</h2>
        <p className="text-gray-600 mb-8">点击下方按钮开始你的心理测试之旅</p>
        <button
          onClick={handleStartTest}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          开始测试
        </button>
        <button
          onClick={handleBackToHome}
          className="ml-4 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};
