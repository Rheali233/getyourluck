#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表和修复规则
const fixes = [
  // 移除console语句
  {
    pattern: /console\.(log|warn|error|info|debug)\([^)]*\);?\s*/g,
    replacement: '',
    description: 'Remove console statements'
  },
  // 移除未使用的变量（以下划线开头的）
  {
    pattern: /,\s*_[a-zA-Z_][a-zA-Z0-9_]*/g,
    replacement: '',
    description: 'Remove unused underscore variables'
  },
  // 移除未使用的参数（以下划线开头的）
  {
    pattern: /\(\s*_[a-zA-Z_][a-zA-Z0-9_]*\s*[,)]/g,
    replacement: (match) => {
      if (match.includes(',')) {
        return match.replace(/,\s*_[a-zA-Z_][a-zA-Z0-9_]*/, '');
      }
      return '()';
    },
    description: 'Remove unused underscore parameters'
  }
];

// 需要处理的文件扩展名
const fileExtensions = ['.ts', '.tsx'];

// 需要跳过的目录
const skipDirs = ['node_modules', 'dist', 'build', '.git'];

// 递归处理目录
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!skipDirs.includes(item)) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (fileExtensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// 处理单个文件
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 应用所有修复规则
    for (const fix of fixes) {
      const originalContent = content;
      if (typeof fix.replacement === 'function') {
        content = content.replace(fix.pattern, fix.replacement);
      } else {
        content = content.replace(fix.pattern, fix.replacement);
      }
      
      if (content !== originalContent) {
        modified = true;
        console.log(`Applied ${fix.description} to ${filePath}`);
      }
    }
    
    // 如果文件被修改，写回文件
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// 主函数
function main() {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'src');
  
  if (!fs.existsSync(frontendPath)) {
    console.error('Frontend src directory not found:', frontendPath);
    process.exit(1);
  }
  
  console.log('🔧 Starting lint warning fixes...');
  console.log('📁 Processing directory:', frontendPath);
  
  processDirectory(frontendPath);
  
  console.log('✅ Lint warning fixes completed!');
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { processFile, processDirectory };
