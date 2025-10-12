#!/usr/bin/env node

/**
 * Prompt验证脚本
 * 用于验证所有测试类型的prompt是否符合统一标准
 */

const { UnifiedPromptBuilder } = require('../dist/services/UnifiedPromptBuilder');
const { PromptValidator } = require('../dist/services/PromptValidator');

async function validatePrompts() {
  console.log('🔍 Starting Prompt Validation...\n');
  
  try {
    // 验证所有prompt
    const results = PromptValidator.validateAllPrompts();
    
    // 生成报告
    const report = PromptValidator.generateReport(results);
    console.log(report);
    
    // 检查是否有严重问题
    const criticalIssues = Object.values(results).some(result => 
      result.issues.some(issue => issue.type === 'critical')
    );
    
    if (criticalIssues) {
      console.log('❌ Critical issues found! Please fix them before proceeding.');
      process.exit(1);
    } else {
      console.log('✅ All prompts passed validation!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// 运行验证
validatePrompts();
