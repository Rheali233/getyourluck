/**
 * 高优先级数据同步脚本
 * 同步心理测试题目、选项和系统配置
 */

import { execSync } from 'child_process';

// 高优先级同步表
const PRIORITY_TABLES = [
  'psychology_questions',
  'psychology_question_options', 
  'test_types'
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
    const exportCmd = `npx wrangler d1 execute selfatlas-local --command "SELECT * FROM ${tableName} ORDER BY created_at;" --json`;
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
    
    // 5. 分批插入数据
    console.log(`  📥 分批插入数据到Staging...`);
    const columns = Object.keys(rows[0]);
    const batchSize = 20; // 小批次，避免超时
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const batchNum = Math.floor(i/batchSize) + 1;
      const totalBatches = Math.ceil(rows.length/batchSize);
      
      console.log(`    📦 处理批次 ${batchNum}/${totalBatches} (${batch.length} 条)`);
      
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
        console.log(`    ✅ 批次 ${batchNum} 插入成功`);
      } catch (error) {
        console.error(`    ❌ 批次 ${batchNum} 插入失败，尝试逐条插入...`);
        
        // 逐条插入
        let successCount = 0;
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
            successCount++;
          } catch (singleError) {
            console.error(`    ❌ 单条插入失败 (ID: ${row.id || 'unknown'}):`, singleError.message.split('\n')[0]);
          }
        }
        console.log(`    📊 批次 ${batchNum} 成功插入 ${successCount}/${batch.length} 条`);
      }
      
      // 添加延迟，避免API限制
      if (i + batchSize < rows.length) {
        console.log(`    ⏳ 等待1秒...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`  ✅ 表 ${tableName} 同步完成`);
    
  } catch (error) {
    console.error(`❌ 同步表 ${tableName} 失败:`, error.message.split('\n')[0]);
  }
}

async function main() {
  console.log('🚀 开始高优先级数据同步...\n');
  
  for (const table of PRIORITY_TABLES) {
    await syncTable(table);
  }
  
  console.log('\n🎉 高优先级数据同步完成！');
  
  // 验证同步结果
  console.log('\n📊 同步结果验证:');
  for (const table of PRIORITY_TABLES) {
    try {
      const countCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "SELECT COUNT(*) as count FROM ${table};" --json`;
      const countResult = execSync(countCmd, { encoding: 'utf8' });
      const countData = JSON.parse(countResult);
      const count = countData[0]?.results[0]?.count || 0;
      console.log(`  - ${table}: ${count} 条`);
    } catch (error) {
      console.log(`  - ${table}: 查询失败`);
    }
  }
}

main().catch(console.error);
