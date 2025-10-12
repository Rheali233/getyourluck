/**
 * Cognitive认知能力测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class CognitiveResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'cognitive'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 (1-5分制或正确/错误)
    return answers.every(answer => 
      answer && 
      (typeof answer.value === 'number' || typeof answer.value === 'boolean') &&
      (typeof answer.value === 'boolean' || (answer.value >= 1 && answer.value <= 5))
    )
  }
  
  async process(answers: any[]): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Cognitive test answers format')
    }
    
    const totalScore = this.calculateTotalScore(answers)
    const maxScore = this.calculateMaxScore(answers)
    const percentage = (totalScore / maxScore) * 100
    const level = this.calculateLevel(percentage)
    
    const dimensionScores = this.calculateDimensionScores(answers)
    const cognitiveProfile = this.generateCognitiveProfile(dimensionScores)
    
    return {
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      level,
      dimensionScores,
      cognitiveProfile,
      interpretation: this.generateInterpretation(level, percentage),
      recommendations: this.generateRecommendations(level),
      strengths: this.identifyStrengths(dimensionScores),
      developmentAreas: this.identifyDevelopmentAreas(dimensionScores),
      individualScores: answers.map((answer, index) => ({
        question: index + 1,
        score: answer.value,
        dimension: this.getQuestionDimension(index + 1),
        isCorrect: this.isAnswerCorrect(answer.value)
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'CognitiveResultProcessor'
      }
    }
  }
  
  private calculateTotalScore(answers: any[]): number {
    return answers.reduce((sum, answer) => {
      if (typeof answer.value === 'boolean') {
        return sum + (answer.value ? 1 : 0)
      }
      return sum + answer.value
    }, 0)
  }
  
  private calculateMaxScore(answers: any[]): number {
    return answers.reduce((sum, answer) => {
      if (typeof answer.value === 'boolean') {
        return sum + 1
      }
      return sum + 5
    }, 0)
  }
  
  private isAnswerCorrect(value: any): boolean {
    if (typeof value === 'boolean') {
      return value
    }
    return value >= 4 // 4-5分认为是正确
  }
  
  private calculateLevel(percentage: number): string {
    if (percentage >= 90) {
      return 'exceptional';
    }
    if (percentage >= 80) {
      return 'superior';
    }
    if (percentage >= 70) {
      return 'above_average';
    }
    if (percentage >= 50) {
      return 'average';
    }
    if (percentage >= 30) {
      return 'below_average';
    }
    return 'needs_improvement';
  }
  
  private calculateDimensionScores(answers: any[]): Record<string, { score: number, maxScore: number, percentage: number, correctAnswers: number }> {
    const dimensions = ['Memory', 'Attention', 'Processing Speed', 'Executive Function', 'Language', 'Visual-Spatial']
    const dimensionScores: Record<string, { score: number, maxScore: number, percentage: number, correctAnswers: number }> = {}
    
    dimensions.forEach((dimension, index) => {
      const startIndex = index * 3 // 假设每个维度3个问题
      const endIndex = Math.min(startIndex + 3, answers.length)
      const dimensionAnswers = answers.slice(startIndex, endIndex)
      
      const score = this.calculateTotalScore(dimensionAnswers)
      const maxScore = this.calculateMaxScore(dimensionAnswers)
      const percentage = (score / maxScore) * 100
      const correctAnswers = dimensionAnswers.filter(answer => this.isAnswerCorrect(answer.value)).length
      
      dimensionScores[dimension] = {
        score,
        maxScore,
        percentage: Math.round(percentage * 100) / 100,
        correctAnswers
      }
    })
    
    return dimensionScores
  }
  
  private getQuestionDimension(questionNumber: number): string {
    const dimensions = [
      'Memory', 'Memory', 'Memory',
      'Attention', 'Attention', 'Attention',
      'Processing Speed', 'Processing Speed', 'Processing Speed',
      'Executive Function', 'Executive Function', 'Executive Function',
      'Language', 'Language', 'Language',
      'Visual-Spatial', 'Visual-Spatial', 'Visual-Spatial'
    ]
    return dimensions[questionNumber - 1] || 'General Cognitive'
  }
  
  private generateCognitiveProfile(dimensionScores: Record<string, any>): Record<string, string> {
    const profile: Record<string, string> = {}
    
    Object.entries(dimensionScores).forEach(([dimension, data]) => {
      if (data.percentage >= 80) {
        profile[dimension] = 'Strong'
      } else if (data.percentage >= 60) {
        profile[dimension] = 'Good'
      } else if (data.percentage >= 40) {
        profile[dimension] = 'Average'
      } else {
        profile[dimension] = 'Needs Development'
      }
    })
    
    return profile
  }
  
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
}
