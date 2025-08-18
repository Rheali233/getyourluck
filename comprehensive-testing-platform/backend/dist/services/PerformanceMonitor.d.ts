/**
 * 性能监控服务
 * 负责监控API性能、数据库查询和系统资源使用情况
 */
export interface PerformanceMetrics {
    requestId: string;
    timestamp: string;
    url: string;
    method: string;
    statusCode: number;
    responseTime: number;
    memoryUsage: number;
    cpuUsage?: number;
    databaseQueries: DatabaseQueryMetrics[];
    externalCalls: ExternalCallMetrics[];
    errors: ErrorMetrics[];
}
export interface DatabaseQueryMetrics {
    query: string;
    executionTime: number;
    rowCount: number;
    tableName?: string;
    indexUsed?: string;
}
export interface ExternalCallMetrics {
    url: string;
    method: string;
    responseTime: number;
    statusCode: number;
    success: boolean;
}
export interface ErrorMetrics {
    type: string;
    message: string;
    stack?: string;
    timestamp: string;
}
export interface SystemHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    checks: HealthCheck[];
    overallScore: number;
}
export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    responseTime: number;
    message?: string;
    details?: any;
}
export declare class PerformanceMonitor {
    private metrics;
    private maxMetrics;
    private healthChecks;
    constructor();
    /**
     * 记录请求性能指标
     */
    recordRequestMetrics(metrics: Omit<PerformanceMetrics, 'timestamp'>): void;
    /**
     * 记录数据库查询性能
     */
    recordDatabaseQuery(requestId: string, query: string, executionTime: number, rowCount: number, tableName?: string, indexUsed?: string): void;
    /**
     * 记录外部调用性能
     */
    recordExternalCall(requestId: string, url: string, method: string, responseTime: number, statusCode: number, success: boolean): void;
    /**
     * 记录错误
     */
    recordError(requestId: string, type: string, message: string, stack?: string): void;
    /**
     * 获取性能统计
     */
    getPerformanceStats(timeRange?: number): {
        totalRequests: number;
        averageResponseTime: number;
        errorRate: number;
        slowRequests: number;
        topSlowEndpoints: Array<{
            url: string;
            avgTime: number;
            count: number;
        }>;
    };
    /**
     * 添加健康检查
     */
    addHealthCheck(name: string, checkFn: () => Promise<HealthCheck>): void;
    /**
     * 执行健康检查
     */
    performHealthCheck(): Promise<SystemHealth>;
    /**
     * 检查性能阈值
     */
    private checkPerformanceThresholds;
    /**
     * 清理旧指标
     */
    private cleanupOldMetrics;
    /**
     * 导出性能数据
     */
    exportMetrics(): PerformanceMetrics[];
    /**
     * 重置监控数据
     */
    reset(): void;
}
export declare const performanceMonitor: PerformanceMonitor;
//# sourceMappingURL=PerformanceMonitor.d.ts.map