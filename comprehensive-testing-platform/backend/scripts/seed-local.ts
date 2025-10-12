#!/usr/bin/env node

/**
 * 本地种子数据执行脚本
 * 用于向本地Cloudflare D1数据库插入基础测试数据
 */

import { psychologyQuestionSeeds } from '../seeds/psychology_questions';

interface SeedResult {
  success: boolean;
  message: string;
  details?: any;
}

class LocalDatabaseSeeder {
  /**
   * 转义SQL字符串中的特殊字符
   */
  private escapeSqlString(str: string): string {
    if (!str) return '';
    return str.replace(/'/g, "''").replace(/"/g, '""');
  }

  /**
   * 执行SQL语句到本地D1数据库
   */
  private async executeLocalSQL(sql: string): Promise<SeedResult> {
    try {
      // 清理SQL语句，移除多余的空格和换行
      const cleanSql = sql.replace(/\s+/g, ' ').trim();
      const command = `wrangler d1 execute selfatlas-local --local --command "${cleanSql}"`;
      console.log(`执行SQL: ${cleanSql.substring(0, 80)}...`);
      
      const { execSync } = await import('child_process');
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      return {
        success: true,
        message: 'SQL执行成功',
        details: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `SQL执行失败: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * 创建心理测试题目分类
   */
  private async createCategories(): Promise<SeedResult> {
    const categories = [
      {
        id: 'mbti-category',
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '基于荣格类型学的16种人格类型测试',
        questionCount: 20,
        dimensions: '["E/I", "S/N", "T/F", "J/P"]',
        scoringType: 'binary',
        minScore: 0,
        maxScore: 4,
        estimatedTime: 15,
        sortOrder: 1
      },
      {
        id: 'phq9-category',
        name: 'PHQ-9抑郁筛查',
        code: 'phq9',
        description: '9项抑郁症状筛查量表',
        questionCount: 9,
        dimensions: '["anhedonia", "depressed_mood", "sleep_problems", "fatigue", "appetite_changes", "guilt_feelings", "poor_concentration", "psychomotor_changes", "suicidal_thoughts"]',
        scoringType: 'likert',
        minScore: 0,
        maxScore: 27,
        estimatedTime: 10,
        sortOrder: 2
      },
      {
        id: 'eq-category',
        name: '情商测试',
        code: 'eq',
        description: '评估情绪智力的五个维度：自我认知、自我管理、动机、共情、社会技能',
        questionCount: 50,
        dimensions: '["self_awareness", "self_regulation", "motivation", "empathy", "social_skills"]',
        scoringType: 'likert',
        minScore: 50,
        maxScore: 250,
        estimatedTime: 25,
        sortOrder: 3
      },
      {
        id: 'happiness-category',
        name: '幸福指数测试',
        code: 'happiness',
        description: '评估主观幸福感的五个维度',
        questionCount: 5,
        dimensions: '["work", "relationships", "health", "personal_growth", "life_balance"]',
        scoringType: 'likert',
        minScore: 5,
        maxScore: 25,
        estimatedTime: 5,
        sortOrder: 4
      }
    ];

    for (const category of categories) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_categories (
          id, name, code, description, question_count, dimensions, 
          scoring_type, min_score, max_score, estimated_time, sort_order, 
          created_at, updated_at
        ) VALUES (
          '${category.id}', '${category.name}', '${category.code}', '${category.description}',
          ${category.questionCount}, '${category.dimensions}', '${category.scoringType}',
          ${category.minScore}, ${category.maxScore}, ${category.estimatedTime}, ${category.sortOrder},
          datetime('now'), datetime('now')
        );
      `;
      
      const result = await this.executeLocalSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: '成功创建所有题目分类'
    };
  }

  /**
   * 插入MBTI题目和选项
   */
  private async insertMbtiData(): Promise<SeedResult> {
    try {
      // 插入MBTI题目
      for (const question of psychologyQuestionSeeds.mbti.questions) {
        const questionSql = `
          INSERT OR REPLACE INTO psychology_questions (
            id, category_id, question_text, question_text_en, question_type,
            dimension, order_index, weight, created_at, updated_at
          ) VALUES (
            'mbti-q-${question.orderIndex}', '${question.categoryId}', '${this.escapeSqlString(question.questionText)}',
            '${this.escapeSqlString(question.questionTextEn || '')}', '${question.questionType}', '${question.dimension}',
            ${question.orderIndex}, ${question.weight}, datetime('now'), datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(questionSql);
        if (!result.success) {
          return result;
        }
      }

      // 插入MBTI选项
      for (const option of psychologyQuestionSeeds.mbti.options) {
        const optionSql = `
          INSERT OR REPLACE INTO psychology_question_options (
            id, question_id, option_text, option_text_en, option_value,
            option_score, order_index, created_at
          ) VALUES (
            'mbti-opt-${option.questionId}-${option.orderIndex}', '${option.questionId}',
            '${this.escapeSqlString(option.optionText)}', '${this.escapeSqlString(option.optionTextEn || '')}', '${option.optionValue}',
            ${option.optionScore || 0}, ${option.orderIndex}, datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(optionSql);
        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        message: '成功插入MBTI题目和选项'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `插入MBTI数据失败: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * 插入PHQ-9题目和选项
   */
  private async insertPhq9Data(): Promise<SeedResult> {
    try {
      // 插入PHQ-9题目
      for (const question of psychologyQuestionSeeds.phq9.questions) {
        const questionSql = `
          INSERT OR REPLACE INTO psychology_questions (
            id, category_id, question_text, question_text_en, question_type,
            dimension, order_index, weight, created_at, updated_at
          ) VALUES (
            'phq9-q-${question.orderIndex}', '${question.categoryId}', '${this.escapeSqlString(question.questionText)}',
            '${this.escapeSqlString(question.questionTextEn || '')}', '${question.questionType}', '${question.dimension}',
            ${question.orderIndex}, ${question.weight}, datetime('now'), datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(questionSql);
        if (!result.success) {
          return result;
        }
      }

      // 插入PHQ-9选项
      for (const option of psychologyQuestionSeeds.phq9.options) {
        const optionSql = `
          INSERT OR REPLACE INTO psychology_question_options (
            id, question_id, option_text, option_text_en, option_value,
            option_score, order_index, created_at
          ) VALUES (
            'phq9-opt-${option.questionId}-${option.orderIndex}', '${option.questionId}',
            '${this.escapeSqlString(option.optionText)}', '${this.escapeSqlString(option.optionTextEn || '')}', '${option.optionValue}',
            ${option.optionScore || 0}, ${option.orderIndex}, datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(optionSql);
        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        message: '成功插入PHQ-9题目和选项'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `插入PHQ-9数据失败: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * 插入情商测试数据
   */
  private async insertEqData(): Promise<SeedResult> {
    try {
      // 插入题目
      for (const question of psychologyQuestionSeeds.eq.questions) {
        const questionSql = `
          INSERT OR REPLACE INTO psychology_questions (
            id, category_id, question_text, question_text_en, question_type,
            dimension, order_index, weight, created_at, updated_at
          ) VALUES (
            'eq-q-${question.orderIndex}', '${question.categoryId}', '${this.escapeSqlString(question.questionText)}',
            '${this.escapeSqlString(question.questionTextEn || '')}', '${question.questionType}', '${question.dimension}',
            ${question.orderIndex}, ${question.weight}, datetime('now'), datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(questionSql);
        if (!result.success) {
          return result;
        }
      }

      // 插入选项
      for (const option of psychologyQuestionSeeds.eq.options) {
        const optionSql = `
          INSERT OR REPLACE INTO psychology_question_options (
            id, question_id, option_text, option_text_en, option_value,
            option_score, order_index, created_at
          ) VALUES (
            'eq-opt-${option.questionId.split('-')[2]}-${option.orderIndex}', '${option.questionId}',
            '${this.escapeSqlString(option.optionText)}', '${this.escapeSqlString(option.optionTextEn || '')}', '${option.optionValue}',
            ${option.optionScore || 0}, ${option.orderIndex}, datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(optionSql);
        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        message: '成功插入情商题目和选项'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `插入情商数据失败: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * 插入幸福指数测试数据
   */
  private async insertHappinessData(): Promise<SeedResult> {
    try {
      // 插入题目
      for (const question of psychologyQuestionSeeds.happiness.questions) {
        const questionSql = `
          INSERT OR REPLACE INTO psychology_questions (
            id, category_id, question_text, question_text_en, question_type,
            dimension, order_index, weight, created_at, updated_at
          ) VALUES (
            'happiness-q-${question.orderIndex}', '${question.categoryId}', '${this.escapeSqlString(question.questionText)}',
            '${this.escapeSqlString(question.questionTextEn || '')}', '${question.questionType}', '${question.dimension}',
            ${question.orderIndex}, ${question.weight}, datetime('now'), datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(questionSql);
        if (!result.success) {
          return result;
        }
      }

      // 插入选项
      for (const option of psychologyQuestionSeeds.happiness.options) {
        const optionSql = `
          INSERT OR REPLACE INTO psychology_question_options (
            id, question_id, option_text, option_text_en, option_value,
            option_score, order_index, created_at
          ) VALUES (
            'happiness-opt-${option.questionId.split('-')[2]}-${option.orderIndex}', '${option.questionId}',
            '${this.escapeSqlString(option.optionText)}', '${this.escapeSqlString(option.optionTextEn || '')}', '${option.optionValue}',
            ${option.optionScore || 0}, ${option.orderIndex}, datetime('now')
          );
        `;
        
        const result = await this.executeLocalSQL(optionSql);
        if (!result.success) {
          return result;
        }
      }

      return {
        success: true,
        message: '成功插入幸福指数题目和选项'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `插入幸福指数数据失败: ${error.message}`,
        details: error
      };
    }
  }

  /**
   * 执行所有种子操作
   */
  async seed(): Promise<void> {
    console.log('🌱 开始执行本地数据库种子操作...\n');

    try {
      // 1. 创建分类
      console.log('📁 创建题目分类...');
      const categoriesResult = await this.createCategories();
      if (!categoriesResult.success) {
        throw new Error(categoriesResult.message);
      }
      console.log('✅ 题目分类创建成功\n');

      // 2. 插入MBTI数据
      console.log('🧠 插入MBTI题目和选项...');
      const mbtiResult = await this.insertMbtiData();
      if (!mbtiResult.success) {
        throw new Error(mbtiResult.message);
      }
      console.log('✅ MBTI数据插入成功\n');

      // 3. 插入PHQ-9数据
      console.log('😔 插入PHQ-9题目和选项...');
      const phq9Result = await this.insertPhq9Data();
      if (!phq9Result.success) {
        throw new Error(phq9Result.message);
      }
      console.log('✅ PHQ-9数据插入成功\n');

      // 4. 插入情商测试数据
      console.log('🧠 插入情商测试题目和选项...');
      const eqResult = await this.insertEqData();
      if (!eqResult.success) {
        throw new Error(eqResult.message);
      }
      console.log('✅ 情商数据插入成功\n');

      // 5. 插入幸福指数测试数据
      console.log('😊 插入幸福指数题目和选项...');
      const happinessResult = await this.insertHappinessData();
      if (!happinessResult.success) {
        throw new Error(happinessResult.message);
      }
      console.log('✅ 幸福指数数据插入成功\n');

      console.log('🎉 所有种子数据插入完成！');
      console.log('现在可以测试API了：');
      console.log('curl -X GET "http://localhost:8787/api/psychology/questions/mbti"');
      console.log('curl -X GET "http://localhost:8787/api/psychology/questions/phq9"');

    } catch (error: any) {
      console.error('❌ 种子操作失败:', error.message);
      process.exit(1);
    }
  }
}

// 执行种子操作
const seeder = new LocalDatabaseSeeder();
seeder.seed();
