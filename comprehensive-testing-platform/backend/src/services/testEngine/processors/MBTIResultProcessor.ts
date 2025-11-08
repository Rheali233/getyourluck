/**
 * MBTI测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class MBTIResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'mbti'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式
    const validValues = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
    return answers.every(answer => {
      if (!answer) {
        return false
      }
      const value = answer.value
      // 支持三类：字母型、数值型、字符串数值型
      if (typeof value === 'string') {
        // 字母型
        if (validValues.includes(value)) {
          return true
        }
        // 字符串数值型
        const numValue = parseInt(value, 10)
        return !isNaN(numValue) && numValue >= 1 && numValue <= 5
      }
      if (typeof value === 'number') {
        return Number.isFinite(value) && value >= 1 && value <= 5
      }
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid MBTI answers format')
    }
    
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    
    answers.forEach(answer => {
      const raw = answer.value
      if (typeof raw === 'string') {
        // 字母型处理
        const validValues = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
        if (validValues.includes(raw)) {
          const value = raw as keyof typeof scores
          if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
            scores[value]++
          }
          return
        }
        // 字符串数值型处理
        const numValue = parseInt(raw, 10)
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 5) {
          // 从 questionId 推断维度主字母：mbti-e-xx / mbti-s-xx / mbti-t-xx / mbti-j-xx
          const qid: string = String(answer.questionId || '')
          // 默认映射：>3 偏向前者(E/S/T/J)，<=3 偏向后者(I/N/F/P)
          const isHigh = numValue > 3
          let incA: keyof typeof scores | null = null
          let incB: keyof typeof scores | null = null

          if (/mbti-e-/i.test(qid)) { incA = 'E'; incB = 'I' }
          else if (/mbti-s-/i.test(qid)) { incA = 'S'; incB = 'N' }
          else if (/mbti-t-/i.test(qid)) { incA = 'T'; incB = 'F' }
          else if (/mbti-j-/i.test(qid)) { incA = 'J'; incB = 'P' }

          if (incA && incB) {
            scores[isHigh ? incA : incB]++
          }
        }
        return
      }

      if (typeof raw === 'number') {
        // 从 questionId 推断维度主字母：mbti-e-xx / mbti-s-xx / mbti-t-xx / mbti-j-xx
        const qid: string = String(answer.questionId || '')
        // 默认映射：>3 偏向前者(E/S/T/J)，<=3 偏向后者(I/N/F/P)
        const isHigh = raw > 3
        let incA: keyof typeof scores | null = null
        let incB: keyof typeof scores | null = null

        if (/mbti-e-/i.test(qid)) { incA = 'E'; incB = 'I' }
        else if (/mbti-s-/i.test(qid)) { incA = 'S'; incB = 'N' }
        else if (/mbti-t-/i.test(qid)) { incA = 'T'; incB = 'F' }
        else if (/mbti-j-/i.test(qid)) { incA = 'J'; incB = 'P' }

        if (incA && incB) {
          scores[isHigh ? incA : incB]++
        }
      }
    })

    const type = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('')

    // 基础结果
    const baseResult = {
      scores,
      type,
      personalityType: type,
      typeName: this.getTypeName(type),
      typeDescription: this.getTypeDescription(type),
      dimensions: this.generateDimensions(scores),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'MBTIResultProcessor'
      }
    };

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      // eslint-disable-next-line no-console
      console.error('[MBTIResultProcessor] AI analysis is missing for MBTI test');
      throw new Error('AI analysis is required for MBTI test. Please ensure AI service is available and try again.');
    }

    // eslint-disable-next-line no-console
    console.log('[MBTIResultProcessor] AI analysis received, keys:', Object.keys(aiAnalysis));
    // eslint-disable-next-line no-console
    console.log('[MBTIResultProcessor] AI analysis has detailedAnalysis:', !!aiAnalysis.detailedAnalysis);
    // eslint-disable-next-line no-console
    console.log('[MBTIResultProcessor] AI analysis has personalityType:', aiAnalysis.personalityType);

    // 使用AI分析结果
    const result = {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      scores: baseResult.scores,
      type: baseResult.type,
      personalityType: aiAnalysis.personalityType || baseResult.personalityType,
      dimensions: aiAnalysis.dimensions && Array.isArray(aiAnalysis.dimensions) && aiAnalysis.dimensions.length > 0 
        ? aiAnalysis.dimensions 
        : baseResult.dimensions
    };

    // eslint-disable-next-line no-console
    console.log('[MBTIResultProcessor] Final result prepared, personalityType:', result.personalityType);
    // eslint-disable-next-line no-console
    console.log('[MBTIResultProcessor] Final result has detailedAnalysis:', !!result.detailedAnalysis);

    return result;
  }
  
  private generateInterpretation(type: string, _scores: any): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${type} personality type`;
  }
  
  private getTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      'INTJ': 'The Architect',
      'INTP': 'The Thinker',
      'ENTJ': 'The Commander',
      'ENTP': 'The Debater',
      'INFJ': 'The Advocate',
      'INFP': 'The Mediator',
      'ENFJ': 'The Protagonist',
      'ENFP': 'The Campaigner',
      'ISTJ': 'The Logistician',
      'ISFJ': 'The Protector',
      'ESTJ': 'The Executive',
      'ESFJ': 'The Consul',
      'ISTP': 'The Virtuoso',
      'ISFP': 'The Adventurer',
      'ESTP': 'The Entrepreneur',
      'ESFP': 'The Entertainer'
    };
    return typeNames[type] || 'Unknown Type';
  }

  private getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'INTJ': 'Strategic, independent, and decisive with a strong vision for the future.',
      'INTP': 'Innovative, logical, and curious with a passion for understanding complex systems.',
      'ENTJ': 'Bold, confident, and natural leader who excels at organizing people and resources.',
      'ENTP': 'Smart, curious, and energetic with a love for intellectual challenges and debates.',
      'INFJ': 'Creative, insightful, and inspiring with a strong sense of personal integrity.',
      'INFP': 'Idealistic, loyal, and adaptable with a strong sense of personal values.',
      'ENFJ': 'Charismatic, inspiring, and natural-born leader with excellent people skills.',
      'ENFP': 'Enthusiastic, creative, and sociable with a passion for exploring possibilities.',
      'ISTJ': 'Practical, fact-minded, and reliable with a strong sense of responsibility.',
      'ISFJ': 'Warm-hearted, dedicated, and responsible with a strong sense of duty.',
      'ESTJ': 'Dedicated, strong-willed, and direct with excellent organizational skills.',
      'ESFJ': 'Caring, social, and popular with a strong desire to help others.',
      'ISTP': 'Bold, practical, and spontaneous with excellent hands-on problem-solving skills.',
      'ISFP': 'Flexible, charming, and sensitive with a strong appreciation for beauty.',
      'ESTP': 'Smart, energetic, and perceptive with excellent people skills.',
      'ESFP': 'Spontaneous, enthusiastic, and people-focused with a love for life.'
    };
    return descriptions[type] || 'A unique personality type with distinct characteristics.';
  }

  private generateDimensions(scores: any): any[] {
    return [
      {
        name: 'Extraversion vs Introversion',
        leftLabel: 'Extraversion',
        rightLabel: 'Introversion',
        score: Math.round((scores.E / (scores.E + scores.I)) * 100) || 50,
        description: 'How you gain energy and focus your attention'
      },
      {
        name: 'Sensing vs Intuition',
        leftLabel: 'Sensing',
        rightLabel: 'Intuition',
        score: Math.round((scores.S / (scores.S + scores.N)) * 100) || 50,
        description: 'How you process information and perceive the world'
      },
      {
        name: 'Thinking vs Feeling',
        leftLabel: 'Thinking',
        rightLabel: 'Feeling',
        score: Math.round((scores.T / (scores.T + scores.F)) * 100) || 50,
        description: 'How you make decisions and evaluate information'
      },
      {
        name: 'Judging vs Perceiving',
        leftLabel: 'Judging',
        rightLabel: 'Perceiving',
        score: Math.round((scores.J / (scores.J + scores.P)) * 100) || 50,
        description: 'How you approach the outside world and structure your life'
      }
    ];
  }

  private generateStrengths(type: string): string[] {
    return [`AI analysis will provide personalized strengths for ${type} personality type`];
  }

  private generateBlindSpots(type: string): string[] {
    return [`AI analysis will provide personalized blind spots for ${type} personality type`];
  }

  private generateCareerSuggestions(type: string): string[] {
    return [`AI analysis will provide personalized career suggestions for ${type} personality type`];
  }

  private generateRelationshipPerformance(type: string): any {
    return {
      workplace: {
        leadershipStyle: `AI analysis will provide workplace leadership insights for ${type}`,
        teamCollaboration: `AI analysis will provide team collaboration insights for ${type}`,
        decisionMaking: `AI analysis will provide decision-making insights for ${type}`
      },
      family: {
        role: `AI analysis will provide family role insights for ${type}`,
        communication: `AI analysis will provide family communication insights for ${type}`,
        emotionalExpression: `AI analysis will provide emotional expression insights for ${type}`
      },
      friendship: {
        preferences: `AI analysis will provide friendship preferences for ${type}`,
        socialPattern: `AI analysis will provide social pattern insights for ${type}`,
        supportStyle: `AI analysis will provide support style insights for ${type}`
      },
      romance: {
        datingStyle: `AI analysis will provide dating style insights for ${type}`,
        emotionalNeeds: `AI analysis will provide emotional needs insights for ${type}`,
        relationshipPattern: `AI analysis will provide relationship pattern insights for ${type}`
      }
    };
  }

  private generateRecommendations(type: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${type} personality type`];
  }
}
