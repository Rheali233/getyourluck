/**
 * 测试页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card } from '@/components/ui';

interface TestPagesProps extends BaseComponentProps {}

export const TestPages: React.FC<TestPagesProps> = ({
  className,
  testId = 'test-pages',
  ...props
}) => {
  return (
    <div 
      className={className}
      data-testid={testId}
      {...props}
    >
      <Routes>
        <Route path="/" element={<TestCenter />} />
        <Route path="/psychology/*" element={<div>心理测试模块</div>} />
        <Route path="/astrology/*" element={<div>占星分析模块</div>} />
        <Route path="/tarot/*" element={<div>塔罗占卜模块</div>} />
        <Route path="/career/*" element={<div>职业发展模块</div>} />
        <Route path="/learning/*" element={<div>学习能力模块</div>} />
        <Route path="/relationship/*" element={<div>情感关系模块</div>} />
        <Route path="/numerology/*" element={<div>命理分析模块</div>} />
      </Routes>
    </div>
  );
};

const TestCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">测试中心</h1>
          <p className="text-xl text-gray-600">选择您感兴趣的测试类型</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 测试类型卡片将在后续任务中实现 */}
          <Card title="心理测试" description="性格分析与心理评估">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h3 className="font-semibold mb-2">心理测试</h3>
              <p className="text-sm text-gray-600">性格分析与心理评估</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};