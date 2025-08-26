/**
 * Relationship Module API Service
 * Handles all API calls for relationship tests
 */

import type { 
  LoveLanguageQuestion, 
  LoveStyleQuestion, 
  InterpersonalQuestion,
  TestResult,
  AIAnalysisRequest,
  AIAnalysisResponse 
} from '../types';

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

// API endpoints
const API_ENDPOINTS = {
  questions: '/api/relationship/questions',
  love_style: '/api/relationship/questions/love_style',
  love_language: '/api/relationship/questions/love_language',
  interpersonal: '/api/relationship/questions/interpersonal'
} as const;

// API response interface
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Relationship API Service Class
 */
export class RelationshipAPIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get all relationship test questions
   */
  async getAllQuestions(): Promise<{
    love_style: LoveStyleQuestion[];
    love_language: LoveLanguageQuestion[];
    interpersonal: InterpersonalQuestion[];
  }> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.questions}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch questions');
      }

      return result.data;
    } catch (error) {
      console.error('Failed to fetch all relationship questions:', error);
      throw error;
    }
  }

  /**
   * Get questions for a specific test type
   */
  async getQuestionsByType(testType: 'love_style' | 'love_language' | 'interpersonal'): Promise<any[]> {
    try {
      const endpoint = API_ENDPOINTS[testType];
      const url = `${this.baseURL}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || `Failed to fetch ${testType} questions`);
      }

      return result.data;
    } catch (error) {
      console.error(`Failed to fetch ${testType} questions:`, error);
      throw error;
    }
  }

  /**
   * Get Love Style Assessment questions
   */
  async getLoveStyleQuestions(): Promise<LoveStyleQuestion[]> {
    return this.getQuestionsByType('love_style');
  }

  /**
   * Get Love Language Test questions
   */
  async getLoveLanguageQuestions(): Promise<LoveLanguageQuestion[]> {
    return this.getQuestionsByType('love_language');
  }

  /**
   * Get Interpersonal Skills questions
   */
  async getInterpersonalQuestions(): Promise<InterpersonalQuestion[]> {
    return this.getQuestionsByType('interpersonal');
  }

  /**
   * Submit test for AI analysis
   */
  async submitTestForAnalysis(_testData: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      // This will be implemented when we have the AI analysis endpoint
      // For now, we'll use the existing AI service
      throw new Error('AI analysis endpoint not yet implemented');
    } catch (error) {
      console.error('Failed to submit test for analysis:', error);
      throw error;
    }
  }

  /**
   * Get test results
   */
  async getTestResults(_sessionId: string): Promise<TestResult | null> {
    try {
      // This will be implemented when we have the results endpoint
      // For now, we'll return null
      return null;
    } catch (error) {
      console.error('Failed to get test results:', error);
      return null;
    }
  }

  /**
   * Submit user feedback
   */
  async submitFeedback(_sessionId: string, _feedback: 'like' | 'dislike'): Promise<boolean> {
    try {
      // This will be implemented when we have the feedback endpoint
      // For now, we'll return true
      return true;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const relationshipAPIService = new RelationshipAPIService();

// Export individual functions for convenience
export const {
  getAllQuestions,
  getQuestionsByType,
  getLoveStyleQuestions,
  getLoveLanguageQuestions,
  getInterpersonalQuestions,
  submitTestForAnalysis,
  getTestResults,
  submitFeedback
} = relationshipAPIService;
