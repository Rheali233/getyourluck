// KV存储和缓存策略优化配置

export interface CacheConfig {
  // 缓存开关
  enabled: boolean;
  
  // 缓存生存时间（秒）
  ttl: number;
  
  // 最大缓存条目数
  maxEntries: number;
  
  // 缓存策略
  strategy: 'lru' | 'fifo' | 'ttl';
  
  // 预取策略
  prefetch: {
    enabled: boolean;
    threshold: number; // 命中率阈值
    batchSize: number; // 批量预取大小
  };
  
  // 缓存分区
  partitions: {
    homepage: CachePartitionConfig;
    search: CachePartitionConfig;
    user: CachePartitionConfig;
    analytics: CachePartitionConfig;
  };
  
  // 压缩设置
  compression: {
    enabled: boolean;
    algorithm: 'gzip' | 'brotli' | 'deflate';
    threshold: number; // 最小压缩大小
  };
  
  // 统计和监控
  monitoring: {
    enabled: boolean;
    metrics: boolean;
    alerts: boolean;
  };
}

export interface CachePartitionConfig {
  ttl: number;
  maxEntries: number;
  priority: 'high' | 'medium' | 'low';
  compression: boolean;
}

// 生产环境缓存配置
export const productionCacheConfig: CacheConfig = {
  enabled: true,
  ttl: 3600, // 1小时
  maxEntries: 10000,
  strategy: 'lru',
  
  prefetch: {
    enabled: true,
    threshold: 0.8, // 80%命中率
    batchSize: 50
  },
  
  partitions: {
    homepage: {
      ttl: 1800, // 30分钟
      maxEntries: 2000,
      priority: 'high',
      compression: true
    },
    search: {
      ttl: 900, // 15分钟
      maxEntries: 5000,
      priority: 'high',
      compression: true
    },
    user: {
      ttl: 7200, // 2小时
      maxEntries: 2000,
      priority: 'medium',
      compression: false
    },
    analytics: {
      ttl: 300, // 5分钟
      maxEntries: 1000,
      priority: 'low',
      compression: true
    }
  },
  
  compression: {
    enabled: true,
    algorithm: 'brotli',
    threshold: 1024 // 1KB
  },
  
  monitoring: {
    enabled: true,
    metrics: true,
    alerts: true
  }
};

// 测试环境缓存配置
export const stagingCacheConfig: CacheConfig = {
  enabled: true,
  ttl: 1800, // 30分钟
  maxEntries: 5000,
  strategy: 'lru',
  
  prefetch: {
    enabled: false,
    threshold: 0.7,
    batchSize: 20
  },
  
  partitions: {
    homepage: {
      ttl: 900,
      maxEntries: 1000,
      priority: 'high',
      compression: true
    },
    search: {
      ttl: 600,
      maxEntries: 2000,
      priority: 'high',
      compression: true
    },
    user: {
      ttl: 3600,
      maxEntries: 1000,
      priority: 'medium',
      compression: false
    },
    analytics: {
      ttl: 180,
      maxEntries: 500,
      priority: 'low',
      compression: true
    }
  },
  
  compression: {
    enabled: true,
    algorithm: 'gzip',
    threshold: 2048
  },
  
  monitoring: {
    enabled: true,
    metrics: true,
    alerts: false
  }
};

// 开发环境缓存配置
export const developmentCacheConfig: CacheConfig = {
  enabled: false,
  ttl: 300, // 5分钟
  maxEntries: 1000,
  strategy: 'fifo',
  
  prefetch: {
    enabled: false,
    threshold: 0.5,
    batchSize: 10
  },
  
  partitions: {
    homepage: {
      ttl: 180,
      maxEntries: 200,
      priority: 'high',
      compression: false
    },
    search: {
      ttl: 120,
      maxEntries: 500,
      priority: 'high',
      compression: false
    },
    user: {
      ttl: 600,
      maxEntries: 200,
      priority: 'medium',
      compression: false
    },
    analytics: {
      ttl: 60,
      maxEntries: 100,
      priority: 'low',
      compression: false
    }
  },
  
  compression: {
    enabled: false,
    algorithm: 'gzip',
    threshold: 4096
  },
  
  monitoring: {
    enabled: false,
    metrics: false,
    alerts: false
  }
};

// 根据环境获取缓存配置
export function getCacheConfig(environment: string): CacheConfig {
  switch (environment) {
    case 'production':
      return productionCacheConfig;
    case 'staging':
      return stagingCacheConfig;
    case 'development':
    default:
      return developmentCacheConfig;
  }
}

// 缓存键生成策略
export class CacheKeyGenerator {
  private static readonly SEPARATOR = ':';
  private static readonly VERSION = 'v1';
  
  /**
   * 生成缓存键
   */
  static generate(partition: string, type: string, identifier: string, params?: Record<string, any>): string {
    const parts = [
      this.VERSION,
      partition,
      type,
      identifier
    ];
    
    if (params && Object.keys(params).length > 0) {
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join(',');
      parts.push(sortedParams);
    }
    
    return parts.join(this.SEPARATOR);
  }
  
  /**
   * 生成模式匹配键
   */
  static generatePattern(partition: string, type: string): string {
    return `${this.VERSION}:${partition}:${type}:*`;
  }
  
  /**
   * 解析缓存键
   */
  static parse(key: string): {
    version: string;
    partition: string;
    type: string;
    identifier: string;
    params?: Record<string, any>;
  } {
    const parts = key.split(this.SEPARATOR);
    
    if (parts.length < 4) {
      throw new Error('Invalid cache key format');
    }
    
    const [version, partition, type, identifier, ...paramParts] = parts;
    
    let params: Record<string, any> | undefined;
    if (paramParts.length > 0) {
      const first = paramParts[0] || '';
      if (first) {
        first.split(',').forEach(part => {
          const [k, v] = part.split('=');
          if (k) {
            if (!params) params = {};
            params[k] = v ?? '';
          }
        });
      }
    }
    
    return {
      version: version || '',
      partition: partition || '',
      type: type || '',
      identifier: identifier || '',
      ...(params && { params })
    };
  }
}

// 缓存统计信息
export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
  avgTtl: number;
  lastReset: string;
}

// 缓存性能指标
export interface CacheMetrics {
  responseTime: number;
  throughput: number;
  memoryUsage: number;
  errorRate: number;
  timestamp: string;
}
