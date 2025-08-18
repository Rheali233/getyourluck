/**
 * 数据库查询优化服务
 * 负责优化D1数据库查询性能和索引管理
 */
export interface QueryPlan {
    query: string;
    executionTime: number;
    rowCount: number;
    indexUsage: string[];
    optimization: string[];
}
export interface IndexInfo {
    tableName: string;
    indexName: string;
    columns: string[];
    isUnique: boolean;
    cardinality: number;
}
export declare class DatabaseOptimizer {
    private db;
    constructor(db: D1Database);
    /**
     * 分析查询执行计划
     */
    analyzeQuery(query: string, params?: any[]): Promise<QueryPlan>;
    /**
     * 分析查询结构
     */
    private analyzeQueryStructure;
    /**
     * 获取表索引信息
     */
    getTableIndexes(tableName: string): Promise<IndexInfo[]>;
    /**
     * 提取索引列信息
     */
    private extractIndexColumns;
    /**
     * 创建索引
     */
    createIndex(tableName: string, indexName: string, columns: string[], isUnique?: boolean): Promise<boolean>;
    /**
     * 删除索引
     */
    dropIndex(indexName: string): Promise<boolean>;
    /**
     * 分析表性能
     */
    analyzeTable(tableName: string): Promise<{
        rowCount: number;
        tableSize: number;
        indexes: IndexInfo[];
        recommendations: string[];
    }>;
    /**
     * 生成表优化建议
     */
    private generateTableRecommendations;
    /**
     * 优化查询
     */
    optimizeQuery(originalQuery: string, params?: any[]): Promise<{
        optimizedQuery: string;
        explanation: string[];
        estimatedImprovement: number;
    }>;
    /**
     * 批量查询优化
     */
    batchOptimize(queries: string[]): Promise<{
        totalOptimizations: number;
        totalEstimatedImprovement: number;
        queryOptimizations: Array<{
            query: string;
            optimizations: string[];
            estimatedImprovement: number;
        }>;
    }>;
    /**
     * 获取数据库统计信息
     */
    getDatabaseStats(): Promise<{
        totalTables: number;
        totalIndexes: number;
        totalSize: number;
        optimizationScore: number;
    }>;
}
//# sourceMappingURL=DatabaseOptimizer.d.ts.map