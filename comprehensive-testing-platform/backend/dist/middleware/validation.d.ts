/**
 * 统一数据验证中间件
 * 遵循统一开发标准的验证规范
 */
import type { Context, Next } from "hono";
/**
 * 分页参数验证
 */
export declare function validatePagination(page: number, limit: number, maxLimit?: number): void;
export declare const validateTestSubmission: (c: Context, next: Next) => Promise<void>;
export declare const validateFeedback: (c: Context, next: Next) => Promise<void>;
export declare const validateAnalyticsEvent: (c: Context, next: Next) => Promise<void>;
export declare const validateBlogArticle: (c: Context, next: Next) => Promise<void>;
//# sourceMappingURL=validation.d.ts.map