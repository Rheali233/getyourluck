/**
 * 心理测试题库数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";

// 题库分类数据接口
export interface PsychologyQuestionCategoryData {
  id: string;
  name: string;
  code: string;
  description: string;
  questionCount: number;
  dimensions: string[];
  scoringType: 'binary' | 'likert' | 'scale';
  minScore: number;
  maxScore: number;
  estimatedTime: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// 题库题目数据接口
export interface PsychologyQuestionData {
  id: string;
  categoryId: string;
  questionText: string;
  questionTextEn?: string;
  questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
  dimension?: string;
  domain?: string;
  weight: number;
  orderIndex: number;
  isRequired: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 题目选项数据接口
export interface PsychologyQuestionOptionData {
  id: string;
  questionId: string;
  optionText: string;
  optionTextEn?: string;
  optionValue: string;
  optionScore?: number;
  optionDescription?: string;
  orderIndex: number;
  isCorrect: boolean;
  isActive: boolean;
  createdAt: Date;
}

// 题库配置数据接口
export interface PsychologyQuestionConfigData {
  id: string;
  categoryId: string;
  configKey: string;
  configValue: string;
  configType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 题库版本数据接口
export interface PsychologyQuestionVersionData {
  id: string;
  categoryId: string;
  versionNumber: string;
  versionName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

// 创建题库分类数据接口
export interface CreatePsychologyQuestionCategoryData {
  name: string;
  code: string;
  description: string;
  questionCount: number;
  dimensions: string[];
  scoringType: 'binary' | 'likert' | 'scale';
  minScore: number;
  maxScore: number;
  estimatedTime: number;
  sortOrder?: number;
}

// 创建题库题目数据接口
export interface CreatePsychologyQuestionData {
  categoryId: string;
  questionText: string;
  questionTextEn?: string;
  questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
  dimension?: string;
  domain?: string;
  weight?: number;
  orderIndex: number;
  isRequired?: boolean;
}

// 创建题目选项数据接口
export interface CreatePsychologyQuestionOptionData {
  questionId: string;
  optionText: string;
  optionTextEn?: string;
  optionValue: string;
  optionScore?: number;
  optionDescription?: string;
  orderIndex: number;
  isCorrect?: boolean;
}

// 创建题库配置数据接口
export interface CreatePsychologyQuestionConfigData {
  categoryId: string;
  configKey: string;
  configValue: string;
  configType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isPublic?: boolean;
}

// 创建题库版本数据接口
export interface CreatePsychologyQuestionVersionData {
  categoryId: string;
  versionNumber: string;
  versionName: string;
  description: string;
  isActive?: boolean;
}

/**
 * 心理测试题库数据模型类
 */
export class PsychologyQuestionBankModel extends BaseModel {
  constructor(env: Env) {
    super(env, "psychology_question_categories");
  }

  // ==================== 题库分类管理 ====================

  /**
   * 创建题库分类
   */
  async createCategory(data: CreatePsychologyQuestionCategoryData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO psychology_question_categories (
          id, name, code, description, question_count, dimensions,
          scoring_type, min_score, max_score, estimated_time, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.name,
        data.code,
        data.description,
        data.questionCount,
        JSON.stringify(data.dimensions),
        data.scoringType,
        data.minScore,
        data.maxScore,
        data.estimatedTime,
        data.sortOrder || 0
      )
      .run();

    if (!result.success) {
      throw new ModuleError("Failed to create question category", ERROR_CODES.DATABASE_ERROR, 500);
    }

    return id;
  }

  /**
   * 根据代码查找题库分类
   */
  async findCategoryByCode(code: string): Promise<PsychologyQuestionCategoryData | null> {
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
  async getAllActiveCategories(): Promise<PsychologyQuestionCategoryData[]> {
    const results = await this.db
      .prepare("SELECT * FROM psychology_question_categories WHERE is_active = 1 ORDER BY sort_order, name")
      .all();

    return results.results.map(result => this.mapToCategoryData(result));
  }

  // ==================== 题库题目管理 ====================

  /**
   * 创建题库题目
   */
  async createQuestion(data: CreatePsychologyQuestionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type,
          dimension, domain, weight, order_index, is_required
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.categoryId,
        data.questionText,
        data.questionTextEn || null,
        data.questionType,
        data.dimension || null,
        data.domain || null,
        data.weight || 1,
        data.orderIndex,
        data.isRequired !== false ? 1 : 0
      )
      .run();

    if (!result.success) {
      throw new ModuleError("Failed to create question", ERROR_CODES.DATABASE_ERROR, 500);
    }

    return id;
  }

  /**
   * 根据分类ID获取题目列表
   */
  async getQuestionsByCategory(categoryId: string): Promise<PsychologyQuestionData[]> {
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
  async getQuestionsByDimension(dimension: string): Promise<PsychologyQuestionData[]> {
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
  async createQuestionOption(data: CreatePsychologyQuestionOptionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value,
          option_score, option_description, order_index, is_correct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.questionId,
        data.optionText,
        data.optionTextEn || null,
        data.optionValue,
        data.optionScore || null,
        data.optionDescription || null,
        data.orderIndex,
        data.isCorrect ? 1 : 0
      )
      .run();

    if (!result.success) {
      throw new ModuleError("Failed to create question option", ERROR_CODES.DATABASE_ERROR, 500);
    }

    return id;
  }

  /**
   * 根据题目ID获取选项列表
   */
  async getOptionsByQuestion(questionId: string): Promise<PsychologyQuestionOptionData[]> {
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
  async createConfig(data: CreatePsychologyQuestionConfigData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO psychology_question_configs (
          id, category_id, config_key, config_value, config_type, description, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.categoryId,
        data.configKey,
        data.configValue,
        data.configType,
        data.description,
        data.isPublic ? 1 : 0
      )
      .run();

    if (!result.success) {
      throw new ModuleError("Failed to create question config", ERROR_CODES.DATABASE_ERROR, 500);
    }

    return id;
  }

  /**
   * 根据分类ID获取配置列表
   */
  async getConfigsByCategory(categoryId: string): Promise<PsychologyQuestionConfigData[]> {
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
  async getConfigValue(categoryId: string, configKey: string): Promise<string | null> {
    const result = await this.db
      .prepare(`
        SELECT config_value FROM psychology_question_configs 
        WHERE category_id = ? AND config_key = ?
      `)
      .bind(categoryId, configKey)
      .first();

    return result ? (result["config_value"] as string) : null;
  }

  // ==================== 题库版本管理 ====================

  /**
   * 创建题库版本
   */
  async createVersion(data: CreatePsychologyQuestionVersionData): Promise<string> {
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
      .bind(
        id,
        data.categoryId,
        data.versionNumber,
        data.versionName,
        data.description,
        data.isActive ? 1 : 0
      )
      .run();

    if (!result.success) {
      throw new ModuleError("Failed to create question version", ERROR_CODES.DATABASE_ERROR, 500);
    }

    return id;
  }

  /**
   * 获取分类的当前活跃版本
   */
  async getActiveVersion(categoryId: string): Promise<PsychologyQuestionVersionData | null> {
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

  private mapToCategoryData(row: any): PsychologyQuestionCategoryData {
    return {
      id: row.id as string,
      name: row.name as string,
      code: row.code as string,
      description: row.description as string,
      questionCount: row.question_count as number,
      dimensions: JSON.parse(row.dimensions as string),
      scoringType: row.scoring_type as 'binary' | 'likert' | 'scale',
      minScore: row.min_score as number,
      maxScore: row.max_score as number,
      estimatedTime: row.estimated_time as number,
      isActive: Boolean(row.is_active),
      sortOrder: row.sort_order as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  private mapToQuestionData(row: any): PsychologyQuestionData {
    return {
      id: row.id as string,
      categoryId: row.category_id as string,
      questionText: row.question_text as string,
      questionTextEn: row.question_text_en as string || undefined,
      questionType: row.question_type as 'single_choice' | 'likert_scale' | 'multiple_choice',
      dimension: row.dimension as string || undefined,
      domain: row.domain as string || undefined,
      weight: row.weight as number,
      orderIndex: row.order_index as number,
      isRequired: Boolean(row.is_required),
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  private mapToOptionData(row: any): PsychologyQuestionOptionData {
    return {
      id: row.id as string,
      questionId: row.question_id as string,
      optionText: row.option_text as string,
      optionTextEn: row.option_text_en as string || undefined,
      optionValue: row.option_value as string,
      optionScore: row.option_score as number || undefined,
      optionDescription: row.option_description as string || undefined,
      orderIndex: row.order_index as number,
      isCorrect: Boolean(row.is_correct),
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at as string),
    };
  }

  private mapToConfigData(row: any): PsychologyQuestionConfigData {
    return {
      id: row.id as string,
      categoryId: row.category_id as string,
      configKey: row.config_key as string,
      configValue: row.config_value as string,
      configType: row.config_type as 'string' | 'number' | 'boolean' | 'json',
      description: row.description as string,
      isPublic: Boolean(row.is_public),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  private mapToVersionData(row: any): PsychologyQuestionVersionData {
    return {
      id: row.id as string,
      categoryId: row.category_id as string,
      versionNumber: row.version_number as string,
      versionName: row.version_name as string,
      description: row.description as string,
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at as string),
    };
  }
} 