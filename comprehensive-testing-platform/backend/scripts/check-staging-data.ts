#!/usr/bin/env tsx

/**
 * 检查 Staging 环境与 Production 环境的题目和选项数据一致性
 * 以 Production 环境为参照，检查 Staging 环境的数据是否正确
 * 
 * 使用方法:
 *   npm run check:staging
 *   或
 *   npx tsx scripts/check-staging-data.ts
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要检查的表
const TABLES_TO_CHECK = [
  'psychology_questions',
  'psychology_question_options',
  'vark_questions',
  'vark_options',
  'psychology_question_categories',
];

// 数据库配置
const STAGING_DB = 'selfatlas-staging';
const PROD_DB = 'selfatlas-prod';

interface TableStats {
  staging: number;
  production: number;
  difference: number;
}

interface QuestionData {
  id: string;
  [key: string]: any;
}

interface ComparisonResult {
  table: string;
  stats: TableStats;
  missingInStaging: QuestionData[];
  extraInStaging: QuestionData[];
  differences: Array<{
    id: string;
    field: string;
    stagingValue: any;
    productionValue: any;
  }>;
}

/**
 * 执行 SQL 查询并返回结果
 */
function executeQuery(database: string, env: 'staging' | 'production', sql: string): any[] {
  try {
    const envFlag = env === 'staging' ? '--env=staging' : '--env=production';
    const command = `npx wrangler d1 execute ${database} ${envFlag} --remote --command "${sql.replace(/"/g, '\\"')}" --json`;
    
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../'),
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    
    const data = JSON.parse(result);
    
    // 检查是否有错误
    if (data.error) {
      const errorText = data.error.text || JSON.stringify(data.error);
      throw new Error(errorText);
    }
    
    return data[0]?.results || [];
  } catch (error: any) {
    const errorMessage = error.message || error.toString();
    const stderr = error.stderr ? error.stderr.toString() : '';
    const stdout = error.stdout ? error.stdout.toString() : '';
    
    // 尝试从 stdout 解析错误（有时候错误会在 stdout 中）
    try {
      if (stdout) {
        const parsed = JSON.parse(stdout);
        if (parsed.error) {
          const errorText = parsed.error.text || JSON.stringify(parsed.error);
          
          // 检查是否是认证错误
          if (errorText.includes('CLOUDFLARE_API_TOKEN') || errorText.includes('non-interactive')) {
            console.error(`\n❌ 认证错误: 需要在非交互式环境中设置 CLOUDFLARE_API_TOKEN 环境变量`);
            console.error(`   请运行: export CLOUDFLARE_API_TOKEN=your_token`);
            console.error(`   或设置: CLOUDFLARE_API_TOKEN=your_token npm run check:staging\n`);
            return [];
          }
          
          throw new Error(errorText);
        }
      }
    } catch (parseError) {
      // 如果解析失败，继续使用原始错误
    }
    
    // 如果错误信息很短，尝试显示 stderr
    if (errorMessage === 'Command failed' && stderr) {
      console.error(`❌ Error executing query on ${env} ${database}:`);
      console.error(`   Command: ${sql.substring(0, 100)}...`);
      console.error(`   Error: ${stderr.substring(0, 200)}`);
    } else {
      console.error(`❌ Error executing query on ${env} ${database}:`, errorMessage.substring(0, 200));
    }
    
    return [];
  }
}

/**
 * 获取表的统计数据
 */
function getTableStats(table: string): TableStats {
  const stagingCount = executeQuery(
    STAGING_DB,
    'staging',
    `SELECT COUNT(*) as count FROM ${table} WHERE is_active = 1`
  )[0]?.count || 0;

  const prodCount = executeQuery(
    PROD_DB,
    'production',
    `SELECT COUNT(*) as count FROM ${table} WHERE is_active = 1`
  )[0]?.count || 0;

  return {
    staging: Number(stagingCount),
    production: Number(prodCount),
    difference: Number(stagingCount) - Number(prodCount),
  };
}

/**
 * 获取表的所有数据
 */
function getTableData(table: string, env: 'staging' | 'production'): QuestionData[] {
  const database = env === 'staging' ? STAGING_DB : PROD_DB;
  return executeQuery(database, env, `SELECT * FROM ${table} WHERE is_active = 1 ORDER BY id`);
}

/**
 * 比较两个数据对象，找出差异字段
 */
function compareDataObjects(
  staging: QuestionData,
  production: QuestionData,
  ignoreFields: string[] = ['created_at', 'updated_at']
): Array<{ field: string; stagingValue: any; productionValue: any }> {
  const differences: Array<{ field: string; stagingValue: any; productionValue: any }> = [];
  
  // 获取所有字段
  const allFields = new Set([
    ...Object.keys(staging),
    ...Object.keys(production),
  ]);

  for (const field of allFields) {
    if (ignoreFields.includes(field)) continue;
    
    const stagingValue = staging[field];
    const productionValue = production[field];
    
    // 处理 null/undefined
    const stagingVal = stagingValue === null || stagingValue === undefined ? null : String(stagingValue);
    const prodVal = productionValue === null || productionValue === undefined ? null : String(productionValue);
    
    if (stagingVal !== prodVal) {
      differences.push({
        field,
        stagingValue: stagingValue,
        productionValue: productionValue,
      });
    }
  }
  
  return differences;
}

/**
 * 比较表数据
 */
function compareTableData(table: string): ComparisonResult {
  console.log(`\n📊 检查表: ${table}`);
  
  const stats = getTableStats(table);
  console.log(`   Staging: ${stats.staging} 条, Production: ${stats.production} 条, 差异: ${stats.difference}`);
  
  const stagingData = getTableData(table, 'staging');
  const productionData = getTableData(table, 'production');
  
  // 创建映射以便快速查找
  const stagingMap = new Map<string, QuestionData>();
  const productionMap = new Map<string, QuestionData>();
  
  stagingData.forEach(item => stagingMap.set(item.id, item));
  productionData.forEach(item => productionMap.set(item.id, item));
  
  // 找出 Staging 中缺失的记录
  const missingInStaging: QuestionData[] = [];
  productionMap.forEach((prodItem, id) => {
    if (!stagingMap.has(id)) {
      missingInStaging.push(prodItem);
    }
  });
  
  // 找出 Staging 中多余的记录
  const extraInStaging: QuestionData[] = [];
  stagingMap.forEach((stagingItem, id) => {
    if (!productionMap.has(id)) {
      extraInStaging.push(stagingItem);
    }
  });
  
  // 找出字段差异
  const differences: Array<{
    id: string;
    field: string;
    stagingValue: any;
    productionValue: any;
  }> = [];
  
  stagingMap.forEach((stagingItem, id) => {
    const prodItem = productionMap.get(id);
    if (prodItem) {
      const fieldDiffs = compareDataObjects(stagingItem, prodItem);
      fieldDiffs.forEach(diff => {
        differences.push({
          id,
          ...diff,
        });
      });
    }
  });
  
  return {
    table,
    stats,
    missingInStaging,
    extraInStaging,
    differences,
  };
}

/**
 * 生成报告
 */
function generateReport(results: ComparisonResult[]): string {
  let report = '\n';
  report += '='.repeat(80) + '\n';
  report += '📋 STAGING vs PRODUCTION 数据一致性检查报告\n';
  report += '='.repeat(80) + '\n';
  report += `检查时间: ${new Date().toLocaleString('zh-CN')}\n`;
  report += `检查表数: ${results.length}\n\n`;
  
  // 统计汇总
  let totalMissing = 0;
  let totalExtra = 0;
  let totalDifferences = 0;
  
  results.forEach(result => {
    totalMissing += result.missingInStaging.length;
    totalExtra += result.extraInStaging.length;
    totalDifferences += result.differences.length;
  });
  
  report += '📊 汇总统计:\n';
  report += `  - Staging 缺失的记录: ${totalMissing} 条\n`;
  report += `  - Staging 多余的记录: ${totalExtra} 条\n`;
  report += `  - 字段值差异: ${totalDifferences} 处\n\n`;
  
  // 详细报告
  results.forEach(result => {
    report += '\n' + '-'.repeat(80) + '\n';
    report += `📋 表: ${result.table}\n`;
    report += '-'.repeat(80) + '\n';
    report += `数据量: Staging=${result.stats.staging}, Production=${result.stats.production}, 差异=${result.stats.difference}\n\n`;
    
    if (result.missingInStaging.length > 0) {
      report += `❌ Staging 缺失的记录 (${result.missingInStaging.length} 条):\n`;
      result.missingInStaging.slice(0, 10).forEach(item => {
        report += `  - ID: ${item.id}`;
        if (item.question_text_en || item.question_text) {
          report += ` - ${(item.question_text_en || item.question_text || '').substring(0, 50)}...`;
        }
        if (item.option_text_en || item.option_text) {
          report += ` - ${(item.option_text_en || item.option_text || '').substring(0, 50)}...`;
        }
        report += '\n';
      });
      if (result.missingInStaging.length > 10) {
        report += `  ... 还有 ${result.missingInStaging.length - 10} 条记录\n`;
      }
      report += '\n';
    }
    
    if (result.extraInStaging.length > 0) {
      report += `⚠️  Staging 多余的记录 (${result.extraInStaging.length} 条):\n`;
      result.extraInStaging.slice(0, 10).forEach(item => {
        report += `  - ID: ${item.id}`;
        if (item.question_text_en || item.question_text) {
          report += ` - ${(item.question_text_en || item.question_text || '').substring(0, 50)}...`;
        }
        if (item.option_text_en || item.option_text) {
          report += ` - ${(item.option_text_en || item.option_text || '').substring(0, 50)}...`;
        }
        report += '\n';
      });
      if (result.extraInStaging.length > 10) {
        report += `  ... 还有 ${result.extraInStaging.length - 10} 条记录\n`;
      }
      report += '\n';
    }
    
    if (result.differences.length > 0) {
      report += `🔍 字段值差异 (${result.differences.length} 处):\n`;
      const differencesByRecord = new Map<string, typeof result.differences>();
      result.differences.forEach(diff => {
        if (!differencesByRecord.has(diff.id)) {
          differencesByRecord.set(diff.id, []);
        }
        differencesByRecord.get(diff.id)!.push(diff);
      });
      
      Array.from(differencesByRecord.entries()).slice(0, 10).forEach(([id, diffs]) => {
        report += `  ID: ${id}\n`;
        diffs.forEach(diff => {
          report += `    - ${diff.field}:\n`;
          report += `      Staging:    ${String(diff.stagingValue).substring(0, 100)}\n`;
          report += `      Production: ${String(diff.productionValue).substring(0, 100)}\n`;
        });
        report += '\n';
      });
      if (differencesByRecord.size > 10) {
        report += `  ... 还有 ${differencesByRecord.size - 10} 条记录存在差异\n`;
      }
    }
    
    if (
      result.missingInStaging.length === 0 &&
      result.extraInStaging.length === 0 &&
      result.differences.length === 0
    ) {
      report += '✅ 数据一致，无差异\n';
    }
  });
  
  report += '\n' + '='.repeat(80) + '\n';
  report += '检查完成\n';
  report += '='.repeat(80) + '\n';
  
  return report;
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始检查 Staging 与 Production 环境的数据一致性...\n');
  console.log('⚠️  注意: 此操作需要访问远程数据库，可能需要一些时间...\n');
  
  const results: ComparisonResult[] = [];
  
  for (const table of TABLES_TO_CHECK) {
    try {
      const result = compareTableData(table);
      results.push(result);
    } catch (error: any) {
      console.error(`❌ 检查表 ${table} 时出错:`, error.message);
      results.push({
        table,
        stats: { staging: 0, production: 0, difference: 0 },
        missingInStaging: [],
        extraInStaging: [],
        differences: [],
      });
    }
  }
  
  // 生成报告
  const report = generateReport(results);
  console.log(report);
  
  // 保存报告到文件
  const reportPath = path.resolve(__dirname, '../staging-data-check-report.txt');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\n📄 详细报告已保存到: ${reportPath}\n`);
  
  // 检查是否有严重问题
  const hasIssues = results.some(
    r => r.missingInStaging.length > 0 || r.extraInStaging.length > 0 || r.differences.length > 0
  );
  
  if (hasIssues) {
    console.log('⚠️  发现数据不一致问题，请查看报告了解详情\n');
    process.exit(1);
  } else {
    console.log('✅ 所有数据一致，Staging 环境数据正确\n');
    process.exit(0);
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 执行出错:', error);
  process.exit(1);
});

