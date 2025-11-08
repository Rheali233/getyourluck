/**
 * 统一结果生成逻辑模型
 * 整合所有测试类型的结果生成逻辑，提供统一的接口
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../types/env'
import { TestCategory } from './UnifiedSessionModel'

// 统一的结果类型枚举
export enum ResultType {
  PERSONALITY_PROFILE = 'personality_profile',
  SCREENING_RESULT = 'screening_result',
  DIMENSION_PROFILE = 'dimension_profile',
  CAREER_PROFILE = 'career_profile',
  RELATIONSHIP_PROFILE = 'relationship_profile',
  LEARNING_PROFILE = 'learning_profile',
  WELLNESS_PROFILE = 'wellness_profile'
}

// 统一的结果格式接口
export interface UnifiedResult {
  id: string
  sessionId: string
  testTypeId: string
  testCategory: TestCategory
  resultType: ResultType
  scores: Record<string, number>
  interpretation: string
  recommendations: string[]
  detailedAnalysis: any
  confidence: number
  metadata: any
  createdAt: string
}

// 创建结果数据接口
export interface CreateUnifiedResultData {
  sessionId: string
  testTypeId: string
  testCategory: TestCategory
  resultType: ResultType
  scores: Record<string, number>
  interpretation: string
  recommendations: string[]
  detailedAnalysis?: any
  confidence?: number
  metadata?: any
}

// 结果模板接口
export interface ResultTemplate {
  id: string
  testTypeId: string
  resultType: ResultType
  template: any
  isActive: boolean
}

export class UnifiedResultModel extends BaseModel {
  constructor(env: Env) {
    super(env, 'unified_results')
  }

  /**
   * 创建统一结果
   */
  async create(resultData: CreateUnifiedResultData): Promise<string> {
    this.validateRequired(resultData, [
      'sessionId', 'testTypeId', 'testCategory', 'resultType', 
      'scores', 'interpretation', 'recommendations'
    ])

    const id = this.generateId()
    const now = this.formatTimestamp()

    const query = `
      INSERT INTO ${this.tableName} (
        id, session_id, test_type_id, test_category, result_type,
        scores, interpretation, recommendations, detailed_analysis,
        confidence, metadata, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      id,
      resultData.sessionId,
      resultData.testTypeId,
      resultData.testCategory,
      resultData.resultType,
      JSON.stringify(resultData.scores),
      resultData.interpretation,
      JSON.stringify(resultData.recommendations),
      JSON.stringify(resultData.detailedAnalysis || {}),
      resultData.confidence || 0.8,
      JSON.stringify(resultData.metadata || {}),
      now,
    ]

    await this.executeRun(query, params)

    // 缓存结果
    const cacheKey = `${this.tableName}:${id}`
    await this.setCache(cacheKey, {
      id,
      sessionId: resultData.sessionId,
      testTypeId: resultData.testTypeId,
      testCategory: resultData.testCategory,
      resultType: resultData.resultType,
      scores: resultData.scores,
      interpretation: resultData.interpretation,
      recommendations: resultData.recommendations,
      detailedAnalysis: resultData.detailedAnalysis,
      confidence: resultData.confidence || 0.8,
      metadata: resultData.metadata,
      createdAt: now,
    }, 86400) // 24小时缓存

    return id
  }

  /**
   * 根据会话ID获取结果
   */
  async findBySessionId(sessionId: string): Promise<UnifiedResult | null> {
    // 先尝试从缓存获取
    const cacheKey = `${this.tableName}:session:${sessionId}`
    const cached = await this.getCache<UnifiedResult>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `SELECT * FROM ${this.tableName} WHERE session_id = ?`
    const result = await this.executeQueryFirst<any>(query, [sessionId])
    
    if (!result) {
      return null
    }

    const unifiedResult = this.mapToUnifiedResult(result)
    
    // 更新缓存
    await this.setCache(cacheKey, unifiedResult, 86400)
    
    return unifiedResult
  }

  /**
   * 根据测试类型获取结果统计
   */
  async getResultsByTestType(testTypeId: string, limit: number = 20, offset: number = 0): Promise<UnifiedResult[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE test_type_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `

    const results = await this.executeQuery<any>(query, [testTypeId, limit, offset])
    return results.map(result => this.mapToUnifiedResult(result))
  }

  /**
   * 获取结果统计信息
   */
  async getResultStats(testTypeId?: string): Promise<{
    totalResults: number
    averageConfidence: number
    resultTypeDistribution: Record<string, number>
    averageScores: Record<string, number>
  }> {
    let query = `
      SELECT 
        COUNT(*) as total,
        AVG(confidence) as avg_confidence,
        result_type,
        scores
      FROM ${this.tableName}
    `
    const params: any[] = []

    if (testTypeId) {
      query += ' WHERE test_type_id = ?'
      params.push(testTypeId)
    }

    query += ' GROUP BY result_type'

    const results = await this.executeQuery<any>(query, params)
    
    const stats = {
      totalResults: 0,
      averageConfidence: 0,
      resultTypeDistribution: {} as Record<string, number>,
      averageScores: {} as Record<string, number>
    }

    let totalConfidence = 0
    let totalCount = 0

    for (const result of results) {
      const count = result.total || 0
      const confidence = result.avg_confidence || 0
      const resultType = result.result_type
      const scores = result.scores ? JSON.parse(result.scores) : {}

      stats.totalResults += count
      totalConfidence += confidence * count
      totalCount += count

      // 统计结果类型分布
      stats.resultTypeDistribution[resultType] = count

      // 统计平均分数
      for (const [key, value] of Object.entries(scores)) {
        if (typeof value === 'number') {
          if (!stats.averageScores[key]) {
            stats.averageScores[key] = 0
          }
          stats.averageScores[key] += value * count
        }
      }
    }

    // 计算平均值
    if (totalCount > 0) {
      stats.averageConfidence = totalConfidence / totalCount
      
      for (const key in stats.averageScores) {
        const currentValue = stats.averageScores[key]
        if (currentValue !== undefined) {
          stats.averageScores[key] = currentValue / totalCount
        }
      }
    }

    return stats
  }

  /**
   * 生成结果解释
   */
  generateInterpretation(
    testTypeId: string,
    scores: Record<string, number>,
    resultType: ResultType
  ): string {
    switch (resultType) {
      case ResultType.PERSONALITY_PROFILE:
        return this.generatePersonalityInterpretation(testTypeId, scores)
      case ResultType.SCREENING_RESULT:
        return this.generateScreeningInterpretation(testTypeId, scores)
      case ResultType.DIMENSION_PROFILE:
        return this.generateDimensionInterpretation(testTypeId, scores)
      case ResultType.CAREER_PROFILE:
        return this.generateCareerInterpretation(testTypeId, scores)
      case ResultType.RELATIONSHIP_PROFILE:
        return this.generateRelationshipInterpretation(testTypeId, scores)
      default:
        return this.generateGenericInterpretation(testTypeId, scores)
    }
  }

  /**
   * 生成建议
   */
  generateRecommendations(
    testTypeId: string,
    scores: Record<string, number>,
    resultType: ResultType
  ): string[] {
    switch (resultType) {
      case ResultType.PERSONALITY_PROFILE:
        return this.generatePersonalityRecommendations(testTypeId, scores)
      case ResultType.SCREENING_RESULT:
        return this.generateScreeningRecommendations(testTypeId, scores)
      case ResultType.DIMENSION_PROFILE:
        return this.generateDimensionRecommendations(testTypeId, scores)
      case ResultType.CAREER_PROFILE:
        return this.generateCareerRecommendations(testTypeId, scores)
      case ResultType.RELATIONSHIP_PROFILE:
        return this.generateRelationshipRecommendations(testTypeId, scores)
      default:
        return this.generateGenericRecommendations(testTypeId, scores)
    }
  }

  /**
   * 映射数据库结果到统一结果对象
   */
  private mapToUnifiedResult(row: any): UnifiedResult {
    return {
      id: row.id,
      sessionId: row.session_id,
      testTypeId: row.test_type_id,
      testCategory: row.test_category,
      resultType: row.result_type,
      scores: row.scores ? JSON.parse(row.scores) : {},
      interpretation: row.interpretation,
      recommendations: row.recommendations ? JSON.parse(row.recommendations) : [],
      detailedAnalysis: row.detailed_analysis ? JSON.parse(row.detailed_analysis) : {},
      confidence: row.confidence || 0.8,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      createdAt: row.created_at,
    }
  }

  // 以下是各种结果类型的解释和建议生成方法
  // 这些方法可以根据具体的测试类型进行定制

  private generatePersonalityInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    // MBTI、Big Five等性格测试的解释生成逻辑
    return `Based on your test results, you show a balanced personality profile.`
  }

  private generateScreeningInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    // PHQ-9、GAD-7等筛查测试的解释生成逻辑
    return `Your screening results indicate a moderate level of symptoms.`
  }

  private generateDimensionInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    // 多维度测试的解释生成逻辑
    return `Your results show strengths in several key areas.`
  }

  private generateCareerInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    // 职业测试的解释生成逻辑
    return `Based on your results, you have strong potential in several career areas.`
  }

  private generateRelationshipInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    // 关系测试的解释生成逻辑
    return `Your results suggest you have good relationship skills.`
  }

  private generateGenericInterpretation(_testTypeId: string, _scores: Record<string, number>): string {
    return `Your test results provide valuable insights into your characteristics.`
  }

  private generatePersonalityRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Consider how your personality traits influence your daily interactions',
      'Explore career paths that align with your natural strengths',
      'Develop strategies to work with different personality types'
    ]
  }

  private generateScreeningRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Consider talking to a mental health professional',
      'Practice stress management techniques',
      'Maintain regular sleep and exercise routines'
    ]
  }

  private generateDimensionRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Focus on developing your strongest areas further',
      'Work on improving areas with lower scores',
      'Seek opportunities to practice and develop new skills'
    ]
  }

  private generateCareerRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Research careers that match your highest-scoring dimensions',
      'Consider additional training in areas of interest',
      'Network with professionals in your target fields'
    ]
  }

  private generateRelationshipRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Practice active listening in your relationships',
      'Work on expressing your needs clearly',
      'Develop empathy and understanding for others'
    ]
  }

  private generateGenericRecommendations(_testTypeId: string, _scores: Record<string, number>): string[] {
    return [
      'Reflect on how these results apply to your life',
      'Consider setting goals based on your strengths',
      'Seek feedback from trusted friends or mentors'
    ]
  }
}
