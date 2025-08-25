/**
 * Test Container Component
 * Unified psychological testing component following development standards
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { usePsychologyStore } from '../stores/usePsychologyStore';
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
  const navigate = useNavigate();
  const {
    currentSession,
    startTest,
    submitAnswer,
    getCurrentQuestion,
    goToPreviousQuestion,
    goToNextQuestion,
    endTest,
    currentTestResult,
    currentTestType,
    showResults,
    resetTest
  } = usePsychologyStore();

  const [showPreparation, setShowPreparation] = useState(true);
  
  // Analysis modal states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Start test from preparation interface
  const handleStartFromPreparation = () => {
    if (testType) {
      // If there are current test results, reset state first
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
      await submitAnswer(currentQuestion?.id || '', answer);
      
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

  // Complete test
  const handleCompleteTest = async () => {
    try {
      const result = await endTest();
      
      if (result.success) {
        // Analysis successful, modal will be hidden automatically when results are shown
      } else {
        // Analysis failed, show error modal and stay on last question
        setIsAnalyzing(false);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Test completion failed:', error);
      // Analysis failed, show error modal and stay on last question
      setIsAnalyzing(false);
      setShowErrorModal(true);
    }
  };

  // Reset submitting state when error modal is closed
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  // Complete test
  // Remove unused handleCompleteTest function
  /*
  const handleCompleteTest = async () => {
    try {
      setSubmitting(true);
      const result = await endTest();
      
      if (result.success) {
        setIsAnalyzing(false);
      } else {
        console.error('Test completion failed:', result?.error || 'Unknown error');
        alert('Test completion failed. Please try again later.');
      }
    } catch (error) {
      console.error('Test completion failed:', error);
      alert('Test completion failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  */

  // Restart test
  const handleResetTest = () => {
    // Reset store state
    resetTest();
    // Show test preparation interface
    setShowPreparation(true);
  };

  // Return to home page
  const handleBackToHome = () => {
    navigate('/');
  };

  // Show test preparation interface
  if (showPreparation) {
    return (
      <TestPreparation
        testType={testType}
        onStartTest={handleStartFromPreparation}
        className={className || ''}
        testId={testId || 'test-preparation'}
      />
    );
  }

  if (showResults && currentTestResult && currentTestType) {
    return (
      <div className={`test-container ${className}`} data-testid={testId}>
        {/* Top navigation - Show reset button on results page */}
        <TestNavigation 
          moduleName="Psychological Testing Center"
          backPath="/psychology"
          showResetButton={true}
          onReset={handleResetTest}
        />
        <TestResults
          results={currentTestResult}
          onReset={handleResetTest}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  // Debug information (commented out in production)
  // console.log('TestContainer Debug:', {
  //   currentSession,
  //   currentQuestion,
  //   testType,
  //   questions: usePsychologyStore.getState().questions
  // });

  return (
    <div className={`test-container bg-blue-50 min-h-screen ${className}`} data-testid={testId}>
      {/* Top navigation */}
      <TestNavigation 
          moduleName="Psychological Testing Center"
          backPath="/psychology"
        />

      {/* Analysis in progress modal */}
      {/*
      <Modal isOpen={isAnalyzing} onClose={() => {}} showCloseButton={false} closeOnOverlayClick={false}>
        <div className="flex flex-col items-center text-center">
          <LoadingSpinner isLoading size="large" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Analyzing Your Results</h3>
          <p className="mt-2 text-sm text-gray-600">Based on your answers, we are generating a personalized analysis report. Please wait a moment～</p>
        </div>
      </Modal>
      */}
      
      {currentQuestion && currentSession ? (
        <QuestionDisplay
          key={`${currentSession.id}-${currentSession.currentQuestionIndex}-${showErrorModal}`}
          question={currentQuestion}
          onAnswer={handleSubmitAnswer}
          onNext={handleNextQuestion}
          onPrevious={handlePreviousQuestion}
          onComplete={handleCompleteTest}
          currentIndex={currentSession.currentQuestionIndex}
          totalQuestions={currentSession.totalQuestions}
          isAnswered={false}
          testType={testType}
        />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading questions...</h2>
          <p className="text-gray-600 mb-8">
            Current session: {currentSession?.id}<br/>
            Test type: {currentSession?.testType}<br/>
            Question index: {currentSession?.currentQuestionIndex}<br/>
            Total questions: {currentSession?.totalQuestions}
          </p>
          <button
            onClick={handleResetTest}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Restart Test
          </button>
        </div>
      )}
      
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
};