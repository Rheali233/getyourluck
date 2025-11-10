# 模块题库数据同步方案

## 📋 概述

本方案用于从 Staging 或 Production 环境同步各模块的题库数据到本地开发环境，确保本地环境有足够的真实数据用于开发和测试。

## 🎯 目标模块和子模块选择

### 1. Psychology 模块
**选择子模块：**
- **PHQ9** (code: `phq9`) - 9题（抑郁症筛查量表）
- **Happiness** (code: `happiness`) - 5题（幸福指数测试）

**数据表结构：**
- `psychology_question_categories` - 分类表
- `psychology_questions` - 题目表
- `psychology_question_options` - 选项表

**关联方式：**
- 通过 `category_id` 关联分类
- 通过 `question_id` 关联选项

**选择理由：**
- PHQ9: 标准化的9题量表，题目少但完整
- Happiness: 仅5题，适合快速测试

### 2. Career 模块
**选择子模块：**
- **DISC** (code: `disc`) - 约28-30题（行为风格测试）

**数据表结构：**
- `psychology_question_categories` - 分类表（与 Psychology 共享）
- `psychology_questions` - 题目表（与 Psychology 共享）
- `psychology_question_options` - 选项表（与 Psychology 共享）

**关联方式：**
- 通过 `category_id` 关联分类
- 通过 `question_id` 关联选项

**选择理由：**
- DISC: 题目数量适中（约30题），比 Holland（60题）少一半

### 3. Learning 模块
**选择子模块：**
- **VARK** (独立表结构) - 约16题

**数据表结构：**
- `vark_questions` - 题目表
- `vark_options` - 选项表

**关联方式：**
- 通过 `question_id` 关联选项

**选择理由：**
- VARK: 学习风格测试，题目数量适中

### 4. Relationship 模块
**选择子模块：**
- **Love Language** (test_type: `love_language`) - 约30题（可选，如果觉得多可以只选一个）

**数据表结构：**
- `relationship_questions` - 题目表（选项存储在 JSON 字段中）

**特点：**
- 选项存储在 `options` 字段（TEXT，JSON格式）
- 不需要单独的选项表

**选择理由：**
- Love Language: 相对简单的关系测试
- 如果30题仍然太多，可以考虑只同步部分题目

## 📊 数据源选择策略

### 检查步骤
1. **首先检查 Staging 环境数据**
   - 查询各子模块的题目数量
   - 查询各子模块的选项数量（如适用）

2. **对比 Production 环境数据**
   - 比较两个环境的数据完整性
   - 选择数据更完整的环境作为数据源

3. **推荐规则**
   - 优先选择题目数量更多的环境
   - 如果数量相同，优先选择 Staging（更接近开发环境）
   - 如果 Staging 数据缺失，使用 Production

## 🔧 同步策略

### 1. Psychology & Career 模块同步策略

**同步内容：**
1. Category 记录（如果本地不存在）
2. 所有 Questions 记录
3. 所有 Options 记录
4. 关联的 Configs（可选）
5. 关联的 Versions（可选）

**同步步骤：**
```typescript
1. 检查并创建/更新 Category
2. 清空本地该 Category 的所有 Questions 和 Options
3. 批量插入 Questions（批次大小：10）
4. 批量插入 Options（批次大小：20）
5. 更新 Category 的 question_count
6. 验证同步结果
```

**ID 映射处理：**
- Category ID：可能需要在 staging/prod 和 local 之间映射
- Question ID：保持原 ID 不变
- Option ID：保持原 ID 不变

### 2. Learning 模块（VARK）同步策略

**同步内容：**
1. 所有 VARK Questions
2. 所有 VARK Options

**同步步骤：**
```typescript
1. 清空本地所有 VARK Questions 和 Options
2. 批量插入 Questions（批次大小：10）
3. 批量插入 Options（批次大小：20）
4. 验证同步结果
```

**注意：**
- VARK 使用独立的表结构，不依赖 category
- 需要保持 question_id 的外键关系

### 3. Relationship 模块同步策略

**同步内容：**
1. 指定 test_type 的所有 Questions

**同步步骤：**
```typescript
1. 清空本地指定 test_type 的所有 Questions
2. 批量插入 Questions（批次大小：10）
3. 验证同步结果
```

**注意：**
- Options 存储在 questions.options JSON 字段中
- 不需要单独同步选项表

## 🛠️ 实现方案

### 脚本结构

#### 1. 数据检查脚本 (`check-module-data.ts`)
**功能：**
- 检查本地数据情况
- 检查 Staging 环境数据情况
- 检查 Production 环境数据情况
- 对比并推荐数据源

**输出：**
- 各模块的题目数量统计
- 各模块的选项数量统计（如适用）
- 推荐的数据源（Staging 或 Production）

#### 2. 数据同步脚本 (`sync-module-data.ts`)
**功能：**
- 支持指定模块和子模块
- 支持选择数据源（Staging 或 Production）
- 执行完整的数据同步流程
- 提供同步结果验证

**参数设计：**
```typescript
interface SyncOptions {
  module: 'psychology' | 'career' | 'learning' | 'relationship';
  submodule: string; // 'phq9' | 'happiness' | 'disc' | 'vark' | 'love_language'
  source: 'staging' | 'production';
  dryRun?: boolean; // 仅检查，不实际同步
  limit?: number; // 可选：限制同步的题目数量（用于测试）
}
```

**核心函数：**
```typescript
// Psychology/Career 模块同步
async function syncPsychologyCategory(
  categoryCode: string,
  sourceEnv: 'staging' | 'production'
): Promise<void>

// Learning 模块同步
async function syncVARKData(
  sourceEnv: 'staging' | 'production'
): Promise<void>

// Relationship 模块同步
async function syncRelationshipTestType(
  testType: string,
  sourceEnv: 'staging' | 'production'
): Promise<void>
```

### 数据库操作

#### SQL 执行函数
```typescript
function executeSQL(
  database: string,
  env: 'local' | 'staging' | 'production',
  sql: string
): any
```

**特点：**
- 本地数据库：使用临时文件方式执行
- 远程数据库：使用命令行方式执行
- 统一返回 JSON 格式结果
- 处理 SQL 注入防护（参数化查询）

#### 批量插入优化
- Questions: 批次大小 10
- Options: 批次大小 20
- 批次间延迟 500ms（避免 API 限制）
- 失败时回退到单条插入

### 错误处理

1. **Category/TestType 不存在**
   - 尝试通过 code/name 模糊匹配
   - 如果仍然找不到，创建基础记录

2. **ID 冲突**
   - 使用 INSERT OR REPLACE
   - 或者先 DELETE 再 INSERT

3. **外键约束**
   - 先删除 Options，再删除 Questions
   - 先插入 Questions，再插入 Options

4. **网络/API 错误**
   - 重试机制（最多 3 次）
   - 详细的错误日志
   - 部分成功时记录已同步的数据

## 📝 执行计划

### 阶段 1: 数据检查
```bash
# 1. 运行检查脚本
npx tsx scripts/check-module-data.ts

# 2. 查看输出，确认：
#    - 本地当前数据情况
#    - Staging 环境数据情况
#    - Production 环境数据情况
#    - 推荐的数据源
```

### 阶段 2: 数据同步
```bash
# 同步 Psychology - PHQ9（从 Staging）- 9题
npx tsx scripts/sync-module-data.ts --module=psychology --submodule=phq9 --source=staging

# 同步 Psychology - Happiness（从 Staging）- 5题
npx tsx scripts/sync-module-data.ts --module=psychology --submodule=happiness --source=staging

# 同步 Career - DISC（从 Staging）- 约30题
npx tsx scripts/sync-module-data.ts --module=career --submodule=disc --source=staging

# 同步 Learning - VARK（从 Staging）- 约16题
npx tsx scripts/sync-module-data.ts --module=learning --submodule=vark --source=staging

# 同步 Relationship - Love Language（从 Staging）- 约30题（可选）
npx tsx scripts/sync-module-data.ts --module=relationship --submodule=love_language --source=staging

# 如果需要限制题目数量（用于快速测试）
npx tsx scripts/sync-module-data.ts --module=relationship --submodule=love_language --source=staging --limit=10
```

### 阶段 3: 验证
```bash
# 再次运行检查脚本，对比同步前后
npx tsx scripts/check-module-data.ts

# 确认：
#    - 本地数据数量是否匹配
#    - 是否有遗漏的数据
#    - 数据完整性检查
```

## ⚠️ 注意事项

1. **环境变量**
   - 需要设置 `CLOUDFLARE_API_TOKEN` 才能访问远程数据库
   - 建议使用 `.env` 文件管理

2. **数据安全**
   - 同步前建议备份本地数据库
   - 使用 `--dry-run` 参数先检查
   - 不要在生产环境执行同步脚本

3. **数据一致性**
   - 同步后会清空本地现有数据
   - 确保本地没有重要的测试数据需要保留

4. **性能考虑**
   - 大批量数据同步可能需要较长时间
   - 建议分模块逐个同步
   - 监控 API 速率限制

5. **ID 映射**
   - Category ID 可能在环境间不同
   - 需要智能匹配或创建映射
   - 保持 Question 和 Option ID 不变

## 🔍 验证清单

同步完成后，验证以下内容：

- [ ] 各模块的题目数量与源环境一致
- [ ] 各模块的选项数量与源环境一致（如适用）
- [ ] 题目顺序正确（order_index）
- [ ] 选项顺序正确（order_index）
- [ ] 外键关系完整
- [ ] Category/TestType 记录存在
- [ ] 可以在前端正常加载和显示测试题

## 📚 相关文件

- `scripts/check-module-data.ts` - 数据检查脚本
- `scripts/sync-module-data.ts` - 数据同步脚本（待创建）
- `scripts/sync-disc-from-staging.ts` - DISC 同步参考实现
- `migrations/003_psychology_question_bank.sql` - Psychology 表结构
- `migrations/011_create_relationship_tables.sql` - Relationship 表结构
- `migrations/021_create_learning_ability_tables.sql` - Learning 表结构

## 🎯 预期结果

同步完成后，本地环境将拥有：

- **Psychology 模块**: PHQ9 (9题), Happiness (5题)
- **Career 模块**: DISC (约30题)
- **Learning 模块**: VARK (约16题)
- **Relationship 模块**: Love Language (约30题，可选)

**基础版本（最少）**: 9 + 5 + 30 + 16 = **60题**
**完整版本**: 9 + 5 + 30 + 16 + 30 = **90题**

这个数量足以支持本地开发和测试需求，同时不会造成过大的数据负担。

