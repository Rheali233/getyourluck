#!/usr/bin/env tsx
/**
 * 激活 Numerology 模块脚本
 * 将 homepage_modules 表中 numerology 模块的 is_active 设置为 1
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExecuteOptions {
  database: string;
  env?: 'staging' | 'production';
  local?: boolean;
}

/**
 * 执行 SQL 命令
 */
function executeSQL(options: ExecuteOptions, sql: string): void {
  const { database, env, local = false } = options;
  
  // 创建临时 SQL 文件
  const tmpFile = path.join(os.tmpdir(), `activate-numerology-${Date.now()}.sql`);
  
  try {
    // 写入 SQL 到临时文件
    fs.writeFileSync(tmpFile, sql, 'utf8');
    
    // 构建命令
    let command: string;
    if (local) {
      command = `npx wrangler d1 execute ${database} --local --file=${tmpFile}`;
    } else {
      const envFlag = env ? `--env=${env}` : '';
      command = `npx wrangler d1 execute ${database} ${envFlag} --remote --file=${tmpFile}`;
    }
    
    console.log(`📝 执行 SQL 更新...`);
    console.log(`📋 数据库: ${database}`);
    console.log(`🌍 环境: ${local ? '本地' : env || '远程'}`);
    console.log('');
    
    // 执行命令
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../'),
      stdio: 'inherit',
    });
    
    console.log('');
    console.log('✅ Numerology 模块已成功激活！');
    
  } catch (error: any) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  } finally {
    // 清理临时文件
    try {
      if (fs.existsSync(tmpFile)) {
        fs.unlinkSync(tmpFile);
      }
    } catch (e) {
      // 忽略清理错误
    }
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  
  // 解析参数
  let database = 'selfatlas-local';
  let local = true;
  let env: 'staging' | 'production' | undefined;
  
  if (args.includes('--staging')) {
    database = 'selfatlas-staging';
    local = false;
    env = 'staging';
  } else if (args.includes('--production')) {
    database = 'selfatlas-prod';
    local = false;
    env = 'production';
  } else if (args.includes('--remote')) {
    database = 'selfatlas-staging';
    local = false;
    env = 'staging';
  }
  
  // SQL 更新语句
  const sql = `-- Activate numerology module and update to match current English content
UPDATE homepage_modules
SET 
  is_active = 1,
  name = 'Numerology & Destiny',
  description = 'Traditional numerology decoding life patterns, luck cycles, and meaningful name impacts',
  features_data = json('["BaZi","Chinese Zodiac","Name Analysis","ZiWei"]'),
  route = '/tests/numerology',
  estimated_time = '10-15 minutes',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 'numerology';

-- 验证更新结果
SELECT id, name, is_active, route FROM homepage_modules WHERE id = 'numerology';
`;
  
  executeSQL({ database, env, local }, sql);
}

// 运行主函数
main();

