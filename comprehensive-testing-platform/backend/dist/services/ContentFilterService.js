/**
 * 内容过滤服务
 * 提供内容审核和过滤功能
 */
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
// 敏感词类别
export var ContentFilterCategory;
(function (ContentFilterCategory) {
    ContentFilterCategory["PROFANITY"] = "profanity";
    ContentFilterCategory["HATE_SPEECH"] = "hate_speech";
    ContentFilterCategory["PERSONAL_INFO"] = "personal_info";
    ContentFilterCategory["SPAM"] = "spam";
    ContentFilterCategory["ADULT"] = "adult";
})(ContentFilterCategory || (ContentFilterCategory = {}));
/**
 * 内容过滤服务
 * 用于检测和过滤用户提交的内容中的敏感信息
 */
export class ContentFilterService {
    // 敏感词库 - 实际项目中应该从数据库或配置文件加载
    static sensitivePatterns = {
        [ContentFilterCategory.PROFANITY]: [
            /\b(bad-word-1|bad-word-2)\b/i,
        ],
        [ContentFilterCategory.HATE_SPEECH]: [
            /\b(hate-word-1|hate-word-2)\b/i,
        ],
        [ContentFilterCategory.PERSONAL_INFO]: [
            /\b\d{3}-\d{2}-\d{4}\b/, // US SSN
            /\b\d{16,19}\b/, // Credit card
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email
            /\b(?:\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3,5}[- ]?\d{4}\b/, // Phone
        ],
        [ContentFilterCategory.SPAM]: [
            /\b(buy now|click here|free money|limited time)\b/i,
        ],
        [ContentFilterCategory.ADULT]: [
            /\b(adult-word-1|adult-word-2)\b/i,
        ],
    };
    /**
     * 检查内容是否包含敏感信息
     * @param content 要检查的内容
     * @param categories 要检查的类别（默认全部）
     * @returns 过滤结果
     */
    static checkContent(content, categories) {
        if (!content) {
            return {
                isClean: true,
                detectedCategories: [],
                severity: 'low',
            };
        }
        const categoriesToCheck = categories || Object.values(ContentFilterCategory);
        const detectedCategories = [];
        // 检查每个类别的敏感词
        for (const category of categoriesToCheck) {
            const patterns = this.sensitivePatterns[category] || [];
            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    detectedCategories.push(category);
                    break;
                }
            }
        }
        // 确定严重级别
        let severity = 'low';
        if (detectedCategories.includes(ContentFilterCategory.HATE_SPEECH) ||
            detectedCategories.includes(ContentFilterCategory.ADULT)) {
            severity = 'high';
        }
        else if (detectedCategories.length > 1 ||
            detectedCategories.includes(ContentFilterCategory.PERSONAL_INFO)) {
            severity = 'medium';
        }
        return {
            isClean: detectedCategories.length === 0,
            detectedCategories,
            severity,
        };
    }
    /**
     * 过滤内容中的敏感信息
     * @param content 要过滤的内容
     * @param categories 要过滤的类别（默认全部）
     * @returns 过滤结果，包含过滤后的内容
     */
    static filterContent(content, categories) {
        if (!content) {
            return {
                isClean: true,
                detectedCategories: [],
                filteredContent: '',
                severity: 'low',
            };
        }
        const categoriesToFilter = categories || Object.values(ContentFilterCategory);
        const detectedCategories = [];
        let filteredContent = content;
        // 过滤每个类别的敏感词
        for (const category of categoriesToFilter) {
            const patterns = this.sensitivePatterns[category] || [];
            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    detectedCategories.push(category);
                    filteredContent = filteredContent.replace(pattern, '***');
                }
            }
        }
        // 确定严重级别
        let severity = 'low';
        if (detectedCategories.includes(ContentFilterCategory.HATE_SPEECH) ||
            detectedCategories.includes(ContentFilterCategory.ADULT)) {
            severity = 'high';
        }
        else if (detectedCategories.length > 1 ||
            detectedCategories.includes(ContentFilterCategory.PERSONAL_INFO)) {
            severity = 'medium';
        }
        return {
            isClean: detectedCategories.length === 0,
            detectedCategories,
            filteredContent,
            severity,
        };
    }
    /**
     * 检查并可能拒绝敏感内容
     * @param content 要检查的内容
     * @param strictCategories 严格检查的类别（发现会被拒绝）
     * @param warnCategories 警告类别（发现会标记但不拒绝）
     * @throws 如果内容中包含严格类别中的敏感信息，则抛出错误
     * @returns 过滤结果，如果没有被拒绝
     */
    static validateContent(content, strictCategories = [
        ContentFilterCategory.HATE_SPEECH,
        ContentFilterCategory.ADULT,
    ], warnCategories = [
        ContentFilterCategory.PROFANITY,
        ContentFilterCategory.PERSONAL_INFO,
        ContentFilterCategory.SPAM,
    ]) {
        // 检查严格类别
        const strictResult = this.checkContent(content, strictCategories);
        if (!strictResult.isClean) {
            throw new ModuleError("Content contains inappropriate material", ERROR_CODES.VALIDATION_ERROR, 400, {
                categories: strictResult.detectedCategories,
                severity: strictResult.severity,
            });
        }
        // 检查警告类别
        const warnResult = this.checkContent(content, warnCategories);
        // 如果有警告类别的敏感词，进行过滤
        if (!warnResult.isClean) {
            const filteredResult = this.filterContent(content, warnCategories);
            return {
                ...filteredResult,
                detectedCategories: [
                    ...strictResult.detectedCategories,
                    ...filteredResult.detectedCategories,
                ],
            };
        }
        // 如果没有敏感内容，返回原内容
        return {
            isClean: true,
            detectedCategories: [],
            filteredContent: content,
            severity: 'low',
        };
    }
}
//# sourceMappingURL=ContentFilterService.js.map