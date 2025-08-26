/**
 * Relationship Module State Management
 * Following unified development standards with Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  RelationshipModuleState, 
  RelationshipModuleActions,
  TestSession, 
  UserAnswer, 
  TestResult
} from '../types';
import {
  TestType,
  TestStatus
} from '../types';
import { questionService } from '../services/questionService.js';

// Default question data (temporary, will be loaded from API)
const defaultQuestions = {
  [TestType.LOVE_LANGUAGE]: [],
  [TestType.LOVE_STYLE]: [],
  [TestType.INTERPERSONAL]: [],
};

/**
 * Relationship Module State Management Hook
 */
export const useRelationshipStore = create<RelationshipModuleState & RelationshipModuleActions>()(
  persist(
    (set, get) => ({
      // Base state
      currentSession: null,
      testHistory: [],
      questions: defaultQuestions,
      results: {
        [TestType.LOVE_LANGUAGE]: null,
        [TestType.LOVE_STYLE]: null,
        [TestType.INTERPERSONAL]: null,
      },
      currentTestResult: null,
      isLoading: false,
      error: null,
      currentTestType: null,
      showResults: false,
      lastUpdated: null,
      questionsLoaded: false,

      // Test session management
      startTest: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // Load questions from API if not loaded
          if (!get().questionsLoaded || !get().questions[testType]?.length) {
            await get().loadQuestionsFromAPI(testType);
          }
          
          const currentQuestions = get().questions[testType];
          
          if (!currentQuestions || currentQuestions.length === 0) {
            throw new Error(`Unable to load ${testType} test questions`);
          }
          
          // Create new test session
          const session: TestSession = {
            id: `session_${Date.now()}`,
            testType,
            status: TestStatus.IN_PROGRESS,
            startTime: new Date(),
            currentQuestionIndex: 0,
            answers: [],
            totalQuestions: currentQuestions.length,
            progress: 0,
          };
          
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

      // Submit answer
      submitAnswer: async (questionId: string, answer: string | number) => {
        try {
          const currentSession = get().currentSession;
          if (!currentSession) {
            throw new Error('No active test session');
          }

          const newAnswer: UserAnswer = {
            questionId,
            answer,
            timestamp: new Date().toISOString(),
          };

          const updatedAnswers = [...currentSession.answers, newAnswer];
          const updatedSession: TestSession = {
            ...currentSession,
            answers: updatedAnswers,
            progress: (updatedAnswers.length / currentSession.totalQuestions) * 100,
          };

          set({
            currentSession: updatedSession,
            testHistory: get().testHistory.map(s => 
              s.id === currentSession.id ? updatedSession : s
            ),
          });

          // Don't auto-complete - let user manually complete the test
          // This ensures consistent UX with MBTI test flow
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to submit answer' 
          });
        }
      },

      // Navigation
      goToNextQuestion: () => {
        const currentSession = get().currentSession;
        if (currentSession && currentSession.currentQuestionIndex < currentSession.totalQuestions - 1) {
          const updatedSession: TestSession = {
            ...currentSession,
            currentQuestionIndex: currentSession.currentQuestionIndex + 1,
          };
          set({ currentSession: updatedSession });
        }
      },

      goToPreviousQuestion: () => {
        const currentSession = get().currentSession;
        if (currentSession && currentSession.currentQuestionIndex > 0) {
          const updatedSession: TestSession = {
            ...currentSession,
            currentQuestionIndex: currentSession.currentQuestionIndex - 1,
          };
          set({ currentSession: updatedSession });
        }
      },

      // Get current question
      getCurrentQuestion: () => {
        const currentSession = get().currentSession;
        if (!currentSession) return null;
        
        const questions = get().questions[currentSession.testType];
        return questions[currentSession.currentQuestionIndex] || null;
      },

      // Submit test
      submitTest: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const currentSession = get().currentSession;
          if (!currentSession) {
            throw new Error('No active test session');
          }

          // Check if all questions are answered
          if (currentSession.answers.length < currentSession.totalQuestions) {
            throw new Error('Please answer all questions before completing the test');
          }

          // Import and use AI analysis service
          const { relationshipAIService } = await import('../services/relationshipAIService');
          const result = await relationshipAIService.analyzeTest(currentSession);
          
          const updatedSession: TestSession = {
            ...currentSession,
            status: TestStatus.COMPLETED,
            endTime: new Date(),
            progress: 100,
          };

          set({
            currentSession: updatedSession,
            currentTestResult: result,
            showResults: true,
            isLoading: false,
          });

          // Save results to local storage
          set(state => ({
            results: {
              ...state.results,
              [currentSession.testType]: result
            }
          }));

        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to submit test' 
          });
          throw error; // Re-throw to allow component to handle
        }
      },

      // Get test result
      getTestResult: async (_sessionId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Implement result retrieval from API
          // const result = await relationshipAIService.getTestResult(_sessionId);
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to get test result' 
          });
        }
      },

      // Submit feedback
      submitFeedback: async (_sessionId: string, _feedback: 'like' | 'dislike') => {
        try {
          // TODO: Implement feedback submission to API
          // await relationshipAIService.submitFeedback(_sessionId, _feedback);
          
          set({ error: null });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to submit feedback' 
          });
        }
      },

      // Reset test
      resetTest: () => {
        set({
          currentSession: null,
          currentTestResult: null,
          showResults: false,
          currentTestType: null,
          error: null,
        });
      },

      // Load questions from API
      loadQuestionsFromAPI: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          const questions = await questionService.getQuestions(testType);
          
          set({
            questions: {
              ...get().questions,
              [testType]: questions,
            },
            questionsLoaded: true,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to load questions' 
          });
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      updateLastUpdated: () => set({ lastUpdated: new Date().toISOString() }),
      setCurrentTestType: (testType: TestType | null) => set({ currentTestType: testType }),
      setShowResults: (show: boolean) => set({ showResults: show }),
      setCurrentTestResult: (result: TestResult | null) => set({ currentTestResult: result }),
    }),
    {
      name: 'relationship-store',
      partialize: (state) => ({
        testHistory: state.testHistory,
        results: state.results,
        questionsLoaded: state.questionsLoaded,
      }),
    }
  )
);
