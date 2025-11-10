# 修复 Migration 003 问题

## 问题描述

`003_question_bank_tables.sql` 迁移在部署时失败，可能是因为：
1. 表已经存在（之前手动执行过）
2. 迁移记录表中没有记录
3. 导致每次启动都尝试重新执行迁移

## 检查步骤

### 1. 检查表是否存在

```bash
cd comprehensive-testing-platform/backend
wrangler d1 execute getyourluck-staging --env staging --file=./scripts/fix-migration-003.sql
```

或者手动执行：

```bash
wrangler d1 execute getyourluck-staging --env staging --command "
SELECT name 
FROM sqlite_master 
WHERE type='table' 
  AND name IN (
    'psychology_question_categories',
    'psychology_questions',
    'psychology_question_options',
    'psychology_question_configs',
    'psychology_question_versions'
  )
ORDER BY name;
"
```

### 2. 检查迁移是否已记录

```bash
wrangler d1 execute getyourluck-staging --env staging --command "
SELECT id, name, applied_at 
FROM migrations 
WHERE id = '003_question_bank_tables';
"
```

## 解决方案

### 方案 1: 如果表已存在，标记迁移为已执行（推荐）

如果所有表都存在，但迁移未记录，执行：

```bash
wrangler d1 execute getyourluck-staging --env staging --command "
INSERT OR IGNORE INTO migrations (id, name, applied_at) 
VALUES ('003_question_bank_tables', 'Question bank tables', datetime('now'));
"
```

### 方案 2: 如果表不存在，重新执行迁移

如果表不存在，需要手动执行迁移：

```bash
wrangler d1 execute getyourluck-staging --env staging --file=./migrations/003_question_bank_tables.sql
```

然后标记为已执行：

```bash
wrangler d1 execute getyourluck-staging --env staging --command "
INSERT OR IGNORE INTO migrations (id, name, applied_at) 
VALUES ('003_question_bank_tables', 'Question bank tables', datetime('now'));
"
```

### 方案 3: 如果表部分存在，需要清理后重新执行

如果部分表存在，可能需要：
1. 删除已存在的表
2. 重新执行迁移
3. 标记为已执行

**⚠️ 警告：删除表会丢失数据，请谨慎操作！**

## 验证

执行修复后，验证迁移状态：

```bash
wrangler d1 execute getyourluck-staging --env staging --command "
SELECT id, name, applied_at 
FROM migrations 
ORDER BY applied_at;
"
```

应该能看到 `003_question_bank_tables` 在列表中。

## 相关文件

- 迁移文件: `migrations/003_question_bank_tables.sql`
- 迁移定义: `src/utils/migrations.ts` (migration003)
- 迁移运行器: `src/utils/migrationRunner.ts`

