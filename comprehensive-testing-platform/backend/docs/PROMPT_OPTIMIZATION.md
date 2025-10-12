# Prompt优化文档

## 概述

本文档描述了测试平台prompt系统的全面优化，实现了统一的语言风格、构建机制和审查机制。

## 优化内容

### 1. 统一Prompt构建器 (UnifiedPromptBuilder)

#### 特性
- **统一系统角色**: 所有测试使用相同的AI分析师角色
- **一致语言风格**: 温暖、支持性、专业的语调
- **标准化格式**: 严格的JSON输出要求
- **模块化配置**: 每个测试类型有独立的配置

#### 使用方法
```typescript
import { UnifiedPromptBuilder } from './services/UnifiedPromptBuilder';

// 构建prompt
const answers = [
  { questionId: '1', answer: 'A' },
  { questionId: '2', answer: 'B' }
];
const context = { testType: 'mbti', language: 'en' };
const prompt = UnifiedPromptBuilder.buildPrompt(answers, context, 'mbti');

// 获取系统角色
const systemRole = UnifiedPromptBuilder.getSystemRole();

// 获取支持的测试类型
const testTypes = UnifiedPromptBuilder.getSupportedTestTypes();
```

### 2. Prompt审查机制 (PromptValidator)

#### 功能
- **一致性检查**: 验证prompt是否符合统一标准
- **评分系统**: 0-100分的合规性评分
- **问题识别**: 自动识别语言、格式、结构问题
- **改进建议**: 提供具体的优化建议

#### 使用方法
```typescript
import { PromptValidator } from './services/PromptValidator';

// 验证单个prompt
const result = PromptValidator.validatePrompt(prompt, 'mbti');
console.log(`Score: ${result.score}/100`);
console.log(`Valid: ${result.isValid}`);

// 批量验证所有prompt
const allResults = PromptValidator.validateAllPrompts();
const report = PromptValidator.generateReport(allResults);
console.log(report);
```

### 3. 测试脚本

#### 运行一致性测试
```bash
cd backend
node scripts/test-prompt-consistency.js
```

#### 运行验证脚本
```bash
cd backend
node scripts/validate-prompts.js
```

## 优化前后对比

### 优化前的问题
1. **系统角色不统一**: 有些测试有角色定义，有些没有
2. **语言风格不一致**: 学术化 vs 温暖支持 vs 实用导向
3. **输出格式要求不统一**: 严格JSON vs 灵活格式
4. **规则说明不一致**: 详细规则 vs 简单说明

### 优化后的改进
1. **统一系统角色**: 所有测试使用相同的温暖、支持性专业角色
2. **一致语言风格**: 所有prompt都使用温暖、支持性的语调
3. **标准化格式**: 所有测试都要求严格的JSON输出
4. **统一规则**: 所有prompt都有完整的规则说明

## 支持的测试类型

| 测试类型 | 配置键 | 理论背景 | 描述 |
|---------|--------|----------|------|
| MBTI | `mbti` | Jung's cognitive functions | 人格类型测试 |
| PHQ-9 | `phq9` | depression screening | 抑郁筛查测试 |
| EQ | `eq` | Goleman's five core dimensions | 情商测试 |
| Happiness | `happiness` | Seligman's PERMA model | 幸福指数测试 |
| Love Language | `loveLanguage` | Gary Chapman's Five Love Languages | 爱情语言测试 |
| Love Style | `loveStyle` | John Alan Lee's six love styles | 爱情风格测试 |
| Interpersonal | `interpersonal` | interpersonal communication | 人际技能测试 |
| Holland | `holland` | John Holland's RIASEC theory | 职业兴趣测试 |
| DISC | `disc` | William Marston's DISC theory | 行为风格测试 |
| Leadership | `leadership` | leadership and management theory | 领导力测试 |
| VARK | `vark` | learning style preferences | 学习风格测试 |
| Raven | `raven` | cognitive ability assessment | 认知能力测试 |
| Cognitive | `cognitive` | cognitive ability assessment | 综合认知测试 |

## 配置结构

每个测试类型的配置包含：
- `testType`: 测试类型名称
- `theory`: 理论背景
- `description`: 测试描述
- `instructions`: 特殊指令
- `schema`: JSON输出结构
- `specialRequirements`: 特殊要求

## 验证标准

### 必需元素
- **系统角色**: 包含"warm, supportive, professional"等关键词
- **语言风格**: 包含"gentle, encouraging tone"等指导
- **JSON格式**: 包含"Return ONLY a valid JSON object"等要求
- **温暖语调**: 包含"warm, supportive language"等指导
- **规则部分**: 包含"Rules:"和具体规则
- **指令部分**: 包含"IMPORTANT INSTRUCTIONS"等
- **Schema**: 包含"JSON format:"和结构定义

### 评分权重
- 系统角色: 20分
- JSON格式: 20分
- 语言风格: 15分
- 温暖语调: 15分
- 规则部分: 15分
- 指令部分: 10分
- Schema: 5分

### 合规标准
- 总分 ≥ 80分: 合规
- 总分 < 80分: 不合规

## 最佳实践

### 1. 添加新测试类型
1. 在`UnifiedPromptBuilder.ts`中添加配置
2. 在`AIService.ts`中添加分析方法
3. 运行验证脚本确保合规性

### 2. 修改现有prompt
1. 使用`UnifiedPromptBuilder.buildPrompt()`方法
2. 运行验证脚本检查一致性
3. 根据建议进行优化

### 3. 质量保证
1. 定期运行一致性测试
2. 监控prompt质量评分
3. 及时修复发现的问题

## 故障排除

### 常见问题
1. **ESLint警告**: 旧方法标记为未使用，这是正常的
2. **配置错误**: 检查测试类型配置是否正确
3. **验证失败**: 检查prompt是否包含所有必需元素

### 解决方案
1. 使用ESLint忽略注释抑制警告
2. 参考现有配置添加新测试类型
3. 使用验证脚本识别和修复问题

## 未来改进

### 计划中的功能
1. **自动优化**: 基于验证结果自动优化prompt
2. **A/B测试**: 测试不同prompt版本的效果
3. **性能监控**: 监控prompt生成和验证的性能
4. **模板系统**: 更灵活的prompt模板系统

### 扩展性
- 支持更多测试类型
- 支持多语言prompt
- 支持自定义验证规则
- 支持prompt版本管理

## 总结

通过这次优化，我们实现了：
1. **100%统一的语言风格**: 所有测试都使用温暖、支持性的语调
2. **标准化的构建机制**: 使用统一的Prompt构建器
3. **完善的审查机制**: 自动验证和评分系统
4. **可维护的代码结构**: 模块化设计，易于扩展

这确保了测试平台提供一致、专业的用户体验，同时为未来的功能扩展奠定了坚实的基础。
