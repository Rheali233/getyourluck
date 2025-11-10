/**
 * 查询 Cloudflare Workers Invocation 日志
 * 使用方法: CLOUDFLARE_API_TOKEN=your_token ts-node scripts/query-invocation.ts <invocation_id>
 */

const invocationId = process.argv[2] || 'iYYntE7_UA4bHuVXPdZ67_Dm7jO7ZaMgMRlYaOPY';
const accountId = '257a0c6111ab57bbec3f4e18492c6ac9';
const serviceName = 'selfatlas-backend-staging';
const environment = 'staging';
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!apiToken) {
  console.error('❌ 错误: 需要设置 CLOUDFLARE_API_TOKEN 环境变量');
  console.error('   请运行: export CLOUDFLARE_API_TOKEN="your-token-here"');
  process.exit(1);
}

async function queryInvocation() {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/services/${serviceName}/environments/${environment}/invocations/${invocationId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 请求失败:', response.status, response.statusText);
      console.error('响应:', errorText);
      return;
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ 查询失败:', error);
  }
}

queryInvocation();

