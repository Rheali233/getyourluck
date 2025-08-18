/**
 * KV缓存服务
 * 负责管理Cloudflare KV存储，优化API响应性能
 */
export interface CacheOptions {
    ttl?: number;
    namespace?: string;
    compress?: boolean;
}
export interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    ttl: number;
    version: string;
}
export declare class CacheService {
    private kv;
    private defaultTTL;
    private version;
    constructor(kv: KVNamespace, defaultTTL?: number);
    /**
     * 生成缓存键
     */
    private generateKey;
    /**
     * 设置缓存
     */
    set<T>(key: string, data: T, options?: CacheOptions): Promise<boolean>;
    /**
     * 获取缓存
     */
    get<T>(key: string, namespace?: string): Promise<T | null>;
    /**
     * 删除缓存
     */
    delete(key: string, namespace?: string): Promise<boolean>;
    /**
     * 批量删除缓存
     */
    deleteMultiple(keys: string[], namespace?: string): Promise<boolean>;
    /**
     * 清空命名空间下的所有缓存
     */
    clearNamespace(namespace: string): Promise<boolean>;
    /**
     * 检查缓存是否存在
     */
    exists(key: string, namespace?: string): Promise<boolean>;
    /**
     * 获取缓存统计信息
     */
    getStats(): Promise<{
        totalKeys: number;
        totalSize: number;
        namespaces: Record<string, number>;
    }>;
    /**
     * 设置缓存（带压缩）
     */
    setCompressed<T>(key: string, data: T, options?: CacheOptions): Promise<boolean>;
    /**
     * 获取压缩的缓存
     */
    getCompressed<T>(key: string, namespace?: string): Promise<T | null>;
    /**
     * 设置缓存（带标签）
     */
    setWithTags<T>(key: string, data: T, tags: string[], options?: CacheOptions): Promise<boolean>;
    /**
     * 根据标签删除缓存
     */
    deleteByTag(tag: string, namespace?: string): Promise<boolean>;
    /**
     * 获取缓存键列表
     */
    listKeys(prefix?: string, namespace?: string): Promise<string[]>;
    /**
     * 预热缓存
     */
    warmup<T>(key: string, dataProvider: () => Promise<T>, options?: CacheOptions): Promise<T>;
}
//# sourceMappingURL=CacheService.d.ts.map