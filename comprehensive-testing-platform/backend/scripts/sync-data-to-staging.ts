/**
 * 数据同步脚本 - 将本地数据库的系统数据同步到Staging环境
 * 只同步系统端数据，不同步用户操作数据
 */

import { execSync } from 'child_process';

// 需要同步的系统数据表
const SYSTEM_TABLES = [
  'psychology_questions',
  'psychology_question_options', 
  'psychology_question_categories',
  'psychology_question_configs',
  'psychology_question_versions',
  'raven_questions',
  'vark_questions',
  'vark_options',
  'tarot_cards',
  'tarot_categories',
  'tarot_spreads',
  'cognitive_tasks',
  'test_types',
  'homepage_modules',
  'homepage_config',
  'sys_configs'
];

// 需要同步的博客数据表
const BLOG_TABLES = [
  'blog_articles'
];

async function syncTableData(tableName: string) {
  console.log(`🔄 同步表: ${tableName}`);
  
  try {
    // 1. 导出本地数据
    console.log(`  📤 导出本地数据...`);
    const exportCmd = `npx wrangler d1 execute selfatlas-local --command "SELECT * FROM ${tableName};" --json`;
    const exportResult = execSync(exportCmd, { encoding: 'utf8' });
    const exportData = JSON.parse(exportResult);
    
    if (!exportData[0]?.results || exportData[0].results.length === 0) {
      console.log(`  ⚠️  本地表 ${tableName} 无数据，跳过`);
      return;
    }
    
    console.log(`  📊 本地数据量: ${exportData[0].results.length} 条`);
    
    // 2. 检查Staging现有数据
    console.log(`  🔍 检查Staging现有数据...`);
    const checkCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "SELECT COUNT(*) as count FROM ${tableName};" --json`;
    const checkResult = execSync(checkCmd, { encoding: 'utf8' });
    const checkData = JSON.parse(checkResult);
    const stagingCount = checkData[0]?.results[0]?.count || 0;
    
    console.log(`  📊 Staging现有数据量: ${stagingCount} 条`);
    
    // 3. 如果Staging有数据，先清空
    if (stagingCount > 0) {
      console.log(`  🗑️  清空Staging表 ${tableName}...`);
      const clearCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "DELETE FROM ${tableName};"`;
      execSync(clearCmd, { encoding: 'utf8' });
    }
    
    // 4. 批量插入数据到Staging
    console.log(`  📥 插入数据到Staging...`);
    const rows = exportData[0].results;
    const batchSize = 50; // 每批处理50条
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`    📦 处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(rows.length/batchSize)} (${batch.length} 条)`);
      
      // 构建批量插入SQL
      const columns = Object.keys(batch[0]);
      const values = batch.map(row => 
        `(${columns.map(col => `'${String(row[col]).replace(/'/g, "''")}'`).join(', ')})`
      ).join(',\n');
      
      const insertSQL = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values};`;
      
      // 执行插入
      const insertCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "${insertSQL.replace(/"/g, '\\"')}"`;
      try {
        execSync(insertCmd, { encoding: 'utf8' });
      } catch (error) {
        console.error(`    ❌ 批次插入失败:`, error.message);
        // 尝试逐条插入
        for (const row of batch) {
          try {
            const singleInsertSQL = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(col => `'${String(row[col]).replace(/'/g, "''")}'`).join(', ')});`;
            const singleInsertCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "${singleInsertSQL.replace(/"/g, '\\"')}"`;
            execSync(singleInsertCmd, { encoding: 'utf8' });
          } catch (singleError) {
            console.error(`    ❌ 单条插入失败 (ID: ${row.id}):`, singleError.message);
          }
        }
      }
    }
    
    console.log(`  ✅ 表 ${tableName} 同步完成`);
    
  } catch (error) {
    console.error(`❌ 同步表 ${tableName} 失败:`, error.message);
  }
}

async function main() {
  console.log('🚀 开始数据同步到Staging环境...\n');
  
  // 同步系统数据表
  console.log('📋 同步系统数据表...');
  for (const table of SYSTEM_TABLES) {
    await syncTableData(table);
    console.log(''); // 空行分隔
  }
  
  // 同步博客数据表
  console.log('📝 同步博客数据表...');
  for (const table of BLOG_TABLES) {
    await syncTableData(table);
    console.log(''); // 空行分隔
  }
  
  console.log('🎉 数据同步完成！');
}

// 运行同步
main().catch(console.error);
