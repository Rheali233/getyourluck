#!/usr/bin/env tsx

/**
 * 修复 Staging 环境的数据，使其与 Production 环境保持一致
 * 
 * 修复内容：
 * 1. 同步 Production 的分类数据到 Staging（使用正确的 cat_* 格式）
 * 2. 更新题目的 category_id 从 *-category 格式映射到 cat_* 格式
 * 3. 更新题目的 is_reverse 字段（undefined -> 0）
 * 4. 更新选项的 option_score 和 option_description 以匹配 Production
 * 
 * 使用方法:
 *   npm run fix:staging
 *   或
 *   npx tsx scripts/fix-staging-data.ts
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库配置
const STAGING_DB = 'selfatlas-staging';
const PROD_DB = 'selfatlas-prod';

// 分类 ID 映射（从 staging 格式到 production 格式）
const CATEGORY_ID_MAPPING: Record<string, string> = {
  'mbti-category': 'cat_mbti',
  'phq9-category': 'cat_phq9',
  'eq-category': 'cat_eq',
  'happiness-category': 'cat_happiness',
  'holland-category': 'cat_holland',
  'disc-category': 'cat_disc',
  'leadership-category': 'cat_leadership',
  'love-language-category': 'cat_love_language',
  'love-style-category': 'cat_love_style',
  'interpersonal-category': 'cat_interpersonal',
  'vark-category': 'cat_vark',
};

/**
 * 执行 SQL 命令（使用临时文件避免命令行长度限制，带重试机制）
 */
async function executeSQL(database: string, env: 'staging' | 'production', sql: string, silent: boolean = false, retries: number = 3): Promise<void> {
  const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
  
  // 创建临时 SQL 文件
  const tmpFile = path.join(os.tmpdir(), `wrangler-sql-${Date.now()}-${Math.random().toString(36).substring(7)}.sql`);
  
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // 写入 SQL 到临时文件
      fs.writeFileSync(tmpFile, sql, 'utf8');
      
      // 使用文件执行 SQL
      const command = `npx wrangler d1 execute ${database} ${envFlag} --remote --file=${tmpFile} --json`;
      
      const result = execSync(command, {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '../'),
        stdio: silent ? ['pipe', 'pipe', 'pipe'] : 'inherit',
      });
      
      if (silent) {
        // 提取 JSON 部分（wrangler 可能在 JSON 前输出进度信息）
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error(`No JSON found in result: ${result.substring(0, 200)}`);
        }
        const data = JSON.parse(jsonMatch[0]);
        if (!data[0]?.success) {
          const error = data[0]?.error || data[0];
          throw new Error(`SQL execution failed: ${JSON.stringify(error)}`);
        }
      }
      
      // 成功执行，清理临时文件并返回
      try {
        if (fs.existsSync(tmpFile)) {
          fs.unlinkSync(tmpFile);
        }
      } catch (e) {
        // 忽略清理错误
      }
      
      return; // 成功，退出函数
      
    } catch (error: any) {
      lastError = error;
      const isNetworkError = error.message?.includes('fetch failed') || error.message?.includes('network') || error.message?.includes('timeout');
      
      if (attempt < retries && isNetworkError) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000); // 指数退避，最大10秒
        console.warn(`   ⚠️  第 ${attempt} 次尝试失败，${delay/1000}秒后重试... (${error.message.substring(0, 100)})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        // 最后一次尝试或非网络错误，抛出异常
        try {
          if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
          }
        } catch (e) {
          // 忽略清理错误
        }
        console.error(`❌ 执行 SQL 失败 (尝试 ${attempt}/${retries}):`, error.message);
        throw error;
      }
    }
  }
  
  // 如果所有重试都失败
  throw lastError;
}

/**
 * 查询数据
 */
function queryData(database: string, env: 'staging' | 'production', sql: string): any[] {
  const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
  const command = `npx wrangler d1 execute ${database} ${envFlag} --remote --command "${sql.replace(/"/g, '\\"')}" --json`;
  
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../'),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    // 提取 JSON 部分（wrangler 可能在 JSON 前输出进度信息）
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn(`No JSON found in query result: ${result.substring(0, 200)}`);
      return [];
    }
    const data = JSON.parse(jsonMatch[0]);
    return data[0]?.results || [];
  } catch (error: any) {
    console.error(`❌ 查询数据失败:`, error.message);
    return [];
  }
}

/**
 * 转义 SQL 字符串
 */
function escapeSQL(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

/**
 * 步骤 1: 先插入 Production 的分类数据（如果不存在）
 */
async function syncCategories(): Promise<void> {
  console.log('\n📋 步骤 1: 同步分类数据...');
  
  // 1.1 从 Production 获取所有分类
  const prodCategories = queryData(
    PROD_DB,
    'production',
    'SELECT * FROM psychology_question_categories WHERE is_active = 1 ORDER BY id'
  );
  
  console.log(`   从 Production 获取到 ${prodCategories.length} 个分类`);
  
  if (prodCategories.length === 0) {
    console.log('   ⚠️  Production 没有分类数据，跳过');
    return;
  }
  
  // 1.2 先检查 Staging 中已有的分类
  const stagingCategories = queryData(
    STAGING_DB,
    'staging',
    'SELECT id FROM psychology_question_categories WHERE is_active = 1'
  );
  const stagingCategoryIds = new Set(stagingCategories.map((c: any) => c.id));
  
  // 1.3 检查 code 冲突，先处理旧分类的 code
  console.log('   检查并处理 code 冲突...');
  const stagingCategoriesWithCode = queryData(
    STAGING_DB,
    'staging',
    'SELECT id, code FROM psychology_question_categories WHERE is_active = 1'
  );
  const codeToOldId = new Map<string, string>();
  stagingCategoriesWithCode.forEach((cat: any) => {
    codeToOldId.set(cat.code, cat.id);
  });
  
  // 1.4 先更新旧分类的 code（如果与新分类的 code 冲突）
  for (const category of prodCategories) {
    const oldIdWithSameCode = codeToOldId.get(category.code);
    if (oldIdWithSameCode && oldIdWithSameCode !== category.id && Object.values(CATEGORY_ID_MAPPING).includes(category.id)) {
      // 冲突：旧分类的 code 与新分类相同，先更新旧分类的 code 为临时值
      const tempCode = `old_${oldIdWithSameCode.replace(/-/g, '_')}`;
      const updateOldCodeSQL = `UPDATE psychology_question_categories SET code = '${tempCode}' WHERE id = '${oldIdWithSameCode}'`;
      console.log(`   更新旧分类 ${oldIdWithSameCode} 的 code: ${category.code} -> ${tempCode}`);
      try {
        await executeSQL(STAGING_DB, 'staging', updateOldCodeSQL, true);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: any) {
        console.warn(`   ⚠️  更新旧分类 code 失败: ${error.message}`);
      }
    }
  }
  
  // 1.5 插入或更新分类数据
  for (const category of prodCategories) {
    const categoryExists = stagingCategoryIds.has(category.id);
    
    // 构建单行 SQL，避免换行问题
    const values = [
      escapeSQL(category.id),
      escapeSQL(category.name),
      escapeSQL(category.code),
      escapeSQL(category.description),
      category.question_count || 0,
      escapeSQL(category.dimensions),
      escapeSQL(category.scoring_type),
      category.min_score || 0,
      category.max_score || 100,
      category.estimated_time || 300,
      category.is_active ? 1 : 0,
      category.sort_order || 0,
      escapeSQL(category.created_at),
      escapeSQL(category.updated_at || category.created_at)
    ].join(', ');
    
    const sql = `INSERT OR REPLACE INTO psychology_question_categories (id, name, code, description, question_count, dimensions, scoring_type, min_score, max_score, estimated_time, is_active, sort_order, created_at, updated_at) VALUES (${values})`;
    
    console.log(`   ${categoryExists ? '更新' : '插入'}分类: ${category.id} (${category.name})`);
    try {
      await executeSQL(STAGING_DB, 'staging', sql, true);
      
      // 添加延迟，避免请求过频
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 验证分类是否存在
      const check = queryData(STAGING_DB, 'staging', `SELECT id FROM psychology_question_categories WHERE id = '${category.id}'`);
      if (check.length === 0) {
        console.warn(`   ⚠️  分类 ${category.id} 验证失败，但继续执行`);
      } else {
        console.log(`   ✅ 分类 ${category.id} ${categoryExists ? '更新' : '插入'}成功`);
      }
    } catch (error: any) {
      console.error(`   ❌ 处理分类 ${category.id} 时出错:`, error.message);
      // 不抛出错误，继续处理下一个分类
      console.warn(`   ⚠️  跳过分类 ${category.id}，继续处理下一个`);
    }
  }
  
  console.log('   ✅ 分类数据同步完成');
}

/**
 * 步骤 2: 更新题目的 category_id（必须先执行，因为外键约束）
 */
async function updateQuestionCategoryIds(): Promise<void> {
  console.log('\n📋 步骤 2: 更新题目的 category_id...');
  
  // 先检查所有新的 category_id 是否存在
  const stagingCategories = queryData(
    STAGING_DB,
    'staging',
    'SELECT id FROM psychology_question_categories WHERE is_active = 1'
  );
  const availableCategoryIds = new Set(stagingCategories.map((c: any) => c.id));
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const [oldId, newId] of Object.entries(CATEGORY_ID_MAPPING)) {
    // 检查新的 category_id 是否存在
    if (!availableCategoryIds.has(newId)) {
      console.warn(`   ⚠️  跳过更新 ${oldId} -> ${newId}（新分类 ${newId} 不存在）`);
      skippedCount++;
      continue;
    }
    
    // 检查是否有题目需要更新
    const questionsToUpdate = queryData(
      STAGING_DB,
      'staging',
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${oldId}' AND is_active = 1`
    );
    const count = questionsToUpdate[0]?.count || 0;
    
    if (count === 0) {
      console.log(`   跳过 ${oldId} -> ${newId}（没有题目需要更新）`);
      continue;
    }
    
    const sql = `UPDATE psychology_questions SET category_id = '${newId}' WHERE category_id = '${oldId}' AND is_active = 1`;
    
    console.log(`   更新题目: ${oldId} -> ${newId} (${count} 条)`);
    try {
      await executeSQL(STAGING_DB, 'staging', sql, true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 添加延迟
      updatedCount++;
      console.log(`   ✅ 成功更新 ${count} 条题目`);
    } catch (error: any) {
      console.error(`   ❌ 更新失败: ${error.message}`);
      skippedCount++;
    }
  }
  
  console.log(`   ✅ 已更新 ${updatedCount} 个分类的题目，跳过 ${skippedCount} 个`);
}

/**
 * 步骤 2.5: 删除旧分类（在更新题目后执行）
 */
async function deleteOldCategories(): Promise<void> {
  console.log('\n📋 步骤 2.5: 删除旧格式的分类...');
  
  const oldCategoryIds = Object.keys(CATEGORY_ID_MAPPING);
  let deletedCount = 0;
  
  for (const oldId of oldCategoryIds) {
    // 检查是否还有题目引用这个分类
    const questions = queryData(
      STAGING_DB,
      'staging',
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${oldId}' AND is_active = 1`
    );
    
    const questionCount = questions[0]?.count || 0;
    
    if (questionCount === 0) {
      const sql = `DELETE FROM psychology_question_categories WHERE id = '${oldId}'`;
      console.log(`   删除旧分类: ${oldId}`);
      try {
        await executeSQL(STAGING_DB, 'staging', sql, true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 添加延迟
        deletedCount++;
      } catch (error: any) {
        console.warn(`   ⚠️  删除 ${oldId} 失败: ${error.message}`);
      }
    } else {
      console.log(`   跳过删除 ${oldId}（仍有 ${questionCount} 条题目引用）`);
    }
  }
  
  console.log(`   ✅ 已删除 ${deletedCount} 个旧分类`);
}

/**
 * 步骤 3: 更新题目的 is_reverse 字段
 */
async function updateQuestionIsReverse(): Promise<void> {
  console.log('\n📋 步骤 3: 更新题目的 is_reverse 字段...');
  
  // 先检查列是否存在
  const tableInfo = queryData(
    STAGING_DB,
    'staging',
    "PRAGMA table_info(psychology_questions)"
  );
  
  const hasIsReverse = tableInfo.some((col: any) => col.name === 'is_reverse');
  
  if (!hasIsReverse) {
    console.log('   ⚠️  表 psychology_questions 中不存在 is_reverse 列，跳过此步骤');
    return;
  }
  
  const sql = `UPDATE psychology_questions SET is_reverse = 0 WHERE (is_reverse IS NULL OR is_reverse = '') AND is_active = 1`;
  
  console.log('   设置所有 undefined/null 的 is_reverse 为 0');
  try {
    await executeSQL(STAGING_DB, 'staging', sql, true);
    console.log('   ✅ is_reverse 字段更新完成');
  } catch (error: any) {
    console.warn(`   ⚠️  更新 is_reverse 字段失败: ${error.message}，继续执行`);
  }
}

/**
 * 步骤 4: 同步选项数据以匹配 Production
 */
async function syncOptionsData(): Promise<void> {
  console.log('\n📋 步骤 4: 同步选项数据...');
  
  // 4.1 从 Production 获取所有选项
  const prodOptions = queryData(
    PROD_DB,
    'production',
    'SELECT * FROM psychology_question_options WHERE is_active = 1 ORDER BY question_id, order_index'
  );
  
  console.log(`   从 Production 获取到 ${prodOptions.length} 个选项`);
  
  if (prodOptions.length === 0) {
    console.log('   ⚠️  Production 没有选项数据，跳过');
    return;
  }
  
  // 4.2 批量更新选项（更新 score 和 description 以匹配 Production）
  let updatedCount = 0;
  let failedCount = 0;
  const batchSize = 50; // 减小批次大小，避免网络超时
  
  for (let i = 0; i < prodOptions.length; i += batchSize) {
    const batch = prodOptions.slice(i, i + batchSize);
    console.log(`   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prodOptions.length / batchSize)} (${batch.length} 个选项)`);
    
    // 构建批量更新的 SQL（一次更新多个选项）
    const updateStatements = batch.map(opt => {
      const score = opt.option_score !== null && opt.option_score !== undefined ? opt.option_score : 0;
      const desc = opt.option_description ? escapeSQL(opt.option_description) : 'NULL';
      return `UPDATE psychology_question_options SET option_score = ${score}, option_description = ${desc} WHERE id = '${opt.id}' AND is_active = 1;`;
    }).join('\n');
    
    try {
      await executeSQL(STAGING_DB, 'staging', updateStatements, true);
      updatedCount += batch.length;
      console.log(`   ✅ 批次 ${Math.floor(i / batchSize) + 1} 更新成功`);
      
      // 添加延迟，避免请求过频
      if (i + batchSize < prodOptions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 增加到2秒延迟
      }
    } catch (error: any) {
      console.error(`   ❌ 批次 ${Math.floor(i / batchSize) + 1} 更新失败: ${error.message}`);
      failedCount += batch.length;
      
      // 如果批次失败，尝试单个更新
      console.log(`   尝试单个更新批次 ${Math.floor(i / batchSize) + 1} 的选项...`);
      for (const opt of batch) {
        try {
          const sql = `UPDATE psychology_question_options SET option_score = ${opt.option_score !== null && opt.option_score !== undefined ? opt.option_score : 0}, option_description = ${opt.option_description ? escapeSQL(opt.option_description) : 'NULL'} WHERE id = '${opt.id}' AND is_active = 1`;
          await executeSQL(STAGING_DB, 'staging', sql, true);
          await new Promise(resolve => setTimeout(resolve, 500)); // 单个更新也添加延迟
          updatedCount++;
          failedCount--;
        } catch (e: any) {
          console.warn(`     跳过选项 ${opt.id}: ${e.message}`);
        }
      }
    }
  }
  
  console.log(`   ✅ 已更新 ${updatedCount} 个选项，失败 ${failedCount} 个`);
}

/**
 * 步骤 5: 同步题目的英文文本字段
 */
async function syncQuestionTextEn(): Promise<void> {
  console.log('\n📋 步骤 5: 同步题目的英文文本字段...');
  
  // 5.1 从 Production 获取所有题目
  const prodQuestions = queryData(
    PROD_DB,
    'production',
    'SELECT id, question_text_en, category_id, dimension, domain, weight, order_index FROM psychology_questions WHERE is_active = 1 ORDER BY id'
  );
  
  console.log(`   从 Production 获取到 ${prodQuestions.length} 个题目`);
  
  if (prodQuestions.length === 0) {
    console.log('   ⚠️  Production 没有题目数据，跳过');
    return;
  }
  
  // 5.2 批量更新题目的英文文本和其他字段
  let updatedCount = 0;
  let failedCount = 0;
  const batchSize = 50;
  
  for (let i = 0; i < prodQuestions.length; i += batchSize) {
    const batch = prodQuestions.slice(i, i + batchSize);
    console.log(`   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prodQuestions.length / batchSize)} (${batch.length} 个题目)`);
    
    // 构建批量更新的 SQL
    const updateStatements = batch.map(q => {
      const questionTextEn = q.question_text_en ? escapeSQL(q.question_text_en) : 'NULL';
      const dimension = q.dimension ? escapeSQL(q.dimension) : 'NULL';
      const domain = q.domain ? escapeSQL(q.domain) : 'NULL';
      const weight = q.weight || 1.0;
      const orderIndex = q.order_index || 0;
      
      return `UPDATE psychology_questions SET question_text_en = ${questionTextEn}, dimension = ${dimension}, domain = ${domain}, weight = ${weight}, order_index = ${orderIndex} WHERE id = '${q.id}' AND is_active = 1;`;
    }).join('\n');
    
    try {
      await executeSQL(STAGING_DB, 'staging', updateStatements, true);
      updatedCount += batch.length;
      console.log(`   ✅ 批次 ${Math.floor(i / batchSize) + 1} 更新成功`);
      
      // 添加延迟，避免请求过频
      if (i + batchSize < prodQuestions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`   ❌ 批次 ${Math.floor(i / batchSize) + 1} 更新失败: ${error.message}`);
      failedCount += batch.length;
      
      // 如果批次失败，尝试单个更新
      console.log(`   尝试单个更新批次 ${Math.floor(i / batchSize) + 1} 的题目...`);
      for (const q of batch) {
        try {
          const questionTextEn = q.question_text_en ? escapeSQL(q.question_text_en) : 'NULL';
          const dimension = q.dimension ? escapeSQL(q.dimension) : 'NULL';
          const domain = q.domain ? escapeSQL(q.domain) : 'NULL';
          const weight = q.weight || 1.0;
          const orderIndex = q.order_index || 0;
          
          const sql = `UPDATE psychology_questions SET question_text_en = ${questionTextEn}, dimension = ${dimension}, domain = ${domain}, weight = ${weight}, order_index = ${orderIndex} WHERE id = '${q.id}' AND is_active = 1`;
          await executeSQL(STAGING_DB, 'staging', sql, true);
          await new Promise(resolve => setTimeout(resolve, 500));
          updatedCount++;
          failedCount--;
        } catch (e: any) {
          console.warn(`     跳过题目 ${q.id}: ${e.message}`);
        }
      }
    }
  }
  
  console.log(`   ✅ 已更新 ${updatedCount} 个题目，失败 ${failedCount} 个`);
}

/**
 * 步骤 6: 同步选项的英文文本字段
 */
async function syncOptionTextEn(): Promise<void> {
  console.log('\n📋 步骤 6: 同步选项的英文文本字段...');
  
  // 6.1 从 Production 获取所有选项
  const prodOptions = queryData(
    PROD_DB,
    'production',
    'SELECT id, option_text_en, option_text, option_value, order_index FROM psychology_question_options WHERE is_active = 1 ORDER BY question_id, order_index'
  );
  
  console.log(`   从 Production 获取到 ${prodOptions.length} 个选项`);
  
  if (prodOptions.length === 0) {
    console.log('   ⚠️  Production 没有选项数据，跳过');
    return;
  }
  
  // 6.2 批量更新选项的英文文本
  let updatedCount = 0;
  let failedCount = 0;
  const batchSize = 50;
  
  for (let i = 0; i < prodOptions.length; i += batchSize) {
    const batch = prodOptions.slice(i, i + batchSize);
    console.log(`   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prodOptions.length / batchSize)} (${batch.length} 个选项)`);
    
    // 构建批量更新的 SQL
    const updateStatements = batch.map(opt => {
      const optionTextEn = opt.option_text_en ? escapeSQL(opt.option_text_en) : 'NULL';
      const optionText = opt.option_text ? escapeSQL(opt.option_text) : 'NULL';
      const optionValue = opt.option_value || '';
      const orderIndex = opt.order_index || 0;
      
      return `UPDATE psychology_question_options SET option_text_en = ${optionTextEn}, option_text = ${optionText}, option_value = ${escapeSQL(optionValue)}, order_index = ${orderIndex} WHERE id = '${opt.id}' AND is_active = 1;`;
    }).join('\n');
    
    try {
      await executeSQL(STAGING_DB, 'staging', updateStatements, true);
      updatedCount += batch.length;
      console.log(`   ✅ 批次 ${Math.floor(i / batchSize) + 1} 更新成功`);
      
      // 添加延迟，避免请求过频
      if (i + batchSize < prodOptions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`   ❌ 批次 ${Math.floor(i / batchSize) + 1} 更新失败: ${error.message}`);
      failedCount += batch.length;
      
      // 如果批次失败，尝试单个更新
      console.log(`   尝试单个更新批次 ${Math.floor(i / batchSize) + 1} 的选项...`);
      for (const opt of batch) {
        try {
          const optionTextEn = opt.option_text_en ? escapeSQL(opt.option_text_en) : 'NULL';
          const optionText = opt.option_text ? escapeSQL(opt.option_text) : 'NULL';
          const optionValue = opt.option_value || '';
          const orderIndex = opt.order_index || 0;
          
          const sql = `UPDATE psychology_question_options SET option_text_en = ${optionTextEn}, option_text = ${optionText}, option_value = ${escapeSQL(optionValue)}, order_index = ${orderIndex} WHERE id = '${opt.id}' AND is_active = 1`;
          await executeSQL(STAGING_DB, 'staging', sql, true);
          await new Promise(resolve => setTimeout(resolve, 500));
          updatedCount++;
          failedCount--;
        } catch (e: any) {
          console.warn(`     跳过选项 ${opt.id}: ${e.message}`);
        }
      }
    }
  }
  
  console.log(`   ✅ 已更新 ${updatedCount} 个选项，失败 ${failedCount} 个`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始修复 Staging 环境数据...\n');
  console.log('⚠️  警告: 此操作将修改 Staging 数据库，请确认继续！\n');
  
  try {
    // 执行修复步骤（注意顺序，避免外键约束问题）
    await syncCategories();              // 1. 先插入新的分类
    await updateQuestionCategoryIds();   // 2. 更新题目的 category_id
    await deleteOldCategories();          // 2.5. 删除旧分类（在更新题目后）
    await updateQuestionIsReverse();     // 3. 更新题目的 is_reverse
    await syncOptionsData();              // 4. 同步选项数据（score 和 description）
    await syncQuestionTextEn();          // 5. 同步题目的英文文本字段
    await syncOptionTextEn();            // 6. 同步选项的英文文本字段
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ 修复完成！');
    console.log('='.repeat(80));
    console.log('\n建议运行检查脚本验证修复结果:');
    console.log('  npm run check:staging\n');
    
  } catch (error: any) {
    console.error('\n❌ 修复过程中出错:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 执行出错:', error);
  process.exit(1);
});

