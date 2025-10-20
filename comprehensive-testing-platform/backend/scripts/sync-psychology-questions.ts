/**
 * 同步心理测试题目数据
 * 分批处理，避免超时
 */

import { execSync } from 'child_process';

async function syncPsychologyQuestions() {
  console.log('🔄 开始同步心理测试题目...\n');
  
  try {
    // 1. 导出本地数据
    console.log('📤 导出本地心理测试题目...');
    const exportCmd = `npx wrangler d1 execute selfatlas-local --command "SELECT * FROM psychology_questions ORDER BY created_at;" --json`;
    const exportResult = execSync(exportCmd, { encoding: 'utf8' });
    const exportData = JSON.parse(exportResult);
    const rows = exportData[0]?.results || [];
    
    console.log(`📊 本地数据量: ${rows.length} 条`);
    
    if (rows.length === 0) {
      console.log('⚠️  本地无数据，跳过');
      return;
    }
    
    // 2. 检查Staging现有数据
    const stagingCountCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "SELECT COUNT(*) as count FROM psychology_questions;" --json`;
    const stagingResult = execSync(stagingCountCmd, { encoding: 'utf8' });
    const stagingData = JSON.parse(stagingResult);
    const stagingCount = stagingData[0]?.results[0]?.count || 0;
    
    console.log(`📊 Staging现有数据量: ${stagingCount} 条`);
    
    if (rows.length <= stagingCount) {
      console.log('✅ Staging数据已足够，跳过');
      return;
    }
    
    // 3. 清空Staging表
    console.log('🗑️  清空Staging表...');
    const clearCmd = `npx wrangler d1 execute getyourluck-staging --remote --command "DELETE FROM psychology_questions;"`;
    execSync(clearCmd, { encoding: 'utf8' });
    
    // 4. 分批插入数据
    console.log('📥 分批插入数据到Staging...');
    const columns = Object.keys(rows[0]);
    const batchSize = 10; // 小批次，避免超时
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const batchNum = Math.floor(i/batchSize) + 1;
      const totalBatches = Math.ceil(rows.length/batchSize);
      
      console.log(`  📦 处理批次 ${batchNum}/${totalBatches} (${batch.length} 条)`);
      
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
      
      const insertSQL = `INSERT INTO psychology_questions (${columns.join(', ')}) VALUES ${values};`;
      
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
            
            const singleInsertSQL = `INSERT INTO psychology_questions (${columns.join(', ')}) VALUES (${singleValues});`;
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
    
    console.log('\n✅ 心理测试题目同步完成！');
    
  } catch (error) {
    console.error('❌ 同步失败:', error.message.split('\n')[0]);
  }
}

syncPsychologyQuestions().catch(console.error);
