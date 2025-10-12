/**
 * Holland职业兴趣测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class HollandResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'holland'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 - 支持数字格式 (1-5) 和字母格式 (R, I, A, S, E, C)
    const validLetterValues = ['R', 'I', 'A', 'S', 'E', 'C']
    
    return answers.every(answer => {
      if (!answer || answer.value === undefined) {
        return false
      }
      
      const value = answer.value
      
      // 支持字母格式 (R, I, A, S, E, C)
      if (typeof value === 'string') {
        return validLetterValues.includes(value) || 
               (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 5)
      }
      
      // 支持数字格式 (1-5)
      if (typeof value === 'number') {
        return Number.isFinite(value) && value >= 1 && value <= 5
      }
      
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    // 添加调试日志
    console.log('HollandResultProcessor.process called with answers:', JSON.stringify(answers, null, 2));
    
    if (!this.validateAnswers(answers)) {
      console.error('Holland answers validation failed:', answers);
      throw new Error('Invalid Holland answers format')
    }
    
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    
    answers.forEach(answer => {
      const raw = answer.value
      
      if (typeof raw === 'string') {
        // 字母型处理 (R, I, A, S, E, C)
        const validValues = ['R', 'I', 'A', 'S', 'E', 'C']
        if (validValues.includes(raw)) {
          const value = raw as keyof typeof scores
          if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
            scores[value]++
          }
          return
        }
        
        // 字符串数值型处理 (1-5)
        const numValue = parseInt(raw, 10)
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
          // 优先使用category字段，如果没有则从questionId推断
          let category = answer.category;
          if (!category) {
            const questionId = answer.questionId;
            if (questionId.includes('realistic') || questionId.includes('R')) {
              category = 'R';
            } else if (questionId.includes('investigative') || questionId.includes('I')) {
              category = 'I';
            } else if (questionId.includes('artistic') || questionId.includes('A')) {
              category = 'A';
            } else if (questionId.includes('social') || questionId.includes('S')) {
              category = 'S';
            } else if (questionId.includes('enterprising') || questionId.includes('E')) {
              category = 'E';
            } else if (questionId.includes('conventional') || questionId.includes('C')) {
              category = 'C';
            }
          }
          
          // 根据category累加得分
          if (category && Object.prototype.hasOwnProperty.call(scores, category)) {
            scores[category as keyof typeof scores] += numValue;
          }
        }
        return
      }

      if (typeof raw === 'number') {
        // 数字型处理 (1-5)
        if (raw >= 1 && raw <= 5) {
          // 优先使用category字段，如果没有则从questionId推断
          let category = answer.category;
          if (!category) {
            const questionId = answer.questionId;
            if (questionId.includes('realistic') || questionId.includes('R')) {
              category = 'R';
            } else if (questionId.includes('investigative') || questionId.includes('I')) {
              category = 'I';
            } else if (questionId.includes('artistic') || questionId.includes('A')) {
              category = 'A';
            } else if (questionId.includes('social') || questionId.includes('S')) {
              category = 'S';
            } else if (questionId.includes('enterprising') || questionId.includes('E')) {
              category = 'E';
            } else if (questionId.includes('conventional') || questionId.includes('C')) {
              category = 'C';
            }
          }
          
          // 根据category累加得分
          if (category && Object.prototype.hasOwnProperty.call(scores, category)) {
            scores[category as keyof typeof scores] += raw;
          }
        }
        return
      }
    })

    const topTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type)

    // 基础结果
    const baseResult = {
      scores,
      topTypes,
      primaryType: topTypes[0],
      secondaryType: topTypes[1],
      tertiaryType: topTypes[2],
      individualScores: Object.entries(scores).map(([type, score]) => ({
        type,
        score,
        description: this.getTypeDescription(type),
        percentage: Math.round((score / answers.length) * 100)
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'HollandResultProcessor'
      }
    };

    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      return {
        ...baseResult,
        ...aiAnalysis,
        // 确保基础字段不被覆盖
        scores: baseResult.scores,
        topTypes: baseResult.topTypes,
        primaryType: baseResult.primaryType,
        secondaryType: baseResult.secondaryType,
        tertiaryType: baseResult.tertiaryType,
        individualScores: baseResult.individualScores
      };
    }

    // 没有AI分析时，返回基础结果
    return {
      ...baseResult,
      interpretation: this.generateInterpretation(topTypes, scores),
      recommendations: this.generateRecommendations(topTypes),
      careerSuggestions: this.generateCareerSuggestions(topTypes),
      workEnvironment: this.generateWorkEnvironment(topTypes),
      skills: this.generateSkills(topTypes),
      values: this.generateValues(topTypes),
      developmentAreas: this.generateDevelopmentAreas(topTypes)
    };
  }
  
  private getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'R': 'Realistic - Practical, physical, hands-on problem solver',
      'I': 'Investigative - Analytical, intellectual, scientific',
      'A': 'Artistic - Creative, original, independent, chaotic',
      'S': 'Social - Cooperative, supporting, helping, healing',
      'E': 'Enterprising - Competitive environments, leadership, persuading',
      'C': 'Conventional - Detail-oriented, organizing, structured'
    }
    return descriptions[type] || 'Unknown type'
  }
  
  private generateInterpretation(topTypes: string[], _scores: any): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${topTypes.join(', ')} interest types`;
  }
  
  private generateRecommendations(topTypes: string[]): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${topTypes.join(', ')} interest types`];
  }
  
  private generateCareerSuggestions(topTypes: string[]): string[] {
    // 移除硬编码职业建议，让AI生成个性化分析
    return [`AI analysis will provide personalized career suggestions for ${topTypes.join(', ')} interest types`];
  }

  private generateWorkEnvironment(topTypes: string[]): string {
    return `AI analysis will provide detailed work environment preferences for ${topTypes.join(', ')} interest types`;
  }

  private generateSkills(topTypes: string[]): string[] {
    return [`AI analysis will provide personalized skill recommendations for ${topTypes.join(', ')} interest types`];
  }

  private generateValues(topTypes: string[]): string[] {
    return [`AI analysis will provide personalized value insights for ${topTypes.join(', ')} interest types`];
  }

  private generateDevelopmentAreas(topTypes: string[]): string[] {
    return [`AI analysis will provide personalized development areas for ${topTypes.join(', ')} interest types`];
  }
}
