/**
 * 测试容器组件
 * 遵循统一开发标准的心理测试组件
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, LoadingSpinner, Alert } from '@/components/ui';
import { usePsychologyStore } from '../stores/usePsychologyStore';
import type { TestContainerProps, TestType, TestResult } from '../types';
import { cn } from '@/utils/classNames';

/**
 * 测试容器组件
 * 提供统一的测试界面框架，包括进度跟踪、题目展示和结果展示
 */
export const TestContainer: React.FC<TestContainerProps> = ({
  className,
  testId = 'test-container',
  testType,
  onTestComplete,
  onTestPause,
  ...props
}) => {
  const navigate = useNavigate();
  const {
    currentSession,
    isLoading,
    error,
    showResults,
    startTest,
    endTest,
    resetTest,
    setError,
  } = usePsychologyStore();

  const [isStarting, setIsStarting] = useState(false);

  // 启动测试
  const handleStartTest = async () => {
    try {
      setIsStarting(true);
      await startTest(testType);
    } catch (error) {
      setError(error instanceof Error ? error.message : '启动测试失败');
    } finally {
      setIsStarting(false);
    }
  };

  // 完成测试
  const handleCompleteTest = async (results: TestResult) => {
    try {
      await endTest();
      if (onTestComplete) {
        onTestComplete(results);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '完成测试失败');
    }
  };

  // 暂停测试
  const handlePauseTest = () => {
    if (onTestPause) {
      onTestPause();
    }
  };

  // 重置测试
  const handleResetTest = () => {
    resetTest();
  };

  // 返回首页
  const handleGoHome = () => {
    navigate('/');
  };

  // 如果正在启动测试
  if (isStarting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" isLoading={true} />
          <p className="mt-4 text-gray-600">正在准备测试...</p>
        </div>
      </div>
    );
  }

  // 如果正在加载
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" isLoading={true} />
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果有错误
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <Alert
            variant="error"
            title="测试加载失败"
            message={error}
          />
          <div className="mt-6 space-y-3">
            <Button
              onClick={() => setError(null)}
              className="w-full"
            >
              重试
            </Button>
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="w-full"
            >
              返回首页
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 如果没有活跃的测试会话，显示开始界面
  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {getTestTitle(testType)}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {getTestDescription(testType)}
              </p>
              <div className="flex justify-center">
                <div className="bg-primary-100 rounded-full p-3">
                  <span className="text-4xl">{getTestIcon(testType)}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                测试说明
              </h2>
              <div className="text-left text-gray-600 space-y-2">
                {getTestInstructions(testType).map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                测试信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {getTestQuestionCount(testType)}
                  </div>
                  <div className="text-sm text-gray-600">题目数量</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {getTestEstimatedTime(testType)}
                  </div>
                  <div className="text-sm text-gray-600">预计用时</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {getTestAccuracy(testType)}
                  </div>
                  <div className="text-sm text-gray-600">准确度</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="large"
                onClick={handleStartTest}
                className="w-full md:w-auto px-8"
              >
                开始测试
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full md:w-auto px-8"
                >
                  返回首页
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 如果显示结果，这里应该渲染结果组件
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                测试完成！
              </h1>
              <p className="text-gray-600">
                您的测试结果已生成，请查看详细分析。
              </p>
            </div>
            
            {/* TODO: 这里应该渲染具体的结果组件 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                结果展示组件开发中...
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleResetTest}
              >
                重新测试
              </Button>
              <Button
                onClick={handleGoHome}
              >
                返回首页
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 如果测试正在进行中，这里应该渲染题目组件
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* TODO: 这里应该渲染具体的题目组件 */}
        <Card className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              测试进行中
            </h2>
            <p className="text-gray-600">
              题目展示组件开发中...
            </p>
          </div>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handlePauseTest}
            >
              暂停测试
            </Button>
            <Button
              variant="outline"
              onClick={handleResetTest}
            >
              重置测试
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestContainer;

// 辅助函数：获取测试标题
function getTestTitle(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return 'MBTI性格测试';
    case 'phq9':
      return 'PHQ-9抑郁筛查';
    case 'eq':
      return '情商测试';
    case 'happiness':
      return '幸福指数评估';
    default:
      return '心理测试';
  }
}

// 辅助函数：获取测试描述
function getTestDescription(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return '通过60道精心设计的题目，深入了解您的性格类型，发现真实的自己';
    case 'phq9':
      return '专业的抑郁筛查量表，帮助您了解自己的心理健康状况';
    case 'eq':
      return '全面评估您的情商水平，提升情绪管理和人际交往能力';
    case 'happiness':
      return '科学评估您的生活满意度，找到提升幸福感的有效方法';
    default:
      return '专业的心理评估测试';
  }
}

// 辅助函数：获取测试图标
function getTestIcon(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return '🧠';
    case 'phq9':
      return '💙';
    case 'eq':
      return '💝';
    case 'happiness':
      return '😊';
    default:
      return '📋';
  }
}

// 辅助函数：获取测试说明
function getTestInstructions(testType: TestType): string[] {
  switch (testType) {
    case 'mbti':
      return [
        '本测试包含60道题目，预计用时15-20分钟',
        '请根据您的真实想法和感受选择最符合的选项',
        '没有对错之分，请诚实回答以获得准确结果',
        '测试过程中可以暂停，稍后继续完成',
        '完成后将获得详细的性格类型分析报告'
      ];
    case 'phq9':
      return [
        '本测试包含9道题目，预计用时5-10分钟',
        '请根据过去两周的真实感受选择最符合的选项',
        '测试结果仅供参考，不能替代专业医疗诊断',
        '如有需要，建议咨询专业心理医生',
        '您的隐私将得到充分保护'
      ];
    case 'eq':
      return [
        '本测试包含40道题目，预计用时15-20分钟',
        '请根据您的真实行为和感受选择最符合的选项',
        '测试将评估四个维度的情商水平',
        '完成后将获得个性化的提升建议',
        '建议定期测试以跟踪进步情况'
      ];
    case 'happiness':
      return [
        '本测试包含30道题目，预计用时10-15分钟',
        '请根据您对生活各方面的真实感受进行评分',
        '测试将评估五个生活领域的满意度',
        '完成后将获得具体的改善建议',
        '建议定期评估以保持生活平衡'
      ];
    default:
      return [
        '请根据题目要求认真作答',
        '测试过程中保持专注和诚实',
        '完成后将获得详细的分析报告'
      ];
  }
}

// 辅助函数：获取测试题目数量
function getTestQuestionCount(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return '60题';
    case 'phq9':
      return '9题';
    case 'eq':
      return '40题';
    case 'happiness':
      return '30题';
    default:
      return '未知';
  }
}

// 辅助函数：获取测试预计用时
function getTestEstimatedTime(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return '15-20分钟';
    case 'phq9':
      return '5-10分钟';
    case 'eq':
      return '15-20分钟';
    case 'happiness':
      return '10-15分钟';
    default:
      return '10-15分钟';
  }
}

// 辅助函数：获取测试准确度
function getTestAccuracy(testType: TestType): string {
  switch (testType) {
    case 'mbti':
      return '95%+';
    case 'phq9':
      return '90%+';
    case 'eq':
      return '88%+';
    case 'happiness':
      return '85%+';
    default:
      return '90%+';
  }
} 