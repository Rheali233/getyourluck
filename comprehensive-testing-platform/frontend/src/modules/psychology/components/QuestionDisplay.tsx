/**
 * Question Display Component
 * Psychology test component following unified development standards
 */

import React, { useState } from 'react';
import { Button, Card, QuestionOptions } from '@/components/ui';
import type { QuestionDisplayProps, BaseQuestion, MbtiQuestion, Phq9Question, EqQuestion, HappinessQuestion } from '../types';
import { cn } from '@/utils/classNames';

/**
 * Question Display Component
 * Displays questions and options based on question type
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
      
      // First save the answer
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
          setIsSubmitting(false);
          setHasAnswered(false);
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
  const getTestTypeDisplayName = () => {
    if (!testType) return 'Psychological Test';
    
    switch (testType) {
      case 'mbti':
        return 'MBTI Personality Test';
      case 'phq9':
        return 'PHQ-9 Depression Screening';
      case 'eq':
        return 'Emotional Intelligence Test';
      case 'happiness':
        return 'Happiness Index Assessment';
      default:
        return 'Psychological Test';
    }
  };

  // Convert question options to unified format
  const getQuestionOptions = (question: BaseQuestion) => {
    if (isMbtiQuestion(question) || isPhq9Question(question) || isEqQuestion(question) || isHappinessQuestion(question)) {
      return question.options.map(option => ({
        id: option.id,
        text: option.text,
        value: option.value,
        description: option.description
      }));
    }
    return [];
  };

  return (
    <div
      className={cn("bg-blue-50 min-h-screen", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Test Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            {getTestTypeDisplayName()}
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
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
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
            
            {/* Render different options based on question type */}
            <QuestionOptions
              options={getQuestionOptions(question)}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswerSelect}
              theme="blue"
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            ) : (
              // Only show Next button for non-last questions
              currentIndex < totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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

export default QuestionDisplay;


// Type judgment helper function
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

// Get MBTI dimension names (no longer used, but kept for future needs)
// function getMbtiDimensionName(dimension: string): string {
//   const dimensionNames = {
//     'E-I': 'Extraversion/Introversion',
//     'S-N': 'Sensing/Intuition',
//     'T-F': 'Thinking/Feeling',
//     'J-P': 'Judging/Perceiving',
//   };
//   return dimensionNames[dimension as keyof typeof dimensionNames] || dimension;
// }

// Get EQ dimension names (no longer used, but kept for future needs)
// function getEqDimensionName(dimension: string): string {
//   const dimensionNames = {
//     self_awareness: 'Self-Awareness',
//     self_management: 'Self-Management',
//     social_awareness: 'Social Awareness',
//     relationship_management: 'Relationship Management',
//   };
//   return dimensionNames[dimension as keyof typeof dimensionNames] || dimension;
// }

// Get happiness index domain names
