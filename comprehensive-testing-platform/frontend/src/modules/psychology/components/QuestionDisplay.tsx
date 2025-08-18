/**
 * 题目展示组件
 * 遵循统一开发标准的心理测试组件
 */

import React, { useState } from 'react';
import { Button, Card } from '@/components/ui';
import type { QuestionDisplayProps, BaseQuestion, MbtiQuestion, Phq9Question, EqQuestion, HappinessQuestion } from '../types';
import { cn } from '@/utils/classNames';

/**
 * 题目展示组件
 * 根据题目类型显示相应的题目和选项
 */
export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  className,
  testId = 'question-display',
  question,
  onAnswer,
  onNext,
  onPrevious,
  currentIndex,
  totalQuestions,
  isAnswered,
  ...props
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理答案选择
  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  // 处理答案提交
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    try {
      setIsSubmitting(true);
      onAnswer(question.id, selectedAnswer);
      
      // 自动进入下一题
      setTimeout(() => {
        onNext();
        setSelectedAnswer(null);
        setIsSubmitting(false);
      }, 500);
    } catch (error) {
      setIsSubmitting(false);
      console.error('提交答案失败:', error);
    }
  };

  // 处理下一题
  const handleNext = () => {
    if (isAnswered) {
      onNext();
      setSelectedAnswer(null);
    }
  };

  // 处理上一题
  const handlePrevious = () => {
    onPrevious();
    setSelectedAnswer(null);
  };

  // 计算进度
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div
      className={cn("min-h-screen bg-gray-50 py-8 px-4", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              题目 {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 题目卡片 */}
        <Card className="p-8 mb-8">
          {/* 题目内容 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {question.text}
            </h2>
            
            {/* 根据题目类型渲染不同的选项 */}
            {renderQuestionOptions(question, selectedAnswer, handleAnswerSelect)}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                上一题
              </Button>
            </div>

            <div className="flex gap-4">
              {!isAnswered ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? '提交中...' : '提交答案'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={currentIndex === totalQuestions - 1}
                  className="px-8"
                >
                  {currentIndex === totalQuestions - 1 ? '完成测试' : '下一题'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* 提示信息 */}
        <div className="text-center text-sm text-gray-500">
          <p>请根据您的真实想法和感受选择最符合的选项</p>
          <p>没有对错之分，诚实回答才能获得准确结果</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;

// 渲染题目选项的辅助函数
function renderQuestionOptions(
  question: BaseQuestion,
  selectedAnswer: string | number | null,
  onSelect: (answer: string | number) => void
) {
  // 根据题目类型渲染不同的选项
  if (isMbtiQuestion(question)) {
    return renderMbtiOptions(question, selectedAnswer, onSelect);
  } else if (isPhq9Question(question)) {
    return renderPhq9Options(question, selectedAnswer, onSelect);
  } else if (isEqQuestion(question)) {
    return renderEqOptions(question, selectedAnswer, onSelect);
  } else if (isHappinessQuestion(question)) {
    return renderHappinessOptions(question, selectedAnswer, onSelect);
  }

  // 默认渲染
  return (
    <div className="space-y-3">
      <p className="text-gray-600">不支持的题目类型</p>
    </div>
  );
}

// 渲染MBTI选项
function renderMbtiOptions(
  question: MbtiQuestion,
  selectedAnswer: string | null,
  onSelect: (answer: string) => void
) {
  return (
    <div className="space-y-4">
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.value)}
          className={cn(
            "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
            "hover:border-primary-300 hover:bg-primary-50",
            selectedAnswer === option.value
              ? "border-primary-600 bg-primary-100 text-primary-900"
              : "border-gray-200 bg-white text-gray-700"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg">{option.text}</span>
            {selectedAnswer === option.value && (
              <span className="text-primary-600 text-xl">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// 渲染PHQ-9选项
function renderPhq9Options(
  question: Phq9Question,
  selectedAnswer: number | null,
  onSelect: (answer: number) => void
) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          症状：{question.symptom}
        </p>
      </div>
      
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.value)}
          className={cn(
            "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
            "hover:border-primary-300 hover:bg-primary-50",
            selectedAnswer === option.value
              ? "border-primary-600 bg-primary-100 text-primary-900"
              : "border-gray-200 bg-white text-gray-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-medium text-lg">{option.text}</div>
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
            </div>
            {selectedAnswer === option.value && (
              <span className="text-primary-600 text-xl">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// 渲染情商测试选项
function renderEqOptions(
  question: EqQuestion,
  selectedAnswer: number | null,
  onSelect: (answer: number) => void
) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          维度：{getEqDimensionName(question.dimension)}
        </p>
      </div>
      
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.value)}
          className={cn(
            "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
            "hover:border-primary-300 hover:bg-primary-50",
            selectedAnswer === option.value
              ? "border-primary-600 bg-primary-100 text-primary-900"
              : "border-gray-200 bg-white text-gray-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-medium text-lg">{option.text}</div>
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
            </div>
            {selectedAnswer === option.value && (
              <span className="text-primary-600 text-xl">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// 渲染幸福指数选项
function renderHappinessOptions(
  question: HappinessQuestion,
  selectedAnswer: number | null,
  onSelect: (answer: number) => void
) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          领域：{getHappinessDomainName(question.domain)}
        </p>
      </div>
      
      {question.options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.value)}
          className={cn(
            "w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
            "hover:border-primary-300 hover:bg-primary-50",
            selectedAnswer === option.value
              ? "border-primary-600 bg-primary-100 text-primary-900"
              : "border-gray-200 bg-white text-gray-700"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="font-medium text-lg">{option.text}</div>
              <div className="text-sm text-gray-600 mt-1">{option.description}</div>
            </div>
            {selectedAnswer === option.value && (
              <span className="text-primary-600 text-xl">✓</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// 类型判断辅助函数
function isMbtiQuestion(question: BaseQuestion): question is MbtiQuestion {
  return 'dimension' in question && typeof (question as any).dimension === 'string';
}

function isPhq9Question(question: BaseQuestion): question is Phq9Question {
  return 'symptom' in question;
}

function isEqQuestion(question: BaseQuestion): question is EqQuestion {
  return 'dimension' in question && typeof (question as any).dimension === 'string';
}

function isHappinessQuestion(question: BaseQuestion): question is HappinessQuestion {
  return 'domain' in question;
}

// 获取情商维度名称
function getEqDimensionName(dimension: string): string {
  const dimensionNames = {
    self_awareness: '自我意识',
    self_management: '自我管理',
    social_awareness: '社会意识',
    relationship_management: '人际关系管理',
  };
  return dimensionNames[dimension as keyof typeof dimensionNames] || dimension;
}

// 获取幸福指数领域名称
function getHappinessDomainName(domain: string): string {
  const domainNames = {
    work: '工作',
    relationships: '人际关系',
    health: '健康',
    personal_growth: '个人成长',
    life_balance: '生活平衡',
  };
  return domainNames[domain as keyof typeof domainNames] || domain;
} 