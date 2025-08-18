/**
 * 心理测试模块类型定义
 * 遵循统一开发标准的类型定义规范
 */

import type { BaseComponentProps } from '@/types/componentTypes';

// 测试类型常量
export const TestType = {
  MBTI: 'mbti',
  PHQ9: 'phq9',
  EQ: 'eq',
  HAPPINESS: 'happiness',
} as const;

export type TestType = typeof TestType[keyof typeof TestType];

// 测试状态常量
export const TestStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export type TestStatus = typeof TestStatus[keyof typeof TestStatus];

// 题目类型常量
export const QuestionType = {
  SINGLE_CHOICE: 'single_choice',
  LIKERT_SCALE: 'likert_scale',
  MULTIPLE_CHOICE: 'multiple_choice',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

// 基础题目接口
export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

// MBTI题目接口
export interface MbtiQuestion extends BaseQuestion {
  dimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
  options: {
    id: string;
    text: string;
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
}

// PHQ-9题目接口
export interface Phq9Question extends BaseQuestion {
  symptom: string;
  options: {
    id: string;
    text: string;
    value: 0 | 1 | 2 | 3;
    description: string;
  }[];
}

// 情商题目接口
export interface EqQuestion extends BaseQuestion {
  dimension: 'self_awareness' | 'self_management' | 'social_awareness' | 'relationship_management';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// 幸福指数题目接口
export interface HappinessQuestion extends BaseQuestion {
  domain: 'work' | 'relationships' | 'health' | 'personal_growth' | 'life_balance';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    description: string;
  }[];
}

// 用户答案接口
export interface UserAnswer {
  questionId: string;
  answer: string | number;
  timestamp: string;
  timeSpent?: number;
}

// 测试会话接口
export interface TestSession {
  id: string;
  testType: TestType;
  status: TestStatus;
  startTime: string;
  endTime?: string;
  answers: UserAnswer[];
  progress: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

// MBTI结果接口
export interface MbtiResult {
  type: string; // 例如: "INTJ", "ENFP"
  dimensions: {
    E_I: { score: number; preference: 'E' | 'I' };
    S_N: { score: number; preference: 'S' | 'N' };
    T_F: { score: number; preference: 'T' | 'F' };
    J_P: { score: number; preference: 'J' | 'P' };
  };
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  relationshipAdvice: string[];
  developmentTips: string[];
}

// PHQ-9结果接口
export interface Phq9Result {
  totalScore: number;
  riskLevel: 'none' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  symptoms: {
    [key: string]: number;
  };
  assessment: string;
  recommendations: string[];
  professionalHelp: string[];
  resources: string[];
  disclaimer: string;
}

// 情商结果接口
export interface EqResult {
  totalScore: number;
  dimensions: {
    self_awareness: { score: number; level: string; description: string };
    self_management: { score: number; level: string; description: string };
    social_awareness: { score: number; level: string; description: string };
    relationship_management: { score: number; level: string; description: string };
  };
  overallLevel: string;
  strengths: string[];
  improvementAreas: string[];
  practicalTips: string[];
  exercises: string[];
}

// 幸福指数结果接口
export interface HappinessResult {
  totalScore: number;
  domains: {
    work: { score: number; level: string; suggestions: string[] };
    relationships: { score: number; level: string; suggestions: string[] };
    health: { score: number; level: string; suggestions: string[] };
    personal_growth: { score: number; level: string; suggestions: string[] };
    life_balance: { score: number; level: string; suggestions: string[] };
  };
  overallLevel: string;
  lifeSatisfaction: string;
  improvementPlan: string[];
  dailyPractices: string[];
  longTermGoals: string[];
}

// 测试结果联合类型
export type TestResult = MbtiResult | Phq9Result | EqResult | HappinessResult;

// 心理测试模块状态
export interface PsychologyState {
  // 测试会话管理
  currentSession: TestSession | null;
  testHistory: TestSession[];
  
  // 题库数据
  questions: {
    [TestType.MBTI]: MbtiQuestion[];
    [TestType.PHQ9]: Phq9Question[];
    [TestType.EQ]: EqQuestion[];
    [TestType.HAPPINESS]: HappinessQuestion[];
  };
  
  // 测试结果
  results: {
    [TestType.MBTI]: MbtiResult | null;
    [TestType.PHQ9]: Phq9Result | null;
    [TestType.EQ]: EqResult | null;
    [TestType.HAPPINESS]: HappinessResult | null;
  };
  
  // UI状态
  isLoading: boolean;
  error: string | null;
  currentTestType: TestType | null;
  showResults: boolean;
}

// 心理测试模块操作
export interface PsychologyActions {
  // 测试会话管理
  startTest: (testType: TestType) => Promise<void>;
  pauseTest: () => void;
  resumeTest: () => void;
  endTest: () => Promise<void>;
  resetTest: () => void;
  
  // 答题管理
  submitAnswer: (questionId: string, answer: string | number) => void;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  
  // 题库管理
  loadQuestions: (testType: TestType) => Promise<void>;
  getCurrentQuestion: () => BaseQuestion | null;
  
  // 结果管理
  generateResults: (testType: TestType) => Promise<TestResult>;
  saveResults: (testType: TestType, results: TestResult) => Promise<void>;
  loadResults: (testType: TestType) => Promise<TestResult | null>;
  
  // 历史管理
  loadTestHistory: () => Promise<void>;
  deleteTestSession: (sessionId: string) => Promise<void>;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentTestType: (testType: TestType | null) => void;
  setShowResults: (show: boolean) => void;
  reset: () => void;
}

// 心理测试模块状态（继承统一接口）
export interface PsychologyModuleState extends PsychologyState, PsychologyActions {}

// 组件属性接口
export interface TestContainerProps extends BaseComponentProps {
  testType: TestType;
  onTestComplete: (results: TestResult) => void;
  onTestPause: () => void;
}

export interface QuestionDisplayProps extends BaseComponentProps {
  question: BaseQuestion;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
}

export interface TestProgressProps extends BaseComponentProps {
  current: number;
  total: number;
  progress: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
}

export interface ResultsDisplayProps extends BaseComponentProps {
  results: TestResult;
  testType: TestType;
  onRetake: () => void;
  onShare: () => void;
  onSave: () => void;
}

export interface TestSelectionProps extends BaseComponentProps {
  onTestSelect: (testType: TestType) => void;
  testHistory: TestSession[];
}

export interface MbtiResultsProps extends BaseComponentProps {
  results: MbtiResult;
  onRetake: () => void;
}

export interface Phq9ResultsProps extends BaseComponentProps {
  results: Phq9Result;
  onRetake: () => void;
  onGetHelp: () => void;
}

export interface EqResultsProps extends BaseComponentProps {
  results: EqResult;
  onRetake: () => void;
}

export interface HappinessResultsProps extends BaseComponentProps {
  results: HappinessResult;
  onRetake: () => void;
} 