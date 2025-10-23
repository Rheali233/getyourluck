/**
 * Core Test Types and Interfaces
 * Unified type definitions for all testing modules
 */

// Test Categories
export enum TestCategory {
  PSYCHOLOGY = 'psychology',
  CAREER = 'career',
  RELATIONSHIP = 'relationship',
  LEARNING = 'learning'
}

// Question Formats
export enum QuestionFormat {
  SINGLE_CHOICE = 'single_choice',      // 单选
  MULTIPLE_CHOICE = 'multiple_choice',  // 多选
  SCALE = 'scale',                      // 量表
  LIKERT_SCALE = 'likert_scale',        // 李克特量表
  TEXT = 'text',                        // 文本
}

// Answer Types
export enum AnswerType {
  STRING = 'string',
  NUMBER = 'number',
  STRING_ARRAY = 'string_array',
  BOOLEAN = 'boolean'
}

// Result Types
export enum ResultType {
  SCORE = 'score',           // 分数
  CATEGORY = 'category',     // 分类
  DIMENSION = 'dimension',   // 维度
  PROFILE = 'profile'        // 画像
}

// Test Status
export enum TestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

// Base Test Type
export interface BaseTestType {
  id: string;
  name: string;
  category: TestCategory;
  questionFormat: QuestionFormat;
  answerType: AnswerType;
  resultType: ResultType;
  totalQuestions: number;
  estimatedTime: number;
  description?: string;
  instructions?: string;
}

// Specific Test Types
export interface PsychologyTestType extends BaseTestType {
  category: TestCategory.PSYCHOLOGY;
}

export interface CareerTestType extends BaseTestType {
  category: TestCategory.CAREER;
}

export interface RelationshipTestType extends BaseTestType {
  category: TestCategory.RELATIONSHIP;
}

export interface LearningTestType extends BaseTestType {
  category: TestCategory.LEARNING;
}

// Union type for all test types
export type TestType = PsychologyTestType | CareerTestType | RelationshipTestType | LearningTestType;

// Test Session
export interface TestSession {
  id: string;
  testType: string;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: TestAnswer[];
  totalQuestions: number;
  timeSpent: number;
  userId?: string;
  metadata?: Record<string, any>;
}

// Test Answer
export interface TestAnswer {
  questionId: string;
  value: string | number | string[] | boolean;
  timestamp: string;
  timeSpent?: number;
  metadata?: Record<string, any>;
}

// Test Result
export interface TestResult<T = any> {
  testType: string;
  sessionId: string;
  scores?: Record<string, number>;
  categories?: string[];
  dimensions?: Record<string, any>;
  analysis?: string;
  recommendations?: string[];
  timestamp: string;
  data: T;
  // Love Language specific fields
  primaryType?: string;
  secondaryType?: string;
  loveLanguageDetails?: Record<string, any>;
  relationshipImplications?: string[];
  communicationTips?: string[];
  giftSuggestions?: string[];
  dateIdeas?: string[];
  growthAreas?: string[];
  partnerGuidance?: string[];
  selfCareTips?: string[];
}

// Question Types
export interface BaseQuestion {
  id: string;
  text: string;
  format: QuestionFormat;
  category?: string;
  dimension?: string;
  weight?: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  format: QuestionFormat.SINGLE_CHOICE;
  options: QuestionOption[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  format: QuestionFormat.MULTIPLE_CHOICE;
  options: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  // VARK specific fields
  dimension?: string;
  imageUrl?: string;
  correctAnswer?: string;
  explanation?: string;
  instructions?: string;
  duration?: number;
  taskType?: string;
  subtype?: string;
}

export interface ScaleQuestion extends BaseQuestion {
  format: QuestionFormat.SCALE;
  minValue: number;
  maxValue: number;
  step?: number;
  labels?: {
    min: string;
    max: string;
    center?: string;
  };
}

export interface TextQuestion extends BaseQuestion {
  format: QuestionFormat.TEXT;
  maxLength?: number;
  placeholder?: string;
  validation?: {
    required: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface LikertScaleQuestion extends BaseQuestion {
  format: QuestionFormat.LIKERT_SCALE;
  options: QuestionOption[];
}

// Question Option
export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  description?: string;
  weight?: number;
  metadata?: Record<string, any>;
}

// Union type for all question types
export type Question = SingleChoiceQuestion | MultipleChoiceQuestion | ScaleQuestion | TextQuestion | LikertScaleQuestion;

// Test Progress
export interface TestProgress {
  testType: string;
  sessionId: string;
  currentQuestionIndex: number;
  answers: TestAnswer[];
  startTime: string;
  lastUpdateTime: string;
  isCompleted: boolean;
  timeSpent: number;
}

// Test Configuration
export interface TestConfig {
  id: string;
  name: string;
  category: TestCategory;
  questionFormat: QuestionFormat;
  answerType: AnswerType;
  resultType: ResultType;
  totalQuestions: number;
  estimatedTime: number;
  features: {
    adaptive: boolean;
    collaborative: boolean;
    gamified: boolean;
    immersive: boolean;
    realTime: boolean;
  };
  components: {
    questionRenderer: string;
    answerCollector: string;
    resultProcessor: string;
  };
  metadata?: Record<string, any>;
}

// Export all types
