#!/usr/bin/env tsx

/**
 * 检查各个模块的测试题同步和显示情况
 * 验证从staging环境同步的测试题数据是否完整，以及前端能否正常显示
 * 
 * 使用方法:
 *   npx tsx scripts/check-test-sync-status.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库配置
const STAGING_DB = 'getyourluck-staging';
const LOCAL_DB = 'selfatlas-local';

// 各模块选中的测试（根据用户要求：每个模块1-2个测试）
const SELECTED_TESTS = {
  psychology: ['phq9', 'happiness'],
  career: ['disc'],
  learning: ['vark'],
  relationship: ['love_language'],
};

interface TestSyncStatus {
  module: string;
  testType: string;
  local: {
    categoryExists: boolean;
    questions: number;
    options: number;
    sampleQuestion?: any;
  };
  staging: {
    categoryExists: boolean;
    questions: number;
    options: number;
  };
  syncStatus: 'synced' | 'partial' | 'missing' | 'error';
  displayStatus: 'ok' | 'warning' | 'error';
  issues: string[];
}

/**
 * 执行 SQL 查询并返回结果
 */
function executeQuery(database: string, env: 'local' | 'staging', sql: string): any[] {
  try {
    let command: string;
    
    if (env === 'local') {
      const tmpFile = path.join(path.dirname(__dirname), 'tmp', `check-sync-${Date.now()}.sql`);
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
      const envFlag = '--env=staging';
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
 * 检查 Psychology/Career 模块数据
 */
function checkPsychologyCareerModule(
  categoryCode: string,
  moduleName: string
): TestSyncStatus {
  const issues: string[] = [];
  
  // 检查本地数据
  const localCategories = executeQuery(LOCAL_DB, 'local', 
    `SELECT id, name, code, question_count FROM psychology_question_categories WHERE code = '${categoryCode}' LIMIT 1;`);
  
  let localCategoryId: string | null = null;
  let localQuestions: any[] = [];
  let localOptions: any[] = [];
  let localQuestionCount = 0;
  let localOptionCount = 0;
  let sampleQuestion: any = null;
  
  if (localCategories.length === 0) {
    issues.push(`本地数据库不存在 category: ${categoryCode}`);
  } else {
    localCategoryId = localCategories[0].id;
    const questionsResult = executeQuery(LOCAL_DB, 'local', 
      `SELECT * FROM psychology_questions WHERE category_id = '${localCategoryId}' ORDER BY order_index LIMIT 1;`);
    localQuestionCount = executeQuery(LOCAL_DB, 'local', 
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${localCategoryId}';`)[0]?.count || 0;
    
    if (questionsResult.length > 0) {
      sampleQuestion = questionsResult[0];
      const questionIds = executeQuery(LOCAL_DB, 'local', 
        `SELECT id FROM psychology_questions WHERE category_id = '${localCategoryId}';`);
      
      if (questionIds.length > 0) {
        const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
        localOptionCount = executeQuery(LOCAL_DB, 'local', 
          `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`)[0]?.count || 0;
        
        // 获取示例问题的选项
        const sampleOptions = executeQuery(LOCAL_DB, 'local', 
          `SELECT * FROM psychology_question_options WHERE question_id = '${sampleQuestion.id}' ORDER BY order_index LIMIT 3;`);
        sampleQuestion.options = sampleOptions;
      }
    }
  }
  
  // 检查staging数据
  let stagingCategoryId: string | null = null;
  let stagingQuestionCount = 0;
  let stagingOptionCount = 0;
  
  try {
    const stagingCategories = executeQuery(STAGING_DB, 'staging', 
      `SELECT id, name, code, question_count FROM psychology_question_categories WHERE code = '${categoryCode}' LIMIT 1;`);
    
    if (stagingCategories.length > 0) {
      stagingCategoryId = stagingCategories[0].id;
      stagingQuestionCount = executeQuery(STAGING_DB, 'staging', 
        `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${stagingCategoryId}';`)[0]?.count || 0;
      
      if (stagingQuestionCount > 0) {
        const questionIds = executeQuery(STAGING_DB, 'staging', 
          `SELECT id FROM psychology_questions WHERE category_id = '${stagingCategoryId}';`);
        
        if (questionIds.length > 0) {
          const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
          stagingOptionCount = executeQuery(STAGING_DB, 'staging', 
            `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`)[0]?.count || 0;
        }
      }
    }
  } catch (error: any) {
    issues.push(`无法查询staging数据: ${error.message}`);
  }
  
  // 判断同步状态
  let syncStatus: 'synced' | 'partial' | 'missing' | 'error' = 'missing';
  if (localQuestionCount === 0) {
    syncStatus = 'missing';
    issues.push('本地数据库没有测试题数据');
  } else if (localQuestionCount === stagingQuestionCount && localOptionCount === stagingOptionCount) {
    syncStatus = 'synced';
  } else if (localQuestionCount > 0) {
    syncStatus = 'partial';
    if (localQuestionCount !== stagingQuestionCount) {
      issues.push(`题目数量不匹配: 本地 ${localQuestionCount} vs Staging ${stagingQuestionCount}`);
    }
    if (localOptionCount !== stagingOptionCount) {
      issues.push(`选项数量不匹配: 本地 ${localOptionCount} vs Staging ${stagingOptionCount}`);
    }
  }
  
  // 检查显示状态
  let displayStatus: 'ok' | 'warning' | 'error' = 'ok';
  if (localQuestionCount === 0) {
    displayStatus = 'error';
  } else if (!sampleQuestion) {
    displayStatus = 'error';
    issues.push('无法获取示例题目');
  } else if (!sampleQuestion.options || sampleQuestion.options.length === 0) {
    displayStatus = 'warning';
    issues.push('题目缺少选项数据');
  } else if (!sampleQuestion.question_text_en) {
    displayStatus = 'warning';
    issues.push('题目缺少英文文本（项目要求使用英文）');
  }
  
  return {
    module: moduleName,
    testType: categoryCode,
    local: {
      categoryExists: localCategories.length > 0,
      questions: localQuestionCount,
      options: localOptionCount,
      sampleQuestion: sampleQuestion,
    },
    staging: {
      categoryExists: stagingCategoryId !== null,
      questions: stagingQuestionCount,
      options: stagingOptionCount,
    },
    syncStatus,
    displayStatus,
    issues,
  };
}

/**
 * 检查 Learning 模块 (VARK) 数据
 */
function checkLearningModule(): TestSyncStatus {
  const issues: string[] = [];
  
  // 检查本地数据
  let localQuestionCount = 0;
  let localOptionCount = 0;
  let sampleQuestion: any = null;
  
  try {
    localQuestionCount = executeQuery(LOCAL_DB, 'local', 
      `SELECT COUNT(*) as count FROM vark_questions;`)[0]?.count || 0;
    
    if (localQuestionCount > 0) {
      const questions = executeQuery(LOCAL_DB, 'local', 
        `SELECT * FROM vark_questions ORDER BY id LIMIT 1;`);
      if (questions.length > 0) {
        sampleQuestion = questions[0];
        const questionId = sampleQuestion.id;
        localOptionCount = executeQuery(LOCAL_DB, 'local', 
          `SELECT COUNT(*) as count FROM vark_options WHERE question_id = '${questionId}';`)[0]?.count || 0;
        
        const options = executeQuery(LOCAL_DB, 'local', 
          `SELECT * FROM vark_options WHERE question_id = '${questionId}' ORDER BY id LIMIT 3;`);
        sampleQuestion.options = options;
      }
    }
  } catch (error: any) {
    if (error.message?.includes('no such table')) {
      issues.push('vark_questions 表不存在');
    } else {
      issues.push(`查询本地数据失败: ${error.message}`);
    }
  }
  
  // 检查staging数据
  let stagingQuestionCount = 0;
  let stagingOptionCount = 0;
  
  try {
    stagingQuestionCount = executeQuery(STAGING_DB, 'staging', 
      `SELECT COUNT(*) as count FROM vark_questions;`)[0]?.count || 0;
    
    if (stagingQuestionCount > 0) {
      const questionIds = executeQuery(STAGING_DB, 'staging', 
        `SELECT id FROM vark_questions LIMIT 10;`);
      
      if (questionIds.length > 0) {
        const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
        stagingOptionCount = executeQuery(STAGING_DB, 'staging', 
          `SELECT COUNT(*) as count FROM vark_options WHERE question_id IN (${idsList});`)[0]?.count || 0;
      }
    }
  } catch (error: any) {
    issues.push(`无法查询staging数据: ${error.message}`);
  }
  
  // 判断同步状态
  let syncStatus: 'synced' | 'partial' | 'missing' | 'error' = 'missing';
  if (localQuestionCount === 0) {
    syncStatus = 'missing';
    issues.push('本地数据库没有测试题数据');
  } else if (localQuestionCount === stagingQuestionCount) {
    syncStatus = 'synced';
  } else {
    syncStatus = 'partial';
    issues.push(`题目数量不匹配: 本地 ${localQuestionCount} vs Staging ${stagingQuestionCount}`);
  }
  
  // 检查显示状态
  let displayStatus: 'ok' | 'warning' | 'error' = 'ok';
  if (localQuestionCount === 0) {
    displayStatus = 'error';
  } else if (!sampleQuestion) {
    displayStatus = 'error';
    issues.push('无法获取示例题目');
  } else if (!sampleQuestion.options || sampleQuestion.options.length === 0) {
    displayStatus = 'warning';
    issues.push('题目缺少选项数据');
  }
  
  return {
    module: 'learning',
    testType: 'vark',
    local: {
      categoryExists: true,
      questions: localQuestionCount,
      options: localOptionCount,
      sampleQuestion: sampleQuestion,
    },
    staging: {
      categoryExists: true,
      questions: stagingQuestionCount,
      options: stagingOptionCount,
    },
    syncStatus,
    displayStatus,
    issues,
  };
}

/**
 * 检查 Relationship 模块数据
 * 注意：Relationship模块使用psychology_questions表，通过category_id查询
 */
function checkRelationshipModule(testType: string): TestSyncStatus {
  const issues: string[] = [];
  
  // Relationship模块使用psychology_questions表，category_id映射
  const categoryIdMap: { [key: string]: string } = {
    'love_style': 'cat_love_style',
    'love_language': 'cat_love_language',
    'interpersonal': 'cat_interpersonal'
  };
  
  const categoryId = categoryIdMap[testType];
  if (!categoryId) {
    return {
      module: 'relationship',
      testType: testType,
      local: { categoryExists: false, questions: 0, options: 0 },
      staging: { categoryExists: false, questions: 0, options: 0 },
      syncStatus: 'error',
      displayStatus: 'error',
      issues: [`未知的测试类型: ${testType}`],
    };
  }
  
  // 检查本地数据
  let localQuestionCount = 0;
  let localOptionCount = 0;
  let sampleQuestion: any = null;
  let categories: any[] = [];
  
  try {
    // 检查category是否存在
    categories = executeQuery(LOCAL_DB, 'local', 
      `SELECT id, name, code FROM psychology_question_categories WHERE id = '${categoryId}' OR code = '${testType}' LIMIT 1;`);
    
    if (categories.length === 0) {
      issues.push(`Category不存在: ${categoryId}`);
    }
    
    // 查询题目数量
    localQuestionCount = executeQuery(LOCAL_DB, 'local', 
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`)[0]?.count || 0;
    
    if (localQuestionCount > 0) {
      // 获取示例题目
      const questions = executeQuery(LOCAL_DB, 'local', 
        `SELECT * FROM psychology_questions WHERE category_id = '${categoryId}' ORDER BY order_index LIMIT 1;`);
      if (questions.length > 0) {
        sampleQuestion = questions[0];
        
        // 获取选项数量
        const questionIds = executeQuery(LOCAL_DB, 'local', 
          `SELECT id FROM psychology_questions WHERE category_id = '${categoryId}';`);
        
        if (questionIds.length > 0) {
          const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
          localOptionCount = executeQuery(LOCAL_DB, 'local', 
            `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`)[0]?.count || 0;
          
          // 获取示例题目的选项
          const sampleOptions = executeQuery(LOCAL_DB, 'local', 
            `SELECT * FROM psychology_question_options WHERE question_id = '${sampleQuestion.id}' ORDER BY order_index LIMIT 3;`);
          sampleQuestion.options = sampleOptions;
        }
      }
    }
  } catch (error: any) {
    issues.push(`查询本地数据失败: ${error.message}`);
  }
  
  // 检查staging数据
  let stagingQuestionCount = 0;
  let stagingOptionCount = 0;
  
  try {
    stagingQuestionCount = executeQuery(STAGING_DB, 'staging', 
      `SELECT COUNT(*) as count FROM psychology_questions WHERE category_id = '${categoryId}';`)[0]?.count || 0;
    
    if (stagingQuestionCount > 0) {
      const questionIds = executeQuery(STAGING_DB, 'staging', 
        `SELECT id FROM psychology_questions WHERE category_id = '${categoryId}';`);
      
      if (questionIds.length > 0) {
        const idsList = questionIds.map((q: any) => `'${q.id}'`).join(',');
        stagingOptionCount = executeQuery(STAGING_DB, 'staging', 
          `SELECT COUNT(*) as count FROM psychology_question_options WHERE question_id IN (${idsList});`)[0]?.count || 0;
      }
    }
  } catch (error: any) {
    issues.push(`无法查询staging数据: ${error.message}`);
  }
  
  // 判断同步状态
  let syncStatus: 'synced' | 'partial' | 'missing' | 'error' = 'missing';
  if (localQuestionCount === 0) {
    syncStatus = 'missing';
    issues.push('本地数据库没有测试题数据');
  } else if (localQuestionCount === stagingQuestionCount && localOptionCount === stagingOptionCount) {
    syncStatus = 'synced';
  } else {
    syncStatus = 'partial';
    if (localQuestionCount !== stagingQuestionCount) {
      issues.push(`题目数量不匹配: 本地 ${localQuestionCount} vs Staging ${stagingQuestionCount}`);
    }
    if (localOptionCount !== stagingOptionCount) {
      issues.push(`选项数量不匹配: 本地 ${localOptionCount} vs Staging ${stagingOptionCount}`);
    }
  }
  
  // 检查显示状态
  let displayStatus: 'ok' | 'warning' | 'error' = 'ok';
  if (localQuestionCount === 0) {
    displayStatus = 'error';
  } else if (!sampleQuestion) {
    displayStatus = 'error';
    issues.push('无法获取示例题目');
  } else if (!sampleQuestion.question_text_en && !sampleQuestion.question_text) {
    displayStatus = 'warning';
    issues.push('题目缺少问题文本');
  } else if (!sampleQuestion.options || sampleQuestion.options.length === 0) {
    displayStatus = 'warning';
    issues.push('题目缺少选项数据');
  }
  
  return {
    module: 'relationship',
    testType: testType,
    local: {
      categoryExists: categories.length > 0,
      questions: localQuestionCount,
      options: localOptionCount,
      sampleQuestion: sampleQuestion,
    },
    staging: {
      categoryExists: true,
      questions: stagingQuestionCount,
      options: stagingOptionCount,
    },
    syncStatus,
    displayStatus,
    issues,
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 检查各模块测试题同步和显示情况...\n');
  console.log('📋 选中的测试：');
  console.log(`  - Psychology: ${SELECTED_TESTS.psychology.join(', ')}`);
  console.log(`  - Career: ${SELECTED_TESTS.career.join(', ')}`);
  console.log(`  - Learning: ${SELECTED_TESTS.learning.join(', ')}`);
  console.log(`  - Relationship: ${SELECTED_TESTS.relationship.join(', ')}\n`);
  
  const results: TestSyncStatus[] = [];
  
  // 检查 Psychology 模块
  console.log('🧠 Psychology 模块:');
  for (const testType of SELECTED_TESTS.psychology) {
    const status = checkPsychologyCareerModule(testType, 'psychology');
    results.push(status);
    
    console.log(`\n  📝 ${testType.toUpperCase()}:`);
    console.log(`    本地: ${status.local.questions} 道题, ${status.local.options} 个选项`);
    console.log(`    Staging: ${status.staging.questions} 道题, ${status.staging.options} 个选项`);
    console.log(`    同步状态: ${getSyncStatusIcon(status.syncStatus)} ${status.syncStatus}`);
    console.log(`    显示状态: ${getDisplayStatusIcon(status.displayStatus)} ${status.displayStatus}`);
    
    if (status.issues.length > 0) {
      console.log(`    问题:`);
      status.issues.forEach(issue => console.log(`      ⚠️  ${issue}`));
    }
    
    if (status.local.sampleQuestion) {
      console.log(`    示例题目:`);
      console.log(`      ID: ${status.local.sampleQuestion.id}`);
      console.log(`      文本: ${status.local.sampleQuestion.question_text_en || status.local.sampleQuestion.question_text || 'N/A'}`);
      if (status.local.sampleQuestion.options && status.local.sampleQuestion.options.length > 0) {
        console.log(`      选项数量: ${status.local.sampleQuestion.options.length}`);
      }
    }
  }
  
  // 检查 Career 模块
  console.log('\n💼 Career 模块:');
  for (const testType of SELECTED_TESTS.career) {
    const status = checkPsychologyCareerModule(testType, 'career');
    results.push(status);
    
    console.log(`\n  📝 ${testType.toUpperCase()}:`);
    console.log(`    本地: ${status.local.questions} 道题, ${status.local.options} 个选项`);
    console.log(`    Staging: ${status.staging.questions} 道题, ${status.staging.options} 个选项`);
    console.log(`    同步状态: ${getSyncStatusIcon(status.syncStatus)} ${status.syncStatus}`);
    console.log(`    显示状态: ${getDisplayStatusIcon(status.displayStatus)} ${status.displayStatus}`);
    
    if (status.issues.length > 0) {
      console.log(`    问题:`);
      status.issues.forEach(issue => console.log(`      ⚠️  ${issue}`));
    }
    
    if (status.local.sampleQuestion) {
      console.log(`    示例题目:`);
      console.log(`      ID: ${status.local.sampleQuestion.id}`);
      console.log(`      文本: ${status.local.sampleQuestion.question_text_en || status.local.sampleQuestion.question_text || 'N/A'}`);
      if (status.local.sampleQuestion.options && status.local.sampleQuestion.options.length > 0) {
        console.log(`      选项数量: ${status.local.sampleQuestion.options.length}`);
      }
    }
  }
  
  // 检查 Learning 模块
  console.log('\n📚 Learning 模块:');
  const varkStatus = checkLearningModule();
  results.push(varkStatus);
  
  console.log(`\n  📝 VARK:`);
  console.log(`    本地: ${varkStatus.local.questions} 道题, ${varkStatus.local.options} 个选项`);
  console.log(`    Staging: ${varkStatus.staging.questions} 道题, ${varkStatus.staging.options} 个选项`);
  console.log(`    同步状态: ${getSyncStatusIcon(varkStatus.syncStatus)} ${varkStatus.syncStatus}`);
  console.log(`    显示状态: ${getDisplayStatusIcon(varkStatus.displayStatus)} ${varkStatus.displayStatus}`);
  
  if (varkStatus.issues.length > 0) {
    console.log(`    问题:`);
    varkStatus.issues.forEach(issue => console.log(`      ⚠️  ${issue}`));
  }
  
  if (varkStatus.local.sampleQuestion) {
    console.log(`    示例题目:`);
    console.log(`      ID: ${varkStatus.local.sampleQuestion.id}`);
    console.log(`      文本: ${varkStatus.local.sampleQuestion.question_text || 'N/A'}`);
    if (varkStatus.local.sampleQuestion.options && varkStatus.local.sampleQuestion.options.length > 0) {
      console.log(`      选项数量: ${varkStatus.local.sampleQuestion.options.length}`);
    }
  }
  
  // 检查 Relationship 模块
  console.log('\n💕 Relationship 模块:');
  for (const testType of SELECTED_TESTS.relationship) {
    const status = checkRelationshipModule(testType);
    results.push(status);
    
    console.log(`\n  📝 ${testType}:`);
    console.log(`    本地: ${status.local.questions} 道题`);
    console.log(`    Staging: ${status.staging.questions} 道题`);
    console.log(`    同步状态: ${getSyncStatusIcon(status.syncStatus)} ${status.syncStatus}`);
    console.log(`    显示状态: ${getDisplayStatusIcon(status.displayStatus)} ${status.displayStatus}`);
    
    if (status.issues.length > 0) {
      console.log(`    问题:`);
      status.issues.forEach(issue => console.log(`      ⚠️  ${issue}`));
    }
    
    if (status.local.sampleQuestion) {
      console.log(`    示例题目:`);
      console.log(`      ID: ${status.local.sampleQuestion.id}`);
      console.log(`      文本: ${status.local.sampleQuestion.question || 'N/A'}`);
    }
  }
  
  // 生成总结报告
  console.log('\n' + '='.repeat(60));
  console.log('📊 总结报告');
  console.log('='.repeat(60));
  
  const syncedCount = results.filter(r => r.syncStatus === 'synced').length;
  const partialCount = results.filter(r => r.syncStatus === 'partial').length;
  const missingCount = results.filter(r => r.syncStatus === 'missing').length;
  const errorCount = results.filter(r => r.syncStatus === 'error').length;
  
  const displayOkCount = results.filter(r => r.displayStatus === 'ok').length;
  const displayWarningCount = results.filter(r => r.displayStatus === 'warning').length;
  const displayErrorCount = results.filter(r => r.displayStatus === 'error').length;
  
  console.log(`\n同步状态:`);
  console.log(`  ✅ 已同步: ${syncedCount}/${results.length}`);
  console.log(`  ⚠️  部分同步: ${partialCount}/${results.length}`);
  console.log(`  ❌ 缺失: ${missingCount}/${results.length}`);
  console.log(`  🔴 错误: ${errorCount}/${results.length}`);
  
  console.log(`\n显示状态:`);
  console.log(`  ✅ 正常: ${displayOkCount}/${results.length}`);
  console.log(`  ⚠️  警告: ${displayWarningCount}/${results.length}`);
  console.log(`  ❌ 错误: ${displayErrorCount}/${results.length}`);
  
  // 列出所有问题
  const allIssues = results.flatMap(r => r.issues.map(i => `${r.module}/${r.testType}: ${i}`));
  if (allIssues.length > 0) {
    console.log(`\n⚠️  发现的问题:`);
    allIssues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  console.log('\n✅ 检查完成！');
  console.log('\n💡 提示:');
  console.log('  - 如果发现数据缺失，请运行同步脚本:');
  console.log('    npx tsx scripts/sync-module-data.ts --module=<module> --submodule=<testType> --source=staging');
  console.log('  - 如果显示状态为warning或error，请检查前端API调用和后端路由配置');
}

function getSyncStatusIcon(status: string): string {
  switch (status) {
    case 'synced': return '✅';
    case 'partial': return '⚠️';
    case 'missing': return '❌';
    case 'error': return '🔴';
    default: return '❓';
  }
}

function getDisplayStatusIcon(status: string): string {
  switch (status) {
    case 'ok': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    default: return '❓';
  }
}

main().catch(console.error);

