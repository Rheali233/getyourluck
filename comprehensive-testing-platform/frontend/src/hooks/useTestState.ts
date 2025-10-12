/**
 * 简化的测试状态管理Hook
 * 配置驱动，避免过度封装
 */

import { useMemo } from 'react'
import { useUnifiedTestStore } from '../stores/unifiedTestStore'

// 配置选项接口
interface TestStateOptions {
  enableCache?: boolean
  enableMonitoring?: boolean
  cacheTTL?: number
}

// 测试状态Hook
export const useTestState = (testType: string, options: TestStateOptions = {}) => {
  const state = useUnifiedTestStore()
  
  // 根据配置动态启用功能
  const {
    enableCache = true,
    enableMonitoring = false,
    cacheTTL = 5 * 60 * 1000
  } = options
  
  // 使用useMemo优化计算属性
  const testData = useMemo(() => ({
    // 基础状态
    session: state.currentSession,
    questions: state.questions[testType] || [],
    questionsLoaded: state.questionsLoaded[testType] || false,
    result: state.results[testType] || null,
    
    // 测试状态
    progress: state.progress,
    isTestStarted: state.isTestStarted,
    isTestPaused: state.isTestPaused,
    isTestCompleted: state.isTestCompleted,
    
    // UI状态
    showResults: state.showResults,
    error: state.error,
    isLoading: state.isLoading
  }), [state, testType])
  
  // 使用useCallback优化方法
  const actions = useMemo(() => ({
    // 测试控制
    startTest: state.startTest,
    pauseTest: state.pauseTest,
    resumeTest: state.resumeTest,
    endTest: state.endTest,
    resetTest: state.resetTest,
    submitAnswer: state.submitAnswer,
    
    // 数据管理
    loadQuestions: state.loadQuestions,
    setShowResults: state.setShowResults,
    setError: state.setError,
    clearError: state.clearError,
    setLoading: state.setLoading
  }), [state])
  
  // 缓存操作（根据配置启用）
  const cacheActions = useMemo(() => {
    if (!enableCache) return {}
    
    return {
      setCache: (key: string, value: any) => 
        state.setCache(key, value, cacheTTL),
      getCache: state.getCache,
      clearCache: state.clearCache
    }
  }, [enableCache, cacheTTL, state])
  
  // 性能监控（根据配置启用）
  const monitoring = useMemo(() => {
    if (!enableMonitoring) return null
    
    return {
      renderTime: performance.now(),
      lastUpdate: Date.now(),
      getMetrics: () => ({
        renderTime: performance.now(),
        lastUpdate: Date.now(),
        testType,
        questionsCount: testData.questions.length
      })
    }
  }, [enableMonitoring, testData.questions.length, testType])
  
  return {
    ...testData,
    ...actions,
    ...cacheActions,
    monitoring,
    // 便捷方法
    hasQuestions: testData.questions.length > 0,
    isLastQuestion: (index: number) => index === testData.questions.length - 1,
    getQuestion: (index: number) => testData.questions[index] || null,
    getProgressPercentage: () => Math.round((testData.progress / 100) * 100)
  }
}

// 专门用于测试会话的Hook（简化版）
export const useTestSession = (testType: string) => {
  const { session, startTest, pauseTest, resumeTest, endTest, resetTest } = 
    useTestState(testType, { enableCache: false, enableMonitoring: false })
  
  return {
    session,
    startTest,
    pauseTest,
    resumeTest,
    endTest,
    resetTest
  }
}

// 专门用于测试数据的Hook（简化版）
export const useTestData = (testType: string) => {
  const { 
    questions, 
    questionsLoaded, 
    result, 
    loadQuestions,
    hasQuestions,
    getQuestion 
  } = useTestState(testType, { enableCache: true, enableMonitoring: false })
  
  return {
    questions,
    questionsLoaded,
    result,
    loadQuestions,
    hasQuestions,
    getQuestion
  }
}
