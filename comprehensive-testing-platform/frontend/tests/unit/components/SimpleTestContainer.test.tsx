/**
 * SimpleTestContainer 组件单元测试
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SimpleTestContainer } from '../../../src/components/SimpleTestContainer'

// Mock hooks
vi.mock('../../../src/hooks/useTestState', () => ({
  useTestState: vi.fn()
}))

vi.mock('../../../src/hooks/useSimplePerformanceMonitor', () => ({
  useSimplePerformanceMonitor: vi.fn()
}))

describe('SimpleTestContainer', () => {
  const mockUseTestState = vi.mocked(require('../../../src/hooks/useTestState').useTestState)
  const mockUsePerformanceMonitor = vi.mocked(require('../../../src/hooks/useSimplePerformanceMonitor').useSimplePerformanceMonitor)
  
  const defaultMockState = {
    session: null,
    questions: [],
    questionsLoaded: false,
    result: null,
    showResults: false,
    progress: 0,
    isTestStarted: false,
    isTestPaused: false,
    isTestCompleted: false,
    error: null,
    isLoading: false,
    startTest: vi.fn(),
    submitAnswer: vi.fn(),
    endTest: vi.fn(),
    pauseTest: vi.fn(),
    resumeTest: vi.fn(),
    resetTest: vi.fn(),
    loadQuestions: vi.fn(),
    setShowResults: vi.fn(),
    hasQuestions: false,
    getQuestion: vi.fn(),
    getProgressPercentage: vi.fn(() => 0)
  }
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePerformanceMonitor.mockReturnValue(null)
  })
  
  it('should render start test interface when test is not started', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: false
    })
    
    render(<SimpleTestContainer testType="psychology" />)
    
    expect(screen.getByText('Simple Test: psychology')).toBeInTheDocument()
    expect(screen.getByText('Total Questions: 20')).toBeInTheDocument()
    expect(screen.getByText('Start Test')).toBeInTheDocument()
  })
  
  it('should render test in progress interface when test is started', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: true,
      isTestCompleted: false,
      questions: [
        { id: 'q1', question: 'Test question?', options: ['A', 'B', 'C'] }
      ],
      hasQuestions: true,
      getQuestion: vi.fn(() => ({ id: 'q1', question: 'Test question?', options: ['A', 'B', 'C'] }))
    })
    
    render(<SimpleTestContainer testType="psychology" />)
    
    expect(screen.getByText('Test in Progress: psychology')).toBeInTheDocument()
    expect(screen.getByText('Question 1 of 20 (0%)')).toBeInTheDocument()
    expect(screen.getByText('Test question?')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })
  
  it('should render test completed interface when test is finished', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: true,
      isTestCompleted: true,
      showResults: true
    })
    
    render(<SimpleTestContainer testType="psychology" />)
    
    expect(screen.getByText('Test Completed: psychology')).toBeInTheDocument()
    expect(screen.getByText('Test Summary')).toBeInTheDocument()
    expect(screen.getByText('Retake Test')).toBeInTheDocument()
  })
  
  it('should show performance info when monitoring is enabled', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: false
    })
    
    mockUsePerformanceMonitor.mockReturnValue({
      metrics: { renderCount: 5 }
    })
    
    render(<SimpleTestContainer testType="psychology" enableMonitoring={true} />)
    
    expect(screen.getByText('Render Count: 5')).toBeInTheDocument()
  })
  
  it('should handle custom total questions', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: false
    })
    
    render(<SimpleTestContainer testType="psychology" totalQuestions={50} />)
    
    expect(screen.getByText('Total Questions: 50')).toBeInTheDocument()
  })
  
  it('should apply custom className', () => {
    mockUseTestState.mockReturnValue({
      ...defaultMockState,
      isTestStarted: false
    })
    
    const { container } = render(
      <SimpleTestContainer testType="psychology" className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('simple-test-container', 'custom-class')
  })
})
