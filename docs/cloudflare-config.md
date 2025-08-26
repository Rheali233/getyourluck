# ☁️ Cloudflare 配置文档

## 📋 概述

本文档记录了项目在Cloudflare平台上的所有配置信息，包括Pages、Workers、D1数据库、KV存储和R2存储的配置。

## 🏗️ 项目架构

```
Cloudflare Platform
├── Pages (前端)
│   ├── 项目: getyourluck-testing-platform
│   ├── 域名: *.pages.dev
│   └── 构建: Vite + React
├── Workers (后端)
│   ├── Staging: getyourluck-backend-staging
│   ├── Production: getyourluck-backend-prod
│   └── 框架: Hono.js
├── D1 (数据库)
│   ├── Staging: getyourluck-staging
│   ├── Production: getyourluck-prod
│   └── 类型: SQLite
├── KV (缓存)
│   ├── Staging: getyourluck-staging-cache
│   └── Production: getyourluck-prod-cache
└── R2 (存储)
    ├── Staging: getyourluck-staging-storage
    └── Production: getyourluck-prod-storage
```

## 🌐 Cloudflare Pages 配置

### 项目信息
- **项目名称**: `getyourluck-testing-platform`
- **账户ID**: `257a0c6111ab57bbec3f4e18492c6ac9`
- **账户邮箱**: `cyberlina@163.com`
- **构建目录**: `dist`
- **构建工具**: Vite

### 环境配置
```toml
# wrangler.toml
[env.production]
name = "getyourluck-frontend-prod"
project_name = "getyourluck-testing-platform"
route = "api.getyourluck.com/*"

[env.preview]
name = "getyourluck-frontend-preview"
project_name = "getyourluck-testing-platform"
route = "dev-api.getyourluck.com/*"
```

### 部署URL
- **主要部署**: `https://7614e3a6.getyourluck-testing-platform.pages.dev`
- **分支别名**: `https://feature-test-preview.getyourluck-testing-platform.pages.dev`
- **自定义域名**: `api.getyourluck.com` (待配置)

## ⚡ Cloudflare Workers 配置

### 后端服务配置
```toml
# backend/wrangler.toml
name = "getyourluck-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "getyourluck-backend-prod"
route = "api.getyourluck.com/*"

[env.staging]
name = "getyourluck-backend-staging"

[env.development]
name = "getyourluck-backend-dev"
route = "dev-api.getyourluck.com/*"
```

### 环境变量
```toml
[env.production.vars]
NODE_ENV = "production"
LOG_LEVEL = "info"
ENABLE_ANALYTICS = "true"
ENABLE_CACHE = "true"
CACHE_TTL = "3600"

[env.staging.vars]
NODE_ENV = "staging"
LOG_LEVEL = "debug"
ENABLE_ANALYTICS = "true"
ENABLE_CACHE = "true"
CACHE_TTL = "1800"
```

### 部署状态
- **Staging**: ✅ 已部署 - `https://getyourluck-backend-staging.cyberlina.workers.dev`
- **Production**: ⏳ 待配置 - `https://api.getyourluck.com`

## 🗄️ D1 数据库配置

### 数据库配置
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "getyourluck-prod"
database_id = "your-production-database-id"

[[env.staging.d1_databases]]
binding = "DB"
database_name = "getyourluck-staging"
database_id = "ad5be588-a683-45b5-94b4-47c585abd34f"

[[env.development.d1_databases]]
binding = "DB"
database_name = "getyourluck-local"
database_id = "a9f563cf-ce1b-46f8-adfe-38d58c7686a0"
```

### 数据库状态
- **Local**: ✅ 可用 - `a9f563cf-ce1b-46f8-adfe-38d58c7686a0`
- **Staging**: ✅ 可用 - `ad5be588-a683-45b5-94b4-47c585abd34f`
- **Production**: ⏳ 待创建

### 迁移文件
```
migrations/
├── 001_initial_schema.sql
├── 002_module_specific_tables.sql
├── 003_psychology_question_bank.sql
├── 004_relationship_categories.sql
├── 010_create_homepage_tables.sql
└── 011_create_relationship_tables.sql
```

## 🔑 KV 存储配置

### KV命名空间配置
```toml
[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-production-kv-id"
preview_id = "your-production-kv-preview-id"

[[env.staging.kv_namespaces]]
binding = "CACHE"
id = "439757d0175e4f89a4b57a2c82ccf464"
preview_id = "439757d0175e4f89a4b57a2c82ccf464"
```

### KV状态
- **Staging**: ✅ 可用 - `439757d0175e4f89a4b57a2c82ccf464`
- **Production**: ⏳ 待创建

## 📦 R2 存储配置

### R2存储桶配置
```toml
[[env.production.r2_buckets]]
binding = "STORAGE"
bucket_name = "getyourluck-prod-storage"

[[env.staging.r2_buckets]]
binding = "STORAGE"
bucket_name = "getyourluck-staging-storage"

[[env.development.r2_buckets]]
binding = "STORAGE"
bucket_name = "getyourluck-dev-storage"
```

### R2状态
- **Staging**: ✅ 可用 - `getyourluck-staging-storage`
- **Production**: ⏳ 待创建

## 🚀 部署流程

### 1. 前端部署 (Pages)
```bash
# 构建
npm run build

# 部署
npx wrangler pages deploy dist --project-name="getyourluck-testing-platform"
```

### 2. 后端部署 (Workers)
```bash
# 构建
npm run build

# 部署到staging
npx wrangler deploy --env staging

# 部署到production
npx wrangler deploy --env production
```

### 3. 数据库迁移
```bash
# 执行迁移
wrangler d1 execute "getyourluck-staging" --file="./migrations/001_initial_schema.sql" --env staging
```

### 4. 完整部署脚本
```bash
# 使用项目脚本
./scripts/deploy.sh staging
./scripts/deploy.sh production
```

## 🔐 安全配置

### 环境变量管理
- **开发环境**: 使用 `.env.local` 文件
- **Staging环境**: 使用Cloudflare Dashboard设置
- **Production环境**: 使用Cloudflare Dashboard设置

### 必要的环境变量
```bash
# 前端
VITE_DEEPSEEK_API_KEY=your_api_key
VITE_API_BASE_URL=https://api.getyourluck.com

# 后端
DEEPSEEK_API_KEY=your_api_key
NODE_ENV=production
LOG_LEVEL=info
```

## 📊 监控和日志

### Cloudflare Analytics
- **Pages Analytics**: 自动启用
- **Workers Analytics**: 需要手动配置
- **Real User Monitoring**: 可选启用

### 日志配置
```toml
[env.production.vars]
LOG_LEVEL = "info"
ENABLE_ANALYTICS = "true"

[env.staging.vars]
LOG_LEVEL = "debug"
ENABLE_ANALYTICS = "true"
```

## 🚨 故障排除

### 常见问题
1. **部署失败**: 检查wrangler.toml配置
2. **环境变量未生效**: 确认在正确的环境中设置
3. **数据库连接失败**: 检查D1数据库ID和权限
4. **KV/R2访问失败**: 检查绑定配置和权限

### 调试命令
```bash
# 检查账户状态
npx wrangler whoami

# 查看部署状态
npx wrangler deployment list --env staging

# 查看实时日志
npx wrangler tail --env staging

# 检查Pages部署
npx wrangler pages deployment list --project-name="getyourluck-testing-platform"
```

## 📞 支持信息

### Cloudflare账户
- **账户ID**: `257a0c6111ab57bbec3f4e18492c6ac9`
- **账户邮箱**: `cyberlina@163.com`
- **账户类型**: Free Plan (可升级)

### 相关链接
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Workers文档**: https://developers.cloudflare.com/workers/
- **Pages文档**: https://developers.cloudflare.com/pages/
- **D1文档**: https://developers.cloudflare.com/d1/

---

**最后更新**: 2024年12月
**维护者**: AI Assistant
**状态**: 🟢 配置完整
