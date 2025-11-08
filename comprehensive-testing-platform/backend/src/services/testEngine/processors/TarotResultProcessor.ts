/**
 * Tarot测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class TarotResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'tarot'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证塔罗卡牌答案格式
    return answers.every(answer => {
      if (!answer) {
        return false
      }
      
      // 验证答案结构
      if (!answer.answer || typeof answer.answer !== 'object') {
        return false
      }
      
      const card = answer.answer.card
      if (!card || typeof card !== 'object') {
        return false
      }
      
      // 验证必要字段
      return card.id && 
             card.name_en && 
             (typeof answer.answer.position === 'string' || typeof answer.answer.position === 'number') &&
             typeof answer.answer.isReversed === 'boolean'
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Tarot answers format')
    }
    
    // 处理塔罗卡牌数据
    const drawnCards = answers.map(answer => {
      const card = answer.answer.card
      return {
        id: card.id,
        name: card.name_en,
        position: answer.answer.position,
        isReversed: answer.answer.isReversed,
        meaning: answer.answer.isReversed ? card.meaning_reversed_en : card.meaning_upright_en,
        positionMeaning: answer.answer.position,
        card: {
          id: card.id,
          name_en: card.name_en,
          meaning_upright_en: card.meaning_upright_en,
          meaning_reversed_en: card.meaning_reversed_en,
          suit: card.suit || 'Major Arcana',
          element: card.element || 'Spirit',
          number: card.number || 0
        }
      }
    })
    
    // 生成增强的基础解读
    const basicReading = this.generateBasicReading(drawnCards, answers[0]?.answer)
    
    // 生成卡牌关联分析
    const cardConnections = this.analyzeCardConnections(drawnCards)
    
    // 生成整体主题分析
    const thematicAnalysis = this.analyzeThemes(drawnCards, answers[0]?.answer?.questionCategory)
    
    // 基础结果
    const baseResult = {
      drawnCards,
      basicReading,
      cardConnections,
      thematicAnalysis,
      spreadType: answers[0]?.answer?.spreadType || 'single_card',
      questionText: answers[0]?.answer?.questionText || '',
      questionCategory: answers[0]?.answer?.questionCategory || 'general',
      metadata: {
        totalCards: drawnCards.length,
        processingTime: new Date().toISOString(),
        processor: 'TarotResultProcessor',
        version: '2.0.0'
      }
    }
    
    // 如果有 AI 分析结果，将其作为 aiReading 字段添加
    if (aiAnalysis) {
      return {
        ...baseResult,
        aiReading: aiAnalysis
      }
    }
    
    return baseResult
  }

  /**
   * 生成增强的基础解读
   */
  private generateBasicReading(drawnCards: any[], context: any) {
    const questionCategory = context?.questionCategory || 'general'
    const spreadType = context?.spreadType || 'single_card'
    
    // 根据问题分类生成个性化摘要
    const categorySummaries: Record<string, string> = {
      'love': 'Your tarot reading reveals insights about your romantic life and relationships.',
      'career': 'The cards offer guidance about your professional path and career decisions.',
      'finance': 'Your reading provides wisdom about financial matters and material abundance.',
      'health': 'The tarot reveals insights about your physical and mental well-being.',
      'spiritual': 'Your cards guide you toward deeper spiritual understanding and growth.',
      'general': 'Your tarot reading offers guidance and insight into your current situation.'
    }
    
    // 根据牌阵类型生成建议
    const spreadAdvice: Record<string, string> = {
      'single_card': 'Focus on the single card\'s message as your primary guidance.',
      'three_card': 'Consider the past, present, and future aspects of your situation.',
      'celtic_cross': 'Examine the complex interplay of influences in your life.',
      'relationship': 'Look at how the cards relate to your relationship dynamics.',
      'career': 'Apply the card meanings to your professional development.'
    }
    
    return {
      summary: categorySummaries[questionCategory] || categorySummaries['general'],
      key_themes: drawnCards.map(card => card.name),
      general_advice: spreadAdvice[spreadType] || 'Reflect on the guidance provided by each card.',
      question_focus: this.getQuestionFocus(questionCategory),
      reading_style: this.getReadingStyle(spreadType)
    }
  }

  /**
   * 分析卡牌之间的关联
   */
  private analyzeCardConnections(drawnCards: any[]) {
    if (drawnCards.length < 2) {
      return {
        connections: [],
        overall_flow: 'Single card reading - focus on individual meaning',
        dominant_elements: this.getDominantElements(drawnCards)
      }
    }

    const connections: any[] = []
    const elements = drawnCards.map(card => card.card.element)
    // const suits = drawnCards.map(card => card.card.suit) // 暂时不使用
    
    // 分析元素平衡
    const elementBalance = this.analyzeElementBalance(elements)
    
    // 分析数字模式
    const numberPatterns = this.analyzeNumberPatterns(drawnCards)
    
    // 分析正逆位模式
    const reversalPattern = this.analyzeReversalPattern(drawnCards)
    
    return {
      connections: connections,
      overall_flow: this.determineOverallFlow(drawnCards),
      dominant_elements: this.getDominantElements(drawnCards),
      element_balance: elementBalance,
      number_patterns: numberPatterns,
      reversal_pattern: reversalPattern
    }
  }

  /**
   * 分析整体主题
   */
  private analyzeThemes(drawnCards: any[], questionCategory: string) {
    const themes = {
      major_arcana_count: drawnCards.filter(card => card.card.suit === 'Major Arcana').length,
      minor_arcana_count: drawnCards.filter(card => card.card.suit !== 'Major Arcana').length,
      reversed_count: drawnCards.filter(card => card.isReversed).length,
      upright_count: drawnCards.filter(card => !card.isReversed).length
    }

    return {
      themes,
      reading_complexity: this.assessReadingComplexity(themes),
      focus_areas: this.identifyFocusAreas(drawnCards, questionCategory),
      energy_level: this.assessEnergyLevel(drawnCards)
    }
  }

  // 辅助方法
  private getQuestionFocus(category: string) {
    const focuses: Record<string, string> = {
      'love': 'Relationships, emotional connections, and romantic guidance',
      'career': 'Professional development, work opportunities, and career decisions',
      'finance': 'Financial planning, abundance, and material security',
      'health': 'Physical and mental well-being, healing, and vitality',
      'spiritual': 'Spiritual growth, inner wisdom, and higher purpose',
      'general': 'Life guidance, decision-making, and personal development'
    }
    return focuses[category] || focuses['general']
  }

  private getReadingStyle(spreadType: string) {
    const styles: Record<string, string> = {
      'single_card': 'Focused and direct guidance',
      'three_card': 'Timeline-based perspective',
      'celtic_cross': 'Comprehensive life analysis',
      'relationship': 'Partnership-focused insight',
      'career': 'Professional development guidance'
    }
    return styles[spreadType] || 'General life guidance'
  }

  private getDominantElements(drawnCards: any[]) {
    const elementCount: Record<string, number> = {}
    drawnCards.forEach(card => {
      const element = card.card.element
      elementCount[element] = (elementCount[element] || 0) + 1
    })
    return Object.entries(elementCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([element, count]) => ({ element, count: count as number }))
  }

  private analyzeElementBalance(elements: string[]) {
    const balance = {
      fire: elements.filter(e => e === 'Fire').length,
      water: elements.filter(e => e === 'Water').length,
      air: elements.filter(e => e === 'Air').length,
      earth: elements.filter(e => e === 'Earth').length
    }
    
    const total = Object.values(balance).reduce((sum, count) => sum + count, 0)
    if (total === 0) return 'No elemental influence detected'
    
    const dominant = Object.entries(balance).find(([, count]) => count === Math.max(...Object.values(balance)))
    return `Dominant element: ${dominant?.[0]} (${dominant?.[1]} cards)`
  }

  private analyzeNumberPatterns(drawnCards: any[]) {
    const numbers = drawnCards.map(card => card.card.number).filter(num => num > 0)
    if (numbers.length === 0) return 'No numerical patterns detected'
    
    const ascending = numbers.every((num, i) => i === 0 || num > numbers[i-1])
    const descending = numbers.every((num, i) => i === 0 || num < numbers[i-1])
    
    if (ascending) return 'Ascending numerical progression - growth and development'
    if (descending) return 'Descending numerical progression - completion and release'
    return 'Mixed numerical patterns - complex influences'
  }

  private analyzeReversalPattern(drawnCards: any[]) {
    const reversedCount = drawnCards.filter(card => card.isReversed).length
    const totalCount = drawnCards.length
    const reversalRatio = reversedCount / totalCount
    
    if (reversalRatio === 0) return 'All cards upright - clear external influences'
    if (reversalRatio === 1) return 'All cards reversed - internal focus required'
    if (reversalRatio > 0.5) return 'Majority reversed - significant internal work needed'
    if (reversalRatio < 0.3) return 'Minority reversed - mostly external influences'
    return 'Balanced upright/reversed - mixed internal and external influences'
  }

  private determineOverallFlow(drawnCards: any[]) {
    if (drawnCards.length === 1) return 'Single focus reading'
    if (drawnCards.length <= 3) return 'Simple progression reading'
    if (drawnCards.length <= 6) return 'Complex multi-layered reading'
    return 'Comprehensive detailed reading'
  }

  private assessReadingComplexity(themes: any) {
    const complexity = themes.major_arcana_count + themes.reversed_count
    if (complexity === 0) return 'Simple and straightforward'
    if (complexity <= 2) return 'Moderately complex'
    if (complexity <= 4) return 'Highly complex'
    return 'Extremely complex - deep analysis required'
  }

  private identifyFocusAreas(drawnCards: any[], questionCategory: string) {
    const areas = []
    
    // 基于问题分类
    if (questionCategory === 'love') areas.push('Relationships', 'Emotional connections')
    if (questionCategory === 'career') areas.push('Professional development', 'Work opportunities')
    if (questionCategory === 'finance') areas.push('Financial planning', 'Material abundance')
    if (questionCategory === 'health') areas.push('Physical well-being', 'Mental health')
    if (questionCategory === 'spiritual') areas.push('Spiritual growth', 'Inner wisdom')
    
    // 基于卡牌类型
    const majorArcanaCount = drawnCards.filter(card => card.card.suit === 'Major Arcana').length
    if (majorArcanaCount > 0) areas.push('Life lessons', 'Spiritual guidance')
    
    return [...new Set(areas)] // 去重
  }

  private assessEnergyLevel(drawnCards: any[]) {
    const energyCards = ['The Sun', 'The Star', 'The World', 'Ace of Wands', 'Ace of Cups']
    const lowEnergyCards = ['The Moon', 'The Tower', 'Death', 'Ten of Swords', 'Five of Cups']
    
    const highEnergyCount = drawnCards.filter(card => energyCards.includes(card.name)).length
    const lowEnergyCount = drawnCards.filter(card => lowEnergyCards.includes(card.name)).length
    
    if (highEnergyCount > lowEnergyCount) return 'High energy - active and dynamic'
    if (lowEnergyCount > highEnergyCount) return 'Low energy - reflective and internal'
    return 'Balanced energy - moderate activity'
  }
}
