/**
 * 测试容器组件
 * 遵循统一开发标准的心理测试组件
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { usePsychologyStore } from '../stores/usePsychologyStore';
import { QuestionDisplay } from './QuestionDisplay';
import { TestProgress } from './TestProgress';
import { TestResults } from './TestResults';

export interface TestContainerProps extends BaseComponentProps {
  testType?: string;
}

export const TestContainer: React.FC<TestContainerProps> = ({
  className,
  testId = 'test-container',
  testType
}) => {
  const navigate = useNavigate();
  const {
    currentSession,
    startTest,
    submitAnswer,
    endTest,
    resetTest,
    getCurrentQuestion
  } = usePsychologyStore();

  const [showResults, setShowResults] = useState(false);

  // 开始测试
  const handleStartTest = () => {
    if (testType) {
      startTest(testType as any);
    }
  };

  // 提交答案
  const handleSubmitAnswer = (answer: string | number) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      submitAnswer(currentQuestion.id, answer);
    }
  };

  // 完成测试
  const handleCompleteTest = async () => {
    if (currentSession) {
      await endTest();
      setShowResults(true);
    }
  };

  // 重新开始测试
  const handleResetTest = () => {
    resetTest();
    setShowResults(false);
  };

  // 返回首页
  const handleBackToHome = () => {
    navigate('/');
  };

  if (!currentSession) {
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
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={`test-container ${className}`} data-testid={testId}>
        <TestResults
          results={{} as any}
          onReset={handleResetTest}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className={`test-container ${className}`} data-testid={testId}>
      <TestProgress
        current={currentSession.currentQuestionIndex + 1}
        total={currentSession.totalQuestions}
        progress={((currentSession.currentQuestionIndex + 1) / currentSession.totalQuestions) * 100}
        timeElapsed={0}
        estimatedTimeRemaining={0}
      />
      
      {currentQuestion && (
        <QuestionDisplay
          question={currentQuestion}
          onAnswer={handleSubmitAnswer}
          onNext={handleCompleteTest}
          onPrevious={() => {}}
          currentIndex={currentSession.currentQuestionIndex}
          totalQuestions={currentSession.totalQuestions}
          isAnswered={false}
        />
      )}
    </div>
  );
}; 