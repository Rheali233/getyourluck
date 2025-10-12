/**
 * Psychology Module Type Definitions
 * Follows unified development standard type definition specifications
 */

import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestStatus, QuestionFormat } from '@/modules/testing/types/TestTypes';

// Psychology-specific test type constants
export const PsychologyTestTypes = {
  MBTI: 'mbti',
  PHQ9: 'phq9',
  EQ: 'eq',
  HAPPINESS: 'happiness',
} as const;

export type PsychologyTestType = typeof PsychologyTestTypes[keyof typeof PsychologyTestTypes];

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

// MBTI question interface
export interface MbtiQuestion extends BaseQuestion {
  dimension?: 'E-I' | 'S-N' | 'T-F' | 'J-P';  // Optional for backward compatibility
  category?: 'E/I' | 'S/N' | 'T/F' | 'J/P';   // Optional for backward compatibility
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// PHQ-9 question interface
export interface Phq9Question extends BaseQuestion {
  symptom?: string;  // Optional for backward compatibility
  category?: string; // Backend returns this field
  dimension?: string; // Backend returns this field
  options: {
    id: string;
    text: string;
    value: 0 | 1 | 2 | 3;
    description: string;
  }[];
}

// Emotional intelligence question interface
export interface EqQuestion extends BaseQuestion {
  dimension?: 'self_awareness' | 'self_regulation' | 'motivation' | 'empathy' | 'social_skills';  // Optional for backward compatibility
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
    description: string;
  }[];
}

// Happiness index question interface
export interface HappinessQuestion extends BaseQuestion {
  dimension?: 'P' | 'E' | 'R' | 'M' | 'A'; // Five dimensions of PERMA model, optional for backward compatibility
  domain?: string; // Specific sub-dimensions, such as optimism, gratitude, etc., optional for backward compatibility
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
  testType: PsychologyTestType;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  answers: UserAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
}

// Test progress interface
export interface TestProgress {
  testType: PsychologyTestType;
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
  testType: PsychologyTestType;
  result: MBTIResult | PHQ9Result | EQResult | HappinessResult;
}

// Psychology module state
export interface PsychologyState {
  // Test session management
  currentSession: TestSession | null;
  testHistory: TestSession[];
  
  // Question bank data
  questions: {
    [PsychologyTestTypes.MBTI]: MbtiQuestion[];
    [PsychologyTestTypes.PHQ9]: Phq9Question[];
    [PsychologyTestTypes.EQ]: EqQuestion[];
    [PsychologyTestTypes.HAPPINESS]: HappinessQuestion[];
  };
  
  // Test results
  results: {
    [PsychologyTestTypes.MBTI]: MBTIResult | null;
    [PsychologyTestTypes.PHQ9]: PHQ9Result | null;
    [PsychologyTestTypes.EQ]: EQResult | null;
    [PsychologyTestTypes.HAPPINESS]: HappinessResult | null;
  };
  
  // AI analysis results
  currentTestResult: TestResult | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  currentPsychologyTestType: PsychologyTestType | null;
  showResults: boolean;
  lastUpdated: Date | null;
  
  // Question loading status
  questionsLoaded: boolean;
}

// Psychology module operations
export interface PsychologyActions {
  // Test session management
  startTest: (testType: PsychologyTestType) => Promise<void>;
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
  loadQuestions: (testType: PsychologyTestType) => Promise<void>;
  loadQuestionsFromAPI: (testType: PsychologyTestType) => Promise<void>;
  getCurrentQuestion: () => MbtiQuestion | Phq9Question | EqQuestion | HappinessQuestion | null;
  
  // Result management
  generateResults: (testType: PsychologyTestType) => Promise<TestResult>;
  saveResults: (testType: PsychologyTestType, results: TestResult) => Promise<void>;
  loadResults: (testType: PsychologyTestType) => Promise<TestResult | null>;
  
  // Progress management
  saveProgress: () => boolean;
  loadProgress: (testType: PsychologyTestType, sessionId: string) => TestProgress | null;
  restoreProgress: (testType: PsychologyTestType, sessionId: string) => boolean;
  
  // AI analysis management
  analyzeTestResult: (testType: PsychologyTestType, answers: UserAnswer[]) => Promise<TestResult>;
  getAnalysisStatus: () => { isLoading: boolean; error: string | null; hasResult: boolean };
  clearAnalysisResult: () => void;
  
  // History management
  loadTestHistory: () => Promise<void>;
  deleteTestSession: (sessionId: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPsychologyTestType: (testType: PsychologyTestType | null) => void;
  setShowResults: (show: boolean) => void;
  reset: () => void;
  
  // Language management
  getCurrentLanguage: () => string;
}

// Psychology module state (inherits unified interface)
export interface PsychologyModuleState extends PsychologyState, PsychologyActions {}

// Component property interface
export interface TestContainerProps extends BaseComponentProps {
  testType: PsychologyTestType;
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
  testType?: PsychologyTestType;
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
  testType: PsychologyTestType;
  onRetake: () => void;
  onShare: () => void;
  onSave: () => void;
}

export interface TestSelectionProps extends BaseComponentProps {
  onTestSelect: (testType: PsychologyTestType) => void;
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
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  riskLevel: 'low' | 'moderate' | 'high';
  riskLevelName: string;
  riskDescription: string;
  lifestyleInterventions: {
    sleepHygiene: string;
    physicalActivity: string;
    nutrition: string;
    socialSupport: string;
  };
  followUpAdvice: string;
  physicalAnalysis: string;
  psychologicalAnalysis: string;
}

// Emotional intelligence test result type
export interface EQResult {
  // 与后端统一的温和等级文案
  overallLevel: 'Needs Improvement' | 'Average' | 'Good' | 'Very Good' | 'Excellent';
  levelName: string;
  dimensions: EQDimension[];
  overallAnalysis: string;
  improvementPlan: {
    shortTerm: string[];
    longTerm: string[];
    dailyPractices: string[];
  };
  // 错误信息（用于前端显示错误弹窗）
  error?: string;
}

export interface EQDimension {
  name: string;
  description: string;
  strengths: string[];
  // 维度等级（与后端统一）
  level?: 'Needs Improvement' | 'Average' | 'Good' | 'Very Good' | 'Excellent';
}