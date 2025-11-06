import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigateFunction } from 'react-router-dom';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
// 移除顶部导航，改为右上角返回按钮以对齐Tarot模块
import { PsychologyTestContainer } from './PsychologyTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { ContextualLinks } from '@/components/InternalLinks';
import { buildAbsoluteUrl } from '@/config/seo';

interface GenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

// 页面内容配置接口
interface TestPageContent {
  heroDescription: string;
  stats: {
    estimatedMinutes: number;
    format: string;
    insightLabel: string;
  };
  instructionPoints: string[];
  theoreticalPoints: string[];
  disclaimerPoints: string[];
  crisisSupportMessage?: string;
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
      onNavigate('/tests');
    }
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className || ''}`}
      aria-label="Back to tests"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Tests
    </button>
  );
};

// 心理学模块各测试准备信息配置
const TEST_PAGE_CONTENT: Record<string, TestPageContent> = {
  mbti: {
    heroDescription:
      'Free research-informed MBTI assessment with instant, personalized insights. No account needed and not a medical diagnosis.',
    stats: {
      estimatedMinutes: 12,
      format: 'Single choice',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Answer based on your natural preferences without overthinking.',
      'There are no right or wrong answers — focus on authenticity.',
      'Try to complete the test in one sitting for more consistent results.'
    ],
    theoreticalPoints: [
      'Built on Carl Jung’s theory of psychological types.',
      'Measures four preference pairs: EI, SN, TF, and JP.',
      'Provides a 16-type framework for self-reflection and communication.'
    ],
    disclaimerPoints: [
      'For educational and self-reflection purposes only — not a medical diagnosis.',
      'Use results as guidance rather than definitive labels.',
      'Consult a mental health professional if you need clinical support.'
    ]
  },
  phq9: {
    heroDescription:
      'Free PHQ-9 depression self-screening. Research-informed guidance with instant results. Not a medical diagnosis.',
    stats: {
      estimatedMinutes: 5,
      format: 'Single choice',
      insightLabel: 'Automated scoring'
    },
    instructionPoints: [
      'Reflect on your experiences over the past two weeks for each item.',
      'Choose the option that best matches how often you experienced each symptom.',
      'Complete the test in a calm space to consider each question carefully.'
    ],
    theoreticalPoints: [
      'Aligned with the PHQ-9 clinical screening instrument.',
      'Widely used by healthcare providers to assess depressive symptom severity.',
      'Supports early self-screening and prompts professional follow-up when needed.'
    ],
    disclaimerPoints: [
      'This screening is informational and does not replace professional diagnosis.',
      'If you experience severe or persistent symptoms, seek medical help immediately.',
      'Contact local emergency services or crisis hotlines in urgent situations.'
    ],
    crisisSupportMessage:
      'Need urgent support? Contact local emergency services or reach out to mental health hotlines in your region.'
  },
  eq: {
    heroDescription:
      'Free emotional intelligence assessment to understand awareness, regulation, and social skills. Instant insights, no account required.',
    stats: {
      estimatedMinutes: 12,
      format: 'Single choice',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Answer honestly about how you typically respond in emotional situations.',
      'Focus on real experiences rather than ideal behaviors.',
      'Take your time to reflect on personal patterns and relationships.'
    ],
    theoreticalPoints: [
      'Inspired by research from Daniel Goleman and Salovey & Mayer.',
      'Covers self-awareness, self-management, social awareness, and relationship management.',
      'Designed to provide actionable guidance for emotional growth.'
    ],
    disclaimerPoints: [
      'Use insights for personal development and coaching conversations.',
      'Results are not a substitute for therapy or clinical evaluation.',
      'Seek professional support if you face ongoing emotional challenges.'
    ]
  },
  happiness: {
    heroDescription:
      'Free happiness assessment grounded in positive psychology. Discover what supports your well-being.',
    stats: {
      estimatedMinutes: 10,
      format: 'Single choice',
      insightLabel: 'AI insights'
    },
    instructionPoints: [
      'Consider your overall life satisfaction and day-to-day experiences.',
      'Choose the option that best represents how you feel most of the time.',
      'Review results in a quiet moment to identify helpful next steps.'
    ],
    theoreticalPoints: [
      'Based on PERMA and positive psychology research from Martin Seligman and peers.',
      'Explores five well-being dimensions: Positive emotion, Engagement, Relationships, Meaning, and Accomplishment.',
      'Helps you identify areas that strengthen your happiness over time.'
    ],
    disclaimerPoints: [
      'Insights support self-reflection and lifestyle planning.',
      'Well-being results are not clinical advice or therapy.',
      'Consult professionals for mental health or counseling needs.'
    ]
  }
};

const DEFAULT_TEST_CONTENT: TestPageContent = {
  heroDescription:
    'Free research-informed psychological assessment with instant AI insights. Not a medical diagnosis and no account needed.',
  stats: {
    estimatedMinutes: 10,
    format: 'Single choice',
    insightLabel: 'AI insights'
  },
  instructionPoints: [
    'Answer honestly based on your true thoughts and feelings.',
    'Trust your instinctive response for the most accurate insights.',
    'Complete the test in a quiet environment without distractions.'
  ],
  theoreticalPoints: [
    'Grounded in research-informed psychological frameworks.',
    'Designed to translate complex theories into practical insights.',
    'Supports personal reflection and growth.'
  ],
  disclaimerPoints: [
    'For educational and self-reflection purposes only.',
    'Results do not replace professional counseling or medical care.',
    'Seek qualified help if you experience significant distress.'
  ]
};

export const GenericTestPage: React.FC<GenericTestPageProps> = ({ 
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
  const content = useMemo(() => TEST_PAGE_CONTENT[testType] || DEFAULT_TEST_CONTENT, [testType]);
  
  // 集成useTestStore
  const { 
    startTest, 
    setQuestions: setStoreQuestions, 
    getTestTypeState, 
    clearAllTestTypeStates,
    clearTestTypeState
  } = useTestStore();
  
  // SEO配置 - 根据测试类型生成不同的标题和描述
  const getSEOConfig = (testType: string) => {
    const seoConfigs: Record<string, { title: string; description: string; keywords: string[] }> = {
      'mbti': {
        title: `Free MBTI Personality Test - 16 Types Assessment | SelfAtlas`,
        description: 'Discover your MBTI personality type with our free 16-personality test. Get detailed insights into your cognitive functions, strengths, and growth areas. Instant results, no account needed.',
        keywords: [
          'mbti test',
          '16 personalities',
          'mbti personality test',
          'myers briggs test',
          'personality assessment',
          'mbti types',
          'cognitive functions'
        ]
      },
      'phq9': {
        title: `Free PHQ-9 Depression Screening Test | SelfAtlas`,
        description: 'Take a free PHQ-9 depression screening test. This validated clinical tool helps assess depression symptoms. Get insights and guidance. Not a substitute for professional medical advice.',
        keywords: [
          'phq9 test',
          'depression screening',
          'depression test',
          'mental health assessment',
          'depression symptoms',
          'phq 9 questionnaire',
          'clinical depression test'
        ]
      },
      'eq': {
        title: `Free Emotional Intelligence (EQ) Test | SelfAtlas`,
        description: 'Assess your emotional intelligence with our free EQ test. Measure self-awareness, self-management, social awareness, and relationship management. Get personalized EQ insights.',
        keywords: [
          'eq test',
          'emotional intelligence test',
          'emotional quotient',
          'eq assessment',
          'emotional intelligence',
          'eq score',
          'emotional awareness test'
        ]
      },
      'happiness': {
        title: `Free Happiness Assessment Test | SelfAtlas`,
        description: 'Measure your happiness levels with our research-based assessment. Discover factors that contribute to your well-being and get personalized recommendations for greater life satisfaction.',
        keywords: [
          'happiness test',
          'happiness assessment',
          'well-being test',
          'life satisfaction test',
          'happiness questionnaire',
          'positive psychology test',
          'subjective well-being'
        ]
      },
      'vark': {
        title: `Free VARK Learning Styles Test | SelfAtlas`,
        description: 'Discover your learning style with the VARK test. Identify whether you prefer visual, auditory, reading/writing, or kinesthetic learning. Get personalized study strategies.',
        keywords: [
          'vark test',
          'learning styles test',
          'learning style assessment',
          'vark questionnaire',
          'visual learner test',
          'learning preferences',
          'study style test'
        ]
      }
    };
    
    return seoConfigs[testType] || {
      title: `Free ${title} - Psychological Assessment | SelfAtlas`,
      description: description || 'Take a free psychological assessment to gain insights into your personality, mental health, or behavior. Get personalized results and recommendations.',
      keywords: ['psychological test', 'personality test', 'mental health assessment', 'psychology test']
    };
  };

  const seoData = getSEOConfig(testType);
  const canonical = buildAbsoluteUrl(`/tests/psychology/${testType}`);
  
  // SEO配置
  const seoConfig = useSEO({
    testType: 'psychology',
    testId: testType,
    title: seoData.title,
    description: seoData.description || content.heroDescription,
    keywords: seoData.keywords,
    customConfig: {
      canonical: canonical,
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
      category: 'Psychological Test',
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
      testFormat: testType === 'mbti' ? 'Single choice' : 
                  testType === 'phq9' ? 'Single choice' : 
                  testType === 'eq' ? 'Single choice' :
                  testType === 'happiness' ? 'Single choice' :
                  'Multiple choice',
      about: {
        '@type': 'Thing',
        name: testType === 'mbti' ? 'Personality Assessment' :
              testType === 'phq9' ? 'Depression Screening' :
              testType === 'eq' ? 'Emotional Intelligence' :
              'Psychological Assessment'
      }
    }
  });

  // 在页面加载时清理其他测试的状态，确保测试之间不会相互影响
  useEffect(() => {
    // 清理所有其他测试类型的状态，只保留当前测试类型的状态
    const currentTestTypeState = getTestTypeState(testType);
    
    // 如果当前测试类型没有状态，清理所有状态
    if (!currentTestTypeState.showResults && !currentTestTypeState.isTestStarted) {
      clearAllTestTypeStates();
    } else {
      // 如果当前测试类型有状态，只清理其他测试类型的状态
      const allTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'vark', 'love_language', 'love_style', 'interpersonal', 'holland', 'disc', 'leadership'];
      allTestTypes.forEach(type => {
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

        const cacheKey = `psychology_questions_${testType}`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;

        if (!options?.bypassCache) {
          const cachedData = localStorage.getItem(cacheKey);
          const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

          if (cachedData && cacheTimestamp) {
            const now = Date.now();
            const cacheTime = parseInt(cacheTimestamp);
            const isExpired = now - cacheTime > 3600000;

            if (!isExpired) {
              const parsed = JSON.parse(cachedData) as Question[];
              setQuestions(parsed);

              const base = buildBaseContext();
              trackEvent({
                eventType: 'page_view',
                ...base,
                data: { route: `/tests/psychology/${testType}`, pageType: 'test' }
              });

              return parsed;
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
            data: { route: `/tests/psychology/${testType}`, pageType: 'test' }
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

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  // 获取当前测试类型的特定状态
  const testTypeState = getTestTypeState(testType);
  const testTypeShowResults = testTypeState.showResults;
  const testTypeIsTestStarted = testTypeState.isTestStarted;
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
      // 静默处理，错误信息通过状态提示
    } finally {
      setStartPending(false);
    }
  }, [loadQuestions, questions, startTest, testType]);
  
  // 如果测试已开始或显示结果，显示测试容器
  if (testStarted || testTypeShowResults || testTypeIsTestStarted) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <PsychologyTestContainer>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig(`/tests/psychology/${testType}`)} />
        
        {/* 顶部标题 + 返回首页按钮 */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">{title}</h1>
              <p className="text-xl text-blue-700">
                {testTypeShowResults 
                  ? "Your personalized emotional intelligence assessment results"
                  : "Please choose the option that best matches your true thoughts and feelings"
                }
              </p>
            </div>
            <BackToTestsButton onNavigate={navigate} className="ml-4" />
          </div>
        </div>

        <TestContainer
          testType={testType}
          questions={questions}
        />
      </PsychologyTestContainer>
      </>
    );
  }

  // 显示完整的测试准备界面
  return (
    <>
      <SEOHead config={seoConfig} />
      <PsychologyTestContainer>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig(`/tests/psychology/${testType}`)} />
      
      {/* 顶部标题 + 右上角返回按钮（对齐Tarot） */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">{title}</h1>
          <BackToTestsButton onNavigate={navigate} className="ml-4" />
        </div>
        <p className="text-xl text-blue-800 max-w-3xl">{content.heroDescription}</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-blue-800">
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
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <span className="text-blue-500 mr-3">📋</span>
              Test Preparation
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
              {content.instructionPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <span className="text-blue-500 mr-3">🔬</span>
              Research Background
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
              {content.theoreticalPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <span className="text-blue-500 mr-3">⚠️</span>
            Important Notices
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
            {content.disclaimerPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-blue-700">
            {loading && <span>Preparing questions, please wait.</span>}
            {!loading && error && (
              <span className="text-red-600">Unable to load questions right now. Please try again.</span>
            )}
            {!loading && !error && questions.length > 0 && (
              <span className="text-blue-900">{questions.length} questions ready</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartTest}
              disabled={loading || startPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-10 py-3 text-base font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {startPending ? 'Starting…' : 'Start Free Test'}
            </button>
            {error && (
              <button
                onClick={() => void loadQuestions({ bypassCache: true })}
                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </Card>

      {content.crisisSupportMessage && (
        <div className="p-6 mb-8 bg-blue-50 border border-blue-200 rounded-3xl shadow-sm">
          <p className="text-sm text-blue-800">
            {content.crisisSupportMessage}
          </p>
        </div>
      )}

      {/* Related content - consistent UI spacing */}
      <ContextualLinks 
        context="test" 
        className="mt-8"
      />
    </PsychologyTestContainer>
    </>
  );
};
