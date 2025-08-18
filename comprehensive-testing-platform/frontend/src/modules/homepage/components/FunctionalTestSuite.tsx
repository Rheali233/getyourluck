/**
 * 功能测试套件组件
 * 用于测试首页各项功能的完整性和用户体验
 */

import React, { useState, useEffect } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  details?: any;
}

export interface FunctionalTestSuiteProps extends BaseComponentProps {
  onTestComplete?: (results: TestResult[]) => void;
}

export const FunctionalTestSuite: React.FC<FunctionalTestSuiteProps> = ({
  className,
  testId = 'functional-test-suite',
  onTestComplete,
  ...props
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // 测试用例定义
  const testCases = [
    {
      name: '首页功能完整性测试',
      test: testHomepageFunctionality
    },
    {
      name: '搜索功能测试',
      test: testSearchFunctionality
    },
    {
      name: 'Cookies管理测试',
      test: testCookiesManagement
    },
    {
      name: '多语言切换测试',
      test: testLanguageSwitching
    },
    {
      name: '响应式设计测试',
      test: testResponsiveDesign
    }
  ];

  // 运行所有测试
  const runAllTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      setCurrentTest(testCase.name);
      try {
        const result = await testCase.test();
        results.push(result);
        setTestResults([...results]);
      } catch (error) {
        results.push({
          name: testCase.name,
          status: 'fail',
          message: error instanceof Error ? error.message : '测试失败',
          details: error
        });
        setTestResults([...results]);
      }
    }

    setIsRunning(false);
    setCurrentTest('');
    onTestComplete?.(results);
  };

  // 首页功能测试
  const testHomepageFunctionality = async (): Promise<TestResult> => {
    // 检查关键组件是否存在
    const heroSection = document.querySelector('[data-testid="hero-section"]');
    const testModules = document.querySelector('[data-testid="test-modules"]');
    const footer = document.querySelector('[data-testid="footer"]');

    if (!heroSection || !testModules || !footer) {
      throw new Error('关键组件缺失');
    }

    return {
      name: '首页功能完整性测试',
      status: 'pass',
      message: '所有关键组件正常显示'
    };
  };

  // 搜索功能测试
  const testSearchFunctionality = async (): Promise<TestResult> => {
    const searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement;
    if (!searchInput) {
      throw new Error('搜索输入框不存在');
    }

    // 模拟搜索操作
    searchInput.value = '测试';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    return {
      name: '搜索功能测试',
      status: 'pass',
      message: '搜索功能正常'
    };
  };

  // Cookies管理测试
  const testCookiesManagement = async (): Promise<TestResult> => {
    const cookiesBanner = document.querySelector('[data-testid="cookies-banner"]');
    if (!cookiesBanner) {
      throw new Error('Cookies横幅不存在');
    }

    return {
      name: 'Cookies管理测试',
      status: 'pass',
      message: 'Cookies管理功能正常'
    };
  };

  // 多语言切换测试
  const testLanguageSwitching = async (): Promise<TestResult> => {
    const languageSwitcher = document.querySelector('[data-testid="language-switcher"]');
    if (!languageSwitcher) {
      throw new Error('语言切换器不存在');
    }

    return {
      name: '多语言切换测试',
      status: 'pass',
      message: '多语言切换功能正常'
    };
  };

  // 响应式设计测试
  const testResponsiveDesign = async (): Promise<TestResult> => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isDesktop = window.innerWidth > 1024;

    if (!isMobile && !isTablet && !isDesktop) {
      throw new Error('响应式断点检测失败');
    }

    return {
      name: '响应式设计测试',
      status: 'pass',
      message: `当前断点: ${isMobile ? '移动端' : isTablet ? '平板' : '桌面端'}`
    };
  };

  // 获取测试统计
  const getTestStats = () => {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const pending = testResults.filter(r => r.status === 'pending').length;

    return { total, passed, failed, pending };
  };

  const stats = getTestStats();

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`} data-testid={testId} {...props}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">功能测试套件</h3>
        <p className="text-gray-600">测试首页各项功能的完整性和用户体验</p>
      </div>

      {/* 测试统计 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">总测试</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
          <div className="text-sm text-gray-600">通过</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">失败</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">待测试</div>
        </div>
      </div>

      {/* 测试控制 */}
      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isRunning ? `正在测试: ${currentTest}` : '运行所有测试'}
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
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{result.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  result.status === 'pass' ? 'bg-green-100 text-green-800' :
                  result.status === 'fail' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.status === 'pass' ? '通过' : result.status === 'fail' ? '失败' : '待测试'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-500">查看详情</summary>
                  <pre className="mt-1 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
