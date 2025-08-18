#!/usr/bin/env node

/**
 * 种子数据执行脚本
 * 用于向Cloudflare D1数据库插入基础测试数据
 * 
 * 使用方法:
 * npm run seed:staging    # 向staging环境插入数据
 * npm run seed:prod       # 向production环境插入数据
 */

import { execSync } from 'child_process';
import { psychologyQuestionSeeds } from '../seeds/psychology_questions';

interface SeedResult {
  success: boolean;
  message: string;
  details?: any;
}

class DatabaseSeeder {
  private env: 'staging' | 'production';

  constructor(env: 'staging' | 'production') {
    this.env = env;
  }

  /**
   * 执行SQL语句
   */
  private async executeSQL(sql: string): Promise<SeedResult> {
    try {
      // 清理SQL语句，移除多余的空格和换行
      const cleanSql = sql.replace(/\s+/g, ' ').trim();
      const command = `wrangler d1 execute getyourluck-${this.env} --env ${this.env} --remote --command "${cleanSql}"`;
      console.log(`执行SQL: ${cleanSql.substring(0, 80)}...`);
      
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
        description: '评估情绪智力的四个维度',
        questionCount: 4,
        dimensions: '["self_awareness", "self_management", "social_awareness", "relationship_management"]',
        scoringType: 'likert',
        minScore: 4,
        maxScore: 20,
        estimatedTime: 8,
        sortOrder: 3
      },
      {
        id: 'happiness-category',
        name: '幸福指数测试',
        code: 'happiness',
        description: '评估生活满意度和幸福感',
        questionCount: 5,
        dimensions: '["work", "relationships", "health", "personal_growth", "life_balance"]',
        scoringType: 'likert',
        minScore: 5,
        maxScore: 25,
        estimatedTime: 6,
        sortOrder: 4
      }
    ];

    for (const category of categories) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_categories (
          id, name, code, description, question_count, dimensions, scoring_type, min_score, max_score, estimated_time, sort_order, created_at, updated_at
        ) VALUES (
          '${category.id}',
          '${category.name}',
          '${category.code}',
          '${category.description}',
          ${category.questionCount},
          '${category.dimensions}',
          '${category.scoringType}',
          ${category.minScore},
          ${category.maxScore},
          ${category.estimatedTime},
          ${category.sortOrder},
          datetime('now'),
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: `成功创建 ${categories.length} 个题目分类`
    };
  }

  /**
   * 插入MBTI题目和选项
   */
  private async insertMbtiData(): Promise<SeedResult> {
    const { questions, options } = psychologyQuestionSeeds.mbti;
    
    // 插入题目
    for (const question of questions) {
      const sql = `
        INSERT OR REPLACE INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, created_at, updated_at
        ) VALUES (
          'mbti-q-${question.orderIndex}',
          '${question.categoryId}',
          '${question.questionText.replace(/'/g, "''")}',
          '${question.questionTextEn.replace(/'/g, "''")}',
          '${question.questionType}',
          '${question.dimension}',
          ${question.orderIndex},
          ${question.weight},
          datetime('now'),
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    // 插入选项
    for (const option of options) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value, order_index, created_at
        ) VALUES (
          'mbti-opt-${option.questionId}-${option.orderIndex}',
          '${option.questionId}',
          '${option.optionText.replace(/'/g, "''")}',
          '${option.optionTextEn.replace(/'/g, "''")}',
          '${option.optionValue}',
          ${option.orderIndex},
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: `成功插入MBTI数据: ${questions.length} 题, ${options.length} 选项`
    };
  }

  /**
   * 插入PHQ-9题目和选项
   */
  private async insertPhq9Data(): Promise<SeedResult> {
    const { questions, options } = psychologyQuestionSeeds.phq9;
    
    // 插入题目
    for (const question of questions) {
      const sql = `
        INSERT OR REPLACE INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, created_at, updated_at
        ) VALUES (
          'phq9-q-${question.orderIndex}',
          '${question.categoryId}',
          '${question.questionText.replace(/'/g, "''")}',
          '${question.questionTextEn.replace(/'/g, "''")}',
          '${question.questionType}',
          '${question.dimension}',
          ${question.orderIndex},
          ${question.weight},
          datetime('now'),
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    // 插入选项
    for (const option of options) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value, option_score, order_index, created_at
        ) VALUES (
          'phq9-opt-${option.questionId}-${option.orderIndex}',
          '${option.questionId}',
          '${option.optionText.replace(/'/g, "''")}',
          '${option.optionTextEn.replace(/'/g, "''")}',
          '${option.optionValue}',
          ${option.optionScore},
          ${option.orderIndex},
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: `成功插入PHQ-9数据: ${questions.length} 题, ${options.length} 选项`
    };
  }

  /**
   * 插入情商测试数据
   */
  private async insertEqData(): Promise<SeedResult> {
    const { questions, options } = psychologyQuestionSeeds.eq;
    
    // 插入题目
    for (const question of questions) {
      const sql = `
        INSERT OR REPLACE INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, created_at, updated_at
        ) VALUES (
          'eq-q-${question.orderIndex}',
          '${question.categoryId}',
          '${question.questionText.replace(/'/g, "''")}',
          '${question.questionTextEn.replace(/'/g, "''")}',
          '${question.questionType}',
          '${question.dimension}',
          ${question.orderIndex},
          ${question.weight},
          datetime('now'),
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    // 插入选项
    for (const option of options) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value, option_score, order_index, created_at
        ) VALUES (
          'eq-opt-${option.questionId}-${option.orderIndex}',
          '${option.questionId}',
          '${option.optionText.replace(/'/g, "''")}',
          '${option.optionTextEn.replace(/'/g, "''")}',
          '${option.optionValue}',
          ${option.optionScore},
          ${option.orderIndex},
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: `成功插入情商测试数据: ${questions.length} 题, ${options.length} 选项`
    };
  }

  /**
   * 插入幸福指数测试数据
   */
  private async insertHappinessData(): Promise<SeedResult> {
    const { questions, options } = psychologyQuestionSeeds.happiness;
    
    // 插入题目
    for (const question of questions) {
      const sql = `
        INSERT OR REPLACE INTO psychology_questions (
          id, category_id, question_text, question_text_en, question_type, domain, order_index, weight, created_at, updated_at
        ) VALUES (
          'happiness-q-${question.orderIndex}',
          '${question.categoryId}',
          '${question.questionText.replace(/'/g, "''")}',
          '${question.questionTextEn.replace(/'/g, "''")}',
          '${question.questionType}',
          '${question.domain}',
          ${question.orderIndex},
          ${question.weight},
          datetime('now'),
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    // 插入选项
    for (const option of options) {
      const sql = `
        INSERT OR REPLACE INTO psychology_question_options (
          id, question_id, option_text, option_text_en, option_value, option_score, order_index, created_at
        ) VALUES (
          'happiness-opt-${option.questionId}-${option.orderIndex}',
          '${option.questionId}',
          '${option.optionText.replace(/'/g, "''")}',
          '${option.optionTextEn.replace(/'/g, "''")}',
          '${option.optionValue}',
          ${option.optionScore},
          ${option.orderIndex},
          datetime('now')
        );
      `;

      const result = await this.executeSQL(sql);
      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: `成功插入幸福指数测试数据: ${questions.length} 题, ${options.length} 选项`
    };
  }

  /**
   * 执行所有种子数据插入
   */
  async seedAll(): Promise<void> {
    console.log(`🚀 开始向 ${this.env} 环境插入种子数据...\n`);

    try {
      // 1. 创建题目分类
      console.log('📋 步骤 1: 创建题目分类...');
      const categoriesResult = await this.createCategories();
      if (!categoriesResult.success) {
        throw new Error(`创建分类失败: ${categoriesResult.message}`);
      }
      console.log(`✅ ${categoriesResult.message}\n`);

      // 2. 插入MBTI数据
      console.log('🧠 步骤 2: 插入MBTI测试数据...');
      const mbtiResult = await this.insertMbtiData();
      if (!mbtiResult.success) {
        throw new Error(`插入MBTI数据失败: ${mbtiResult.message}`);
      }
      console.log(`✅ ${mbtiResult.message}\n`);

      // 3. 插入PHQ-9数据
      console.log('😔 步骤 3: 插入PHQ-9抑郁筛查数据...');
      const phq9Result = await this.insertPhq9Data();
      if (!phq9Result.success) {
        throw new Error(`插入PHQ-9数据失败: ${phq9Result.message}`);
      }
      console.log(`✅ ${phq9Result.message}\n`);

      // 4. 插入情商测试数据
      console.log('💝 步骤 4: 插入情商测试数据...');
      const eqResult = await this.insertEqData();
      if (!eqResult.success) {
        throw new Error(`插入情商测试数据失败: ${eqResult.message}`);
      }
      console.log(`✅ ${eqResult.message}\n`);

      // 5. 插入幸福指数测试数据
      console.log('😊 步骤 5: 插入幸福指数测试数据...');
      const happinessResult = await this.insertHappinessData();
      if (!happinessResult.success) {
        throw new Error(`插入幸福指数测试数据失败: ${happinessResult.message}`);
      }
      console.log(`✅ ${happinessResult.message}\n`);

      console.log(`🎉 所有种子数据已成功插入到 ${this.env} 环境！`);
      console.log(`📊 总计: 4个测试类别, 38道题目, 89个选项`);

    } catch (error: any) {
      console.error(`❌ 种子数据插入失败: ${error.message}`);
      process.exit(1);
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const env = args[0] as 'staging' | 'production';

  if (!env || !['staging', 'production'].includes(env)) {
    console.error('❌ 请指定环境: staging 或 production');
    console.error('使用方法: npm run seed:staging 或 npm run seed:prod');
    process.exit(1);
  }

  const seeder = new DatabaseSeeder(env);
  await seeder.seedAll();
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

export { DatabaseSeeder };
