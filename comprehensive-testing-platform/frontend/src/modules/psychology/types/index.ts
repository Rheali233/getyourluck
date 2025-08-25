/**
 * Psychology Module Type Definitions
 * Follows unified development standard type definition specifications
 */

import type { BaseComponentProps } from '@/types/componentTypes';

// Test type constants
export const TestType = {
  MBTI: 'mbti',
  PHQ9: 'phq9',
  EQ: 'eq',
  HAPPINESS: 'happiness',
} as const;

export type TestType = typeof TestType[keyof typeof TestType];

// Test status constants
export const TestStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export type TestStatus = typeof TestStatus[keyof typeof TestStatus];

// Question type constants
export const QuestionType = {
  SINGLE_CHOICE: 'single_choice',
  LIKERT_SCALE: 'likert_scale',
  MULTIPLE_CHOICE: 'multiple_choice',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

// Base question interface
export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

// MBTI question interface
export interface MbtiQuestion extends BaseQuestion {
  dimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
  category: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// PHQ-9 question interface
export interface Phq9Question extends BaseQuestion {
  symptom: string;
  options: {
    id: string;
    text: string;
    value: 0 | 1 | 2 | 3;
    description: string;
  }[];
}

// Emotional intelligence question interface
export interface EqQuestion extends BaseQuestion {
  dimension: 'self_awareness' | 'self_regulation' | 'motivation' | 'empathy' | 'social_skills';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// Happiness index question interface
export interface HappinessQuestion extends BaseQuestion {
  dimension: 'P' | 'E' | 'R' | 'M' | 'A'; // Five dimensions of PERMA model
  domain: string; // Specific sub-dimensions, such as optimism, gratitude, etc.
  reverseScored?: boolean; // Whether reverse scoring is applied
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5; // 5-point Likert scale
    description: string;
  }[];
}

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
  testType: TestType;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

// Test progress interface
export interface TestProgress {
  testType: TestType;
  sessionId: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: string;
  lastUpdateTime: string;
  isCompleted: boolean;
}

// Remove old duplicate type definitions, use new unified types
// Delete old definitions of MbtiResult, Phq9Result, EqResult

// Happiness index result interface
export interface HappinessResult {
  totalScore: number;
  maxScore: number;
  happinessLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  levelName: string;
  levelDescription: string;
  domains: HappinessDomain[];
  overallAnalysis: string;
  improvementPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    dailyHabits: string[];
  };
  lifeBalanceAssessment: {
    workLifeBalance: string;
    socialConnections: string;
    personalGrowth: string;
    healthWellness: string;
  };
  gratitudePractices: string[];
  mindfulnessTips: string[];
  communityEngagement: string[];
}

export interface HappinessDomain {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  currentStatus: string;
  improvementAreas: string[];
  positiveAspects: string[];
}

// Test result union type
export interface TestResult {
  testType: TestType;
  result: MBTIResult | PHQ9Result | EQResult | HappinessResult;
}

// Psychology module state
export interface PsychologyState {
  // Test session management
  currentSession: TestSession | null;
  testHistory: TestSession[];
  
  // Question bank data
  questions: {
    [TestType.MBTI]: MbtiQuestion[];
    [TestType.PHQ9]: Phq9Question[];
    [TestType.EQ]: EqQuestion[];
    [TestType.HAPPINESS]: HappinessQuestion[];
  };
  
  // Test results
  results: {
    [TestType.MBTI]: MBTIResult | null;
    [TestType.PHQ9]: PHQ9Result | null;
    [TestType.EQ]: EQResult | null;
    [TestType.HAPPINESS]: HappinessResult | null;
  };
  
  // AI analysis results
  currentTestResult: TestResult | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  currentTestType: TestType | null;
  showResults: boolean;
  lastUpdated: Date | null;
  
  // Question loading status
  questionsLoaded: boolean;
}

// Psychology module operations
export interface PsychologyActions {
  // Test session management
  startTest: (testType: TestType) => Promise<void>;
  pauseTest: () => void;
  resumeTest: () => void;
  endTest: () => Promise<{ success: boolean; data?: TestResult; error?: string }>;
  resetTest: () => void;
  
  // Answer management
  submitAnswer: (questionId: string, answer: string | number) => void;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  
  // Question bank management
  loadQuestions: (testType: TestType) => Promise<void>;
  loadQuestionsFromAPI: (testType: TestType) => Promise<void>;
  getCurrentQuestion: () => MbtiQuestion | Phq9Question | EqQuestion | HappinessQuestion | null;
  
  // Result management
  generateResults: (testType: TestType) => Promise<TestResult>;
  saveResults: (testType: TestType, results: TestResult) => Promise<void>;
  loadResults: (testType: TestType) => Promise<TestResult | null>;
  
  // Progress management
  saveProgress: () => boolean;
  loadProgress: (testType: TestType, sessionId: string) => TestProgress | null;
  restoreProgress: (testType: TestType, sessionId: string) => boolean;
  
  // AI analysis management
  analyzeTestResult: (testType: TestType, answers: UserAnswer[]) => Promise<TestResult>;
  getAnalysisStatus: () => { isLoading: boolean; error: string | null; hasResult: boolean };
  clearAnalysisResult: () => void;
  
  // History management
  loadTestHistory: () => Promise<void>;
  deleteTestSession: (sessionId: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentTestType: (testType: TestType | null) => void;
  setShowResults: (show: boolean) => void;
  reset: () => void;
  
  // Language management
  getCurrentLanguage: () => string;
}

// Psychology module state (inherits unified interface)
export interface PsychologyModuleState extends PsychologyState, PsychologyActions {}

// Component property interface
export interface TestContainerProps extends BaseComponentProps {
  testType: TestType;
  onTestComplete: (results: TestResult) => void;
  onTestPause: () => void;
}

export interface QuestionDisplayProps extends BaseComponentProps {
  question: MbtiQuestion | Phq9Question | EqQuestion | HappinessQuestion;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  testType?: TestType;
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
  results: MBTIResult;
  onRetake: () => void;
}

export interface Phq9ResultsProps extends BaseComponentProps {
  results: PHQ9Result;
  onRetake: () => void;
  onGetHelp: () => void;
}

export interface EqResultsProps extends BaseComponentProps {
  results: EQResult;
  onRetake: () => void;
}

export interface HappinessResultsProps extends BaseComponentProps {
  results: HappinessResult;
  onRetake: () => void;
}

// MBTI test result type
export interface MBTIResult {
  personalityType: string;
  typeName: string;
  typeDescription: string;
  detailedAnalysis: string;
  dimensions: Array<{
    name: string;
    leftLabel: string;
    rightLabel: string;
    score: number;
    description: string;
  }>;
  strengths: string[];
  blindSpots: string[];
  careerSuggestions: string[];
  relationshipPerformance: {
    workplace: {
      leadershipStyle: string;
      teamCollaboration: string;
      decisionMaking: string;
    };
    family: {
      role: string;
      communication: string;
      emotionalExpression: string;
    };
    friendship: {
      preferences: string;
      socialPattern: string;
      supportStyle: string;
    };
    romance: {
      datingStyle: string;
      emotionalNeeds: string;
      relationshipPattern: string;
    };
  };
  relationshipCompatibility: {
    [key: string]: {
      reasons: string[];
    };
  };
}

// PHQ-9 test result type
export interface PHQ9Result {
  totalScore: number;
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  riskLevelName: string;
  riskDescription: string;
  symptoms: Array<{
    name: string;
    score: number;
    description: string;
  }>;
  recommendations: string[];
  professionalHelp: {
    needed: boolean;
    urgency: 'low' | 'medium' | 'high';
    suggestions: string[];
    resources: Array<{
      name: string;
      description: string;
      contact?: string;
      url?: string;
    }>;
  };
  lifestyleTips: string[];
  followUpAdvice: string;
}

// Emotional intelligence test result type
export interface EQResult {
  totalScore: number;
  maxScore: number;
  overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  levelName: string;
  levelDescription: string;
  dimensions: EQDimension[];
  overallAnalysis: string;
  improvementPlan: {
    shortTerm: string[];
    longTerm: string[];
    dailyPractices: string[];
  };
  careerImplications: string[];
  relationshipInsights: string[];
}

export interface EQDimension {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  strengths: string[];
  improvementAreas: string[];
}