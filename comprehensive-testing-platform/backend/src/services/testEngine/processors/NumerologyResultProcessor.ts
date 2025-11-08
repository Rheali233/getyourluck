/**
 * Numerology测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class NumerologyResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'numerology'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证命理分析答案格式
    return answers.every(answer => {
      if (!answer) {
        return false
      }
      
      // 验证答案结构
      if (!answer.answer || typeof answer.answer !== 'object') {
        return false
      }
      
      const analysisData = answer.answer
      
      // 验证必要字段 - 支持两种格式
      return (analysisData.type || analysisData.analysisType) && 
             (analysisData.inputData || analysisData.basicInfo) &&
             typeof (analysisData.inputData || analysisData.basicInfo) === 'object'
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Numerology answers format')
    }
    
    // 处理命理分析数据
    const analysisResults = answers.map(answer => {
      const analysisData = answer.answer
      return {
        analysisType: analysisData.type || analysisData.analysisType,
        basicInfo: analysisData.inputData || analysisData.basicInfo,
        analysisResult: analysisData.analysisResult || null,
        timestamp: new Date().toISOString()
      }
    })
    
    // 生成基础分析结果
    const basicAnalysis = this.generateBasicAnalysis(analysisResults)
    
    // 生成建议和指导
    const guidance = this.generateGuidance(analysisResults)
    
    // 基础结果
    const baseResult = {
      analysisResults,
      basicAnalysis,
      guidance,
      analysisType: analysisResults[0]?.analysisType || 'bazi',
      metadata: {
        totalAnalyses: analysisResults.length,
        processingTime: new Date().toISOString(),
        processor: 'NumerologyResultProcessor',
        version: '1.0.0'
      }
    }
    
    // 如果有 AI 分析结果，将其合并到结果中
    if (aiAnalysis) {
      return {
        ...baseResult,
        analysis: aiAnalysis.analysis || aiAnalysis, // 支持两种格式
        ...aiAnalysis // 展开所有 AI 分析字段
      }
    }
    
    return baseResult
  }

  /**
   * 生成基础分析结果
   */
  private generateBasicAnalysis(analysisResults: any[]) {
    const analysisType = analysisResults[0]?.analysisType || 'bazi'
    
    const typeSummaries: Record<string, string> = {
      'bazi': 'Your BaZi analysis reveals insights about your birth chart and five elements.',
      'zodiac': 'Your Chinese zodiac fortune provides guidance for different periods.',
      'name': 'Your name analysis offers insights about your personality and destiny.',
      'ziwei': 'Your ZiWei chart analysis provides comprehensive life guidance.'
    }
    
    return {
      summary: typeSummaries[analysisType] || typeSummaries['bazi'],
      analysisType,
      keyInsights: this.extractKeyInsights(analysisResults),
      recommendations: this.generateRecommendations(analysisType)
    }
  }

  /**
   * 生成建议和指导
   */
  private generateGuidance(analysisResults: any[]) {
    const analysisType = analysisResults[0]?.analysisType || 'bazi'
    
    const guidanceByType: Record<string, any> = {
      'bazi': {
        immediate: 'Focus on balancing your five elements for better harmony.',
        longTerm: 'Develop your strengths while addressing elemental imbalances.',
        daily: 'Pay attention to your birth time and its influence on your daily activities.'
      },
      'zodiac': {
        immediate: 'Check your current zodiac fortune for immediate guidance.',
        longTerm: 'Plan according to your zodiac animal\'s characteristics.',
        daily: 'Align your actions with your zodiac animal\'s lucky elements.'
      },
      'name': {
        immediate: 'Consider how your name influences your current situation.',
        longTerm: 'Explore name modifications if needed for better destiny alignment.',
        daily: 'Use your name analysis insights in daily decision-making.'
      },
      'ziwei': {
        immediate: 'Focus on the most active palaces in your ZiWei chart.',
        longTerm: 'Develop according to your ZiWei chart\'s life guidance.',
        daily: 'Use your ZiWei insights for daily life planning.'
      }
    }
    
    return guidanceByType[analysisType] || guidanceByType['bazi']
  }

  // 辅助方法
  private extractKeyInsights(analysisResults: any[]): string[] {
    const insights: string[] = []
    
    analysisResults.forEach(result => {
      if (result.analysisResult) {
        insights.push(`${result.analysisType} analysis completed`)
      }
    })
    
    return insights.length > 0 ? insights : ['Analysis in progress']
  }

  private generateRecommendations(analysisType: string) {
    const recommendations: Record<string, string[]> = {
      'bazi': [
        'Balance your five elements through lifestyle choices',
        'Focus on your strongest elements for career development',
        'Address elemental weaknesses through specific activities'
      ],
      'zodiac': [
        'Check your zodiac fortune regularly',
        'Align important decisions with your zodiac characteristics',
        'Use lucky elements in your daily life'
      ],
      'name': [
        'Consider the impact of your name on your destiny',
        'Explore name modifications if beneficial',
        'Use your name analysis for personal development'
      ],
      'ziwei': [
        'Study your ZiWei chart regularly',
        'Focus on developing your strongest palaces',
        'Use ZiWei insights for life planning'
      ]
    }
    
    return recommendations[analysisType] || recommendations['bazi']
  }
}
