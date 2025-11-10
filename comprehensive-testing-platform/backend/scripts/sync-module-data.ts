#!/usr/bin/env tsx

/**
 * 从 Staging 或 Production 环境同步各模块的题库数据到本地数据库
 * 支持 Psychology, Career, Learning, Relationship 模块
 * 
 * 使用方法:
 *   npx tsx scripts/sync-module-data.ts --module=psychology --submodule=phq9 --source=staging
 *   npx tsx scripts/sync-module-data.ts --module=career --submodule=disc --source=staging
 *   npx tsx scripts/sync-module-data.ts --module=learning --submodule=vark --source=staging
 *   npx tsx scripts/sync-module-data.ts --module=relationship --submodule=love_language --source=staging
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// 数据库配置
const STAGING_DB = 'getyourluck-staging';
const PROD_DB = 'selfatlas-prod';
const LOCAL_DB = 'selfatlas-local';

interface Question {
  id: string;
  category_id?: string;
  question_text: string;
  question_text_en?: string;
  question_type: string;
  dimension?: string;
  domain?: string;
  weight?: number;
  order_index: number;
  is_required?: number;
  is_active?: number;
  is_reverse?: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  option_text_en?: string;
  option_value: string;
  option_score?: number;
  option_description?: string;
  order_index: number;
  is_correct?: number;
  is_active?: number;
  created_at?: string;
  [key: string]: any;
}

interface RelationshipQuestion {
  id: number;
  test_type: string;
  question_number: number;
  question: string;
  options?: string; // JSON
  scale_type: string;
  dimension?: string;
  category?: string;
  reverse_scored?: number;
  weight?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

interface VARKQuestion {
  id: string;
  question_text: string;
  category: string;
  dimension: string;
  weight?: number;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

interface VARKOption {
  id: string;
  question_id: string;
  text: string;
  dimension: string;
  weight?: number;
  is_active?: number;
  created_at?: string;
}

/**
 * 执行 SQL 命令并返回 JSON 结果
 */
function executeSQL(database: string, env: 'local' | 'staging' | 'production', sql: string): any {
  try {
    if (env === 'local') {
      // 本地数据库使用文件方式
      const tmpFile = path.join(os.tmpdir(), `sync-module-${Date.now()}.sql`);
      fs.writeFileSync(tmpFile, sql, 'utf8');
      
      try {
        const cmd = `npx wrangler d1 execute ${database} --file=${tmpFile} --json`;
        const result = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
        const parsed = JSON.parse(result);
        if (parsed.error) {
          const errorMsg = parsed.error.text || parsed.error.notes?.[0]?.text || JSON.stringify(parsed.error);
          throw new Error(errorMsg);
        }
        return parsed;
      } catch (error: any) {
        // 如果失败，尝试读取文件内容用于调试
        if (fs.existsSync(tmpFile)) {
          const sqlContent = fs.readFileSync(tmpFile, 'utf8');
          console.error(`  SQL 内容:\n${sqlContent.substring(0, 500)}...`);
        }
        throw error;
      } finally {
        try {
          fs.unlinkSync(tmpFile);
        } catch {
          // 忽略删除失败
        }
      }
    } else {
      // 远程数据库使用命令行方式
      const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
      const cmd = `npx wrangler d1 execute ${database} ${envFlag} --remote --command "${sql.replace(/"/g, '\\"')}" --json`;
      const result = execSync(cmd, { encoding: 'utf8' });
      const parsed = JSON.parse(result);
      if (parsed.error) {
        throw new Error(parsed.error.text || JSON.stringify(parsed.error));
      }
      return parsed;
    }
  } catch (error: any) {
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes('CLOUDFLARE_API_TOKEN') || errorMessage.includes('non-interactive')) {
      throw new Error('需要设置 CLOUDFLARE_API_TOKEN 环境变量才能访问远程数据库');
    }
    throw error;
  }
}

/**
 * 查找 Category ID（通过 code）
 */
function findCategoryId(code: string, env: 'staging' | 'production'): string | null {
  const db = env === 'staging' ? STAGING_DB : PROD_DB;
  
  try {
    const sql = `SELECT id, name FROM psychology_question_categories WHERE code = '${code}' LIMIT 1;`;
    const result = executeSQL(db, env, sql);
    const categories = result[0]?.results || [];
    
    if (categories.length > 0) {
      return categories[0].id;
    }
    
    // 尝试模糊匹配
    const fuzzySQL = `SELECT id, name, code FROM psychology_question_categories WHERE LOWER(code) LIKE '%${code.toLowerCase()}%' LIMIT 5;`;
    const fuzzyResult = executeSQL(db, env, fuzzySQL);
    const fuzzyCategories = fuzzyResult[0]?.results || [];
    
    if (fuzzyCategories.length > 0) {
      console.log(`  ℹ️  找到相似的 category: ${fuzzyCategories[0].code} (${fuzzyCategories[0].name})`);
      return fuzzyCategories[0].id;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ 查找 category 失败: ${error}`);
    return null;
  }
}

/**
 * 查找本地对应的 Category ID
 */
function findLocalCategoryId(code: string, sourceCategoryId: string): string {
  // 后端 API 期望的 category_id 映射
  const categoryIdMap: { [key: string]: string } = {
    'mbti': 'cat_mbti',
    'phq9': 'cat_phq9',
    'eq': 'cat_eq',
    'happiness': 'cat_happiness',
    'holland': 'holland-category',
    'disc': 'disc-category',
    'leadership': 'leadership-category'
  };
  
  // 如果 code 在映射中，优先使用映射的 ID
  if (categoryIdMap[code]) {
    const mappedId = categoryIdMap[code];
    // 检查本地是否存在这个 ID
    try {
      const checkSQL = `SELECT id FROM psychology_question_categories WHERE id = '${mappedId}' OR code = '${code}';`;
      const checkResult = executeSQL(LOCAL_DB, 'local', checkSQL);
      
      if (checkResult[0]?.results?.length > 0) {
        return checkResult[0].results[0].id;
      }
    } catch (error) {
      // 继续查找
    }
  }
  
  // 先检查本地是否有相同的 code
  try {
    const checkSQL = `SELECT id FROM psychology_question_categories WHERE code = '${code}';`;
    const checkResult = executeSQL(LOCAL_DB, 'local', checkSQL);
    
    if (checkResult[0]?.results?.length > 0) {
      return checkResult[0].results[0].id;
    }
  } catch (error) {
    // 继续查找
  }
  
  // 如果本地不存在，返回映射的 ID 或 source ID
  return categoryIdMap[code] || sourceCategoryId;
}

/**
 * 同步 Psychology/Career 模块数据
 */
async function syncPsychologyCategory(
  categoryCode: string,
  sourceEnv: 'staging' | 'production',
  limit?: number
): Promise<void> {
  console.log(`\n🔄 同步 Psychology/Career 模块: ${categoryCode.toUpperCase()}`);
  
  // 1. 查找 category ID
  const categoryId = findCategoryId(categoryCode, sourceEnv);
  if (!categoryId) {
    console.error(`❌ 未找到 category: ${categoryCode}`);
    return;
  }
  
  console.log(`  ✅ 找到 category ID: ${categoryId}`);
  
  // 2. 导出题目
  const db = sourceEnv === 'staging' ? STAGING_DB : PROD_DB;
  let questionsSQL = `SELECT * FROM psychology_questions WHERE category_id = '${categoryId}' ORDER BY order_index`;
  if (limit) {
    questionsSQL += ` LIMIT ${limit}`;
  }
  questionsSQL += ';';
  
  const questionsResult = executeSQL(db, sourceEnv, questionsSQL);
  const questions: Question[] = questionsResult[0]?.results || [];
  
  if (questions.length === 0) {
    console.log(`  ⚠️  没有找到测试题`);
    return;
  }
  
  console.log(`  📊 找到 ${questions.length} 道测试题`);
  
  // 3. 导出选项
  const questionIds = questions.map(q => q.id);
  const idsList = questionIds.map(id => `'${id}'`).join(',');
  const optionsSQL = `SELECT * FROM psychology_question_options WHERE question_id IN (${idsList}) ORDER BY question_id, order_index;`;
  const optionsResult = executeSQL(db, sourceEnv, optionsSQL);
  const options: Option[] = optionsResult[0]?.results || [];
  
  console.log(`  📊 找到 ${options.length} 个选项`);
  
  // 4. 查找本地 category ID
  const localCategoryId = findLocalCategoryId(categoryCode, categoryId);
  
  // 5. 清空本地数据
  console.log(`  🗑️  清空本地数据...`);
  try {
    if (questionIds.length > 0) {
      const deleteOptionsSQL = `DELETE FROM psychology_question_options WHERE question_id IN (${idsList});`;
      executeSQL(LOCAL_DB, 'local', deleteOptionsSQL);
    }
    const deleteQuestionsSQL = `DELETE FROM psychology_questions WHERE category_id = '${localCategoryId}';`;
    executeSQL(LOCAL_DB, 'local', deleteQuestionsSQL);
    console.log(`  ✅ 本地数据已清空`);
  } catch (error: any) {
    console.error(`  ⚠️  清空失败: ${error.message.split('\n')[0]}`);
  }
  
  // 6. 插入题目
  await insertPsychologyQuestions(questions, localCategoryId);
  
  // 7. 插入选项
  await insertPsychologyOptions(options);
  
  // 8. 更新 category 的 question_count
  try {
    const updateSQL = `UPDATE psychology_question_categories SET question_count = ${questions.length} WHERE id = '${localCategoryId}';`;
    executeSQL(LOCAL_DB, 'local', updateSQL);
  } catch (error) {
    // 忽略更新失败
  }
  
  console.log(`  ✅ ${categoryCode.toUpperCase()} 同步完成！`);
}

/**
 * 插入 Psychology Questions
 */
async function insertPsychologyQuestions(questions: Question[], localCategoryId: string): Promise<void> {
  if (questions.length === 0) return;
  
  // 根据本地表结构调整列（移除可能不存在的 is_reverse）
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
    
    console.log(`  📦 插入题目批次 ${batchNum}/${totalBatches} (${batch.length} 道题)`);
    
    const values = batch.map(q => {
      const row = columns.map(col => {
        if (col === 'category_id') {
          return `'${localCategoryId}'`;
        }
        const value = q[col as keyof Question];
        if (value === null || value === undefined || value === 'null' || value === 'NULL') {
          return 'NULL';
        }
        if (typeof value === 'string') {
          // 处理空字符串和 'null' 字符串
          if (value.trim() === '' || value.toLowerCase() === 'null') {
            return 'NULL';
          }
          return `'${value.replace(/'/g, "''")}'`;
        }
        return String(value);
      }).join(', ');
      return `(${row})`;
    }).join(',\n');
    
    const sql = `INSERT OR REPLACE INTO psychology_questions (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL(LOCAL_DB, 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
      // 尝试逐条插入
      for (const q of batch) {
        try {
          const singleValues = columns.map(col => {
            if (col === 'category_id') {
              return `'${localCategoryId}'`;
            }
            const value = q[col as keyof Question];
            if (value === null || value === undefined || value === 'null' || value === 'NULL') {
              return 'NULL';
            }
            if (typeof value === 'string') {
              // 处理空字符串和 'null' 字符串
              if (value.trim() === '' || value.toLowerCase() === 'null') {
                return 'NULL';
              }
              return `'${value.replace(/'/g, "''")}'`;
            }
            return String(value);
          }).join(', ');
          const singleSQL = `INSERT OR REPLACE INTO psychology_questions (${columns.join(', ')}) VALUES (${singleValues});`;
          executeSQL(LOCAL_DB, 'local', singleSQL);
        } catch (singleError: any) {
          console.error(`      ❌ 单条插入失败 (ID: ${q.id}): ${singleError.message.split('\n')[0]}`);
        }
      }
    }
    
    if (i + batchSize < questions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 插入 Psychology Options
 */
async function insertPsychologyOptions(options: Option[]): Promise<void> {
  if (options.length === 0) return;
  
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
    
    console.log(`  📦 插入选项批次 ${batchNum}/${totalBatches} (${batch.length} 个选项)`);
    
    const values = batch.map(opt => {
      const row = columns.map(col => {
        const value = opt[col as keyof Option];
        if (value === null || value === undefined || value === 'null' || value === 'NULL') {
          return 'NULL';
        }
        if (typeof value === 'string') {
          // 处理空字符串和 'null' 字符串
          if (value.trim() === '' || value.toLowerCase() === 'null') {
            return 'NULL';
          }
          return `'${value.replace(/'/g, "''")}'`;
        }
        return String(value);
      }).join(', ');
      return `(${row})`;
    }).join(',\n');
    
    const sql = `INSERT OR REPLACE INTO psychology_question_options (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL(LOCAL_DB, 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
      // 尝试逐条插入
      for (const opt of batch) {
        try {
          const singleValues = columns.map(col => {
            const value = opt[col as keyof Option];
            if (value === null || value === undefined || value === 'null' || value === 'NULL') {
              return 'NULL';
            }
            if (typeof value === 'string') {
              // 处理空字符串和 'null' 字符串
              if (value.trim() === '' || value.toLowerCase() === 'null') {
                return 'NULL';
              }
              return `'${value.replace(/'/g, "''")}'`;
            }
            return String(value);
          }).join(', ');
          const singleSQL = `INSERT OR REPLACE INTO psychology_question_options (${columns.join(', ')}) VALUES (${singleValues});`;
          executeSQL(LOCAL_DB, 'local', singleSQL);
        } catch (singleError: any) {
          console.error(`      ❌ 单条插入失败 (ID: ${opt.id}): ${singleError.message.split('\n')[0]}`);
        }
      }
    }
    
    if (i + batchSize < options.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 同步 Learning 模块 (VARK) 数据
 */
async function syncVARKData(sourceEnv: 'staging' | 'production', limit?: number): Promise<void> {
  console.log(`\n🔄 同步 Learning 模块: VARK`);
  
  const db = sourceEnv === 'staging' ? STAGING_DB : PROD_DB;
  
  // 1. 导出题目
  let questionsSQL = `SELECT * FROM vark_questions ORDER BY id`;
  if (limit) {
    questionsSQL += ` LIMIT ${limit}`;
  }
  questionsSQL += ';';
  
  const questionsResult = executeSQL(db, sourceEnv, questionsSQL);
  const questions: VARKQuestion[] = questionsResult[0]?.results || [];
  
  if (questions.length === 0) {
    console.log(`  ⚠️  没有找到测试题`);
    return;
  }
  
  console.log(`  📊 找到 ${questions.length} 道测试题`);
  
  // 2. 导出选项
  const questionIds = questions.map(q => q.id);
  const idsList = questionIds.map(id => `'${id}'`).join(',');
  const optionsSQL = `SELECT * FROM vark_options WHERE question_id IN (${idsList}) ORDER BY question_id;`;
  const optionsResult = executeSQL(db, sourceEnv, optionsSQL);
  const options: VARKOption[] = optionsResult[0]?.results || [];
  
  console.log(`  📊 找到 ${options.length} 个选项`);
  
  // 3. 清空本地数据
  console.log(`  🗑️  清空本地数据...`);
  try {
    if (questionIds.length > 0) {
      const deleteOptionsSQL = `DELETE FROM vark_options WHERE question_id IN (${idsList});`;
      executeSQL(LOCAL_DB, 'local', deleteOptionsSQL);
    }
    const deleteQuestionsSQL = `DELETE FROM vark_questions;`;
    executeSQL(LOCAL_DB, 'local', deleteQuestionsSQL);
    console.log(`  ✅ 本地数据已清空`);
  } catch (error: any) {
    console.error(`  ⚠️  清空失败: ${error.message.split('\n')[0]}`);
  }
  
  // 4. 插入题目
  await insertVARKQuestions(questions);
  
  // 5. 插入选项
  await insertVARKOptions(options);
  
  console.log(`  ✅ VARK 同步完成！`);
}

/**
 * 插入 VARK Questions
 */
async function insertVARKQuestions(questions: VARKQuestion[]): Promise<void> {
  if (questions.length === 0) return;
  
  const columns = ['id', 'question_text', 'category', 'dimension', 'weight', 'is_active', 'created_at', 'updated_at'];
  const batchSize = 10;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    
    console.log(`  📦 插入题目批次 ${batchNum} (${batch.length} 道题)`);
    
    const values = batch.map(q => {
      const row = columns.map(col => {
        const value = q[col as keyof VARKQuestion];
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
    
    const sql = `INSERT OR REPLACE INTO vark_questions (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL(LOCAL_DB, 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
    }
    
    if (i + batchSize < questions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 插入 VARK Options
 */
async function insertVARKOptions(options: VARKOption[]): Promise<void> {
  if (options.length === 0) return;
  
  const columns = ['id', 'question_id', 'text', 'dimension', 'weight', 'is_active', 'created_at'];
  const batchSize = 20;
  
  for (let i = 0; i < options.length; i += batchSize) {
    const batch = options.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    
    console.log(`  📦 插入选项批次 ${batchNum} (${batch.length} 个选项)`);
    
    const values = batch.map(opt => {
      const row = columns.map(col => {
        const value = opt[col as keyof VARKOption];
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
    
    const sql = `INSERT OR REPLACE INTO vark_options (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL(LOCAL_DB, 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
    }
    
    if (i + batchSize < options.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 同步 Relationship 模块数据
 */
async function syncRelationshipTestType(
  testType: string,
  sourceEnv: 'staging' | 'production',
  limit?: number
): Promise<void> {
  console.log(`\n🔄 同步 Relationship 模块: ${testType}`);
  
  const db = sourceEnv === 'staging' ? STAGING_DB : PROD_DB;
  
  // 1. 导出题目
  let questionsSQL = `SELECT * FROM relationship_questions WHERE test_type = '${testType}' ORDER BY question_number`;
  if (limit) {
    questionsSQL += ` LIMIT ${limit}`;
  }
  questionsSQL += ';';
  
  const questionsResult = executeSQL(db, sourceEnv, questionsSQL);
  const questions: RelationshipQuestion[] = questionsResult[0]?.results || [];
  
  if (questions.length === 0) {
    console.log(`  ⚠️  没有找到测试题`);
    return;
  }
  
  console.log(`  📊 找到 ${questions.length} 道测试题`);
  
  // 2. 清空本地数据
  console.log(`  🗑️  清空本地数据...`);
  try {
    const deleteSQL = `DELETE FROM relationship_questions WHERE test_type = '${testType}';`;
    executeSQL(LOCAL_DB, 'local', deleteSQL);
    console.log(`  ✅ 本地数据已清空`);
  } catch (error: any) {
    if (error.message?.includes('no such table')) {
      console.log(`  ⚠️  表不存在，将跳过同步（需要先运行迁移创建表）`);
      return;
    }
    console.error(`  ⚠️  清空失败: ${error.message.split('\n')[0]}`);
  }
  
  // 3. 插入题目
  await insertRelationshipQuestions(questions);
  
  console.log(`  ✅ ${testType} 同步完成！`);
}

/**
 * 插入 Relationship Questions
 */
async function insertRelationshipQuestions(questions: RelationshipQuestion[]): Promise<void> {
  if (questions.length === 0) return;
  
  const columns = [
    'id', 'test_type', 'question_number', 'question', 'options',
    'scale_type', 'dimension', 'category', 'reverse_scored', 'weight',
    'is_active', 'created_at', 'updated_at'
  ];
  const batchSize = 10;
  
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    
    console.log(`  📦 插入题目批次 ${batchNum} (${batch.length} 道题)`);
    
    const values = batch.map(q => {
      const row = columns.map(col => {
        const value = q[col as keyof RelationshipQuestion];
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
    
    const sql = `INSERT OR REPLACE INTO relationship_questions (${columns.join(', ')}) VALUES ${values};`;
    
    try {
      executeSQL(LOCAL_DB, 'local', sql);
      console.log(`    ✅ 批次 ${batchNum} 插入成功`);
    } catch (error: any) {
      console.error(`    ❌ 批次 ${batchNum} 插入失败: ${error.message.split('\n')[0]}`);
    }
    
    if (i + batchSize < questions.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * 主函数
 */
async function main() {
  // 解析命令行参数（支持 --key=value 和 --key value 两种格式）
  const args = process.argv.slice(2);
  let module: string | undefined;
  let submodule: string | undefined;
  let source: 'staging' | 'production' = 'staging';
  let limit: number | undefined;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    // 处理 --key=value 格式
    if (arg.startsWith('--module=')) {
      module = arg.split('=')[1];
    } else if (arg.startsWith('--submodule=')) {
      submodule = arg.split('=')[1];
    } else if (arg.startsWith('--source=')) {
      source = arg.split('=')[1] as 'staging' | 'production';
    } else if (arg.startsWith('--limit=')) {
      limit = parseInt(arg.split('=')[1], 10);
    }
    // 处理 --key value 格式
    else if (arg === '--module' && args[i + 1]) {
      module = args[i + 1];
      i++;
    } else if (arg === '--submodule' && args[i + 1]) {
      submodule = args[i + 1];
      i++;
    } else if (arg === '--source' && args[i + 1]) {
      source = args[i + 1] as 'staging' | 'production';
      i++;
    } else if (arg === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
      i++;
    }
  }
  
  if (!module || !submodule) {
    console.error('❌ 错误: 需要指定 --module 和 --submodule 参数');
    console.error('\n使用方法:');
    console.error('  npx tsx scripts/sync-module-data.ts --module=psychology --submodule=phq9 --source=staging');
    console.error('  npx tsx scripts/sync-module-data.ts --module=career --submodule=disc --source=staging');
    console.error('  npx tsx scripts/sync-module-data.ts --module=learning --submodule=vark --source=staging');
    console.error('  npx tsx scripts/sync-module-data.ts --module=relationship --submodule=love_language --source=staging');
    process.exit(1);
  }
  
  // 检查环境变量（仅远程数据库需要）
  if (source !== 'local' && !process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ 错误: 需要设置 CLOUDFLARE_API_TOKEN 环境变量');
    console.error('   请访问 https://developers.cloudflare.com/fundamentals/api/get-started/create-token/ 创建 API token');
    console.error('   然后运行: export CLOUDFLARE_API_TOKEN="your-token-here"');
    process.exit(1);
  }
  
  try {
    if (module === 'psychology' || module === 'career') {
      await syncPsychologyCategory(submodule, source, limit);
    } else if (module === 'learning') {
      if (submodule === 'vark') {
        await syncVARKData(source, limit);
      } else {
        console.error(`❌ 不支持的 learning 子模块: ${submodule}`);
        process.exit(1);
      }
    } else if (module === 'relationship') {
      await syncRelationshipTestType(submodule, source, limit);
    } else {
      console.error(`❌ 不支持的模块: ${module}`);
      console.error('支持的模块: psychology, career, learning, relationship');
      process.exit(1);
    }
    
    console.log('\n✅ 同步完成！');
  } catch (error: any) {
    console.error('\n❌ 同步失败:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);

