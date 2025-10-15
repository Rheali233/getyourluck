/**
 * 统一测试状态管理Store
 * 整合Psychology、Career、Relationship等模块的状态管理
 * 解决重复代码问题，提供统一的状态管理接口
 */
/* eslint-disable no-unused-vars */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getApiBaseUrl } from '@/config/environment'

// 基础测试会话接口
export interface TestSession {
  id: string
  testType: string
  status: 'not_started' | 'in_progress' | 'paused' | 'completed'
  startTime: Date
  endTime?: Date
  currentQuestionIndex: number
  answers: TestAnswer[]
  totalQuestions: number
  progress: number
}

// 测试答案接口
export interface TestAnswer {
  questionId: string
  answer: any
  timestamp: string
}

// 测试结果接口
export interface TestResult<T = any> {
  testType: string
  result: T
  metadata?: {
    processingTime: string
    processor: string
    [key: string]: any
  }
  // AI分析失败标记
  aiAnalysisFailed?: boolean
  aiError?: string
  retryable?: boolean
}

// 测试类型枚举（保留但标记为未使用，避免破坏现有导入）
export enum TestType {
  // Psychology模块
  MBTI = 'mbti',
  PHQ9 = 'phq9',
  EQ = 'eq',
  HAPPINESS = 'happiness',
  
  // Career模块
  HOLLAND = 'holland',
  DISC = 'disc',
  LEADERSHIP = 'leadership',
  
  // Relationship模块
  LOVE_LANGUAGE = 'love_language',
  LOVE_STYLE = 'love_style',
  INTERPERSONAL = 'interpersonal',
  
  // Learning模块
  VARK = 'vark',
  COGNITIVE = 'cognitive',
  
  // Astrology模块
  DAILY_FORTUNE = 'daily_fortune',
  WEEKLY_FORTUNE = 'weekly_fortune',
  
  // Tarot模块
  TAROT = 'tarot',
  MONTHLY_FORTUNE = 'monthly_fortune',
  YEARLY_FORTUNE = 'yearly_fortune',
  COMPATIBILITY = 'compatibility',
  BIRTH_CHART = 'birth_chart',
  
  // Numerology模块
  NUMEROLOGY = 'numerology',
  BAZI = 'bazi',
  ZODIAC = 'zodiac',
  NAME_ANALYSIS = 'name_analysis',
  ZIWEI = 'ziwei'
}

// 测试状态枚举（保留但标记为未使用，避免破坏现有导入）
export enum TestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

// 测试进度接口
export interface TestProgress {
  testType: string
  sessionId: string
  currentQuestionIndex: number
  answers: TestAnswer[]
  startTime: string
  lastUpdateTime: string
  isCompleted: boolean
}

// 统一测试状态接口
export interface UnifiedTestState {
  // 基础状态
  isLoading: boolean
  error: string | null
  data: any
  lastUpdated: Date | null
  
  // 测试会话管理
  currentSession: TestSession | null
  testHistory: TestSession[]
  
  // 测试相关状态
  currentTestType: string | null
  showResults: boolean
  currentTestResult: TestResult | null
  
  // 动态状态（根据测试类型变化）
  questions: Record<string, any[]>
  results: Record<string, TestResult | null>
  questionsLoaded: Record<string, boolean>
  
  // 进度和缓存状态
  progress: number
  isTestStarted: boolean
  isTestPaused: boolean
  isTestCompleted: boolean
  
  // 缓存管理
  cache: Map<string, any>
  cacheExpiry: Map<string, number>
  lastCacheCleanup: number
}

// 统一测试操作接口
export interface UnifiedTestActions {
  // 基础操作
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setData: (data: any) => void
  reset: () => void
  
  // 测试会话管理
  startTest: (testType: string) => Promise<void>
  pauseTest: () => void
  resumeTest: () => void
  endTest: () => Promise<TestResult | null>
  resetTest: () => void
  
  // 问题导航
  goToQuestion: (index: number) => void
  goToNextQuestion: () => void
  goToPreviousQuestion: () => void
  
  // 答案管理
  submitAnswer: (questionId: string, answer: any) => void
  getAnswer: (questionId: string) => TestAnswer | undefined
  getAllAnswers: () => TestAnswer[]
  
  // 问题管理
  loadQuestions: (testType: string) => Promise<void>
  getCurrentQuestion: () => any | null
  
  // 结果管理
  generateResults: (testType: string) => Promise<TestResult>
  saveResults: (testType: string, results: TestResult) => Promise<void>
  loadResults: (testType: string) => Promise<TestResult | null>
  
  // 进度管理
  updateProgress: () => void
  saveProgress: () => boolean
  loadProgress: (sessionId: string) => boolean
  
  // 状态管理
  setCurrentTestType: (testType: string | null) => void
  setShowResults: (show: boolean) => void
  setCurrentTestResult: (result: TestResult | null) => void
  clearError: () => void
  
  // 缓存管理
  setCache: (key: string, value: any, ttl?: number) => void
  getCache: (key: string) => any | null
  clearCache: () => void
  cleanupExpiredCache: () => void
}

// 完整的统一测试状态管理接口
export interface UnifiedTestModuleState extends UnifiedTestState, UnifiedTestActions {}

// 默认问题数据
const defaultQuestions: Record<string, any[]> = {
  [TestType.MBTI]: [],
  [TestType.PHQ9]: [],
  [TestType.EQ]: [],
  [TestType.HAPPINESS]: [],
  [TestType.HOLLAND]: [],
  [TestType.DISC]: [],
  [TestType.LEADERSHIP]: [],
  [TestType.LOVE_LANGUAGE]: [],
  [TestType.LOVE_STYLE]: [],
  [TestType.INTERPERSONAL]: [],
  [TestType.VARK]: [],
  [TestType.COGNITIVE]: [],
  [TestType.TAROT]: [],
  [TestType.NUMEROLOGY]: [],
  [TestType.BAZI]: [],
  [TestType.ZODIAC]: [],
  [TestType.NAME_ANALYSIS]: [],
  [TestType.ZIWEI]: []
}

// 默认结果数据
const defaultResults: Record<string, TestResult | null> = {
  [TestType.MBTI]: null,
  [TestType.PHQ9]: null,
  [TestType.EQ]: null,
  [TestType.HAPPINESS]: null,
  [TestType.HOLLAND]: null,
  [TestType.DISC]: null,
  [TestType.LEADERSHIP]: null,
  [TestType.LOVE_LANGUAGE]: null,
  [TestType.LOVE_STYLE]: null,
  [TestType.INTERPERSONAL]: null,
  [TestType.VARK]: null,
  [TestType.COGNITIVE]: null,
  [TestType.TAROT]: null,
  [TestType.NUMEROLOGY]: null,
  [TestType.BAZI]: null,
  [TestType.ZODIAC]: null,
  [TestType.NAME_ANALYSIS]: null,
  [TestType.ZIWEI]: null
}

// 默认问题加载状态
const defaultQuestionsLoaded: Record<string, boolean> = {
  [TestType.MBTI]: false,
  [TestType.PHQ9]: false,
  [TestType.EQ]: false,
  [TestType.HAPPINESS]: false,
  [TestType.HOLLAND]: false,
  [TestType.DISC]: false,
  [TestType.LEADERSHIP]: false,
  [TestType.LOVE_LANGUAGE]: false,
  [TestType.LOVE_STYLE]: false,
  [TestType.INTERPERSONAL]: false,
  [TestType.VARK]: false,
  [TestType.COGNITIVE]: false,
  [TestType.TAROT]: false,
  [TestType.NUMEROLOGY]: false,
  [TestType.BAZI]: false,
  [TestType.ZODIAC]: false,
  [TestType.NAME_ANALYSIS]: false,
  [TestType.ZIWEI]: false
}

/**
 * 统一测试状态管理Hook
 */
export const useUnifiedTestStore = create<UnifiedTestModuleState>()(
  persist(
    (set, get) => ({
            // 基础状态
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      
      // 测试会话管理
      currentSession: null,
      testHistory: [],
      
      // 测试相关状态
      currentTestType: null,
      showResults: false,
      currentTestResult: null,
      
      // 动态状态
      questions: defaultQuestions,
      results: defaultResults,
      questionsLoaded: defaultQuestionsLoaded,
      
      // 进度和缓存状态
      progress: 0,
      isTestStarted: false,
      isTestPaused: false,
      isTestCompleted: false,
      
      // 性能优化状态
      cache: new Map<string, any>(),
      cacheExpiry: new Map<string, number>(),
      lastCacheCleanup: Date.now(),

      // 基础操作
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setData: (data: any) => set({ data, lastUpdated: new Date() }),
      
      // 缓存管理方法
      setCache: (key: string, value: any, ttl: number = 5 * 60 * 1000) => {
        const state = get();
        const expiry = Date.now() + ttl;
        
        state.cache.set(key, value);
        state.cacheExpiry.set(key, expiry);
        
        // 自动清理过期缓存
        if (Date.now() - state.lastCacheCleanup > 60 * 1000) { // 每分钟清理一次
          get().cleanupExpiredCache();
        }
      },
      
      getCache: (key: string) => {
        const state = get();
        const expiry = state.cacheExpiry.get(key);
        
        if (expiry && Date.now() < expiry) {
          return state.cache.get(key);
        }
        
        // 清理过期缓存
        state.cache.delete(key);
        state.cacheExpiry.delete(key);
        return null;
      },
      
      cleanupExpiredCache: () => {
        const state = get();
        const now = Date.now();
        
        for (const [key, expiry] of state.cacheExpiry.entries()) {
          if (now >= expiry) {
            state.cache.delete(key);
            state.cacheExpiry.delete(key);
          }
        }
        
        set({ lastCacheCleanup: now });
      },
      
      clearCache: () => {
        const state = get();
        state.cache.clear();
        state.cacheExpiry.clear();
        set({ lastCacheCleanup: Date.now() });
      },
      
      reset: () => set({
        isLoading: false,
        error: null,
        data: null,
        lastUpdated: null,
        currentSession: null,
        testHistory: [],
        currentTestType: null,
        showResults: false,
        currentTestResult: null,
        questions: defaultQuestions,
        results: defaultResults,
        questionsLoaded: defaultQuestionsLoaded,
        progress: 0,
        isTestStarted: false,
        isTestPaused: false,
        isTestCompleted: false
      }),

      // 测试会话管理
      startTest: async (testType: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // 如果问题未加载，先从API加载
          if (!get().questionsLoaded[testType] || !get().questions[testType]?.length) {
            await get().loadQuestions(testType);
          }
          
          const currentQuestions = get().questions[testType];
          if (!currentQuestions || currentQuestions.length === 0) {
            throw new Error(`Failed to load ${testType} test questions`);
          }
          
          // 创建新的测试会话
          const session: TestSession = {
            id: `session_${Date.now()}`,
            testType,
            status: TestStatus.IN_PROGRESS,
            startTime: new Date(),
            currentQuestionIndex: 0,
            answers: [],
            totalQuestions: currentQuestions.length,
            progress: 0
          };
          
          set({
            currentSession: session,
            currentTestType: testType,
            testHistory: [...get().testHistory, session],
            isLoading: false,
            isTestStarted: true,
            isTestPaused: false,
            isTestCompleted: false,
            progress: 0,
            showResults: false
          });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to start test' 
          });
        }
      },

      pauseTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession: TestSession = {
            ...currentSession,
            status: TestStatus.PAUSED
          };
          set({
            currentSession: updatedSession,
            isTestPaused: true
          });
        }
      },

      resumeTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession: TestSession = {
            ...currentSession,
            status: TestStatus.IN_PROGRESS
          };
          set({
            currentSession: updatedSession,
            isTestPaused: false
          });
        }
      },

      endTest: async () => {
        const { currentSession, currentTestType } = get();
        if (currentSession && currentTestType) {
          try {
            // 生成测试结果
            const testResult = await get().generateResults(currentTestType);
            
            const updatedSession: TestSession = {
              ...currentSession,
              status: TestStatus.COMPLETED,
              endTime: new Date(),
              progress: 100
            };

            set({
              currentSession: updatedSession,
              showResults: true,
              currentTestResult: testResult,
              isTestCompleted: true,
              progress: 100
            });
            
            return testResult;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate test results';
            set({
              currentSession: { ...currentSession, status: TestStatus.COMPLETED },
              showResults: false,
              error: errorMessage,
              isTestCompleted: true
            });
            
            return null;
          }
        }
        return null;
      },

      resetTest: () => {
        set({
          currentSession: null,
          currentTestType: null,
          showResults: false,
          currentTestResult: null,
          error: null,
          progress: 0,
          isTestStarted: false,
          isTestPaused: false,
          isTestCompleted: false
        });
      },

      // 问题导航
      goToQuestion: (index: number) => {
        const { currentSession } = get();
        if (!currentSession) return;

        if (index >= 0 && index < currentSession.totalQuestions) {
          const updatedSession: TestSession = {
            ...currentSession,
            currentQuestionIndex: index
          };
          set({ currentSession: updatedSession });
        }
      },

      goToNextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        if (nextIndex < currentSession.totalQuestions) {
          const updatedSession: TestSession = {
            ...currentSession,
            currentQuestionIndex: nextIndex
          };
          set({ currentSession: updatedSession });
        }
      },

      goToPreviousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const prevIndex = currentSession.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          const updatedSession: TestSession = {
            ...currentSession,
            currentQuestionIndex: prevIndex
          };
          set({ currentSession: updatedSession });
        }
      },

      // 答案管理
      submitAnswer: (questionId: string, answer: any) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const newAnswer: TestAnswer = {
          questionId,
          answer,
          timestamp: new Date().toISOString()
        };

        const updatedAnswers = [...currentSession.answers];
        const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
        
        if (existingAnswerIndex >= 0) {
          updatedAnswers[existingAnswerIndex] = newAnswer;
        } else {
          updatedAnswers.push(newAnswer);
        }

        const progress = (updatedAnswers.length / currentSession.totalQuestions) * 100;
        const updatedSession: TestSession = {
          ...currentSession,
          answers: updatedAnswers,
          progress: Math.min(progress, 100)
        };

        set({
          currentSession: updatedSession,
          progress: Math.min(progress, 100)
        });
      },

      getAnswer: (questionId: string) => {
        const { currentSession } = get();
        if (!currentSession) return undefined;
        return currentSession.answers.find(a => a.questionId === questionId);
      },

      getAllAnswers: () => {
        const { currentSession } = get();
        return currentSession?.answers || [];
      },

      // 问题管理 - 使用缓存优化
      loadQuestions: async (testType: string) => {
        try {
          // 先检查缓存
          const cacheKey = `questions:${testType}`;
          const cachedQuestions = get().getCache(cacheKey);
          
          if (cachedQuestions) {
            set(state => ({
              questions: {
                ...state.questions,
                [testType]: cachedQuestions
              },
              questionsLoaded: {
                ...state.questionsLoaded,
                [testType]: true
              }
            }));
            return;
          }
          
          set({ isLoading: true, error: null });
          
          // 根据测试类型生成相应的问题
          let mockQuestions;
          if (testType === 'mbti') {
            mockQuestions = Array.from({ length: 20 }, (_, i) => ({
              id: `q_mbti_${i + 1}`,
              question: `MBTI Question ${i + 1}: This is a personality assessment question.`,
              type: 'multiple_choice',
              options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
              category: i < 5 ? 'E-I' : i < 10 ? 'S-N' : i < 15 ? 'T-F' : 'J-P'
            }));
          } else if (testType === 'phq9') {
            mockQuestions = Array.from({ length: 9 }, (_, i) => ({
              id: `q_phq9_${i + 1}`,
              question: `PHQ-9 Question ${i + 1}: How often have you been bothered by this problem?`,
              type: 'multiple_choice',
              options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
              category: 'depression_screening'
            }));
          } else {
            // 默认问题
            mockQuestions = Array.from({ length: 20 }, (_, i) => ({
              id: `q_${testType}_${i + 1}`,
              question: `Question ${i + 1} for ${testType}`,
              type: 'multiple_choice',
              options: ['A', 'B', 'C', 'D']
            }));
          }
          
          // 缓存问题数据（5分钟过期）
          get().setCache(cacheKey, mockQuestions, 5 * 60 * 1000);
          
          set(state => ({
            questions: {
              ...state.questions,
              [testType]: mockQuestions
            },
            questionsLoaded: {
              ...state.questionsLoaded,
              [testType]: true
            },
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load questions' 
          });
        }
      },

      getCurrentQuestion: () => {
        const { currentSession, questions, currentTestType } = get();
        if (!currentSession || !currentTestType) return null;

        const questionList = questions[currentTestType];
        if (!questionList || currentSession.currentQuestionIndex >= questionList.length) {
          return null;
        }

        return questionList[currentSession.currentQuestionIndex] || null;
      },

      // 结果管理
      generateResults: async (testType: string): Promise<TestResult> => {
        const { currentSession } = get();
        if (!currentSession) {
          throw new Error('No active test session');
        }

        try {
          // 调用后端统一测试结果处理服务
          const response = await fetch(`${getApiBaseUrl()}/api/v1/tests/${testType}/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              testType,
              answers: currentSession.answers.map(answer => {
                // Tarot: 同时发送基础类型的 value（用于后端校验）与完整的 answer 对象（供 AI 使用）
                if (testType === 'tarot') {
                  const cardId = (answer as any)?.answer?.card?.id;
                  const position = (answer as any)?.answer?.position;
                  const basicValue = String(cardId ?? position ?? 'unknown');
                  return {
                    questionId: answer.questionId,
                    value: basicValue,
                    // 保留对象以便后端 AIService 使用 answer.answer
                    answer: (answer as any).answer,
                    timestamp: answer.timestamp
                  };
                }
                // 对于Holland测试，需要包含category信息
                if (testType === 'holland') {
                  // 从questionId推断category
                  const questionId = answer.questionId;
                  let category = 'R'; // 默认值
                  
                  // 根据questionId推断category
                  if (questionId.includes('realistic') || questionId.includes('R')) {
                    category = 'R';
                  } else if (questionId.includes('investigative') || questionId.includes('I')) {
                    category = 'I';
                  } else if (questionId.includes('artistic') || questionId.includes('A')) {
                    category = 'A';
                  } else if (questionId.includes('social') || questionId.includes('S')) {
                    category = 'S';
                  } else if (questionId.includes('enterprising') || questionId.includes('E')) {
                    category = 'E';
                  } else if (questionId.includes('conventional') || questionId.includes('C')) {
                    category = 'C';
                  }
                  
                  return {
                    questionId: answer.questionId,
                    value: answer.answer,
                    category: category,
                    timestamp: answer.timestamp
                  };
                }
                
                // 对于DISC测试，需要包含dimension信息
                if (testType === 'disc') {
                  // 从questionId推断dimension
                  const questionId = answer.questionId;
                  let dimension = 'dominance'; // 默认值
                  
                  // 根据questionId推断dimension
                  if (questionId.includes('disc_001') || questionId.includes('disc_002') || questionId.includes('disc_003') || questionId.includes('disc_004') || questionId.includes('disc_005')) {
                    dimension = 'dominance';
                  } else if (questionId.includes('disc_006') || questionId.includes('disc_007') || questionId.includes('disc_008') || questionId.includes('disc_009') || questionId.includes('disc_010')) {
                    dimension = 'influence';
                  } else if (questionId.includes('disc_011') || questionId.includes('disc_012') || questionId.includes('disc_013') || questionId.includes('disc_014') || questionId.includes('disc_015')) {
                    dimension = 'steadiness';
                  } else if (questionId.includes('disc_016') || questionId.includes('disc_017') || questionId.includes('disc_018') || questionId.includes('disc_019') || questionId.includes('disc_020')) {
                    dimension = 'conscientiousness';
                  } else if (questionId.includes('disc_021') || questionId.includes('disc_022') || questionId.includes('disc_023')) {
                    dimension = 'dominance';
                  } else if (questionId.includes('disc_024') || questionId.includes('disc_025') || questionId.includes('disc_026')) {
                    dimension = 'influence';
                  } else if (questionId.includes('disc_027') || questionId.includes('disc_028')) {
                    dimension = 'steadiness';
                  } else if (questionId.includes('disc_029') || questionId.includes('disc_030')) {
                    dimension = 'conscientiousness';
                  }
                  
                  return {
                    questionId: answer.questionId,
                    value: answer.answer,
                    dimension: dimension,
                    timestamp: answer.timestamp
                  };
                }
                
                // 其他测试类型保持原有格式
                return {
                  questionId: answer.questionId,
                  value: answer.answer,
                  timestamp: answer.timestamp
                };
              }),
              userInfo: {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
              }
            })
          });

          if (!response.ok) {
            throw new Error(`Test result generation failed: ${response.statusText}`);
          }

          const result = await response.json();
          // // 调试日志
          
          if (!result.success) {
            throw new Error(result.error || 'Test result generation failed');
          }

          const testResult = {
            testType,
            result: result.data,
            metadata: {
              processingTime: new Date().toISOString(),
              processor: 'UnifiedTestStore'
            }
          };
          
          // // 调试日志
          return testResult;
        } catch (error) {
          // // 如果API调用失败，返回模拟结果
          const mockResult: TestResult = {
            testType,
            result: {
              sessionId: currentSession.id,
              answers: currentSession.answers,
              timestamp: new Date().toISOString()
            },
            metadata: {
              processingTime: new Date().toISOString(),
              processor: 'UnifiedTestStore',
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          };

          return mockResult;
        }
      },


      // 进度管理
      updateProgress: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const progress = (currentSession.answers.length / currentSession.totalQuestions) * 100;
        set({ progress: Math.min(progress, 100) });
      },

      saveProgress: () => {
        const { currentSession } = get();
        if (!currentSession) return false;

        try {
          const progress: TestProgress = {
            testType: currentSession.testType,
            sessionId: currentSession.id,
            currentQuestionIndex: currentSession.currentQuestionIndex,
            answers: currentSession.answers,
            startTime: currentSession.startTime.toISOString(),
            lastUpdateTime: new Date().toISOString(),
            isCompleted: currentSession.status === TestStatus.COMPLETED
          };

          localStorage.setItem(`test_progress_${currentSession.id}`, JSON.stringify(progress));
          return true;
        } catch (error) {
          return false;
        }
      },

      loadProgress: (sessionId: string) => {
        try {
          const progressData = localStorage.getItem(`test_progress_${sessionId}`);
          if (progressData) {
            const progress: TestProgress = JSON.parse(progressData);
            return progress !== null;
          }
          return false;
        } catch (error) {
          return false;
        }
      },

      // 状态管理
      setCurrentTestType: (testType: string | null) => set({ currentTestType: testType }),
      setShowResults: (show: boolean) => set({ showResults: show }),
      setCurrentTestResult: (result: TestResult | null) => set({ currentTestResult: result }),
      clearError: () => set({ error: null }),
      
      // 结果管理方法（为了满足接口要求）
      saveResults: async (testType: string, results: TestResult) => {
        try {
          set(state => ({
            results: {
              ...state.results,
              [testType]: results
            }
          }));
        } catch (error) {
          // 静默处理错误
        }
      },

      loadResults: async (testType: string) => {
        try {
          const result = get().results[testType];
          return result || null;
        } catch (error) {
          return null;
        }
      }
    }),
    {
      name: 'unified-test-store',
      partialize: (state) => ({
        testHistory: state.testHistory,
        results: state.results,
        questionsLoaded: state.questionsLoaded
      })
    }
  )
)
