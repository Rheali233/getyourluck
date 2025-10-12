/**
 * Prompt审查机制
 * 确保所有prompt符合统一标准，提供一致性检查和建议
 */

import { UnifiedPromptBuilder } from './UnifiedPromptBuilder';

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100分
  issues: ValidationIssue[];
  suggestions: string[];
  compliance: ComplianceReport;
}

export interface ValidationIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'language' | 'format' | 'structure' | 'content';
  message: string;
  line?: number;
  suggestion?: string;
}

export interface ComplianceReport {
  systemRole: boolean;
  languageStyle: boolean;
  jsonFormat: boolean;
  warmTone: boolean;
  rulesSection: boolean;
  instructions: boolean;
  schema: boolean;
}

export class PromptValidator {
  private static readonly REQUIRED_ELEMENTS = {
    systemRole: ['warm', 'supportive', 'professional', 'psychological', 'career', 'assessment', 'analyst'],
    languageStyle: ['gentle', 'encouraging', 'tone', 'acknowledges', 'courage'],
    jsonFormat: ['Return ONLY a valid JSON object', 'Do not include any prose', 'markdown', 'code fences'],
    warmTone: ['gentle, encouraging tone', 'warm, supportive language'],
    rulesSection: ['Rules:', 'Output ONLY', 'Ensure every field', 'Base content on'],
    instructions: ['IMPORTANT INSTRUCTIONS:', 'SPECIAL INSTRUCTIONS:', 'ADDITIONAL REQUIREMENTS:'],
    schema: ['JSON format:', 'schema', 'structure']
  };

  /**
   * 验证prompt是否符合统一标准
   */
  static validatePrompt(prompt: string, testType: string): ValidationResult {
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // 检查系统角色
    const systemRoleCompliance = this.checkSystemRole(prompt);
    if (!systemRoleCompliance.isValid) {
      issues.push(...systemRoleCompliance.issues);
      score -= 15;
    }

    // 检查语言风格
    const languageStyleCompliance = this.checkLanguageStyle(prompt);
    if (!languageStyleCompliance.isValid) {
      issues.push(...languageStyleCompliance.issues);
      score -= 15;
    }

    // 检查JSON格式要求
    const jsonFormatCompliance = this.checkJsonFormat(prompt);
    if (!jsonFormatCompliance.isValid) {
      issues.push(...jsonFormatCompliance.issues);
      score -= 20;
    }

    // 检查温暖语调
    const warmToneCompliance = this.checkWarmTone(prompt);
    if (!warmToneCompliance.isValid) {
      issues.push(...warmToneCompliance.issues);
      score -= 10;
    }

    // 检查规则部分
    const rulesCompliance = this.checkRulesSection(prompt);
    if (!rulesCompliance.isValid) {
      issues.push(...rulesCompliance.issues);
      score -= 10;
    }

    // 检查指令部分
    const instructionsCompliance = this.checkInstructions(prompt);
    if (!instructionsCompliance.isValid) {
      issues.push(...instructionsCompliance.issues);
      score -= 10;
    }

    // 检查Schema
    const schemaCompliance = this.checkSchema(prompt);
    if (!schemaCompliance.isValid) {
      issues.push(...schemaCompliance.issues);
      score -= 10;
    }

    // 检查测试类型特定要求
    const testTypeCompliance = this.checkTestTypeSpecific(prompt, testType);
    if (!testTypeCompliance.isValid) {
      issues.push(...testTypeCompliance.issues);
      score -= 10;
    }

    // 生成建议
    suggestions.push(...this.generateSuggestions(issues));

    // 生成合规报告
    const compliance: ComplianceReport = {
      systemRole: systemRoleCompliance.isValid,
      languageStyle: languageStyleCompliance.isValid,
      jsonFormat: jsonFormatCompliance.isValid,
      warmTone: warmToneCompliance.isValid,
      rulesSection: rulesCompliance.isValid,
      instructions: instructionsCompliance.isValid,
      schema: schemaCompliance.isValid
    };

    return {
      isValid: issues.filter(i => i.type === 'critical').length === 0,
      score: Math.max(0, score),
      issues,
      suggestions,
      compliance
    };
  }

  /**
   * 检查系统角色
   */
  private static checkSystemRole(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.systemRole;
    
    for (const element of requiredElements) {
      if (!prompt.toLowerCase().includes(element.toLowerCase())) {
        issues.push({
          type: 'critical',
          category: 'language',
          message: `Missing required system role element: "${element}"`,
          suggestion: 'Include the unified system role definition'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查语言风格
   */
  private static checkLanguageStyle(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.languageStyle;
    
    for (const element of requiredElements) {
      if (!prompt.toLowerCase().includes(element.toLowerCase())) {
        issues.push({
          type: 'warning',
          category: 'language',
          message: `Missing language style element: "${element}"`,
          suggestion: 'Include gentle, encouraging language guidance'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查JSON格式要求
   */
  private static checkJsonFormat(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.jsonFormat;
    
    for (const element of requiredElements) {
      if (!prompt.includes(element)) {
        issues.push({
          type: 'critical',
          category: 'format',
          message: `Missing JSON format requirement: "${element}"`,
          suggestion: 'Add strict JSON format requirements'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查温暖语调
   */
  private static checkWarmTone(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.warmTone;
    
    for (const element of requiredElements) {
      if (!prompt.toLowerCase().includes(element.toLowerCase())) {
        issues.push({
          type: 'warning',
          category: 'language',
          message: `Missing warm tone element: "${element}"`,
          suggestion: 'Include warm, supportive tone guidance'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查规则部分
   */
  private static checkRulesSection(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.rulesSection;
    
    for (const element of requiredElements) {
      if (!prompt.includes(element)) {
        issues.push({
          type: 'critical',
          category: 'structure',
          message: `Missing rules section element: "${element}"`,
          suggestion: 'Add comprehensive rules section'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查指令部分
   */
  private static checkInstructions(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.instructions;
    
    let hasInstructions = false;
    for (const element of requiredElements) {
      if (prompt.includes(element)) {
        hasInstructions = true;
        break;
      }
    }

    if (!hasInstructions) {
      issues.push({
        type: 'warning',
        category: 'structure',
        message: 'Missing instructions section',
        suggestion: 'Add IMPORTANT INSTRUCTIONS or SPECIAL INSTRUCTIONS section'
      });
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查Schema
   */
  private static checkSchema(prompt: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const requiredElements = this.REQUIRED_ELEMENTS.schema;
    
    for (const element of requiredElements) {
      if (!prompt.toLowerCase().includes(element.toLowerCase())) {
        issues.push({
          type: 'critical',
          category: 'content',
          message: `Missing schema element: "${element}"`,
          suggestion: 'Include JSON schema definition'
        });
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 检查测试类型特定要求
   */
  private static checkTestTypeSpecific(prompt: string, testType: string): { isValid: boolean; issues: ValidationIssue[] } {
    const issues: ValidationIssue[] = [];
    const config = UnifiedPromptBuilder.getTestConfig(testType);
    
    if (!config) {
      issues.push({
        type: 'critical',
        category: 'content',
        message: `Unknown test type: ${testType}`,
        suggestion: 'Use a supported test type'
      });
      return { isValid: false, issues };
    }

    // 检查是否包含测试类型名称
    if (!prompt.includes(config.testType)) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: `Missing test type name: ${config.testType}`,
        suggestion: `Include "${config.testType}" in the prompt`
      });
    }

    // 检查是否包含理论背景
    if (config.theory && !prompt.includes(config.theory)) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: `Missing theory background: ${config.theory}`,
        suggestion: `Include "${config.theory}" in the prompt`
      });
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 生成改进建议
   */
  private static generateSuggestions(issues: ValidationIssue[]): string[] {
    const suggestions: string[] = [];
    
    if (issues.some(i => i.category === 'language')) {
      suggestions.push('Review language consistency and ensure warm, supportive tone throughout');
    }
    
    if (issues.some(i => i.category === 'format')) {
      suggestions.push('Ensure strict JSON format requirements are clearly stated');
    }
    
    if (issues.some(i => i.category === 'structure')) {
      suggestions.push('Add missing structural elements like rules section and instructions');
    }
    
    if (issues.some(i => i.category === 'content')) {
      suggestions.push('Include all required content elements like schema and test type information');
    }

    return suggestions;
  }

  /**
   * 批量验证所有测试类型的prompt
   */
  static validateAllPrompts(): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {};
    const testTypes = UnifiedPromptBuilder.getSupportedTestTypes();
    
    for (const testType of testTypes) {
      // 创建示例答案和上下文
      const answers = [
        { questionId: '1', answer: 'A' },
        { questionId: '2', answer: 'B' }
      ];
      const context = { testType };
      
      try {
        const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, testType);
        results[testType] = this.validatePrompt(prompt, testType);
      } catch (error) {
        results[testType] = {
          isValid: false,
          score: 0,
          issues: [{
            type: 'critical',
            category: 'content',
            message: `Failed to generate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
            suggestion: 'Check test type configuration'
          }],
          suggestions: ['Fix test type configuration'],
          compliance: {
            systemRole: false,
            languageStyle: false,
            jsonFormat: false,
            warmTone: false,
            rulesSection: false,
            instructions: false,
            schema: false
          }
        };
      }
    }
    
    return results;
  }

  /**
   * 生成验证报告
   */
  static generateReport(results: Record<string, ValidationResult>): string {
    let report = '# Prompt Validation Report\n\n';
    
    // 总体统计
    const totalTests = Object.keys(results).length;
    const validTests = Object.values(results).filter(r => r.isValid).length;
    const averageScore = Object.values(results).reduce((sum, r) => sum + r.score, 0) / totalTests;
    
    report += `## Overall Statistics\n`;
    report += `- Total Tests: ${totalTests}\n`;
    report += `- Valid Tests: ${validTests}\n`;
    report += `- Average Score: ${averageScore.toFixed(1)}/100\n`;
    report += `- Compliance Rate: ${((validTests / totalTests) * 100).toFixed(1)}%\n\n`;
    
    // 详细结果
    report += `## Detailed Results\n\n`;
    
    for (const [testType, result] of Object.entries(results)) {
      report += `### ${testType.toUpperCase()}\n`;
      report += `- **Score**: ${result.score}/100\n`;
      report += `- **Status**: ${result.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
      
      if (result.issues.length > 0) {
        report += `- **Issues**:\n`;
        for (const issue of result.issues) {
          report += `  - ${issue.type.toUpperCase()}: ${issue.message}\n`;
        }
      }
      
      if (result.suggestions.length > 0) {
        report += `- **Suggestions**:\n`;
        for (const suggestion of result.suggestions) {
          report += `  - ${suggestion}\n`;
        }
      }
      
      report += `\n`;
    }
    
    return report;
  }
}
