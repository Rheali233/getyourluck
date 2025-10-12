/**
 * Career Test Page Component
 * Main test page for career testing module
 * Updated to match Psychology module GenericTestPage with green theme
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { CareerTestContainer } from './CareerTestContainer';
import { CareerTestTypeEnum } from '../types';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';


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
  
  // 集成useTestStore
  const { startTest, setQuestions: setStoreQuestions, showResults } = useTestStore();

  // Validate test type
  const validTestTypes = Object.values(CareerTestTypeEnum);
  const isValidTestType = testType && validTestTypes.includes(testType as CareerTestTypeEnum);

  // Get test title and description
  const getTestInfo = (testType: string) => {
    const testInfo = {
      [CareerTestTypeEnum.HOLLAND]: {
        title: 'Holland Career Interest Test',
        description: 'Discover your career interests and find the perfect job match'
      },
      [CareerTestTypeEnum.DISC]: {
        title: 'DISC Behavioral Style Assessment',
        description: 'Understand your work style and improve team collaboration'
      },
      [CareerTestTypeEnum.LEADERSHIP]: {
        title: 'Leadership Assessment',
        description: 'Evaluate your leadership potential and development areas'
      }
    };
    return testInfo[testType as CareerTestTypeEnum] || { title: 'Career Test', description: '' };
  };

  const testInfo = getTestInfo(testType || '');

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'test',
    testType: testType || 'career',
    customKeywords: ['career assessment', 'job matching', 'professional development']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'career',
    testId: testType || 'career',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Test',
      name: testInfo.title,
      description: testInfo.description,
      category: 'Career Assessment',
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
      testFormat: 'Multiple choice',
      about: {
        '@type': 'Thing',
        name: testType === 'holland' ? 'Career Interest Assessment' :
              testType === 'disc' ? 'Behavioral Style Assessment' :
              testType === 'leadership' ? 'Leadership Assessment' :
              'Career Assessment'
      }
    }
  });

  useEffect(() => {
    const loadQuestions = async () => {
      if (!isValidTestType) return;
      
      try {
        setLoading(true);
        // 调用后端API获取测试问题
        const response = await questionService.getQuestionsByType(testType!);
        
        if (response.success && response.data && Array.isArray(response.data)) {
          setQuestions(response.data);
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
  }, [testType, isValidTestType]);

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  // Handle back to home
  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/career');
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-green-800">Loading test questions...</p>
            </div>
          </div>
        </CareerTestContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">Error Loading Test</h2>
              <p className="text-sm text-green-800 mb-4">{error}</p>
            <button
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:transition-all duration-300"
            >
                Retry
            </button>
            </div>
          </div>
        </CareerTestContainer>
      </>
    );
  }

  if (!isValidTestType) {
    return (
      <CareerTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Invalid Test Type</h2>
            <p className="text-sm text-green-800 mb-4">The test type "{testType}" is not supported. Please select a valid career test.</p>
          <button
            onClick={handleBackToHome}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg hover:transition-all duration-300"
          >
            Back to Center
          </button>
        </div>
      </div>
      </CareerTestContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">No Questions Available</h2>
              <p className="text-sm text-green-800">This test is not yet available or under maintenance.</p>
            </div>
          </div>
        </CareerTestContainer>
      </>
    );
  }

  // 如果测试已开始或显示结果，显示测试容器
  if (testStarted || showResults) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <CareerTestContainer>
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig(`/career/${testType}`)} />
          
          {/* 顶部标题 + 返回首页按钮 */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">{testInfo.title}</h1>
                <p className="text-xl text-green-700">
                  {showResults 
                    ? "Your personalized career assessment results"
                    : "Please choose the option that best matches your true thoughts and feelings"
                  }
                </p>
              </div>
              <button onClick={() => window.location.assign('/career')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-green-800 font-semibold hover:hover:bg-white/80 transition ml-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Center
              </button>
            </div>
          </div>

          <TestContainer
            testType={testType!}
          />
        </CareerTestContainer>
      </>
    );
  }

  // 显示完整的测试准备界面
  return (
    <>
      <SEOHead config={seoConfig} />
      <CareerTestContainer>
        {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig(`/career/${testType}`)} />
      
      {/* 顶部标题 + 右上角返回按钮（对齐Psychology模块） */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3">{testInfo.title}</h1>
          <button onClick={() => window.location.assign('/career')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-green-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-green-800 max-w-3xl">{testInfo.description}</p>
      </div>

      {/* 模块一：测试信息、说明和开始按钮 */}
      <Card className="p-8 mb-8">
        
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-emerald-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-900 mb-2">{questions.length}</div>
              <div className="text-sm text-green-800 font-medium">Total Questions</div>
            </div>
            <div className="bg-green-50 border border-emerald-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-900 mb-2">{Math.ceil(questions.length * 15 / 60)} min</div>
              <div className="text-sm text-green-800 font-medium">Estimated Time</div>
            </div>
            <div className="bg-green-50 border border-emerald-200 rounded-xl p-6 text-center">
              <div className="text-lg font-bold text-green-900 mb-2">
                {testType === 'holland' ? 'Single choice' : 
                 testType === 'disc' ? 'Single choice' : 
                 'Multiple choice'}
              </div>
              <div className="text-sm text-green-800 font-medium">Test Format</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-8">
          {/* Test Instructions */}
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-6 flex items-center">
              <span className="text-emerald-500 mr-3">📋</span>
              Test Instructions
            </h3>
            <div className="text-green-800 space-y-3">
              <p className="leading-tight">Answer honestly based on your true career interests and work experiences, rather than what you think you should answer or how others might expect you to respond.</p>
              <p className="leading-tight">Trust your first instinct and avoid overanalyzing each question, as the most accurate results come from your natural response.</p>
              <p className="leading-tight">There are no right or wrong answers in this assessment, and each response simply reflects your personal preferences and tendencies.</p>
            </div>
          </div>

          {/* Theoretical Basis */}
          <div>
            <h3 className="text-lg font-medium text-green-900 mb-6 flex items-center">
              <span className="text-emerald-500 mr-3">🔬</span>
              Theoretical Basis
            </h3>
            <div className="text-green-800 space-y-3">
              <p className="leading-tight">Based on established career development theories and psychological assessment principles.</p>
              <p className="leading-tight">This assessment measures your career interests, work style preferences, and leadership potential across multiple dimensions.</p>
              <p className="leading-tight">Designed to help individuals understand their professional strengths and find career paths that align with their interests and abilities.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <button 
            onClick={async () => {
              try {
                await startTest(testType!, questions);
                setTestStarted(true);
              } catch (error) {
                // 静默处理错误，用户界面已经通过状态管理显示错误
              }
            }}
            className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-16 py-4 text-lg font-bold rounded-lg hover:transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Start Test
          </button>
        </div>
      </Card>

      {/* 模块三：重要声明 */}
      <div className="p-8 mb-8 bg-green-50 border border-emerald-200 rounded-3xl shadow-sm">
        <h3 className="text-lg font-medium text-green-900 mb-8">Important Disclaimers</h3>
        <div className="text-green-800 space-y-3">
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">⚠️</span>
            <span><span className="font-semibold text-green-900">Not Professional Advice:</span> This test is for educational and self-discovery purposes only. It does not constitute professional career counseling or job placement services.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🔒</span>
            <span><span className="font-semibold text-green-900">Privacy Protection:</span> Your responses are confidential and will not be shared with third parties without your explicit consent.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">📚</span>
            <span><span className="font-semibold text-green-900">Educational Tool:</span> Results should be used as a starting point for self-reflection and career development, not as definitive career guidance.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🆘</span>
            <span><span className="font-semibold text-green-900">Seek Professional Help:</span> If you're experiencing significant career challenges, please consult with a qualified career counselor or professional development coach.</span>
          </p>
        </div>
    </div>
    </CareerTestContainer>
    </>
  );
};
