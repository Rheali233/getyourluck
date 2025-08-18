# 部署配置指南

本文档详细说明如何配置和部署 GetYourLuck 综合测试平台到 Cloudflare 平台。

## 🎯 部署概览

项目采用 Cloudflare 全栈架构：
- **前端**: Cloudflare Pages (静态网站托管)
- **后端**: Cloudflare Workers (边缘计算)
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2

## 🔑 必需的配置信息

### 1. Cloudflare 账户信息

#### Account ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧边栏查看 Account ID
3. 格式：32位十六进制字符串

#### API Token
1. 访问 [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 选择 "Custom token" 模板
4. 配置权限：

```
Permissions:
├── Cloudflare Pages
│   ├── Pages:Edit
│   └── Pages:Read
├── Cloudflare Workers
│   ├── Workers:Edit
│   └── Workers:Read
├── Cloudflare D1
│   ├── D1:Edit
│   └── D1:Read
├── Cloudflare KV
│   ├── KV:Edit
│   └── KV:Read
└── Cloudflare R2
    ├── R2:Edit
    └── R2:Read
```

5. 资源范围：选择特定账户
6. 生成并保存 Token

## 🚀 前端部署配置

### 1. Cloudflare Pages 项目创建

#### 手动创建
1. 访问 [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 连接 GitHub 仓库：`Rheali233/getyourluck`
5. 项目名称：`getyourluck-testing-platform`
6. 生产分支：`main`
7. 构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`comprehensive-testing-platform/frontend/dist`
   - Node.js 版本：20

#### 通过 Wrangler CLI 创建
```bash
cd comprehensive-testing-platform/frontend
npx wrangler pages project create getyourluck-testing-platform --production-branch main
```

### 2. 前端配置文件

#### `frontend/wrangler.toml`
```toml
name = "getyourluck-frontend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# Cloudflare Pages 配置
pages_build_output_dir = "dist"

# 环境变量配置
[env.production.vars]
NODE_ENV = "production"
API_BASE_URL = "https://api.getyourluck.com"
CDN_BASE_URL = "https://cdn.getyourluck.com"

[env.preview.vars]
NODE_ENV = "staging"
API_BASE_URL = "https://staging-api.getyourluck.com"
CDN_BASE_URL = "https://staging-cdn.getyourluck.com"
```

### 3. 环境变量配置

在 Cloudflare Pages 项目设置中配置：

#### 生产环境变量
```
NODE_ENV = production
API_BASE_URL = https://api.getyourluck.com
CDN_BASE_URL = https://cdn.getyourluck.com
```

#### 预览环境变量
```
NODE_ENV = staging
API_BASE_URL = https://staging-api.getyourluck.com
CDN_BASE_URL = https://staging-cdn.getyourluck.com
```

## 🔧 后端部署配置

### 1. Cloudflare Workers 项目配置

#### `backend/wrangler.toml`
```toml
name = "getyourluck-backend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# 环境配置
[env.development]
name = "getyourluck-backend-dev"
vars = { 
  NODE_ENV = "development",
  DATABASE_URL = "your-dev-database-url"
}

[env.production]
name = "getyourluck-backend-prod"
vars = { 
  NODE_ENV = "production",
  DATABASE_URL = "your-prod-database-url"
}

# D1 数据库绑定
[[env.production.d1_databases]]
binding = "DB"
database_name = "getyourluck-prod"
database_id = "your-database-id"

# KV 命名空间绑定
[[env.production.kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

# R2 存储绑定
[[env.production.r2_buckets]]
binding = "STORAGE"
bucket_name = "getyourluck-storage"
```

### 2. 数据库配置

#### 创建 D1 数据库
```bash
# 创建数据库
npx wrangler d1 create getyourluck-prod

# 应用迁移
npx wrangler d1 execute getyourluck-prod --file=./migrations/001_initial.sql

# 本地开发
npx wrangler d1 execute getyourluck-prod --local --file=./migrations/001_initial.sql
```

#### 创建 KV 命名空间
```bash
# 创建命名空间
npx wrangler kv:namespace create "CACHE"

# 本地开发
npx wrangler kv:namespace create "CACHE" --preview
```

#### 创建 R2 存储桶
```bash
# 创建存储桶
npx wrangler r2 bucket create getyourluck-storage
```

## 🔄 自动化部署配置

### 1. GitHub Actions 工作流

#### 前端自动部署 (`cloudflare-pages.yml`)
```yaml
name: Deploy Frontend to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:

jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: comprehensive-testing-platform/frontend
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: comprehensive-testing-platform/frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: getyourluck-testing-platform
          directory: comprehensive-testing-platform/frontend/dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

#### 后端自动部署 (`cf-workers-backend.yml`)
```yaml
name: Deploy Backend to Cloudflare Workers

on:
  push:
    branches: [ main ]
    paths: [ 'comprehensive-testing-platform/backend/**' ]

jobs:
  deploy:
    name: Deploy Workers
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: comprehensive-testing-platform/backend
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Cloudflare Workers
        run: npx wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### 2. GitHub Secrets 配置

在仓库 **Settings → Secrets and variables → Actions** 中配置：

#### 必需的 Secrets
```
CLOUDFLARE_API_TOKEN = your-api-token-here
CLOUDFLARE_ACCOUNT_ID = your-account-id-here
```

#### 可选的 Secrets
```
CLOUDFLARE_D1_DATABASE_ID = your-database-id
CLOUDFLARE_KV_NAMESPACE_ID = your-kv-namespace-id
CLOUDFLARE_R2_BUCKET_NAME = your-r2-bucket-name
```

## 📊 部署验证

### 1. 前端部署验证

#### 检查部署状态
1. 访问 [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. 查看项目 `getyourluck-testing-platform` 状态
3. 检查最新部署的构建日志

#### 访问部署结果
- 生产环境：https://getyourluck-testing-platform.pages.dev
- 预览环境：每次 PR 自动生成预览链接

### 2. 后端部署验证

#### 检查 Workers 状态
1. 访问 [Cloudflare Workers Dashboard](https://dash.cloudflare.com/workers)
2. 查看项目状态和运行日志
3. 测试 API 端点响应

#### 本地测试
```bash
cd comprehensive-testing-platform/backend
npm run dev          # 本地开发
npm run deploy       # 部署到生产环境
```

## 🛠️ 故障排除

### 常见部署问题

#### 1. 构建失败
**症状**: GitHub Actions 构建步骤失败
**解决方案**:
- 检查 TypeScript 类型错误
- 验证依赖安装
- 查看构建日志中的具体错误

#### 2. 部署失败
**症状**: 部署步骤失败
**解决方案**:
- 验证 API Token 权限
- 检查 Account ID
- 确认项目名称配置

#### 3. 环境变量问题
**症状**: 应用运行时环境变量未定义
**解决方案**:
- 检查 wrangler.toml 配置
- 验证 GitHub Secrets 设置
- 确认环境变量名称正确

### 调试命令

#### 前端调试
```bash
# 本地构建测试
npm run build

# 类型检查
npx tsc --noEmit

# 本地部署测试
npx wrangler pages deploy dist --project-name getyourluck-testing-platform
```

#### 后端调试
```bash
# 本地开发
npm run dev

# 查看 Workers 日志
npx wrangler tail

# 测试 API
curl https://your-worker.your-subdomain.workers.dev/health
```

## 📈 性能监控

### 1. Cloudflare Analytics
- 访问 [Analytics Dashboard](https://dash.cloudflare.com/analytics)
- 监控 Pages 和 Workers 性能指标
- 查看错误率和响应时间

### 2. GitHub Actions 监控
- 在仓库 Actions 标签页查看构建状态
- 设置构建失败通知
- 监控部署成功率

## 🔒 安全配置

### 1. API Token 安全
- 定期轮换 API Token
- 限制 Token 权限范围
- 监控 Token 使用情况

### 2. 环境隔离
- 开发、测试、生产环境完全隔离
- 不同环境使用不同的数据库和存储
- 生产环境禁用调试功能

---

**文档版本**: 1.0.0  
**最后更新**: 2024-08-18  
**维护者**: GetYourLuck 开发团队
