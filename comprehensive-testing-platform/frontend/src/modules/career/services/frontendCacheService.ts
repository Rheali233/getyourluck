/**
 * Career Module Frontend Cache Service
 * Manages frontend local cache for career module to improve user experience and performance
 */

export interface CacheOptions {
  ttl?: number; // Cache time-to-live (milliseconds)
  namespace?: string; // Namespace
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CareerFrontendCacheService {
  private defaultTTL: number;
  private storage: Storage;

  constructor(defaultTTL: number = 3600000) { // Default 1 hour
    this.defaultTTL = defaultTTL;
    this.storage = localStorage; // Use localStorage as storage
  }

  /**
   * Generate cache key
   */
  private generateKey(key: string, namespace?: string): string {
    const prefix = namespace || 'career';
    return `${prefix}:${key}`;
  }

  /**
   * Set cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): boolean {
    try {
      const cacheKey = this.generateKey(key, options.namespace);
      const ttl = options.ttl || this.defaultTTL;
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };

      const serialized = JSON.stringify(entry);
      this.storage.setItem(cacheKey, serialized);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get cache
   */
  get<T>(key: string, namespace?: string): T | null {
    try {
      const cacheKey = this.generateKey(key, namespace);
      const cached = this.storage.getItem(cacheKey);
      
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if cache expired
      const now = Date.now();
      const isExpired = (now - entry.timestamp) > entry.ttl;
      
      if (isExpired) {
        // Delete expired cache
        this.delete(key, namespace);
        return null;
      }

      return entry.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete cache
   */
  delete(key: string, namespace?: string): boolean {
    try {
      const cacheKey = this.generateKey(key, namespace);
      this.storage.removeItem(cacheKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all cache in namespace
   */
  clearNamespace(namespace: string): boolean {
    try {
      const prefix = this.generateKey('', namespace);
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => this.storage.removeItem(key));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if cache exists and valid
   */
  has(key: string, namespace?: string): boolean {
    return this.get(key, namespace) !== null;
  }

  /**
   * Get cache statistics
   */
  getStats(): { totalKeys: number; totalSize: number } {
    try {
      let totalSize = 0;
      const totalKeys = this.storage.length;
      
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key) {
          const value = this.storage.getItem(key);
          if (value) {
            totalSize += value.length;
          }
        }
      }
      
      return { totalKeys, totalSize };
    } catch (error) {
      return { totalKeys: 0, totalSize: 0 };
    }
  }
}

// Create default instance
export const frontendCacheService = new CareerFrontendCacheService();
