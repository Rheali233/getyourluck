/**
 * useTestState Hook 单元测试
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTestState, useTestSession, useTestData } from '../../../src/hooks/useTestState'

// Mock useUnifiedTestStore
vi.mock('../../../src/stores/unifiedTestStore', () => ({
  useUnifiedTestStore: () => {
    const mockState = {
      currentSession: { id: 'test-session', startTime: new Date() },
      questions: {
        psychology: [
          { id: 'q1', question: 'Test question 1', options: ['A', 'B', 'C'] },
          { id: 'q2', question: 'Test question 2', options: ['D', 'E', 'F'] }
        ]
      },
      questionsLoaded: { psychology: true },
      results: { psychology: null },
      progress: 0,
      isTestStarted: false,
      isTestPaused: false,
      isTestCompleted: false,
      showResults: false,
      error: null,
      isLoading: false,
      startTest: vi.fn(),
      pauseTest: vi.fn(),
      resumeTest: vi.fn(),
      endTest: vi.fn(),
      resetTest: vi.fn(),
      submitAnswer: vi.fn(),
      loadQuestions: vi.fn(),
      setShowResults: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn(),
      setLoading: vi.fn(),
      setCache: vi.fn(),
      getCache: vi.fn(),
      clearCache: vi.fn()
    }
    
    return () => mockState
  }
}))

describe('useTestState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return test state with default options', () => {
    const { result } = renderHook(() => useTestState('psychology'))
    
    expect(result.current.session).toBeDefined()
    expect(result.current.questions).toHaveLength(2)
    expect(result.current.questionsLoaded).toBe(true)
    expect(result.current.hasQuestions).toBe(true)
    expect(result.current.getQuestion(0)).toBeDefined()
    expect(result.current.getProgressPercentage()).toBe(0)
  })

  it('should enable cache when specified', () => {
    const { result } = renderHook(() => 
      useTestState('psychology', { enableCache: true })
    )
    
    expect(result.current.setCache).toBeDefined()
    expect(result.current.getCache).toBeDefined()
    expect(result.current.clearCache).toBeDefined()
  })

  it('should disable cache when specified', () => {
    const { result } = renderHook(() => 
      useTestState('psychology', { enableCache: false })
    )
    
    expect(result.current.setCache).toBeUndefined()
    expect(result.current.getCache).toBeUndefined()
    expect(result.current.clearCache).toBeUndefined()
  })

  it('should enable monitoring when specified', () => {
    const { result } = renderHook(() => 
      useTestState('psychology', { enableMonitoring: true })
    )
    
    expect(result.current.monitoring).toBeDefined()
    expect(result.current.monitoring?.getMetrics).toBeDefined()
  })

  it('should disable monitoring when specified', () => {
    const { result } = renderHook(() => 
      useTestState('psychology', { enableMonitoring: false })
    )
    
    expect(result.current.monitoring).toBeNull()
  })

  it('should provide convenient methods', () => {
    const { result } = renderHook(() => useTestState('psychology'))
    
    expect(result.current.hasQuestions).toBe(true)
    expect(result.current.isLastQuestion(0)).toBe(false)
    expect(result.current.isLastQuestion(1)).toBe(true)
    expect(result.current.getQuestion(0)?.question).toBe('Test question 1')
  })
})

describe('useTestSession', () => {
  it('should return session-related state and actions', () => {
    const { result } = renderHook(() => useTestSession('psychology'))
    
    expect(result.current.session).toBeDefined()
    expect(result.current.startTest).toBeDefined()
    expect(result.current.pauseTest).toBeDefined()
    expect(result.current.resumeTest).toBeDefined()
    expect(result.current.endTest).toBeDefined()
    expect(result.current.resetTest).toBeDefined()
  })
})

describe('useTestData', () => {
  it('should return data-related state and actions', () => {
    const { result } = renderHook(() => useTestData('psychology'))
    
    expect(result.current.questions).toHaveLength(2)
    expect(result.current.questionsLoaded).toBe(true)
    expect(result.current.result).toBeNull()
    expect(result.current.loadQuestions).toBeDefined()
    expect(result.current.hasQuestions).toBe(true)
    expect(result.current.getQuestion).toBeDefined()
  })
})
