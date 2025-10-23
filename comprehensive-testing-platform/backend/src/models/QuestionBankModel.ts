/**
 * Unified Question Bank Model
 * Manages all test types: psychology, career, relationship, learning ability
 * Follows unified development standard data model specifications
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
import { ModuleError, ERROR_CODES } from "../../../shared/types/errors";

// Question bank category data interface
export interface QuestionCategoryData {
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

// Question bank question data interface
export interface QuestionData {
  id: string;
  categoryId: string;
  questionText: string;        // English only
  questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
  dimension?: string;
  domain?: string;
  weight: number;
  orderIndex: number;
  isRequired: boolean;
  isActive: boolean;
  isReverse?: boolean;         // Whether reverse scoring is applied
  createdAt: Date;
  updatedAt: Date;
}

// Question options data interface
export interface QuestionOptionData {
  id: string;
  questionId: string;
  optionText: string;          // English only
  optionValue: string;
  optionScore?: number;
  optionDescription?: string;
  orderIndex: number;
  isCorrect: boolean;
  isActive: boolean;
  createdAt: Date;
}

// Question bank configuration data interface
export interface QuestionConfigData {
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

// Question bank version data interface
export interface QuestionVersionData {
  id: string;
  categoryId: string;
  versionNumber: string;
  versionName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

// Create question bank category data interface
export interface CreateQuestionCategoryData {
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

// Create question bank question data interface
export interface CreateQuestionData {
  categoryId: string;
  questionText: string;        // English only
  questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
  dimension?: string;
  domain?: string;
  weight?: number;
  orderIndex: number;
  isRequired?: boolean;
  isReverse?: boolean;         // Whether reverse scoring is applied
}

// Create question options data interface
export interface CreateQuestionOptionData {
  questionId: string;
  optionText: string;          // English only
  optionValue: string;
  optionScore?: number;
  optionDescription?: string;
  orderIndex: number;
  isCorrect?: boolean;
}

// Create question bank configuration data interface
export interface CreateQuestionConfigData {
  categoryId: string;
  configKey: string;
  configValue: string;
  configType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isPublic?: boolean;
}

// Create question bank version data interface
export interface CreateQuestionVersionData {
  categoryId: string;
  versionNumber: string;
  versionName: string;
  description: string;
  isActive?: boolean;
}

/**
 * Psychology test question bank data model class
 */
export class QuestionBankModel extends BaseModel {
  constructor(env: Env) {
    super(env, "psychology_question_categories");
  }

  // ==================== Question Bank Category Management ====================

  /**
   * 创建题库分类
   */
  async createCategory(data: CreateQuestionCategoryData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
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
  async findCategoryByCode(code: string): Promise<QuestionCategoryData | null> {
    const result = await this.safeDB
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
  async getAllActiveCategories(): Promise<QuestionCategoryData[]> {
    const results = await this.safeDB
      .prepare("SELECT * FROM psychology_question_categories WHERE is_active = 1 ORDER BY sort_order, name")
      .all();

    return (results.results || []).map(result => this.mapToCategoryData(result));
  }

  // ==================== 题库题目管理 ====================

  /**
   * 创建题库题目
   */
  async createQuestion(data: CreateQuestionData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
      .prepare(`
        INSERT INTO psychology_questions (
          id, category_id, question_text, question_type,
          dimension, domain, weight, order_index, is_required
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.categoryId,
        data.questionText,
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
  async getQuestionsByCategory(categoryId: string): Promise<QuestionData[]> {
    const results = await this.safeDB
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
   * 根据分类ID获取题目列表（包含选项）
   */
  async getQuestionsWithOptionsByCategory(
    categoryId: string, 
    _language: string = 'en', 
    limit?: number, 
    offset?: number
  ): Promise<any[]> {
    // 使用JOIN查询一次性获取题目和选项，避免N+1问题
    let sql = `
      SELECT 
        q.id as question_id,
        q.question_text_en,
        q.question_text,
        q.question_type,
        q.is_required,
        q.order_index,
        q.dimension,
        q.domain,
        q.weight,
        o.id as option_id,
        o.option_text_en,
        o.option_text,
        o.option_value,
        o.order_index as option_order
      FROM psychology_questions q
      LEFT JOIN psychology_question_options o ON q.id = o.question_id
      WHERE q.category_id = ? AND q.is_active = 1 
      ORDER BY q.order_index, o.order_index
    `;
    
    if (limit !== undefined && offset !== undefined) {
      sql = `
        SELECT * FROM (
          SELECT 
            q.id as question_id,
            q.question_text_en,
            q.question_text,
            q.question_type,
            q.is_required,
            q.order_index,
            q.dimension,
            q.domain,
            q.weight,
            o.id as option_id,
            o.option_text_en,
            o.option_text,
            o.option_value,
            o.order_index as option_order
          FROM psychology_questions q
          LEFT JOIN psychology_question_options o ON q.id = o.question_id
          WHERE q.category_id = ? AND q.is_active = 1 
          ORDER BY q.order_index, o.order_index
        ) 
        LIMIT ? OFFSET ?
      `;
    }
    
    const params: any[] = [categoryId];
    if (limit !== undefined && offset !== undefined) {
      params.push(limit.toString(), offset.toString());
    }
    
    const results = await this.safeDB
      .prepare(sql)
      .bind(...params)
      .all();

    // 将结果按题目分组
    const questionMap = new Map();
    
    for (const row of results.results) {
      const questionId = row['question_id'] as string;
      
      if (!questionMap.has(questionId)) {
        questionMap.set(questionId, {
          id: questionId,
          text: (row['question_text_en'] as string) || (row['question_text'] as string),
          type: row['question_type'] as 'single_choice' | 'likert_scale' | 'multiple_choice',
          required: Boolean(row['is_required']),
          order: row['order_index'] as number,
          category: (row['dimension'] as string) ?? "",
          weight: row['weight'] as number,
          dimension: (row['dimension'] as string) ?? "",
          domain: (row['domain'] as string) ?? "",
          options: []
        });
      }
      
      // 添加选项（如果存在）
      if (row['option_id']) {
        const question = questionMap.get(questionId);
        const option = {
          id: row['option_id'] as string,
          text: (row['option_text_en'] as string) || (row['option_text'] as string),
          value: row['option_value'] as string,
          order: row['option_order'] as number
        };
        
        // 去重：基于选项文本和值进行去重
        const existingOption = question.options.find((existing: any) => 
          existing.text === option.text && existing.value === option.value
        );
        
        if (!existingOption) {
          question.options.push(option);
        }
      }
    }

    // 返回题目数组
    return Array.from(questionMap.values());
  }

  /**
   * 根据维度获取题目列表
   */
  async getQuestionsByDimension(dimension: string): Promise<QuestionData[]> {
    const results = await this.safeDB
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
  async createQuestionOption(data: CreateQuestionOptionData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
      .prepare(`
        INSERT INTO psychology_question_options (
          id, question_id, option_text, option_value,
          option_score, option_description, order_index, is_correct
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.questionId,
        data.optionText,
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
  async getOptionsByQuestion(questionId: string): Promise<QuestionOptionData[]> {
    const results = await this.safeDB
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
  async createConfig(data: CreateQuestionConfigData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
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
  async getConfigsByCategory(categoryId: string): Promise<QuestionConfigData[]> {
    const results = await this.safeDB
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
    const result = await this.safeDB
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
  async createVersion(data: CreateQuestionVersionData): Promise<string> {
    const id = this.generateId();

    // 如果设置为活跃版本，先取消其他版本的活跃状态
    if (data.isActive) {
      await this.safeDB
        .prepare(`
          UPDATE psychology_question_versions 
          SET is_active = 0 
          WHERE category_id = ?
        `)
        .bind(data.categoryId)
        .run();
    }

    const result = await this.safeDB
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
  async getActiveVersion(categoryId: string): Promise<QuestionVersionData | null> {
    const result = await this.safeDB
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

  /**
   * 获取所有题目分类
   */
  async getQuestionCategories(): Promise<QuestionCategoryData[]> {
    try {
      // Debug logging removed for production
      
      const results = await this.executeQuery(`
        SELECT * FROM psychology_question_categories 
        WHERE is_active = 1 
        ORDER BY sort_order, name
      `);

      // Debug logging removed for production

      return results.map(result => this.mapToCategoryData(result));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error in getQuestionCategories:", error);
      throw error;
    }
  }

  /**
   * 根据ID获取分类详情
   */
  async getCategoryById(categoryId: string): Promise<QuestionCategoryData | null> {
    try {
      const results = await this.executeQuery(`
        SELECT * FROM psychology_question_categories 
        WHERE id = ? AND is_active = 1
      `, [categoryId]);

      if (results.length === 0) {
        return null;
      }

      return this.mapToCategoryData(results[0]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error in getCategoryById:", error);
      throw error;
    }
  }

  /**
   * 根据ID获取题目详情
   */
  async getQuestionById(questionId: string, language: string = 'en'): Promise<any> {
    const questionResult = await this.safeDB
      .prepare(`
        SELECT * FROM psychology_questions 
        WHERE id = ? AND is_active = 1
      `)
      .bind(questionId)
      .first();

    if (!questionResult) {
      return null;
    }

    // 获取题目选项
    const optionsResult = await this.safeDB
      .prepare(`
        SELECT * FROM psychology_question_options 
        WHERE question_id = ? AND is_active = 1 
        ORDER BY order_index
      `)
      .bind(questionId)
      .all();

    const question = {
      id: questionResult['id'] as string,
      text: language === 'en' ? 
        (questionResult['question_text_en'] as string) || (questionResult['question_text'] as string) :
        (questionResult['question_text'] as string) || (questionResult['question_text_en'] as string),
      type: questionResult['question_type'] as 'single_choice' | 'likert_scale' | 'multiple_choice',
      required: Boolean(questionResult['is_required']),
      order: questionResult['order_index'] as number,
      category: (questionResult['dimension'] as string) ?? "",
      weight: questionResult['weight'] as number,
      dimension: (questionResult['dimension'] as string) ?? "",
      domain: (questionResult['domain'] as string) ?? "",
      options: optionsResult.results.map(option => ({
        id: option['id'],
        text: language === 'en' ? 
          (option['option_text_en'] as string) || (option['option_text'] as string) :
          (option['option_text'] as string) || (option['option_text_en'] as string),
        value: option['option_value'],
        score: option['option_score'] || 0,
        description: option['option_description'] || ''
      }))
    };

    return question;
  }

  /**
   * 搜索题目
   */
  async searchQuestions(
    query: string, 
    category?: string, 
    language: string = 'en', 
    limit: number = 20, 
    offset: number = 0
  ): Promise<any[]> {
    let sql = `
      SELECT DISTINCT q.* FROM psychology_questions q
      WHERE q.is_active = 1 AND (
        q.question_text_en LIKE ? OR 
        q.question_text LIKE ? OR
        q.dimension LIKE ? OR
        q.domain LIKE ?
      )
    `;
    const params: any[] = [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`];

    if (category) {
      sql += ' AND q.dimension = ?';
      params.push(category);
    }

    sql += ' ORDER BY q.order_index LIMIT ? OFFSET ?';
    params.push(limit.toString(), offset.toString());

    const results = await this.safeDB
      .prepare(sql)
      .bind(...params)
      .all();

    const questions: any[] = [];
    for (const result of results.results) {
      const question = await this.getQuestionById(result['id'] as string, language);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  // ==================== 数据映射方法 ====================

  private mapToCategoryData(row: any): QuestionCategoryData {
    // 安全解析dimensions字段，处理无效的JSON格式
    let dimensions: string[] = [];
    if (row.dimensions) {
      try {
        // 尝试直接解析
        dimensions = JSON.parse(row.dimensions as string);
      } catch (error) {
        // 如果解析失败，尝试修复格式
        try {
          const fixedDimensions = (row.dimensions as string)
            .replace(/\[([^\]]+)\]/g, '["$1"]') // 修复 [E/I, S/N, T/F, J/P] 格式
            .replace(/([a-zA-Z_]+)/g, '"$1"') // 给所有标识符添加引号
            .replace(/""/g, '"'); // 移除重复的引号
          dimensions = JSON.parse(fixedDimensions);
        } catch (secondError) {
          // 如果还是失败，根据类别ID提供默认维度
          if (row.id === 'mbti-category') {
            dimensions = ['E/I', 'S/N', 'T/F', 'J/P'];
          } else {
            dimensions = [];
            // 只在非MBTI类别时显示警告
            // eslint-disable-next-line no-console
            console.warn(`Failed to parse dimensions for category ${row.id}: ${row.dimensions}`);
          }
        }
      }
    }

    return {
      id: row.id as string,
      name: row.name as string,
      code: row.code as string,
      description: row.description as string,
      questionCount: row.question_count as number,
      dimensions,
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

  private mapToQuestionData(row: any): QuestionData {
    return {
      id: row.id as string,
      categoryId: row.category_id as string,
      questionText: row.question_text_en as string,
      questionType: row.question_type as 'single_choice' | 'likert_scale' | 'multiple_choice',
      dimension: (row.dimension as string) ?? "",
      domain: (row.domain as string) ?? "",
      weight: row.weight as number,
      orderIndex: row.order_index as number,
      isRequired: Boolean(row.is_required),
      isActive: Boolean(row.is_active),
      isReverse: Boolean(row.is_reverse),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }

  private mapToOptionData(row: any): QuestionOptionData {
    return {
      id: row.id as string,
      questionId: row.question_id as string,
      optionText: (row.option_text_en as string) || (row.option_text as string), // 优先使用英文，必要时回退到原文本
      optionValue: row.option_value as string,
      optionScore: (row.option_score as number) ?? 0,
      optionDescription: (row.option_description as string) ?? "",
      orderIndex: row.order_index as number,
      isCorrect: Boolean(row.is_correct),
      isActive: Boolean(row.is_active),
      createdAt: new Date(row.created_at as string),
    };
  }

  private mapToConfigData(row: any): QuestionConfigData {
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

  private mapToVersionData(row: any): QuestionVersionData {
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