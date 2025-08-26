/**
 * Question Service
 * Manages question loading and caching for relationship tests
 */

import type { TestType } from '../types';
import { relationshipAPIService } from './relationshipAPIService.js';

export class QuestionService {
  private cache: Map<string, any[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get questions for a specific test type
   */
  async getQuestions(testType: TestType): Promise<any[]> {
    // Check cache first
    if (this.isCacheValid(testType)) {
      return this.cache.get(testType) || [];
    }

    try {
      // TODO: Implement API call to load questions
      const questions = await this.loadQuestionsFromAPI(testType);
      
      // Cache the questions
      this.cache.set(testType, questions);
      this.cacheExpiry.set(testType, Date.now() + this.CACHE_DURATION);
      
      return questions;
    } catch (error) {
      console.error(`Failed to load questions for ${testType}:`, error);
      return [];
    }
  }

  /**
   * Load questions from API
   */
  private async loadQuestionsFromAPI(testType: TestType): Promise<any[]> {
    try {
      let questions;
      switch (testType) {
        case 'love_language':
          questions = await relationshipAPIService.getLoveLanguageQuestions();
          break;
        case 'love_style':
          questions = await relationshipAPIService.getLoveStyleQuestions();
          break;
        case 'interpersonal':
          questions = await relationshipAPIService.getInterpersonalQuestions();
          break;
        default:
          throw new Error(`Unsupported test type: ${testType}`);
      }
      return questions;
    } catch (error) {
      console.error('❌ API call failed:', error);
      throw error;
    }
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(testType: TestType): boolean {
    const expiry = this.cacheExpiry.get(testType);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Clear cache for a specific test type
   */
  clearCache(testType: TestType): void {
    this.cache.delete(testType);
    this.cacheExpiry.delete(testType);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }


}

export const questionService = new QuestionService();
