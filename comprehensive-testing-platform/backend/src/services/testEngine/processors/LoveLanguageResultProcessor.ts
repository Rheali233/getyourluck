/**
 * Love Language爱之语测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class LoveLanguageResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'love_language'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 暂时放宽验证，只检查基本格式
    const isValid = answers.every(answer => {
      const isValidAnswer = answer && 
        answer.questionId && 
        answer.value !== undefined && 
        answer.value !== null
      
      return isValidAnswer
    })
    return isValid
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Love Language answers format')
    }
    
    // 初始化五种爱的语言得分
    const scores = { 
      'Words of Affirmation': 0, 
      'Quality Time': 0, 
      'Receiving Gifts': 0, 
      'Acts of Service': 0, 
      'Physical Touch': 0 
    }
    
    // 处理答案 - 支持数字格式、字符串数字格式和字母格式
    answers.forEach(answer => {
      let value = answer.value
      if (typeof value === 'string') {
        // 数字字符串转数字（统一口径，兼容 '1'~'5'）
        const parsed = parseInt(value, 10)
        if (!Number.isNaN(parsed)) {
          value = parsed
        }
      }
      let dimension = ''
      
      // 根据问题ID或维度信息确定爱的语言类型
      if (answer.questionId) {
        // 从问题ID中提取维度信息
        const questionId = answer.questionId.toString()
        if (questionId.includes('ll_')) {
          // 根据问题ID范围确定维度
          const questionNum = parseInt(questionId.split('_')[1])
          if (questionNum >= 1 && questionNum <= 6) {
            dimension = 'Words of Affirmation'
          } else if (questionNum >= 7 && questionNum <= 12) {
            dimension = 'Quality Time'
          } else if (questionNum >= 13 && questionNum <= 18) {
            dimension = 'Receiving Gifts'
          } else if (questionNum >= 19 && questionNum <= 24) {
            dimension = 'Acts of Service'
          } else if (questionNum >= 25 && questionNum <= 30) {
            dimension = 'Physical Touch'
          }
        } else if (questionId.includes('love-language-category-q')) {
          // 兼容另一套题目ID格式：love-language-category-q1..q30
          const match = questionId.match(/q(\d+)/i)
          const qn = match ? parseInt(match[1], 10) : NaN
          if (!Number.isNaN(qn)) {
            if (qn >= 1 && qn <= 6) {
              dimension = 'Words of Affirmation'
            } else if (qn >= 7 && qn <= 12) {
              dimension = 'Quality Time'
            } else if (qn >= 13 && qn <= 18) {
              dimension = 'Receiving Gifts'
            } else if (qn >= 19 && qn <= 24) {
              dimension = 'Acts of Service'
            } else if (qn >= 25 && qn <= 30) {
              dimension = 'Physical Touch'
            }
          }
        }
      }
      
      // 如果无法从问题ID确定维度，尝试从答案对象中获取
      if (!dimension && answer.dimension) {
        dimension = this.mapDimensionToLoveLanguage(answer.dimension)
      }
      
      // 如果仍然无法确定维度，跳过这个答案
      if (!dimension || !Object.prototype.hasOwnProperty.call(scores, dimension)) {
        return
      }
      
      // 累加得分
      if (typeof value === 'number' && value >= 1 && value <= 5) {
        (scores as any)[dimension] += value
      } else if (typeof value === 'string' && ['A', 'B', 'C', 'D', 'E'].includes(value)) {
        // 将字母转换为数字
        let numericValue = 1;
        switch (value) {
          case 'A': numericValue = 1; break;
          case 'B': numericValue = 2; break;
          case 'C': numericValue = 3; break;
          case 'D': numericValue = 4; break;
          case 'E': numericValue = 5; break;
        }
        (scores as any)[dimension] += numericValue
      }
    })

    const primaryLanguage = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'

    const secondaryLanguage = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[1]?.[0] || 'Unknown'

    // 基础结果
    const baseResult = {
      scores,
      primaryLanguage,
      secondaryLanguage,
      allLanguages: Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .map(([type, score]) => ({
          type,
          score,
          description: this.getLanguageDescription(type),
          percentage: Math.round((score / answers.length) * 100)
        })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'LoveLanguageResultProcessor'
      }
    };

    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      const merged: any = {
        ...baseResult,
        ...aiAnalysis,
        // 确保基础字段不被覆盖
        scores: baseResult.scores,
        primaryLanguage: baseResult.primaryLanguage,
        secondaryLanguage: baseResult.secondaryLanguage,
        allLanguages: baseResult.allLanguages
      }

      // 兜底：若 AI 未提供 allScores，则由基础 scores 推导
      if (!merged.allScores) {
        merged.allScores = { ...baseResult.scores }
      }

      // 兜底：确保 five dimensions 的 details 键都存在，避免前端空白
      const requiredKeys = ['Words of Affirmation','Quality Time','Receiving Gifts','Acts of Service','Physical Touch']
      merged.loveLanguageDetails = merged.loveLanguageDetails || {}
      for (const k of requiredKeys) {
        if (!merged.loveLanguageDetails[k]) {
          merged.loveLanguageDetails[k] = {
            description: `Basic guidance for ${k}.`,
            characteristics: [],
            needs: [],
            expressions: []
          }
        }
      }

      return merged
    }

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for Love Language test. Please ensure AI service is available and try again.');
    }

    // 使用AI分析结果
    return {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      primaryLanguage: baseResult.primaryLanguage,
      secondaryLanguage: baseResult.secondaryLanguage,
      scores: baseResult.scores,
      allLanguages: baseResult.allLanguages
    };
  }
  
  private mapDimensionToLoveLanguage(dimension: string): string {
    const dimensionMap: Record<string, string> = {
      'words_of_affirmation': 'Words of Affirmation',
      'quality_time': 'Quality Time',
      'receiving_gifts': 'Receiving Gifts',
      'acts_of_service': 'Acts of Service',
      'physical_touch': 'Physical Touch',
      'Words_of_Affirmation': 'Words of Affirmation',
      'Quality_Time': 'Quality Time',
      'Receiving_Gifts': 'Receiving Gifts',
      'Acts_of_Service': 'Acts of Service',
      'Physical_Touch': 'Physical Touch'
    }
    return dimensionMap[dimension] || ''
  }

  private getLanguageDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'Words of Affirmation': 'Verbal expressions of love and appreciation',
      'Quality Time': 'Undivided attention and meaningful time together',
      'Receiving Gifts': 'Thoughtful presents and tokens of affection',
      'Acts of Service': 'Helpful actions and acts of kindness',
      'Physical Touch': 'Physical contact and closeness',
      'A': 'Words of Affirmation - Verbal expressions of love and appreciation',
      'B': 'Quality Time - Undivided attention and meaningful time together',
      'C': 'Receiving Gifts - Thoughtful presents and tokens of affection',
      'D': 'Acts of Service - Helpful actions and acts of kindness',
      'E': 'Physical Touch - Physical contact and closeness'
    }
    return descriptions[type] || 'Unknown love language'
  }
  
  private generateInterpretation(primary: string, _secondary: string): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${primary} love language`;
  }
  
  private generateRecommendations(primaryLanguage: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${primaryLanguage} love language`];
  }
  
  private generateExpressionTips(primaryLanguage: string): string[] {
    // 移除硬编码表达技巧，让AI生成个性化建议
    return [`AI analysis will provide personalized expression tips for ${primaryLanguage} love language`];
  }
  
  private generateReceivingTips(primaryLanguage: string): string[] {
    // 移除硬编码接收技巧，让AI生成个性化建议
    return [`AI analysis will provide personalized receiving tips for ${primaryLanguage} love language`];
  }

  private generateRelationshipInsights(primaryLanguage: string): string {
    return `AI analysis will provide detailed relationship insights for ${primaryLanguage} love language`;
  }

  private generateCommunicationGuide(primaryLanguage: string): string {
    return `AI analysis will provide detailed communication guide for ${primaryLanguage} love language`;
  }

  private generateLoveLanguageProfile(primary: string, secondary: string): any {
    return {
      primary: {
        type: primary,
        description: this.getLanguageDescription(primary),
        characteristics: `AI analysis will provide characteristics for ${primary} love language`,
        needs: `AI analysis will provide needs for ${primary} love language`
      },
      secondary: {
        type: secondary,
        description: this.getLanguageDescription(secondary),
        characteristics: `AI analysis will provide characteristics for ${secondary} love language`,
        needs: `AI analysis will provide needs for ${secondary} love language`
      },
      combination: `AI analysis will provide insights for ${primary}/${secondary} love language combination`
    };
  }
}
