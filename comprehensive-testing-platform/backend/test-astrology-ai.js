/**
 * 占星模块AI集成测试脚本
 * 测试AI分析功能是否正常工作
 */

const testAstrologyAI = async () => {
  console.log('🧪 开始测试占星模块AI集成...\n');

  const baseURL = 'http://localhost:8787'; // 本地开发服务器
  const testCases = [
    {
      name: '运势分析测试',
      endpoint: '/api/v1/ai/astrology/fortune',
      method: 'POST',
      data: {
        zodiacSign: 'aries',
        timeframe: 'daily',
        userContext: { test: true }
      }
    },
    {
      name: '配对分析测试',
      endpoint: '/api/v1/ai/astrology/compatibility',
      method: 'POST',
      data: {
        sign1: 'aries',
        sign2: 'leo',
        relationType: 'love',
        userContext: { test: true }
      }
    },
    {
      name: '星盘分析测试',
      endpoint: '/api/v1/ai/astrology/birth-chart',
      method: 'POST',
      data: {
        birthData: {
          birthDate: '1990-03-21',
          birthTime: '10:30',
          birthLocation: 'New York, NY'
        },
        userContext: { test: true }
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📋 测试: ${testCase.name}`);
    console.log(`🔗 端点: ${testCase.endpoint}`);
    
    try {
      const response = await fetch(`${baseURL}${testCase.endpoint}`, {
        method: testCase.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ 测试通过');
        console.log(`📊 响应数据:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log('❌ 测试失败');
        console.log(`🚨 错误:`, result.error || 'Unknown error');
        console.log(`📝 响应:`, JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.log('❌ 测试异常');
      console.log(`🚨 错误:`, error.message);
    }
    
    console.log('─'.repeat(50));
  }

  // 测试健康检查
  console.log('📋 测试: AI服务健康检查');
  try {
    const response = await fetch(`${baseURL}/api/v1/ai/health`);
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ 健康检查通过');
      console.log(`📊 可用服务:`, result.data.services);
    } else {
      console.log('❌ 健康检查失败');
      console.log(`🚨 错误:`, result.error || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ 健康检查异常');
    console.log(`🚨 错误:`, error.message);
  }

  console.log('\n🎉 占星模块AI集成测试完成！');
};

// 运行测试
testAstrologyAI().catch(console.error);
