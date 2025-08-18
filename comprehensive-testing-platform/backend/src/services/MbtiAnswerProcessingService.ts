/**
 * MBTI答题数据处理服务
 * 遵循统一开发标准的服务层规范
 */

import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
import type { 
  MbtiAnswerData,
  CreateMbtiAnswerData,
  AnswerSessionData
} from "../types/psychology/AnswerData";

// MBTI维度得分结果接口
export interface MbtiDimensionScore {
  dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
  eScore: number; // E/I维度中E的得分
  iScore: number; // E/I维度中I的得分
  sScore: number; // S/N维度中S的得分
  nScore: number; // S/N维度中N的得分
  tScore: number; // T/F维度中T的得分
  fScore: number; // T/F维度中F的得分
  jScore: number; // J/P维度中J的得分
  pScore: number; // J/P维度中P的得分
  preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  confidence: number; // 该维度的平均信心度
  strength: 'strong' | 'moderate' | 'weak'; // 偏好强度
}

// MBTI答题模式分析接口
export interface MbtiAnswerPattern {
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  averageResponseTime: number;
  confidenceDistribution: Record<string, number>;
  responseTimeDistribution: Record<string, number>;
  dimensionBreakdown: Record<string, number>;
  consistencyScore: number; // 答题一致性得分
  reliabilityScore: number; // 答题可靠性得分
}

// MBTI结果接口
export interface MbtiResult {
  personalityType: string; // 如 'INTJ'
  dimensionScores: MbtiDimensionScore[];
  answerPattern: MbtiAnswerPattern;
  confidence: number; // 整体信心度
  reliability: number; // 结果可靠性
  recommendations: string[]; // 建议
  metadata: {
    processingTime: number;
    algorithm: string;
    version: string;
  };
}

/**
 * MBTI答题数据处理服务类
 */
export class MbtiAnswerProcessingService {
  
  // ==================== MBTI维度得分计算 ====================

  /**
   * 计算MBTI维度得分
   */
  calculateDimensionScores(answers: MbtiAnswerData[]): MbtiDimensionScore[] {
    if (answers.length === 0) {
      throw new ModuleError('答题数据不能为空', ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const dimensionScores: MbtiDimensionScore[] = [];
    const dimensions: Array<'E/I' | 'S/N' | 'T/F' | 'J/P'> = ['E/I', 'S/N', 'T/F', 'J/P'];

    for (const dimension of dimensions) {
      const dimensionAnswers = answers.filter(answer => answer.dimension === dimension);
      
      if (dimensionAnswers.length === 0) {
        continue;
      }

      const score = this.calculateSingleDimensionScore(dimension, dimensionAnswers);
      dimensionScores.push(score);
    }

    return dimensionScores;
  }

  /**
   * 计算单个维度的得分
   */
  private calculateSingleDimensionScore(
    dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P',
    answers: MbtiAnswerData[]
  ): MbtiDimensionScore {
    let eScore = 0, iScore = 0, sScore = 0, nScore = 0;
    let tScore = 0, fScore = 0, jScore = 0, pScore = 0;
    let totalConfidence = 0;

    for (const answer of answers) {
      const confidence = answer.confidence || 1;
      totalConfidence += confidence;

      switch (dimension) {
        case 'E/I':
          if (answer.preference === 'E') {
            eScore += confidence;
          } else if (answer.preference === 'I') {
            iScore += confidence;
          }
          break;
        case 'S/N':
          if (answer.preference === 'S') {
            sScore += confidence;
          } else if (answer.preference === 'N') {
            nScore += confidence;
          }
          break;
        case 'T/F':
          if (answer.preference === 'T') {
            tScore += confidence;
          } else if (answer.preference === 'F') {
            fScore += confidence;
          }
          break;
        case 'J/P':
          if (answer.preference === 'J') {
            jScore += confidence;
          } else if (answer.preference === 'P') {
            pScore += confidence;
          }
          break;
      }
    }

    // 确定偏好
    let preference: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    let strength: 'strong' | 'moderate' | 'weak';

    switch (dimension) {
      case 'E/I':
        preference = eScore >= iScore ? 'E' : 'I';
        strength = this.calculatePreferenceStrength(Math.max(eScore, iScore), Math.min(eScore, iScore));
        break;
      case 'S/N':
        preference = sScore >= nScore ? 'S' : 'N';
        strength = this.calculatePreferenceStrength(Math.max(sScore, nScore), Math.min(sScore, nScore));
        break;
      case 'T/F':
        preference = tScore >= fScore ? 'T' : 'F';
        strength = this.calculatePreferenceStrength(Math.max(tScore, fScore), Math.min(tScore, fScore));
        break;
      case 'J/P':
        preference = jScore >= pScore ? 'J' : 'P';
        strength = this.calculatePreferenceStrength(Math.max(jScore, pScore), Math.min(jScore, pScore));
        break;
    }

    const averageConfidence = totalConfidence / answers.length;

    return {
      dimension,
      eScore,
      iScore,
      sScore,
      nScore,
      tScore,
      fScore,
      jScore,
      pScore,
      preference,
      confidence: Math.round(averageConfidence * 100) / 100,
      strength
    };
  }

  /**
   * 计算偏好强度
   */
  private calculatePreferenceStrength(
    higherScore: number, 
    lowerScore: number
  ): 'strong' | 'moderate' | 'weak' {
    const difference = higherScore - lowerScore;
    const total = higherScore + lowerScore;
    const percentage = difference / total;

    if (percentage >= 0.3) return 'strong';
    if (percentage >= 0.15) return 'moderate';
    return 'weak';
  }

  // ==================== MBTI答题模式分析 ====================

  /**
   * 分析MBTI答题模式
   */
  analyzeAnswerPattern(answers: MbtiAnswerData[]): MbtiAnswerPattern {
    if (answers.length === 0) {
      throw new ModuleError('答题数据不能为空', ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const totalQuestions = 20; // MBTI标准题目数
    const answeredQuestions = answers.length;
    const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);

    // 计算平均答题时间
    const totalResponseTime = answers.reduce((sum, answer) => sum + answer.responseTime, 0);
    const averageResponseTime = Math.round(totalResponseTime / answeredQuestions);

    // 分析信心度分布
    const confidenceDistribution = this.analyzeConfidenceDistribution(answers);

    // 分析答题时间分布
    const responseTimeDistribution = this.analyzeResponseTimeDistribution(answers);

    // 分析维度分布
    const dimensionBreakdown = this.analyzeDimensionBreakdown(answers);

    // 计算一致性得分
    const consistencyScore = this.calculateConsistencyScore(answers);

    // 计算可靠性得分
    const reliabilityScore = this.calculateReliabilityScore(answers);

    return {
      totalQuestions,
      answeredQuestions,
      completionRate,
      averageResponseTime,
      confidenceDistribution,
      responseTimeDistribution,
      dimensionBreakdown,
      consistencyScore,
      reliabilityScore
    };
  }

  /**
   * 分析信心度分布
   */
  private analyzeConfidenceDistribution(answers: MbtiAnswerData[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (let i = 1; i <= 5; i++) {
      const count = answers.filter(answer => answer.confidence === i).length;
      distribution[`level_${i}`] = count;
    }

    return distribution;
  }

  /**
   * 分析答题时间分布
   */
  private analyzeResponseTimeDistribution(answers: MbtiAnswerData[]): Record<string, number> {
    const distribution: Record<string, number> = {
      'fast': 0,      // < 10秒
      'normal': 0,    // 10-30秒
      'slow': 0,      // 30-60秒
      'very_slow': 0  // > 60秒
    };

    for (const answer of answers) {
      const timeInSeconds = answer.responseTime / 1000;
      
      if (timeInSeconds < 10) {
        distribution["fast"]++;
      } else if (timeInSeconds < 30) {
        distribution["normal"]++;
      } else if (timeInSeconds < 60) {
        distribution["slow"]++;
      } else {
        distribution["very_slow"]++;
      }
    }

    return distribution;
  }

  /**
   * 分析维度分布
   */
  private analyzeDimensionBreakdown(answers: MbtiAnswerData[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    for (const answer of answers) {
      const dimension = answer.dimension;
      breakdown[dimension] = (breakdown[dimension] || 0) + 1;
    }

    return breakdown;
  }

  /**
   * 计算答题一致性得分
   */
  private calculateConsistencyScore(answers: MbtiAnswerData[]): number {
    if (answers.length < 2) return 100;

    let consistencyScore = 100;
    
    // 检查同一维度的答题一致性
    const dimensionGroups = this.groupAnswersByDimension(answers);
    
    for (const [dimension, dimensionAnswers] of Object.entries(dimensionGroups)) {
      if (dimensionAnswers.length < 2) continue;

      const preferences = dimensionAnswers.map(answer => answer.preference);
      const uniquePreferences = new Set(preferences);
      
      // 如果同一维度有多个不同偏好，降低一致性得分
      if (uniquePreferences.size > 1) {
        consistencyScore -= 10;
      }
    }

    return Math.max(0, consistencyScore);
  }

  /**
   * 计算答题可靠性得分
   */
  private calculateReliabilityScore(answers: MbtiAnswerData[]): number {
    if (answers.length === 0) return 0;

    let reliabilityScore = 100;
    
    // 基于完成率
    const completionRate = answers.length / 20; // 假设总共20题
    reliabilityScore *= completionRate;

    // 基于平均信心度
    const totalConfidence = answers.reduce((sum, answer) => sum + answer.confidence, 0);
    const averageConfidence = totalConfidence / answers.length;
    reliabilityScore *= (averageConfidence / 5); // 标准化到0-1

    // 基于答题时间合理性
    const reasonableTimeAnswers = answers.filter(answer => 
      answer.responseTime >= 5000 && answer.responseTime <= 120000 // 5秒到2分钟
    ).length;
    const timeReliability = reasonableTimeAnswers / answers.length;
    reliabilityScore *= timeReliability;

    return Math.round(reliabilityScore);
  }

  /**
   * 按维度分组答题数据
   */
  private groupAnswersByDimension(answers: MbtiAnswerData[]): Record<string, MbtiAnswerData[]> {
    const groups: Record<string, MbtiAnswerData[]> = {};
    
    for (const answer of answers) {
      const dimension = answer.dimension;
      if (!groups[dimension]) {
        groups[dimension] = [];
      }
      groups[dimension].push(answer);
    }

    return groups;
  }

  // ==================== MBTI结果生成 ====================

  /**
   * 生成MBTI结果
   */
  generateMbtiResult(answers: MbtiAnswerData[]): MbtiResult {
    const startTime = Date.now();

    // 计算维度得分
    const dimensionScores = this.calculateDimensionScores(answers);

    // 分析答题模式
    const answerPattern = this.analyzeAnswerPattern(answers);

    // 生成性格类型
    const personalityType = this.generatePersonalityType(dimensionScores);

    // 计算整体信心度
    const confidence = this.calculateOverallConfidence(answers);

    // 计算结果可靠性
    const reliability = answerPattern.reliabilityScore;

    // 生成建议
    const recommendations = this.generateRecommendations(dimensionScores, answerPattern);

    const processingTime = Date.now() - startTime;

    return {
      personalityType,
      dimensionScores,
      answerPattern,
      confidence,
      reliability,
      recommendations,
      metadata: {
        processingTime,
        algorithm: 'mbti_v1.0',
        version: '1.0.0'
      }
    };
  }

  /**
   * 生成性格类型
   */
  private generatePersonalityType(dimensionScores: MbtiDimensionScore[]): string {
    let personalityType = '';

    for (const score of dimensionScores) {
      personalityType += score.preference;
    }

    return personalityType;
  }

  /**
   * 计算整体信心度
   */
  private calculateOverallConfidence(answers: MbtiAnswerData[]): number {
    if (answers.length === 0) return 0;

    const totalConfidence = answers.reduce((sum, answer) => sum + answer.confidence, 0);
    const averageConfidence = totalConfidence / answers.length;

    return Math.round(averageConfidence * 100) / 100;
  }

  /**
   * 生成建议
   */
  private generateRecommendations(
    dimensionScores: MbtiDimensionScore[], 
    answerPattern: MbtiAnswerPattern
  ): string[] {
    const recommendations: string[] = [];

    // 基于完成率的建议
    if (answerPattern.completionRate < 80) {
      recommendations.push('建议完成更多题目以获得更准确的结果');
    }

    // 基于信心度的建议
    if (answerPattern.averageResponseTime < 10000) {
      recommendations.push('答题时间较短，建议仔细思考每个问题');
    }

    // 基于偏好强度的建议
    for (const score of dimensionScores) {
      if (score.strength === 'weak') {
        recommendations.push(`${score.dimension}维度偏好较弱，建议重新评估相关问题`);
      }
    }

    // 基于一致性的建议
    if (answerPattern.consistencyScore < 80) {
      recommendations.push('答题一致性较低，建议重新测试以获得更可靠的结果');
    }

    // 如果没有特殊建议，提供一般性建议
    if (recommendations.length === 0) {
      recommendations.push('测试结果可靠，建议根据结果进行自我反思和成长');
    }

    return recommendations;
  }

  // ==================== 数据验证和清理 ====================

  /**
   * 验证MBTI答题数据
   */
  validateMbtiAnswers(answers: MbtiAnswerData[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false;
    }

    // 检查是否包含所有必要的维度
    const requiredDimensions = ['E/I', 'S/N', 'T/F', 'J/P'];
    const answerDimensions = answers.map(answer => answer.dimension);
    
    for (const dimension of requiredDimensions) {
      if (!answerDimensions.includes(dimension)) {
        return false;
      }
    }

    // 检查每个答案的有效性
    for (const answer of answers) {
      if (!this.isValidMbtiAnswer(answer)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 验证单个MBTI答案
   */
  private isValidMbtiAnswer(answer: MbtiAnswerData): boolean {
    // 检查必要字段
    if (!answer.dimension || !answer.preference || !answer.confidence) {
      return false;
    }

    // 检查维度有效性
    const validDimensions = ['E/I', 'S/N', 'T/F', 'J/P'];
    if (!validDimensions.includes(answer.dimension)) {
      return false;
    }

    // 检查偏好有效性
    const validPreferences = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
    if (!validPreferences.includes(answer.preference)) {
      return false;
    }

    // 检查维度与偏好的一致性
    const dimensionMap: Record<string, string[]> = {
      'E/I': ['E', 'I'],
      'S/N': ['S', 'N'],
      'T/F': ['T', 'F'],
      'J/P': ['J', 'P']
    };
    
    if (!dimensionMap[answer.dimension]?.includes(answer.preference)) {
      return false;
    }

    // 检查信心度范围
    if (answer.confidence < 1 || answer.confidence > 5) {
      return false;
    }

    return true;
  }

  /**
   * 清理MBTI答题数据
   */
  cleanMbtiAnswers(answers: MbtiAnswerData[]): MbtiAnswerData[] {
    return answers
      .filter(answer => this.isValidMbtiAnswer(answer))
      .map(answer => ({
        ...answer,
        confidence: Math.max(1, Math.min(5, answer.confidence || 1)),
        responseTime: Math.max(0, answer.responseTime || 0)
      }));
  }
} 