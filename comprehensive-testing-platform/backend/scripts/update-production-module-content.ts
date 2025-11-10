#!/usr/bin/env tsx
/**
 * 更新生产环境模块名称和描述
 * 根据实际显示内容更新数据库
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 执行 SQL 命令
 */
function executeSQL(sql: string): void {
  const database = 'selfatlas-prod';
  const env = 'production';
  
  // 创建临时 SQL 文件
  const tmpFile = path.join(os.tmpdir(), `update-module-content-${Date.now()}.sql`);
  
  try {
    // 写入 SQL 到临时文件
    fs.writeFileSync(tmpFile, sql, 'utf8');
    
    // 构建命令
    const command = `npx wrangler d1 execute ${database} --env=${env} --remote --file=${tmpFile}`;
    
    console.log(`📝 更新生产环境模块名称和描述...`);
    console.log(`📋 数据库: ${database}`);
    console.log(`🌍 环境: ${env}`);
    console.log('');
    
    // 执行命令
    const result = execSync(command, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '../'),
      stdio: 'inherit',
    });
    
    console.log('');
    console.log('✅ 生产环境模块内容更新成功！');
    
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
  const migrationPath = path.resolve(__dirname, '../migrations/041_update_production_module_names_descriptions.sql');
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`迁移文件不存在: ${migrationPath}`);
  }
  
  return fs.readFileSync(migrationPath, 'utf8');
}

/**
 * 主函数
 */
function main() {
  // 读取迁移文件
  const sql = readMigrationFile();
  
  // 添加验证查询
  const verificationSQL = `
-- 验证更新结果
SELECT id, name, description 
FROM homepage_modules 
WHERE is_active = 1 
ORDER BY sort_order;
`;
  
  const fullSQL = sql + '\n' + verificationSQL;
  
  executeSQL(fullSQL);
}

// 运行主函数
main();

