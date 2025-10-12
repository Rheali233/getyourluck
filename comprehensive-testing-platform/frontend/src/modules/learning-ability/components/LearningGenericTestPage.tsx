import React, { useState, useEffect } from 'react';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { LearningTestContainer } from './LearningTestContainer';

interface LearningGenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

export const LearningGenericTestPage: React.FC<LearningGenericTestPageProps> = ({ 
  testType, 
  title, 
  description 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  
  // 集成useTestStore
  const { startTest, setQuestions: setStoreQuestions, showResults } = useTestStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        // 调用后端API获取测试问题
        const response = await questionService.getQuestionsByType(testType);

        if (response.success && response.data && Array.isArray(response.data)) {
          // eslint-disable-next-line no-console
          console.debug('[LearningGenericTestPage] fetched questions', {
            testType,
            count: response.data.length,
            sample: response.data?.[0]
          });
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
  }, [testType]);

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      // eslint-disable-next-line no-console
      console.debug('[LearningGenericTestPage] setStoreQuestions', { count: questions.length });
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  if (loading) {
    return (
      <LearningTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-sky-800">Loading test questions...</p>
          </div>
        </div>
      </LearningTestContainer>
    );
  }

  if (error) {
    return (
      <LearningTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">Error Loading Test</h2>
            <p className="text-sm text-sky-800 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-500 text-white rounded-lg hover:transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </LearningTestContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <LearningTestContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-sky-900 mb-2">No Questions Available</h2>
            <p className="text-sm text-sky-800">This test is not yet available or under maintenance.</p>
          </div>
        </div>
      </LearningTestContainer>
    );
  }

  // 如果测试已开始或显示结果，显示测试容器
  if (testStarted || showResults) {
    // 添加调试信息
    // eslint-disable-next-line no-console
    console.debug('[LearningGenericTestPage] Rendering TestContainer:', {
      testType,
      testStarted,
      showResults,
      questionsCount: questions.length
    });
    return (
      <LearningTestContainer>
        {/* 顶部标题 + 返回首页按钮 */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-2">{title}</h1>
              <p className="text-xl text-sky-800">
                {showResults 
                  ? "Your personalized learning ability assessment results"
                  : "Please choose the option that best matches your learning preferences and cognitive abilities"
                }
              </p>
            </div>
            <button onClick={() => window.location.assign('/learning')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-sky-900 font-semibold hover:hover:bg-white/80 transition ml-4">
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
      </LearningTestContainer>
    );
  }

  // 显示完整的测试准备界面
  return (
    <LearningTestContainer>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig(`/learning/${testType}`)} />
      
      {/* 顶部标题 + 右上角返回按钮（对齐Psychology模块） */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-3">{title}</h1>
          <button onClick={() => window.location.assign('/learning')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-sky-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        {description && (
          <p className="text-xl text-sky-800 max-w-3xl">{description}</p>
        )}
      </div>

      {/* 模块一：测试信息、说明和开始按钮 */}
      <Card className="p-8 mb-8">
        
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-sky-900 mb-2">{questions.length}</div>
              <div className="text-sm text-sky-800 font-medium">Total Questions</div>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-sky-900 mb-2">{Math.ceil(questions.length * 15 / 60)} min</div>
              <div className="text-sm text-sky-800 font-medium">Estimated Time</div>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6 text-center">
              <div className="text-lg font-bold text-sky-900 mb-2">
                {testType === 'vark' && 'Multiple selection'}
                {testType === 'cognitive' && 'Task-based'}
              </div>
              <div className="text-sm text-sky-800 font-medium">Test Format</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-8">
          {/* Test Instructions */}
          <div>
            <h3 className="text-lg font-medium text-sky-900 mb-6 flex items-center">
              <span className="text-cyan-500 mr-3">📋</span>
              Test Instructions
            </h3>
            <div className="text-sky-800 space-y-3">
              <p className="leading-tight">Answer honestly based on your true learning preferences and cognitive abilities, rather than what you think you should answer or how others might expect you to respond.</p>
              <p className="leading-tight">Trust your first instinct and avoid overanalyzing each question, as the most accurate results come from your natural response.</p>
              <p className="leading-tight">There are no right or wrong answers in this assessment, and each response simply reflects your personal learning style and cognitive strengths.</p>
              {testType === 'vark' && (
                <p className="leading-tight">This test uses a multiple-selection format. You may select more than one option per question if applicable.</p>
              )}
              
              {testType === 'cognitive' && (
                <p className="leading-tight">This assessment includes timed, task-based interactions. Follow the on-screen instructions for each task.</p>
              )}
            </div>
          </div>

          {/* Theoretical Basis */}
          <div>
            <h3 className="text-lg font-medium text-sky-900 mb-6 flex items-center">
              <span className="text-cyan-500 mr-3">🔬</span>
              Theoretical Basis
            </h3>
            <div className="text-sky-800 space-y-3">
              {testType === 'vark' && (
                <>
                  <p className="leading-tight">Based on the VARK learning styles model developed by Neil Fleming and Charles Bonwell.</p>
                  <p className="leading-tight">This assessment measures preferences across four learning modalities: Visual, Auditory, Reading/Writing, and Kinesthetic.</p>
                  <p className="leading-tight">Designed to help individuals understand their preferred learning methods and optimize their study strategies.</p>
                </>
              )}
              
              {testType === 'cognitive' && (
                <>
                  <p className="leading-tight">Based on contemporary cognitive psychology research and neuropsychological assessment principles.</p>
                  <p className="leading-tight">This assessment evaluates working memory, attention, processing speed, and executive function.</p>
                  <p className="leading-tight">Designed to provide insights into cognitive strengths and areas for development.</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center pt-6">
          <button 
            onClick={async () => {
              try {
                // eslint-disable-next-line no-console
                console.debug('[LearningGenericTestPage] startTest click', { testType, count: questions.length });
                await startTest(testType, questions);
                setTestStarted(true);
              } catch (error) {
                // 静默处理错误，用户界面已经通过状态管理显示错误
              }
            }}
            className="bg-gradient-to-r from-cyan-600 to-sky-500 text-white px-16 py-4 text-lg font-bold rounded-lg hover:transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            Start Test
          </button>
        </div>
      </Card>

      {/* 模块三：重要声明 */}
      <div className="p-8 mb-8 bg-sky-50 border border-sky-200 rounded-3xl shadow-sm">
        <h3 className="text-lg font-medium text-sky-900 mb-8">Important Disclaimers</h3>
        <div className="text-sky-800 space-y-3">
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">⚠️</span>
            <span><span className="font-semibold text-sky-900">Not Professional Assessment:</span> This test is for educational and self-discovery purposes only. It does not constitute professional educational assessment or psychological evaluation.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🔒</span>
            <span><span className="font-semibold text-sky-900">Privacy Protection:</span> Your responses are confidential and will not be shared with third parties without your explicit consent.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">📚</span>
            <span><span className="font-semibold text-sky-900">Educational Tool:</span> Results should be used as a starting point for self-reflection and learning development, not as definitive cognitive ability labels.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🆘</span>
            <span><span className="font-semibold text-sky-900">Seek Professional Help:</span> If you're experiencing significant learning challenges or cognitive concerns, please consult with a qualified educational psychologist or learning specialist.</span>
          </p>
        </div>
      </div>
    </LearningTestContainer>
  );
};
