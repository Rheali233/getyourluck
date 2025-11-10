/**
 * 检查 migration 003 的状态
 * 检查表是否存在，以及迁移是否已记录
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_ID = '003_question_bank_tables';
const TABLES_TO_CHECK = [
  'psychology_question_categories',
  'psychology_questions',
  'psychology_question_options',
  'psychology_question_configs',
  'psychology_question_versions'
];

interface CheckResult {
  tablesExist: boolean;
  migrationRecorded: boolean;
  tables: string[];
  missingTables: string[];
}

/**
 * 检查表是否存在（通过 wrangler d1 execute）
 */
function checkTablesExist(): CheckResult {
  const tables: string[] = [];
  const missingTables: string[] = [];

  console.log('🔍 Checking if tables exist in staging database...\n');

  for (const tableName of TABLES_TO_CHECK) {
    try {
      // 尝试查询表结构
      const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`;
      const command = `wrangler d1 execute getyourluck-staging --env staging --command "${sql}"`;
      
      console.log(`  Checking table: ${tableName}...`);
      const result = execSync(command, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      if (result.includes(tableName)) {
        tables.push(tableName);
        console.log(`    ✅ Table ${tableName} exists`);
      } else {
        missingTables.push(tableName);
        console.log(`    ❌ Table ${tableName} does not exist`);
      }
    } catch (error) {
      console.error(`    ⚠️  Error checking table ${tableName}:`, error);
      missingTables.push(tableName);
    }
  }

  return {
    tablesExist: tables.length === TABLES_TO_CHECK.length,
    migrationRecorded: false, // Will be checked separately
    tables,
    missingTables
  };
}

/**
 * 检查迁移是否已记录
 */
function checkMigrationRecorded(): boolean {
  try {
    console.log('\n🔍 Checking if migration is recorded...\n');
    
    const sql = `SELECT id FROM migrations WHERE id='${MIGRATION_ID}';`;
    const command = `wrangler d1 execute getyourluck-staging --env staging --command "${sql}"`;
    
    const result = execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    if (result.includes(MIGRATION_ID)) {
      console.log(`  ✅ Migration ${MIGRATION_ID} is recorded`);
      return true;
    } else {
      console.log(`  ❌ Migration ${MIGRATION_ID} is NOT recorded`);
      return false;
    }
  } catch (error) {
    console.error('  ⚠️  Error checking migration record:', error);
    return false;
  }
}

/**
 * 手动标记迁移为已执行
 */
function markMigrationAsApplied(): void {
  try {
    console.log('\n📝 Marking migration as applied...\n');
    
    const sql = `INSERT OR IGNORE INTO migrations (id, name, applied_at) VALUES ('${MIGRATION_ID}', 'Question bank tables', datetime('now'));`;
    const command = `wrangler d1 execute getyourluck-staging --env staging --command "${sql}"`;
    
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    
    console.log(`  ✅ Migration ${MIGRATION_ID} marked as applied`);
  } catch (error) {
    console.error('  ❌ Error marking migration as applied:', error);
    throw error;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('='.repeat(60));
  console.log('Migration 003 Status Check');
  console.log('='.repeat(60));
  console.log(`Migration ID: ${MIGRATION_ID}`);
  console.log(`Tables to check: ${TABLES_TO_CHECK.join(', ')}\n`);

  // 检查表是否存在
  const tableCheck = checkTablesExist();
  
  // 检查迁移是否已记录
  const migrationRecorded = checkMigrationRecorded();

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Tables exist: ${tableCheck.tablesExist ? '✅ Yes' : '❌ No'}`);
  console.log(`Migration recorded: ${migrationRecorded ? '✅ Yes' : '❌ No'}`);
  
  if (tableCheck.missingTables.length > 0) {
    console.log(`\nMissing tables: ${tableCheck.missingTables.join(', ')}`);
  }

  // 建议
  console.log('\n' + '='.repeat(60));
  console.log('Recommendation');
  console.log('='.repeat(60));
  
  if (tableCheck.tablesExist && !migrationRecorded) {
    console.log('✅ All tables exist but migration is not recorded.');
    console.log('💡 Solution: Mark the migration as applied manually.');
    console.log('\nRun this command:');
    console.log(`  wrangler d1 execute getyourluck-staging --env staging --command "INSERT OR IGNORE INTO migrations (id, name, applied_at) VALUES ('${MIGRATION_ID}', 'Question bank tables', datetime('now'));"`);
    
    // 询问是否自动执行
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('\nDo you want to mark the migration as applied now? (y/N): ', (answer: string) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        try {
          markMigrationAsApplied();
          console.log('\n✅ Migration marked as applied successfully!');
        } catch (error) {
          console.error('\n❌ Failed to mark migration as applied:', error);
        }
      } else {
        console.log('\n⚠️  Migration not marked. Please run the command manually.');
      }
      readline.close();
    });
  } else if (!tableCheck.tablesExist) {
    console.log('❌ Some tables are missing. The migration needs to be executed.');
    console.log('💡 Solution: Run the migration manually or fix the migration file.');
  } else {
    console.log('✅ Everything looks good! Tables exist and migration is recorded.');
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

export { checkTablesExist, checkMigrationRecorded, markMigrationAsApplied };

