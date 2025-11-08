/**
 * Happiness测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class HappinessResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'happiness'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 (1-10分制) - 支持数字和字符串格式
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false
      }
      
      const value = answer.value
      if (typeof value === 'number') {
        return value >= 1 && value <= 10
      }
      
      if (typeof value === 'string') {
        const numValue = parseInt(value, 10)
        return !isNaN(numValue) && numValue >= 1 && numValue <= 10
      }
      
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Happiness answers format')
    }
    
    // 处理答案值，支持字符串和数字格式
    const processedAnswers = answers.map(answer => ({
      ...answer,
      value: typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value
    }))
    
    const totalScore = processedAnswers.reduce((sum, answer) => sum + answer.value, 0)
    const maxScore = processedAnswers.length * 5  // 5分制，与EQ测试一致
    const percentage = (totalScore / maxScore) * 100
    const level = this.calculateLevel(percentage)
    
    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for Happiness test. Please ensure AI service is available and try again.');
    }

    // 检查AI分析是否完整
    if (aiAnalysis.error) {
      throw new Error(`AI analysis failed: ${aiAnalysis.error}`);
    }

    // 使用AI分析结果
    const overallAnalysis = aiAnalysis.overallAnalysis || `Your happiness level is ${level} (${Math.round(percentage)}%).`;
    
    // 直接使用AI的domains数组，但为每个domain添加level字段
    const domains = (aiAnalysis.domains && Array.isArray(aiAnalysis.domains)) 
      ? aiAnalysis.domains.map((domain: any) => ({
          ...domain,
          level: this.getLevelName(level) // 使用整体的happinessLevel对应的levelName
        }))
      : [];
    
    // 使用AI的改进计划
    const improvementPlan = aiAnalysis.improvementPlan || {
      shortTerm: [],
      longTerm: [],
      dailyPractices: []
    };
    
    return {
      totalScore,
      maxScore,
      happinessLevel: level,
      levelName: this.getLevelName(level),
      levelDescription: this.getLevelDescription(level),
      overallAnalysis,
      domains,
      improvementPlan,
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'HappinessResultProcessor'
      }
    }
  }
  
  private calculateLevel(percentage: number): string {
    if (percentage >= 80) {
      return 'very_happy'
    }
    if (percentage >= 60) {
      return 'happy'
    }
    if (percentage >= 40) {
      return 'moderate'
    }
    if (percentage >= 20) {
      return 'unhappy'
    }
    return 'very_unhappy'
  }
  
  private getLevelName(level: string): string {
    const levelMap: Record<string, string> = {
      'very_happy': 'Very Happy',
      'happy': 'Happy',
      'moderate': 'Moderate',
      'unhappy': 'Unhappy',
      'very_unhappy': 'Very Unhappy'
    }
    return levelMap[level] || 'Unknown'
  }
  
  private getLevelDescription(level: string): string {
    const descriptions: Record<string, string> = {
      'very_happy': 'You experience high levels of life satisfaction and well-being.',
      'happy': 'You generally feel positive about your life and experiences.',
      'moderate': 'You have a balanced perspective on life with room for growth.',
      'unhappy': 'You may be experiencing challenges that affect your well-being.',
      'very_unhappy': 'You are going through significant difficulties in life.'
    }
    return descriptions[level] || 'Your happiness level indicates moderate satisfaction with life.'
  }
  
  private generateDefaultDomains(): any[] {
    return [
      {
        name: 'Positive Emotions',
        score: 0,
        maxScore: 20,
        description: 'Positive emotional experiences and feelings of joy, contentment, and satisfaction.',
        currentStatus: 'To be analyzed by AI',
        improvementAreas: ['Focus on personal growth'],
        positiveAspects: ['Strengths to be identified']
      },
      {
        name: 'Engagement',
        score: 0,
        maxScore: 20,
        description: 'Flow states and deep involvement in activities that provide meaning and fulfillment.',
        currentStatus: 'To be analyzed by AI',
        improvementAreas: ['Focus on personal growth'],
        positiveAspects: ['Strengths to be identified']
      },
      {
        name: 'Relationships',
        score: 0,
        maxScore: 20,
        description: 'Quality of social connections, support systems, and meaningful relationships.',
        currentStatus: 'To be analyzed by AI',
        improvementAreas: ['Focus on personal growth'],
        positiveAspects: ['Strengths to be identified']
      },
      {
        name: 'Meaning',
        score: 0,
        maxScore: 20,
        description: 'Sense of purpose, direction, and connection to something greater than oneself.',
        currentStatus: 'To be analyzed by AI',
        improvementAreas: ['Focus on personal growth'],
        positiveAspects: ['Strengths to be identified']
      },
      {
        name: 'Accomplishment',
        score: 0,
        maxScore: 20,
        description: 'Achievement, progress, and sense of competence in pursuing goals.',
        currentStatus: 'To be analyzed by AI',
        improvementAreas: ['Focus on personal growth'],
        positiveAspects: ['Strengths to be identified']
      }
    ]
  }
  
  private generateDefaultImprovementPlan(): any {
    return {
      immediate: ['Focus on daily positive activities', 'Practice gratitude', 'Connect with loved ones'],
      shortTerm: ['Set achievable goals', 'Improve sleep habits', 'Engage in physical activity'],
      longTerm: ['Develop meaningful relationships', 'Pursue personal growth', 'Find life purpose'],
      dailyHabits: ['Morning reflection', 'Evening gratitude', 'Mindful breathing', 'Physical exercise', 'Social connection']
    }
  }


}