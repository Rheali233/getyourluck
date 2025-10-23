/**
 * VARK学习风格测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'
import { AIService } from '../../AIService'

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
  
  async process(answers: any[], env?: any): Promise<any> {
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

    // 生成AI个性化分析
    let aiAnalysis = null
    if (env && env.DEEPSEEK_API_KEY) {
      try {
        // 确保API key是字符串类型
        const apiKey = String(env.DEEPSEEK_API_KEY)
        const aiService = new AIService(apiKey)
        aiAnalysis = await this.generateAIAnalysis(aiService, scores, styles, dominantStyle, secondaryStyle)
      } catch (error) {
        // AI analysis failed, using fallback
      }
    }

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
      
      // 样式数据用于前端显示
      styles,
      
      // AI个性化分析 - 所有内容都来自AI
      dimensionsAnalysis: aiAnalysis?.dimensionsAnalysis || {},
      interpretation: aiAnalysis?.interpretation || '',
      recommendations: aiAnalysis?.recommendations || [],
      studyTips: aiAnalysis?.studyTips || [],
      learningStrategies: aiAnalysis?.learningStrategies || [],
      learningProfile: aiAnalysis?.learningProfile || {},
      
      // 元数据
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'VARKResultProcessor',
        aiGenerated: !!aiAnalysis
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
  

  private getStyleName(style: string): string {
    const names: Record<string, string> = {
      'V': 'Visual',
      'A': 'Auditory', 
      'R': 'Read/Write',
      'K': 'Kinesthetic'
    }
    return names[style] || style
  }

  private async generateAIAnalysis(aiService: AIService, scores: any, styles: any[], dominantStyle: string, secondaryStyle: string): Promise<any> {
    const prompt = `As a learning psychology expert, analyze this VARK learning style test result and provide comprehensive personalized insights.

Test Results:
- Visual (V): ${scores.V} points (${styles.find(s => s.name === 'Visual')?.percent || 0}%)
- Auditory (A): ${scores.A} points (${styles.find(s => s.name === 'Auditory')?.percent || 0}%)  
- Read/Write (R): ${scores.R} points (${styles.find(s => s.name === 'Read/Write')?.percent || 0}%)
- Kinesthetic (K): ${scores.K} points (${styles.find(s => s.name === 'Kinesthetic')?.percent || 0}%)

Primary Style: ${dominantStyle}
Secondary Style: ${secondaryStyle}

Please provide a comprehensive analysis with these exact keys:

1. dimensionsAnalysis: Object with personalized analysis for each learning style dimension (Visual, Auditory, Read/Write, Kinesthetic). Each should be 2-3 sentences explaining what their score means for their learning approach.

2. interpretation: Overall learning style interpretation (2-3 sentences)

3. recommendations: Array of 3-5 specific learning recommendations based on their profile

4. studyTips: Array of 4-6 practical study tips tailored to their learning style

5. learningStrategies: Array of 3-4 learning strategies that work best for their profile

6. learningProfile: Object containing:
   - cognitiveStrengths: Array of 3-4 cognitive strengths based on their learning style
   - learningPreferences: Object with:
     - methods: Array of preferred learning methods
     - environments: Array of preferred learning environments  
     - timePatterns: Array of preferred study time patterns
   - adaptability: Object with:
     - strengths: Array of adaptability strengths
     - challenges: Array of potential learning challenges
     - strategies: Array of strategies for adapting to different learning situations

Format as JSON with these exact keys. Be specific and personalized based on their actual scores and percentages.`

    try {
      const response = await (aiService as any).callDeepSeek(prompt)
      
      // 解析AI响应
      if (response && response.choices && response.choices[0] && response.choices[0].message) {
        const content = response.choices[0].message.content
        
        // 提取JSON内容（去除markdown代码块标记）
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        
        const parsed = JSON.parse(jsonString)
        return parsed
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }


}
