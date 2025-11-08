import { TestResultProcessor } from '../TestResultProcessor'

type EQLevel = 'Needs Improvement' | 'Average' | 'Good' | 'Very Good' | 'Excellent'

export class EQResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'eq'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false;
    }
    
    return answers.every(answer => {
      const value = answer.value;
      return (
        typeof value === 'number' && value >= 1 && value <= 5 ||
        (typeof value === 'string' && !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 5)
      );
    });
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid EQ answers format')
    }
    
    // 处理答案值，支持前端格式 {questionId, value, timestamp}
    const processedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      value: typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value,
      timestamp: answer.timestamp
    }))
    
    const totalScore = processedAnswers.reduce((sum, answer) => sum + answer.value, 0)
    const maxScore = processedAnswers.length * 5
    const percentage = (totalScore / maxScore) * 100
    
    // 计算维度分数并统一设置level（按题目维度标签归并，合并motivation到self_management）
    const dimensions = this.calculateDimensionScores(processedAnswers).map(dim => ({
      ...dim,
      level: this.getStandardLevel(dim.score / dim.maxScore * 100)
    }));
    
    // 计算整体level
    const overallLevel = this.getStandardLevel(percentage);
    
    // 基础结果
    const baseResult = {
      overallScore: totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
      overallLevel: overallLevel,
      levelName: this.getLevelName(overallLevel),
      dimensions: dimensions,
      individualScores: processedAnswers.map((answer, index) => ({
        question: index + 1,
        score: this.getScoredValue(answer),
        dimension: this.normalizeDimensionLabel(this.getDimensionFromQuestionId(answer.questionId))
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'EQResultProcessor'
      }
    };

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for EQ test. Please ensure AI service is available and try again.');
    }

    // 调试信息
    // eslint-disable-next-line no-console
    console.log('EQ AI Analysis Debug:', {
      hasAIAnalysis: !!aiAnalysis,
      hasAIDimensions: !!aiAnalysis.dimensions,
      aiDimensionsLength: aiAnalysis.dimensions?.length,
      aiDimensions: aiAnalysis.dimensions,
      baseDimensionsLength: baseResult.dimensions?.length,
      baseDimensions: baseResult.dimensions
    });
    
    // 使用AI分析结果
    return {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      overallScore: baseResult.overallScore,
      maxScore: baseResult.maxScore,
      percentage: baseResult.percentage,
      overallLevel: baseResult.overallLevel,
      levelName: baseResult.levelName,
      // 优先使用AI分析的dimensions，如果没有则使用baseResult的dimensions
      dimensions: aiAnalysis.dimensions && aiAnalysis.dimensions.length > 0 ? aiAnalysis.dimensions : baseResult.dimensions,
      individualScores: baseResult.individualScores
    };
  }
  
  private calculateDimensionScores(answers: any[]): any[] {
    const dimensionStats: { [key: string]: { total: number; count: number; maxScore: number } } = {};
    
    // 定义EQ测试的四个维度映射
    const dimensionMapping: { [key: string]: string } = {
      'self_awareness': 'Self-Awareness',
      'self_management': 'Self-Management', 
      'social_awareness': 'Social Awareness',
      'relationship_management': 'Relationship Management'
    };
    
    answers.forEach(answer => {
      // 尝试从answer中获取dimension信息，如果没有则从questionId推断
      let dimension = answer.dimension;
      if (!dimension) {
        dimension = this.getDimensionFromQuestionId(answer.questionId);
      }
      
      if (dimension) {
        // 标准化维度名称
        const normalizedDimension = dimensionMapping[dimension] || this.normalizeDimensionLabel(dimension);
        if (normalizedDimension) {
          if (!dimensionStats[normalizedDimension]) {
            dimensionStats[normalizedDimension] = { total: 0, count: 0, maxScore: 0 };
          }
          
          const scoredValue = this.getScoredValue(answer);
          dimensionStats[normalizedDimension].total += scoredValue;
          dimensionStats[normalizedDimension].count += 1;
          dimensionStats[normalizedDimension].maxScore += 5;
        }
      }
    });
    
    // 如果没有找到任何维度数据，返回默认的四个维度
    if (Object.keys(dimensionStats).length === 0) {
      return [
        {
          name: 'Self-Awareness',
          score: 0,
          maxScore: 0,
          percentage: 0,
          level: 'Average',
          description: 'This dimension measures your ability to recognize and understand your own emotions and their impact on your thoughts and behaviors.',
          strengths: ['Basic emotional recognition', 'Some self-reflection skills']
        },
        {
          name: 'Self-Management',
          score: 0,
          maxScore: 0,
          percentage: 0,
          level: 'Average',
          description: 'This dimension assesses your ability to regulate your emotions and manage your impulses effectively in various situations.',
          strengths: ['Some emotional regulation', 'Basic stress management']
        },
        {
          name: 'Social Awareness',
          score: 0,
          maxScore: 0,
          percentage: 0,
          level: 'Average',
          description: 'This dimension evaluates your ability to understand others\' emotions and read social cues in different contexts.',
          strengths: ['Some empathy', 'Basic social understanding']
        },
        {
          name: 'Relationship Management',
          score: 0,
          maxScore: 0,
          percentage: 0,
          level: 'Average',
          description: 'This dimension measures your ability to build and maintain healthy relationships with others.',
          strengths: ['Some communication skills', 'Basic relationship building']
        }
      ];
    }
    
    const dimensions = Object.entries(dimensionStats).map(([name, stats]) => {
      const maxScore = stats.count * 5;
      const percentage = maxScore > 0 ? (stats.total / maxScore) * 100 : 0;
      const level = this.getStandardLevel(percentage);
      return {
        name,
        score: stats.total,
        maxScore,
        percentage: Math.round(percentage * 100) / 100,
        level: level,
        description: this.generateDimensionDescription(name, level, percentage),
        strengths: this.generateDimensionStrengths(name, level, percentage)
      };
    });
    
    return dimensions;
  }
  
  private getScoredValue(answer: any): number {
    const raw = answer.value;
    const isReverse = this.isReverseQuestion(answer.questionId);
    if (isReverse) {
      return 6 - raw;
    }
    return raw;
  }

  private getDimensionFromQuestionId(questionId: string): string | null {
    if (!questionId) {
      return null;
    }
    
    const id = questionId.toLowerCase();
    
    // 自我意识 (Self-Awareness)
    if (id.includes('self-awareness') || id.includes('selfawareness') || id.includes('emotional-awareness')) {
      return 'Self-Awareness';
    }
    
    // 自我管理 (Self-Management) - 包括 motivation
    if (id.includes('self-management') || id.includes('selfmanagement') || 
        id.includes('self-regulation') || id.includes('selfregulation') ||
        id.includes('motivation') || id.includes('emotional-regulation')) {
      return 'Self-Management';
    }
    
    // 社会意识 (Social Awareness)
    if (id.includes('social-awareness') || id.includes('socialawareness') || 
        id.includes('empathy') || id.includes('social-cognition')) {
      return 'Social Awareness';
    }
    
    // 关系管理 (Relationship Management)
    if (id.includes('relationship-management') || id.includes('relationshipmanagement') ||
        id.includes('social-skills') || id.includes('socialskills') ||
        id.includes('interpersonal-skills') || id.includes('interpersonalskills')) {
      return 'Relationship Management';
    }
    
    return null;
  }

  private normalizeDimensionLabel(raw: any): string | null {
    if (!raw) {
      return null;
    }
    
    const label = String(raw).toLowerCase();
    
    if (label.includes('self-awareness') || label.includes('selfawareness') || label.includes('emotional-awareness')) {
      return 'Self-Awareness';
    }
    if (label.includes('self-management') || label.includes('selfmanagement') || 
        label.includes('self-regulation') || label.includes('selfregulation') ||
        label.includes('motivation') || label.includes('emotional-regulation')) {
      return 'Self-Management';
    }
    if (label.includes('social-awareness') || label.includes('socialawareness') || 
        label.includes('empathy') || label.includes('social-cognition')) {
      return 'Social Awareness';
    }
    if (label.includes('relationship-management') || label.includes('relationshipmanagement') ||
        label.includes('social-skills') || label.includes('socialskills') ||
        label.includes('interpersonal-skills') || label.includes('interpersonalskills')) {
      return 'Relationship Management';
    }
    
    return null;
  }
  
  private generateRecommendations(level: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${level} level`];
  }

  // 更新getStandardLevel方法
  private getStandardLevel(percentage: number): EQLevel {
    if (percentage >= 80) {
      return 'Excellent';
    }
    if (percentage >= 60) {
      return 'Very Good';
    }
    if (percentage >= 40) {
      return 'Good';
    }
    if (percentage >= 20) {
      return 'Average';
    }
    return 'Needs Improvement';
  }

  // 添加getLevelName方法 (大约在类末尾)
  private getLevelName(level: EQLevel): string {
    switch (level) {
      case 'Needs Improvement': return 'Developing Emotional Intelligence';
      case 'Average': return 'Building Emotional Awareness';
      case 'Good': return 'Emotionally Engaged Learner';
      case 'Very Good': return 'Emotionally Intelligent Individual';
      case 'Excellent': return 'Emotionally Masterful Leader';
      default: return 'Unknown';
    }
  }

  private isReverseQuestion(_questionId: string): boolean {
    // 根据题目ID判断是否为反向计分题目
    // 这里可以根据实际的题目设计来调整
    return false; // 暂时假设没有反向计分题目
  }

  private generateDimensionDescription(name: string, level: string, percentage: number): string {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      'Self-Awareness': {
        'Needs Improvement': 'You may struggle to recognize and understand your own emotions, which can impact your decision-making and relationships.',
        'Average': 'You have a basic understanding of your emotions but may sometimes miss subtle emotional cues or patterns.',
        'Good': 'You demonstrate good self-awareness, recognizing your emotions and their impact on your thoughts and behaviors.',
        'Very Good': 'You have strong self-awareness, consistently recognizing your emotions and understanding their influence on your actions.',
        'Excellent': 'You possess exceptional self-awareness, with deep insight into your emotional patterns and their impact on your life.'
      },
      'Self-Management': {
        'Needs Improvement': 'You may find it challenging to regulate your emotions and impulses, which can affect your relationships and goals.',
        'Average': 'You have some ability to manage your emotions but may struggle in stressful or challenging situations.',
        'Good': 'You demonstrate good emotional regulation and can manage your impulses effectively in most situations.',
        'Very Good': 'You have strong self-management skills, consistently regulating your emotions and maintaining composure.',
        'Excellent': 'You excel at self-management, demonstrating exceptional emotional control and adaptability in all situations.'
      },
      'Social Awareness': {
        'Needs Improvement': 'You may struggle to read social cues and understand others\' emotions, which can impact your relationships.',
        'Average': 'You have some ability to understand others\' emotions but may miss subtle social signals or context.',
        'Good': 'You demonstrate good social awareness, understanding others\' emotions and social dynamics.',
        'Very Good': 'You have strong social awareness, consistently reading social cues and understanding group dynamics.',
        'Excellent': 'You possess exceptional social awareness, with deep insight into others\' emotions and social situations.'
      },
      'Relationship Management': {
        'Needs Improvement': 'You may struggle to build and maintain healthy relationships, which can impact your personal and professional life.',
        'Average': 'You have some relationship skills but may find it challenging to navigate complex social situations.',
        'Good': 'You demonstrate good relationship management skills and can build positive connections with others.',
        'Very Good': 'You have strong relationship management abilities, consistently building and maintaining healthy relationships.',
        'Excellent': 'You excel at relationship management, creating deep, meaningful connections and inspiring others.'
      }
    };

    return descriptions[name]?.[level] || `Your ${name} skills are at a ${level} level (${Math.round(percentage)}%).`;
  }

  private generateDimensionStrengths(name: string, level: string, _percentage: number): string[] {
    const strengths: { [key: string]: { [key: string]: string[] } } = {
      'Self-Awareness': {
        'Needs Improvement': ['Willingness to learn about emotions', 'Openness to self-reflection'],
        'Average': ['Basic emotional recognition', 'Some self-reflection skills'],
        'Good': ['Good emotional awareness', 'Regular self-reflection', 'Understanding of emotional patterns'],
        'Very Good': ['Strong emotional insight', 'Consistent self-awareness', 'Clear understanding of strengths and weaknesses'],
        'Excellent': ['Exceptional emotional insight', 'Deep self-understanding', 'Mastery of emotional patterns', 'Inspiring self-awareness']
      },
      'Self-Management': {
        'Needs Improvement': ['Willingness to improve', 'Basic impulse control'],
        'Average': ['Some emotional regulation', 'Basic stress management'],
        'Good': ['Good emotional control', 'Effective stress management', 'Adaptability'],
        'Very Good': ['Strong emotional regulation', 'Excellent stress management', 'High adaptability'],
        'Excellent': ['Exceptional emotional control', 'Masterful stress management', 'Outstanding adaptability', 'Inspiring composure']
      },
      'Social Awareness': {
        'Needs Improvement': ['Willingness to understand others', 'Basic empathy'],
        'Average': ['Some empathy', 'Basic social understanding'],
        'Good': ['Good empathy', 'Understanding of social dynamics', 'Cultural awareness'],
        'Very Good': ['Strong empathy', 'Excellent social understanding', 'High cultural sensitivity'],
        'Excellent': ['Exceptional empathy', 'Masterful social awareness', 'Outstanding cultural sensitivity', 'Inspiring social insight']
      },
      'Relationship Management': {
        'Needs Improvement': ['Willingness to connect', 'Basic communication skills'],
        'Average': ['Some communication skills', 'Basic relationship building'],
        'Good': ['Good communication', 'Effective relationship building', 'Conflict resolution skills'],
        'Very Good': ['Strong communication', 'Excellent relationship skills', 'Advanced conflict resolution'],
        'Excellent': ['Exceptional communication', 'Masterful relationship building', 'Outstanding leadership', 'Inspiring others']
      }
    };

    return strengths[name]?.[level] || [`Your ${name} skills show potential for growth`];
  }
}