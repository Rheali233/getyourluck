/**
 * 快速修复脚本：确保 numerology 测试类型存在于数据库中
 * 用于解决 "Test type 'numerology' not found" 错误
 */

import { DatabaseService } from '../src/services/DatabaseService';

async function fixNumerologyTestType() {
  console.log('🔧 开始修复 numerology 测试类型配置...\n');

  // 创建数据库服务实例（需要环境变量）
  const env = {
    DB: process.env.DB as any, // D1Database
    ENVIRONMENT: process.env.ENVIRONMENT || 'development'
  };

  const dbService = new DatabaseService(env);
  
  try {
    await dbService.initialize();
    console.log('✅ 数据库初始化成功\n');

    // 检查 numerology 是否存在
    const existing = await dbService.testTypes.findById('numerology');
    
    if (existing) {
      console.log('✅ numerology 测试类型已存在，无需修复');
      console.log('   配置信息:', JSON.stringify(existing, null, 2));
      return;
    }

    // 插入 numerology 测试类型
    console.log('📝 插入 numerology 测试类型...');
    const sql = `
      INSERT OR REPLACE INTO test_types (
        id, name, category, description, config_data, 
        is_active, sort_order, created_at, updated_at
      ) VALUES (
        'numerology',
        'Numerology Analysis',
        'numerology',
        'Number symbolism for personal reflection',
        '{"subtype": "numerology", "analysisTypes": ["bazi", "zodiac", "name", "ziwei"], "estimatedTime": 600}',
        1,
        13,
        datetime('now'),
        datetime('now')
      );
    `;

    await dbService.execute(sql);
    console.log('✅ numerology 测试类型插入成功\n');

    // 验证插入结果
    const inserted = await dbService.testTypes.findById('numerology');
    if (inserted) {
      console.log('✅ 验证成功：numerology 测试类型已存在于数据库中');
      console.log('   配置信息:', JSON.stringify(inserted, null, 2));
    } else {
      console.error('❌ 验证失败：numerology 测试类型未找到');
    }

  } catch (error) {
    console.error('❌ 修复失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  fixNumerologyTestType()
    .then(() => {
      console.log('\n✨ 修复完成！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ 修复失败:', error);
      process.exit(1);
    });
}

export { fixNumerologyTestType };

