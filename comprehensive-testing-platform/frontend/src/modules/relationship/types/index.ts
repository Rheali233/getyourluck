/**
 * Relationship Module Type Definitions
 * Following unified development standards
 */

import type { BaseComponentProps } from '../../../types/componentTypes';

// Test Type Constants
export const TestType = {
  LOVE_LANGUAGE: 'love_language',
  LOVE_STYLE: 'love_style',
  INTERPERSONAL: 'interpersonal',
} as const;

export type TestType = typeof TestType[keyof typeof TestType];

// Test Status Constants
export const TestStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export type TestStatus = typeof TestStatus[keyof typeof TestStatus];

// Question Type Constants
export const QuestionType = {
  SINGLE_CHOICE: 'single_choice',
  LIKERT_SCALE: 'likert_scale',
  MULTIPLE_CHOICE: 'multiple_choice',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

// Base Question Interface
export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

// Love Language Question Interface
export interface LoveLanguageQuestion extends BaseQuestion {
  dimension: 'words_of_affirmation' | 'quality_time' | 'receiving_gifts' | 'acts_of_service' | 'physical_touch';
  category: 'words' | 'time' | 'gifts' | 'service' | 'touch';
  isReverseScored?: boolean;
  isNeutral?: boolean;
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// Love Style Question Interface
export interface LoveStyleQuestion extends BaseQuestion {
  dimension: 'eros' | 'ludus' | 'storge' | 'mania' | 'pragma' | 'agape';
  category: 'passionate' | 'playful' | 'friendship' | 'possessive' | 'practical' | 'altruistic';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// Interpersonal Question Interface
export interface InterpersonalQuestion extends BaseQuestion {
  dimension: 'social_initiative' | 'emotional_support' | 'conflict_resolution' | 'boundary_setting';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// User Answer Interface
export interface UserAnswer {
  questionId: string;
  answer: string | number;
  timestamp: string;
  timeSpent?: number;
  confidence?: number;
}

// Test Session Interface
export interface TestSession {
  id: string;
  testType: TestType;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  totalQuestions: number;
  progress: number;
}

// Test Result Interface
export interface TestResult {
  sessionId: string;
  testType: TestType;
  scores: Record<string, number>;
  primaryType?: string;
  secondaryType?: string;
  interpretation: string;
  recommendations: string[];
  strengths: string[];
  areasForGrowth: string[];
  relationshipAdvice: string[];
  completedAt: string;
  summary?: string;
}

// Component Props Interfaces
export interface QuestionDisplayProps extends BaseComponentProps {
  question: LoveLanguageQuestion | LoveStyleQuestion | InterpersonalQuestion;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  testType: TestType;
  isCompleting?: boolean;
}

export interface TestContainerProps extends BaseComponentProps {
  testType: TestType;
}

export interface TestResultsProps extends BaseComponentProps {
  result: TestResult;
  testType: TestType;
  onRetakeTest: () => void;
  onShareResult: () => void;
}

// Store State Interface
export interface RelationshipModuleState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  currentSession: TestSession | null;
  testHistory: TestSession[];
  questions: {
    [TestType.LOVE_LANGUAGE]: LoveLanguageQuestion[];
    [TestType.LOVE_STYLE]: LoveStyleQuestion[];
    [TestType.INTERPERSONAL]: InterpersonalQuestion[];
  };
  results: {
    [TestType.LOVE_LANGUAGE]: TestResult | null;
    [TestType.LOVE_STYLE]: TestResult | null;
    [TestType.INTERPERSONAL]: TestResult | null;
  };
  currentTestResult: TestResult | null;
  currentTestType: TestType | null;
  showResults: boolean;
  questionsLoaded: boolean;
}

// Store Actions Interface
// AI Analysis Interfaces
export interface AIAnalysisRequest {
  testType: 'love_language' | 'love_style' | 'interpersonal';
  answers: Array<{ questionId: string; answer: string | number; timestamp: string }>;
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: TestResult;
  error?: string;
}

export interface RelationshipModuleActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateLastUpdated: () => void;
  startTest: (testType: TestType) => Promise<void>;
  submitAnswer: (questionId: string, answer: string | number) => Promise<void>;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  getCurrentQuestion: () => LoveLanguageQuestion | LoveStyleQuestion | InterpersonalQuestion | null;
  submitTest: () => Promise<void>;
  getTestResult: (sessionId: string) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetTest: () => void;
  loadQuestionsFromAPI: (testType: TestType) => Promise<void>;
  setCurrentTestType: (testType: TestType | null) => void;
  setShowResults: (show: boolean) => void;
  setCurrentTestResult: (result: TestResult | null) => void;
}
