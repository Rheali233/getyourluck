/**
 * 统一数据验证服务
 * 遵循统一开发标准的数据验证规范
 */
import { z } from "zod";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
export class ValidationService {
    // 基础验证模式
    static baseSchemas = {
        uuid: z.string().uuid("Invalid UUID format"),
        email: z.string().email("Invalid email format"),
        url: z.string().url("Invalid URL format"),
        date: z.string().datetime("Invalid date format"),
        positiveInteger: z.number().int().positive("Must be a positive integer"),
        nonEmptyString: z.string().min(1, "String cannot be empty"),
        optionalString: z.string().optional(),
    };
    // 测试相关验证模式
    static testSchemas = {
        testType: z.enum([
            "psychology",
            "astrology",
            "tarot",
            "career",
            "learning",
            "relationship",
            "numerology"
        ]),
        testSubtype: z.object({
            psychology: z.enum(["mbti", "big_five", "phq9", "happiness"]),
            astrology: z.enum(["basic", "detailed", "compatibility"]),
            tarot: z.enum(["single", "three_card", "celtic_cross", "relationship", "career"]),
            career: z.enum(["holland", "career_values", "skills_assessment"]),
            learning: z.enum(["vark", "raven", "learning_strategies"]),
            relationship: z.enum(["love_languages", "attachment_style", "relationship_skills"]),
            numerology: z.enum(["basic", "detailed", "compatibility"]),
        }),
        testSubmission: z.object({
            testType: z.string().min(1),
            answers: z.array(z.any()).min(1),
            userInfo: z.object({
                userAgent: z.string().optional(),
                timestamp: z.string().optional(),
            }).optional(),
        }),
        testResult: z.object({
            sessionId: this.baseSchemas.uuid,
            testType: z.string(),
            scores: z.record(z.number()),
            interpretation: z.string(),
            recommendations: z.array(z.string()),
            completedAt: this.baseSchemas.date,
        }),
    };
    // 用户反馈验证模式
    static feedbackSchemas = {
        feedback: z.object({
            sessionId: this.baseSchemas.uuid,
            feedback: z.enum(["like", "dislike"]),
            comment: z.string().max(500).optional(),
            rating: z.number().int().min(1).max(5).optional(),
        }),
    };
    // 博客相关验证模式
    static blogSchemas = {
        article: z.object({
            title: z.string().min(1).max(200),
            content: z.string().min(1),
            excerpt: z.string().max(300).optional(),
            category: z.string().optional(),
            tags: z.array(z.string()).optional(),
            isPublished: z.boolean().optional(),
            isFeatured: z.boolean().optional(),
        }),
        articleUpdate: z.object({
            title: z.string().min(1).max(200).optional(),
            content: z.string().min(1).optional(),
            excerpt: z.string().max(300).optional(),
            category: z.string().optional(),
            tags: z.array(z.string()).optional(),
            isPublished: z.boolean().optional(),
            isFeatured: z.boolean().optional(),
        }),
    };
    // 分析事件验证模式
    static analyticsSchemas = {
        event: z.object({
            eventType: z.string().min(1),
            eventData: z.record(z.any()).optional(),
            sessionId: this.baseSchemas.uuid.optional(),
            userAgent: z.string().optional(),
        }),
    };
    // 模块专用验证模式
    static moduleSchemas = {
        psychology: z.object({
            testSessionId: this.baseSchemas.uuid,
            testSubtype: z.enum(["mbti", "big_five", "phq9", "happiness"]),
            personalityType: z.string().optional(),
            dimensionScores: z.record(z.number()).optional(),
            riskLevel: z.enum(["minimal", "mild", "moderate", "moderately_severe", "severe"]).optional(),
            happinessDomains: z.record(z.number()).optional(),
        }),
        astrology: z.object({
            testSessionId: this.baseSchemas.uuid,
            birthDate: z.date(),
            birthTime: z.string().optional(),
            birthLocation: z.string().optional(),
            sunSign: z.string().min(1),
            moonSign: z.string().optional(),
            risingSign: z.string().optional(),
            planetaryPositions: z.record(z.any()).optional(),
            housePositions: z.record(z.any()).optional(),
            aspects: z.record(z.any()).optional(),
        }),
        tarot: z.object({
            testSessionId: this.baseSchemas.uuid,
            spreadType: z.enum(["single", "three_card", "celtic_cross", "relationship", "career"]),
            cardsDrawn: z.array(z.object({
                id: z.string(),
                name: z.string(),
                suit: z.string().optional(),
                number: z.number().optional(),
                isReversed: z.boolean(),
                meaning: z.string(),
                reversedMeaning: z.string().optional(),
            })),
            cardPositions: z.record(z.any()).optional(),
            interpretationTheme: z.string().optional(),
            questionCategory: z.enum(["love", "career", "finance", "health", "spiritual", "general"]).optional(),
        }),
        career: z.object({
            testSessionId: this.baseSchemas.uuid,
            testSubtype: z.enum(["holland", "career_values", "skills_assessment"]),
            hollandCode: z.string().optional(),
            interestScores: z.record(z.number()).optional(),
            valuesRanking: z.array(z.string()).optional(),
            skillsProfile: z.record(z.number()).optional(),
            careerMatches: z.array(z.object({
                title: z.string(),
                matchScore: z.number(),
                description: z.string(),
                requirements: z.array(z.string()),
            })).optional(),
        }),
        learning: z.object({
            testSessionId: this.baseSchemas.uuid,
            testSubtype: z.enum(["vark", "raven", "learning_strategies"]),
            learningStyle: z.enum(["visual", "auditory", "reading", "kinesthetic", "multimodal"]).optional(),
            cognitiveScore: z.number().optional(),
            percentileRank: z.number().min(0).max(100).optional(),
            learningPreferences: z.record(z.number()).optional(),
            strategyRecommendations: z.array(z.string()).optional(),
        }),
        relationship: z.object({
            testSessionId: this.baseSchemas.uuid,
            testSubtype: z.enum(["love_languages", "attachment_style", "relationship_skills"]),
            primaryLoveLanguage: z.enum(["words_of_affirmation", "acts_of_service", "receiving_gifts", "quality_time", "physical_touch"]).optional(),
            secondaryLoveLanguage: z.enum(["words_of_affirmation", "acts_of_service", "receiving_gifts", "quality_time", "physical_touch"]).optional(),
            attachmentStyle: z.enum(["secure", "anxious", "avoidant", "disorganized"]).optional(),
            relationshipSkills: z.record(z.number()).optional(),
            communicationStyle: z.enum(["assertive", "passive", "aggressive", "passive_aggressive"]).optional(),
        }),
        numerology: z.object({
            testSessionId: this.baseSchemas.uuid,
            birthDate: z.date(),
            fullName: z.string().min(1),
            lifePathNumber: z.number().int().min(1).max(9),
            destinyNumber: z.number().int().min(1).max(9),
            soulUrgeNumber: z.number().int().min(1).max(9),
            personalityNumber: z.number().int().min(1).max(9),
            birthDayNumber: z.number().int().min(1).max(31),
            numerologyChart: z.record(z.any()),
        }),
    };
    /**
     * 验证测试提交数据
     */
    static validateTestSubmission(data) {
        try {
            return this.testSchemas.testSubmission.parse(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid test submission data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证用户反馈数据
     */
    static validateFeedback(data) {
        try {
            return this.feedbackSchemas.feedback.parse(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid feedback data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证博客文章数据
     */
    static validateBlogArticle(data) {
        try {
            return this.blogSchemas.article.parse(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid blog article data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证分析事件数据
     */
    static validateAnalyticsEvent(data) {
        try {
            return this.analyticsSchemas.event.parse(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid analytics event data", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证模块专用会话数据
     */
    static validateModuleSession(module, data) {
        try {
            const schema = this.moduleSchemas[module];
            if (!schema) {
                throw new ModuleError(`Unknown module: ${module}`, ERROR_CODES.VALIDATION_ERROR, 400);
            }
            return schema.parse(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError(`Invalid ${module} session data`, ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证UUID格式
     */
    static validateUUID(uuid) {
        try {
            return this.baseSchemas.uuid.parse(uuid);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid UUID format", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 验证分页参数
     */
    static validatePagination(params) {
        try {
            const schema = z.object({
                page: z.number().int().min(1).default(1),
                limit: z.number().int().min(1).max(100).default(10),
            });
            return schema.parse(params);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new ModuleError("Invalid pagination parameters", ERROR_CODES.VALIDATION_ERROR, 400, error.errors);
            }
            throw error;
        }
    }
    /**
     * 清理和验证字符串输入
     */
    static sanitizeString(input, maxLength = 1000) {
        if (typeof input !== "string") {
            throw new ModuleError("Input must be a string", ERROR_CODES.VALIDATION_ERROR, 400);
        }
        // 移除潜在的恶意字符
        const cleaned = input
            .trim()
            .replace(/[<>]/g, "") // 移除HTML标签字符
            .replace(/javascript:/gi, "") // 移除JavaScript协议
            .slice(0, maxLength);
        return cleaned;
    }
    /**
     * 验证IP地址格式
     */
    static validateIPAddress(ip) {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }
    /**
     * 验证User-Agent字符串
     */
    static validateUserAgent(userAgent) {
        if (typeof userAgent !== "string")
            return false;
        if (userAgent.length === 0 || userAgent.length > 500)
            return false;
        // 基本的User-Agent格式检查
        return /^[a-zA-Z0-9\s\(\)\[\]\/\.\-_,;:]+$/.test(userAgent);
    }
}
//# sourceMappingURL=ValidationService.js.map