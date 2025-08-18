/**
 * 心理测试题库数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";
/**
 * 心理测试题库数据模型类
 */
export class PsychologyQuestionBankModel extends BaseModel {
    constructor(env) {
        super(env, "psychology_question_categories");
    }
    // ==================== 题库分类管理 ====================
    /**
     * 创建题库分类
     */
    async createCategory(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_question_categories (
          id, name, code, description, question_count, dimensions,
          scoring_type, min_score, max_score, estimated_time, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.name, data.code, data.description, data.questionCount, JSON.stringify(data.dimensions), data.scoringType, data.minScore, data.maxScore, data.estimatedTime, data.sortOrder || 0)
            .run();
        if (!result.success) {
            throw new ModuleError("Failed to create question category", ERROR_CODES.DATABASE_ERROR, 500);
        }
        return id;
    }
    /**
     * 根据代码查找题库分类
     */
    async findCategoryByCode(code) {
        const result = await this.db
            .prepare("SELECT * FROM psychology_question_categories WHERE code = ? AND is_active = 1")
            .bind(code)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToCategoryData(result);
    }
    /**
     * 获取所有活跃的题库分类
     */
    async getAllActiveCategories() {
        const results = await this.db
            .prepare("SELECT * FROM psychology_question_categories WHERE is_active = 1 ORDER BY sort_order, name")
            .all();
        return results.results.map(result => this.mapToCategoryData(result));
    }
    // ==================== 题库题目管理 ====================
    /**
     * 创建题库题目
     */
    async createQuestion(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type,
          dimension, domain, weight, order_index, is_required
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.categoryId, data.questionText, data.questionTextEn || null, data.questionType, data.dimension || null, data.domain || null, data.weight || 1, data.orderIndex, data.isRequired !== false ? 1 : 0)
            .run();
        if (!result.success) {
            throw new ModuleError("Failed to create question", ERROR_CODES.DATABASE_ERROR, 500);
        }
        return id;
    }
    /**
     * 根据分类ID获取题目列表
     */
    async getQuestionsByCategory(categoryId) {
        const results = await this.db
            .prepare(`
        SELECT * FROM psychology_questions 
        WHERE category_id = ? AND is_active = 1 
        ORDER BY order_index
      `)
            .bind(categoryId)
            .all();
        return results.results.map(result => this.mapToQuestionData(result));
    }
    /**
     * 根据维度获取题目列表
     */
    async getQuestionsByDimension(dimension) {
        const results = await this.db
            .prepare(`
        SELECT * FROM psychology_questions 
        WHERE dimension = ? AND is_active = 1 
        ORDER BY order_index
      `)
            .bind(dimension)
            .all();
        return results.results.map(result => this.mapToQuestionData(result));
    }
    // ==================== 题目选项管理 ====================
    /**
     * 创建题目选项
     */
    async createQuestionOption(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value,
          option_score, option_description, order_index, is_correct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.questionId, data.optionText, data.optionTextEn || null, data.optionValue, data.optionScore || null, data.optionDescription || null, data.orderIndex, data.isCorrect ? 1 : 0)
            .run();
        if (!result.success) {
            throw new ModuleError("Failed to create question option", ERROR_CODES.DATABASE_ERROR, 500);
        }
        return id;
    }
    /**
     * 根据题目ID获取选项列表
     */
    async getOptionsByQuestion(questionId) {
        const results = await this.db
            .prepare(`
        SELECT * FROM psychology_question_options 
        WHERE question_id = ? AND is_active = 1 
        ORDER BY order_index
      `)
            .bind(questionId)
            .all();
        return results.results.map(result => this.mapToOptionData(result));
    }
    // ==================== 题库配置管理 ====================
    /**
     * 创建题库配置
     */
    async createConfig(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_question_configs (
          id, category_id, config_key, config_value, config_type, description, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.categoryId, data.configKey, data.configValue, data.configType, data.description, data.isPublic ? 1 : 0)
            .run();
        if (!result.success) {
            throw new ModuleError("Failed to create question config", ERROR_CODES.DATABASE_ERROR, 500);
        }
        return id;
    }
    /**
     * 根据分类ID获取配置列表
     */
    async getConfigsByCategory(categoryId) {
        const results = await this.db
            .prepare(`
        SELECT * FROM psychology_question_configs 
        WHERE category_id = ? 
        ORDER BY config_key
      `)
            .bind(categoryId)
            .all();
        return results.results.map(result => this.mapToConfigData(result));
    }
    /**
     * 根据配置键获取配置值
     */
    async getConfigValue(categoryId, configKey) {
        const result = await this.db
            .prepare(`
        SELECT config_value FROM psychology_question_configs 
        WHERE category_id = ? AND config_key = ?
      `)
            .bind(categoryId, configKey)
            .first();
        return result ? result["config_value"] : null;
    }
    // ==================== 题库版本管理 ====================
    /**
     * 创建题库版本
     */
    async createVersion(data) {
        const id = this.generateId();
        // 如果设置为活跃版本，先取消其他版本的活跃状态
        if (data.isActive) {
            await this.db
                .prepare(`
          UPDATE psychology_question_versions 
          SET is_active = 0 
          WHERE category_id = ?
        `)
                .bind(data.categoryId)
                .run();
        }
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_question_versions (
          id, category_id, version_number, version_name, description, is_active
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.categoryId, data.versionNumber, data.versionName, data.description, data.isActive ? 1 : 0)
            .run();
        if (!result.success) {
            throw new ModuleError("Failed to create question version", ERROR_CODES.DATABASE_ERROR, 500);
        }
        return id;
    }
    /**
     * 获取分类的当前活跃版本
     */
    async getActiveVersion(categoryId) {
        const result = await this.db
            .prepare(`
        SELECT * FROM psychology_question_versions 
        WHERE category_id = ? AND is_active = 1
      `)
            .bind(categoryId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToVersionData(result);
    }
    // ==================== 数据映射方法 ====================
    mapToCategoryData(row) {
        return {
            id: row.id,
            name: row.name,
            code: row.code,
            description: row.description,
            questionCount: row.question_count,
            dimensions: JSON.parse(row.dimensions),
            scoringType: row.scoring_type,
            minScore: row.min_score,
            maxScore: row.max_score,
            estimatedTime: row.estimated_time,
            isActive: Boolean(row.is_active),
            sortOrder: row.sort_order,
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    mapToQuestionData(row) {
        return {
            id: row.id,
            categoryId: row.category_id,
            questionText: row.question_text,
            questionTextEn: row.question_text_en || undefined,
            questionType: row.question_type,
            dimension: row.dimension || undefined,
            domain: row.domain || undefined,
            weight: row.weight,
            orderIndex: row.order_index,
            isRequired: Boolean(row.is_required),
            isActive: Boolean(row.is_active),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    mapToOptionData(row) {
        return {
            id: row.id,
            questionId: row.question_id,
            optionText: row.option_text,
            optionTextEn: row.option_text_en || undefined,
            optionValue: row.option_value,
            optionScore: row.option_score || undefined,
            optionDescription: row.option_description || undefined,
            orderIndex: row.order_index,
            isCorrect: Boolean(row.is_correct),
            isActive: Boolean(row.is_active),
            createdAt: new Date(row.created_at),
        };
    }
    mapToConfigData(row) {
        return {
            id: row.id,
            categoryId: row.category_id,
            configKey: row.config_key,
            configValue: row.config_value,
            configType: row.config_type,
            description: row.description,
            isPublic: Boolean(row.is_public),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
    mapToVersionData(row) {
        return {
            id: row.id,
            categoryId: row.category_id,
            versionNumber: row.version_number,
            versionName: row.version_name,
            description: row.description,
            isActive: Boolean(row.is_active),
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=PsychologyQuestionBankModel.js.map