#!/usr/bin/env tsx
/**
 * 修复生产环境 Numerology 模块脚本
 * 确保 numerology 模块正确激活并配置
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
  const tmpFile = path.join(os.tmpdir(), `fix-numerology-${Date.now()}.sql`);
  
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
    
    console.log(`📝 执行 SQL 修复...`);
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
    console.log('✅ Numerology 模块修复成功！');
    
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
 * 读取迁移文件内容
 */
function readMigrationFile(): string {
  const migrationPath = path.resolve(__dirname, '../migrations/039_fix_numerology_module_production.sql');
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`迁移文件不存在: ${migrationPath}`);
  }
  
  return fs.readFileSync(migrationPath, 'utf8');
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
  
  // 读取迁移文件
  const sql = readMigrationFile();
  
  // 添加验证查询
  const verificationSQL = `
-- 验证修复结果
SELECT id, name, is_active, route, theme, sort_order 
FROM homepage_modules 
WHERE theme = 'numerology' OR id LIKE 'numerology%'
ORDER BY id;
`;
  
  const fullSQL = sql + '\n' + verificationSQL;
  
  executeSQL({ database, env, local }, fullSQL);
}

// 运行主函数
main();

