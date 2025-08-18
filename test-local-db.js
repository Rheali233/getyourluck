#!/usr/bin/env node

// 本地数据库测试脚本
console.log('🧪 开始测试本地数据库配置...');

// 设置环境变量
process.env.NODE_ENV = 'development';
process.env.LOCAL_DATABASE = 'true';

async function testLocalDatabase() {
  try {
    console.log('📦 导入模块...');
    
    // 动态导入模块（避免TypeScript编译问题）
    const { createLocalDatabase, checkLocalDatabaseHealth } = await import('./src/config/database.local.ts');
    const { LocalDatabaseService } = await import('./src/services/LocalDatabaseService.ts');
    
    console.log('✅ 模块导入成功');
    
    // 测试数据库连接
    console.log('🔌 测试数据库连接...');
    const db = createLocalDatabase();
    console.log('✅ 数据库连接创建成功');
    
    // 测试健康检查
    console.log('🏥 测试健康检查...');
    const isHealthy = checkLocalDatabaseHealth(db);
    console.log('✅ 健康检查通过:', isHealthy);
    
    // 测试本地数据库服务
    console.log('🔧 测试本地数据库服务...');
    const localDbService = new LocalDatabaseService();
    await localDbService.connect();
    console.log('✅ 本地数据库服务连接成功');
    
    // 测试表初始化
    console.log('📋 测试表初始化...');
    await localDbService.initializeTables();
    console.log('✅ 表初始化成功');
    
    // 测试数据插入
    console.log('📝 测试数据插入...');
    await localDbService.insertTestData();
    console.log('✅ 测试数据插入成功');
    
    // 测试查询
    console.log('🔍 测试数据查询...');
    const stats = await localDbService.query('SELECT * FROM statistics');
    console.log('✅ 查询成功，统计数据:', stats);
    
    // 清理
    await localDbService.disconnect();
    db.close();
    
    console.log('🎉 所有测试通过！本地数据库配置正确。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
testLocalDatabase();
