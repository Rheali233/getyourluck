/**
 * Career Module Type Definitions
 * Following unified development standards
 */

import type { BaseComponentProps } from '../../../types/componentTypes';

// Test Type Constants
export const CareerTestTypeEnum = {
  HOLLAND: 'holland',
  DISC: 'disc',
  LEADERSHIP: 'leadership',
} as const;

export type CareerTestType = typeof CareerTestTypeEnum[keyof typeof CareerTestTypeEnum];

// Test Status Constants
export const CareerTestStatusEnum = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused',
} as const;

export type CareerTestStatus = typeof CareerTestStatusEnum[keyof typeof CareerTestStatusEnum];

// Question Type Constants
export const CareerQuestionTypeEnum = {
  SINGLE_CHOICE: 'single_choice',
  LIKERT_SCALE: 'likert_scale',
  MULTIPLE_CHOICE: 'multiple_choice',
} as const;

export type CareerQuestionType = typeof CareerQuestionTypeEnum[keyof typeof CareerQuestionTypeEnum];

// Base Question Interface
export interface BaseQuestion {
  id: string;
  text: string;
  type: CareerQuestionType;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

// Holland Career Interest Question Interface
export interface HollandQuestion extends BaseQuestion {
  dimension: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
  category: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
  isReverseScored?: boolean;
  isNeutral?: boolean;
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
  }[];
}

// DISC Behavioral Style Question Interface
export interface DISCQuestion extends BaseQuestion {
  dimension: 'dominance' | 'influence' | 'steadiness' | 'conscientiousness';
  category: 'behavioral' | 'communication' | 'work_style';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
  }[];
}

// Leadership Assessment Question Interface
export interface LeadershipQuestion extends BaseQuestion {
  dimension: 'vision' | 'influence' | 'execution' | 'relationships' | 'adaptability';
  category: 'strategic' | 'interpersonal' | 'operational';
  options: {
    id: string;
    text: string;
    value: 1 | 2 | 3 | 4 | 5;
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
  testType: CareerTestType;
  status: CareerTestStatus;
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
  testType: CareerTestType;
  scores: Record<string, number>;
  primaryType?: string;
  secondaryType?: string;
  interpretation: string;
  recommendations: string[];
  strengths: string[];
  areasForGrowth: string[];
  careerAdvice: string[];
  completedAt: string;
  summary?: string;
  
  // Holland Career Interest Test specific fields
  hollandCode?: string;
  secondaryInterpretation?: string;
  careerMatches?: Array<{
    title: string;
    matchScore: number;
    description: string;
    requiredSkills: string[];
    salaryRange?: string;
    growthOutlook?: string;
  }>;
  
  // DISC Behavioral Style Test specific fields
  discStyle?: string;
  workStyle?: string;
  communicationStyle?: string;
  discLeadershipStyle?: string;
  teamCollaboration?: string;
  stressResponse?: string;
  normalizedScores?: Record<string, number>;
  percentileRankings?: Record<string, number>;
  confidenceLevel?: number;
  responseConsistency?: number;
  workplaceApplication?: string;
  
  // Leadership Assessment specific fields
  leadershipStyle?: string;
  leadershipStage?: string;
  actionPlan?: string[];
  
  // General enhancement fields
  detailedAnalysis?: {
    dimensionAnalysis?: Record<string, {
      score: number;
      interpretation: string;
      workEnvironment: string;
      skills: string[];
      careerImplications: string;
    }>;
    consistencyScore?: number;
    careerMatchConfidence?: number;
  };
}

// Component Props Interfaces
export interface QuestionDisplayProps extends BaseComponentProps {
  question: HollandQuestion | DISCQuestion | LeadershipQuestion;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete?: () => void;
  currentIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  testType: CareerTestType;
  isCompleting?: boolean;
}

export interface TestContainerProps extends BaseComponentProps {
  testType: CareerTestType;
}

export interface TestResultsProps extends BaseComponentProps {
  result: TestResult;
  testType: CareerTestType;
  onRetakeTest: () => void;
  onShareResult: () => void;
}

// Store State Interface
export interface CareerModuleState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  currentSession: TestSession | null;
  testHistory: TestSession[];
  questions: {
    [CareerTestTypeEnum.HOLLAND]: HollandQuestion[];
    [CareerTestTypeEnum.DISC]: DISCQuestion[];
    [CareerTestTypeEnum.LEADERSHIP]: LeadershipQuestion[];
  };
  results: {
    [CareerTestTypeEnum.HOLLAND]: TestResult | null;
    [CareerTestTypeEnum.DISC]: TestResult | null;
    [CareerTestTypeEnum.LEADERSHIP]: TestResult | null;
  };
  currentTestResult: TestResult | null;
  currentTestType: CareerTestType| null;
  showResults: boolean;
  questionsLoaded: boolean;
}

// Store Actions Interface
// AI Analysis Interfaces
export interface AIAnalysisRequest {
  testType: 'holland' | 'disc' | 'leadership';
  answers: Array<{ questionId: string; answer: string | number; timestamp: string }>;
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: TestResult;
  error?: string;
}

export interface CareerModuleActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateLastUpdated: () => void;
  startTest: (testType: CareerTestType) => Promise<void>;
  submitAnswer: (questionId: string, answer: string | number) => Promise<void>;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  getCurrentQuestion: () => HollandQuestion | DISCQuestion | LeadershipQuestion | null;
  submitTest: () => Promise<void>;
  getTestResult: (sessionId: string) => Promise<void>;
  submitFeedback: (sessionId: string, feedback: 'like' | 'dislike') => Promise<void>;
  resetTest: () => void;
  loadQuestionsFromAPI: (testType: CareerTestType) => Promise<void>;
  setCurrentTestType: (testType: CareerTestType | null) => void;
  setShowResults: (show: boolean) => void;
  setCurrentTestResult: (result: TestResult | null) => void;
}
