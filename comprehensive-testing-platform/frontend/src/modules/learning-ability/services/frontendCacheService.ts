/**
 * Learning Ability Frontend Cache Service
 * Handles caching of test data and results
 */

import type { VarkResult, RavenResult, CognitiveResult, LearningTestType } from '../types';

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items to cache
}

export class FrontendCacheService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private options: CacheOptions;

  constructor(options: CacheOptions = { ttl: 300000, maxSize: 100 }) { // 5 minutes default TTL
    this.options = options;
  }

  /**
   * Set cache item
   */
  set(key: string, data: any, ttl?: number): void {
    const itemTTL = ttl || this.options.ttl;
    
    // Remove oldest items if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: itemTTL
    });
  }

  /**
   * Get cache item
   */
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Check if cache item exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache item
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Cache test questions
   */
  cacheQuestions(testType: LearningTestType, questions: any[]): void {
    const key = `questions_${testType}`;
    this.set(key, questions);
  }

  /**
   * Get cached test questions
   */
  getCachedQuestions(testType: LearningTestType): any[] | null {
    const key = `questions_${testType}`;
    return this.get(key);
  }

  /**
   * Cache test result
   */
  cacheResult(testType: LearningTestType, sessionId: string, result: VarkResult | RavenResult | CognitiveResult): void {
    const key = `result_${testType}_${sessionId}`;
    this.set(key, result, 3600000); // 1 hour TTL for results
  }

  /**
   * Get cached test result
   */
  getCachedResult(testType: LearningTestType, sessionId: string): VarkResult | RavenResult | CognitiveResult | null {
    const key = `result_${testType}_${sessionId}`;
    return this.get(key);
  }

  /**
   * Cache test history
   */
  cacheTestHistory(history: any[]): void {
    this.set('test_history', history, 1800000); // 30 minutes TTL
  }

  /**
   * Get cached test history
   */
  getCachedTestHistory(): any[] | null {
    return this.get('test_history');
  }

  /**
   * Clean expired items
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const frontendCacheService = new FrontendCacheService();
