#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const processorsDir = path.join(__dirname, '../src/services/testEngine/processors');

// 需要修复的文件列表
const filesToFix = [
  'HappinessResultProcessor.ts',
  'InterpersonalResultProcessor.ts', 
  'LeadershipResultProcessor.ts',
  'RavenResultProcessor.ts',
  'CognitiveResultProcessor.ts',
  'VARKResultProcessor.ts',
  'LoveStyleResultProcessor.ts',
  'LoveLanguageResultProcessor.ts',
  'HollandResultProcessor.ts',
  'DISCResultProcessor.ts'
];

// 修复函数
function fixHardcodedContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 修复 generateInterpretation 方法
  content = content.replace(
    /private generateInterpretation\([^)]+\): string \{[^}]+\}/gs,
    (match) => {
      const methodName = match.match(/private generateInterpretation\(([^)]+)\)/);
      if (methodName) {
        const params = methodName[1].split(',')[0].trim().split(' ')[0];
        return `private generateInterpretation(${methodName[1]}): string {
    // 移除硬编码解释，让AI生成个性化分析
    return \`AI analysis will provide detailed interpretation for \${${params}}\`;
  }`;
      }
      return match;
    }
  );
  
  // 修复 generateRecommendations 方法
  content = content.replace(
    /private generateRecommendations\([^)]+\): string\[\] \{[^}]+\}/gs,
    (match) => {
      const methodName = match.match(/private generateRecommendations\(([^)]+)\)/);
      if (methodName) {
        const params = methodName[1].split(',')[0].trim().split(' ')[0];
        return `private generateRecommendations(${methodName[1]}): string[] {
    // 移除硬编码推荐，让AI生成个性化建议
    return [\`AI analysis will provide personalized recommendations for \${${params}}\`];
  }`;
      }
      return match;
    }
  );
  
  // 修复其他可能的硬编码方法
  content = content.replace(
    /private generateCareerImplications\([^)]+\): string\[\] \{[^}]+\}/gs,
    (match) => {
      const methodName = match.match(/private generateCareerImplications\(([^)]+)\)/);
      if (methodName) {
        const params = methodName[1].split(',')[0].trim().split(' ')[0];
        return `private generateCareerImplications(${methodName[1]}): string[] {
    // 移除硬编码职业建议，让AI生成个性化分析
    return [\`AI analysis will provide personalized career implications for \${${params}}\`];
  }`;
      }
      return match;
    }
  );
  
  content = content.replace(
    /private generateRelationshipInsights\([^)]+\): string\[\] \{[^}]+\}/gs,
    (match) => {
      const methodName = match.match(/private generateRelationshipInsights\(([^)]+)\)/);
      if (methodName) {
        const params = methodName[1].split(',')[0].trim().split(' ')[0];
        return `private generateRelationshipInsights(${methodName[1]}): string[] {
    // 移除硬编码关系洞察，让AI生成个性化分析
    return [\`AI analysis will provide personalized relationship insights for \${${params}}\`];
  }`;
      }
      return match;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed hardcoded content in ${path.basename(filePath)}`);
}

// 执行修复
filesToFix.forEach(fileName => {
  const filePath = path.join(processorsDir, fileName);
  if (fs.existsSync(filePath)) {
    fixHardcodedContent(filePath);
  } else {
    console.log(`File not found: ${fileName}`);
  }
});

console.log('Hardcoded content fix completed!');
