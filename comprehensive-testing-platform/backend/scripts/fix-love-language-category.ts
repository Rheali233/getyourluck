#!/usr/bin/env tsx

/**
 * 修复Love Language category ID问题
 * 删除旧数据并重新插入
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { loveLanguageQuestions } from '../seeds/love-language-questions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB = 'selfatlas-local';
const OLD_CATEGORY_ID = 'love-language-category';
const NEW_CATEGORY_ID = 'cat_love_language';

/**
 * 执行SQL命令
 */
function executeSQL(sql: string): void {
  const tmpFile = path.join(path.dirname(__dirname), 'tmp', `fix-love-lang-${Date.now()}.sql`);
  const tmpDir = path.dirname(tmpFile);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  fs.writeFileSync(tmpFile, sql, 'utf8');
  
  try {
    execSync(`npx wrangler d1 execute ${LOCAL_DB} --file=${tmpFile}`, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../'),
      stdio: 'inherit',
    });
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

async function main() {
  console.log('🔧 修复Love Language category ID...\n');
  
  try {
    // 1. 删除旧选项
    console.log('🗑️  删除旧选项...');
    executeSQL(`
      DELETE FROM psychology_question_options 
      WHERE question_id IN (
        SELECT id FROM psychology_questions WHERE category_id = '${OLD_CATEGORY_ID}'
      );
    `);
    
    // 2. 删除旧题目
    console.log('🗑️  删除旧题目...');
    executeSQL(`DELETE FROM psychology_questions WHERE category_id = '${OLD_CATEGORY_ID}';`);
    
    // 3. 删除旧category
    console.log('🗑️  删除旧category...');
    executeSQL(`DELETE FROM psychology_question_categories WHERE id = '${OLD_CATEGORY_ID}';`);
    
    // 4. 创建新category
    console.log('📋 创建新category...');
    executeSQL(`
      INSERT INTO psychology_question_categories (
        id, name, code, description, question_count, dimensions, scoring_type, 
        min_score, max_score, estimated_time, is_active, sort_order
      ) VALUES (
        '${NEW_CATEGORY_ID}',
        'Love Language Test',
        'love_language',
        'Assessment of how you prefer to give and receive love based on Gary Chapman''s 5 Love Languages',
        30,
        '["Words_of_Affirmation", "Quality_Time", "Receiving_Gifts", "Acts_of_Service", "Physical_Touch"]',
        'likert',
        30,
        150,
        15,
        1,
        20
      );
    `);
    
    // 5. 插入题目
    console.log(`📝 插入 ${loveLanguageQuestions.length} 道题目...`);
    const questionInserts: string[] = [];
    
    loveLanguageQuestions.forEach((q, index) => {
      const questionId = `love_lang_q_${String(index + 1).padStart(2, '0')}`;
      const questionText = q.questionText.replace(/'/g, "''");
      
      questionInserts.push(`(
        '${questionId}',
        '${NEW_CATEGORY_ID}',
        '',
        '${questionText}',
        '${q.questionType}',
        '${q.dimension || ''}',
        '',
        ${q.weight || 1},
        ${q.orderIndex},
        1,
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )`);
    });
    
    executeSQL(`
      INSERT INTO psychology_questions (
        id, category_id, question_text, question_text_en, question_type,
        dimension, domain, weight, order_index, is_required, is_active,
        created_at, updated_at
      ) VALUES ${questionInserts.join(',\n')};
    `);
    
    // 6. 插入选项
    console.log('📝 插入选项...');
    const likertOptions = [
      { text: 'Strongly Disagree', value: '1', score: 1, order: 1 },
      { text: 'Disagree', value: '2', score: 2, order: 2 },
      { text: 'Neutral', value: '3', score: 3, order: 3 },
      { text: 'Agree', value: '4', score: 4, order: 4 },
      { text: 'Strongly Agree', value: '5', score: 5, order: 5 },
    ];
    
    const optionInserts: string[] = [];
    for (let i = 1; i <= loveLanguageQuestions.length; i++) {
      const questionId = `love_lang_q_${String(i).padStart(2, '0')}`;
      likertOptions.forEach((opt) => {
        const optionId = `${questionId}_opt_${opt.order}`;
        optionInserts.push(`(
          '${optionId}',
          '${questionId}',
          '',
          '${opt.text}',
          '${opt.value}',
          ${opt.score},
          '',
          ${opt.order},
          0,
          1,
          CURRENT_TIMESTAMP
        )`);
      });
    }
    
    executeSQL(`
      INSERT INTO psychology_question_options (
        id, question_id, option_text, option_text_en, option_value,
        option_score, option_description, order_index, is_correct, is_active,
        created_at
      ) VALUES ${optionInserts.join(',\n')};
    `);
    
    // 7. 验证
    console.log('🔍 验证数据...');
    const checkSQL = `
      SELECT 
        (SELECT COUNT(*) FROM psychology_questions WHERE category_id = '${NEW_CATEGORY_ID}') as question_count,
        (SELECT COUNT(*) FROM psychology_question_options WHERE question_id IN (
          SELECT id FROM psychology_questions WHERE category_id = '${NEW_CATEGORY_ID}'
        )) as option_count;
    `;
    
    const tmpFile = path.join(path.dirname(__dirname), 'tmp', `verify-${Date.now()}.sql`);
    const tmpDir = path.dirname(tmpFile);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(tmpFile, checkSQL, 'utf8');
    
    try {
      const result = execSync(`npx wrangler d1 execute ${LOCAL_DB} --file=${tmpFile} --json`, {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '../'),
      });
      
      const data = JSON.parse(result);
      const counts = data[0]?.results?.[0];
      
      if (counts) {
        console.log(`\n✅ 完成！`);
        console.log(`  📊 题目数量: ${counts.question_count}`);
        console.log(`  📊 选项数量: ${counts.option_count}`);
      }
    } finally {
      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    }
    
  } catch (error) {
    console.error('\n❌ 修复失败:', error);
    process.exit(1);
  }
}

main().catch(console.error);

