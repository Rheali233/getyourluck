/**
 * Psychology Module State Management
 * Follows unified development standard Zustand state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PsychologyModuleState, 
  TestSession, 
  UserAnswer, 
  TestResult
} from '../types';
import { TestType, TestStatus } from '../types';
import { psychologyAIService } from '../services/psychologyAIService';
import { questionService } from '../services/questionService';
import { frontendCacheService } from '../services/frontendCacheService';
import { progressManager } from '../services/progressManager';
import { retryService } from '../services/retryService';

// Default question bank data (temporary use, will be obtained from API later)
const defaultQuestions = {
  [TestType.MBTI]: [],
  [TestType.PHQ9]: [],
  [TestType.EQ]: [],
  [TestType.HAPPINESS]: [],
};

/**
 * Psychology Module State Management Hook
 */
export const usePsychologyStore = create<PsychologyModuleState>()(
  persist(
    (set, get) => ({
      // Base state
      currentSession: null,
      testHistory: [],
      questions: defaultQuestions,
      results: {
        [TestType.MBTI]: null,
        [TestType.PHQ9]: null,
        [TestType.EQ]: null,
        [TestType.HAPPINESS]: null,
      },
      currentTestResult: null,
      isLoading: false,
      error: null,
      currentTestType: null,
      showResults: false,
      lastUpdated: null,
      questionsLoaded: false, // New: Mark whether questions have been loaded from API

      // Test session management
      startTest: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // If questions are not loaded, load from API first
          if (!get().questionsLoaded || !get().questions[testType]?.length) {
            await get().loadQuestionsFromAPI(testType);
          }
          
          const currentQuestions = get().questions[testType];
          if (!currentQuestions || currentQuestions.length === 0) {
            throw new Error(`Failed to load ${testType} test questions`);
          }
          
          // Debug information (commented out in production)
          // console.log('startTest Debug:', {
          //   testType,
          //   questionsForType: currentQuestions,
          //   questionsLength: currentQuestions.length,
          //   allQuestions: get().questions
          // });
          
          // Create new test session
          const session: TestSession = {
            id: `session_${Date.now()}`,
            testType,
            status: TestStatus.IN_PROGRESS,
            startTime: new Date(),
            currentQuestionIndex: 0,
            answers: [],
            totalQuestions: currentQuestions.length,
          };
          
          // console.log('Created session:', session);
          
          set({
            currentSession: session,
            currentTestType: testType,
            testHistory: [...get().testHistory, session],
            isLoading: false,
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
          set({
            currentSession: { ...currentSession, status: TestStatus.PAUSED },
          });
        }
      },

      resumeTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: { ...currentSession, status: TestStatus.IN_PROGRESS },
          });
        }
      },

      endTest: async () => {
        const { currentSession, currentTestType } = get();
        if (currentSession && currentTestType) {
          try {
            // Generate test results
            const testResult = await get().analyzeTestResult(currentTestType, currentSession.answers);
            
            set({
              currentSession: { ...currentSession, status: TestStatus.COMPLETED },
              showResults: true,
              currentTestResult: testResult,
            });
            
            return { success: true, data: testResult };
          } catch (error) {
            console.error('Failed to generate test results:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate test results';
            set({
              currentSession: { ...currentSession, status: TestStatus.COMPLETED },
              showResults: true,
              error: errorMessage,
            });
            
            return { success: false, error: errorMessage };
          }
        }
        return { success: false, error: 'No valid test session' };
      },

      resetTest: () => {
        set({
          currentSession: null,
          currentTestType: null,
          showResults: false,
          currentTestResult: null,
          error: null,
        });
      },

      // Answer management
      submitAnswer: (questionId: string, answer: string | number) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const newAnswer: UserAnswer = {
          questionId,
          answer,
          timestamp: new Date().toISOString(),
        };

        const updatedSession = {
          ...currentSession,
          answers: [...currentSession.answers, newAnswer],
          // Do not automatically increment index, let component control manually
          // currentQuestionIndex: currentSession.currentQuestionIndex + 1,
        };

        set({ currentSession: updatedSession });
        
        // Automatically save progress
        setTimeout(() => {
          get().saveProgress();
        }, 100);
      },

      goToQuestion: (index: number) => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: { ...currentSession, currentQuestionIndex: index },
        });
      },

      goToNextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        if (nextIndex < currentSession.totalQuestions) {
          set({
            currentSession: { ...currentSession, currentQuestionIndex: nextIndex },
          });
        }
      },

      goToPreviousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const prevIndex = currentSession.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          set({
            currentSession: { ...currentSession, currentQuestionIndex: prevIndex },
          });
        }
      },

      // Question bank management
      loadQuestions: async (_testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Load question bank from API
          // const response = await api.get(`/psychology/questions/${testType}`);
          // set({ questions: { ...get().questions, [testType]: response.data } });
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load question bank' 
          });
        }
      },

      // Load question data from API (with caching and retry)
      loadQuestionsFromAPI: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current language setting
          const language = get().getCurrentLanguage();
          
          // Start loading questions from API
          
          // First try to get from cache
          const cacheKey = `questions:${testType}:${language}`;
          const cachedQuestions = frontendCacheService.get<any[]>(cacheKey, 'questions');
          
          if (cachedQuestions && cachedQuestions.length > 0) {
            // Load questions from cache
            set(state => ({
              questions: {
                ...state.questions,
                [testType]: cachedQuestions
              },
              questionsLoaded: true,
              isLoading: false
            }));
            return;
          }
          
          // Cache miss, load from API (with retry)
          const retryResult = await retryService.executeWithRetry(
            () => questionService.getQuestionsByType(testType, language),
            { maxRetries: 3, retryDelay: 1000 }
          );
          
          if (retryResult.success && retryResult.data) {
            // retryResult.data is the return value of questionService
            const response = retryResult.data;
            console.log(`Retry service successful, questionService returned:`, response);
            
            if (response.success && response.data && Array.isArray(response.data)) {
              console.log(`Successfully loaded ${testType} questions from API, total ${response.data.length} questions`);
              
              // Update question data
              set(state => ({
                questions: {
                  ...state.questions,
                  [testType]: response.data
                },
                questionsLoaded: true,
                isLoading: false
              }));
              
              // Cache to local storage (24 hour expiration)
              frontendCacheService.set(cacheKey, response.data, {
                namespace: 'questions',
                ttl: 24 * 60 * 60 * 1000
              });
            } else {
              throw new Error(response.error || `Failed to load ${testType} questions`);
            }
          } else {
            throw new Error(retryResult.error || `Failed to load ${testType} questions`);
          }
        } catch (error) {
          console.error(`Failed to load ${testType} questions:`, error);
          
          // If API loading fails, display error message
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : `Failed to load ${testType} questions` 
          });
        }
      },

      getCurrentQuestion: () => {
        const { currentSession, questions, currentTestType } = get();
        if (!currentSession || !currentTestType) return null;

        const questionList = questions[currentTestType];
        
        // Debug information (production environment commented out)
        // console.log('getCurrentQuestion Debug:', {
        //   currentSession,
        //   currentTestType,
        //   questionListLength: questionList?.length,
        //   currentIndex: currentSession.currentQuestionIndex,
        //   questionList: questionList
        // });
        
        if (!questionList || currentSession.currentQuestionIndex >= questionList.length) {
          console.log('getCurrentQuestion: Returning null, reason:', {
            noQuestionList: !questionList,
            indexOutOfRange: currentSession.currentQuestionIndex >= (questionList?.length || 0)
          });
          return null;
        }

        return questionList[currentSession.currentQuestionIndex] || null;
      },

      // Result management
      generateResults: async (testType: TestType): Promise<TestResult> => {
        const { currentSession } = get();
        if (!currentSession) {
          throw new Error('No active test session');
        }

        // Use AI analysis to generate results
        return await get().analyzeTestResult(testType, currentSession.answers);
      },

      // Language management
      getCurrentLanguage: () => {
        // Try to get language from homepage store first
        try {
          const { useHomepageStore } = require('@/modules/homepage/stores/useHomepageStore');
          const homepageLanguage = useHomepageStore.getState().userPreferences.language;
          if (homepageLanguage) {
            return homepageLanguage === 'zh-CN' ? 'zh' : 'en';
          }
        } catch (error) {
          console.log('Unable to get homepage language setting, using default language');
        }
        
        // Fallback to browser language or default to 'zh'
        const browserLang = navigator.language || 'zh-CN';
        return browserLang.startsWith('zh') ? 'zh' : 'en';
      },

      // Progress management
      saveProgress: () => {
        const { currentSession } = get();
        if (!currentSession) return false;

        const progress = {
          testType: currentSession.testType,
          sessionId: currentSession.id,
          currentQuestionIndex: currentSession.currentQuestionIndex,
          answers: currentSession.answers,
          startTime: currentSession.startTime.toISOString(),
          lastUpdateTime: new Date().toISOString(),
          isCompleted: currentSession.status === TestStatus.COMPLETED
        };

        return progressManager.saveProgress(progress);
      },

      loadProgress: (testType: TestType, sessionId: string) => {
        return progressManager.loadProgress(testType, sessionId);
      },

      restoreProgress: (testType: TestType, sessionId: string) => {
        const progress = progressManager.loadProgress(testType, sessionId);
        if (progress && progress.answers.length > 0) {
          // Restore session state
          const session: TestSession = {
            id: progress.sessionId,
            testType: progress.testType,
            status: progress.isCompleted ? TestStatus.COMPLETED : TestStatus.IN_PROGRESS,
            startTime: new Date(progress.startTime),
            currentQuestionIndex: progress.currentQuestionIndex,
            answers: progress.answers,
            totalQuestions: get().questions[testType]?.length || 0
          };

          set({
            currentSession: session,
            currentTestType: testType,
            questionsLoaded: true
          });

          return true;
        }
        return false;
      },

      saveResults: async (testType: TestType, results: TestResult) => {
        try {
          // TODO: Save results to API or local storage
          console.log('Saving test results:', { testType, results });
        } catch (error) {
          console.error('Failed to save results:', error);
        }
      },

      loadResults: async (testType: TestType) => {
        try {
          // TODO: Load results from API or local storage
          const result = get().results[testType];
          if (result) {
            return {
              testType,
              result
            } as TestResult;
          }
          return null;
        } catch (error) {
          console.error('Failed to load results:', error);
          return null;
        }
      },

      // AI analysis management
      analyzeTestResult: async (testType: TestType, answers: UserAnswer[]) => {
        set({ isLoading: true, error: null });
        
        try {
          let analysisResult;
          
          switch (testType) {
            case TestType.MBTI:
              analysisResult = await psychologyAIService.analyzeMBTI(answers);
              break;
            case TestType.PHQ9:
              analysisResult = await psychologyAIService.analyzePHQ9(answers);
              break;
            case TestType.EQ:
              analysisResult = await psychologyAIService.analyzeEQ(answers);
              break;
            case TestType.HAPPINESS:
              analysisResult = await psychologyAIService.analyzeHappiness(answers);
              break;
            default:
              throw new Error('Unsupported test type');
          }
          
          if (analysisResult.success && analysisResult.data) {
            const testResult: TestResult = {
              testType,
              result: analysisResult.data
            };
            
            set({
              currentTestResult: testResult,
              isLoading: false,
              lastUpdated: new Date()
            });
            
            return testResult;
          } else {
            throw new Error(analysisResult.error || 'AI analysis failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to analyze test results';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
          throw error;
        }
      },

      // Get AI analysis status
      getAnalysisStatus: () => {
        const { isLoading, error, currentTestResult } = get();
        return {
          isLoading,
          error,
          hasResult: !!currentTestResult
        };
      },

      // Clear analysis results
      clearAnalysisResult: () => {
        set({
          currentTestResult: null,
          error: null
        });
      },

      // History management
      loadTestHistory: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Load test history from API
          // const response = await api.get('/psychology/history');
          // set({ testHistory: response.data });
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load test history' 
          });
        }
      },

      deleteTestSession: async (sessionId: string) => {
        try {
          // TODO: Delete test session from API
          const updatedHistory = get().testHistory.filter(session => session.id !== sessionId);
          set({ testHistory: updatedHistory });
        } catch (error) {
          console.error('Failed to delete test session:', error);
        }
      },

      // State management
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setCurrentTestType: (testType: TestType | null) => set({ currentTestType: testType }),
      setShowResults: (show: boolean) => set({ showResults: show }),
      reset: () => set({
        currentSession: null,
        testHistory: [],
        results: {
          [TestType.MBTI]: null,
          [TestType.PHQ9]: null,
          [TestType.EQ]: null,
          [TestType.HAPPINESS]: null,
        },
        currentTestResult: null,
        isLoading: false,
        error: null,
        currentTestType: null,
        showResults: false,
        lastUpdated: null,
        questionsLoaded: false,
      }),
    }),
    {
      name: 'psychology-store',
      partialize: (state) => ({
        currentSession: state.currentSession,
        testHistory: state.testHistory,
        currentTestType: state.currentTestType,
        questions: state.questions,
        currentTestResult: state.currentTestResult
      })
    }
  )
);