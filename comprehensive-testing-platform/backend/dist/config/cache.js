// KV存储和缓存策略优化配置
// 生产环境缓存配置
export const productionCacheConfig = {
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
export const stagingCacheConfig = {
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
export const developmentCacheConfig = {
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
export function getCacheConfig(environment) {
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
    static SEPARATOR = ':';
    static VERSION = 'v1';
    /**
     * 生成缓存键
     */
    static generate(partition, type, identifier, params) {
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
    static generatePattern(partition, type) {
        return `${this.VERSION}:${partition}:${type}:*`;
    }
    /**
     * 解析缓存键
     */
    static parse(key) {
        const parts = key.split(this.SEPARATOR);
        if (parts.length < 4) {
            throw new Error('Invalid cache key format');
        }
        const [version, partition, type, identifier, ...paramParts] = parts;
        let params;
        if (paramParts.length > 0) {
            params = {};
            paramParts[0].split(',').forEach(param => {
                const [key, value] = param.split('=');
                params[key] = value;
            });
        }
        return {
            version,
            partition,
            type,
            identifier,
            params
        };
    }
}
//# sourceMappingURL=cache.js.map