/**
 * VARK学习风格测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class VARKResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'vark'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 (V, A, R, K) - 支持单个值或数组
    const validValues = ['V', 'A', 'R', 'K']
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false;
      }
      
      // 支持单个值或数组值
      if (Array.isArray(answer.value)) {
        return answer.value.every((val: string) => validValues.includes(val));
      } else {
        return validValues.includes(answer.value);
      }
    });
  }
  
  async process(answers: any[]): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid VARK answers format')
    }
    
    const scores = { V: 0, A: 0, R: 0, K: 0 }
    
    answers.forEach(answer => {
      // 处理单个值或数组值
      const values = Array.isArray(answer.value) ? answer.value : [answer.value]
      
      values.forEach((value: string) => {
        if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
          scores[value as keyof typeof scores]++
        }
      })
    })

    const learningStyles = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([style]) => style)

    const dominantStyle = learningStyles[0] || 'Unknown'
    const secondaryStyle = learningStyles[1] || 'Unknown'

    return {
      // 基础学习风格信息
      scores,
      learningStyles,
      dominantStyle,
      secondaryStyle,
      primaryStyle: dominantStyle, // 兼容性字段
      allStyles: Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .map(([style, score]) => ({
          style,
          score,
          description: this.getStyleDescription(style),
          percentage: Math.round((score / answers.length) * 100)
        })),
      
      // 基础分析内容
      interpretation: this.generateInterpretation(dominantStyle, secondaryStyle),
      recommendations: this.generateRecommendations(dominantStyle),
      studyTips: this.generateStudyTips(dominantStyle),
      learningStrategies: this.generateLearningStrategies(dominantStyle),
      
      // 元数据
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'VARKResultProcessor'
      }
    }
  }
  
  private getStyleDescription(style: string): string {
    const descriptions: Record<string, string> = {
      'V': 'Visual - Learn best through seeing, including pictures, diagrams, and written directions',
      'A': 'Auditory - Learn best through listening and speaking, including discussions and lectures',
      'R': 'Reading/Writing - Learn best through reading and writing, including text and notes',
      'K': 'Kinesthetic - Learn best through physical activity, hands-on experience, and movement'
    }
    return descriptions[style] || 'Unknown learning style'
  }
  
  private generateInterpretation(dominant: string, _secondary: string): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${dominant} learning style`;
  }
  
  private generateRecommendations(dominantStyle: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${dominantStyle} learning style`];
  }
  
  private generateStudyTips(dominantStyle: string): string[] {
    // 移除硬编码学习技巧，让AI生成个性化建议
    return [`AI analysis will provide personalized study tips for ${dominantStyle} learning style`];
  }
  
  private generateLearningStrategies(dominantStyle: string): string[] {
    // 移除硬编码学习策略，让AI生成个性化建议
    return [`AI analysis will provide personalized learning strategies for ${dominantStyle} learning style`];
  }
}
