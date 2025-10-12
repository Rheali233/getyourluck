/**
 * Interpersonal人际关系测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class InterpersonalResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'interpersonal'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 (1-5分制) - 支持数字和字符串格式
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false;
      }
      
      const value = answer.value
      if (typeof value === 'number') {
        return value >= 1 && value <= 5
      }
      
      if (typeof value === 'string') {
        const numValue = parseInt(value, 10)
        return !isNaN(numValue) && numValue >= 1 && numValue <= 5
      }
      
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Interpersonal answers format')
    }
    
    // 处理答案值，支持字符串和数字格式
    const processedAnswers = answers.map(answer => ({
      ...answer,
      value: typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value
    }))
    
    const totalScore = processedAnswers.reduce((sum, answer) => sum + answer.value, 0)
    const maxScore = processedAnswers.length * 5
    const percentage = (totalScore / maxScore) * 100
    const level = this.calculateLevel(percentage)

    const { dimensionScores, allDimensions } = this.calculateDimensionScores(processedAnswers)
    
    // 基础结果
    const baseResult = {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      level,
      dimensionScores,
      allDimensions,
      individualScores: answers.map((answer, index) => ({
        question: index + 1,
        score: answer.value,
        dimension: this.inferDimensionFromAnswer(answer, index)
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'InterpersonalResultProcessor'
      }
    };

    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      // 合并AI维度描述为dimensionDetails（≤80词由前端/AI控制）
      const dimensionDetails = (aiAnalysis as any).dimensionDetails || {}
      return {
        ...baseResult,
        ...aiAnalysis,
        dimensionDetails,
        // 确保基础字段不被覆盖
        totalScore: baseResult.totalScore,
        maxScore: baseResult.maxScore,
        percentage: baseResult.percentage,
        level: baseResult.level,
        dimensionScores: baseResult.dimensionScores,
        allDimensions: baseResult.allDimensions,
        individualScores: baseResult.individualScores
      };
    }

    // 没有AI分析时，返回基础结果
    return {
      ...baseResult,
      interpretation: this.generateInterpretation(level, percentage),
      recommendations: this.generateRecommendations(level),
      // removed strengths/developmentAreas from backend output (kept internal helpers for potential future use)
      interpersonalProfile: this.generateInterpersonalProfile(level, dimensionScores),
      communicationStyle: this.generateCommunicationStyle(level, dimensionScores),
      relationshipInsights: this.generateRelationshipInsights(level, dimensionScores)
    };
  }
  
  private calculateLevel(percentage: number): string {
    if (percentage >= 80) {
      return 'Very high level';
    }
    if (percentage >= 60) {
      return 'High level';
    }
    if (percentage >= 40) {
      return 'Moderate level';
    }
    return 'Low level';
  }
  
  private calculateDimensionScores(answers: any[]): { dimensionScores: Record<string, { score: number, maxScore: number, percentage: number }>, allDimensions: Array<{ dimension: string, percentage: number, level: string }> } {
    const canonicalDimensions = ['Communication Skills', 'Conflict Resolution', 'Teamwork & Collaboration', 'Emotional Intelligence']
    const buckets: Record<string, Array<number>> = {}
    canonicalDimensions.forEach(d => { buckets[d] = [] })

    // 尝试从answer.dimension或questionId推断维度，否则按均分回退
    answers.forEach((answer: any, idx: number) => {
      const inferred = this.inferDimensionFromAnswer(answer, idx)
      const dim: string = (canonicalDimensions.find(d => d === inferred) ?? canonicalDimensions[idx % canonicalDimensions.length]) as string
      if (!buckets[dim]) buckets[dim] = []
      buckets[dim].push(typeof answer.value === 'number' ? answer.value : parseInt(String(answer.value), 10))
    })

    const dimensionScores: Record<string, { score: number, maxScore: number, percentage: number }> = {}
    const allDimensions: Array<{ dimension: string, percentage: number, level: string }> = []

    canonicalDimensions.forEach(dimension => {
      const values = buckets[dimension] ?? []
      const score = values.reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0)
      const maxScore = values.length * 5 || 5
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
      const pct = Math.max(0, Math.min(100, Math.round(percentage * 100) / 100))
      const lvl = this.calculateLevel(pct)
      dimensionScores[dimension] = { score, maxScore, percentage: pct }
      allDimensions.push({ dimension, percentage: Math.round(pct), level: lvl })
    })

    // 按百分比降序
    allDimensions.sort((a, b) => b.percentage - a.percentage)

    return { dimensionScores, allDimensions }
  }

  private inferDimensionFromAnswer(answer: any, index: number): string {
    const mapByKeyword: Array<{ key: RegExp, dim: string }> = [
      { key: /communication/i, dim: 'Communication Skills' },
      { key: /conflict|resolution/i, dim: 'Conflict Resolution' },
      { key: /teamwork|collaboration/i, dim: 'Teamwork & Collaboration' },
      { key: /emotional\s*intelligence|empathy|emotion/i, dim: 'Emotional Intelligence' }
    ]
    const text = [answer?.dimension, answer?.questionId, answer?.id, answer?.text].filter(Boolean).join(' ')
    for (const rule of mapByKeyword) {
      if (rule.key.test(String(text))) return rule.dim
    }
    const fallback = ['Communication Skills', 'Conflict Resolution', 'Teamwork & Collaboration', 'Emotional Intelligence']
    return fallback[index % fallback.length] as string
  }
  
  // removed legacy dimension mapper (no longer used)
  
  private generateInterpretation(level: string, _percentage: number): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${level} level`;
  }
  
  private generateRecommendations(level: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${level} level`];
  }
  
  private identifyStrengths(dimensionScores: Record<string, any>): string[] {
    return Object.entries(dimensionScores)
      .filter(([, data]) => data.percentage >= 70)
      .map(([dimension]) => dimension)
  }
  
  private identifyDevelopmentAreas(dimensionScores: Record<string, any>): string[] {
    return Object.entries(dimensionScores)
      .filter(([, data]) => data.percentage < 60)
      .map(([dimension]) => dimension)
  }

  private generateInterpersonalProfile(level: string, dimensionScores: Record<string, any>): any {
    return {
      overallLevel: level,
      topStrengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      profile: `AI analysis will provide detailed interpersonal profile for ${level} level`,
      characteristics: `AI analysis will provide characteristics for ${level} level interpersonal skills`
    };
  }

  private generateCommunicationStyle(level: string, _dimensionScores: Record<string, any>): string {
    return `AI analysis will provide detailed communication style insights for ${level} level interpersonal skills`;
  }

  private generateRelationshipInsights(level: string, _dimensionScores: Record<string, any>): string[] {
    return [`AI analysis will provide personalized relationship insights for ${level} level interpersonal skills`];
  }
}
