/**
 * PHQ-9测试结果处理器
 * 实现TestResultProcessor接口
 */

import { TestResultProcessor } from '../TestResultProcessor'

export class PHQ9ResultProcessor implements TestResultProcessor {
  getTestType(): string {
    return 'phq9'
  }
  
  validateAnswers(answers: any[]): boolean {
    if (!Array.isArray(answers) || answers.length !== 9) {
      return false;
    }
    
    // 验证答案格式 (0-3分制) - 支持字符串和数字类型
    return answers.every(answer => {
      if (!answer || !answer.value) {
        return false;
      }
      
      // 转换为数字进行验证
      const numericValue = Number(answer.value);
      return !isNaN(numericValue) && numericValue >= 0 && numericValue <= 3;
    });
  }
  
  async process(answers: any[], aiAnalysis?: any): Promise<any> {
    if (!this.validateAnswers(answers)) {
      throw new Error('Invalid PHQ-9 answers format');
    }
    
    const totalScore = answers.reduce((sum, answer) => sum + Number(answer.value), 0);
    const severity = this.calculateSeverity(totalScore);
    const riskLevel = this.calculateRiskLevel(totalScore);
    
    // 基础结果
    const baseResult = {
      totalScore,
      severity,
      riskLevel: riskLevel.level,
      riskLevelName: riskLevel.name,
      riskDescription: riskLevel.description,
      individualScores: answers.map((answer, index) => ({
        question: index + 1,
        score: Number(answer.value),
        symptom: this.getSymptomName(index + 1)
      })),
      metadata: {
        totalQuestions: answers.length,
        processingTime: new Date().toISOString(),
        processor: 'PHQ9ResultProcessor'
      }
    };
    
    // 如果有AI分析结果，使用AI分析；否则使用基础分析
    if (aiAnalysis) {
      return {
        ...baseResult,
        ...aiAnalysis,
        // 确保基础字段不被覆盖
        totalScore: baseResult.totalScore,
        severity: baseResult.severity,
        riskLevel: baseResult.riskLevel,
        riskLevelName: baseResult.riskLevelName,
        riskDescription: baseResult.riskDescription,
        individualScores: baseResult.individualScores
      };
    }
    
    // 没有AI分析时，返回基础结果
    return {
      ...baseResult,
      interpretation: this.generateInterpretation(severity, totalScore),
      recommendations: this.generateRecommendations(severity),
      lifestyleInterventions: this.generateLifestyleInterventions(severity),
      followUpAdvice: this.generateFollowUpAdvice(severity),
      physicalAnalysis: this.generatePhysicalAnalysis(severity),
      psychologicalAnalysis: this.generatePsychologicalAnalysis(severity)
    };
  }
  
  private calculateSeverity(totalScore: number): string {
    if (totalScore <= 4) {
      return 'minimal';
    }
    if (totalScore <= 9) {
      return 'mild';
    }
    if (totalScore <= 14) {
      return 'moderate';
    }
    if (totalScore <= 19) {
      return 'moderately_severe';
    }
    return 'severe';
  }
  
  private getSymptomName(questionNumber: number): string {
    const symptoms = [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself',
      'Trouble concentrating on things',
      'Moving or speaking slowly',
      'Thoughts of self-harm'
    ]
    return symptoms[questionNumber - 1] || 'Unknown symptom'
  }
  
  private generateInterpretation(severity: string, _totalScore: number): string {
    // 移除硬编码解释，让AI生成个性化分析
    return `AI analysis will provide detailed interpretation for ${severity} severity level`;
  }
  
  private calculateRiskLevel(totalScore: number): { level: string; name: string; description: string } {
    if (totalScore <= 4) {
      return {
        level: 'low',
        name: 'Minimal Risk',
        description: 'Your responses suggest minimal depressive symptoms. This is a positive sign for your mental well-being.'
      };
    }
    if (totalScore <= 9) {
      return {
        level: 'low',
        name: 'Mild Risk',
        description: 'Your responses indicate mild depressive symptoms. Consider monitoring your mood and implementing self-care strategies.'
      };
    }
    if (totalScore <= 14) {
      return {
        level: 'moderate',
        name: 'Moderate Risk',
        description: 'Your responses suggest moderate depressive symptoms. Professional support may be beneficial.'
      };
    }
    if (totalScore <= 19) {
      return {
        level: 'high',
        name: 'Moderately Severe Risk',
        description: 'Your responses indicate moderately severe depressive symptoms. Professional help is recommended.'
      };
    }
    return {
      level: 'high',
      name: 'Severe Risk',
      description: 'Your responses suggest severe depressive symptoms. Please seek professional help immediately.'
    };
  }

  private generateLifestyleInterventions(severity: string): any {
    const interventions = {
      sleepHygiene: 'Maintain a consistent sleep schedule and create a relaxing bedtime routine.',
      physicalActivity: 'Engage in regular physical activity, even light exercise can help improve mood.',
      nutrition: 'Eat a balanced diet with regular meals and stay hydrated.',
      socialSupport: 'Stay connected with friends and family, and don\'t hesitate to reach out for support.'
    };

    if (severity === 'moderate' || severity === 'moderately_severe' || severity === 'severe') {
      interventions.sleepHygiene = 'Prioritize sleep hygiene and consider consulting a healthcare provider about sleep issues.';
      interventions.physicalActivity = 'Start with gentle activities and gradually increase intensity. Consider professional guidance.';
      interventions.nutrition = 'Focus on nutrient-dense foods and consider consulting a nutritionist.';
      interventions.socialSupport = 'Reach out to mental health professionals and build a strong support network.';
    }

    return interventions;
  }

  private generateFollowUpAdvice(severity: string): string {
    if (severity === 'minimal' || severity === 'mild') {
      return 'Continue monitoring your mood and practice self-care. Consider regular check-ins with yourself about your mental health.';
    }
    if (severity === 'moderate') {
      return 'Consider speaking with a mental health professional. Early intervention can be very effective.';
    }
    return 'Please seek professional help as soon as possible. You don\'t have to face this alone, and there are effective treatments available.';
  }

  private generatePhysicalAnalysis(severity: string): string {
    if (severity === 'minimal') {
      return 'Your physical symptoms appear minimal, which is a positive indicator of your overall well-being.';
    }
    if (severity === 'mild') {
      return 'You may be experiencing some physical manifestations of stress or low mood. Regular exercise and good sleep can help.';
    }
    if (severity === 'moderate') {
      return 'Physical symptoms may be more noticeable. Consider consulting a healthcare provider to rule out other causes.';
    }
    return 'Physical symptoms may be significant. It\'s important to consult with healthcare professionals to address both physical and mental health concerns.';
  }

  private generatePsychologicalAnalysis(severity: string): string {
    if (severity === 'minimal') {
      return 'Your psychological patterns appear healthy with minimal signs of distress.';
    }
    if (severity === 'mild') {
      return 'You may be experiencing some psychological stress. Mindfulness and stress management techniques can be helpful.';
    }
    if (severity === 'moderate') {
      return 'Psychological patterns suggest moderate distress. Professional support can help you develop effective coping strategies.';
    }
    return 'Psychological patterns indicate significant distress. Professional mental health support is strongly recommended to help you work through these challenges.';
  }

  private generateRecommendations(severity: string): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [`AI analysis will provide personalized recommendations for ${severity} severity level`];
  }
}
