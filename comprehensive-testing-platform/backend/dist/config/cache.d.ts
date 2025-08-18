export interface CacheConfig {
    enabled: boolean;
    ttl: number;
    maxEntries: number;
    strategy: 'lru' | 'fifo' | 'ttl';
    prefetch: {
        enabled: boolean;
        threshold: number;
        batchSize: number;
    };
    partitions: {
        homepage: CachePartitionConfig;
        search: CachePartitionConfig;
        user: CachePartitionConfig;
        analytics: CachePartitionConfig;
    };
    compression: {
        enabled: boolean;
        algorithm: 'gzip' | 'brotli' | 'deflate';
        threshold: number;
    };
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
export declare const productionCacheConfig: CacheConfig;
export declare const stagingCacheConfig: CacheConfig;
export declare const developmentCacheConfig: CacheConfig;
export declare function getCacheConfig(environment: string): CacheConfig;
export declare class CacheKeyGenerator {
    private static readonly SEPARATOR;
    private static readonly VERSION;
    /**
     * 生成缓存键
     */
    static generate(partition: string, type: string, identifier: string, params?: Record<string, any>): string;
    /**
     * 生成模式匹配键
     */
    static generatePattern(partition: string, type: string): string;
    /**
     * 解析缓存键
     */
    static parse(key: string): {
        version: string;
        partition: string;
        type: string;
        identifier: string;
        params?: Record<string, any>;
    };
}
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
export interface CacheMetrics {
    responseTime: number;
    throughput: number;
    memoryUsage: number;
    errorRate: number;
    timestamp: string;
}
//# sourceMappingURL=cache.d.ts.map