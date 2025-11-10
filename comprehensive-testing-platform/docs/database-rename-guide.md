# Staging 数据库命名说明

## 📋 概述

Cloudflare D1 数据库目前在 Dashboard 中**不支持重命名功能**。但这不影响我们在配置文件中使用统一的命名规范 `selfatlas-staging`。

## ✅ 当前状态

- **Cloudflare Dashboard 显示名称**：`getyourluck-staging`（无法更改）
- **配置文件中的名称**：`selfatlas-staging`（用作标识符）
- **数据库 ID**：`ad5be588-a683-45b5-94b4-47c585abd34f`（唯一标识符，保持不变）

## 🔍 工作原理

Wrangler 使用 `database_id` 来识别和连接数据库，而不是数据库名称。因此：

- ✅ 在 `wrangler.toml` 中使用 `selfatlas-staging` 作为名称
- ✅ 所有脚本和命令使用 `selfatlas-staging`
- ✅ Wrangler 会通过 `database_id` 找到正确的数据库
- ✅ 功能完全正常，不受影响

## 📝 配置说明

配置文件 `backend/wrangler.toml`：

```toml
[[env.staging.d1_databases]]
binding = "DB"
database_name = "selfatlas-staging"  # 配置文件中的名称
database_id = "ad5be588-a683-45b5-94b4-47c585abd34f"  # 实际数据库 ID
```

## ✅ 验证配置

使用以下命令验证配置是否正确：

```bash
cd backend

# 查看数据库信息（使用配置中的名称）
wrangler d1 info selfatlas-staging --env staging

# 执行查询测试
wrangler d1 execute selfatlas-staging --env staging --remote \
  --command "SELECT COUNT(*) as count FROM test_types;"
```

## 🎯 总结

- ✅ **不需要在 Dashboard 中重命名**：Cloudflare 不支持此功能
- ✅ **配置文件已统一**：所有配置和脚本使用 `selfatlas-staging`
- ✅ **功能正常**：通过 `database_id` 连接，不受名称影响
- ✅ **文档一致**：所有文档和脚本使用统一的命名

## 📚 相关文件

所有以下文件已更新为使用 `selfatlas-staging`：
- ✅ `backend/wrangler.toml`
- ✅ 所有 `backend/scripts/*.ts` 脚本
- ✅ 所有 `backend/*.js` 脚本
- ✅ 部署脚本和文档

---

**结论**：虽然 Cloudflare Dashboard 中数据库显示名称仍为 `getyourluck-staging`，但这不影响功能。所有配置和脚本已统一使用 `selfatlas-staging`，系统会正常工作。

