/**
 * Unified Test Store
 * Centralized state management for all testing modules
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  TestSession, 
  TestAnswer, 
  TestResult, 
  Question,
  TestProgress
} from '../types/TestTypes';
import { TestStatus } from '../types/TestTypes';
import { testService } from '@/services/testService';
// import { apiClient } from '@/services/apiClient';

// Store state interface
export interface TestStoreState {
  // Current test session
  currentSession: TestSession | null;
  currentTestType: string | null;
  
  // Questions and answers
  questions: Question[];
  answers: TestAnswer[];
  
  // Test progress
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  
  // Test status
  isLoading: boolean;
  error: string | null;
  showResults: boolean;
  
  // Test results
  currentTestResult: TestResult<any> | null;
  
  // Test history
  testHistory: TestSession[];
  
  // UI state
  isTestStarted: boolean;
  isTestPaused: boolean;
  isTestCompleted: boolean;
  
  // Time tracking
  startTime: Date | null;
  timeSpent: number;
  
  // Test type specific state - 为每个测试类型维护独立的状态
  testTypeStates: Record<string, {
    showResults: boolean;
    currentTestResult: TestResult<any> | null;
    isTestStarted: boolean;
    isTestCompleted: boolean;
    questions: Question[];
    answers: TestAnswer[];
    currentQuestionIndex: number;
    progress: number;
  }>;
  
  // Actions
  startTest: (testType: string, questions?: Question[]) => Promise<void>;
  pauseTest: () => void;
  resumeTest: () => void;
  endTest: () => Promise<TestResult<any> | null>;
  resetTest: () => void;
  
  // Question navigation
  goToQuestion: (_index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  
  // Answer management
  submitAnswer: (_questionId: string, _answer: any) => void;
  getAnswer: (_questionId: string) => TestAnswer | undefined;
  getAllAnswers: () => TestAnswer[];
  
  // Progress management
  updateProgress: () => void;
  saveProgress: () => boolean;
  loadProgress: (_sessionId: string) => boolean;
  
  // Session management
  createSession: (_testType: string, _questions: Question[]) => TestSession;
  updateSession: (_updates: Partial<TestSession>) => void;
  
  // Result management
  setTestResult: (_result: TestResult<any>) => void;
  clearTestResult: () => void;
  getTestResult: (_testType: string, _sessionId: string) => Promise<TestResult<any> | null>;
  
  // Test type specific state management
  getTestTypeState: (testType: string) => {
    showResults: boolean;
    currentTestResult: TestResult<any> | null;
    isTestStarted: boolean;
    isTestCompleted: boolean;
    questions: Question[];
    answers: TestAnswer[];
    currentQuestionIndex: number;
    progress: number;
  };
  setTestTypeState: (_testType: string, _state: Partial<{
    showResults: boolean;
    currentTestResult: TestResult<any> | null;
    isTestStarted: boolean;
    isTestCompleted: boolean;
    questions: Question[];
    answers: TestAnswer[];
    currentQuestionIndex: number;
    progress: number;
  }>) => void;
  clearTestTypeState: (_testType: string) => void;
  clearAllTestTypeStates: () => void;
  
  // Utility actions
  setLoading: (_loading: boolean) => void;
  setError: (_error: string | null) => void;
  setQuestions: (_questions: Question[]) => void;
  setShowResults: (_show: boolean) => void;
  
  // Getters
  getCurrentQuestion: () => Question | null;
  getTestProgress: () => TestProgress | null;
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

// Create the store
export const useTestStore = create<TestStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentSession: null,
      currentTestType: null,
      questions: [],
      answers: [],
      currentQuestionIndex: 0,
      totalQuestions: 0,
      progress: 0,
      isLoading: false,
      error: null,
      showResults: false,
      currentTestResult: null,
      testHistory: [],
      isTestStarted: false,
      isTestPaused: false,
      isTestCompleted: false,
      startTime: null,
      timeSpent: 0,
      testTypeStates: {},
      
      // Actions
      startTest: async (testType: string, questions?: Question[]) => {
        try {
          set({ isLoading: true, error: null });
          
          // Use provided questions or fallback to store questions
          const questionsToUse = questions || get().questions;
          if (!questionsToUse || questionsToUse.length === 0) {
            throw new Error('No questions available for test');
          }
          
          // Create new session
          const session = get().createSession(testType, questionsToUse);
          
          // 更新全局状态
          set({
            currentSession: session,
            currentTestType: testType,
            isTestStarted: true,
            isTestPaused: false,
            isTestCompleted: false,
            startTime: new Date(),
            timeSpent: 0,
            currentQuestionIndex: 0,
            progress: 0,
            showResults: false,
            currentTestResult: null,
            isLoading: false
          });
          
          // 更新测试类型特定状态
          get().setTestTypeState(testType, {
            showResults: false,
            currentTestResult: null,
            isTestStarted: true,
            isTestCompleted: false,
            questions: questionsToUse,
            answers: [],
            currentQuestionIndex: 0,
            progress: 0
          });
          
          // Add to history
          set(state => ({
            testHistory: [...state.testHistory, session]
          }));
          
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
          const updatedSession = { ...currentSession, status: 'paused' as TestStatus };
          set({
            currentSession: updatedSession,
            isTestPaused: true
          });
          get().updateSession(updatedSession);
        }
      },
      
      resumeTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession = { ...currentSession, status: 'in_progress' as TestStatus };
          set({
            currentSession: updatedSession,
            isTestPaused: false
          });
          get().updateSession(updatedSession);
        }
      },
      
      endTest: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { currentSession, answers, currentTestType } = get();
          if (!currentSession) {
            throw new Error('No active test session');
          }
          
          // Mark session as completed
          const updatedSession = { 
            ...currentSession, 
            status: 'completed' as TestStatus,
            endTime: new Date(),
            answers: answers
          };
          
          // Call backend API to calculate test results
          let testResult = null;
          if (currentTestType) {
            try {
              const submission = {
                testType: currentTestType,
                answers: answers.map(answer => {
                  // 对于Holland测试，需要包含category信息
                  if (currentTestType === 'holland') {
                    // 从questionId推断category，或者从题目数据中获取
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
                      value: answer.value,
                      category: category,
                      timestamp: answer.timestamp
                    };
                  }
                  
                  // 对于DISC测试，需要包含dimension信息
                  if (currentTestType === 'disc') {
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
                      value: answer.value,
                      dimension: dimension,
                      timestamp: answer.timestamp
                    };
                  }
                  
                  // Love Language测试特殊处理 - 添加维度信息
                  if (currentTestType === 'love_language') {
                    const questionId = answer.questionId;
                    let dimension = '';
                    
                    // 根据问题ID确定维度
                    if (questionId && typeof questionId === 'string' && questionId.includes('ll_')) {
                      const questionNum = parseInt(questionId.split('_')[1] || '0');
                      if (questionNum >= 1 && questionNum <= 6) {
                        dimension = 'words_of_affirmation';
                      } else if (questionNum >= 7 && questionNum <= 12) {
                        dimension = 'quality_time';
                      } else if (questionNum >= 13 && questionNum <= 18) {
                        dimension = 'receiving_gifts';
                      } else if (questionNum >= 19 && questionNum <= 24) {
                        dimension = 'acts_of_service';
                      } else if (questionNum >= 25 && questionNum <= 30) {
                        dimension = 'physical_touch';
                      }
                    }
                    
                    return {
                      questionId: answer.questionId,
                      value: answer.value,
                      dimension: dimension,
                      timestamp: answer.timestamp
                    };
                  }
                  
                  // 其他测试类型保持原有格式
                  return {
                    questionId: answer.questionId,
                    value: answer.value,
                    timestamp: answer.timestamp
                  };
                }),
                userInfo: {
                  userAgent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                }
              };
              
              // 统一使用 v1 提交接口
              const response = await testService.submitTest(submission);
              if (response.success && response.data) {
                const data = response.data as any;
                // 验证返回数据的完整性
                if (!data.sessionId || !data.testType) {
                  throw new Error('Invalid test result data from backend');
                }
                
                // Convert API response to store TestResult format
                testResult = {
                  testType: data.testType,
                  sessionId: data.sessionId,
                  scores: data.scores || data.allScores || {},
                  categories: data.categories || [],
                  dimensions: data.dimensions || {},
                  analysis: data.interpretation || data.analysis || '',
                  recommendations: data.recommendations || [],
                  timestamp: data.completedAt || new Date().toISOString(),
                  data: data,
                  // Love Language specific fields
                  primaryType: data.primaryLanguage || data.primaryType,
                  secondaryType: data.secondaryLanguage || data.secondaryType,
                  // Additional AI analysis fields
                  loveLanguageDetails: data.loveLanguageDetails,
                  relationshipImplications: data.relationshipImplications,
                  communicationTips: data.communicationTips,
                  giftSuggestions: data.giftSuggestions,
                  dateIdeas: data.dateIdeas,
                  growthAreas: data.growthAreas,
                  partnerGuidance: data.partnerGuidance,
                  selfCareTips: data.selfCareTips
                } as any;

                // 学习模块不再在前端触发二次 AI 调用，由后端统一合并
              } else {
                throw new Error(response.error || 'Failed to get test results from backend');
              }
            } catch (apiError) {
              const errorMessage = apiError instanceof Error ? apiError.message : 'Failed to get test results from backend';
              set({ error: errorMessage });
              
              // 即使API失败，也要完成测试流程，创建基本结果
              testResult = {
                testType: currentTestType,
                sessionId: currentSession.id,
                scores: {},
                categories: [],
                dimensions: {},
                analysis: 'Test completed but results could not be calculated. Please try again later.',
                recommendations: ['Contact support if the problem persists.'],
                timestamp: new Date().toISOString(),
                data: null
              };
            }
          }
          
          // 更新全局状态（不设置showResults和currentTestResult，避免影响其他测试）
          set({
            currentSession: updatedSession,
            isTestCompleted: true,
            isTestStarted: false,
            showResults: false, // 不设置全局showResults
            currentTestResult: null, // 不设置全局currentTestResult
            isLoading: false
          });
          
          // 只更新测试类型特定状态
          if (currentTestType) {
            get().setTestTypeState(currentTestType, {
              showResults: true,
              currentTestResult: testResult,
              isTestStarted: false,
              isTestCompleted: true,
              questions: get().questions,
              answers: answers,
              currentQuestionIndex: get().currentQuestionIndex,
              progress: 100
            });
          }
          
          return testResult;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to end test' 
          });
          return null;
        }
      },
      
      resetTest: () => {
        const { currentTestType } = get();
        
        // 清理当前测试类型的特定状态
        if (currentTestType) {
          get().clearTestTypeState(currentTestType);
        }
        
        // 清理全局状态
        set({
          currentSession: null,
          currentTestType: null,
          questions: [],
          answers: [],
          currentQuestionIndex: 0,
          totalQuestions: 0,
          progress: 0,
          isLoading: false,
          error: null,
          showResults: false,
          currentTestResult: null,
          isTestStarted: false,
          isTestPaused: false,
          isTestCompleted: false,
          startTime: null,
          timeSpent: 0
        });
      },
      
      // Question navigation
      goToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
          get().updateProgress();
        }
      },
      
      goToNextQuestion: () => {
        const { currentQuestionIndex, totalQuestions } = get();
        if (currentQuestionIndex < totalQuestions - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
          get().updateProgress();
        }
      },
      
      goToPreviousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
          get().updateProgress();
        }
      },
      
      // Answer management
      submitAnswer: (questionId: string, answer: any) => {
        const { answers } = get();
        const timestamp = new Date().toISOString();
        
        // Remove existing answer for the same question if it exists
        const filteredAnswers = answers.filter(a => a.questionId !== questionId);
        
        // Add new answer
        const newAnswer: TestAnswer = {
          questionId,
          value: answer,
          timestamp,
          timeSpent: Date.now() - (get().startTime?.getTime() || Date.now())
        };
        
        const newAnswers = [...filteredAnswers, newAnswer];
        
        set({ answers: newAnswers });
        
        // Update session if exists
        const { currentSession } = get();
        if (currentSession) {
          get().updateSession({ answers: newAnswers });
        }
        
        // Auto-save progress
        setTimeout(() => {
          get().saveProgress();
        }, 100);
      },
      
      getAnswer: (questionId: string) => {
        const { answers } = get();
        return answers.find(answer => answer.questionId === questionId);
      },
      
      getAllAnswers: () => {
        return get().answers;
      },
      
      // Progress management
      updateProgress: () => {
        const { currentQuestionIndex, totalQuestions } = get();
        const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
        set({ progress });
      },
      
      saveProgress: () => {
        try {
          const { currentSession, answers, currentQuestionIndex } = get();
          if (!currentSession) return false;
          
          const progress: TestProgress = {
            testType: currentSession.testType,
            sessionId: currentSession.id,
            currentQuestionIndex,
            answers,
            startTime: currentSession.startTime.toISOString(),
            lastUpdateTime: new Date().toISOString(),
            isCompleted: currentSession.status === 'completed',
            timeSpent: get().timeSpent
          };
          
          localStorage.setItem(`test_progress_${progress.sessionId}`, JSON.stringify(progress));
          return true;
        } catch (error) {
          return false;
        }
      },
      
      loadProgress: (sessionId: string) => {
        try {
          const savedProgress = localStorage.getItem(`test_progress_${sessionId}`);
          if (savedProgress) {
            const progress: TestProgress = JSON.parse(savedProgress);
            
            // Restore state from progress
            set({
              currentQuestionIndex: progress.currentQuestionIndex,
              answers: progress.answers,
              timeSpent: progress.timeSpent
            });
            
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      },
      
      // Session management
      createSession: (testType: string, questions: Question[]) => {
        const session: TestSession = {
          id: `session_${Date.now()}`,
          testType,
          status: TestStatus.IN_PROGRESS,
          startTime: new Date(),
          currentQuestionIndex: 0,
          answers: [],
          totalQuestions: questions.length,
          timeSpent: 0
        };
        
        set({
          currentSession: session,
          questions,
          totalQuestions: questions.length
        });
        
        return session;
      },
      
      updateSession: (updates: Partial<TestSession>) => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedSession = { ...currentSession, ...updates };
          set({ currentSession: updatedSession });
        }
      },
      
      // Result management
      setTestResult: (result: TestResult<any>) => {
        set({ currentTestResult: result });
      },
      
      clearTestResult: () => {
        set({ currentTestResult: null });
      },
      
      getTestResult: async (testType: string, sessionId: string): Promise<TestResult<any> | null> => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await testService.getTestResult(testType, sessionId);
          if (response.success && response.data) {
            const result: TestResult<any> = {
              testType: response.data.testType,
              sessionId: response.data.sessionId,
              scores: response.data.scores || {},
              categories: response.data.categories || [],
              dimensions: response.data.dimensions || {},
              analysis: response.data.interpretation || '',
              recommendations: response.data.recommendations || [],
              timestamp: response.data.completedAt || new Date().toISOString(),
              data: response.data
            };
            
            set({ currentTestResult: result, isLoading: false });
            return result;
          } else {
            throw new Error(response.error || 'Failed to retrieve test result');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve test result';
          set({ error: errorMessage, isLoading: false });
          return null;
        }
      },
      
      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setQuestions: (questions: Question[]) => set({ questions, totalQuestions: questions.length }),
      setShowResults: (show: boolean) => set({ showResults: show }),
      
      // Getters
      getCurrentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        if (questions.length === 0 || currentQuestionIndex >= questions.length) {
          return null;
        }
        return questions[currentQuestionIndex] || null;
      },
      
      getTestProgress: () => {
        const { currentSession, answers, currentQuestionIndex, timeSpent } = get();
        if (!currentSession) return null;
        
        return {
          testType: currentSession.testType,
          sessionId: currentSession.id,
          currentQuestionIndex,
          answers,
          startTime: currentSession.startTime.toISOString(),
          lastUpdateTime: new Date().toISOString(),
          isCompleted: currentSession.status === 'completed',
          timeSpent
        };
      },
      
      isLastQuestion: () => {
        const { currentQuestionIndex, totalQuestions } = get();
        return currentQuestionIndex === totalQuestions - 1;
      },
      
      isFirstQuestion: () => {
        return get().currentQuestionIndex === 0;
      },
      
      canGoNext: () => {
        const { currentQuestionIndex, totalQuestions } = get();
        return currentQuestionIndex < totalQuestions - 1;
      },
      
      canGoPrevious: () => {
        return get().currentQuestionIndex > 0;
      },
      
      // Test type specific state management
      getTestTypeState: (testType: string) => {
        const state = get();
        const testTypeState = state.testTypeStates[testType];
        
        if (!testTypeState) {
          return {
            showResults: false,
            currentTestResult: null,
            isTestStarted: false,
            isTestCompleted: false,
            questions: [],
            answers: [],
            currentQuestionIndex: 0,
            progress: 0
          };
        }
        
        return testTypeState;
      },
      
      setTestTypeState: (testType: string, newState: Partial<{
        showResults: boolean;
        currentTestResult: TestResult<any> | null;
        isTestStarted: boolean;
        isTestCompleted: boolean;
        questions: Question[];
        answers: TestAnswer[];
        currentQuestionIndex: number;
        progress: number;
      }>) => {
        set(state => ({
          testTypeStates: {
            ...state.testTypeStates,
            [testType]: {
              ...state.testTypeStates[testType],
              showResults: false,
              currentTestResult: null,
              isTestStarted: false,
              isTestCompleted: false,
              questions: [],
              answers: [],
              currentQuestionIndex: 0,
              progress: 0,
              ...newState
            }
          }
        }));
      },
      
      clearTestTypeState: (testType: string) => {
        set(state => {
          const newTestTypeStates = { ...state.testTypeStates };
          delete newTestTypeStates[testType];
          return { testTypeStates: newTestTypeStates };
        });
      },
      
      clearAllTestTypeStates: () => {
        set({ testTypeStates: {} });
      }
    }),
    {
      name: 'unified-test-store'
    }
  )
);
