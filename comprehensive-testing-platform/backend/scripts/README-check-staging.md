# Staging 环境数据检查脚本使用说明

## 概述

`check-staging-data.ts` 脚本用于检查 Staging 环境与 Production 环境的题目和选项数据一致性。以 Production 环境为参照标准，检查 Staging 环境的数据是否正确。

## 功能

脚本会检查以下数据表：

1. `psychology_questions` - 心理测试题目表
2. `psychology_question_options` - 心理测试选项表
3. `vark_questions` - VARK学习风格测试题目表
4. `vark_options` - VARK学习风格测试选项表
5. `psychology_question_categories` - 题目分类表

## 检查内容

对于每个表，脚本会检查：

1. **数据量对比**: 比较 Staging 和 Production 环境的数据条数
2. **缺失记录**: 找出 Production 中存在但 Staging 中缺失的记录
3. **多余记录**: 找出 Staging 中存在但 Production 中不存在的记录
4. **字段差异**: 对比相同 ID 记录的字段值差异（排除 `created_at` 和 `updated_at` 字段）

## 使用方法

### 方法 1: 使用 npm 脚本（推荐）

```bash
cd comprehensive-testing-platform/backend
npm run check:staging
```

### 方法 2: 直接使用 tsx

```bash
cd comprehensive-testing-platform/backend
npx tsx scripts/check-staging-data.ts
```

## 前置要求

1. **Cloudflare 认证**: 确保已通过 `wrangler login` 登录到 Cloudflare
2. **网络连接**: 需要能够访问 Cloudflare 的 D1 数据库服务
3. **权限**: 需要具有访问 Staging 和 Production 环境数据库的权限

## 输出

脚本会在控制台输出检查报告，并保存详细报告到文件：

- **报告文件位置**: `comprehensive-testing-platform/backend/staging-data-check-report.txt`
- **报告内容**:
  - 汇总统计（缺失记录数、多余记录数、字段差异数）
  - 每个表的详细检查结果
  - 具体的问题记录和差异字段

## 退出码

- `0`: 数据一致，无问题
- `1`: 发现数据不一致问题

## 示例输出

```
🚀 开始检查 Staging 与 Production 环境的数据一致性...

⚠️  注意: 此操作需要访问远程数据库，可能需要一些时间...

📊 检查表: psychology_questions
   Staging: 500 条, Production: 500 条, 差异: 0

📊 检查表: psychology_question_options
   Staging: 2000 条, Production: 2000 条, 差异: 0

...

📋 STAGING vs PRODUCTION 数据一致性检查报告
================================================================================
检查时间: 2024-01-15 10:30:00
检查表数: 5

📊 汇总统计:
  - Staging 缺失的记录: 0 条
  - Staging 多余的记录: 0 条
  - 字段值差异: 0 处

✅ 所有数据一致，Staging 环境数据正确
```

## 注意事项

1. **执行时间**: 检查过程需要查询远程数据库，可能需要几分钟时间
2. **网络要求**: 确保网络连接稳定，能够访问 Cloudflare 服务
3. **数据权限**: 确保有权限访问 Staging 和 Production 环境的数据库
4. **敏感信息**: 报告文件可能包含敏感数据，请妥善保管

## 故障排查

### 问题: 连接数据库失败

**解决方案**:
- 检查 Cloudflare 认证状态: `wrangler whoami`
- 确认网络连接正常
- 检查数据库配置是否正确

### 问题: 权限不足

**解决方案**:
- 确认账户具有访问相应环境数据库的权限
- 联系管理员分配权限

### 问题: 脚本执行缓慢

**原因**: 
- 数据量大时查询需要较长时间
- 网络延迟

**解决方案**:
- 等待脚本完成执行
- 检查网络连接质量

## 相关文档

- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

