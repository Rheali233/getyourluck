/**
 * 统一测试状态管理接口
 * 解决Psychology和Career模块的重复代码问题
 */

import { ModuleState, ModuleActions } from './moduleState'

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
  answer: string | number | boolean
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
}

// 统一测试状态接口
export interface UnifiedTestState extends ModuleState {
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
}

// 统一测试操作接口
export interface UnifiedTestActions extends ModuleActions {
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
}

// 完整的统一测试状态管理接口
export interface UnifiedTestModuleState extends UnifiedTestState, UnifiedTestActions {}

// 测试类型枚举
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
  COGNITIVE = 'cognitive'
}

// 测试状态枚举
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
