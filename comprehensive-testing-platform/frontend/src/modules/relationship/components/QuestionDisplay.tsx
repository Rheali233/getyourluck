/**
 * Question Display Component
 * Unified relationship test question display following development standards
 */

import React, { useState } from 'react';
import { Button, Card, QuestionOptions } from '@/components/ui';
import type { QuestionDisplayProps } from '../types';
import { cn } from '@/utils/classNames';

/**
 * Question Display Component
 * Displays questions based on question type with appropriate options
 */
export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  className,
  testId = 'question-display',
  question,
  onAnswer,
  onNext,
  onPrevious,
  onComplete,
  currentIndex,
  totalQuestions,
  isAnswered,
  testType,
  isCompleting,
  ...props
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Handle answer selection
  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    try {
      setIsSubmitting(true);
      
      // Save answer first
      onAnswer(selectedAnswer);
      
      // If this is the last question, trigger completion directly
      if (currentIndex === totalQuestions - 1) {
        // Directly call onComplete for the last question
        onComplete?.();
      } else {
        // Mark as answered and move to next question
        setHasAnswered(true);
        setTimeout(() => {
          onNext();
          setSelectedAnswer(null);
          setHasAnswered(false);
          setIsSubmitting(false);
        }, 100);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Failed to submit answer:', error);
    }
  };

  // Handle next question
  const handleNext = () => {
    if (hasAnswered) {
      onNext();
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    onPrevious();
    setSelectedAnswer(null);
  };

  // Calculate progress
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // Get test type display name
  const getTestTypeDisplayName = (type: string) => {
    switch (type) {
      case 'love_language':
        return 'Love Language Test';
      case 'love_style':
        return 'Love Style Test';
      case 'interpersonal':
        return 'Interpersonal Skills Test';
      default:
        return 'Relationship Test';
    }
  };

  return (
    <div
      className={cn("bg-gradient-to-br from-pink-50 to-rose-50 min-h-screen", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Test Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            {getTestTypeDisplayName(testType)}
          </h1>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentIndex + 1} / {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white shadow-lg">
          {/* Question Content */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {question.text}
            </h3>
            
            {/* Answer Options - Grid layout like MBTI */}
            <QuestionOptions
              options={question.options?.map(option => ({
                id: option.id,
                text: option.text,
                value: option.value,
                description: option.description
              })) || []}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswerSelect}
              theme="pink"
            />
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="flex justify-between items-center mt-4 pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2"
            >
              Previous
            </Button>

            {!hasAnswered ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null || isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              // Only show Next button for non-last questions
              currentIndex < totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                >
                  Next
                </Button>
              ) : null
            )}
          </div>
        </Card>

        {/* Hint Information */}
        <div className="text-center text-xs text-gray-500 mt-2">
          <p>Please choose the option that best matches your true thoughts and feelings</p>


        </div>
      </div>
    </div>
  );
};
