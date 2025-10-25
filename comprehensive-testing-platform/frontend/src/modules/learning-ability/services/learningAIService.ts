/**
 * Learning Ability Test AI Analysis Service
 * Uses backend AI proxy for secure analysis
 */

import type { 
  VarkResult, 
  UserAnswer 
} from '../types';

export interface AIAnalysisRequest {
  testType: 'vark';
  answers: UserAnswer[];
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: VarkResult;
  error?: string;
}

export class LearningAIService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/ai/learning';
  }

  /**
   * Analyze VARK learning style test results
   */
  async analyzeVARK(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/vark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          context: { testType: 'vark', language: 'en' }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  

  // cognitive removed

  /**
   * Generic analysis method that routes to appropriate test type
   */
  async analyzeTest(testType: 'vark', answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    switch (testType) {
      case 'vark':
        return this.analyzeVARK(answers);
      default:
        return {
          success: false,
          error: 'Unsupported test type'
        };
    }
  }
}

// Export singleton instance
export const learningAIService = new LearningAIService();
