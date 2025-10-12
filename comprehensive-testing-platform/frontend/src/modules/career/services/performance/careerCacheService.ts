/**
 * Career Module Cache Service
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
  debug?: boolean; // Enable debug logging
}

export class CareerCacheService {
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
      this.trackCacheAccess(false); // Cache miss
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      this.trackCacheAccess(false); // Cache miss (expired)
      return null;
    }

    this.trackCacheAccess(true); // Cache hit
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
    missRate: number;
  } {
    const totalRequests = this.stats.totalRequests || 0;
    const hits = this.stats.hits || 0;
    const misses = this.stats.misses || 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0,
      missRate: totalRequests > 0 ? misses / totalRequests : 0
    };
  }

  /**
   * Get cache keys
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Check if cache is full
   */
  isFull(): boolean {
    return this.cache.size >= this.config.maxSize;
  }

  /**
   * Get cache entry info
   */
  getEntryInfo(key: string): {
    exists: boolean;
    timestamp?: number;
    expiry?: number;
    age?: number;
    ttl?: number;
  } | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return { exists: false };
    }

    const now = Date.now();
    const age = now - entry.timestamp;
    const ttl = entry.expiry - now;

    return {
      exists: true,
      timestamp: entry.timestamp,
      expiry: entry.expiry,
      age,
      ttl: ttl > 0 ? ttl : 0
    };
  }

  /**
   * Remove oldest entries
   */
  private removeOldestEntries(): void {
    const entries = Array.from(this.cache.entries());
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove 20% of oldest entries
    const removeCount = Math.ceil(this.cache.size * 0.2);
    for (let i = 0; i < removeCount && i < sortedEntries.length; i++) {
      const entry = sortedEntries[i];
      if (entry) {
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
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  // Cache-specific methods for career module
  /**
   * Cache career test questions
   */
  cacheQuestions(testType: string, questions: any[]): void {
    const key = `career_questions_${testType}`;
    this.set(key, questions, 60 * 60 * 1000); // 1 hour TTL
  }

  /**
   * Get cached career test questions
   */
  getCachedQuestions(testType: string): any[] | null {
    const key = `career_questions_${testType}`;
    return this.get(key);
  }

  /**
   * Cache career test results
   */
  cacheResults(sessionId: string, results: any): void {
    const key = `career_results_${sessionId}`;
    this.set(key, results, 24 * 60 * 60 * 1000); // 24 hours TTL
  }

  /**
   * Get cached career test results
   */
  getCachedResults(sessionId: string): any | null {
    const key = `career_results_${sessionId}`;
    return this.get(key);
  }

  /**
   * Cache AI analysis responses
   */
  cacheAIAnalysis(sessionId: string, analysis: any): void {
    const key = `career_ai_analysis_${sessionId}`;
    this.set(key, analysis, 7 * 24 * 60 * 60 * 1000); // 7 days TTL
  }

  /**
   * Get cached AI analysis responses
   */
  getCachedAIAnalysis(sessionId: string): any | null {
    const key = `career_ai_analysis_${sessionId}`;
    return this.get(key);
  }

  /**
   * Clear career-specific cache
   */
  clearCareerCache(): void {
    const careerKeys = this.getKeys().filter(key => key.startsWith('career_'));
    careerKeys.forEach(key => this.cache.delete(key));
  }

  // Performance tracking
  private stats = {
    totalRequests: 0,
    hits: 0,
    misses: 0
  };

  /**
   * Track cache hit/miss
   */
  private trackCacheAccess(hit: boolean): void {
    this.stats.totalRequests++;
    if (hit) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    
    // Log cache performance for debugging
    if (this.config.debug) {
      console.log(`Cache ${hit ? 'hit' : 'miss'}, total: ${this.stats.totalRequests}, hit rate: ${(this.stats.hits / this.stats.totalRequests * 100).toFixed(2)}%`);
    }
  }
}

// Export singleton instance
export const careerCacheService = new CareerCacheService();
