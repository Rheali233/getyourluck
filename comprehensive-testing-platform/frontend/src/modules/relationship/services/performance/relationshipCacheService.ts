/**
 * Relationship Module Cache Service
 * Manages caching for questions, results, and AI responses
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cache entries
  cleanupInterval: number; // Cleanup interval in milliseconds
}

export class RelationshipCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
      maxSize: 100,
      cleanupInterval: 60 * 60 * 1000, // 1 hour
      ...config
    };

    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiry = now + (ttl || this.config.defaultTTL);

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.removeOldestEntries();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiry
    });
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove cache entry
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
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    totalMisses: number;
  } {
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRate = totalRequests > 0 ? this.totalHits / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses
    };
  }

  /**
   * Cache-specific methods for relationship module
   */
  
  /**
   * Cache questions for a test type
   */
  cacheQuestions(testType: string, questions: any[]): void {
    const key = `questions_${testType}`;
    this.set(key, questions, 12 * 60 * 60 * 1000); // 12 hours
  }

  /**
   * Get cached questions for a test type
   */
  getCachedQuestions(testType: string): any[] | null {
    const key = `questions_${testType}`;
    return this.get<any[]>(key);
  }

  /**
   * Cache AI analysis result
   */
  cacheAnalysisResult(sessionId: string, result: any): void {
    const key = `analysis_${sessionId}`;
    this.set(key, result, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  /**
   * Get cached analysis result
   */
  getCachedAnalysisResult(sessionId: string): any | null {
    const key = `analysis_${sessionId}`;
    return this.get<any>(key);
  }

  /**
   * Cache user preferences
   */
  cacheUserPreferences(userId: string, preferences: any): void {
    const key = `preferences_${userId}`;
    this.set(key, preferences, 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  /**
   * Get cached user preferences
   */
  getCachedUserPreferences(userId: string): any | null {
    const key = `preferences_${userId}`;
    return this.get<any>(key);
  }

  // Private properties and methods
  private totalHits = 0;
  private totalMisses = 0;

  /**
   * Remove oldest cache entries
   */
  private removeOldestEntries(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove 20% of oldest entries
    const removeCount = Math.ceil(this.config.maxSize * 0.2);
    for (let i = 0; i < removeCount; i++) {
              const entry = entries[i];
        if (entry && entry[0]) {
          this.cache.delete(entry[0]);
        }
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, this.config.cleanupInterval);
  }

  /**
   * Cleanup expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const relationshipCacheService = new RelationshipCacheService();
