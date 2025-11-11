/**
 * Love Style恋爱风格测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class LoveStyleResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'love_style'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      console.error('[LoveStyleResultProcessor] Invalid answers: not an array or empty', {
        isArray: Array.isArray(answers),
        length: answers?.length,
        type: typeof answers
      })
      return false
    }
    
    // 验证答案格式 (1-5 Likert量表)
    const validValues = ['1', '2', '3', '4', '5', 1, 2, 3, 4, 5]
    const invalidAnswers = answers.filter(answer => 
      !answer || 
      answer.value === undefined || 
      answer.value === null ||
      !validValues.includes(answer.value)
    )
    
    if (invalidAnswers.length > 0) {
      console.error('[LoveStyleResultProcessor] Invalid answers found:', {
        totalAnswers: answers.length,
        invalidCount: invalidAnswers.length,
        invalidAnswers: invalidAnswers.slice(0, 3).map(a => ({
          questionId: a?.questionId,
          value: a?.value,
          valueType: typeof a?.value
        }))
      })
      return false
    }
    
    return true
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    // 添加详细的日志，帮助定位问题
    console.log(`[LoveStyleResultProcessor] Processing ${answers?.length || 0} answers, aiAnalysis: ${aiAnalysis ? 'present' : 'null'}`)
    
    // 先检查answers是否是数组
    if (!Array.isArray(answers)) {
      console.error('[LoveStyleResultProcessor] Answers is not an array:', {
        type: typeof answers,
        value: answers
      })
      throw new Error(`Invalid Love Style answers format: answers must be an array, got ${typeof answers}`)
    }
    
    // 验证answers格式
    if (!this.validateAnswers(answers)) {
      // 提供更详细的错误信息，包括前几个无效答案的详细信息
      const invalidAnswers = answers.filter(answer => {
        if (!answer) return true
        const validValues = ['1', '2', '3', '4', '5', 1, 2, 3, 4, 5]
        return answer.value === undefined || 
               answer.value === null ||
               !validValues.includes(answer.value)
      })
      
      const errorDetails = {
        answersLength: answers.length,
        answersType: typeof answers,
        isArray: Array.isArray(answers),
        invalidCount: invalidAnswers.length,
        invalidAnswers: invalidAnswers.slice(0, 5).map(a => ({
          questionId: a?.questionId,
          value: a?.value,
          valueType: typeof a?.value,
          keys: a ? Object.keys(a) : []
        })),
        sampleValidAnswer: answers.find(a => {
          const validValues = ['1', '2', '3', '4', '5', 1, 2, 3, 4, 5]
          return a && a.value !== undefined && a.value !== null && validValues.includes(a.value)
        }) || null
      }
      console.error('[LoveStyleResultProcessor] Validation failed with details:', JSON.stringify(errorDetails, null, 2))
      throw new Error(`Invalid Love Style answers format: ${invalidAnswers.length} invalid answers found. First invalid: ${JSON.stringify(invalidAnswers[0])}`)
    }
    
    // 初始化各维度分数和计数
    const scores: Record<string, number> = {
      'Eros': 0,
      'Ludus': 0,
      'Storge': 0,
      'Pragma': 0,
      'Mania': 0,
      'Agape': 0
    }
    
    const dimensionCounts: Record<string, number> = {
      'Eros': 0,
      'Ludus': 0,
      'Storge': 0,
      'Pragma': 0,
      'Mania': 0,
      'Agape': 0
    }
    
    // 计算每个维度的分数（基于Likert量表1-5分）
    answers.forEach(answer => {
      let value = answer.value
      if (typeof value === 'string') {
        const parsed = parseInt(value, 10)
        if (!Number.isNaN(parsed)) {
          value = parsed
        }
      }
      
      // 从questionId推断维度
      const questionId = answer.questionId
      let dimension = ''
      if (questionId && typeof questionId === 'string') {
        // 同时兼容: love-style-category-qX / love_style_qX / 其他包含数字的格式
        const hyphenMatch = questionId.match(/(?:-|_)q(\d+)/i)
        const anyDigits = questionId.match(/(\d+)/)
        const questionNum = hyphenMatch && hyphenMatch[1]
          ? parseInt(hyphenMatch[1] as string, 10)
          : anyDigits && anyDigits[1]
          ? parseInt(anyDigits[1] as string, 10)
          : 0
        if (questionNum >= 1 && questionNum <= 5) {
          dimension = 'Eros'
        } else if (questionNum >= 6 && questionNum <= 10) {
          dimension = 'Ludus'
        } else if (questionNum >= 11 && questionNum <= 15) {
          dimension = 'Storge'
        } else if (questionNum >= 16 && questionNum <= 20) {
          dimension = 'Pragma'
        } else if (questionNum >= 21 && questionNum <= 25) {
          dimension = 'Mania'
        } else if (questionNum >= 26 && questionNum <= 30) {
          dimension = 'Agape'
        }
      }
      
      if (dimension && dimension in scores && typeof value === 'number' && value >= 1 && value <= 5) {
        scores[dimension] = (scores[dimension] || 0) + value
        dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1
      }
    })

    // 计算平均分和百分比
    const totalQuestions = answers.length
    const questionsPerDimension = Math.max(1, Math.round(totalQuestions / 6)) // 6个维度
    const maxPerDimension = questionsPerDimension * 5 // 每维度最高5分
    
    const allStyles = Object.entries(scores)
      .map(([dimension, totalScore]) => {
        const count = dimensionCounts[dimension] || 0
        const averageScore = count > 0 ? totalScore / count : 0
        const percentage = Math.max(0, Math.min(100, Math.round((totalScore / maxPerDimension) * 100)))
        return {
          dimension,
          score: totalScore,
          averageScore,
          percentage,
          level: this.calculateLevel(percentage)
        }
      })
      .sort((a, b) => b.percentage - a.percentage)

    const dominantStyle = allStyles[0]?.dimension || 'Unknown'
    const secondaryStyle = allStyles[1]?.dimension || 'Unknown'

    // 基础结果
    const baseResult = {
      scores,
      dominantStyle,
      secondaryStyle,
      allStyles,
      allScores: scores, // 兼容性字段
      metadata: {
        totalQuestions,
        processingTime: new Date().toISOString(),
        processor: 'LoveStyleResultProcessor'
      }
    };

    // 工具：将任意类型规范为字符串数组
    const toStringArray = (value: unknown): string[] => {
      if (Array.isArray(value)) {
        return (value as unknown[])
          .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
          .filter(Boolean) as string[];
      }
      if (typeof value === 'string') {
        return [value];
      }
      if (value === null || value === undefined) {
        return [];
      }
      return [JSON.stringify(value)];
    };

    // 轻度清洗/去重
    const cleanList = (list: string[]): string[] => {
      const seen = new Set<string>();
      const result: string[] = [];
      for (const raw of list) {
        const s = (raw || '').trim().replace(/\s+/g, ' ');
        if (!s) {
          continue;
        }
        const key = s.toLowerCase();
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        result.push(s);
      }
      return result;
    };

    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      // relationshipDynamics 既可能是详细对象（用于"Professional Analysis"），也可能是数组（用于 Guidance）
      const rawRelationshipDynamics = (aiAnalysis as any).relationshipDynamics;
      const relationshipDynamicsDetailed =
        rawRelationshipDynamics && typeof rawRelationshipDynamics === 'object' && !Array.isArray(rawRelationshipDynamics)
          ? rawRelationshipDynamics
          : {};

      // 规范化 guidance 相关字段为字符串数组
      const normalizedGuidance = {
        relationshipDynamics: cleanList(
          Array.isArray(rawRelationshipDynamics) ? toStringArray(rawRelationshipDynamics) : []
        ),
        communicationPatterns: cleanList(toStringArray((aiAnalysis as any).communicationPatterns)),
        compatibilityInsights: cleanList(toStringArray((aiAnalysis as any).compatibilityInsights)),
        growthAreas: cleanList(toStringArray((aiAnalysis as any).growthAreas)),
        relationshipAdvice: cleanList(toStringArray((aiAnalysis as any).relationshipAdvice))
      };

      return {
        ...baseResult,
        ...aiAnalysis,
        relationshipDynamicsDetailed,
        ...normalizedGuidance,
        // 确保基础字段不被覆盖
        scores: baseResult.scores,
        dominantStyle: baseResult.dominantStyle,
        secondaryStyle: baseResult.secondaryStyle,
        allStyles: baseResult.allStyles
      };
    }

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for Love Style test. Please ensure AI service is available and try again.');
    }

    // 使用AI分析结果
    return {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      dominantStyle: baseResult.dominantStyle,
      secondaryStyle: baseResult.secondaryStyle,
      allStyles: baseResult.allStyles
    };
  }
  
  private calculateLevel(percentage: number): string {
    // 与Love Language保持一致的阈值，但术语改为 alignment
    if (percentage >= 80) {
      return 'Very high alignment'
    }
    if (percentage >= 60) {
      return 'High alignment'
    }
    if (percentage >= 40) {
      return 'Moderate alignment'
    }
    return 'Low alignment'
  }

  private getStyleDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'Eros': 'Romantic, passionate, and intense love',
      'Ludus': 'Playful, fun, and game-like love',
      'Storge': 'Friendship-based, gradual, and stable love',
      'Pragma': 'Practical, logical, and compatibility-focused love',
      'Mania': 'Obsessive, dependent, and intense love',
      'Agape': 'Selfless, unconditional, and spiritual love'
    }
    return descriptions[type] || 'Unknown love style'
  }
  
  private generateInterpretation(dominant: string, _secondary: string): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${dominant} love style`;
  }
  
  private generateRecommendations(dominantStyle: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${dominantStyle} love style`];
  }
  
  private generateRelationshipTips(dominantStyle: string): string[] {
    // 移除硬编码关系技巧，让AI生成个性化建议
    return [`AI analysis will provide personalized relationship tips for ${dominantStyle} love style`];
  }
  
  private generateGrowthAreas(dominantStyle: string): string[] {
    // 移除硬编码成长领域，让AI生成个性化建议
    return [`AI analysis will provide personalized growth areas for ${dominantStyle} love style`];
  }

  private generateLoveStyleProfile(dominant: string, secondary: string): any {
    return {
      dominant: {
        type: dominant,
        description: this.getStyleDescription(dominant),
        characteristics: `AI analysis will provide characteristics for ${dominant} love style`,
        strengths: `AI analysis will provide strengths for ${dominant} love style`,
        challenges: `AI analysis will provide challenges for ${dominant} love style`
      },
      secondary: {
        type: secondary,
        description: this.getStyleDescription(secondary),
        characteristics: `AI analysis will provide characteristics for ${secondary} love style`,
        strengths: `AI analysis will provide strengths for ${secondary} love style`,
        challenges: `AI analysis will provide challenges for ${secondary} love style`
      },
      combination: `AI analysis will provide insights for ${dominant}/${secondary} love style combination`
    };
  }

  private generateCompatibilityInsights(dominantStyle: string): string {
    return `AI analysis will provide detailed compatibility insights for ${dominantStyle} love style`;
  }

  private generateRelationshipAdvice(dominantStyle: string): string[] {
    return [`AI analysis will provide personalized relationship advice for ${dominantStyle} love style`];
  }
}
