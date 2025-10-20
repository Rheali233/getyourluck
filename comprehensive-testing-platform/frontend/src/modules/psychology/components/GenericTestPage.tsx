import React, { useState, useEffect } from 'react';
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
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

interface GenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

export const GenericTestPage: React.FC<GenericTestPageProps> = ({ 
  testType, 
  title, 
  description 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  
  // 集成useTestStore
  const { 
    startTest, 
    setQuestions: setStoreQuestions, 
    getTestTypeState, 
    clearAllTestTypeStates,
    clearTestTypeState
  } = useTestStore();
  
  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'test',
    testType: testType,
    customKeywords: ['psychological assessment', 'personality test', 'mental health evaluation']
  });
  
  // SEO配置
  const seoConfig = useSEO({
    testType: 'psychology',
    testId: testType,
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Test',
      name: title,
      description: description || 'Professional psychological test',
      category: 'Psychological Test',
      provider: {
        '@type': 'Organization',
        name: 'Comprehensive Testing Platform',
        url: 'https://selfatlas.com'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      educationalLevel: 'Beginner',
      typicalAgeRange: '16-99',
      timeRequired: `PT${Math.ceil(questions.length * 15 / 60)}M`,
      numberOfQuestions: questions.length,
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
          get().clearTestTypeState(type);
        }
      });
    }
  }, [testType, getTestTypeState, clearAllTestTypeStates, clearTestTypeState]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        
        // 检查缓存
        const cacheKey = `psychology_questions_${testType}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        
        // 如果缓存存在且未过期（1小时内）
        if (cachedData && cacheTimestamp) {
          const now = Date.now();
          const cacheTime = parseInt(cacheTimestamp);
          const isExpired = (now - cacheTime) > 3600000; // 1小时
          
          if (!isExpired) {
            const questions = JSON.parse(cachedData);
            setQuestions(questions);
            setLoading(false);
            
            // 记录页面访问
            const base = buildBaseContext();
            trackEvent({
              eventType: 'page_view',
              ...base,
              data: { route: `/psychology/${testType}`, pageType: 'test' },
            });
            return;
          }
        }
        
        // 调用后端API获取测试问题
        const response = await questionService.getQuestionsByType(testType);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
          
          // 缓存数据
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
          
          // 记录页面访问
          const base = buildBaseContext();
          trackEvent({
            eventType: 'page_view',
            ...base,
            data: { route: `/psychology/${testType}`, pageType: 'test' },
          });
        } else {
          setError(response.error || 'Failed to load questions');
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [testType]);

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  if (loading) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <PsychologyTestContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Loading Test Questions</h3>
              <p className="text-blue-700 mb-4">Preparing your personalized assessment...</p>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-sm text-blue-600 mt-2">This will only take a moment</p>
            </div>
          </div>
        </PsychologyTestContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <PsychologyTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Error Loading Test</h2>
            <p className="text-sm text-blue-800 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </PsychologyTestContainer>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <PsychologyTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">No Questions Available</h2>
            <p className="text-sm text-blue-800">This test is not yet available or under maintenance.</p>
          </div>
        </div>
      </PsychologyTestContainer>
      </>
    );
  }

  // 获取当前测试类型的特定状态
  const testTypeState = getTestTypeState(testType);
  const testTypeShowResults = testTypeState.showResults;
  const testTypeIsTestStarted = testTypeState.isTestStarted;
  
  // 如果测试已开始或显示结果，显示测试容器
  if (testStarted || testTypeShowResults || testTypeIsTestStarted) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <PsychologyTestContainer>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig(`/psychology/${testType}`)} />
        
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
            <button onClick={() => window.location.assign('/psychology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-blue-800 font-semibold hover:hover:bg-white/80 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
        </div>

        <TestContainer
          testType={testType}
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
      <Breadcrumb items={getBreadcrumbConfig(`/psychology/${testType}`)} />
      
      {/* 顶部标题 + 右上角返回按钮（对齐Tarot） */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">{title}</h1>
          <button onClick={() => window.location.assign('/psychology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-blue-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        {description && (
          <p className="text-xl text-blue-800 max-w-3xl">{description}</p>
        )}
      </div>

          {/* 模块一：测试信息、说明和开始按钮 */}
          <Card className="p-8 mb-8">
            
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">{questions.length}</div>
                  <div className="text-sm text-blue-800 font-medium">Total Questions</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-blue-900 mb-2">{Math.ceil(questions.length * 15 / 60)} min</div>
                  <div className="text-sm text-blue-800 font-medium">Estimated Time</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <div className="text-lg font-bold text-blue-900 mb-2">
                    {testType === 'mbti' ? 'Single choice' : 
                     testType === 'phq9' ? 'Single choice' : 
                     testType === 'eq' ? 'Single choice' :
                     testType === 'happiness' ? 'Single choice' :
                     'Multiple choice'}
                  </div>
                  <div className="text-sm text-blue-800 font-medium">Test Format</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              {/* Test Instructions */}
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-6 flex items-center">
                  <span className="text-blue-500 mr-3">📋</span>
                  Test Instructions
                </h3>
                <div className="text-blue-800 space-y-3">
                  <p className="leading-tight">Answer honestly based on your true thoughts and feelings, rather than what you think you should answer or how others might expect you to respond.</p>
                  <p className="leading-tight">Trust your first instinct and avoid overanalyzing each question, as the most accurate results come from your natural response.</p>
                  <p className="leading-tight">There are no right or wrong answers in this assessment, and each response simply reflects your personal preferences and tendencies.</p>
                </div>
              </div>

              {/* Theoretical Basis */}
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-6 flex items-center">
                  <span className="text-blue-500 mr-3">🔬</span>
                  Theoretical Basis
                </h3>
                <div className="text-blue-800 space-y-3">
                  <p className="leading-tight">Based on Carl Jung's theory of psychological types, developed by Isabel Briggs Myers and Katharine Cook Briggs.</p>
                  <p className="leading-tight">This assessment measures preferences across four dimensions: Extraversion-Introversion, Sensing-Intuition, Thinking-Feeling, and Judging-Perceiving.</p>
                  <p className="leading-tight">Designed to help individuals understand their personality preferences and how they interact with the world.</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button 
                onClick={async () => {
                  try {
                    await startTest(testType, questions);
                    setTestStarted(true);
                  const base = buildBaseContext();
                  trackEvent({
                    eventType: 'test_start',
                    ...base,
                    data: { testType },
                  });
                  } catch (error) {
                    // 静默处理错误，用户界面已经通过状态管理显示错误
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-16 py-4 text-lg font-bold rounded-lg hover:transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Test
              </button>
            </div>
          </Card>



      {/* 模块三：重要声明 */}
      <div className="p-8 mb-8 bg-blue-50 border border-blue-200 rounded-3xl shadow-sm">
        <h3 className="text-lg font-medium text-blue-900 mb-8">Important Disclaimers</h3>
        <div className="text-blue-800 space-y-3">
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">⚠️</span>
            <span><span className="font-semibold text-blue-900">Not Medical Diagnosis:</span> This test is for educational and self-discovery purposes only. It does not constitute medical, psychological, or professional diagnosis.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🔒</span>
            <span><span className="font-semibold text-blue-900">Privacy Protection:</span> Your responses are confidential and will not be shared with third parties without your explicit consent.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">📚</span>
            <span><span className="font-semibold text-blue-900">Educational Tool:</span> Results should be used as a starting point for self-reflection and personal development, not as definitive personality labels.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🆘</span>
            <span><span className="font-semibold text-blue-900">Seek Professional Help:</span> If you're experiencing significant distress or mental health concerns, please consult with a qualified mental health professional.</span>
          </p>
        </div>
      </div>
    </PsychologyTestContainer>
    </>
  );
};
