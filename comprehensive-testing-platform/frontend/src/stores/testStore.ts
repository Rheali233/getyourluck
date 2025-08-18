/**
 * 测试模块状态管理
 * 遵循统一开发标准的ModuleState接口
 */

import { create } from 'zustand'
import type { TestModuleState, TestModuleActions } from '@/shared/types/moduleState'
import type { TestResult } from '@/shared/types/apiResponse'
import { testService } from '@/services/testService'

export const useTestStore = create<TestModuleState & TestModuleActions>((set, get) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,

  // 测试专用状态
  currentTest: null,
  currentQuestion: 0,
  answers: [],
  result: null,
  progress: 0,

  // 基础操作
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  setData: (data: any) => set({ data, lastUpdated: new Date() }),

  // 测试专用操作
  startTest: (testType: string) => {
    set({
      currentTest: testType,
      currentQuestion: 0,
      answers: [],
      result: null,
      progress: 0,
      isLoading: false,
      error: null,
    })
  },

  submitAnswer: (answer: any) => {
    const { answers, currentQuestion } = get()
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer

    // 假设总共20题，计算进度
    const totalQuestions = 20
    const progress = ((currentQuestion + 1) / totalQuestions) * 100

    set({
      answers: newAnswers,
      progress: Math.min(progress, 100),
    })
  },

  nextQuestion: () => {
    const { currentQuestion } = get()
    set({ currentQuestion: currentQuestion + 1 })
  },

  calculateResult: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { currentTest, answers } = get()
      
      if (!currentTest || answers.length === 0) {
        throw new Error('No test data available')
      }

      const response = await testService.submitTest({
        testType: currentTest,
        answers,
        userInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to calculate result')
      }

      const result = response.data as TestResult

      set({
        result,
        isLoading: false,
        data: result,
        lastUpdated: new Date(),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate result'
      set({
        isLoading: false,
        error: errorMessage,
      })
    }
  },

  reset: () => {
    set({
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      currentTest: null,
      currentQuestion: 0,
      answers: [],
      result: null,
      progress: 0,
    })
  },

  resetTest: () => {
    const { reset } = get()
    reset()
  },
}))