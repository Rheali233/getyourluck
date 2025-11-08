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
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
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

    // 计算百分比
    const totalAnswers = answers.length
    const styles = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .map(([style, score]) => ({
        name: this.getStyleName(style),
        percent: Math.round((score / totalAnswers) * 100),
        score
      }))

    // 基础结果
    const baseResult = {
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
      
      // 样式数据用于前端显示
      styles,
      
      // 元数据
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'VARKResultProcessor'
      }
    };

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for VARK test. Please ensure AI service is available and try again.');
    }

    // 使用AI分析结果
    return {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      scores: baseResult.scores,
      learningStyles: baseResult.learningStyles,
      dominantStyle: baseResult.dominantStyle,
      secondaryStyle: baseResult.secondaryStyle,
      primaryStyle: baseResult.primaryStyle,
      allStyles: baseResult.allStyles,
      styles: baseResult.styles
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
  

  private getStyleName(style: string): string {
    const names: Record<string, string> = {
      'V': 'Visual',
      'A': 'Auditory', 
      'R': 'Read/Write',
      'K': 'Kinesthetic'
    }
    return names[style] || style
  }


}
