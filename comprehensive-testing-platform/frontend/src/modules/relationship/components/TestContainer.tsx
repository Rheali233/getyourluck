/**
 * Test Container Component
 * Unified relationship testing component following development standards
 */

import React, { useState } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useRelationshipStore } from '../stores/useRelationshipStore';
import { QuestionDisplay } from './QuestionDisplay';
import { TestResults } from './TestResults';
import { TestPreparation } from './TestPreparation';
import { TestNavigation, Modal, LoadingSpinner } from '@/components/ui';
import type { TestType } from '../types';

export interface TestContainerProps extends BaseComponentProps {
  testType: TestType;
}

export const TestContainer: React.FC<TestContainerProps> = ({
  className,
  testId = 'test-container',
  testType
}) => {
  const {
    currentSession,
    startTest,
    submitAnswer,
    getCurrentQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    submitTest,
    currentTestResult,
    showResults,
    resetTest
  } = useRelationshipStore();

  const [showPreparation, setShowPreparation] = useState(true);

  // Start test from preparation interface
  const handleStartFromPreparation = () => {
    if (testType) {
      if (showResults || currentTestResult) {
        resetTest();
      }
      startTest(testType);
      setShowPreparation(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async (answer: string | number) => {
    try {
      await submitAnswer(getCurrentQuestion()?.id || '', answer);
      
      // Check if this is the last question
      const currentQuestionIndex = currentSession?.currentQuestionIndex || 0;
      const totalQuestions = currentSession?.totalQuestions || 0;
      
      if (currentQuestionIndex === totalQuestions - 1) {
        // Last question, show analysis modal and complete test
        setIsAnalyzing(true);
        await handleCompleteTest();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      // Silent error handling for answer submission
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    goToNextQuestion();
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    goToPreviousQuestion();
  };

  // Analysis modal states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Enhanced test completion handler
  const handleCompleteTest = async () => {
    try {
      await submitTest();
      // Analysis successful, modal will be hidden automatically when results are shown
    } catch (error) {
      console.error('Failed to complete test:', error);
      // Analysis failed, show error modal and stay on last question
      setIsAnalyzing(false);
      setShowErrorModal(true);
    }
  };

  // Reset submitting state when error modal is closed
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  // Get current question
  const currentQuestion = getCurrentQuestion();
  const currentQuestionIndex = currentSession?.currentQuestionIndex || 0;
  const totalQuestions = currentSession?.totalQuestions || 0;



  // Render preparation interface
  if (showPreparation) {
    return (
              <TestPreparation
          testType={testType}
          onStartTest={handleStartFromPreparation}
          className={className || ''}
          testId={`${testId}-preparation`}
        />
    );
  }

  // Render test interface
  if (currentSession && currentQuestion && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        {/* Top navigation */}
        <TestNavigation 
          moduleName="Relationship Testing Center"
          backPath="/relationship"
          showResetButton={true}
          onReset={() => {
            resetTest();
            setShowPreparation(true);
          }}
        />
        
        <QuestionDisplay
          key={`${currentSession.id}-${currentQuestionIndex}-${showErrorModal}`}
          question={currentQuestion}
          onAnswer={handleSubmitAnswer}
          onNext={handleNextQuestion}
          onPrevious={handlePreviousQuestion}
          onComplete={handleCompleteTest}
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          isAnswered={false}
          testType={testType}
          testId={`${testId}-question`}
        />
        
        {/* Analysis Modal */}
        <Modal 
          isOpen={isAnalyzing} 
          onClose={() => {}} 
          showCloseButton={false} 
          closeOnOverlayClick={false}
          size="small"
        >
          <div className="flex flex-col items-center text-center">
            <LoadingSpinner isLoading size="large" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Analyzing Your Results
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we analyze your test results...
            </p>
          </div>
        </Modal>
        
        {/* Error Modal */}
        <Modal 
          isOpen={showErrorModal} 
          onClose={handleCloseErrorModal}
          size="small"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-600 mb-4">
              Analysis failed. Please try again. If the problem persists, please contact us.
            </p>
          </div>
        </Modal>
      </div>
    );
  }

  // Render results interface
  if (showResults && currentTestResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
        {/* Top navigation */}
        <TestNavigation 
          moduleName="Relationship Testing Center"
          backPath="/relationship"
          showResetButton={true}
          onReset={() => {
            resetTest();
            setShowPreparation(true);
          }}
        />
        
        <TestResults
          result={currentTestResult}
          testType={testType}
          onRetakeTest={() => {
            resetTest();
            setShowPreparation(true);
          }}
          onShareResult={() => {
            // TODO: Implement share functionality
          }}
          className={className || ''}
          testId={`${testId}-results`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Preparing your relationship test...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
      </div>
    </div>
  );
};
