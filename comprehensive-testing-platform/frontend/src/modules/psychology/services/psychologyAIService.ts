/**
 * Psychological Test AI Analysis Service
 * Uses backend AI proxy for secure analysis
 */

import type { 
  MBTIResult, 
  PHQ9Result, 
  EQResult, 
  HappinessResult,
  UserAnswer 
} from '../types';

export interface AIAnalysisRequest {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  answers: UserAnswer[];
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: MBTIResult | PHQ9Result | EQResult | HappinessResult;
  error?: string;
}

export class PsychologyAIService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/ai/psychology';
  }

  /**
   * Analyze MBTI test results
   */
  async analyzeMBTI(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/mbti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          context: { testType: 'mbti', language: 'en' }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return {
        success: false,
        error: result.error || 'MBTI analysis failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze PHQ-9 test results
   */
  async analyzePHQ9(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/phq9`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          context: { testType: 'phq9', language: 'en' }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return {
        success: false,
        error: result.error || 'PHQ-9 analysis failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze emotional intelligence test results
   */
  async analyzeEQ(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/eq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          context: { testType: 'eq', language: 'en' }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return {
        success: false,
        error: result.error || 'EQ analysis failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze happiness index test results
   */
  async analyzeHappiness(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/happiness`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          context: { testType: 'happiness', language: 'en' }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: result.data
        };
      }
      
      return {
        success: false,
        error: result.error || 'Happiness index analysis failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Create service instance
export const psychologyAIService = new PsychologyAIService();
