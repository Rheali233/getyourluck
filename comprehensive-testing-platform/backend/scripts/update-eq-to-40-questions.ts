/**
 * Update EQ test to 40 questions (4 dimensions × 10 questions each)
 * This script replaces the existing 50-question EQ test with a 40-question version
 */

import { eqQuestions40, eqOptions40 } from '../seeds/eq-questions-40';

interface SeedResult {
  success: boolean;
  message: string;
  data?: any;
}

class EQ40QuestionUpdater {
  /**
   * 执行SQL语句到本地D1数据库
   */
  private async executeLocalSQL(sql: string): Promise<void> {
    try {
      const response = await fetch('http://localhost:8787/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'SQL execution failed');
      }
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }

  /**
   * 更新EQ测试为40题
   */
  async updateEQTo40Questions(): Promise<SeedResult> {
    try {
      console.log('🔄 Starting EQ test update to 40 questions...');

      // 1. 删除现有的EQ题目
      console.log('📝 Deleting existing EQ questions...');
      await this.executeLocalSQL(`
        DELETE FROM psychology_questions 
        WHERE categoryId = 'eq-category'
      `);

      // 2. 删除现有的EQ选项
      console.log('📝 Deleting existing EQ options...');
      await this.executeLocalSQL(`
        DELETE FROM psychology_question_options 
        WHERE questionId LIKE 'eq-q-%'
      `);

      // 3. 插入新的40题EQ题目
      console.log('📝 Inserting new 40-question EQ questions...');
      for (const question of eqQuestions40) {
        const sql = `
          INSERT INTO psychology_questions (
            id, categoryId, questionText, questionType, dimension, 
            orderIndex, weight, isReverse, createdAt, updatedAt
          ) VALUES (
            'eq-q-${question.orderIndex}',
            '${question.categoryId}',
            '${question.questionText.replace(/'/g, "''")}',
            '${question.questionType}',
            '${question.dimension}',
            ${question.orderIndex},
            ${question.weight},
            ${question.isReverse ? 1 : 0},
            datetime('now'),
            datetime('now')
          )
        `;
        await this.executeLocalSQL(sql);
      }

      // 4. 插入新的40题EQ选项
      console.log('📝 Inserting new 40-question EQ options...');
      for (const option of eqOptions40) {
        const sql = `
          INSERT INTO psychology_question_options (
            id, questionId, optionText, optionTextEn, optionValue, 
            optionScore, orderIndex, createdAt, updatedAt
          ) VALUES (
            '${option.questionId}-opt-${option.orderIndex}',
            '${option.questionId}',
            '${option.optionText.replace(/'/g, "''")}',
            '${option.optionTextEn.replace(/'/g, "''")}',
            '${option.optionValue}',
            ${option.optionScore},
            ${option.orderIndex},
            datetime('now'),
            datetime('now')
          )
        `;
        await this.executeLocalSQL(sql);
      }

      // 5. 更新测试类型配置
      console.log('📝 Updating test type configuration...');
      await this.executeLocalSQL(`
        UPDATE test_types 
        SET config = json_set(config, '$.questionCount', 40)
        WHERE id = 'eq'
      `);

      console.log('✅ EQ test successfully updated to 40 questions!');
      console.log('📊 Question distribution:');
      console.log('   - Self-Awareness: 10 questions (1-10)');
      console.log('   - Self-Management: 10 questions (11-20)');
      console.log('   - Social Awareness: 10 questions (21-30)');
      console.log('   - Relationship Management: 10 questions (31-40)');

      return {
        success: true,
        message: 'EQ test successfully updated to 40 questions',
        data: {
          totalQuestions: 40,
          dimensions: 4,
          questionsPerDimension: 10
        }
      };

    } catch (error) {
      console.error('❌ Error updating EQ test:', error);
      return {
        success: false,
        message: `Failed to update EQ test: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// 执行更新
async function updateEQTest() {
  const updater = new EQ40QuestionUpdater();
  const result = await updater.updateEQTo40Questions();
  
  if (result.success) {
    console.log('🎉 Update completed successfully!');
    process.exit(0);
  } else {
    console.error('💥 Update failed:', result.message);
    process.exit(1);
  }
}

// 运行更新
updateEQTest().catch(console.error);
