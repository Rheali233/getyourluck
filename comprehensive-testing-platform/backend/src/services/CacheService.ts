/**
 * KV缓存服务
 * 负责管理Cloudflare KV存储，优化API响应性能
 */

export interface CacheOptions {
  ttl?: number; // 缓存生存时间（秒）
  namespace?: string; // 命名空间
  compress?: boolean; // 是否压缩
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

export class CacheService {
  private kv: KVNamespace | null;
  private defaultTTL: number;
  private version: string;

  constructor(kv: KVNamespace | null, defaultTTL: number = 3600) {
    this.kv = kv;
    this.defaultTTL = defaultTTL;
    this.version = '1.0.0';
  }

  /**
   * 生成缓存键
   */
  private generateKey(key: string, namespace?: string): string {
    const prefix = namespace || 'default';
    return `${prefix}:${key}`;
  }

  /**
   * 设置缓存
   */
  async set<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回true（跳过缓存）
        return true;
      }
      
      const cacheKey = this.generateKey(key, options.namespace);
      const ttl = options.ttl || this.defaultTTL;
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version: this.version
      };

      const serialized = JSON.stringify(entry);
      await this.kv.put(cacheKey, serialized, { expirationTtl: ttl });
      
      return true;
    } catch (error) {
      console.error('Failed to set cache:', error);
      return false;
    }
  }

  /**
   * 获取缓存
   */
  async get<T>(key: string, namespace?: string): Promise<T | null> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回null（跳过缓存）
        return null;
      }
      
      const cacheKey = this.generateKey(key, namespace);
      const cached = await this.kv.get(cacheKey);
      
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // 检查缓存是否过期
      const now = Date.now();
      const isExpired = (now - entry.timestamp) > (entry.ttl * 1000);
      
      if (isExpired) {
        // 删除过期缓存
        await this.delete(key, namespace);
        return null;
      }

      // 检查版本兼容性
      if (entry.version !== this.version) {
        await this.delete(key, namespace);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  }

  /**
   * 删除缓存
   */
  async delete(key: string, namespace?: string): Promise<boolean> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回true（跳过缓存）
        return true;
      }
      
      const cacheKey = this.generateKey(key, namespace);
      await this.kv.delete(cacheKey);
      return true;
    } catch (error) {
      console.error('Failed to delete cache:', error);
      return false;
    }
  }

  /**
   * 批量删除缓存
   */
  async deleteMultiple(keys: string[], namespace?: string): Promise<boolean> {
    try {
      const promises = keys.map(key => this.delete(key, namespace));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Failed to delete multiple cache entries:', error);
      return false;
    }
  }

  /**
   * 清空命名空间下的所有缓存
   */
  async clearNamespace(_namespace: string): Promise<boolean> {
    try {
      // 注意：Cloudflare KV不支持直接清空命名空间
      // 这里需要维护一个键列表或使用其他策略
      console.warn('Clearing namespace not directly supported in Cloudflare KV');
      return true;
    } catch (error) {
      console.error('Failed to clear namespace:', error);
      return false;
    }
  }

  /**
   * 检查缓存是否存在
   */
  async exists(key: string, namespace?: string): Promise<boolean> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回false（跳过缓存）
        return false;
      }
      
      const cacheKey = this.generateKey(key, namespace);
      const cached = await this.kv.get(cacheKey);
      return cached !== null;
    } catch (error) {
      console.error('Failed to check cache existence:', error);
      return false;
    }
  }

  /**
   * 获取缓存统计信息
   */
  async getStats(): Promise<{
    totalKeys: number;
    totalSize: number;
    namespaces: Record<string, number>;
  }> {
    try {
      // 注意：Cloudflare KV不提供直接的统计API
      // 这里返回模拟数据
      return {
        totalKeys: 0,
        totalSize: 0,
        namespaces: {}
      };
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return {
        totalKeys: 0,
        totalSize: 0,
        namespaces: {}
      };
    }
  }

  /**
   * 设置缓存（带压缩）
   */
  async setCompressed<T>(
    key: string, 
    data: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    if (!options.compress) {
      return this.set(key, data, options);
    }

    try {
      if (!this.kv) {
        // 如果没有KV，直接返回true（跳过缓存）
        return true;
      }
      
      const cacheKey = this.generateKey(key, options.namespace);
      const ttl = options.ttl || this.defaultTTL;
      
      // 简单的压缩：移除空格和换行
      const compressedData = JSON.stringify(data).replace(/\s+/g, '');
      
      const entry: CacheEntry<T> = {
        data: compressedData as any,
        timestamp: Date.now(),
        ttl,
        version: this.version
      };

      const serialized = JSON.stringify(entry);
      await this.kv.put(cacheKey, serialized, { expirationTtl: ttl });
      
      return true;
    } catch (error) {
      console.error('Failed to set compressed cache:', error);
      return false;
    }
  }

  /**
   * 获取压缩的缓存
   */
  async getCompressed<T>(key: string, namespace?: string): Promise<T | null> {
    try {
      const cached = await this.get<T>(key, namespace);
      if (!cached) return null;

      // 如果是压缩数据，尝试解压
      if (typeof cached === 'string') {
        try {
          return JSON.parse(cached);
        } catch {
          return cached as T;
        }
      }

      return cached;
    } catch (error) {
      console.error('Failed to get compressed cache:', error);
      return null;
    }
  }

  /**
   * 设置缓存（带标签）
   */
  async setWithTags<T>(
    key: string, 
    data: T, 
    tags: string[], 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回true（跳过缓存）
        return true;
      }
      
      const cacheKey = this.generateKey(key, options.namespace);
      const ttl = options.ttl || this.defaultTTL;
      
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        version: this.version
      };

      const serialized = JSON.stringify(entry);
      
      // 存储主数据
      await this.kv.put(cacheKey, serialized, { expirationTtl: ttl });
      
      // 存储标签索引
      for (const tag of tags) {
        const tagKey = `tag:${tag}:${key}`;
        await this.kv.put(tagKey, '1', { expirationTtl: ttl });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to set cache with tags:', error);
      return false;
    }
  }

  /**
   * 根据标签删除缓存
   */
  async deleteByTag(_tag: string, _namespace?: string): Promise<boolean> {
    try {
      // 注意：Cloudflare KV不支持复杂的标签查询
      // 这里需要维护一个标签索引
      console.warn('Tag-based deletion not fully supported in Cloudflare KV');
      return true;
    } catch (error) {
      console.error('Failed to delete cache by tag:', error);
      return false;
    }
  }

  /**
   * 获取缓存键列表
   */
  async listKeys(prefix?: string, namespace?: string): Promise<string[]> {
    try {
      if (!this.kv) {
        // 如果没有KV，直接返回空数组（跳过缓存）
        return [];
      }
      
      const cachePrefix = this.generateKey(prefix || '', namespace);
      const list = await this.kv.list({ prefix: cachePrefix });
      return list.keys.map(key => key.name);
    } catch (error) {
      console.error('Failed to list cache keys:', error);
      return [];
    }
  }

  /**
   * 预热缓存
   */
  async warmup<T>(
    key: string, 
    dataProvider: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // 先尝试从缓存获取
      const cached = await this.get<T>(key, options.namespace);
      if (cached) return cached;

      // 缓存未命中，从数据源获取
      const data = await dataProvider();
      
      // 存储到缓存
      await this.set(key, data, options);
      
      return data;
    } catch (error) {
      console.error('Failed to warmup cache:', error);
      // 即使缓存失败，也返回数据
      return await dataProvider();
    }
  }
}