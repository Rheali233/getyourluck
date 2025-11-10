/* eslint-disable no-console */

/**
 * 从 Staging 环境同步 DISC Behavioral Style Assessment 测试题和选项到本地数据库
 * 反向同步：Staging -> Local
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// DISC category IDs (可能的值)
const DISC_CATEGORY_IDS = ['disc-category', 'cat_disc'];

interface Question {
  id: string;
  category_id: string;
  question_text: string;
  question_text_en: string;
  question_type: string;
  dimension: string;
  domain: string;
  weight: number;
  order_index: number;
  is_required: number;
  is_active: number;
  is_reverse?: number;
  created_at?: string;
  updated_at?: string;
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  option_text_en: string;
  option_value: string;
  option_score: number;
  option_description: string;
  order_index: number;
  is_correct: number;
  is_active: number;
  created_at?: string;
}

/**
 * 执行 SQL 命令并返回 JSON 结果
 */
function executeSQL(database: string, env: 'local' | 'staging', sql: string): any {
  try {
    // 对于本地数据库，使用文件方式执行以避免转义问题
    if (env === 'local') {
      const tmpFile = path.join(os.tmpdir(), `disc-sync-${Date.now()}.sql`);
      fs.writeFileSync(tmpFile, sql, 'utf8');
      
      try {
        const cmd = `npx wrangler d1 execute ${database} --file=${tmpFile} --json`;
        const result = execSync(cmd, { encoding: 'utf8' });
        return JSON.parse(result);
      } finally {
        // 清理临时文件
        try {
          fs.unlinkSync(tmpFile);
        } catch {
          // 忽略删除失败
        }
      }
    } else {
      // Staging 使用命令行方式
      const cmd = `npx wrangler d1 execute ${database} --remote --command "${sql.replace(/"/g, '\\"')}" --json`;
      const result = execSync(cmd, { encoding: 'utf8' });
      return JSON.parse(result);
    }
  } catch (error: any) {
    console.error(`SQL 执行失败: ${error.message.split('\n')[0]}`);
    throw error;
  }
}

/**
 * 查找 DISC category ID
 */
function findDISCCategoryId(): string | null {
  console.log('🔍 查找 DISC category ID...');
  
  // 先尝试已知的 category IDs
  for (const categoryId of DISC_CATEGORY_IDS) {
    try {
      const sql = `SELECT id FROM psychology_question_categories WHERE id = '${categoryId}' LIMIT 1;`;
      const result = executeSQL('getyourluck-staging', 'staging', sql);
      
      if (result[0]?.results?.length > 0) {
        console.log(`  ✅ 找到 category ID: ${categoryId}`);
        return categoryId;
      }
    } catch (error) {
      // 继续尝试下一个
    }
  }
  
  // 如果已知的 IDs 都不存在，尝试查询所有包含 'disc' 的 category
  try {
    const sql = `SELECT id, name, code FROM psychology_question_categories WHERE LOWER(code) LIKE '%disc%' OR LOWER(name) LIKE '%disc%' LIMIT 5;`;
    const result = executeSQL('getyourluck-staging', 'staging', sql);
    const categories = result[0]?.results || [];
    
    if (categories.length > 0) {
      const categoryId = categories[0].id;
      console.log(`  ✅ 找到 category ID: ${categoryId} (name: ${categories[0].name})`);
      return categoryId;
    }
  } catch (error) {
    console.log('  ⚠️  查询所有 category 失败');
  }
  
  console.log('  ⚠️  未找到 DISC category');
  return null;
}

/**
 * 从 Staging 导出 DISC 测试题
 */
function exportDISCQuestions(categoryId: string): Question[] {
  console.log(`📤 从 Staging 导出 DISC 测试题 (category: ${categoryId})...`);
  
  const sql = `SELECT * FROM psychology_questions WHERE category_id = '${categoryId}' ORDER BY order_index;`;
  const result = executeSQL('getyourluck-staging', 'staging', sql);
  const questions = result[0]?.results || [];
  
  console.log(`  📊 找到 ${questions.length} 道测试题`);
  return questions;
}

/**
 * 从 Staging 导出 DISC 测试题选项
 */
function exportDISCOptions(questionIds: string[]): Option[] {
  console.log(`📤 从 Staging 导出 DISC 测试题选项...`);
  
  if (questionIds.length === 0) {
    return [];
  }
  
  const idsList = questionIds.map(id => `'${id}'`).join(',');
  const sql = `SELECT * FROM psychology_question_options WHERE question_id IN (${idsList}) ORDER BY question_id, order_index;`;
  const result = executeSQL('getyourluck-staging', 'staging', sql);
  const options = result[0]?.results || [];
  
  console.log(`  📊 找到 ${options.length} 个选项`);
  return options;
}

/**
 * 查找本地对应的 category ID
 * 如果 staging 是 cat_disc，本地可能是 disc-category
 */
function findLocalCategoryId(stagingCategoryId: string): string {
  console.log(`🔍 查找本地对应的 category ID (staging: ${stagingCategoryId})...`);
  
  // 先检查本地是否有相同的 ID
  try {
    const checkSQL = `SELECT id FROM psychology_question_categories WHERE id = '${stagingCategoryId}';`;
    const checkResult = executeSQL('selfatlas-local', 'local', checkSQL);
    
    if (checkResult[0]?.results?.length > 0) {
      console.log(`  ✅ 本地已存在相同的 category ID: ${stagingCategoryId}`);
      return stagingCategoryId;
    }
  } catch (error) {
    // 继续查找
  }
  
  // 查找本地可能的对应 category（通过 code）
  try {
    const stagingCodeSQL = `SELECT code FROM psychology_question_categories WHERE id = '${stagingCategoryId}';`;
    const stagingCodeResult = executeSQL('getyourluck-staging', 'staging', stagingCodeSQL);
    const stagingCode = stagingCodeResult[0]?.results[0]?.code;
    
    if (stagingCode) {
      const localSQL = `SELECT id FROM psychology_question_categories WHERE code = '${stagingCode}' LIMIT 1;`;
      const localResult = executeSQL('selfatlas-local', 'local', localSQL);
      
      if (localResult[0]?.results?.length > 0) {
        const localCategoryId = localResult[0].results[0].id;
        console.log(`  ✅ 找到本地对应的 category: ${localCategoryId} (code: ${stagingCode})`);
        return localCategoryId;
      }
    }
  } catch (error) {
    console.log(`  ⚠️  查找本地 category 失败，使用 staging ID`);
  }
  
  // 如果找不到，返回原 ID（会在插入时报错，但至少会尝试）
  console.log(`  ⚠️  未找到本地对应的 category，使用 staging ID: ${stagingCategoryId}`);
  return stagingCategoryId;
}

/**
 * 清空本地 DISC 测试题和选项
 */
function clearLocalDISCData(localCategoryId: string, questionIds: string[]): void {
  console.log(`🗑️  清空本地 DISC 数据 (category: ${localCategoryId})...`);
  
  try {
    // 先删除选项（因为有外键约束）
    if (questionIds.length > 0) {
      const idsList = questionIds.map(id => `'${id}'`).join(',');
      const deleteOptionsSQL = `DELETE FROM psychology_question_options WHERE question_id IN (${idsList});`;
      executeSQL('selfatlas-local', 'local', deleteOptionsSQL);
      console.log(`  ✅ 已删除 ${questionIds.length} 道题的选项`);
    }
    
    // 再删除测试题（使用本地 category ID）
    const deleteQuestionsSQL = `DELETE FROM psychology_questions WHERE category_id = '${localCategoryId}';`;
    executeSQL('selfatlas-local', 'local', deleteQuestionsSQL);
    console.log(`  ✅ 已删除 category ${localCategoryId} 的测试题`);
  } catch (error: any) {
    console.error(`  ❌ 清空失败: ${error.message.split('\n')[0]}`);
    throw error;
  }
}

/**
 * 插入测试题到本地数据库
 */
async function insertQuestions(questions: Question[], localCategoryId: string): Promise<void> {
  console.log(`📥 插入 ${questions.length} 道测试题到本地数据库...`);
  
  if (questions.length === 0) {
    console.log('  ⚠️  没有测试题需要插入');
    return;
  }
  
  const columns = [
    'id', 'category_id', 'question_text', 'question_text_en', 'question_type',
    'dimension', 'domain', 'weight', 'order_index', 'is_required', 'is_active',
    'created_at', 'updated_at'
  ];
  
  const batchSize = 10;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(questions.length / batchSize);
    
    console.log(`  📦 处理批次 ${batchNum}/${totalBatches} (${batch.length} 道题)`);
    
    const values = batch.map(q => {
      const row = columns.map(col => {
        // 将 category_id 映射到本地 ID
        if (col === 'category_id') {
          return `'${localCategoryId}'`;
        }
        const value = q[col as keyof Question];
        if (value === null || value === undefined) {
          return 'NULL';
        }
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return String(value);
      }).join(', ');
      return `(${row})`;
    }).join(',\n');
    
    const sql = `INSERT INTO psychology_questions (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL('selfatlas-local', 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
      // 尝试逐条插入
      let successCount = 0;
      for (const q of batch) {
        try {
          const singleValues = columns.map(col => {
            // 将 category_id 映射到本地 ID
            if (col === 'category_id') {
              return `'${localCategoryId}'`;
            }
            const value = q[col as keyof Question];
            if (value === null || value === undefined) {
              return 'NULL';
            }
            if (typeof value === 'string') {
              return `'${value.replace(/'/g, "''")}'`;
            }
            return String(value);
          }).join(', ');
          const singleSQL = `INSERT INTO psychology_questions (${columns.join(', ')}) VALUES (${singleValues});`;
          executeSQL('selfatlas-local', 'local', singleSQL);
          successCount++;
        } catch (singleError: any) {
          console.error(`      ❌ 单条插入失败 (ID: ${q.id}): ${singleError.message.split('\n')[0]}`);
        }
      }
      console.log(`    📊 批次 ${batchNum} 成功插入 ${successCount}/${batch.length} 道题`);
    }
    
    // 添加延迟，避免 API 限制
    if (i + batchSize < questions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 插入选项到本地数据库
 */
async function insertOptions(options: Option[]): Promise<void> {
  console.log(`📥 插入 ${options.length} 个选项到本地数据库...`);
  
  if (options.length === 0) {
    console.log('  ⚠️  没有选项需要插入');
    return;
  }
  
  const columns = [
    'id', 'question_id', 'option_text', 'option_text_en', 'option_value',
    'option_score', 'option_description', 'order_index', 'is_correct', 'is_active',
    'created_at'
  ];
  
  const batchSize = 20;
  
  for (let i = 0; i < options.length; i += batchSize) {
    const batch = options.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(options.length / batchSize);
    
    console.log(`  📦 处理批次 ${batchNum}/${totalBatches} (${batch.length} 个选项)`);
    
    const values = batch.map(opt => {
      const row = columns.map(col => {
        const value = opt[col as keyof Option];
        if (value === null || value === undefined) {
          return 'NULL';
        }
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return String(value);
      }).join(', ');
      return `(${row})`;
    }).join(',\n');
    
    const sql = `INSERT INTO psychology_question_options (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL('selfatlas-local', 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
      // 尝试逐条插入
      let successCount = 0;
      for (const opt of batch) {
        try {
          const singleValues = columns.map(col => {
            const value = opt[col as keyof Option];
            if (value === null || value === undefined) {
              return 'NULL';
            }
            if (typeof value === 'string') {
              return `'${value.replace(/'/g, "''")}'`;
            }
            return String(value);
          }).join(', ');
          const singleSQL = `INSERT INTO psychology_question_options (${columns.join(', ')}) VALUES (${singleValues});`;
          executeSQL('selfatlas-local', 'local', singleSQL);
          successCount++;
        } catch (singleError: any) {
          console.error(`      ❌ 单条插入失败 (ID: ${opt.id}): ${singleError.message.split('\n')[0]}`);
        }
      }
      console.log(`    📊 批次 ${batchNum} 成功插入 ${successCount}/${batch.length} 个选项`);
    }
    
    // 添加延迟，避免 API 限制
    if (i + batchSize < options.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 验证同步结果
 */
function verifySync(categoryId: string): void {
  console.log('🔍 验证同步结果...');
  
  try {
    // 检查测试题数量
    const questionsSQL = `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`;
    const questionsResult = executeSQL('selfatlas-local', 'local', questionsSQL);
    const localQuestionCount = questionsResult[0]?.results[0]?.count || 0;
    
    const stagingQuestionsSQL = `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`;
    const stagingQuestionsResult = executeSQL('getyourluck-staging', 'staging', stagingQuestionsSQL);
    const stagingQuestionCount = stagingQuestionsResult[0]?.results[0]?.count || 0;
    
    console.log(`  📊 本地测试题: ${localQuestionCount} 道`);
    console.log(`  📊 Staging 测试题: ${stagingQuestionCount} 道`);
    
    if (localQuestionCount === stagingQuestionCount) {
      console.log('  ✅ 测试题数量匹配');
    } else {
      console.log(`  ⚠️  测试题数量不匹配 (差异: ${Math.abs(localQuestionCount - stagingQuestionCount)})`);
    }
    
    // 检查选项数量（如果有测试题）
    if (localQuestionCount > 0) {
      const questionIdsSQL = `SELECT id FROM psychology_questions WHERE category_id = '${categoryId}';`;
      const questionIdsResult = executeSQL('selfatlas-local', 'local', questionIdsSQL);
      const questionIds = questionIdsResult[0]?.results?.map((r: any) => r.id) || [];
      
      if (questionIds.length > 0) {
        const idsList = questionIds.map((id: string) => `'${id}'`).join(',');
        const optionsSQL = `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`;
        const optionsResult = executeSQL('selfatlas-local', 'local', optionsSQL);
        const localOptionCount = optionsResult[0]?.results[0]?.count || 0;
        
        const stagingOptionsSQL = `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`;
        const stagingOptionsResult = executeSQL('getyourluck-staging', 'staging', stagingOptionsSQL);
        const stagingOptionCount = stagingOptionsResult[0]?.results[0]?.count || 0;
        
        console.log(`  📊 本地选项: ${localOptionCount} 个`);
        console.log(`  📊 Staging 选项: ${stagingOptionCount} 个`);
        
        if (localOptionCount === stagingOptionCount) {
          console.log('  ✅ 选项数量匹配');
        } else {
          console.log(`  ⚠️  选项数量不匹配 (差异: ${Math.abs(localOptionCount - stagingOptionCount)})`);
        }
      }
    }
  } catch (error: any) {
    console.error(`  ❌ 验证失败: ${error.message.split('\n')[0]}`);
  }
}

/**
 * 主函数
 */
async function syncDISCFromStaging() {
  console.log('🔄 开始从 Staging 同步 DISC Behavioral Style Assessment 数据到本地...\n');
  
  // 检查环境变量
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ 错误: 需要设置 CLOUDFLARE_API_TOKEN 环境变量');
    console.error('   请访问 https://developers.cloudflare.com/fundamentals/api/get-started/create-token/ 创建 API token');
    console.error('   然后运行: export CLOUDFLARE_API_TOKEN="your-token-here"');
    process.exit(1);
  }
  
  try {
    // 1. 查找 DISC category ID
    const categoryId = findDISCCategoryId();
    if (!categoryId) {
      console.error('❌ 未找到 DISC category，同步终止');
      return;
    }
    
    // 2. 导出 Staging 数据
    const questions = exportDISCQuestions(categoryId);
    if (questions.length === 0) {
      console.log('⚠️  Staging 环境没有 DISC 测试题，同步终止');
      return;
    }
    
    const questionIds = questions.map(q => q.id);
    const options = exportDISCOptions(questionIds);
    
    console.log(`\n📊 数据统计:`);
    console.log(`  - 测试题: ${questions.length} 道`);
    console.log(`  - 选项: ${options.length} 个\n`);
    
    // 3. 查找本地对应的 category ID
    const localCategoryId = findLocalCategoryId(categoryId);
    
    // 4. 清空本地数据（使用本地 category ID）
    clearLocalDISCData(localCategoryId, questionIds);
    
    // 5. 插入测试题（将 category_id 映射到本地 ID）
    await insertQuestions(questions, localCategoryId);
    
    // 6. 插入选项
    await insertOptions(options);
    
    // 7. 验证同步结果（使用本地 category ID）
    console.log('\n');
    verifySync(localCategoryId);
    
    console.log('\n✅ DISC 数据同步完成！');
    
  } catch (error: any) {
    console.error('\n❌ 同步失败:', error.message.split('\n')[0]);
    process.exit(1);
  }
}

// 执行同步
syncDISCFromStaging().catch(console.error);

