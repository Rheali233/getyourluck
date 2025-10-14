#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要修复的语法错误文件
const syntaxFixes = [
  // 修复空的console语句块
  {
    pattern: /console\.(log|warn|error|info|debug)\([^)]*\);\s*}/g,
    replacement: '}',
    description: 'Fix empty console blocks'
  },
  // 修复空的try-catch块
  {
    pattern: /try\s*{\s*}\s*catch\s*\([^)]*\)\s*{\s*}/g,
    replacement: '// Empty try-catch block',
    description: 'Fix empty try-catch blocks'
  },
  // 修复空的if语句块
  {
    pattern: /if\s*\([^)]*\)\s*{\s*}/g,
    replacement: (match) => {
      const condition = match.match(/if\s*\(([^)]*)\)/)[1];
      return `if (${condition}) { /* empty */ }`;
    },
    description: 'Fix empty if blocks'
  },
  // 修复未定义的变量引用
  {
    pattern: /_type/g,
    replacement: 'type',
    description: 'Fix undefined _type references'
  },
  // 修复空的eslint-disable注释
  {
    pattern: /\/\*\s*eslint-disable[^*]*\*\/\s*/g,
    replacement: '',
    description: 'Remove empty eslint-disable comments'
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
    for (const fix of syntaxFixes) {
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
      console.log(`✅ Fixed syntax errors in: ${filePath}`);
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
  
  console.log('🔧 Starting syntax error fixes...');
  console.log('📁 Processing directory:', frontendPath);
  
  processDirectory(frontendPath);
  
  console.log('✅ Syntax error fixes completed!');
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { processFile, processDirectory };
