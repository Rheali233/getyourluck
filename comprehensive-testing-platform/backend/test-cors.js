/**
 * CORS测试脚本
 * 用于验证OPTIONS请求是否正确处理
 */

const testCors = async () => {
  const baseUrl = 'http://localhost:8787';
  
  console.log('🧪 Testing CORS OPTIONS request...');
  
  try {
    // 测试OPTIONS预检请求
    const response = await fetch(`${baseUrl}/api/v1/tests/phq9/submit`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ OPTIONS Response Status:', response.status);
    console.log('✅ OPTIONS Response Headers:');
    
    // 检查CORS头
    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Credentials',
      'Access-Control-Max-Age'
    ];
    
    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      console.log(`  ${header}: ${value || 'NOT SET'}`);
    });
    
    if (response.status === 204) {
      console.log('✅ CORS OPTIONS request handled successfully!');
    } else {
      console.log('❌ CORS OPTIONS request failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ CORS test failed:', error.message);
  }
};

// 运行测试
testCors();
