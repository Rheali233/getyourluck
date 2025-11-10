#!/usr/bin/env tsx

/**
 * 将Love Language测试数据插入到本地数据库
 * 使用psychology_questions表结构
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { loveLanguageQuestions, loveLanguageOptions } from '../seeds/love-language-questions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB = 'selfatlas-local';
const CATEGORY_ID = 'cat_love_language'; // 后端路由期望的ID

/**
 * 执行SQL命令
 */
function executeSQL(sql: string): void {
  const tmpFile = path.join(path.dirname(__dirname), 'tmp', `seed-love-language-${Date.now()}.sql`);
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

/**
 * 确保category存在
 */
function ensureCategory(): void {
  console.log('📋 检查并创建category...');
  
  const sql = `
    INSERT OR REPLACE INTO psychology_question_categories (
      id, name, code, description, question_count, dimensions, scoring_type, 
      min_score, max_score, estimated_time, is_active, sort_order
    ) VALUES (
      '${CATEGORY_ID}',
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
  `;
  
  executeSQL(sql);
  console.log('✅ Category已创建/更新');
}

/**
 * 插入问题
 */
function insertQuestions(): void {
  console.log(`📝 插入 ${loveLanguageQuestions.length} 道题目...`);
  
  // 先删除旧数据
  executeSQL(`DELETE FROM psychology_question_options WHERE question_id IN (SELECT id FROM psychology_questions WHERE category_id = '${CATEGORY_ID}');`);
  executeSQL(`DELETE FROM psychology_questions WHERE category_id = '${CATEGORY_ID}';`);
  
  // 生成题目ID并插入
  const questionInserts: string[] = [];
  
  loveLanguageQuestions.forEach((q, index) => {
    const questionId = `love_lang_q_${String(index + 1).padStart(2, '0')}`;
    const questionText = q.questionText.replace(/'/g, "''");
    
    questionInserts.push(`(
      '${questionId}',
      '${CATEGORY_ID}',
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
  
  const questionsSQL = `
    INSERT INTO psychology_questions (
      id, category_id, question_text, question_text_en, question_type,
      dimension, domain, weight, order_index, is_required, is_active,
      created_at, updated_at
    ) VALUES ${questionInserts.join(',\n')};
  `;
  
  executeSQL(questionsSQL);
  console.log(`✅ 已插入 ${loveLanguageQuestions.length} 道题目`);
}

/**
 * 插入选项
 */
function insertOptions(): void {
  console.log('📝 插入选项...');
  
  // Likert 5点量表选项
  const likertOptions = [
    { text: 'Strongly Disagree', value: '1', score: 1, order: 1 },
    { text: 'Disagree', value: '2', score: 2, order: 2 },
    { text: 'Neutral', value: '3', score: 3, order: 3 },
    { text: 'Agree', value: '4', score: 4, order: 4 },
    { text: 'Strongly Agree', value: '5', score: 5, order: 5 },
  ];
  
  // 获取所有问题ID
  const questionIds: string[] = [];
  for (let i = 1; i <= loveLanguageQuestions.length; i++) {
    questionIds.push(`love_lang_q_${String(i).padStart(2, '0')}`);
  }
  
  const optionInserts: string[] = [];
  
  questionIds.forEach((questionId, qIndex) => {
    likertOptions.forEach((opt, optIndex) => {
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
  });
  
  const optionsSQL = `
    INSERT INTO psychology_question_options (
      id, question_id, option_text, option_text_en, option_value,
      option_score, option_description, order_index, is_correct, is_active,
      created_at
    ) VALUES ${optionInserts.join(',\n')};
  `;
  
  executeSQL(optionsSQL);
  console.log(`✅ 已插入 ${optionInserts.length} 个选项`);
}

/**
 * 更新category的question_count
 */
function updateCategoryCount(): void {
  console.log('📊 更新category的题目数量...');
  
  const sql = `
    UPDATE psychology_question_categories 
    SET question_count = ${loveLanguageQuestions.length}
    WHERE id = '${CATEGORY_ID}';
  `;
  
  executeSQL(sql);
  console.log('✅ Category题目数量已更新');
}

/**
 * 验证数据
 */
function verifyData(): void {
  console.log('🔍 验证数据...');
  
  const checkSQL = `
    SELECT 
      (SELECT COUNT(*) FROM psychology_questions WHERE category_id = '${CATEGORY_ID}') as question_count,
      (SELECT COUNT(*) FROM psychology_question_options WHERE question_id IN (
        SELECT id FROM psychology_questions WHERE category_id = '${CATEGORY_ID}'
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
      console.log(`  📊 题目数量: ${counts.question_count}`);
      console.log(`  📊 选项数量: ${counts.option_count}`);
      
      if (counts.question_count === loveLanguageQuestions.length) {
        console.log('  ✅ 题目数量正确');
      } else {
        console.log(`  ⚠️  题目数量不匹配: 期望 ${loveLanguageQuestions.length}, 实际 ${counts.question_count}`);
      }
      
      const expectedOptions = loveLanguageQuestions.length * 5; // 每个题目5个选项
      if (counts.option_count === expectedOptions) {
        console.log('  ✅ 选项数量正确');
      } else {
        console.log(`  ⚠️  选项数量不匹配: 期望 ${expectedOptions}, 实际 ${counts.option_count}`);
      }
    }
  } catch (error) {
    console.error('  ❌ 验证失败:', error);
  } finally {
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile);
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🌱 开始插入Love Language测试数据到本地数据库...\n');
  
  try {
    ensureCategory();
    insertQuestions();
    insertOptions();
    updateCategoryCount();
    verifyData();
    
    console.log('\n✅ Love Language测试数据插入完成！');
  } catch (error) {
    console.error('\n❌ 插入失败:', error);
    process.exit(1);
  }
}

main().catch(console.error);

