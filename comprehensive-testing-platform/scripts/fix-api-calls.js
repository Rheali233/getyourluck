const fs = require('fs');
const path = require('path');

const targetDirectory = path.join(__dirname, '../frontend/src');

// 需要修复的文件和模式
const fixes = [
  {
    file: 'modules/homepage/services/testModuleIntegration.ts',
    patterns: [
      { from: "fetch(`/api/homepage/modules/${moduleId}/stats`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/${moduleId}/stats`)" },
      { from: "fetch(`/api/homepage/modules/${moduleId}/rating`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/${moduleId}/rating`)" },
      { from: "fetch(`/api/homepage/modules/${moduleId}/usage`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/${moduleId}/usage`)" },
      { from: "fetch('/api/homepage/recommendations')", to: "fetch(`${getApiBaseUrl()}/api/homepage/recommendations`)" },
      { from: "fetch('/api/homepage/analytics', {", to: "fetch(`${getApiBaseUrl()}/api/homepage/analytics`, {" },
      { from: "fetch(`/api/homepage/modules/${moduleId}/status`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/${moduleId}/status`)" },
      { from: "fetch(`/api/homepage/modules/popular?limit=${limit}`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/popular?limit=${limit}`)" },
      { from: "fetch(`/api/homepage/modules/new?limit=${limit}`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules/new?limit=${limit}`)" }
    ]
  },
  {
    file: 'modules/homepage/components/UserBehaviorTracker.tsx',
    patterns: [
      { from: "fetch('/api/homepage/analytics', {", to: "fetch(`${getApiBaseUrl()}/api/homepage/analytics`, {" }
    ]
  },
  {
    file: 'modules/homepage/components/PersonalizedRecommendations.tsx',
    patterns: [
      { from: "fetch(`/api/homepage/recommendations?${params}`)", to: "fetch(`${getApiBaseUrl()}/api/homepage/recommendations?${params}`)" },
      { from: "fetch('/api/homepage/analytics', {", to: "fetch(`${getApiBaseUrl()}/api/homepage/analytics`, {" }
    ]
  },
  {
    file: 'modules/homepage/components/TestModulesGrid.tsx',
    patterns: [
      { from: "fetch('/api/homepage/modules')", to: "fetch(`${getApiBaseUrl()}/api/homepage/modules`)" }
    ]
  }
];

function addImportIfNeeded(filePath, importStatement) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经有这个import
  if (!content.includes(importStatement)) {
    // 找到最后一个import语句的位置
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*\n/g;
    const imports = content.match(importRegex);
    
    if (imports) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;
      
      content = content.slice(0, insertIndex) + '\n' + importStatement + '\n' + content.slice(insertIndex);
    } else {
      // 如果没有import语句，在文件开头添加
      content = importStatement + '\n\n' + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added import to ${filePath}`);
  }
}

function fixFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 添加import
  addImportIfNeeded(filePath, "import { getApiBaseUrl } from '@/config/environment';");
  
  // 重新读取文件内容（因为可能添加了import）
  content = fs.readFileSync(filePath, 'utf8');
  
  patterns.forEach(pattern => {
    if (content.includes(pattern.from)) {
      content = content.replace(new RegExp(pattern.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.to);
      modified = true;
      console.log(`Fixed pattern in ${filePath}: ${pattern.from}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
}

console.log('🔧 Starting API call fixes...');

fixes.forEach(fix => {
  const filePath = path.join(targetDirectory, fix.file);
  fixFile(filePath, fix.patterns);
});

console.log('✅ API call fixes completed!');
