#!/usr/bin/env node

/**
 * Prompt一致性测试脚本
 * 用于测试所有测试类型的prompt是否使用统一的语言风格
 */

const { UnifiedPromptBuilder } = require('../dist/services/UnifiedPromptBuilder');

function testPromptConsistency() {
  console.log('🧪 Testing Prompt Consistency...\n');
  
  const testTypes = UnifiedPromptBuilder.getSupportedTestTypes();
  const results = [];
  
  for (const testType of testTypes) {
    console.log(`Testing ${testType.toUpperCase()}...`);
    
    try {
      // 创建示例答案和上下文
      const answers = [
        { questionId: '1', answer: 'A' },
        { questionId: '2', answer: 'B' },
        { questionId: '3', answer: 'C' }
      ];
      const context = { testType, language: 'en' };
      
      // 生成prompt
      const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, testType);
      
      // 检查一致性
      const consistency = checkPromptConsistency(prompt, testType);
      results.push({ testType, ...consistency });
      
      console.log(`  ✅ ${testType}: ${consistency.score}/100`);
      
    } catch (error) {
      console.log(`  ❌ ${testType}: Error - ${error.message}`);
      results.push({ 
        testType, 
        score: 0, 
        isValid: false, 
        issues: [`Error: ${error.message}`] 
      });
    }
  }
  
  // 生成报告
  console.log('\n📊 Consistency Report:');
  console.log('==================');
  
  const validTests = results.filter(r => r.isValid).length;
  const averageScore = results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`Valid Tests: ${validTests}`);
  console.log(`Average Score: ${averageScore.toFixed(1)}/100`);
  console.log(`Consistency Rate: ${((validTests / results.length) * 100).toFixed(1)}%\n`);
  
  // 详细结果
  results.forEach(result => {
    console.log(`${result.testType.toUpperCase()}:`);
    console.log(`  Score: ${result.score || 0}/100`);
    console.log(`  Status: ${result.isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (result.issues && result.issues.length > 0) {
      console.log(`  Issues:`);
      result.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    }
    console.log('');
  });
  
  // 检查系统角色一致性
  console.log('🔍 System Role Consistency:');
  console.log('==========================');
  
  const systemRole = UnifiedPromptBuilder.getSystemRole();
  console.log(`System Role: ${systemRole.substring(0, 100)}...`);
  
  // 检查所有prompt是否使用相同的系统角色
  const allPromptsUseSameRole = results.every(result => {
    if (!result.prompt) return false;
    return result.prompt.includes('warm, supportive, and professional');
  });
  
  console.log(`All prompts use unified system role: ${allPromptsUseSameRole ? '✅ Yes' : '❌ No'}`);
  
  return results;
}

function checkPromptConsistency(prompt, testType) {
  const checks = [
    { name: 'System Role', pattern: /warm, supportive, and professional/, weight: 20 },
    { name: 'Language Style', pattern: /gentle, encouraging tone/, weight: 15 },
    { name: 'JSON Format', pattern: /Return ONLY a valid JSON object/, weight: 20 },
    { name: 'Warm Tone', pattern: /warm, supportive language/, weight: 15 },
    { name: 'Rules Section', pattern: /Rules:/, weight: 15 },
    { name: 'Instructions', pattern: /IMPORTANT INSTRUCTIONS:/, weight: 10 },
    { name: 'Schema', pattern: /JSON format:/, weight: 5 }
  ];
  
  let score = 0;
  const issues = [];
  
  checks.forEach(check => {
    if (prompt.match(check.pattern)) {
      score += check.weight;
    } else {
      issues.push(`Missing ${check.name}`);
    }
  });
  
  return {
    score,
    isValid: score >= 80,
    issues
  };
}

// 运行测试
if (require.main === module) {
  testPromptConsistency();
}

module.exports = { testPromptConsistency, checkPromptConsistency };
