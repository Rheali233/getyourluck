/**
 * 简化数据同步脚本
 * 只同步关键的系统数据，避免外键约束问题
 */

import { execSync } from 'child_process';

// 需要同步的关键表（按依赖顺序）
const SYNC_TABLES = [
  'test_types',
  'homepage_modules', 
  'homepage_config',
  'sys_configs',
  'blog_articles'
];

async function syncTable(tableName: string) {
  console.log(`\n🔄 同步表: ${tableName}`);
  
  try {
    // 1. 检查本地数据
    const localCountCmd = `npx wrangler d1 execute selfatlas-local --command "SELECT COUNT(*) as count FROM ${tableName};" --json`;
    const localResult = execSync(localCountCmd, { encoding: 'utf8' });
    const localData = JSON.parse(localResult);
    const localCount = localData[0]?.results[0]?.count || 0;
    
    if (localCount === 0) {
      console.log(`  ⚠️  本地表 ${tableName} 无数据，跳过`);
      return;
    }
    
    console.log(`  📊 本地数据量: ${localCount} 条`);
    
    // 2. 检查Staging数据
    const stagingCountCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "SELECT COUNT(*) as count FROM ${tableName};" --json`;
    const stagingResult = execSync(stagingCountCmd, { encoding: 'utf8' });
    const stagingData = JSON.parse(stagingResult);
    const stagingCount = stagingData[0]?.results[0]?.count || 0;
    
    console.log(`  📊 Staging数据量: ${stagingCount} 条`);
    
    if (localCount <= stagingCount) {
      console.log(`  ✅ Staging数据已足够，跳过`);
      return;
    }
    
    // 3. 导出本地数据
    console.log(`  📤 导出本地数据...`);
    const exportCmd = `npx wrangler d1 execute selfatlas-local --command "SELECT * FROM ${tableName};" --json`;
    const exportResult = execSync(exportCmd, { encoding: 'utf8' });
    const exportData = JSON.parse(exportResult);
    const rows = exportData[0]?.results || [];
    
    if (rows.length === 0) {
      console.log(`  ⚠️  导出数据为空，跳过`);
      return;
    }
    
    // 4. 清空Staging表
    console.log(`  🗑️  清空Staging表...`);
    const clearCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "DELETE FROM ${tableName};"`;
    execSync(clearCmd, { encoding: 'utf8' });
    
    // 5. 批量插入数据
    console.log(`  📥 插入数据到Staging...`);
    const columns = Object.keys(rows[0]);
    const batchSize = 20; // 减小批次大小
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`    📦 处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(rows.length/batchSize)} (${batch.length} 条)`);
      
      // 构建批量插入SQL
      const values = batch.map(row => 
        `(${columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) {
            return 'NULL';
          }
          return `'${String(value).replace(/'/g, "''")}'`;
        }).join(', ')})`
      ).join(',\n');
      
      const insertSQL = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values};`;
      
      // 执行插入
      const insertCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "${insertSQL.replace(/"/g, '\\"')}"`;
      try {
        execSync(insertCmd, { encoding: 'utf8' });
        console.log(`    ✅ 批次插入成功`);
      } catch (error) {
        console.error(`    ❌ 批次插入失败，尝试逐条插入...`);
        
        // 逐条插入
        for (const row of batch) {
          try {
            const singleValues = columns.map(col => {
              const value = row[col];
              if (value === null || value === undefined) {
                return 'NULL';
              }
              return `'${String(value).replace(/'/g, "''")}'`;
            }).join(', ');
            
            const singleInsertSQL = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${singleValues});`;
            const singleInsertCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "${singleInsertSQL.replace(/"/g, '\\"')}"`;
            execSync(singleInsertCmd, { encoding: 'utf8' });
          } catch (singleError) {
            console.error(`    ❌ 单条插入失败 (ID: ${row.id || 'unknown'}):`, singleError.message.split('\n')[0]);
          }
        }
      }
    }
    
    console.log(`  ✅ 表 ${tableName} 同步完成`);
    
  } catch (error) {
    console.error(`❌ 同步表 ${tableName} 失败:`, error.message.split('\n')[0]);
  }
}

async function main() {
  console.log('🚀 开始简化数据同步...\n');
  
  for (const table of SYNC_TABLES) {
    await syncTable(table);
  }
  
  console.log('\n🎉 数据同步完成！');
}

main().catch(console.error);
