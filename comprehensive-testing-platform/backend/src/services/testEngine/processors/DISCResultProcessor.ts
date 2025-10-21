/**
 * DISC行为风格测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class DISCResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'disc'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 - DISC测试使用数值答案(1-5)
    // 支持字符串和数字格式的答案值，dimension字段可选
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false
      }
      
      // 检查value字段 - 支持字符串和数字
      const value = answer.value
      if (typeof value === 'number') {
        return value >= 1 && value <= 5
      } else if (typeof value === 'string') {
        const numValue = parseInt(value, 10)
        return !isNaN(numValue) && numValue >= 1 && numValue <= 5
      }
      
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    console.log('=== DISCResultProcessor Debug ===');
    console.log('Answers count:', answers.length);
    console.log('First answer sample:', answers[0]);
    console.log('Answer structure check:', {
      hasValue: answers[0]?.value !== undefined,
      valueType: typeof answers[0]?.value,
      hasDimension: answers[0]?.dimension !== undefined,
      dimensionValue: answers[0]?.dimension
    });
    
    if (!this.validateAnswers(answers)) {
      console.error('DISC validation failed. Sample answers:', answers.slice(0, 3));
      throw new Error('Invalid DISC answers format')
    }
    
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    
    answers.forEach((answer, index) => {
      // 处理字符串和数字格式的答案值
      const value = typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value as number
      
      // 如果没有dimension字段，根据问题索引或questionId推断维度
      let dimension = answer.dimension
      if (!dimension) {
        // 根据问题索引循环分配维度
        const dimensions = ['dominance', 'influence', 'steadiness', 'conscientiousness']
        dimension = dimensions[index % dimensions.length]
      }
      
      // 根据dimension字段映射到DISC维度
      if (dimension === 'dominance') {
        scores.D += value
      } else if (dimension === 'influence') {
        scores.I += value
      } else if (dimension === 'steadiness') {
        scores.S += value
      } else if (dimension === 'conscientiousness') {
        scores.C += value
      }
    })

    const dominantType = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N'

    // 基础结果
    const baseResult = {
      scores,
      dominantType,
      typeProfile: this.generateTypeProfile(dominantType, scores),
      individualScores: Object.entries(scores).map(([type, score]) => ({
        type,
        score,
        description: this.getTypeDescription(type),
        percentage: Math.round((score / answers.length) * 100)
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'DISCResultProcessor'
      }
    };

    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      return {
        ...baseResult,
        ...aiAnalysis,
        // 确保基础字段不被覆盖
        scores: baseResult.scores,
        dominantType: baseResult.dominantType,
        typeProfile: baseResult.typeProfile,
        individualScores: baseResult.individualScores
      };
    }

    // 没有AI分析时，返回基础结果
    return {
      ...baseResult,
      interpretation: this.generateInterpretation(dominantType, scores),
      recommendations: this.generateRecommendations(dominantType),
      workStyle: this.generateWorkStyle(dominantType),
      communicationTips: this.generateCommunicationTips(dominantType),
      strengths: this.generateStrengths(dominantType),
      challenges: this.generateChallenges(dominantType),
      leadershipStyle: this.generateLeadershipStyle(dominantType),
      teamRole: this.generateTeamRole(dominantType)
    };
  }
  
  private getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'D': 'Dominance - Direct, decisive, results-oriented',
      'I': 'Influence - Optimistic, outgoing, people-oriented',
      'S': 'Steadiness - Patient, loyal, team-oriented',
      'C': 'Conscientiousness - Analytical, precise, quality-oriented'
    }
    return descriptions[type] || 'Unknown type'
  }
  
  private generateTypeProfile(dominantType: string, _scores: any): string {
    const profiles: Record<string, string> = {
      'D': 'High D individuals are direct, decisive, and results-oriented. They prefer to lead and take charge of situations.',
      'I': 'High I individuals are optimistic, outgoing, and people-oriented. They enjoy socializing and motivating others.',
      'S': 'High S individuals are patient, loyal, and team-oriented. They prefer stability and supporting others.',
      'C': 'High C individuals are analytical, precise, and quality-oriented. They focus on accuracy and following procedures.'
    }
    
    return profiles[dominantType] || 'Unable to generate type profile.'
  }
  
  private generateInterpretation(dominantType: string, _scores: any): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${dominantType} personality type`;
  }
  
  private generateRecommendations(dominantType: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${dominantType} personality type`];
  }
  
  private generateWorkStyle(dominantType: string): string {
    // 移除硬编码工作风格，让AI生成个性化分析
    return `AI analysis will provide detailed work style insights for ${dominantType} personality type`;
  }
  
  private generateCommunicationTips(dominantType: string): string[] {
    // 移除硬编码沟通技巧，让AI生成个性化建议
    return [`AI analysis will provide personalized communication tips for ${dominantType} personality type`];
  }

  private generateStrengths(dominantType: string): string[] {
    return [`AI analysis will provide personalized strengths for ${dominantType} personality type`];
  }

  private generateChallenges(dominantType: string): string[] {
    return [`AI analysis will provide personalized challenges for ${dominantType} personality type`];
  }

  private generateLeadershipStyle(dominantType: string): string {
    return `AI analysis will provide detailed leadership style insights for ${dominantType} personality type`;
  }

  private generateTeamRole(dominantType: string): string {
    return `AI analysis will provide detailed team role insights for ${dominantType} personality type`;
  }
}
