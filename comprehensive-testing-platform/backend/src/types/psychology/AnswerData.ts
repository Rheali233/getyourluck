/**
 * 心理测试答题数据类型定义
 * 遵循统一开发标准的数据类型规范
 */

// 基础答题数据接口
export interface BaseAnswerData {
  id: string;
  sessionId: string;
  questionId: string;
  answerValue: string | number;
  answerText?: string;
  responseTime: number; // 答题用时（毫秒）
  timestamp: Date;
  metadata?: Record<string, any>;
}

// MBTI答题数据接口
export interface MbtiAnswerData extends BaseAnswerData {
  testType: 'mbti';
  dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  confidence: number; // 答题信心度 1-5
}

// PHQ-9答题数据接口
export interface Phq9AnswerData extends BaseAnswerData {
  testType: 'phq9';
  dimension: 'anhedonia' | 'depressed_mood' | 'sleep_problems' | 'fatigue' | 'appetite_changes' | 'poor_concentration' | 'psychomotor_changes' | 'suicidal_thoughts' | 'guilt_feelings';
  score: number; // 0-3分
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  symptomDescription?: string;
}

// 情商答题数据接口
export interface EqAnswerData extends BaseAnswerData {
  testType: 'eq';
  dimension: 'self_awareness' | 'self_regulation' | 'motivation' | 'empathy' | 'social_skills';
  score: number; // 1-5分
  confidence: number; // 答题信心度 1-5
  reflection?: string; // 答题后的反思
}

// 幸福指数答题数据接口
export interface HappinessAnswerData extends BaseAnswerData {
  testType: 'happiness';
  domain: 'work' | 'relationships' | 'health' | 'personal_growth' | 'life_balance';
  score: number; // 1-7分
  satisfaction: number; // 满意度 1-10
  importance: number; // 重要性 1-10
  improvement?: string; // 改善建议
}

// 答题数据联合类型
export type PsychologyAnswerData = 
  | MbtiAnswerData 
  | Phq9AnswerData 
  | EqAnswerData 
  | HappinessAnswerData;

// 创建答题数据接口
export interface CreateAnswerData {
  sessionId: string;
  questionId: string;
  answerValue: string | number;
  answerText?: string;
  responseTime: number;
  metadata?: Record<string, any>;
}

// MBTI创建答题数据接口
export interface CreateMbtiAnswerData extends CreateAnswerData {
  testType: 'mbti';
  dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  confidence: number;
}

// PHQ-9创建答题数据接口
export interface CreatePhq9AnswerData extends CreateAnswerData {
  testType: 'phq9';
  dimension: 'anhedonia' | 'depressed_mood' | 'sleep_problems' | 'fatigue' | 'appetite_changes' | 'poor_concentration' | 'psychomotor_changes' | 'suicidal_thoughts' | 'guilt_feelings';
  score: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  symptomDescription?: string;
}

// 情商创建答题数据接口
export interface CreateEqAnswerData extends CreateAnswerData {
  testType: 'eq';
  dimension: 'self_awareness' | 'self_regulation' | 'motivation' | 'empathy' | 'social_skills';
  score: number;
  confidence: number;
  reflection?: string;
}

// 幸福指数创建答题数据接口
export interface CreateHappinessAnswerData extends CreateAnswerData {
  testType: 'happiness';
  domain: 'work' | 'relationships' | 'health' | 'personal_growth' | 'life_balance';
  score: number;
  satisfaction: number;
  importance: number;
  improvement?: string;
}

// 创建答题数据联合类型
export type CreatePsychologyAnswerData = 
  | CreateMbtiAnswerData 
  | CreatePhq9AnswerData 
  | CreateEqAnswerData 
  | CreateHappinessAnswerData;

// 答题会话数据接口
export interface AnswerSessionData {
  id: string;
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  sessionId: string;
  answers: PsychologyAnswerData[];
  startTime: Date;
  endTime?: Date;
  totalTime: number; // 总用时（毫秒）
  status: 'in_progress' | 'completed' | 'paused' | 'abandoned';
  progress: number; // 完成进度 0-100
  metadata?: Record<string, any>;
}

// 创建答题会话数据接口
export interface CreateAnswerSessionData {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  sessionId: string;
  startTime: Date;
  metadata?: Record<string, any>;
}

// 答题统计数据接口
export interface AnswerStatisticsData {
  totalAnswers: number;
  averageResponseTime: number;
  completionRate: number;
  accuracyRate?: number;
  dimensionBreakdown: Record<string, number>;
  timeDistribution: Record<string, number>;
  confidenceDistribution: Record<string, number>;
}

// AI分析输入数据结构
export interface AIAnalysisInputData {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  sessionId: string;
  answers: PsychologyAnswerData[];
  userProfile?: {
    age?: number;
    gender?: string;
    occupation?: string;
    education?: string;
    previousTests?: string[];
  };
  context?: {
    testDuration: number;
    responsePattern: string;
    confidenceLevel: number;
    completionRate: number;
  };
  analysisType: 'comprehensive' | 'dimension' | 'risk_assessment' | 'improvement_suggestions';
  language: 'zh' | 'en';
}

// 答题验证规则接口
export interface AnswerValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: string;
  enum?: string[];
  custom?: (value: any) => boolean;
  message?: string;
}

// 答题数据验证结果接口
export interface AnswerValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

// 答题数据格式化选项接口
export interface AnswerFormatOptions {
  includeMetadata: boolean;
  includeTimestamps: boolean;
  includeCalculations: boolean;
  language: 'zh' | 'en';
  format: 'json' | 'csv' | 'xml';
  compression?: boolean;
}

// 答题数据导出接口
export interface AnswerExportData {
  sessionId: string;
  testType: string;
  exportTime: Date;
  format: string;
  data: PsychologyAnswerData[];
  summary: {
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    averageScore?: number;
    totalTime: number;
  };
  metadata?: Record<string, any>;
} 