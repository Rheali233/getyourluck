/**
 * 统一数据验证服务
 * 遵循统一开发标准的数据验证规范
 */
export declare class ValidationService {
    private static readonly baseSchemas;
    private static readonly testSchemas;
    private static readonly feedbackSchemas;
    private static readonly blogSchemas;
    private static readonly analyticsSchemas;
    private static readonly moduleSchemas;
    /**
     * 验证测试提交数据
     */
    static validateTestSubmission(data: any): any;
    /**
     * 验证用户反馈数据
     */
    static validateFeedback(data: any): any;
    /**
     * 验证博客文章数据
     */
    static validateBlogArticle(data: any): any;
    /**
     * 验证分析事件数据
     */
    static validateAnalyticsEvent(data: any): any;
    /**
     * 验证模块专用会话数据
     */
    static validateModuleSession(module: string, data: any): any;
    /**
     * 验证UUID格式
     */
    static validateUUID(uuid: string): string;
    /**
     * 验证分页参数
     */
    static validatePagination(params: any): {
        page: number;
        limit: number;
    };
    /**
     * 清理和验证字符串输入
     */
    static sanitizeString(input: string, maxLength?: number): string;
    /**
     * 验证IP地址格式
     */
    static validateIPAddress(ip: string): boolean;
    /**
     * 验证User-Agent字符串
     */
    static validateUserAgent(userAgent: string): boolean;
}
//# sourceMappingURL=ValidationService.d.ts.map