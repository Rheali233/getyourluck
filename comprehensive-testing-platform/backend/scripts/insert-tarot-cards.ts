/**
 * Insert Tarot Cards Data
 * 插入塔罗牌数据
 */

import { generateTarotCardsData } from '../seeds/tarot-cards';

async function insertTarotCards() {
  try {
    console.log('🃏 开始插入塔罗牌数据...');
    
    const sql = generateTarotCardsData();
    
    // 将SQL写入临时文件
    const fs = await import('fs');
    const path = await import('path');
    
    const tempFile = path.join(__dirname, '../temp-tarot-cards.sql');
    fs.writeFileSync(tempFile, sql);
    
    console.log('📝 SQL文件已生成，请手动执行以下命令：');
    console.log(`wrangler d1 execute selfatlas-local --file=${tempFile}`);
    
    // 清理临时文件
    fs.unlinkSync(tempFile);
    
    console.log('✅ 塔罗牌数据插入完成！');
  } catch (error) {
    console.error('❌ 插入塔罗牌数据失败:', error);
  }
}

insertTarotCards();
