/**
 * 通用问题展示组件
 * 适用于所有测试类型的问题展示
 * 
 * @example
 * // 心理学测试使用
 * <QuestionDisplay 
 *   question={question} 
 *   onAnswer={handleAnswer} 
 *   theme="psychology" 
 * />
 * 
 * // 职业测试使用
 * <QuestionDisplay 
 *   question={question} 
 *   onAnswer={handleAnswer} 
 *   theme="career" 
 * />
 * 
 * @param question - 问题对象
 * @param onAnswer - 答案选择回调
 * @param theme - 主题配置
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    value?: number;
  }>;
  category?: string;
}

export interface QuestionDisplayProps extends BaseComponentProps {
  question: Question;
  // eslint-disable-next-line no-unused-vars
  onAnswer: (questionId: string, optionId: string, value?: number) => void;
  selectedAnswer?: { optionId: string; value?: number };
  theme?: string;
  showCategory?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  selectedAnswer,
  theme = 'psychology',
  showCategory = true, // eslint-disable-line no-unused-vars
  className,
  testId = 'question-display',
  ...props
}) => {

  return (
    <div 
      className={cn("bg-white rounded-lg shadow-lg p-8", className)}
      data-testid={testId}
      {...props}
    >
      {/* 问题头部信息 */}
      <div className="mb-6">
      </div>
      
      {/* 问题内容 */}
      <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
        {question.question}
      </h2>

      {/* 选项列表 */}
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswer(question.id, option.id, option.value)}
            className={cn(
              "w-full text-left p-4 border-2 rounded-lg transition-all duration-200",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
              selectedAnswer?.optionId === option.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0",
                selectedAnswer?.optionId === option.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              )}>
                {selectedAnswer?.optionId === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto" />
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
