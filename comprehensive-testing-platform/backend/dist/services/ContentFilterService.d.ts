/**
 * 内容过滤服务
 * 提供内容审核和过滤功能
 */
export declare enum ContentFilterCategory {
    PROFANITY = "profanity",
    HATE_SPEECH = "hate_speech",
    PERSONAL_INFO = "personal_info",
    SPAM = "spam",
    ADULT = "adult"
}
export interface ContentFilterResult {
    isClean: boolean;
    detectedCategories: ContentFilterCategory[];
    filteredContent?: string;
    severity: 'low' | 'medium' | 'high';
}
/**
 * 内容过滤服务
 * 用于检测和过滤用户提交的内容中的敏感信息
 */
export declare class ContentFilterService {
    private static sensitivePatterns;
    /**
     * 检查内容是否包含敏感信息
     * @param content 要检查的内容
     * @param categories 要检查的类别（默认全部）
     * @returns 过滤结果
     */
    static checkContent(content: string, categories?: ContentFilterCategory[]): ContentFilterResult;
    /**
     * 过滤内容中的敏感信息
     * @param content 要过滤的内容
     * @param categories 要过滤的类别（默认全部）
     * @returns 过滤结果，包含过滤后的内容
     */
    static filterContent(content: string, categories?: ContentFilterCategory[]): ContentFilterResult;
    /**
     * 检查并可能拒绝敏感内容
     * @param content 要检查的内容
     * @param strictCategories 严格检查的类别（发现会被拒绝）
     * @param warnCategories 警告类别（发现会标记但不拒绝）
     * @throws 如果内容中包含严格类别中的敏感信息，则抛出错误
     * @returns 过滤结果，如果没有被拒绝
     */
    static validateContent(content: string, strictCategories?: ContentFilterCategory[], warnCategories?: ContentFilterCategory[]): ContentFilterResult;
}
//# sourceMappingURL=ContentFilterService.d.ts.map