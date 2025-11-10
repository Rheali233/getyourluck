#!/usr/bin/env tsx

/**
 * 检查各模块在 Staging 和 Production 环境的数据情况
 * 用于确认需要同步的数据和数据源
 * 
 * 使用方法:
 *   npx tsx scripts/check-module-data.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库配置
const STAGING_DB = 'getyourluck-staging';
const PROD_DB = 'selfatlas-prod';
const LOCAL_DB = 'selfatlas-local';

// 要检查的模块和子模块（选择题目数量较少的）
const MODULES_TO_CHECK = {
  psychology: ['phq9', 'happiness'],
  career: ['disc'],
  learning: ['vark'],
  relationship: ['love_language'], // 可选，如果觉得多可以移除
};

/**
 * 执行 SQL 查询并返回结果
 */
function executeQuery(database: string, env: 'local' | 'staging' | 'production', sql: string): any[] {
  try {
    let command: string;
    
    if (env === 'local') {
      // 本地数据库
      const tmpFile = path.join(path.dirname(__dirname), 'tmp', `check-${Date.now()}.sql`);
      const tmpDir = path.dirname(tmpFile);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(tmpFile, sql, 'utf8');
      command = `npx wrangler d1 execute ${database} --file=${tmpFile} --json`;
      
      try {
        const result = execSync(command, {
          encoding: 'utf8',
          cwd: path.resolve(__dirname, '../'),
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        const data = JSON.parse(result);
        fs.unlinkSync(tmpFile);
        return data[0]?.results || [];
      } catch (error) {
        if (fs.existsSync(tmpFile)) {
          fs.unlinkSync(tmpFile);
        }
        throw error;
      }
    } else {
      // 远程数据库
      const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
      command = `npx wrangler d1 execute ${database} ${envFlag} --remote --command "${sql.replace(/"/g, '\\"')}" --json`;
      
      const result = execSync(command, {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '../'),
        stdio: ['pipe', 'pipe', 'pipe'],
        maxBuffer: 10 * 1024 * 1024,
      });
      
      const data = JSON.parse(result);
      if (data.error) {
        throw new Error(data.error.text || JSON.stringify(data.error));
      }
      return data[0]?.results || [];
    }
  } catch (error: any) {
    const errorMessage = error.message || error.toString();
    if (errorMessage.includes('CLOUDFLARE_API_TOKEN') || errorMessage.includes('non-interactive')) {
      console.warn(`⚠️  需要设置 CLOUDFLARE_API_TOKEN 环境变量才能查询 ${env} 环境`);
      return [];
    }
    throw error;
  }
}

/**
 * 检查 Psychology 模块数据
 */
function checkPsychologyModule(categoryCode: string, env: 'staging' | 'production'): { questions: number; options: number; categoryExists: boolean } {
  const db = env === 'staging' ? STAGING_DB : PROD_DB;
  
  // 检查 category 是否存在
  const categorySQL = `SELECT id, name, question_count FROM psychology_question_categories WHERE code = '${categoryCode}' LIMIT 1;`;
  const categories = executeQuery(db, env, categorySQL);
  
  if (categories.length === 0) {
    return { questions: 0, options: 0, categoryExists: false };
  }
  
  const categoryId = categories[0].id;
  
  // 检查题目数量
  const questionsSQL = `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`;
  const questionsResult = executeQuery(db, env, questionsSQL);
  const questionCount = questionsResult[0]?.count || 0;
  
  // 检查选项数量
  const questionIdsSQL = `SELECT id FROM psychology_questions WHERE category_id = '${categoryId}';`;
  const questionIds = executeQuery(db, env, questionIdsSQL);
  
  let optionCount = 0;
  if (questionIds.length > 0) {
    const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
    const optionsSQL = `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`;
    const optionsResult = executeQuery(db, env, optionsSQL);
    optionCount = optionsResult[0]?.count || 0;
  }
  
  return { questions: questionCount, options: optionCount, categoryExists: true };
}

/**
 * 检查 Learning 模块 (VARK) 数据
 */
function checkLearningModule(env: 'staging' | 'production'): { questions: number; options: number } {
  const db = env === 'staging' ? STAGING_DB : PROD_DB;
  
  const questionsSQL = `SELECT COUNT(*) as count FROM vark_questions;`;
  const questionsResult = executeQuery(db, env, questionsSQL);
  const questionCount = questionsResult[0]?.count || 0;
  
  const optionsSQL = `SELECT COUNT(*) as count FROM vark_options;`;
  const optionsResult = executeQuery(db, env, optionsSQL);
  const optionCount = optionsResult[0]?.count || 0;
  
  return { questions: questionCount, options: optionCount };
}

/**
 * 检查 Relationship 模块数据
 */
function checkRelationshipModule(testType: string, env: 'staging' | 'production'): { questions: number } {
  const db = env === 'staging' ? STAGING_DB : PROD_DB;
  
  const questionsSQL = `SELECT COUNT(*) as count FROM relationship_questions WHERE test_type = '${testType}';`;
  const questionsResult = executeQuery(db, env, questionsSQL);
  const questionCount = questionsResult[0]?.count || 0;
  
  return { questions: questionCount };
}

/**
 * 检查本地数据情况
 */
function checkLocalData() {
  console.log('\n📊 检查本地数据情况...\n');
  
  // Psychology 模块
  for (const categoryCode of MODULES_TO_CHECK.psychology) {
    const categories = executeQuery(LOCAL_DB, 'local', 
      `SELECT id, name, question_count FROM psychology_question_categories WHERE code = '${categoryCode}' LIMIT 1;`);
    
    if (categories.length === 0) {
      console.log(`  ❌ Psychology/${categoryCode}: 本地不存在 category`);
      continue;
    }
    
    const categoryId = categories[0].id;
    const questions = executeQuery(LOCAL_DB, 'local', 
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`);
    const questionCount = questions[0]?.count || 0;
    
    console.log(`  📋 Psychology/${categoryCode}: ${questionCount} 道题`);
  }
  
  // Career 模块
  for (const categoryCode of MODULES_TO_CHECK.career) {
    const categories = executeQuery(LOCAL_DB, 'local', 
      `SELECT id, name, question_count FROM psychology_question_categories WHERE code = '${categoryCode}' LIMIT 1;`);
    
    if (categories.length === 0) {
      console.log(`  ❌ Career/${categoryCode}: 本地不存在 category`);
      continue;
    }
    
    const categoryId = categories[0].id;
    const questions = executeQuery(LOCAL_DB, 'local', 
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`);
    const questionCount = questions[0]?.count || 0;
    
    console.log(`  📋 Career/${categoryCode}: ${questionCount} 道题`);
  }
  
  // Learning 模块
  const varkQuestions = executeQuery(LOCAL_DB, 'local', 
    `SELECT COUNT(*) as count FROM vark_questions;`);
  const varkCount = varkQuestions[0]?.count || 0;
  console.log(`  📋 Learning/VARK: ${varkCount} 道题`);
  
  // Relationship 模块
  for (const testType of MODULES_TO_CHECK.relationship) {
    try {
      const questions = executeQuery(LOCAL_DB, 'local', 
        `SELECT COUNT(*) as count FROM relationship_questions WHERE test_type = '${testType}';`);
      const questionCount = questions[0]?.count || 0;
      console.log(`  📋 Relationship/${testType}: ${questionCount} 道题`);
    } catch (error: any) {
      if (error.message?.includes('no such table')) {
        console.log(`  ⚠️  Relationship/${testType}: 表不存在（需要先运行迁移）`);
      } else {
        console.log(`  ❌ Relationship/${testType}: 检查失败`);
      }
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 检查各模块数据情况...\n');
  
  // 检查本地数据
  checkLocalData();
  
  console.log('\n📊 检查 Staging 环境数据情况...\n');
  
  // Psychology 模块
  console.log('🧠 Psychology 模块:');
  for (const categoryCode of MODULES_TO_CHECK.psychology) {
    const staging = checkPsychologyModule(categoryCode, 'staging');
    const prod = checkPsychologyModule(categoryCode, 'production');
    
    console.log(`  ${categoryCode.toUpperCase()}:`);
    console.log(`    Staging: ${staging.categoryExists ? `${staging.questions} 道题, ${staging.options} 个选项` : '不存在'}`);
    console.log(`    Production: ${prod.categoryExists ? `${prod.questions} 道题, ${prod.options} 个选项` : '不存在'}`);
    
    // 推荐数据源
    if (staging.questions > 0 && prod.questions > 0) {
      const recommended = staging.questions >= prod.questions ? 'Staging' : 'Production';
      console.log(`    ✅ 推荐数据源: ${recommended} (题目更多)`);
    } else if (staging.questions > 0) {
      console.log(`    ✅ 推荐数据源: Staging`);
    } else if (prod.questions > 0) {
      console.log(`    ✅ 推荐数据源: Production`);
    } else {
      console.log(`    ⚠️  两个环境都没有数据`);
    }
  }
  
  // Career 模块
  console.log('\n💼 Career 模块:');
  for (const categoryCode of MODULES_TO_CHECK.career) {
    const staging = checkPsychologyModule(categoryCode, 'staging');
    const prod = checkPsychologyModule(categoryCode, 'production');
    
    console.log(`  ${categoryCode.toUpperCase()}:`);
    console.log(`    Staging: ${staging.categoryExists ? `${staging.questions} 道题, ${staging.options} 个选项` : '不存在'}`);
    console.log(`    Production: ${prod.categoryExists ? `${prod.questions} 道题, ${prod.options} 个选项` : '不存在'}`);
    
    if (staging.questions > 0 && prod.questions > 0) {
      const recommended = staging.questions >= prod.questions ? 'Staging' : 'Production';
      console.log(`    ✅ 推荐数据源: ${recommended} (题目更多)`);
    } else if (staging.questions > 0) {
      console.log(`    ✅ 推荐数据源: Staging`);
    } else if (prod.questions > 0) {
      console.log(`    ✅ 推荐数据源: Production`);
    } else {
      console.log(`    ⚠️  两个环境都没有数据`);
    }
  }
  
  // Learning 模块
  console.log('\n📚 Learning 模块:');
  const stagingVark = checkLearningModule('staging');
  const prodVark = checkLearningModule('production');
  
  console.log(`  VARK:`);
  console.log(`    Staging: ${stagingVark.questions} 道题, ${stagingVark.options} 个选项`);
  console.log(`    Production: ${prodVark.questions} 道题, ${prodVark.options} 个选项`);
  
  if (stagingVark.questions > 0 && prodVark.questions > 0) {
    const recommended = stagingVark.questions >= prodVark.questions ? 'Staging' : 'Production';
    console.log(`    ✅ 推荐数据源: ${recommended} (题目更多)`);
  } else if (stagingVark.questions > 0) {
    console.log(`    ✅ 推荐数据源: Staging`);
  } else if (prodVark.questions > 0) {
    console.log(`    ✅ 推荐数据源: Production`);
  } else {
    console.log(`    ⚠️  两个环境都没有数据`);
  }
  
  // Relationship 模块
  console.log('\n💕 Relationship 模块:');
  for (const testType of MODULES_TO_CHECK.relationship) {
    const staging = checkRelationshipModule(testType, 'staging');
    const prod = checkRelationshipModule(testType, 'production');
    
    console.log(`  ${testType}:`);
    console.log(`    Staging: ${staging.questions} 道题`);
    console.log(`    Production: ${prod.questions} 道题`);
    
    if (staging.questions > 0 && prod.questions > 0) {
      const recommended = staging.questions >= prod.questions ? 'Staging' : 'Production';
      console.log(`    ✅ 推荐数据源: ${recommended} (题目更多)`);
    } else if (staging.questions > 0) {
      console.log(`    ✅ 推荐数据源: Staging`);
    } else if (prod.questions > 0) {
      console.log(`    ✅ 推荐数据源: Production`);
    } else {
      console.log(`    ⚠️  两个环境都没有数据`);
    }
  }
  
  console.log('\n✅ 数据检查完成！');
  console.log('\n💡 提示: 设置 CLOUDFLARE_API_TOKEN 环境变量后可以查看完整数据情况');
}

main().catch(console.error);

