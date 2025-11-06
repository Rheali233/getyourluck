/**
 * Career Test Page Component
 * Main test page for career testing module
 * Updated to match Psychology module GenericTestPage with green theme
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { CareerTestContainer } from './CareerTestContainer';
import { CareerTestTypeEnum, CareerTestType } from '../types';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { buildAbsoluteUrl } from '@/config/seo';


interface TestPageContent {
  title: string;
  heroDescription: string;
  stats: {
    estimatedMinutes?: number;
    format?: string;
    insightLabel?: string;
  };
  instructionPoints: string[];
  theoreticalPoints: string[];
  disclaimerPoints: string[];
  crisisSupportMessage?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

interface BackToTestsButtonProps {
  onNavigate: NavigateFunction;
  className?: string;
}

const BackToTestsButton: React.FC<BackToTestsButtonProps> = ({ onNavigate, className }) => {
  const handleNavigate = () => {
    const canGoBack = typeof window !== 'undefined' && window.history.length > 1;

    if (canGoBack) {
      onNavigate(-1);
    } else {
      onNavigate('/tests/career');
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm font-semibold text-green-900 transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${className || ''}`}
      aria-label="Back to tests"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Tests
    </button>
  );
};

const TEST_PAGE_CONTENT: Record<string, TestPageContent> = {
  [CareerTestTypeEnum.HOLLAND]: {
    title: 'Holland Career Interest Test',
    heroDescription:
      'Free research-informed Holland Code assessment with instant AI insights. Discover the work environments where you thrive. No account needed.',
    stats: {
      estimatedMinutes: 12,
      format: 'Single choice',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Reflect on roles and tasks you genuinely enjoy rather than what others expect from you.',
      'Choose the option that best matches how you feel most of the time — there are no right answers.',
      'Complete the test in one sitting to capture a consistent picture of your interests.'
    ],
    theoreticalPoints: [
      'Grounded in John Holland’s RIASEC career interest framework.',
      'Helps match personality themes with compatible work environments.',
      'Supports career exploration with research-backed insights you can discuss with mentors.'
    ],
    disclaimerPoints: [
      'Use these insights as a starting point — they do not replace professional career counseling.',
      'Results highlight patterns, not fixed labels. Revisit them as your interests evolve.',
      'Work with a qualified counselor for personalized job placement or career planning.'
    ],
    seoTitle: 'Free Holland Career Interest Test (RIASEC) | SelfAtlas',
    seoDescription:
      'Discover your Holland Code with our free RIASEC career interest assessment. Get instant AI insights and research-informed guidance for your next career move. No account needed.',
    seoKeywords: [
      'holland test',
      'riasec test',
      'career interest assessment',
      'career personality test',
      'career guidance',
      'free career test'
    ]
  },
  [CareerTestTypeEnum.DISC]: {
    title: 'DISC Behavioral Style Assessment',
    heroDescription:
      'Free DISC work style assessment that delivers instant collaboration tips. Research-informed insights with no sign-up required.',
    stats: {
      estimatedMinutes: 10,
      format: 'Scenario rating',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Base each response on how you naturally act at work instead of idealized behavior.',
      'Respond quickly — instinctive choices reveal your typical communication patterns.',
      'Think about day-to-day interactions with teammates, clients, and managers.'
    ],
    theoreticalPoints: [
      'Built on the DISC behavioral model used in organizational psychology.',
      'Maps Dominance, Influence, Steadiness, and Conscientiousness across scenarios.',
      'Supports team collaboration and leadership conversations with practical language.'
    ],
    disclaimerPoints: [
      'Designed for self-awareness and team discussions — not a diagnostic or hiring tool.',
      'Combine the findings with feedback from colleagues and mentors for balance.',
      'Engage HR or professional coaches for formal talent assessments or interventions.'
    ],
    seoTitle: 'Free DISC Assessment - Work Style Insights | SelfAtlas',
    seoDescription:
      'Understand your work style with our free DISC behavioral assessment. Get instant AI insights to improve collaboration and leadership. Research-informed and no account required.',
    seoKeywords: [
      'disc assessment',
      'work style test',
      'behavioral profile',
      'team collaboration',
      'communication style',
      'free disc test'
    ]
  },
  [CareerTestTypeEnum.LEADERSHIP]: {
    title: 'Leadership Assessment',
    heroDescription:
      'Free leadership assessment to surface your strengths and development areas. Research-informed insights delivered instantly without an account.',
    stats: {
      estimatedMinutes: 12,
      format: 'Scenario rating',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Consider how you respond under real pressure instead of ideal scenarios.',
      'Focus on recent team experiences to give accurate, actionable responses.',
      'Set aside a quiet moment to reflect on strategic decisions and people leadership.'
    ],
    theoreticalPoints: [
      'Integrates leadership competency research across strategic thinking, coaching, and execution.',
      'Highlights growth opportunities tied to modern leadership frameworks.',
      'Pairs reflective prompts with AI-generated suggestions you can apply immediately.'
    ],
    disclaimerPoints: [
      'Use the guidance for self-development — it does not substitute formal leadership evaluations.',
      'Supplement the insights with 360° feedback or coaching for a comprehensive plan.',
      'Work with an executive coach or HR partner for tailored leadership pathways.'
    ],
    crisisSupportMessage:
      'Need tailored support? Partner with a trusted mentor, HR business partner, or certified leadership coach to turn these insights into action.',
    seoTitle: 'Free Leadership Assessment - Discover Your Leadership Style | SelfAtlas',
    seoDescription:
      'Evaluate your leadership strengths with our free research-informed assessment. Receive instant AI guidance on coaching, strategy, and influence — no account required.',
    seoKeywords: [
      'leadership assessment',
      'leadership test',
      'leadership style',
      'leadership development',
      'executive coaching',
      'free leadership test'
    ]
  }
};

const DEFAULT_TEST_CONTENT: TestPageContent = {
  title: 'Career Assessment',
  heroDescription:
    'Free research-informed career assessment with instant AI insights. Use the guidance for exploration — it is not a professional placement service.',
  stats: {
    estimatedMinutes: 10,
    format: 'Single choice',
    insightLabel: 'AI insights'
  },
  instructionPoints: [
    'Answer honestly about your real experiences and goals to unlock useful guidance.',
    'Keep a steady pace — instinctive answers often reveal the clearest insights.',
    'Treat the assessment as a check-in you can revisit as priorities evolve.'
  ],
  theoreticalPoints: [
    'Inspired by established career development and organizational psychology research.',
    'Translates frameworks into practical, easy-to-apply tips for your next step.',
    'Supports self-reflection without replacing professional career services.'
  ],
  disclaimerPoints: [
    'Use the results for exploration — they do not replace career counseling.',
    'No assessment can guarantee outcomes. Combine insights with conversations and research.',
    'Engage certified professionals for tailored coaching or placement.'
  ],
  seoTitle: 'Free Career Assessment | SelfAtlas',
  seoDescription:
    'Take a free research-informed career assessment and receive instant AI insights to guide your next move. Not a placement service and no account required.',
  seoKeywords: ['career assessment', 'career test', 'professional development', 'free career quiz']
};


export interface CareerTestPageProps extends BaseComponentProps {
  onBackToHome?: () => void;
}

export const CareerTestPage: React.FC<CareerTestPageProps> = ({
  onBackToHome
}) => {
  const { testType } = useParams<{ testType: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [startPending, setStartPending] = useState(false);

  const content = useMemo(() => {
    if (!testType) {
      return DEFAULT_TEST_CONTENT;
    }
    return TEST_PAGE_CONTENT[testType] || DEFAULT_TEST_CONTENT;
  }, [testType]);

  const statItems = useMemo(() => {
    const items = ['Free'];

    if (content.stats.estimatedMinutes) {
      items.push(`~${content.stats.estimatedMinutes} min`);
    }

    if (content.stats.format) {
      items.push(content.stats.format);
    }

    if (content.stats.insightLabel) {
      items.push(content.stats.insightLabel);
    }

    return items;
  }, [content.stats]);
  
  // 集成useTestStore
  const { 
    startTest, 
    setQuestions: setStoreQuestions, 
    getTestTypeState, 
    clearAllTestTypeStates,
    clearTestTypeState
  } = useTestStore();

  // Validate test type
  const validTestTypes = Object.values(CareerTestTypeEnum);
  const isValidTestType = testType && validTestTypes.includes(testType as CareerTestType);

  const aboutInfo = useMemo(() => {
    if (!testType) {
      return {
        name: 'Career Assessment',
        description: 'Explore data-backed guidance for your career decisions.'
      };
    }

    switch (testType) {
      case CareerTestTypeEnum.HOLLAND:
        return {
          name: 'Career Interest Insights',
          description: 'Identify the environments where you thrive and align your next role with your interests.'
        };
      case CareerTestTypeEnum.DISC:
        return {
          name: 'Behavioral Style Insights',
          description: 'Understand how you communicate, collaborate, and adapt across different work situations.'
        };
      case CareerTestTypeEnum.LEADERSHIP:
        return {
          name: 'Leadership Growth Insights',
          description: 'Evaluate leadership strengths and prioritize the next skills to grow.'
        };
      default:
        return {
          name: 'Career Assessment',
          description: 'Explore data-backed guidance for your career decisions.'
        };
    }
  }, [testType]);

  // 在页面加载时清理其他测试的状态，确保测试之间不会相互影响
  useEffect(() => {
    if (testType) {
      const currentTestTypeState = getTestTypeState(testType);

      if (!currentTestTypeState.showResults && !currentTestTypeState.isTestStarted) {
        clearAllTestTypeStates();
      } else {
        const allTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'vark', 'love_language', 'love_style', 'interpersonal', 'holland', 'disc', 'leadership'];
        allTestTypes.forEach(type => {
          if (type !== testType) {
            clearTestTypeState(type);
          }
        });
      }
    }
  }, [testType, getTestTypeState, clearAllTestTypeStates, clearTestTypeState]);

  const canonical = buildAbsoluteUrl(`/tests/career/${testType || 'career'}`);

  const seoConfig = useSEO({
    testType: 'career',
    testId: testType || 'career',
    title: content.seoTitle,
    description: content.seoDescription,
    keywords: content.seoKeywords,
    customConfig: {
      canonical,
      ogTitle: content.seoTitle,
      ogDescription: content.seoDescription,
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Test',
      name: content.title,
      description: content.seoDescription,
      category: 'Career Assessment',
      inLanguage: 'en-US',
      provider: {
        '@type': 'Organization',
        name: 'SelfAtlas',
        url: 'https://selfatlas.net'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      educationalLevel: 'Beginner',
      typicalAgeRange: '16-99',
      timeRequired: content.stats.estimatedMinutes ? `PT${content.stats.estimatedMinutes}M` : undefined,
      numberOfQuestions: questions.length > 0 ? questions.length : undefined,
      testFormat: content.stats.format,
      audience: {
        '@type': 'Audience',
        audienceType: 'Career explorers'
      },
      about: {
        '@type': 'Thing',
        name: aboutInfo.name,
        description: aboutInfo.description
      }
    }
  });

  const loadQuestions = useCallback(
    async (options?: { bypassCache?: boolean }) => {
      if (!isValidTestType || !testType) {
        return [] as Question[];
      }

      if (typeof window === 'undefined') {
        return [] as Question[];
      }

      try {
        setLoading(true);
        setError(null);

        const cacheKey = `career_questions_${testType}`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;

        if (!options?.bypassCache) {
          const cachedData = window.localStorage.getItem(cacheKey);
          const cacheTimestamp = window.localStorage.getItem(cacheTimestampKey);

          if (cachedData && cacheTimestamp) {
            const now = Date.now();
            const cacheTime = parseInt(cacheTimestamp, 10);
            const isExpired = now - cacheTime > 3600000;

            if (!isExpired) {
              const parsed = JSON.parse(cachedData) as Question[];

              if (Array.isArray(parsed) && parsed.length > 0) {
                setQuestions(parsed);
                return parsed;
              }

              window.localStorage.removeItem(cacheKey);
              window.localStorage.removeItem(cacheTimestampKey);
            }
          }
        }

        const response = await questionService.getQuestionsByType(testType);

        if (response.success && response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
          window.localStorage.setItem(cacheKey, JSON.stringify(response.data));
          window.localStorage.setItem(cacheTimestampKey, Date.now().toString());
          return response.data as Question[];
        }

        setError(response.error || 'Unable to load questions right now. Please try again.');
        return [] as Question[];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load questions right now. Please try again.');
        return [] as Question[];
      } finally {
        setLoading(false);
      }
    },
    [isValidTestType, testType]
  );

  useEffect(() => {
    if (!testType) {
      return;
    }

    const currentState = getTestTypeState(testType);

    if ((currentState.showResults || currentState.isTestStarted) && questions.length === 0) {
      void loadQuestions();
    }
  }, [testType, getTestTypeState, questions.length, loadQuestions]);

  useEffect(() => {
    if (isValidTestType) {
      void loadQuestions();
    }
  }, [isValidTestType, loadQuestions]);

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  const handleStartTest = useCallback(async () => {
    if (!testType) {
      return;
    }

    try {
      setStartPending(true);
      setError(null);

      let activeQuestions = questions;

      if (activeQuestions.length === 0) {
        activeQuestions = await loadQuestions({ bypassCache: true });
      }

      if (activeQuestions.length === 0) {
        setError('Unable to load questions right now. Please try again.');
        return;
      }

      await startTest(testType, activeQuestions);
      setTestStarted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start test');
    } finally {
      setStartPending(false);
    }
  }, [testType, questions, loadQuestions, startTest]);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/tests/career');
    }
  };

  if (!isValidTestType) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          <div className="flex items-center justify-center min-h-[400px] px-4 text-center">
            <div>
              <div className="text-red-600 text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Invalid Test Type</h2>
              <p className="text-sm text-green-800 mb-4">The test type "{testType}" is not supported. Choose another career assessment to continue.</p>
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-600"
              >
                Return to Career Center
              </button>
            </div>
          </div>
        </CareerTestContainer>
      </>
    );
  }

  const testTypeState = testType ? getTestTypeState(testType) : null;
  const testTypeShowResults = testTypeState?.showResults || false;
  const testTypeIsTestStarted = testTypeState?.isTestStarted || false;

  if (testStarted || testTypeShowResults || testTypeIsTestStarted) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          <Breadcrumb items={getBreadcrumbConfig(`/tests/career/${testType}`)} />

          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">{content.title}</h1>
                <p className="text-xl text-green-700">
                  {testTypeShowResults
                    ? 'Your personalized career assessment results'
                    : 'Please choose the option that best matches your true thoughts and experiences'}
                </p>
              </div>
              <BackToTestsButton onNavigate={navigate} className="ml-4" />
            </div>
          </div>

          <TestContainer testType={testType!} questions={questions} />
        </CareerTestContainer>
      </>
    );
  }

  return (
    <>
      <SEOHead config={seoConfig} />
      <CareerTestContainer>
        <Breadcrumb items={getBreadcrumbConfig(`/tests/career/${testType}`)} />

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3">{content.title}</h1>
            <BackToTestsButton onNavigate={navigate} className="ml-4" />
          </div>
          <p className="text-xl text-green-800 max-w-3xl">{content.heroDescription}</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-green-900">
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
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <span className="text-emerald-500 mr-3">📋</span>
                Test Preparation
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-900">
                {content.instructionPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <span className="text-emerald-500 mr-3">🔬</span>
                Research Background
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-900">
                {content.theoreticalPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <span className="text-emerald-500 mr-3">⚠️</span>
              Important Notices
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-900">
              {content.disclaimerPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-green-700">
              {loading && <span>Preparing questions, please wait.</span>}
              {!loading && error && <span className="text-red-600">{error}</span>}
              {!loading && !error && questions.length > 0 && (
                <span className="text-green-900">{questions.length} questions ready</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => void handleStartTest()}
                disabled={loading || startPending}
                className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-10 py-3 text-base font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startPending || loading ? 'Starting…' : 'Start Free Test'}
              </button>
              {error && (
                <button
                  onClick={() => void loadQuestions({ bypassCache: true })}
                  className="px-4 py-2 text-sm font-semibold text-green-700 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </Card>

        {content.crisisSupportMessage && (
          <div className="p-6 mb-8 bg-emerald-50 border border-emerald-200 rounded-3xl shadow-sm">
            <p className="text-sm text-green-800">{content.crisisSupportMessage}</p>
          </div>
        )}

        <ContextualLinks context="test" className="mt-8" />
      </CareerTestContainer>
    </>
  );
};



