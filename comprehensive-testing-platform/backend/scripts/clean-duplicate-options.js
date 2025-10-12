/**
 * 清理EQ测试中重复选项的脚本
 * 执行SQL清理操作，删除重复的选项记录
 */

const { exec } = require('child_process');
const path = require('path');

async function cleanDuplicateOptions() {
  console.log('🧹 开始清理EQ测试中重复的选项记录...');
  
  try {
    // 检查是否在正确的目录
    const currentDir = process.cwd();
    console.log(`📍 当前目录: ${currentDir}`);
    
    // 检查wrangler配置文件
    const wranglerConfig = path.join(currentDir, 'wrangler.toml');
    if (!require('fs').existsSync(wranglerConfig)) {
      throw new Error('未找到wrangler.toml配置文件，请确保在backend目录中运行此脚本');
    }
    
    // 执行SQL清理脚本
    const sqlFile = path.join(currentDir, 'scripts', 'clean-duplicate-eq-options.sql');
    if (!require('fs').existsSync(sqlFile)) {
      throw new Error('未找到SQL清理脚本文件');
    }
    
    console.log('📋 执行SQL清理脚本...');
    
    // 使用wrangler执行SQL
    const command = `npx wrangler d1 execute selfatlas-local --file=${sqlFile}`;
    
    exec(command, { cwd: currentDir }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ 执行SQL清理脚本失败:', error);
        return;
      }
      
      if (stderr) {
        console.error('⚠️ SQL执行警告:', stderr);
      }
      
      console.log('✅ SQL清理脚本执行完成');
      console.log('📊 输出结果:');
      console.log(stdout);
      
      console.log('🎉 EQ测试重复选项清理完成！');
      console.log('💡 现在每个题目应该只显示5个选项，不再有重复');
    });
    
  } catch (error) {
    console.error('❌ 清理重复选项失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  cleanDuplicateOptions();
}

module.exports = { cleanDuplicateOptions };
