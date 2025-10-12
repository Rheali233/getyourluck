import React, { useState, useEffect } from 'react';
import { TestContainer } from '@/modules/testing/components/TestContainer';
import { Question } from '@/modules/testing/types/TestTypes';
import { questionService } from '@/modules/testing/services/QuestionService';
import { useTestStore } from '@/modules/testing/stores/useTestStore';
import { Card } from '@/components/ui/Card';
// 移除顶部导航，改为右上角返回按钮以对齐Psychology模块
import { RelationshipTestContainer } from './RelationshipTestContainer';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';

interface RelationshipGenericTestPageProps {
  testType: string;
  title: string;
  description?: string;
}

export const RelationshipGenericTestPage: React.FC<RelationshipGenericTestPageProps> = ({ 
  testType, 
  title, 
  description 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  
  // 集成useTestStore
  const { startTest, setQuestions: setStoreQuestions, showResults, currentTestResult } = useTestStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {

        setLoading(true);
        // 调用后端API获取测试问题
        const response = await questionService.getQuestionsByType(testType);

        
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
  }, [testType]);

  // 当questions加载完成后，同步到store
  useEffect(() => {
    if (questions.length > 0) {
      setStoreQuestions(questions);
    }
  }, [questions, setStoreQuestions]);

  // 当显示结果时，确保testStarted保持true，这样会显示测试容器（包含结果）
  // 强化：一旦有结果或显示结果，强制保持测试状态，防止自动跳转
  useEffect(() => {
    if (showResults || currentTestResult) {
      setTestStarted(true);
    }
  }, [showResults, currentTestResult]);

  if (loading) {
    return (
      <RelationshipTestContainer>
        <Breadcrumb items={getBreadcrumbConfig(`/relationship/${testType}`)} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-pink-800">Loading test questions...</p>
          </div>
        </div>
      </RelationshipTestContainer>
    );
  }

  if (error) {
    return (
      <RelationshipTestContainer>
        <Breadcrumb items={getBreadcrumbConfig(`/relationship/${testType}`)} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-pink-900 mb-2">Error Loading Test</h2>
            <p className="text-sm text-pink-800 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-lg hover:transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </RelationshipTestContainer>
    );
  }

  if (questions.length === 0) {
    return (
      <RelationshipTestContainer>
        <Breadcrumb items={getBreadcrumbConfig(`/relationship/${testType}`)} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-pink-900 mb-2">No Questions Available</h2>
            <p className="text-sm text-pink-800">This test is not yet available or under maintenance.</p>
          </div>
        </div>
      </RelationshipTestContainer>
    );
  }

    // 如果测试已开始或显示结果，显示测试容器
  if (testStarted || showResults) {
    return (
      <RelationshipTestContainer>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig(`/relationship/${testType}`)} />
        {/* 顶部标题 + 返回首页按钮 */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-2">{title}</h1>
              <p className="text-xl text-pink-700">
                {showResults 
                  ? "Your personalized relationship assessment results"
                  : "Please choose the option that best matches your true thoughts and feelings"
                }
              </p>
            </div>
            <button onClick={() => window.location.assign('/relationship')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-pink-800 font-semibold hover:hover:bg-white/80 transition ml-4">
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
      </RelationshipTestContainer>
    );
  }

  // 显示完整的测试准备界面
  return (
    <RelationshipTestContainer>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig(`/relationship/${testType}`)} />
      {/* 顶部标题 + 右上角返回按钮（对齐Psychology） */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-900 mb-3">{title}</h1>
          <button onClick={() => window.location.assign('/relationship')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-pink-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        {description && (
          <p className="text-xl text-pink-800 max-w-3xl">{description}</p>
        )}
      </div>

          {/* 模块一：测试信息、说明和开始按钮 */}
          <Card className="p-8 mb-8">
            
            <div className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-pink-900 mb-2">{questions.length}</div>
                  <div className="text-sm text-pink-800 font-medium">Total Questions</div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-pink-900 mb-2">{Math.ceil(questions.length * 15 / 60)} min</div>
                  <div className="text-sm text-pink-800 font-medium">Estimated Time</div>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 text-center">
                  <div className="text-lg font-bold text-pink-900 mb-2">
                    {(testType === 'love_language' || testType === 'love_style' || testType === 'interpersonal')
                      ? 'Single choice'
                      : 'Multiple choice'}
                  </div>
                  <div className="text-sm text-pink-800 font-medium">Test Format</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              {/* Test Instructions */}
              <div>
                <h3 className="text-lg font-medium text-pink-900 mb-6 flex items-center">
                  <span className="text-pink-500 mr-3">📋</span>
                  Test Instructions
                </h3>
                <div className="text-pink-800 space-y-3">
                  <p className="leading-tight">Answer honestly based on your true thoughts and feelings about relationships, rather than what you think you should answer or how others might expect you to respond.</p>
                  <p className="leading-tight">Trust your first instinct and avoid overanalyzing each question, as the most accurate results come from your natural response.</p>
                  <p className="leading-tight">There are no right or wrong answers in this assessment, and each response simply reflects your personal preferences and tendencies in relationships.</p>
                  {testType === 'interpersonal' && (
                    <p className="leading-tight">This test uses a 5-point single-choice Likert scale (Strongly Disagree → Strongly Agree). Please select one option per question.</p>
                  )}
                </div>
              </div>

              {/* Theoretical Basis */}
              <div>
                <h3 className="text-lg font-medium text-pink-900 mb-6 flex items-center">
                  <span className="text-pink-500 mr-3">🔬</span>
                  Theoretical Basis
                </h3>
                <div className="text-pink-800 space-y-3">
                  <p className="leading-tight">Based on John Alan Lee's six love styles theory, this assessment identifies your approach to romantic relationships across six dimensions.</p>
                  <p className="leading-tight">The six styles are: Eros (passionate), Ludus (playful), Storge (friendship-based), Pragma (practical), Mania (intense), and Agape (selfless).</p>
                  <p className="leading-tight">Most people exhibit combinations of these styles, and understanding your preferences helps improve relationship communication and compatibility.</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button 
                onClick={async () => {
                  try {
                    await startTest(testType, questions);
                    setTestStarted(true);
                  } catch (error) {
                    // 静默处理错误，用户界面已经通过状态管理显示错误
                  }
                }}
                className="bg-gradient-to-r from-pink-600 to-rose-500 text-white px-16 py-4 text-lg font-bold rounded-lg hover:transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Start Test
              </button>
            </div>
          </Card>



      {/* 模块三：重要声明 */}
      <div className="p-8 mb-8 bg-pink-50 border border-pink-200 rounded-3xl shadow-sm">
        <h3 className="text-lg font-medium text-pink-900 mb-8">Important Disclaimers</h3>
        <div className="text-pink-800 space-y-3">
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">⚠️</span>
            <span><span className="font-semibold text-pink-900">Not Professional Counseling:</span> This test is for educational and self-discovery purposes only. It does not constitute professional relationship counseling or therapy.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🔒</span>
            <span><span className="font-semibold text-pink-900">Privacy Protection:</span> Your responses are confidential and will not be shared with third parties without your explicit consent.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">📚</span>
            <span><span className="font-semibold text-pink-900">Educational Tool:</span> Results should be used as a starting point for self-reflection and relationship improvement, not as definitive relationship labels.</span>
          </p>
          <p className="flex items-start leading-tight">
            <span className="text-red-500 text-xl mr-4 flex-shrink-0">🆘</span>
            <span><span className="font-semibold text-pink-900">Seek Professional Help:</span> If you're experiencing significant relationship challenges or emotional distress, please consult with a qualified relationship counselor or therapist.</span>
          </p>
        </div>
      </div>
    </RelationshipTestContainer>
  );
};
