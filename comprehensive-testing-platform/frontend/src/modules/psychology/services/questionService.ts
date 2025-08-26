/**
 * Psychological Test Question Service
 * Fetches question data from backend API, replacing frontend hardcoding
 */

import { apiClient } from '@/services/apiClient';
import type { 
  MbtiQuestion, 
  Phq9Question, 
  EqQuestion, 
  HappinessQuestion
} from '../types';

export interface QuestionServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface QuestionsByType {
  mbti: MbtiQuestion[];
  phq9: Phq9Question[];
  eq: EqQuestion[];
  happiness: HappinessQuestion[];
}

export class QuestionService {
  private baseUrl = '/api/psychology/questions';

  /**
   * Get questions for all test types
   */
  async getAllQuestions(): Promise<QuestionServiceResponse<QuestionsByType>> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return {
        success: true,
        data: response.data as QuestionsByType
      };
    } catch (error) {
      console.error('Failed to get questions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get questions'
      };
    }
  }

  /**
   * Get questions for specified test type
   */
  async getQuestionsByType(testType: string, language?: string): Promise<QuestionServiceResponse<MbtiQuestion[] | Phq9Question[] | EqQuestion[] | HappinessQuestion[]>> {
    try {
      const params = new URLSearchParams();
      if (language) {
        params.append('language', language);
      }
      
      const url = `${this.baseUrl}/${testType}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await apiClient.get(url);
      
      return {
        success: true,
        data: response.data as MbtiQuestion[] | Phq9Question[] | EqQuestion[] | HappinessQuestion[]
      };
    } catch (error) {
      console.error(`Failed to get ${testType} questions:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to get ${testType} questions`
      };
    }
  }

  /**
   * Get question category information
   */
  async getQuestionCategories(): Promise<QuestionServiceResponse<any[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/categories`);
      return {
        success: true,
        data: response.data as any[]
      };
    } catch (error) {
      console.error('Failed to get question categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get question categories'
      };
    }
  }

  /**
   * Get question configuration information
   */
  async getQuestionConfigs(testType: string): Promise<QuestionServiceResponse<any[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${testType}/configs`);
      return {
        success: true,
        data: response.data as any[]
      };
    } catch (error) {
      console.error(`Failed to get ${testType} configuration:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to get ${testType} configuration`
      };
    }
  }

  /**
   * Get question version information
   */
  async getQuestionVersions(testType: string): Promise<QuestionServiceResponse<any[]>> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${testType}/versions`);
      return {
        success: true,
        data: response.data as any[]
      };
    } catch (error) {
      console.error(`Failed to get ${testType} version:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to get ${testType} version`
      };
    }
  }
}

// Create service instance
export const questionService = new QuestionService();
