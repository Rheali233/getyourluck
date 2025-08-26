#!/usr/bin/env node

/**
 * 优化版EQ情商题库导入脚本
 * 直接使用wrangler命令操作D1数据库
 */

import { eqQuestionsOptimized, eqOptionsOptimized } from '../seeds/eq-questions-optimized';
import { execSync } from 'child_process';

interface ImportResult {
  success: boolean;
  message: string;
  details?: any;
}

class EQDatabaseImporter {
  /**
   * 转义SQL字符串中的特殊字符
   */
  private escapeSqlString(str: string): string {
    if (!str) return '';
    return str.replace(/'/g, "''").replace(/"/g, '""');
  }

  /**
   * 执行SQL命令
   */
  private async executeSQL(sql: string): Promise<ImportResult> {
    try {
      const cleanSql = sql.replace(/\s+/g, ' ').trim();
      const command = `npx wrangler d1 execute getyourluck-local --local --command "${cleanSql}"`;
      
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
   * 清理现有EQ题库数据
   */
  private async cleanExistingEQData(): Promise<ImportResult> {
    console.log('🧹 清理现有EQ题库数据...');
    
    const sql = `
      DELETE FROM psychology_question_options WHERE question_id LIKE 'eq-q-%';
      DELETE FROM psychology_questions WHERE category_id = 'eq-category';
    `;
    
    return await this.executeSQL(sql);
  }

  /**
   * 导入优化版EQ题库
   */
  private async importEQQuestions(): Promise<ImportResult> {
    console.log('📚 导入优化版EQ题库...');
    
    const questions = eqQuestionsOptimized.map(q => ({
      id: `eq-q-${q.orderIndex}`,
      category_id: q.categoryId,
      question_text: q.questionText,
      question_text_en: q.questionTextEn,
      question_type: q.questionType,
      dimension: q.dimension,
      order_index: q.orderIndex,
      weight: q.weight,
      is_required: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const values = questions.map(q => 
      `('${q.id}', '${q.category_id}', '${this.escapeSqlString(q.question_text)}', '${this.escapeSqlString(q.question_text_en)}', '${q.question_type}', '${q.dimension}', ${q.order_index}, ${q.weight}, ${q.is_required ? 1 : 0}, ${q.is_active ? 1 : 0}, '${q.created_at}', '${q.updated_at}')`
    ).join(',');

    const sql = `
      INSERT INTO psychology_questions (
        id, category_id, question_text, question_text_en, question_type, 
        dimension, order_index, weight, is_required, is_active, created_at, updated_at
      ) VALUES ${values};
    `;

    return await this.executeSQL(sql);
  }

  /**
   * 导入EQ题目选项
   */
  private async importEQOptions(): Promise<ImportResult> {
    console.log('📝 导入EQ题目选项...');
    
    const options = eqOptionsOptimized.map((opt, index) => ({
      id: `eq-opt-${opt.questionId}-${opt.orderIndex}`, // 生成唯一ID
      question_id: opt.questionId,
      option_text: opt.optionText,
      option_text_en: opt.optionTextEn,
      option_value: opt.optionValue,
      option_score: opt.optionScore,
      order_index: opt.orderIndex,
      is_correct: false,
      is_active: true,
      created_at: new Date().toISOString()
    }));

    const values = options.map(opt => 
      `('${opt.id}', '${opt.question_id}', '${this.escapeSqlString(opt.option_text)}', '${this.escapeSqlString(opt.option_text_en)}', '${opt.option_value}', ${opt.option_score}, ${opt.order_index}, ${opt.is_correct ? 1 : 0}, ${opt.is_active ? 1 : 0}, '${opt.created_at}')`
    ).join(',');

    const sql = `
      INSERT INTO psychology_question_options (
        id, question_id, option_text, option_text_en, option_value, 
        option_score, order_index, is_correct, is_active, created_at
      ) VALUES ${values};
    `;

    return await this.executeSQL(sql);
  }

  /**
   * 验证导入结果
   */
  private async verifyImport(): Promise<ImportResult> {
    console.log('🔍 验证导入结果...');
    
    const sql = `
      SELECT 
        COUNT(*) as question_count,
        COUNT(DISTINCT dimension) as dimension_count
      FROM psychology_questions 
      WHERE category_id = 'eq-category';
    `;

    return await this.executeSQL(sql);
  }

  /**
   * 执行完整的导入流程
   */
  async importComplete(): Promise<void> {
    console.log('🚀 开始完整导入优化版EQ情商题库...');
    
    try {
      // 1. 清理现有数据
      const cleanResult = await this.cleanExistingEQData();
      if (!cleanResult.success) {
        throw new Error(`清理数据失败: ${cleanResult.message}`);
      }
      console.log('✅ 现有数据清理完成');

      // 2. 导入题目
      const questionsResult = await this.importEQQuestions();
      if (!questionsResult.success) {
        throw new Error(`导入题目失败: ${questionsResult.message}`);
      }
      console.log('✅ 题目导入完成');

      // 3. 导入选项
      const optionsResult = await this.importEQOptions();
      if (!optionsResult.success) {
        throw new Error(`导入选项失败: ${optionsResult.message}`);
      }
      console.log('✅ 选项导入完成');

      // 4. 验证结果
      const verifyResult = await this.verifyImport();
      if (!verifyResult.success) {
        throw new Error(`验证失败: ${verifyResult.message}`);
      }
      console.log('✅ 导入验证完成');

      console.log('\n🎉 优化版EQ情商题库导入完成！');
      console.log(`📊 题目数量: ${eqQuestionsOptimized.length}`);
      console.log(`📊 选项数量: ${eqOptionsOptimized.length}`);
      
    } catch (error: any) {
      console.error('❌ 导入失败:', error.message);
      throw error;
    }
  }
}

// 主函数
async function main() {
  try {
    const importer = new EQDatabaseImporter();
    await importer.importComplete();
    process.exit(0);
  } catch (error) {
    console.error('💥 导入脚本执行失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { EQDatabaseImporter };
