/**
 * MBTI答题数据处理服务
 * 遵循统一开发标准的服务层规范
 */
import type { MbtiAnswerData } from "../types/psychology/AnswerData";
export interface MbtiDimensionScore {
    dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
    eScore: number;
    iScore: number;
    sScore: number;
    nScore: number;
    tScore: number;
    fScore: number;
    jScore: number;
    pScore: number;
    preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    confidence: number;
    strength: 'strong' | 'moderate' | 'weak';
}
export interface MbtiAnswerPattern {
    totalQuestions: number;
    answeredQuestions: number;
    completionRate: number;
    averageResponseTime: number;
    confidenceDistribution: Record<string, number>;
    responseTimeDistribution: Record<string, number>;
    dimensionBreakdown: Record<string, number>;
    consistencyScore: number;
    reliabilityScore: number;
}
export interface MbtiResult {
    personalityType: string;
    dimensionScores: MbtiDimensionScore[];
    answerPattern: MbtiAnswerPattern;
    confidence: number;
    reliability: number;
    recommendations: string[];
    metadata: {
        processingTime: number;
        algorithm: string;
        version: string;
    };
}
/**
 * MBTI答题数据处理服务类
 */
export declare class MbtiAnswerProcessingService {
    /**
     * 计算MBTI维度得分
     */
    calculateDimensionScores(answers: MbtiAnswerData[]): MbtiDimensionScore[];
    /**
     * 计算单个维度的得分
     */
    private calculateSingleDimensionScore;
    /**
     * 计算偏好强度
     */
    private calculatePreferenceStrength;
    /**
     * 分析MBTI答题模式
     */
    analyzeAnswerPattern(answers: MbtiAnswerData[]): MbtiAnswerPattern;
    /**
     * 分析信心度分布
     */
    private analyzeConfidenceDistribution;
    /**
     * 分析答题时间分布
     */
    private analyzeResponseTimeDistribution;
    /**
     * 分析维度分布
     */
    private analyzeDimensionBreakdown;
    /**
     * 计算答题一致性得分
     */
    private calculateConsistencyScore;
    /**
     * 计算答题可靠性得分
     */
    private calculateReliabilityScore;
    /**
     * 按维度分组答题数据
     */
    private groupAnswersByDimension;
    /**
     * 生成MBTI结果
     */
    generateMbtiResult(answers: MbtiAnswerData[]): MbtiResult;
    /**
     * 生成性格类型
     */
    private generatePersonalityType;
    /**
     * 计算整体信心度
     */
    private calculateOverallConfidence;
    /**
     * 生成建议
     */
    private generateRecommendations;
    /**
     * 验证MBTI答题数据
     */
    validateMbtiAnswers(answers: MbtiAnswerData[]): boolean;
    /**
     * 验证单个MBTI答案
     */
    private isValidMbtiAnswer;
    /**
     * 清理MBTI答题数据
     */
    cleanMbtiAnswers(answers: MbtiAnswerData[]): MbtiAnswerData[];
}
//# sourceMappingURL=MbtiAnswerProcessingService.d.ts.map