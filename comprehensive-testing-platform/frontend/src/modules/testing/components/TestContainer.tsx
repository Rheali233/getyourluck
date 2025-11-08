/**
 * Generic Test Container Component
 * Base component for all test implementations
 */

import React from 'react';
import { useTestStore } from '../stores/useTestStore';
import { QuestionDisplay } from './QuestionDisplay';
import type { Question } from '../types/TestTypes';
import { Card } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/classNames';
import { feedbackService } from '@/services/feedbackService';
// Import specialized result displays - 使用懒加载优化性能
import { 
  LazyPHQ9ResultDisplay,
  LazyEQResultDisplay,
  LazyHappinessResultDisplay,
  LazyMBTIResultDisplay,
  LazyVARKResultDisplay,
  LazyLoveLanguageResultDisplay,
  LazyLoveStyleResultDisplay,
  LazyInterpersonalResultDisplay,
  LazyHollandResultDisplay,
  LazyDISCResultDisplay,
  LazyLeadershipResultDisplay
} from '@/components/LazyLoad';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

interface TestContainerProps {
  testType: string;
  questions?: Question[];
  onTestComplete?: (result: any) => void; // eslint-disable-line no-unused-vars
  className?: string;
  testId?: string;
}

export const TestContainer: React.FC<TestContainerProps> = ({
  testType,
  questions: propQuestions,
  onTestComplete,
  className = '',
  testId
}) => {
  const {
    // State
    currentQuestionIndex,
    questions: storeQuestions,
    isLoading,
    error,
    isTestStarted,
    
    // Actions
    endTest,
    resetTest,
    goToNextQuestion,
    goToPreviousQuestion,
    submitAnswer,
    getAnswer,
    setShowResults,
    getTestTypeState
  } = useTestStore();
  
  // 获取当前测试类型的特定状态
  const testTypeState = getTestTypeState(testType);
  const testTypeShowResults = testTypeState.showResults;
  const testTypeCurrentTestResult = testTypeState.currentTestResult;
  const testTypeIsTestStarted = testTypeState.isTestStarted;

  // 测试启动逻辑已经移到GenericTestPage中，这里不再需要handleStartTest

  // SEO配置 - 仅在显示结果时使用
  const seoConfig = useSEO({
    testType: testType,
    testId: testType,
    title: `${testType.toUpperCase()} Test Results - Comprehensive Analysis`,
    description: `Detailed analysis and results for your ${testType.toUpperCase()} test. Get personalized insights and recommendations based on your responses.`,
    structuredData: testTypeShowResults && testTypeCurrentTestResult ? {
      '@context': 'https://schema.org',
      '@type': 'TestResult',
      name: `${testType.toUpperCase()} Test Results`,
      description: `Comprehensive analysis and results for your ${testType.toUpperCase()} test`,
      testType: testType,
      result: {
        '@type': 'TestResult',
        score: testTypeCurrentTestResult.data?.totalScore || testTypeCurrentTestResult.data?.score || testTypeCurrentTestResult.scores?.['total'] || 'N/A',
        result: testTypeCurrentTestResult.data?.personalityType || testTypeCurrentTestResult.data?.severity || testTypeCurrentTestResult.data?.typeName || 'Analysis Complete',
        dateCompleted: new Date().toISOString(),
        testTaker: {
          '@type': 'Person',
          name: 'Test Participant'
        }
      },
      provider: {
        '@type': 'Organization',
        name: 'Comprehensive Testing Platform',
        url: 'https://selfatlas.net'
      },
      about: {
        '@type': 'Test',
        name: `${testType.toUpperCase()} Assessment`,
        description: `Professional ${testType.toUpperCase()} test for comprehensive analysis`
      }
    } : undefined
  });



  // Handle test end
  const handleEndTest = async () => {
    try {
      const result = await endTest();
      { const base = buildBaseContext(); void trackEvent({ eventType: 'test_submit', ...base, data: { testType, numQuestions: totalQuestions } }).catch(() => {}); }
      if (result && onTestComplete) {
        onTestComplete(result);
      }
    } catch (error) {
      // 错误状态已经通过store管理，会在渲染时显示错误弹窗
      // eslint-disable-next-line no-console
      console.error('Test submission error:', error);
    }
  };

  // Handle test reset
  const handleResetTest = () => {
    resetTest();
    setShowResults(false);
    // 根据测试类型确定正确的重定向路径（使用新的 /tests/* 格式）
    const redirectPath = ['vark'].includes(testType) 
      ? `/tests/learning/${testType}` 
      : ['love_language', 'love_style', 'interpersonal'].includes(testType)
      ? `/tests/relationship/${testType === 'love_language' ? 'love-language' : testType === 'love_style' ? 'love-style' : 'interpersonal'}`
      : ['holland', 'disc', 'leadership'].includes(testType)
      ? `/tests/career/${testType}`
      : `/tests/psychology/${testType}`;
    window.location.href = redirectPath;
  };

  // Handle answer submission
  const handleAnswerSubmit = (questionId: string, answer: any) => {
    submitAnswer(questionId, answer);
    { const base = buildBaseContext(); void trackEvent({ eventType: 'test_answer', ...base, data: { testType, questionId } }).catch(() => {}); }
  };



  // Get current question - use prop questions if available, otherwise use store questions
  const questions = propQuestions || storeQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Get theme colors based on testType
  const getThemeColors = () => {
    // Psychology module tests (excluding relationship tests)
    if (['mbti', 'phq9', 'eq', 'happiness'].includes(testType)) {
      return {
        primary: 'blue-600',
        secondary: 'indigo-500',
        primaryHover: 'blue-700',
        secondaryHover: 'indigo-600',
        background: 'blue-900',
        backgroundLight: 'blue-50',
        backgroundMedium: 'blue-100',
        textPrimary: 'white',
        textSecondary: 'blue-200',
        textTertiary: 'blue-300',
        textDark: 'blue-900',
        textMedium: 'blue-800',
        textLight: 'blue-600',
        dots: 'blue-400',
        border: 'blue-200',
        borderMedium: 'blue-300',
        loading: 'blue-600',
        gradient: 'from-blue-600 to-indigo-500',
        gradientHover: 'from-blue-700 to-indigo-600',
        backgroundGradient: 'from-blue-50 via-indigo-50 to-purple-50'
      };
    }
    // Relationship module tests
    else if (['love_language', 'love_style', 'interpersonal'].includes(testType)) {
      return {
        primary: 'pink-600',
        secondary: 'rose-500',
        primaryHover: 'pink-700',
        secondaryHover: 'rose-600',
        background: 'pink-900',
        backgroundLight: 'pink-50',
        backgroundMedium: 'pink-100',
        textPrimary: 'white',
        textSecondary: 'pink-200',
        textTertiary: 'pink-300',
        textDark: 'pink-900',
        textMedium: 'pink-800',
        textLight: 'pink-600',
        dots: 'pink-400',
        border: 'pink-200',
        borderMedium: 'pink-200',
        loading: 'pink-600',
        gradient: 'from-pink-600 to-rose-500',
        gradientHover: 'from-pink-700 to-rose-600',
        backgroundGradient: 'from-pink-50 via-rose-50 to-pink-50'
      };
    }
    // Career module tests
    else if (['holland', 'disc', 'leadership'].includes(testType)) {
      return {
        primary: 'emerald-600',
        secondary: 'teal-500',
        primaryHover: 'emerald-700',
        secondaryHover: 'teal-600',
        background: 'emerald-900',
        backgroundLight: 'emerald-50',
        backgroundMedium: 'emerald-100',
        textPrimary: 'white',
        textSecondary: 'emerald-200',
        textTertiary: 'emerald-300',
        textDark: 'emerald-900',
        textMedium: 'emerald-800',
        textLight: 'emerald-600',
        dots: 'emerald-400',
        border: 'emerald-200',
        borderMedium: 'emerald-300',
        loading: 'emerald-600',
        gradient: 'from-emerald-600 to-teal-500',
        gradientHover: 'from-emerald-700 to-teal-600',
        backgroundGradient: 'from-emerald-50 via-teal-50 to-green-50'
      };
    }
    // Learning module tests
    else if (['vark'].includes(testType)) {
      return {
        primary: 'cyan-600',
        secondary: 'sky-500',
        primaryHover: 'cyan-700',
        secondaryHover: 'sky-600',
        background: 'sky-900',
        backgroundLight: 'sky-50',
        backgroundMedium: 'sky-100',
        textPrimary: 'white',
        textSecondary: 'sky-200',
        textTertiary: 'sky-300',
        textDark: 'sky-900',
        textMedium: 'sky-800',
        textLight: 'sky-600',
        dots: 'sky-400',
        border: 'sky-200',
        borderMedium: 'sky-400',
        loading: 'cyan-600',
        gradient: 'from-cyan-600 to-sky-500',
        gradientHover: 'from-cyan-700 to-sky-600',
        backgroundGradient: 'from-cyan-100 via-sky-200 to-cyan-200'
      };
    }
    // Default (fallback to blue)
    else {
      return {
        primary: 'blue-600',
        secondary: 'indigo-500',
        primaryHover: 'blue-700',
        secondaryHover: 'indigo-600',
        background: 'blue-900',
        backgroundLight: 'blue-50',
        backgroundMedium: 'blue-100',
        textPrimary: 'white',
        textSecondary: 'blue-200',
        textTertiary: 'blue-300',
        textDark: 'blue-900',
        textMedium: 'blue-800',
        textLight: 'blue-600',
        dots: 'blue-400',
        border: 'blue-200',
        borderMedium: 'blue-300',
        loading: 'blue-600',
        gradient: 'from-blue-600 to-indigo-500',
        gradientHover: 'from-blue-700 to-indigo-600',
        backgroundGradient: 'from-blue-50 via-indigo-50 to-purple-50'
      };
    }
  };

  const theme = getThemeColors();



  // Render loading state - 只在测试启动时显示，不在结果生成时显示
  if (isLoading && !isTestStarted) {
    return (
      <div className={`test-container loading ${className}`} data-testid={testId}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.loading} mx-auto mb-4`}></div>
            <p className={`text-${theme.textLight}`}>Loading test...</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误弹窗状态（只在测试进行中时显示弹窗，不替换整个界面）
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [feedbackEmail, setFeedbackEmail] = React.useState('');
  const [feedbackMessage, setFeedbackMessage] = React.useState('Failed to get AI analysis results for the test');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);
  
  // 当有错误且测试已开始时，显示错误弹窗
  // 特别检查是否是AI分析失败的错误
  React.useEffect(() => {
    if (!error || !isTestStarted) {
      setShowErrorModal(false);
      return;
    }
    
    const isAIAnalysisError = (
      error.toLowerCase().includes('ai analysis') ||
      error.toLowerCase().includes('ai service') ||
      error.toLowerCase().includes('analysis failed') ||
      error.toLowerCase().includes('failed to parse') ||
      error.toLowerCase().includes('ai analysis is required') ||
      error.toLowerCase().includes('mbti analysis failed') ||
      error.toLowerCase().includes('test result analysis failed')
    );
    
    // 如果是AI分析错误，无论是否显示结果，都要显示错误弹窗
    // 如果是其他错误且没有显示结果，也显示错误弹窗
    if (isAIAnalysisError || !testTypeShowResults) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error, isTestStarted, testTypeShowResults]);

  // 处理重试提交
  const handleRetrySubmit = async () => {
    setShowErrorModal(false);
    setShowFeedbackForm(false);
    // 清除错误状态
    useTestStore.getState().clearError();
    // 重新提交
    await handleEndTest();
  };

  // 处理反馈提交
  const handleSubmitFeedback = async () => {
    if (!feedbackEmail || !feedbackMessage.trim() || feedbackMessage.trim().length < 10) {
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const { currentSession } = useTestStore.getState();
      await feedbackService.submit({
        testType,
        testId: testType,
        sessionId: currentSession?.id || undefined,
        resultId: undefined,
        rating: 1, // 错误反馈默认评分1
        category: 'bug',
        message: `[AI Analysis Error] ${feedbackMessage.trim()}\n\nOriginal Error: ${error || 'Unknown error'}`,
        email: feedbackEmail.trim(),
        canContact: true,
        client: {
          ua: navigator.userAgent,
          platform: navigator.platform,
          locale: navigator.language || 'en'
        },
        images: [],
        createdAt: new Date().toISOString()
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit feedback:', err);
      // 即使提交失败，也显示成功消息，避免用户困惑
      setFeedbackSubmitted(true);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // 使用测试类型特定的状态进行判断
  // 如果当前测试类型没有开始且没有显示结果，重定向到测试准备页面
  if (!testTypeIsTestStarted && !testTypeShowResults && !isLoading && !testTypeCurrentTestResult) {
    // 根据测试类型确定正确的重定向路径（使用新的 /tests/* 格式）
    const redirectPath = ['vark'].includes(testType) 
      ? `/tests/learning/${testType}` 
      : `/tests/psychology/${testType}`;
    window.location.href = redirectPath;
    return null;
  }

  // 检查questions是否有效（在结果页不触发重定向）
  // 使用测试类型特定的状态
  if (!testTypeShowResults && !isLoading && !testTypeCurrentTestResult && (!storeQuestions || storeQuestions.length === 0)) {
    // 根据测试类型确定正确的重定向路径（使用新的 /tests/* 格式）
    const redirectPath = ['vark'].includes(testType) 
      ? `/tests/learning/${testType}` 
      : `/tests/psychology/${testType}`;
    window.location.href = redirectPath;
    return null;
  }

  // Render test results - 使用测试类型特定的状态
  if (testTypeShowResults && testTypeCurrentTestResult) {
    let view: React.ReactElement | null = null;
    
    // 尝试获取结果数据，优先使用data字段，否则使用整个result
    const resultData = testTypeCurrentTestResult.data || testTypeCurrentTestResult;
    
    if (resultData) {
      switch (testType) {
        case 'phq9':
          view = (
            <LazyPHQ9ResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'phq9-result-display'}
            />
          );
          break;
        case 'eq':
          view = (
            <LazyEQResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'eq-result-display'}
            />
          );
          break;
        case 'happiness':
          view = (
            <LazyHappinessResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'happiness-result-display'}
            />
          );
          break;
        case 'mbti':
          view = (
            <LazyMBTIResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'mbti-result-display'}
            />
          );
          break;
        case 'vark':
          view = (
            <LazyVARKResultDisplay
              result={resultData}
              onReset={handleResetTest}
            />
          );
          break;
        case 'love-language':
        case 'love_language':
          view = (
            <LazyLoveLanguageResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'love-language-result-display'}
            />
          );
          break;
        case 'love-style':
        case 'love_style':
          view = (
            <LazyLoveStyleResultDisplay
              result={resultData}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'love-style-result-display'}
            />
          );
          break;
        case 'interpersonal':
          view = (
            <LazyInterpersonalResultDisplay
              result={testTypeCurrentTestResult?.data}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'interpersonal-result-display'}
            />
          );
          break;
        case 'holland':
          view = (
            <LazyHollandResultDisplay
              result={testTypeCurrentTestResult?.data}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'holland-result-display'}
            />
          );
          break;
        case 'disc':
          view = (
            <LazyDISCResultDisplay
              result={testTypeCurrentTestResult?.data}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'disc-result-display'}
            />
          );
          break;
        case 'leadership':
          view = (
            <LazyLeadershipResultDisplay
              result={testTypeCurrentTestResult?.data}
              onReset={handleResetTest}
              className={className}
              testId={testId || 'leadership-result-display'}
            />
          );
          break;
      }
    }

    if (!view) {
      view = (
        <div className={cn(`min-h-screen bg-gradient-to-br ${theme.backgroundGradient} py-8 px-4`, className)} data-testid={testId}>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <h2 className={`text-3xl font-bold text-${theme.textDark} mb-4`}>Test Completed</h2>
              <p className={`text-${theme.textLight} text-lg mb-6`}>
                Your {testType} test has been completed successfully.
              </p>
              <div className={`text-sm text-${theme.textLight} mb-8`}>
                <p>Analysis: {testTypeCurrentTestResult?.analysis || 'Test completed successfully.'}</p>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <>
        <SEOHead config={seoConfig} />
        {/* results view event */}
        {(() => { const base = buildBaseContext(); void trackEvent({ eventType: 'test_result_view', ...base, data: { testType } }).catch(() => {}); return null })()}
        {view}
      </>
    );
  }

  // Render test in progress - 使用测试类型特定的状态
  if (testTypeIsTestStarted && !testTypeShowResults && currentQuestion) {
    // 检查是否是最后一题且正在加载结果
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const isGeneratingResults = isLoading && isLastQuestion;

    return (
      <div className={`test-container in-progress ${className}`} data-testid={testId}>
        {/* Question display */}
        <div className="question-section mt-0 mb-8">
          <QuestionDisplay
            question={currentQuestion}
            currentAnswer={getAnswer(currentQuestion.id)}
            onAnswerSubmit={handleAnswerSubmit}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            testType={testType}
            onNext={() => goToNextQuestion()}
            onPrevious={() => goToPreviousQuestion()}
            onComplete={handleEndTest}
            currentIndex={currentQuestionIndex}
            theme={theme}
          />
        </div>

        {/* 结果生成加载弹窗 - 根据模块主题动态设置背景色 */}
        {isGeneratingResults && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100vw',
              height: '100vh'
            }}
            className="bg-black/40"
          >
            <div 
              className="backdrop-blur-md rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border border-white/10"
              style={{ 
                position: 'relative', 
                zIndex: 1000000,
                background: (theme?.gradient === 'from-cyan-600 to-sky-500' || testType === 'vark')
                  ? 'linear-gradient(135deg, #0891b2 0%, #0ea5e9 100%)'
                  : theme?.gradient === 'from-pink-600 to-rose-500'
                  ? 'linear-gradient(135deg, #db2777 0%, #f43f5e 100%)'
                  : theme?.gradient === 'from-emerald-600 to-teal-500'
                  ? 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)'
              }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-${theme.primary} to-${theme.secondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Responses</h3>
              <p className="text-white text-opacity-90 mb-4">
                Please wait while we analyze your responses and generate your personalized results...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-white bg-opacity-70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}

        {/* AI分析失败错误弹窗 */}
        <Modal
          isOpen={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
            setShowFeedbackForm(false);
            setFeedbackSubmitted(false);
            setFeedbackEmail('');
            setFeedbackMessage('Failed to get AI analysis results for the test');
          }}
          title={showFeedbackForm ? "Report Issue" : "Analysis Temporarily Unavailable"}
          size="medium"
          closeOnOverlayClick={false}
        >
          {!showFeedbackForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Analysis Temporarily Unavailable
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  We encountered an issue while generating your AI-powered analysis. Your test answers have been saved, and you can try submitting again.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  If this problem persists, please contact us at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a> or report the issue using the form below.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleRetrySubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
                <Button
                  onClick={() => setShowFeedbackForm(true)}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Report Issue
                </Button>
                <Button
                  onClick={() => {
                    setShowErrorModal(false);
                    handleResetTest();
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : feedbackSubmitted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Thank You for Your Feedback
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We've received your report and will look into this issue. You can also reach us directly at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleRetrySubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Retrying...' : 'Try Again'}
                </Button>
                <Button
                  onClick={() => {
                    setShowErrorModal(false);
                    handleResetTest();
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Help Us Improve
                </h3>
                <p className="text-sm text-gray-600">
                  Please provide your email and describe the issue you encountered. This will help us fix the problem quickly.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedbackEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters required
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() => {
                    setShowFeedbackForm(false);
                    setFeedbackEmail('');
                    setFeedbackMessage('Failed to get AI analysis results for the test');
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  disabled={isSubmittingFeedback}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  disabled={isSubmittingFeedback || !feedbackEmail || !feedbackMessage.trim() || feedbackMessage.trim().length < 10}
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // Render fallback state
  // 如果到达这里，优先保持结果页停留，避免误跳转
  if (!testTypeShowResults) {
    // 根据测试类型确定正确的重定向路径（使用新的 /tests/* 格式）
    const redirectPath = ['vark'].includes(testType) 
      ? `/tests/learning/${testType}` 
      : ['love_language', 'love_style', 'interpersonal'].includes(testType)
      ? `/tests/relationship/${testType === 'love_language' ? 'love-language' : testType === 'love_style' ? 'love-style' : 'interpersonal'}`
      : ['holland', 'disc', 'leadership'].includes(testType)
      ? `/tests/career/${testType}`
      : `/tests/psychology/${testType}`;
    window.location.href = redirectPath;
  }
  return null;
};

