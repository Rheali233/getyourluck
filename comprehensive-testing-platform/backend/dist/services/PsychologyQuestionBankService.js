/**
 * 心理测试题库管理服务
 * 遵循统一开发标准的服务层规范
 */
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
import { PsychologyQuestionBankModel } from "../models";
/**
 * 心理测试题库管理服务类
 */
export class PsychologyQuestionBankService {
    questionBankModel;
    cache;
    cacheTTL = 3600; // 1小时缓存
    constructor(env) {
        this.questionBankModel = new PsychologyQuestionBankModel(env);
        this.cache = env.KV;
    }
    // ==================== 题库分类管理 ====================
    /**
     * 创建题库分类
     */
    async createCategory(data) {
        try {
            // 验证分类代码唯一性
            const existingCategory = await this.questionBankModel.findCategoryByCode(data.code);
            if (existingCategory) {
                throw new ModuleError(`Question category with code '${data.code}' already exists`, ERROR_CODES.VALIDATION_ERROR, 400);
            }
            const categoryId = await this.questionBankModel.createCategory(data);
            // 清除相关缓存
            await this.clearCategoryCache(data.code);
            return categoryId;
        }
        catch (error) {
            if (error instanceof ModuleError) {
                throw error;
            }
            throw new ModuleError(`Failed to create question category: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据代码获取题库分类
     */
    async getCategoryByCode(code) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:category:${code}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const category = await this.questionBankModel.findCategoryByCode(code);
            if (category) {
                // 缓存结果
                await this.setCache(cacheKey, category, this.cacheTTL);
            }
            return category;
        }
        catch (error) {
            throw new ModuleError(`Failed to get question category: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 获取所有活跃的题库分类
     */
    async getAllActiveCategories() {
        try {
            // 尝试从缓存获取
            const cacheKey = 'psychology:categories:active';
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const categories = await this.questionBankModel.getAllActiveCategories();
            // 缓存结果
            await this.setCache(cacheKey, categories, this.cacheTTL);
            return categories;
        }
        catch (error) {
            throw new ModuleError(`Failed to get active categories: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 题库题目管理 ====================
    /**
     * 创建题库题目
     */
    async createQuestion(data) {
        try {
            // 验证分类是否存在
            const category = await this.questionBankModel.findCategoryByCode(data.categoryId);
            if (!category) {
                throw new ModuleError(`Question category not found: ${data.categoryId}`, ERROR_CODES.NOT_FOUND, 404);
            }
            const questionId = await this.questionBankModel.createQuestion(data);
            // 清除相关缓存
            await this.clearQuestionCache(data.categoryId);
            return questionId;
        }
        catch (error) {
            if (error instanceof ModuleError) {
                throw error;
            }
            throw new ModuleError(`Failed to create question: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据分类获取题目列表
     */
    async getQuestionsByCategory(categoryId) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:questions:category:${categoryId}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const questions = await this.questionBankModel.getQuestionsByCategory(categoryId);
            // 缓存结果
            await this.setCache(cacheKey, questions, this.cacheTTL);
            return questions;
        }
        catch (error) {
            throw new ModuleError(`Failed to get questions by category: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据维度获取题目列表
     */
    async getQuestionsByDimension(dimension) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:questions:dimension:${dimension}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const questions = await this.questionBankModel.getQuestionsByDimension(dimension);
            // 缓存结果
            await this.setCache(cacheKey, questions, this.cacheTTL);
            return questions;
        }
        catch (error) {
            throw new ModuleError(`Failed to get questions by dimension: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据查询参数获取题目列表
     */
    async getQuestionsByParams(params) {
        try {
            const { categoryCode, dimension, domain, language, limit = 50, offset = 0 } = params;
            let questions = [];
            if (categoryCode) {
                const category = await this.getCategoryByCode(categoryCode);
                if (category) {
                    questions = await this.getQuestionsByCategory(category.id);
                }
            }
            else if (dimension) {
                questions = await this.getQuestionsByDimension(dimension);
            }
            else {
                // 获取所有分类的题目
                const categories = await this.getAllActiveCategories();
                for (const category of categories) {
                    const categoryQuestions = await this.getQuestionsByCategory(category.id);
                    questions.push(...categoryQuestions);
                }
            }
            // 应用语言过滤
            if (language === 'en') {
                questions = questions.filter(q => q.questionTextEn);
            }
            // 应用分页
            questions = questions.slice(offset, offset + limit);
            return questions;
        }
        catch (error) {
            throw new ModuleError(`Failed to get questions by params: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 题目选项管理 ====================
    /**
     * 创建题目选项
     */
    async createQuestionOption(data) {
        try {
            const optionId = await this.questionBankModel.createQuestionOption(data);
            // 清除相关缓存
            await this.clearQuestionCache(data.questionId);
            return optionId;
        }
        catch (error) {
            throw new ModuleError(`Failed to create question option: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据题目获取选项列表
     */
    async getOptionsByQuestion(questionId) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:options:question:${questionId}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const options = await this.questionBankModel.getOptionsByQuestion(questionId);
            // 缓存结果
            await this.setCache(cacheKey, options, this.cacheTTL);
            return options;
        }
        catch (error) {
            throw new ModuleError(`Failed to get options by question: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 题库配置管理 ====================
    /**
     * 创建题库配置
     */
    async createConfig(data) {
        try {
            const configId = await this.questionBankModel.createConfig(data);
            // 清除相关缓存
            await this.clearConfigCache(data.categoryId);
            return configId;
        }
        catch (error) {
            throw new ModuleError(`Failed to create question config: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据分类获取配置列表
     */
    async getConfigsByCategory(categoryId) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:configs:category:${categoryId}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const configs = await this.questionBankModel.getConfigsByCategory(categoryId);
            // 缓存结果
            await this.setCache(cacheKey, configs, this.cacheTTL);
            return configs;
        }
        catch (error) {
            throw new ModuleError(`Failed to get configs by category: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 根据配置键获取配置值
     */
    async getConfigValue(categoryId, configKey) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:config:${categoryId}:${configKey}`;
            const cached = await this.getCache(cacheKey);
            if (cached !== null) {
                return cached;
            }
            const value = await this.questionBankModel.getConfigValue(categoryId, configKey);
            // 缓存结果
            await this.setCache(cacheKey, value, this.cacheTTL);
            return value;
        }
        catch (error) {
            throw new ModuleError(`Failed to get config value: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 题库版本管理 ====================
    /**
     * 创建题库版本
     */
    async createVersion(data) {
        try {
            const versionId = await this.questionBankModel.createVersion(data);
            // 清除相关缓存
            await this.clearVersionCache(data.categoryId);
            return versionId;
        }
        catch (error) {
            throw new ModuleError(`Failed to create question version: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    /**
     * 获取分类的当前活跃版本
     */
    async getActiveVersion(categoryId) {
        try {
            // 尝试从缓存获取
            const cacheKey = `psychology:version:active:${categoryId}`;
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const version = await this.questionBankModel.getActiveVersion(categoryId);
            if (version) {
                // 缓存结果
                await this.setCache(cacheKey, version, this.cacheTTL);
            }
            return version;
        }
        catch (error) {
            throw new ModuleError(`Failed to get active version: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 统计信息 ====================
    /**
     * 获取题库统计信息
     */
    async getQuestionBankStats() {
        try {
            // 尝试从缓存获取
            const cacheKey = 'psychology:stats:overview';
            const cached = await this.getCache(cacheKey);
            if (cached) {
                return cached;
            }
            const categories = await this.getAllActiveCategories();
            const stats = {
                totalCategories: categories.length,
                totalQuestions: 0,
                totalOptions: 0,
                categoryBreakdown: {},
                dimensionBreakdown: {},
            };
            // 统计各分类的题目数量
            for (const category of categories) {
                const questions = await this.getQuestionsByCategory(category.id);
                stats.totalQuestions += questions.length;
                stats.categoryBreakdown[category.code] = questions.length;
                // 统计各维度的题目数量
                for (const question of questions) {
                    if (question.dimension) {
                        stats.dimensionBreakdown[question.dimension] = (stats.dimensionBreakdown[question.dimension] || 0) + 1;
                    }
                }
                // 统计选项数量
                for (const question of questions) {
                    const options = await this.getOptionsByQuestion(question.id);
                    stats.totalOptions += options.length;
                }
            }
            // 缓存结果（较短的缓存时间，因为统计信息变化较频繁）
            await this.setCache(cacheKey, stats, 1800); // 30分钟
            return stats;
        }
        catch (error) {
            throw new ModuleError(`Failed to get question bank stats: ${error instanceof Error ? error.message : 'Unknown error'}`, ERROR_CODES.DATABASE_ERROR, 500);
        }
    }
    // ==================== 缓存管理 ====================
    /**
     * 设置缓存
     */
    async setCache(key, data, ttl = this.cacheTTL) {
        try {
            await this.cache.put(key, JSON.stringify(data), {
                expirationTtl: ttl,
            });
        }
        catch (error) {
            // 缓存失败不应该影响主要功能
            console.warn('Cache operation failed:', error);
        }
    }
    /**
     * 获取缓存
     */
    async getCache(key) {
        try {
            const cached = await this.cache.get(key);
            return cached ? JSON.parse(cached) : null;
        }
        catch (error) {
            console.warn('Cache retrieval failed:', error);
            return null;
        }
    }
    /**
     * 清除分类相关缓存
     */
    async clearCategoryCache(categoryCode) {
        try {
            const keys = [
                `psychology:category:${categoryCode}`,
                'psychology:categories:active',
                'psychology:stats:overview'
            ];
            for (const key of keys) {
                await this.cache.delete(key);
            }
        }
        catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
    /**
     * 清除题目相关缓存
     */
    async clearQuestionCache(categoryId) {
        try {
            const keys = [
                `psychology:questions:category:${categoryId}`,
                'psychology:stats:overview'
            ];
            for (const key of keys) {
                await this.cache.delete(key);
            }
        }
        catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
    /**
     * 清除配置相关缓存
     */
    async clearConfigCache(categoryId) {
        try {
            const keys = [
                `psychology:configs:category:${categoryId}`,
                `psychology:config:${categoryId}:*`
            ];
            for (const key of keys) {
                await this.cache.delete(key);
            }
        }
        catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
    /**
     * 清除版本相关缓存
     */
    async clearVersionCache(categoryId) {
        try {
            const keys = [
                `psychology:version:active:${categoryId}`
            ];
            for (const key of keys) {
                await this.cache.delete(key);
            }
        }
        catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
}
//# sourceMappingURL=PsychologyQuestionBankService.js.map