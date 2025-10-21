/**
 * Generic Question Display Component
 * Supports all question formats defined in TestTypes
 */

import React, { useState, useEffect } from 'react';
import type { 
  Question, 
  TestAnswer, 
  QuestionOption,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,

  TextQuestion
} from '../types/TestTypes';
import { QuestionFormat } from '../types/TestTypes';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/classNames';
// import { OptimizedImage } from '@/components/OptimizedImage';


interface QuestionDisplayProps {
  question: Question;
  currentAnswer?: TestAnswer | undefined;
  // eslint-disable-next-line no-unused-vars
  onAnswerSubmit: (questionId: string, answer: any) => void;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
  // 新增属性以支持完整功能
  testType?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  currentIndex?: number;
  theme?: {
    primary: string;
    secondary: string;
    textPrimary: string;
    textSecondary: string;
    textDark: string;
    textMedium: string;
    textLight: string;
    backgroundLight: string;
    borderMedium: string;
    gradient: string;
    gradientHover: string;
  };
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentAnswer,
  onAnswerSubmit,
  questionNumber,
  totalQuestions,
  className = '',
  testType,
  onNext,
  onPrevious,
  onComplete,
  currentIndex = 0,
  theme
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);

  // Default theme colors
  const defaultTheme = {
    primary: 'blue-600',
    secondary: 'indigo-500',
    textPrimary: 'blue-700',
    textSecondary: 'blue-700',
    gradient: 'from-blue-600 to-indigo-500',
    gradientHover: 'from-blue-700 to-indigo-600'
  };

  const colors = theme || defaultTheme;

  // Initialize selected answer from current answer
  useEffect(() => {
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer.value);
      validateAnswer(currentAnswer.value);
    } else {
      setSelectedAnswer(null);
      setIsValid(false);
    }
    // Debug logging removed for production
  }, [currentAnswer, question.id]);

  // Validate answer based on question format
  const validateAnswer = (answer: any): boolean => {
    if (!answer) {
      setIsValid(false);
      return false;
    }

    let valid = false;

    switch (question.format) {
      case QuestionFormat.SINGLE_CHOICE:
        valid = typeof answer === 'string' && answer.trim() !== '';
        break;
      case QuestionFormat.MULTIPLE_CHOICE:
        valid = Array.isArray(answer) && answer.length > 0;
        break;
      case QuestionFormat.SCALE:
        valid = typeof answer === 'number' && !isNaN(answer);
        break;
      case QuestionFormat.TEXT:
        valid = typeof answer === 'string' && answer.trim() !== '';
        break;
      default:
        valid = true;
    }

    setIsValid(valid);
    return valid;
  };

  // Handle answer change
  const handleAnswerChange = (answer: any) => {
    setSelectedAnswer(answer);
    validateAnswer(answer);
    
    // Immediately submit the answer to the store
    if (onAnswerSubmit) {
      onAnswerSubmit(question.id, answer);
    }
  };





  // Render test title - 隐藏标题，由GenericTestPage显示
  const renderTestTitle = () => null;



  // Render question header
  const renderQuestionHeader = () => (
    <div className="question-header mb-8">
      <div className="flex items-center justify-between mb-6">
        <span 
          className={"inline-block px-3 py-1 text-sm font-medium text-sky-600"}
        >
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>
      <h3 
        className={"text-xl font-semibold mb-8 leading-relaxed text-sky-900"}
      >
        {question.text}
      </h3>
      {question.description && (
        <p 
          className={"mt-2 text-sky-800"}
        >
          {question.description}
        </p>
      )}
    </div>
  );

  // Render navigation buttons
  const renderNavigationButtons = () => (
    <div className="navigation-buttons flex justify-between items-center mt-8">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className={`px-6 py-3 border rounded-lg transition-colors font-medium ${
          currentIndex === 0
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-opacity-10'
        } border-${theme?.primary || 'blue-600'} text-${theme?.primary || 'blue-600'}`}
      >
        Previous
      </button>

      {questionNumber < totalQuestions ? (
        <button
          onClick={onNext}
          disabled={!isValid || !selectedAnswer}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isValid && selectedAnswer
              ? 'text-white hover:shadow-xl'
              : `cursor-not-allowed bg-${theme?.primary || 'blue-600'}30 text-${theme?.primary || 'blue-600'}`
          }`}
          style={isValid && selectedAnswer ? {
            background: theme?.gradient === 'from-cyan-600 to-sky-500' 
              ? 'linear-gradient(90deg, #0891b2 0%, #0ea5e9 100%)'
              : theme?.gradient === 'from-pink-600 to-rose-500'
              ? 'linear-gradient(90deg, #db2777 0%, #f43f5e 100%)'
              : theme?.gradient === 'from-emerald-600 to-teal-500'
              ? 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)'
              : 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)'
          } : undefined}
        >
          Next
        </button>
      ) : (
        <button
          onClick={onComplete}
          disabled={!isValid || !selectedAnswer}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isValid && selectedAnswer
              ? 'text-white hover:shadow-xl'
              : `cursor-not-allowed bg-${theme?.primary || 'blue-600'}30 text-${theme?.primary || 'blue-600'}`
          }`}
          style={isValid && selectedAnswer ? {
            background: theme?.gradient === 'from-cyan-600 to-sky-500' 
              ? 'linear-gradient(90deg, #0891b2 0%, #0ea5e9 100%)'
              : theme?.gradient === 'from-pink-600 to-rose-500'
              ? 'linear-gradient(90deg, #db2777 0%, #f43f5e 100%)'
              : theme?.gradient === 'from-emerald-600 to-teal-500'
              ? 'linear-gradient(90deg, #059669 0%, #14b8a6 100%)'
              : 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)'
          } : undefined}
        >
          Complete Test
        </button>
      )}
    </div>
  );

  // Render single choice question - unified style with multiple choice
  const renderSingleChoice = () => {
    if (question.format !== QuestionFormat.SINGLE_CHOICE) return null;
    const singleChoiceQuestion = question as SingleChoiceQuestion;
    const containerClass = "single-choice-options grid grid-cols-1 md:grid-cols-2 gap-3";
    const selectedValue = typeof currentAnswer?.value === 'string' ? currentAnswer.value : selectedAnswer;
    return (
      <div className={containerClass}>
        {/* reserved for image-based questions (currently none) */}
        {singleChoiceQuestion.options?.map((option: QuestionOption) => (
          <label
            key={option.id}
            className={cn(
              "flex items-center justify-start p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 text-left w-full",
              selectedValue === option.value ? 
                "shadow-md" : 
                "border-gray-200 bg-white hover:shadow-sm",
              selectedValue === option.value && theme?.primary === 'blue-600' && "border-blue-600 bg-blue-50",
              selectedValue === option.value && theme?.primary === 'pink-600' && "border-pink-600 bg-pink-50", 
              selectedValue === option.value && theme?.primary === 'emerald-600' && "border-emerald-600 bg-emerald-50",
              selectedValue === option.value && theme?.primary === 'cyan-600' && "border-cyan-600 bg-sky-50",
              selectedValue === option.value && !theme?.primary && "border-blue-600 bg-blue-50",
              selectedValue !== option.value && theme?.borderMedium === 'blue-300' && "hover:border-blue-300",
              selectedValue !== option.value && theme?.borderMedium === 'pink-200' && "hover:border-pink-200",
              selectedValue !== option.value && theme?.borderMedium === 'emerald-300' && "hover:border-emerald-300", 
              selectedValue !== option.value && theme?.borderMedium === 'sky-400' && "hover:border-sky-400",
              selectedValue !== option.value && !theme?.borderMedium && "hover:border-blue-300"
            )}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleAnswerChange(option.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <span 
                className={`text-base leading-tight ${
                  selectedValue === option.value 
                    ? `text-${theme?.textDark || 'blue-900'}`
                    : 'text-gray-700'
                }`}
              >
                {option.text}
              </span>
            </div>
          </label>
        ))}
      </div>
    );
  };

  // Render multiple choice question
  const renderMultipleChoice = () => {
    if (question.format !== QuestionFormat.MULTIPLE_CHOICE) return null;
    const multipleChoiceQuestion = question as MultipleChoiceQuestion;
    // Use store's current answer as the single source of truth for rendering selection
    const storeSelectedArray = Array.isArray(currentAnswer?.value) ? (currentAnswer!.value as any[]) : [];
    const selectedArray = storeSelectedArray;
    
    // 使用两列网格布局（移动端单列，md及以上两列）
    const containerClass = "multiple-choice-options grid grid-cols-1 md:grid-cols-2 gap-3";
    
    // 生成专业的提示语
    const pluralize = (n: number, word: string) => (n === 1 ? word : `${word}s`);
    const minSel = multipleChoiceQuestion.minSelections;
    const maxSel = multipleChoiceQuestion.maxSelections;
    let selectionHint = '';
    if (minSel && maxSel) {
      selectionHint = minSel === maxSel
        ? `Please select exactly ${minSel} ${pluralize(minSel, 'option')}.`
        : `Please select between ${minSel} and ${maxSel} ${pluralize(maxSel!, 'option')}.`;
    } else if (minSel) {
      selectionHint = `Please select at least ${minSel} ${pluralize(minSel, 'option')}.`;
    } else if (maxSel) {
      selectionHint = `Please select no more than ${maxSel} ${pluralize(maxSel, 'option')}.`;
    }

    return (
      <div className={containerClass}>
        {multipleChoiceQuestion.options?.map((option: QuestionOption) => (
          <label
            key={option.id}
            className={cn(
              "flex items-center justify-start p-5 border-2 rounded-lg cursor-pointer transition-all duration-300 text-left w-full",
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) ? 
                "shadow-md" : 
                "border-gray-200 bg-white hover:shadow-sm",
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.primary === 'blue-600' && "border-blue-600 bg-blue-50",
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.primary === 'pink-600' && "border-pink-600 bg-pink-50",
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.primary === 'emerald-600' && "border-emerald-600 bg-emerald-50", 
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.primary === 'cyan-600' && "border-cyan-600 bg-sky-50",
              (selectedArray.includes(option.id) || selectedArray.includes(option.value)) && !theme?.primary && "border-blue-600 bg-blue-50",
              !(selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.borderMedium === 'blue-300' && "hover:border-blue-300",
              !(selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.borderMedium === 'pink-200' && "hover:border-pink-200",
              !(selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.borderMedium === 'emerald-300' && "hover:border-emerald-300",
              !(selectedArray.includes(option.id) || selectedArray.includes(option.value)) && theme?.borderMedium === 'sky-400' && "hover:border-sky-400", 
              !(selectedArray.includes(option.id) || selectedArray.includes(option.value)) && !theme?.borderMedium && "hover:border-blue-300"
            )}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedArray.includes(option.value)}
              onChange={(e) => {
                // Toggle purely by value to keep in sync with store
                const currentValues = selectedArray;
                const nextValues = e.target.checked
                  ? Array.from(new Set([...currentValues, option.value]))
                  : currentValues.filter(v => v !== option.value);
                // Update local validity immediately, but rendering uses store value
                setSelectedAnswer(nextValues);
                validateAnswer(nextValues);
                if (onAnswerSubmit) {
                  onAnswerSubmit(question.id, nextValues);
                }
              }}
              className="sr-only"
            />
            <div className="flex items-center w-full">
              <span 
                className={`text-base leading-tight ${
                  selectedArray.includes(option.value)
                    ? `text-${theme?.textDark || 'blue-900'}`
                    : 'text-gray-700'
                }`}
              >
                {option.text}
              </span>
            </div>
          </label>
        ))}
        {/* 合并后的专业提示语 */}
        {selectionHint && (
          <p className={`text-sm text-${theme?.textLight || 'blue-600'} mt-2 md:col-span-2`}>{selectionHint}</p>
        )}
      </div>
    );
  };



  // Render text question
  const renderText = () => {
    if (question.format !== QuestionFormat.TEXT) return null;
    const textQuestion = question as TextQuestion;
    
    return (
      <div className="text-question">
        <textarea
          value={selectedAnswer || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder={textQuestion.placeholder || 'Please enter your answer...'}
          maxLength={textQuestion.maxLength}
          rows={4}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${theme?.primary || 'blue-500'} focus:border-transparent resize-none`}
        />
        {textQuestion.maxLength && (
          <div className={`text-right text-sm text-${theme?.textLight || 'blue-600'} mt-1`}>
            {(selectedAnswer?.length || 0)} / {textQuestion.maxLength}
          </div>
        )}
      </div>
    );
  };

  // Render question content based on format
  const renderQuestionContent = () => {
    const format = question.format;
    switch (format) {
      case QuestionFormat.SINGLE_CHOICE:
        return renderSingleChoice();
      case QuestionFormat.MULTIPLE_CHOICE:
        return renderMultipleChoice();
      case QuestionFormat.SCALE:
        // PHQ-9使用与MBTI相同的按钮样式
        return renderSingleChoice();
      case QuestionFormat.TEXT:
        return renderText();
      // cognitive removed
      default:
        return (
          <div className={`text-${theme?.textLight || 'blue-600'} text-center py-8`}>
            Unsupported question format: {format}
          </div>
        );
    }
  };

  return (
    <div className={`question-display ${className}`}>
      <div className="max-w-6xl mx-auto px-4 pt-0">
        {/* Test Title */}
        {testType && renderTestTitle()}
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium text-${colors.textPrimary}`}>Progress</span>
            <span className={`text-sm font-medium text-${colors.textSecondary}`}>
              {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${colors.gradient} h-3 rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question Card with White Background */}
        <Card className="p-8">
          {renderQuestionHeader()}
          
          <div className="question-content mb-8">
            {renderQuestionContent()}
          </div>

          {/* Navigation buttons */}
          {onNext && onPrevious && renderNavigationButtons()}
        </Card>

      </div>
    </div>
  );
};
