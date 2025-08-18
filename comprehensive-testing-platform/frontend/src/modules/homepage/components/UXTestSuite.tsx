/**
 * 用户体验测试套件
 * 测试用户交互、界面响应和可用性
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface UXTestResult {
  category: string;
  testName: string;
  status: 'pass' | 'fail' | 'pending';
  score: number;
  feedback: string;
  suggestions: string[];
}

export interface UXTestSuiteProps extends BaseComponentProps {
  onTestComplete?: (results: UXTestResult[]) => void;
}

export const UXTestSuite: React.FC<UXTestSuiteProps> = ({
  className,
  testId = 'ux-test-suite',
  onTestComplete,
  ...props
}) => {
  const [testResults, setTestResults] = useState<UXTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // 用户体验测试用例
  const testButtonResponsiveness = async (): Promise<UXTestResult> => {
    const buttons = document.querySelectorAll('button');
    let responsiveButtons = 0;
    let totalButtons = buttons.length;

    buttons.forEach(button => {
      if (button.disabled === false && button.style.pointerEvents !== 'none') {
        responsiveButtons++;
      }
    });

    const score = Math.round((responsiveButtons / totalButtons) * 100);
    const status = score >= 80 ? 'pass' : score >= 60 ? 'pending' : 'fail';

    return {
      category: '交互响应',
      testName: '按钮点击响应测试',
      status,
      score,
      feedback: `${responsiveButtons}/${totalButtons} 个按钮响应正常`,
      suggestions: score < 80 ? ['检查按钮状态', '优化按钮交互'] : []
    };
  };

  const testPageLoadPerformance = async (): Promise<UXTestResult> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;
    
    const score = loadTime < 2000 ? 100 : loadTime < 4000 ? 80 : loadTime < 6000 ? 60 : 40;
    const status = score >= 80 ? 'pass' : score >= 60 ? 'pending' : 'fail';

    return {
      category: '加载性能',
      testName: '页面加载速度测试',
      status,
      score,
      feedback: `页面加载时间: ${Math.round(loadTime)}ms`,
      suggestions: loadTime > 2000 ? ['优化资源加载', '启用缓存策略'] : []
    };
  };

  const testTouchInteractions = async (): Promise<UXTestResult> => {
    const touchElements = document.querySelectorAll('[data-touch-friendly]');
    const hasTouchSupport = 'ontouchstart' in window;
    
    let score = 0;
    if (hasTouchSupport) {
      score = touchElements.length > 0 ? 100 : 60;
    } else {
      score = 80; // 桌面端不需要触摸支持
    }

    const status = score >= 80 ? 'pass' : 'pending';

    return {
      category: '移动端适配',
      testName: '触摸交互测试',
      status,
      score,
      feedback: `触摸支持: ${hasTouchSupport ? '是' : '否'}, 触摸友好元素: ${touchElements.length}个`,
      suggestions: score < 80 ? ['添加触摸友好属性', '优化移动端交互'] : []
    };
  };

  const testKeyboardNavigation = async (): Promise<UXTestResult> => {
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    let accessibleElements = 0;
    let totalElements = focusableElements.length;

    focusableElements.forEach(element => {
      if (element.getAttribute('tabindex') !== '-1') {
        accessibleElements++;
      }
    });

    const score = Math.round((accessibleElements / totalElements) * 100);
    const status = score >= 80 ? 'pass' : score >= 60 ? 'pending' : 'fail';

    return {
      category: '可访问性',
      testName: '键盘导航测试',
      status,
      score,
      feedback: `${accessibleElements}/${totalElements} 个元素支持键盘导航`,
      suggestions: score < 80 ? ['添加tabindex属性', '优化键盘导航顺序'] : []
    };
  };

  const testVisualFeedback = async (): Promise<UXTestResult> => {
    const interactiveElements = document.querySelectorAll('button, a, input');
    let feedbackElements = 0;
    let totalElements = interactiveElements.length;

    interactiveElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      if (styles.transition || styles.animation || element.classList.contains('hover:') || element.classList.contains('focus:')) {
        feedbackElements++;
      }
    });

    const score = Math.round((feedbackElements / totalElements) * 100);
    const status = score >= 80 ? 'pass' : score >= 60 ? 'pending' : 'fail';

    return {
      category: '视觉反馈',
      testName: '状态变化反馈测试',
      status,
      score,
      feedback: `${feedbackElements}/${totalElements} 个元素有视觉反馈`,
      suggestions: score < 80 ? ['添加hover效果', '优化状态变化动画'] : []
    };
  };

  const uxTests = [
    {
      category: '交互响应',
      testName: '按钮点击响应测试',
      test: testButtonResponsiveness
    },
    {
      category: '加载性能',
      testName: '页面加载速度测试',
      test: testPageLoadPerformance
    },
    {
      category: '移动端适配',
      testName: '触摸交互测试',
      test: testTouchInteractions
    },
    {
      category: '可访问性',
      testName: '键盘导航测试',
      test: testKeyboardNavigation
    },
    {
      category: '视觉反馈',
      testName: '状态变化反馈测试',
      test: testVisualFeedback
    }
  ];

  // 运行用户体验测试
  const runUXTests = async () => {
    setIsRunning(true);
    const results: UXTestResult[] = [];

    for (const testCase of uxTests) {
      setCurrentTest(testCase.testName);
      try {
        const result = await testCase.test();
        results.push(result);
        setTestResults([...results]);
      } catch (error) {
        results.push({
          category: testCase.category,
          testName: testCase.testName,
          status: 'fail',
          score: 0,
          feedback: error instanceof Error ? error.message : '测试失败',
          suggestions: ['检查测试环境', '重新运行测试']
        });
        setTestResults([...results]);
      }
    }

    setIsRunning(false);
    setCurrentTest('');
    onTestComplete?.(results);
  };

  // 获取测试统计
  const getTestStats = () => {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const pending = testResults.filter(r => r.status === 'pending').length;
    const averageScore = total > 0 ? Math.round(testResults.reduce((sum, r) => sum + r.score, 0) / total) : 0;

    return { total, passed, failed, pending, averageScore };
  };

  const stats = getTestStats();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`} data-testid={testId} {...props}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">用户体验测试套件</h3>
        <p className="text-gray-600">测试用户交互、界面响应和可用性</p>
      </div>

      {/* 测试统计 */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">总测试</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          <div className="text-sm text-gray-600">通过</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">待优化</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">失败</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.averageScore}</div>
          <div className="text-sm text-gray-600">平均分</div>
        </div>
      </div>

      {/* 测试控制 */}
      <div className="mb-6">
        <button
          onClick={runUXTests}
          disabled={isRunning}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
        >
          {isRunning ? `正在测试: ${currentTest}` : '运行用户体验测试'}
        </button>
      </div>

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">测试结果</h4>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.status === 'pass' ? 'bg-green-50 border-green-200' :
                result.status === 'fail' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{result.testName}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">分数: {result.score}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'pass' ? 'bg-green-100 text-green-800' :
                    result.status === 'fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status === 'pass' ? '通过' : result.status === 'fail' ? '失败' : '待优化'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{result.feedback}</p>
              {result.suggestions.length > 0 && (
                <div className="text-xs text-gray-500">
                  <strong>建议:</strong> {result.suggestions.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
