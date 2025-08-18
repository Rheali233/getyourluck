/**
 * 心理测试答题数据类型定义
 * 遵循统一开发标准的数据类型规范
 */
export interface BaseAnswerData {
    id: string;
    sessionId: string;
    questionId: string;
    answerValue: string | number;
    answerText?: string;
    responseTime: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export interface MbtiAnswerData extends BaseAnswerData {
    testType: 'mbti';
    dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
    preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    confidence: number;
}
export interface Phq9AnswerData extends BaseAnswerData {
    testType: 'phq9';
    dimension: 'anhedonia' | 'depressed_mood' | 'sleep_problems' | 'fatigue' | 'appetite_changes' | 'poor_concentration' | 'psychomotor_changes' | 'suicidal_thoughts' | 'guilt_feelings';
    score: number;
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    symptomDescription?: string;
}
export interface EqAnswerData extends BaseAnswerData {
    testType: 'eq';
    dimension: 'self_awareness' | 'self_management' | 'social_awareness' | 'relationship_management';
    score: number;
    confidence: number;
    reflection?: string;
}
export interface HappinessAnswerData extends BaseAnswerData {
    testType: 'happiness';
    domain: 'work' | 'relationships' | 'health' | 'personal_growth' | 'life_balance';
    score: number;
    satisfaction: number;
    importance: number;
    improvement?: string;
}
export type PsychologyAnswerData = MbtiAnswerData | Phq9AnswerData | EqAnswerData | HappinessAnswerData;
export interface CreateAnswerData {
    sessionId: string;
    questionId: string;
    answerValue: string | number;
    answerText?: string;
    responseTime: number;
    metadata?: Record<string, any>;
}
export interface CreateMbtiAnswerData extends CreateAnswerData {
    testType: 'mbti';
    dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
    preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    confidence: number;
}
export interface CreatePhq9AnswerData extends CreateAnswerData {
    testType: 'phq9';
    dimension: 'anhedonia' | 'depressed_mood' | 'sleep_problems' | 'fatigue' | 'appetite_changes' | 'poor_concentration' | 'psychomotor_changes' | 'suicidal_thoughts' | 'guilt_feelings';
    score: number;
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    symptomDescription?: string;
}
export interface CreateEqAnswerData extends CreateAnswerData {
    testType: 'eq';
    dimension: 'self_awareness' | 'self_management' | 'social_awareness' | 'relationship_management';
    score: number;
    confidence: number;
    reflection?: string;
}
export interface CreateHappinessAnswerData extends CreateAnswerData {
    testType: 'happiness';
    domain: 'work' | 'relationships' | 'health' | 'personal_growth' | 'life_balance';
    score: number;
    satisfaction: number;
    importance: number;
    improvement?: string;
}
export type CreatePsychologyAnswerData = CreateMbtiAnswerData | CreatePhq9AnswerData | CreateEqAnswerData | CreateHappinessAnswerData;
export interface AnswerSessionData {
    id: string;
    testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
    sessionId: string;
    answers: PsychologyAnswerData[];
    startTime: Date;
    endTime?: Date;
    totalTime: number;
    status: 'in_progress' | 'completed' | 'paused' | 'abandoned';
    progress: number;
    metadata?: Record<string, any>;
}
export interface CreateAnswerSessionData {
    testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
    sessionId: string;
    startTime: Date;
    metadata?: Record<string, any>;
}
export interface AnswerStatisticsData {
    totalAnswers: number;
    averageResponseTime: number;
    completionRate: number;
    accuracyRate?: number;
    dimensionBreakdown: Record<string, number>;
    timeDistribution: Record<string, number>;
    confidenceDistribution: Record<string, number>;
}
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
export interface AnswerValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions?: string[];
}
export interface AnswerFormatOptions {
    includeMetadata: boolean;
    includeTimestamps: boolean;
    includeCalculations: boolean;
    language: 'zh' | 'en';
    format: 'json' | 'csv' | 'xml';
    compression?: boolean;
}
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
//# sourceMappingURL=AnswerData.d.ts.map