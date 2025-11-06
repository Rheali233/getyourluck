import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import type { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
// 移除顶部导航，改为右上角返回按钮以对齐Psychology模块
import { RelationshipTestContainer } from './RelationshipTestContainer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { ContextualLinks } from '@/components/InternalLinks';
import { buildAbsoluteUrl } from '@/config/seo';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';

interface RelationshipGenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

// 返回测试列表按钮组件
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
      onNavigate('/tests');
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-4 py-2 text-sm font-semibold text-pink-800 transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${className || ''}`}
      aria-label="Back to tests"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Tests
    </button>
  );
};

// 准备页内容配置
interface TestPageContent {
  heroDescription: string;
  stats: {
    estimatedMinutes: number;
    format: string;
    insightLabel: string;
  };
  questionCount?: number;
  instructionPoints: string[];
  theoreticalPoints: string[];
  disclaimerPoints: string[];
  crisisSupportMessage?: string;
}

const TEST_PAGE_CONTENT: Record<string, TestPageContent> = {
  love_language: {
    heroDescription:
      'Free research-informed love language test delivering instant relationship insights. Understand your connection preferences — not a diagnosis or therapy.',
    stats: {
      estimatedMinutes: 8,
      format: 'Single choice',
      insightLabel: 'Instant insights'
    },
    questionCount: 30,
    instructionPoints: [
      'Answer honestly about how you naturally give and receive love without overthinking.',
      'Focus on what feels meaningful to you instead of what you think should matter.',
      'Complete the questions in one sitting to capture your current patterns.'
    ],
    theoreticalPoints: [
      'Grounded in Gary Chapman’s five love languages framework.',
      'Explores acts of service, words of affirmation, quality time, gifts, and physical touch.',
      'Helps partners translate everyday gestures into aligned emotional support.'
    ],
    disclaimerPoints: [
      'For educational and self-reflection purposes only — not a diagnosis or professional counseling.',
      'Use results to guide conversations, not to label partners or force behavior changes.',
      'Seek licensed guidance if relationship conflict impacts your wellbeing.'
    ]
  },
  love_style: {
    heroDescription:
      'Free research-informed love style assessment with instant insights into romantic patterns. No account required and not a diagnosis.',
    stats: {
      estimatedMinutes: 10,
      format: 'Single choice',
      insightLabel: 'Instant insights'
    },
    questionCount: 30,
    instructionPoints: [
      'Reflect on how you typically approach intimacy, commitment, and emotional expression.',
      'Select the response that represents your natural tendencies rather than ideal behavior.',
      'Consider past and present relationships to surface consistent style themes.'
    ],
    theoreticalPoints: [
      'Built on John Alan Lee’s six love styles and modern attachment research.',
      'Highlights Eros, Ludus, Storge, Pragma, Mania, and Agape tendencies in combination.',
      'Supports self-awareness and communication planning for current or future partners.'
    ],
    disclaimerPoints: [
      'Insights are informational guidance and not professional diagnosis or therapy.',
      'Growth often requires ongoing dialogue with partners, mentors, or counselors.',
      'If relationship challenges affect wellbeing, seek qualified professional support.'
    ]
  },
  interpersonal: {
    heroDescription:
      'Free research-informed interpersonal skills assessment with instant feedback. Strengthen communication habits — this is not a diagnosis.',
    stats: {
      estimatedMinutes: 12,
      format: 'Single choice',
      insightLabel: 'Instant insights'
    },
    questionCount: 30,
    instructionPoints: [
      'Think about everyday interactions at home, work, and social settings.',
      'Choose the option that reflects your typical communication style most of the time.',
      'Stay consistent across questions to reveal reliable interpersonal themes.'
    ],
    theoreticalPoints: [
      'Informed by social psychology and emotional intelligence research.',
      'Covers empathy, assertion, conflict navigation, and collaborative dialogue.',
      'Transforms academic findings into actionable communication strategies.'
    ],
    disclaimerPoints: [
      'Results are for personal development and not clinical assessment.',
      'Use the guidance to support coaching conversations or habit-building plans.',
      'Seek professional counseling if social challenges affect safety or wellbeing.'
    ],
    crisisSupportMessage:
      'Need urgent relationship or emotional support? Reach out to trusted contacts, local counselors, or emergency services in your region.'
  }
};

const DEFAULT_TEST_CONTENT: TestPageContent = {
  heroDescription:
    'Free research-informed relationship assessment offering instant insights. Built for self-reflection — not a diagnosis or professional therapy.',
  stats: {
    estimatedMinutes: 10,
    format: 'Single choice',
    insightLabel: 'Instant insights'
  },
  questionCount: 30,
  instructionPoints: [
    'Respond based on your genuine experiences in close relationships.',
    'There are no right or wrong answers — authenticity supports better insights.',
    'Complete the test in a calm environment to reflect clearly.'
  ],
  theoreticalPoints: [
    'Inspired by modern relationship science and positive psychology.',
    'Combines evidence-based frameworks with practical coaching takeaways.',
    'Helps surface strengths and growth areas for communication and connection.'
  ],
  disclaimerPoints: [
    'For education and instant guidance only — not professional counseling.',
    'Results complement, not replace, conversations with partners or therapists.',
    'If relationships affect your safety or mental health, contact professionals immediately.'
  ]
};

export const RelationshipGenericTestPage: React.FC<RelationshipGenericTestPageProps> = ({
  testType,
  title,
  description
}) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [startPending, setStartPending] = useState(false);

  const breadcrumbPath = `/tests/relationship/${testType.replace(/_/g, '-')}`;
  const breadcrumbItems = getBreadcrumbConfig(breadcrumbPath);
  const content = useMemo(() => TEST_PAGE_CONTENT[testType] || DEFAULT_TEST_CONTENT, [testType]);

  // 集成useTestStore
  const {
    startTest,
    setQuestions: setStoreQuestions,
    getTestTypeState,
    clearAllTestTypeStates,
    clearTestTypeState
  } = useTestStore();

  // 页面加载时清理其他测试状态
  useEffect(() => {
    const currentTestTypeState = getTestTypeState(testType);

    if (!currentTestTypeState.showResults && !currentTestTypeState.isTestStarted) {
      clearAllTestTypeStates();
    } else {
      const allTestTypes = [
        'mbti',
        'phq9',
        'eq',
        'happiness',
        'vark',
        'love_language',
        'love_style',
        'interpersonal',
        'holland',
        'disc',
        'leadership'
      ];
      allTestTypes.forEach((type) => {
        if (type !== testType) {
          clearTestTypeState(type);
        }
      });
    }
  }, [testType, getTestTypeState, clearAllTestTypeStates, clearTestTypeState]);

  const loadQuestions = useCallback(
    async (options?: { bypassCache?: boolean }) => {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `relationship_questions_${testType}`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;

        if (!options?.bypassCache) {
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

          if (cachedData && cacheTimestamp) {
            const now = Date.now();
            const cacheTime = parseInt(cacheTimestamp, 10);
            const isExpired = now - cacheTime > 3600000;

            if (!isExpired) {
              const parsed = JSON.parse(cachedData) as Question[];

              if (Array.isArray(parsed) && parsed.length > 0) {
                setQuestions(parsed);

                const base = buildBaseContext();
                trackEvent({
                  eventType: 'page_view',
                  ...base,
                  data: { route: `/tests/relationship/${testType}`, pageType: 'test' }
                });

                return parsed;
              }

              localStorage.removeItem(cacheKey);
              localStorage.removeItem(cacheTimestampKey);
            }
          }
        }

        const response = await questionService.getQuestionsByType(testType);

        if (response.success && response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(cacheTimestampKey, Date.now().toString());

          const base = buildBaseContext();
          trackEvent({
            eventType: 'page_view',
            ...base,
            data: { route: `/tests/relationship/${testType}`, pageType: 'test' }
          });

          return response.data as Question[];
        }

        setError(response.error || 'Failed to load questions');
        return [];
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [testType]
  );

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  // 同步题目到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  // 结果展示状态保持
  useEffect(() => {
    const testTypeState = getTestTypeState(testType);
    if (testTypeState.showResults || testTypeState.currentTestResult) {
      setTestStarted(true);
    }
  }, [testType, getTestTypeState]);

  const testTypeState = getTestTypeState(testType);
  const testTypeShowResults = testTypeState.showResults;
  const testTypeIsTestStarted = testTypeState.isTestStarted;

  const statItems = useMemo(() => {
    const items = ['Free', 'Research-informed'];

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
  
  const waitingForQuestions = useMemo(() => {
    if (loading) {
      return true;
    }

    if (error) {
      return false;
    }

    return questions.length === 0;
  }, [error, loading, questions.length]);

  const handleStartTest = useCallback(async () => {
    try {
      setStartPending(true);

      let activeQuestions = questions;

      if (activeQuestions.length === 0) {
        activeQuestions = await loadQuestions({ bypassCache: true });
      }

      if (activeQuestions.length === 0) {
        setStartPending(false);
        return;
      }

      await startTest(testType, activeQuestions);
      setTestStarted(true);

      const base = buildBaseContext();
      trackEvent({
        eventType: 'test_start',
        ...base,
        data: { testType }
      });
    } catch {
      // 静默处理，界面已有错误提示
    } finally {
      setStartPending(false);
    }
  }, [loadQuestions, questions, startTest, testType]);

  const getSEOConfig = (activeTestType: string) => {
    const seoConfigs: Record<string, { title: string; description: string; keywords: string[] }> = {
      love_language: {
        title: 'Free Love Language Test with Instant Insights | SelfAtlas',
        description:
          'Discover your primary love language with this free, research-informed assessment. Gain instant insights to strengthen your relationships. Not professional counseling.',
        keywords: [
          'love language test',
          'free love language assessment',
          'relationship communication test',
          'gary chapman love languages',
          'instant relationship insights'
        ]
      },
      love_style: {
        title: 'Free Love Style Assessment for Relationship Patterns | SelfAtlas',
        description:
          'Understand your romantic patterns with a free love style assessment. Research-informed insights delivered instantly. Not a diagnosis or therapy.',
        keywords: [
          'love style assessment',
          'relationship style test',
          'romantic compatibility insight',
          'love style quiz',
          'free relationship assessment'
        ]
      },
      interpersonal: {
        title: 'Free Interpersonal Skills Test with Instant Feedback | SelfAtlas',
        description:
          'Evaluate your interpersonal skills and communication tendencies with this free, research-informed test. Receive instant insights to improve connection. Not a diagnosis.',
        keywords: [
          'interpersonal skills test',
          'communication assessment',
          'relationship skills quiz',
          'social intelligence test',
          'free interpersonal assessment'
        ]
      }
    };

    return seoConfigs[activeTestType] || {
      title: `Free ${title} | SelfAtlas`,
      description:
        description || 'Explore a free, research-informed relationship assessment and receive instant insights to support meaningful connections. Not a diagnosis.',
      keywords: ['relationship test', 'free relationship assessment', 'instant relationship insights']
    };
  };

  const seoData = getSEOConfig(testType);
  const canonical = buildAbsoluteUrl(`/tests/relationship/${testType}`);

  const seoConfig = useSEO({
    testType: 'relationship',
    testId: testType,
    title: seoData.title,
    description: seoData.description || content.heroDescription,
    keywords: seoData.keywords,
    customConfig: {
      canonical,
      ogTitle: seoData.title,
      ogDescription: seoData.description || content.heroDescription,
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Test',
      name: title,
      description: description || content.heroDescription,
      category: 'Relationship Test',
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
      numberOfQuestions: questions.length || undefined,
      testFormat: content.stats.format,
      about: {
        '@type': 'Thing',
        name:
          testType === 'love_language'
            ? 'Love Language Assessment'
            : testType === 'love_style'
            ? 'Romantic Relationship Styles'
            : testType === 'interpersonal'
            ? 'Interpersonal Communication Skills'
            : 'Relationship Assessment'
      }
    }
  });

  if (testStarted || testTypeShowResults || testTypeIsTestStarted) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <RelationshipTestContainer>
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-2">{title}</h1>
                <p className="text-xl text-pink-700">
                  {testTypeShowResults
                    ? 'Your personalized relationship assessment results'
                    : 'Please choose the option that best matches your true thoughts and feelings'}
                </p>
              </div>
              <BackToTestsButton onNavigate={navigate} className="ml-4" />
            </div>
          </div>

          <TestContainer testType={testType} questions={questions} />
        </RelationshipTestContainer>
      </>
    );
  }

  return (
    <>
      <SEOHead config={seoConfig} />
      <RelationshipTestContainer>
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-pink-900 mb-3">{title}</h1>
            <BackToTestsButton onNavigate={navigate} className="ml-4" />
          </div>
          <p className="text-xl text-pink-800 max-w-3xl">{description || content.heroDescription}</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-pink-800">
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
              <h2 className="text-lg font-semibold text-pink-900 mb-4 flex items-center">
                <span className="text-pink-500 mr-3">📋</span>
                Test Preparation
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-pink-900">
                {content.instructionPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-pink-900 mb-4 flex items-center">
                <span className="text-pink-500 mr-3">🔬</span>
                Research Background
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-pink-900">
                {content.theoreticalPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-pink-900 mb-3 flex items-center">
              <span className="text-pink-500 mr-3">⚠️</span>
              Important Notices
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-pink-900">
              {content.disclaimerPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className={waitingForQuestions ? 'text-sm text-pink-700' : error ? 'text-sm text-red-600' : 'text-sm text-pink-900 font-semibold'}>
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
                onClick={handleStartTest}
                disabled={loading || startPending}
                className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-10 py-3 text-base font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {startPending ? 'Starting…' : 'Start Free Test'}
              </button>
              {error && (
                <button
                  onClick={() => void loadQuestions({ bypassCache: true })}
                  className="px-4 py-2 text-sm font-semibold text-pink-700 bg-white border border-pink-200 rounded-lg hover:bg-pink-50"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </Card>

        {content.crisisSupportMessage && (
          <div className="p-6 mb-8 bg-pink-50 border border-pink-200 rounded-3xl shadow-sm">
            <p className="text-sm text-pink-800">{content.crisisSupportMessage}</p>
          </div>
        )}

        <ContextualLinks context="test" className="mt-8" />
      </RelationshipTestContainer>
    </>
  );
};

