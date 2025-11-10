#!/usr/bin/env tsx

/**
 * 仅同步英文文本字段的修复脚本
 * 用于修复剩余的 question_text_en 和 option_text_en 字段差异
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STAGING_DB = 'selfatlas-staging';
const PROD_DB = 'selfatlas-prod';

/**
 * 执行 SQL 命令（使用临时文件避免命令行长度限制，带重试机制）
 */
async function executeSQL(database: string, env: 'staging' | 'production', sql: string, silent: boolean = false, retries: number = 3): Promise<void> {
  const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
  const tmpFile = path.join(os.tmpdir(), `wrangler-sql-${Date.now()}-${Math.random().toString(36).substring(7)}.sql`);
  
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      fs.writeFileSync(tmpFile, sql, 'utf8');
      const command = `npx wrangler d1 execute ${database} ${envFlag} --remote --file=${tmpFile} --json`;
      
      const result = execSync(command, {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '../'),
        stdio: silent ? ['pipe', 'pipe', 'pipe'] : 'inherit',
      });
      
      if (silent) {
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
      
      try {
        if (fs.existsSync(tmpFile)) {
          fs.unlinkSync(tmpFile);
        }
      } catch (e) {}
      
      return;
      
    } catch (error: any) {
      lastError = error;
      const isNetworkError = error.message?.includes('fetch failed') || error.message?.includes('network') || error.message?.includes('timeout');
      
      if (attempt < retries && isNetworkError) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.warn(`   ⚠️  第 ${attempt} 次尝试失败，${delay/1000}秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      } else {
        try {
          if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
          }
        } catch (e) {}
        console.error(`❌ 执行 SQL 失败 (尝试 ${attempt}/${retries}):`, error.message);
        throw error;
      }
    }
  }
  
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
 * 同步题目的英文文本字段
 */
async function syncQuestionTextEn(): Promise<void> {
  console.log('\n📋 同步题目的英文文本字段...');
  
  const prodQuestions = queryData(
    PROD_DB,
    'production',
    'SELECT id, question_text_en, dimension, domain, weight, order_index FROM psychology_questions WHERE is_active = 1 ORDER BY id'
  );
  
  console.log(`   从 Production 获取到 ${prodQuestions.length} 个题目`);
  
  if (prodQuestions.length === 0) {
    console.log('   ⚠️  Production 没有题目数据，跳过');
    return;
  }
  
  let updatedCount = 0;
  let failedCount = 0;
  const batchSize = 50;
  
  for (let i = 0; i < prodQuestions.length; i += batchSize) {
    const batch = prodQuestions.slice(i, i + batchSize);
    console.log(`   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prodQuestions.length / batchSize)} (${batch.length} 个题目)`);
    
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
      
      if (i + batchSize < prodQuestions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`   ❌ 批次 ${Math.floor(i / batchSize) + 1} 更新失败: ${error.message}`);
      failedCount += batch.length;
      
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
 * 同步选项的英文文本字段
 */
async function syncOptionTextEn(): Promise<void> {
  console.log('\n📋 同步选项的英文文本字段...');
  
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
  
  let updatedCount = 0;
  let failedCount = 0;
  const batchSize = 50;
  
  for (let i = 0; i < prodOptions.length; i += batchSize) {
    const batch = prodOptions.slice(i, i + batchSize);
    console.log(`   处理批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(prodOptions.length / batchSize)} (${batch.length} 个选项)`);
    
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
      
      if (i + batchSize < prodOptions.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error: any) {
      console.error(`   ❌ 批次 ${Math.floor(i / batchSize) + 1} 更新失败: ${error.message}`);
      failedCount += batch.length;
      
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
  console.log('🚀 开始同步英文文本字段...\n');
  
  try {
    await syncQuestionTextEn();
    await syncOptionTextEn();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ 同步完成！');
    console.log('='.repeat(80));
    console.log('\n建议运行检查脚本验证结果:');
    console.log('  npm run check:staging\n');
    
  } catch (error: any) {
    console.error('\n❌ 同步过程中出错:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ 执行出错:', error);
  process.exit(1);
});

