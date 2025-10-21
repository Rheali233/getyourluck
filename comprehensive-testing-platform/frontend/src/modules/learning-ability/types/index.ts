/**
 * Learning Ability Module Type Definitions
 * Follows unified development standard type definition specifications
 */

/* eslint-disable no-unused-vars */
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestStatus, QuestionFormat } from '@/modules/testing/types/TestTypes';

// Learning-specific test type constants
export const LearningTestTypes = {
  VARK: 'vark',
} as const;

export type LearningTestType = typeof LearningTestTypes[keyof typeof LearningTestTypes];

// Base question interface
export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionFormat;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

// VARK learning style question interface
export interface VarkQuestion extends BaseQuestion {
  dimension?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  category?: 'V' | 'A' | 'R' | 'K';
  options: {
    id: string;
    text: string;
    value: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    description: string;
  }[];
}

// Raven Progressive Matrices question interface (removed)


// User answer interface
export interface UserAnswer {
  questionId: string;
  answer: string | number;
  timestamp: string;
  timeSpent?: number;
}

// Test session interface
export interface TestSession {
  id: string;
  testType: LearningTestType;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

// Test progress interface
export interface TestProgress {
  testType: LearningTestType;
  sessionId: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: string;
  lastUpdateTime: string;
  isCompleted: boolean;
}

// VARK test result interface
export interface VarkResult {
  learningStyle: 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic' | 'Multimodal';
  styleName: string;
  styleDescription: string;
  scores: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  detailedAnalysis: string;
  learningPreferences: {
    studyMethods: string[];
    environment: string[];
    materials: string[];
    activities: string[];
  };
  recommendations: {
    visual: string[];
    auditory: string[];
    reading: string[];
    kinesthetic: string[];
  };
  studyStrategies: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  learningEnvironment: {
    optimal: string;
    lighting: string;
    noise: string;
    organization: string;
  };
}

// Raven and Cognitive test interfaces removed - no longer needed

// Test result union type
export interface TestResult {
  testType: LearningTestType;
  result: VarkResult;
}

// Learning module state
export interface LearningState {
  // Test session management
  currentSession: TestSession | null;
  testHistory: TestSession[];
  
  // Question bank data
  questions: {
    [LearningTestTypes.VARK]: VarkQuestion[];
  };
  
  // Test results
  results: {
    [LearningTestTypes.VARK]: VarkResult | null;
  };
  
  // AI analysis results
  currentTestResult: TestResult | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  currentLearningTestType: LearningTestType | null;
  showResults: boolean;
  lastUpdated: Date | null;
  
  // Question loading status
  questionsLoaded: boolean;
}

// Learning module operations
export interface LearningActions {
  // Test session management
  startTest: (_testType: LearningTestType) => Promise<void>;
  pauseTest: () => void;
  resumeTest: () => void;
  endTest: () => Promise<{ success: boolean; data?: TestResult; error?: string }>;
  resetTest: () => void;
  
  // Answer management
  submitAnswer: (_questionId: string, _answer: string | number) => void;
  goToQuestion: (_index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  
  // Question bank management
  loadQuestions: (_testType: LearningTestType) => Promise<void>;
  loadQuestionsFromAPI: (_testType: LearningTestType) => Promise<void>;
  getCurrentQuestion: () => VarkQuestion | null;
  
  // Result management
  generateResults: (_testType: LearningTestType) => Promise<TestResult>;
  saveResults: (_testType: LearningTestType, _results: TestResult) => Promise<void>;
  loadResults: (_testType: LearningTestType) => Promise<TestResult | null>;
  
  // Progress management
  saveProgress: () => boolean;
  loadProgress: (_testType: LearningTestType, _sessionId: string) => TestProgress | null;
  restoreProgress: (_testType: LearningTestType, _sessionId: string) => boolean;
  
  // AI analysis management
  analyzeTestResult: (_testType: LearningTestType, _answers: UserAnswer[]) => Promise<TestResult>;
  getAnalysisStatus: () => { isLoading: boolean; error: string | null; hasResult: boolean };
  clearAnalysisResult: () => void;
  
  // History management
  loadTestHistory: () => Promise<void>;
  deleteTestSession: (_sessionId: string) => Promise<void>;
  
  // State management
  setLoading: (_loading: boolean) => void;
  setError: (_error: string | null) => void;
  setCurrentLearningTestType: (_testType: LearningTestType | null) => void;
  setShowResults: (_show: boolean) => void;
  reset: () => void;
  
  // Language management
  getCurrentLanguage: () => string;
}

// Learning module state (inherits unified interface)
export interface LearningModuleState extends LearningState, LearningActions {}

// Component property interface
export interface TestContainerProps extends BaseComponentProps {
  testType: LearningTestType;
  onTestComplete: (_results: TestResult) => void;
  onTestPause: () => void;
}

export interface QuestionDisplayProps extends BaseComponentProps {
  question: VarkQuestion;
  onAnswer: (_answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  testType?: LearningTestType;
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
  testType: LearningTestType;
  onRetake: () => void;
  onShare: () => void;
  onSave: () => void;
}

export interface TestSelectionProps extends BaseComponentProps {
  onTestSelect: (_testType: LearningTestType) => void;
  testHistory: TestSession[];
}

export interface VarkResultsProps extends BaseComponentProps {
  results: VarkResult;
  onRetake: () => void;
}

// Raven Progressive Matrices result interface (removed)

// Cognitive ability result interface
