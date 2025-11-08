/**
 * Leadership领导力测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class LeadershipResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'leadership'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length === 0) {
      return false
    }
    
    // 验证答案格式 (1-5分制) - 支持数字和字符串格式
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false;
      }
      
      const value = answer.value
      if (typeof value === 'number') {
        return value >= 1 && value <= 5
      }
      
      if (typeof value === 'string') {
        const numValue = parseInt(value, 10)
        return !isNaN(numValue) && numValue >= 1 && numValue <= 5
      }
      
      return false
    })
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid Leadership answers format')
    }
    
    // 处理答案值，支持字符串和数字格式
    const processedAnswers = answers.map(answer => ({
      ...answer,
      value: typeof answer.value === 'string' ? parseInt(answer.value, 10) : answer.value
    }))
    
    const totalScore = processedAnswers.reduce((sum, answer) => sum + answer.value, 0)
    const maxScore = processedAnswers.length * 5
    const percentage = (totalScore / maxScore) * 100
    const level = this.calculateLevel(percentage)
    
    const dimensionScores = this.calculateDimensionScores(processedAnswers)
    
    // 基础结果
    const baseResult = {
      overallScore: totalScore,
      maxScore: maxScore,
      leadershipLevel: level,
      leadershipDimensions: this.generateLeadershipDimensions(dimensionScores),
      strengths: this.identifyStrengths(dimensionScores),
      leadershipChallenges: this.identifyDevelopmentAreas(dimensionScores),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'LeadershipResultProcessor'
      }
    };

    // 必须有AI分析结果，否则抛出错误
    if (!aiAnalysis) {
      throw new Error('AI analysis is required for Leadership test. Please ensure AI service is available and try again.');
    }

    // 使用AI分析结果
    return {
      ...baseResult,
      ...aiAnalysis,
      // 确保基础字段不被覆盖
      overallScore: baseResult.overallScore,
      maxScore: baseResult.maxScore,
      leadershipLevel: baseResult.leadershipLevel,
      leadershipDimensions: baseResult.leadershipDimensions,
      strengths: baseResult.strengths,
      leadershipChallenges: baseResult.leadershipChallenges
    };
  }
  
  private calculateLevel(percentage: number): string {
    if (percentage >= 80) {
      return 'excellent';
    }
    if (percentage >= 60) {
      return 'good';
    }
    if (percentage >= 40) {
      return 'average';
    }
    return 'needs_improvement';
  }
  
  private calculateDimensionScores(answers: any[]): Record<string, { score: number, maxScore: number, percentage: number }> {
    const dimensions = ['Vision', 'Communication', 'Decision Making', 'Team Building', 'Motivation', 'Adaptability']
    const dimensionScores: Record<string, { score: number, maxScore: number, percentage: number }> = {}
    
    dimensions.forEach((dimension, index) => {
      const startIndex = index * 3 // 假设每个维度3个问题
      const endIndex = Math.min(startIndex + 3, answers.length)
      const dimensionAnswers = answers.slice(startIndex, endIndex)
      
      const score = dimensionAnswers.reduce((sum, answer) => sum + answer.value, 0)
      const maxScore = dimensionAnswers.length * 5
      const percentage = (score / maxScore) * 100
      
      dimensionScores[dimension] = {
        score,
        maxScore,
        percentage: Math.round(percentage * 100) / 100
      }
    })
    
    return dimensionScores
  }
  
  
  private generateRecommendations(level: string): string[] {
    const recommendations = [
      "Continue developing your leadership skills through ongoing learning",
      "Seek feedback from colleagues and team members regularly",
      "Practice leadership in various contexts to build experience"
    ];

    if (level === 'needs_improvement') {
      recommendations.push("Consider working with a leadership coach or mentor");
      recommendations.push("Focus on building confidence in decision-making");
    } else if (level === 'excellent') {
      recommendations.push("Share your leadership expertise by mentoring others");
      recommendations.push("Take on more complex leadership challenges");
    }

    return recommendations;
  }
  
  private identifyStrengths(dimensionScores: Record<string, any>): string[] {
    return Object.entries(dimensionScores)
      .map(([dimension]) => dimension)
  }
  
  private identifyDevelopmentAreas(dimensionScores: Record<string, any>): string[] {
    return Object.entries(dimensionScores)
      .map(([dimension]) => dimension)
  }

  private generateDetailedAnalysis(level: string, percentage: number, dimensionScores: Record<string, any>): string {
    const topDimensions = Object.entries(dimensionScores)
      .sort(([, a], [, b]) => b.percentage - a.percentage)
      .slice(0, 3)
      .map(([name]) => name);

    return `Based on your leadership assessment, you demonstrate ${level} level leadership capabilities with a score of ${Math.round(percentage)}%. Your strongest areas include ${topDimensions.join(', ')}. This analysis provides insights into your leadership style, strengths, and areas for development.`;
  }

  private generateLeadershipDimensions(dimensionScores: Record<string, any>): any[] {
    return Object.entries(dimensionScores).map(([name, data]) => ({
      name,
      level: this.getLevelDescription(data.percentage),
      description: this.getDimensionDescription(name),
      strengths: this.getStrengthDescriptions(name),
      improvementAreas: this.getImprovementAreas(name)
    }));
  }


  private generateDevelopmentPlan(_level: string, dimensionScores: Record<string, any>): string[] {
    const allAreas = Object.entries(dimensionScores)
      .map(([name]) => name);

    const plans = [
      "Complete a 360-degree feedback assessment to gain comprehensive insights",
      "Engage in leadership coaching or mentoring relationships",
      "Participate in advanced leadership development programs"
    ];

    if (allAreas.length > 0) {
      plans.push(`Focus on continuous development across all leadership dimensions: ${allAreas.join(', ')}`);
    }

    return plans;
  }

  private generateMentoringAdvice(level: string): string[] {
    const advice = [
      "Seek mentors who have successfully navigated similar leadership challenges",
      "Join professional leadership networks and peer learning groups",
      "Regularly reflect on leadership experiences and lessons learned"
    ];

    if (level === 'needs_improvement') {
      advice.push("Consider working with an executive coach for personalized development");
    }

    return advice;
  }

  private generateOrganizationalImpact(level: string): string[] {
    const impacts = [
      "Drive cultural transformation through authentic leadership",
      "Mentor emerging leaders and build succession pipelines",
      "Implement innovative solutions that enhance organizational effectiveness"
    ];

    if (level === 'excellent') {
      impacts.push("Lead strategic initiatives that create lasting organizational value");
    }

    return impacts;
  }

  private getDimensionDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'Vision': 'Ability to create and communicate a compelling future vision',
      'Communication': 'Effectiveness in conveying ideas and listening to others',
      'Decision Making': 'Quality and timeliness of leadership decisions',
      'Team Building': 'Capability to develop and maintain high-performing teams',
      'Motivation': 'Skill in inspiring and energizing team members',
      'Adaptability': 'Flexibility in responding to changing circumstances'
    };
    return descriptions[name] || 'Leadership capability assessment';
  }

  private getLevelDescription(percentage: number): string {
    if (percentage >= 90) {
      return 'Exceptional';
    } else if (percentage >= 80) {
      return 'High';
    } else if (percentage >= 70) {
      return 'Good';
    } else if (percentage >= 60) {
      return 'Moderate';
    } else if (percentage >= 50) {
      return 'Developing';
    } else {
      return 'Needs Improvement';
    }
  }

  private getImprovementAreas(name: string): string[] {
    const areas: Record<string, string[]> = {
      'Vision': [
        'Develop strategic thinking and long-term planning skills',
        'Enhance ability to communicate complex visions clearly',
        'Build skills in scenario planning and future trend analysis'
      ],
      'Communication': [
        'Enhance active listening and clear messaging techniques',
        'Develop skills in difficult conversations and conflict resolution',
        'Improve presentation and public speaking abilities'
      ],
      'Decision Making': [
        'Implement structured decision-making processes',
        'Develop skills in data-driven decision making',
        'Build confidence in making quick decisions under pressure'
      ],
      'Team Building': [
        'Focus on team development and individual coaching',
        'Learn techniques for building diverse and inclusive teams',
        'Develop skills in team conflict resolution and mediation'
      ],
      'Motivation': [
        'Learn motivation techniques and recognition strategies',
        'Develop skills in understanding individual team member needs',
        'Build expertise in creating inspiring work environments'
      ],
      'Adaptability': [
        'Build resilience and change management capabilities',
        'Develop skills in leading through uncertainty and ambiguity',
        'Learn techniques for helping teams adapt to new challenges'
      ]
    };
    return areas[name] || ['General leadership development', 'Focus on continuous improvement', 'Build core leadership competencies'];
  }

  private getStrengthDescriptions(name: string): string[] {
    const strengths: Record<string, string[]> = {
      'Vision': [
        'Strong ability to create and communicate compelling future vision',
        'Excellent strategic thinking and long-term planning skills',
        'Natural talent for inspiring others with clear direction'
      ],
      'Communication': [
        'Excellent skills in conveying ideas and active listening',
        'Strong ability to adapt communication style to different audiences',
        'Effective in facilitating productive team discussions'
      ],
      'Decision Making': [
        'Effective decision-making with balanced analysis',
        'Strong ability to gather and evaluate relevant information',
        'Good judgment in weighing risks and opportunities'
      ],
      'Team Building': [
        'Outstanding capability to develop high-performing teams',
        'Natural ability to identify and develop team member potential',
        'Strong skills in creating collaborative and supportive environments'
      ],
      'Motivation': [
        'Exceptional skill in inspiring and energizing team members',
        'Natural ability to recognize and celebrate team achievements',
        'Strong capability to create positive and engaging work culture'
      ],
      'Adaptability': [
        'Strong flexibility in responding to changing circumstances',
        'Excellent ability to remain calm and focused during uncertainty',
        'Natural talent for helping teams navigate through transitions'
      ]
    };
    return strengths[name] || ['Strong leadership capability in this area', 'Demonstrates consistent performance', 'Shows potential for growth'];
  }
}
