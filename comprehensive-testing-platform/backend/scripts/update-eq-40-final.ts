/**
 * Final script to update EQ test to 40 questions
 * This script will update the database with the new 40-question EQ test
 */

import { eqQuestions40, eqOptions40 } from '../seeds/eq-questions-40';

interface UpdateResult {
  success: boolean;
  message: string;
  data?: any;
}

class EQ40FinalUpdater {
  private baseUrl = 'http://localhost:8787';

  /**
   * Execute SQL via API
   */
  private async executeSQL(sql: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/admin/execute-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }
  }

  /**
   * Update EQ test to 40 questions
   */
  async updateEQTo40Questions(): Promise<UpdateResult> {
    try {
      console.log('🔄 Starting EQ test update to 40 questions...');

      // 1. Delete existing EQ data
      console.log('📝 Deleting existing EQ questions and options...');
      await this.executeSQL(`DELETE FROM psychology_question_options WHERE questionId LIKE 'eq-q-%'`);
      await this.executeSQL(`DELETE FROM psychology_questions WHERE categoryId = 'eq-category'`);

      // 2. Update test type configuration
      console.log('📝 Updating test type configuration...');
      await this.executeSQL(`UPDATE test_types SET config = json_set(config, '$.questionCount', 40) WHERE id = 'eq'`);

      // 3. Insert new questions
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
        await this.executeSQL(sql);
      }

      // 4. Insert new options
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
        await this.executeSQL(sql);
      }

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

// Execute update
async function updateEQTest() {
  const updater = new EQ40FinalUpdater();
  const result = await updater.updateEQTo40Questions();
  
  if (result.success) {
    console.log('🎉 Update completed successfully!');
    process.exit(0);
  } else {
    console.error('💥 Update failed:', result.message);
    process.exit(1);
  }
}

// Run update
updateEQTest().catch(console.error);
