/**
 * 通用测试准备布局组件
 * 适用于所有测试类型的准备界面
 * 
 * @example
 * // 心理学测试使用
 * <TestPreparationLayout testType="mbti" config={mbtiConfig} />
 * 
 * // 职业测试使用
 * <TestPreparationLayout testType="holland" config={hollandConfig} />
 * 
 * @param testType - 测试类型标识
 * @param config - 测试配置对象
 * @param children - 自定义内容
 */

import React from 'react';
import { TestNavigation } from '@/components/ui/TestNavigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/classNames';
import type { TestConfig } from '@/shared/configs/testConfigs';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestPreparationLayoutProps extends BaseComponentProps {
  testType: string;
  config: TestConfig;
  onStartTest: () => void;
  backPath?: string;
  backLabel?: string;
}

export const TestPreparationLayout: React.FC<TestPreparationLayoutProps> = ({
  // eslint-disable-next-line no-unused-vars
  testType, // 保留用于未来扩展（主题定制、测试类型特定逻辑等）
  config,
  onStartTest,
  backPath = '/',
  backLabel = 'Back to Home',
  className,
  testId = 'test-preparation-layout',
  ...props
}) => {


  return (
    <div 
      className={cn(
        "min-h-screen bg-blue-50",
        className
      )} 
      data-testid={testId} 
      {...props}
    >
      {/* 顶部导航 */}
      <TestNavigation 
        moduleName={backLabel}
        backPath={backPath}
      />
      
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {config.title}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* 测试信息卡片 */}
        <Card className="p-10 mb-10 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-3xl">
          <h2 className="text-2xl font-medium text-gray-900 mb-10 text-center">
            Test Preparation
          </h2>
          
          {/* 基础信息 */}
          <div className="mb-10">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Test Information</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 font-normal">Total Questions</span>
                  <span className="text-2xl font-medium text-gray-900">{config.questionCount}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 font-normal">Estimated Time</span>
                  <span className="text-lg font-medium text-gray-900">{config.duration} min</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 font-normal">Test Format</span>
                  <span className="text-lg font-medium text-gray-900">Multiple choice</span>
                </div>
              </div>
            </div>
          </div>

          {/* 测试说明 */}
          <div className="mb-10">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Test Instructions</h3>
            <div className="text-gray-600 space-y-4">
              {config.instructions.answering.map((instruction: string, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="leading-relaxed">{instruction}</p>
                </div>
              ))}
              {config.instructions.privacy.map((instruction: string, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 开始测试按钮 */}
          <div className="text-center pt-6">
            <Button
              onClick={onStartTest}
              className={cn(
                "px-12 py-4 text-base font-medium text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                "bg-gray-900 hover:bg-gray-800 active:bg-gray-700"
              )}
            >
              Start Test
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Clicking the button will begin the formal test, please ensure you have sufficient time to complete it
            </p>
          </div>
        </Card>

        {/* 理论基础 */}
        <Card className="p-10 mb-10 bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 rounded-3xl">
          <h3 className="text-lg font-medium text-gray-900 mb-8">Test Basis</h3>
          <div className="text-gray-600 space-y-6">
            {config.theoreticalBasis.map((section: { title: string; content: string[] }, index: number) => (
              <div key={index} className="p-6 bg-gray-25 rounded-2xl">
                <p className="leading-relaxed text-gray-700">
                  <span className="font-medium text-gray-900">{section.title}:</span> {section.content.join(' ')}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 注意事项 */}
        <Card className="p-10 mb-10 bg-amber-25 border border-amber-100 rounded-3xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-8">Important Disclaimers</h3>
          <div className="text-gray-600 space-y-6">
            {config.disclaimers.map((disclaimer: string, index: number) => (
              <div key={index} className="p-6 bg-amber-25 rounded-2xl border border-amber-100">
                <p className="flex items-start leading-relaxed text-gray-700">
                  <span className="text-base mr-4 flex-shrink-0">⚠️</span>
                  <span>{disclaimer}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 自定义内容区域 */}
        {props['children'] && (
          <div className="custom-content">
            {props['children']}
          </div>
        )}
      </div>
    </div>
  );
};
