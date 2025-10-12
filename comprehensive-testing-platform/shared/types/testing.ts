/**
 * 统一测试相关类型定义
 * 整合各模块的测试类型，提供一致的接口
 */

// 基础测试类型
export enum TestCategory {
  PSYCHOLOGY = 'psychology',
  CAREER = 'career',
  RELATIONSHIP = 'relationship',
  LEARNING_ABILITY = 'learning_ability',
  ASTROLOGY = 'astrology',
  TAROT = 'tarot',
  NUMEROLOGY = 'numerology'
}

export enum TestStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SCALE = 'SCALE',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  RANKING = 'RANKING'
}

// 问题相关类型
export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  category?: string;
  weight?: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: QuestionOption[];
  correctAnswer?: string;
}

export interface ScaleQuestion extends BaseQuestion {
  type: QuestionType.SCALE;
  minValue: number;
  maxValue: number;
  step: number;
  labels?: {
    min: string;
    max: string;
    [key: number]: string;
  };
}

export interface TextQuestion extends BaseQuestion {
  type: QuestionType.TEXT;
  maxLength?: number;
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface BooleanQuestion extends BaseQuestion {
  type: QuestionType.BOOLEAN;
  trueLabel?: string;
  falseLabel?: string;
}

export interface RankingQuestion extends BaseQuestion {
  type: QuestionType.RANKING;
  items: string[];
  minRank?: number;
  maxRank?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  score?: number;
  category?: string;
}

export type Question = 
  | MultipleChoiceQuestion 
  | ScaleQuestion 
  | TextQuestion 
  | BooleanQuestion 
  | RankingQuestion;

// 答案相关类型
export interface BaseAnswer {
  questionId: string;
  timestamp: number;
  timeSpent?: number;
}

export interface MultipleChoiceAnswer extends BaseAnswer {
  selectedOption: string;
  selectedValue: string | number;
}

export interface ScaleAnswer extends BaseAnswer {
  selectedValue: number;
}

export interface TextAnswer extends BaseAnswer {
  text: string;
}

export interface BooleanAnswer extends BaseAnswer {
  value: boolean;
}

export interface RankingAnswer extends BaseAnswer {
  rankings: Array<{
    item: string;
    rank: number;
  }>;
}

export type Answer = 
  | MultipleChoiceAnswer 
  | ScaleAnswer 
  | TextAnswer 
  | BooleanAnswer 
  | RankingAnswer;

// 测试会话类型
export interface TestSession {
  id: string;
  testType: string;
  testCategory: TestCategory;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: Answer[];
  totalQuestions: number;
  progress: number;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    deviceType?: string;
    language?: string;
  };
}

// 测试结果类型
export interface TestResult {
  sessionId: string;
  testType: string;
  testCategory: TestCategory;
  completedAt: Date;
  scores: Record<string, number>;
  interpretation: string;
  insights: string[];
  recommendations: string[];
  metadata: {
    totalTime: number;
    averageTimePerQuestion: number;
    accuracy?: number;
    confidence?: number;
  };
}

// 测试配置类型
export interface TestConfig {
  id: string;
  name: string;
  description: string;
  category: TestCategory;
  version: string;
  isActive: boolean;
  estimatedDuration: number; // 分钟
  totalQuestions: number;
  passingScore?: number;
  maxAttempts?: number;
  instructions?: string;
  prerequisites?: string[];
  tags: string[];
  metadata?: Record<string, any>;
}

// 测试流程类型
export interface TestFlow {
  id: string;
  testType: string;
  currentStep: number;
  totalSteps: number;
  steps: TestStep[];
  state: TestFlowState;
  metadata?: Record<string, any>;
}

export interface TestStep {
  id: string;
  type: 'question' | 'instruction' | 'break' | 'result';
  order: number;
  content: any;
  required: boolean;
  timeLimit?: number;
}

export enum TestFlowState {
  INITIALIZED = 'INITIALIZED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// 测试分析类型
export interface TestAnalysis {
  sessionId: string;
  testType: string;
  analysisType: 'basic' | 'detailed' | 'comprehensive';
  summary: string;
  insights: AnalysisInsight[];
  recommendations: AnalysisRecommendation[];
  scores: Record<string, number>;
  patterns: AnalysisPattern[];
  metadata: {
    analysisTime: number;
    confidence: number;
    model: string;
  };
}

export interface AnalysisInsight {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  title: string;
  description: string;
  evidence: string[];
  confidence: number;
  category: string;
}

export interface AnalysisRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  resources?: string[];
}

export interface AnalysisPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  significance: number;
  examples: string[];
}

// 测试历史类型
export interface TestHistory {
  userId?: string;
  sessions: TestSessionSummary[];
  statistics: TestStatistics;
  preferences: TestPreferences;
}

export interface TestSessionSummary {
  sessionId: string;
  testType: string;
  testCategory: TestCategory;
  startTime: Date;
  endTime?: Date;
  status: TestStatus;
  score?: number;
  duration?: number;
}

export interface TestStatistics {
  totalTests: number;
  completedTests: number;
  averageScore: number;
  averageDuration: number;
  favoriteTestType: string;
  improvementRate: number;
  lastTestDate?: Date;
}

export interface TestPreferences {
  preferredLanguage: string;
  preferredDuration: string;
  notificationSettings: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    screenReader: boolean;
  };
}

// 类型定义完成
// 注意：这些类型通过 ../types/index.ts 统一导出
