import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { LearningTestContainer } from './LearningTestContainer';
import { getHistoryLength } from '@/utils/browserEnv';
import { useLearningTestPage } from './useLearningTestPage';

interface LearningGenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

interface BackToTestsButtonProps {
  onNavigate: NavigateFunction;
  className?: string;
}

const BackToTestsButton: React.FC<BackToTestsButtonProps> = ({ onNavigate, className }) => {
  const handleNavigate = () => {
    const canGoBack = getHistoryLength() > 1;
    if (canGoBack) {
      onNavigate(-1);
    } else {
      onNavigate('/tests');
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${className || ''}`}
      aria-label="Back to tests"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Tests
    </button>
  );
};

export const LearningGenericTestPage: React.FC<LearningGenericTestPageProps> = ({ 
  testType, 
  title, 
  description 
}) => {
  const navigate = useNavigate();
  const {
    seoConfig,
    content,
    questions,
    loading,
    error,
    statItems,
    waitingForQuestions,
    startPending,
    testStarted,
    testTypeShowResults,
    testTypeIsTestStarted,
    handleStartTest,
    retryLoadQuestions
  } = useLearningTestPage({ testType, title, description });
 
  if (testStarted || testTypeShowResults || testTypeIsTestStarted) {
     return (
       <>
         <SEOHead config={seoConfig} />
        <LearningTestContainer>
          {/* 顶部标题 + 返回首页按钮 */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-2">{title}</h1>
                <p className="text-xl text-sky-800">
                  {testTypeShowResults
                    ? 'Your personalized learning ability assessment results'
                    : 'Please choose the option that best matches your learning preferences and cognitive abilities'}
                </p>
              </div>
              <BackToTestsButton onNavigate={navigate} className="ml-4" />
            </div>
          </div>

          <TestContainer testType={testType} questions={questions} />
        </LearningTestContainer>
      </>
    );
  }
 
  // 显示完整的测试准备界面
  return (
    <>
      <SEOHead config={seoConfig} />
        <LearningTestContainer>
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig(`/tests/learning/${testType}`)} />

          {/* 顶部标题 + 返回按钮 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-3">{title}</h1>
              <BackToTestsButton onNavigate={navigate} className="ml-4" />
            </div>
            <p className="text-xl text-sky-900/90 max-w-3xl">{content.heroDescription}</p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-900">
              {statItems.map((item, index) => (
                <React.Fragment key={item}>
                  {index > 0 && <span aria-hidden="true">|</span>}
                  <span>{item}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <Card className="p-6 mb-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                  <span className="text-cyan-500 mr-3">📋</span>
                  Test Preparation
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-sky-900">
                  {content.instructionPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                  <span className="text-cyan-500 mr-3">🔬</span>
                  Research Background
                </h2>
                <ul className="list-disc list-inside space-y-2 text-sm text-sky-900">
                  {content.theoreticalPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-sky-900 mb-3 flex items-center">
                <span className="text-cyan-500 mr-3">⚠️</span>
                Important Notices
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-sky-900">
                {content.disclaimerPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div
                className={
                  waitingForQuestions
                    ? 'text-sm text-sky-700'
                    : error
                    ? 'text-sm text-red-600'
                    : 'text-sm text-sky-900 font-semibold'
                }
              >
                {waitingForQuestions && (
                  <span>
                    {content.questionCount
                      ? `Preparing ${content.questionCount} questions, please wait.`
                      : 'Preparing questions, please wait.'}
                  </span>
                )}
                {!waitingForQuestions && error && (
                  <span>Unable to load questions right now. Please try again.</span>
                )}
                {!waitingForQuestions && !error && questions.length > 0 && (
                  <span>{questions.length} questions ready</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => void handleStartTest()}
                  disabled={loading || startPending}
                  className="bg-gradient-to-r from-cyan-600 to-sky-500 text-white px-10 py-3 text-base font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {startPending ? 'Starting…' : 'Start Free Test'}
                </button>
                {error && (
                  <button
                    onClick={() => void retryLoadQuestions()}
                    className="px-4 py-2 text-sm font-semibold text-sky-700 bg-white border border-sky-200 rounded-lg hover:bg-sky-50"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </Card>

          {content.supportMessage && (
            <div className="p-6 mb-8 bg-sky-50 border border-sky-200 rounded-3xl shadow-sm">
              <p className="text-sm text-sky-800">{content.supportMessage}</p>
            </div>
          )}

          <ContextualLinks context="test" className="mt-8" />
        </LearningTestContainer>
    </>
  );
};
