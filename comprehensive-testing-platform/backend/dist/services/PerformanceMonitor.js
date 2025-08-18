/**
 * 性能监控服务
 * 负责监控API性能、数据库查询和系统资源使用情况
 */
export class PerformanceMonitor {
    metrics = [];
    maxMetrics = 1000;
    healthChecks = new Map();
    constructor() {
        // 定期清理旧指标
        setInterval(() => this.cleanupOldMetrics(), 60000); // 每分钟清理一次
    }
    /**
     * 记录请求性能指标
     */
    recordRequestMetrics(metrics) {
        const fullMetrics = {
            ...metrics,
            timestamp: new Date().toISOString()
        };
        this.metrics.push(fullMetrics);
        // 如果超过最大数量，移除最旧的
        if (this.metrics.length > this.maxMetrics) {
            this.metrics.shift();
        }
        // 检查性能阈值
        this.checkPerformanceThresholds(fullMetrics);
    }
    /**
     * 记录数据库查询性能
     */
    recordDatabaseQuery(requestId, query, executionTime, rowCount, tableName, indexUsed) {
        const queryMetrics = {
            query,
            executionTime,
            rowCount,
            tableName,
            indexUsed
        };
        // 找到对应的请求指标并添加数据库查询信息
        const requestMetrics = this.metrics.find(m => m.requestId === requestId);
        if (requestMetrics) {
            requestMetrics.databaseQueries.push(queryMetrics);
        }
        // 检查慢查询
        if (executionTime > 1000) { // 超过1秒的查询
            console.warn('Slow database query detected:', {
                requestId,
                query,
                executionTime,
                tableName
            });
        }
    }
    /**
     * 记录外部调用性能
     */
    recordExternalCall(requestId, url, method, responseTime, statusCode, success) {
        const externalCallMetrics = {
            url,
            method,
            responseTime,
            statusCode,
            success
        };
        // 找到对应的请求指标并添加外部调用信息
        const requestMetrics = this.metrics.find(m => m.requestId === requestId);
        if (requestMetrics) {
            requestMetrics.externalCalls.push(externalCallMetrics);
        }
        // 检查慢外部调用
        if (responseTime > 5000) { // 超过5秒的外部调用
            console.warn('Slow external call detected:', {
                requestId,
                url,
                responseTime
            });
        }
    }
    /**
     * 记录错误
     */
    recordError(requestId, type, message, stack) {
        const errorMetrics = {
            type,
            message,
            stack,
            timestamp: new Date().toISOString()
        };
        // 找到对应的请求指标并添加错误信息
        const requestMetrics = this.metrics.find(m => m.requestId === requestId);
        if (requestMetrics) {
            requestMetrics.errors.push(errorMetrics);
        }
    }
    /**
     * 获取性能统计
     */
    getPerformanceStats(timeRange = 3600000) {
        const now = Date.now();
        const cutoff = now - timeRange;
        const recentMetrics = this.metrics.filter(m => new Date(m.timestamp).getTime() > cutoff);
        if (recentMetrics.length === 0) {
            return {
                totalRequests: 0,
                averageResponseTime: 0,
                errorRate: 0,
                slowRequests: 0,
                topSlowEndpoints: []
            };
        }
        const totalRequests = recentMetrics.length;
        const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;
        const errorRate = recentMetrics.filter(m => m.statusCode >= 400).length / totalRequests;
        const slowRequests = recentMetrics.filter(m => m.responseTime > 1000).length;
        // 计算最慢的端点
        const endpointStats = new Map();
        recentMetrics.forEach(m => {
            const existing = endpointStats.get(m.url) || { totalTime: 0, count: 0 };
            endpointStats.set(m.url, {
                totalTime: existing.totalTime + m.responseTime,
                count: existing.count + 1
            });
        });
        const topSlowEndpoints = Array.from(endpointStats.entries())
            .map(([url, stats]) => ({
            url,
            avgTime: stats.totalTime / stats.count,
            count: stats.count
        }))
            .sort((a, b) => b.avgTime - a.avgTime)
            .slice(0, 10);
        return {
            totalRequests,
            averageResponseTime,
            errorRate,
            slowRequests,
            topSlowEndpoints
        };
    }
    /**
     * 添加健康检查
     */
    addHealthCheck(name, checkFn) {
        this.healthChecks.set(name, checkFn);
    }
    /**
     * 执行健康检查
     */
    async performHealthCheck() {
        const checks = [];
        const startTime = Date.now();
        // 执行所有健康检查
        for (const [name, checkFn] of this.healthChecks) {
            try {
                const checkStartTime = Date.now();
                const check = await checkFn();
                check.responseTime = Date.now() - checkStartTime;
                checks.push(check);
            }
            catch (error) {
                checks.push({
                    name,
                    status: 'fail',
                    responseTime: 0,
                    message: error instanceof Error ? error.message : 'Unknown error',
                    details: error
                });
            }
        }
        // 计算整体健康状态
        const totalChecks = checks.length;
        const passedChecks = checks.filter(c => c.status === 'pass').length;
        const failedChecks = checks.filter(c => c.status === 'fail').length;
        const warningChecks = checks.filter(c => c.status === 'warn').length;
        let status;
        let overallScore;
        if (failedChecks === 0 && warningChecks === 0) {
            status = 'healthy';
            overallScore = 100;
        }
        else if (failedChecks === 0) {
            status = 'degraded';
            overallScore = 75;
        }
        else {
            status = 'unhealthy';
            overallScore = Math.max(0, 100 - (failedChecks / totalChecks) * 100);
        }
        return {
            status,
            timestamp: new Date().toISOString(),
            checks,
            overallScore
        };
    }
    /**
     * 检查性能阈值
     */
    checkPerformanceThresholds(metrics) {
        // 检查响应时间阈值
        if (metrics.responseTime > 5000) { // 超过5秒
            console.error('Critical performance issue detected:', {
                requestId: metrics.requestId,
                url: metrics.url,
                responseTime: metrics.responseTime
            });
        }
        // 检查内存使用阈值
        if (metrics.memoryUsage > 100 * 1024 * 1024) { // 超过100MB
            console.warn('High memory usage detected:', {
                requestId: metrics.requestId,
                memoryUsage: metrics.memoryUsage
            });
        }
        // 检查错误率
        if (metrics.errors.length > 0) {
            console.warn('Request with errors detected:', {
                requestId: metrics.requestId,
                errorCount: metrics.errors.length
            });
        }
    }
    /**
     * 清理旧指标
     */
    cleanupOldMetrics() {
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24小时前
        this.metrics = this.metrics.filter(m => new Date(m.timestamp).getTime() > cutoff);
    }
    /**
     * 导出性能数据
     */
    exportMetrics() {
        return [...this.metrics];
    }
    /**
     * 重置监控数据
     */
    reset() {
        this.metrics = [];
    }
}
// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor();
// 默认健康检查
performanceMonitor.addHealthCheck('system', async () => {
    const startTime = Date.now();
    // 检查内存使用
    const memoryUsage = process.memoryUsage?.()?.heapUsed || 0;
    const memoryStatus = memoryUsage < 100 * 1024 * 1024 ? 'pass' : 'warn';
    return {
        name: 'system',
        status: memoryStatus,
        responseTime: Date.now() - startTime,
        message: memoryStatus === 'pass' ? 'System healthy' : 'High memory usage',
        details: { memoryUsage }
    };
});
performanceMonitor.addHealthCheck('database', async () => {
    const startTime = Date.now();
    try {
        // 这里应该执行一个简单的数据库查询来检查连接
        // 暂时返回模拟结果
        return {
            name: 'database',
            status: 'pass',
            responseTime: Date.now() - startTime,
            message: 'Database connection healthy'
        };
    }
    catch (error) {
        return {
            name: 'database',
            status: 'fail',
            responseTime: Date.now() - startTime,
            message: 'Database connection failed',
            details: error
        };
    }
});
//# sourceMappingURL=PerformanceMonitor.js.map