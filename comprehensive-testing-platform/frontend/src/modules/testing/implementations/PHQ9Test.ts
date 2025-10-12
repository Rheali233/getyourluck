/**
 * PHQ-9 Test Implementation
 * Simple implementation for testing the system
 */

import { BaseTestFlow } from '../core/TestFlow';
import type { 
  PsychologyTestType, 
  TestAnswer, 
  TestResult
} from '../types/TestTypes';
import { 
  QuestionFormat,
  AnswerType,
  ResultType,
  TestCategory,
  TestStatus
} from '../types/TestTypes';

export interface PHQ9TestType extends PsychologyTestType {
  id: 'phq9';
  name: 'PHQ-9 Depression Screening';
  category: TestCategory.PSYCHOLOGY;
  questionFormat: QuestionFormat.SCALE;
  answerType: AnswerType.NUMBER;
  resultType: ResultType.SCORE;
  totalQuestions: 9;
  estimatedTime: 5;
  description: 'Quick depression screening tool.';
  instructions: 'Rate how often you have been bothered by each problem.';
}

export interface PHQ9ResultData {
  totalScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  interpretation: string;
  recommendations: string[];
}

export class PHQ9Test extends BaseTestFlow<PHQ9TestType> {
  constructor() {
    const testType: PHQ9TestType = {
      id: 'phq9',
      name: 'PHQ-9 Depression Screening',
      category: TestCategory.PSYCHOLOGY,
      questionFormat: QuestionFormat.SCALE,
      answerType: AnswerType.NUMBER,
      resultType: ResultType.SCORE,
      totalQuestions: 9,
      estimatedTime: 5,
      description: 'Quick depression screening tool.',
      instructions: 'Rate how often you have been bothered by each problem.'
    };
    
    super(testType);
  }

  async startTest(): Promise<void> {
    this.createSession();
    this.session!.status = TestStatus.IN_PROGRESS;
  }

  submitAnswer(questionId: string, answer: any): void {
    if (typeof answer === 'number' && answer >= 0 && answer <= 3) {
      const testAnswer: TestAnswer = {
        questionId,
        value: answer,
        timestamp: new Date().toISOString()
      };
      
      this.addAnswer(testAnswer);
    }
  }

  async generateResults(): Promise<TestResult<PHQ9ResultData>> {
    if (!this.session) {
      throw new Error('No active test session');
    }
    
    const answers = this.getAllAnswers();
    const totalScore = answers.reduce((sum, answer) => sum + (answer.value as number), 0);
    
    const severity = this.getSeverityLevel(totalScore);
    const interpretation = this.getInterpretation(totalScore, severity);
    const recommendations = this.getRecommendations(severity);
    
    const resultData: PHQ9ResultData = {
      totalScore,
      severity,
      interpretation,
      recommendations
    };
    
    return {
      testType: 'phq9',
      sessionId: this.session.id,
      timestamp: new Date().toISOString(),
      data: resultData
    };
  }

  private getSeverityLevel(score: number): PHQ9ResultData['severity'] {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    if (score <= 19) return 'moderately_severe';
    return 'severe';
  }

  private getInterpretation(score: number, severity: string): string {
    return `Your PHQ-9 score is ${score}, indicating ${severity} depression symptoms.`;
  }

  private getRecommendations(severity: string): string[] {
    const recommendations = [
      'Consider talking to a mental health professional',
      'Practice self-care and stress management techniques',
      'Maintain regular sleep and exercise routines'
    ];
    
    if (severity === 'moderate' || severity === 'moderately_severe' || severity === 'severe') {
      recommendations.unshift('Seek professional help as soon as possible');
    }
    
    return recommendations;
  }

  async analyzeResults(): Promise<any> {
    return this.generateResults();
  }
}
