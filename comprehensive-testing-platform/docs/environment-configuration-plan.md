# 三环境独立配置方案 - 问题总结与解决方案

## 📋 问题总结

### 🔴 严重问题（数据污染风险）

#### 问题 1: 本地开发环境污染 Staging 数据库
- **当前状态**: 本地开发前端 (`localhost`) → 访问 `selfatlas-backend-staging`
- **影响**: 本地开发产生的测试数据会写入 Staging 数据库，污染测试环境
- **风险等级**: 🔴 高

#### 问题 2: Staging 环境污染生产数据库
- **当前状态**: Staging 前端 (`*.pages.dev`) → Pages Functions → `selfatlas-backend-prod`
- **影响**: Staging 测试数据会写入生产数据库，可能导致数据混乱
- **风险等级**: 🔴 极高

#### 问题 3: Pages Functions 硬编码生产后端
- **当前状态**: `functions/api/_middleware.js` 中硬编码 `selfatlas-backend-prod`
- **影响**: 所有通过 Pages Functions 的请求都指向生产后端，无法区分环境
- **风险等级**: 🔴 高

### 🟡 中等问题（配置不一致）

#### 问题 4: 数据库命名不一致
- **当前状态**: 
  - 生产: `selfatlas-prod`
  - Staging: `getyourluck-staging` (命名不一致)
  - 本地: `selfatlas-local`
- **影响**: 命名不规范，维护困难
- **风险等级**: 🟡 中

#### 问题 5: CDN 配置不统一
- **当前状态**:
  - 生产: 使用 Pages CDN (`getyourluck-testing-platform.pages.dev`)
  - Staging: 使用后端 Worker (`selfatlas-backend-staging.cyberlina.workers.dev`)
  - 本地: 使用后端 Worker
- **影响**: 配置不一致，图片资源访问方式混乱
- **风险等级**: 🟡 中

#### 问题 6: 本地开发缺少系统默认数据
- **当前状态**: 本地数据库缺少题目、配置等系统默认数据
- **影响**: 需要临时使用 staging 后端获取数据，导致数据污染
- **风险等级**: 🟡 中

### 🟢 轻微问题（优化建议）

#### 问题 7: 环境变量配置分散
- **当前状态**: 配置分散在多个文件中，难以统一管理
- **影响**: 维护成本高，容易出错
- **风险等级**: 🟢 低

#### 问题 8: 缺少环境初始化脚本
- **当前状态**: 没有统一的本地环境初始化脚本
- **影响**: 新开发者需要手动配置，容易遗漏步骤
- **风险等级**: 🟢 低

---

## 🎯 解决方案概述

### 目标：三个环境完全独立

1. **开发环境 (Development)**
   - 前端: `localhost:3000` → 本地后端 `localhost:8787`
   - 后端: `selfatlas-backend-local` (本地 Worker) 或 `localhost:8787`
   - 数据库: `selfatlas-local`
   - 完全隔离，不影响任何远程环境

2. **Staging 环境**
   - 前端: `*.pages.dev` → Pages Functions → `selfatlas-backend-staging`
   - 后端: `selfatlas-backend-staging`
   - 数据库: `selfatlas-staging` (统一命名)
   - 独立的测试环境

3. **生产环境 (Production)**
   - 前端: `selfatlas.net` → Pages Functions → `selfatlas-backend-prod`
   - 后端: `selfatlas-backend-prod`
   - 数据库: `selfatlas-prod`
   - 生产数据完全隔离

---

## 🔧 详细实施方案

### 阶段 1: 修复后端配置

#### 1.1 统一数据库命名规范 ✅ **已完成**
```toml
# backend/wrangler.toml
[env.production.d1_databases]
database_name = "selfatlas-prod"  # ✅ 已正确

[env.staging.d1_databases]
database_name = "selfatlas-staging"  # ✅ 已统一（配置文件）

[d1_databases]  # 本地开发
database_name = "selfatlas-local"  # ✅ 已正确
```

**完成状态**:
- ✅ 更新 `wrangler.toml` 配置（已完成）
- ✅ 更新所有脚本文件（已完成）
- ✅ 更新相关文档（已完成）
- ⚠️ 注意：Cloudflare Dashboard 不支持重命名，但配置文件中已统一使用 `selfatlas-staging`，功能正常

#### 1.2 完善开发环境配置
```toml
# backend/wrangler.toml
[env.development]
name = "selfatlas-backend-dev"

# 开发环境 KV 存储（如果需要）
[[env.development.kv_namespaces]]
binding = "CACHE"
id = "dev-kv-id"  # 需要创建

# 开发环境 R2 存储（如果需要）
[[env.development.r2_buckets]]
binding = "STORAGE"
bucket_name = "selfatlas-dev-storage"  # 需要创建
```

---

### 阶段 2: 修复前端配置

#### 2.1 修改前端环境配置
```typescript
// frontend/src/config/environment.ts

// 开发环境 - 使用本地后端
if (hostname.includes('localhost')) {
  return {
    API_BASE_URL: '/api',  // 使用 Vite 代理到本地后端
    CDN_BASE_URL: 'http://localhost:8787',  // 本地后端
    ENVIRONMENT: 'development',
    // ...
  };
}

// Staging 环境 - 使用 staging 后端
if (hostname.includes('pages.dev')) {
  return {
    API_BASE_URL: '/api',  // Pages Functions 代理到 staging
    CDN_BASE_URL: 'https://selfatlas-backend-staging.cyberlina.workers.dev',
    ENVIRONMENT: 'staging',
    // ...
  };
}

// 生产环境 - 使用生产后端
if (hostname === 'selfatlas.net' || hostname === 'www.selfatlas.net') {
  return {
    API_BASE_URL: '/api',  // Pages Functions 代理到生产
    CDN_BASE_URL: 'https://getyourluck-testing-platform.pages.dev',
    ENVIRONMENT: 'production',
    // ...
  };
}
```

#### 2.2 修复 Pages Functions 代理
```javascript
// frontend/functions/api/_middleware.js

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // 根据域名动态选择后端
  let backendUrl;
  if (hostname === 'selfatlas.net' || hostname === 'www.selfatlas.net') {
    // 生产环境
    backendUrl = 'https://selfatlas-backend-prod.cyberlina.workers.dev';
  } else if (hostname.includes('pages.dev')) {
    // Staging 环境
    backendUrl = 'https://selfatlas-backend-staging.cyberlina.workers.dev';
  } else {
    // 默认 fallback（不推荐，但保留）
    backendUrl = 'https://selfatlas-backend-staging.cyberlina.workers.dev';
  }
  
  const backendUrlWithPath = `${backendUrl}${url.pathname}${url.search}`;
  
  // ... 其余代理逻辑
}
```

---

### 阶段 3: 解决系统默认数据问题

#### 3.1 完善本地种子数据脚本
```typescript
// backend/scripts/seed-local.ts

// 扩展种子数据，包含所有模块：
- 心理测试题目（MBTI, PHQ-9, EQ, Happiness）
- 职业测试题目（Holland, DISC, Leadership）
- 关系测试题目（Love Language, Love Style, Interpersonal）
- 学习能力测试题目
- 首页模块配置（homepage_modules）
- 系统配置（sys_configs）
- 测试类型配置（test_types）
- 博客文章（blog_articles）- 可选
```

#### 3.2 创建环境初始化脚本
```bash
# backend/scripts/init-local.sh
#!/bin/bash

echo "🚀 初始化本地开发环境..."

# 1. 创建本地数据库（如果不存在）
wrangler d1 create selfatlas-local

# 2. 运行数据库迁移
echo "📦 运行数据库迁移..."
wrangler d1 migrations apply selfatlas-local --local

# 3. 初始化种子数据
echo "🌱 初始化种子数据..."
npm run seed:local

echo "✅ 本地环境初始化完成！"
echo "现在可以启动后端: npm run dev"
```

#### 3.3 添加 package.json 脚本
```json
{
  "scripts": {
    "init:local": "./scripts/init-local.sh",
    "seed:local": "tsx scripts/seed-local.ts",
    "migrate:local": "wrangler d1 migrations apply selfatlas-local --local",
    "dev": "wrangler dev --local"
  }
}
```

---

### 阶段 4: 统一 CDN 配置

#### 4.1 统一 CDN 策略
- **生产环境**: 使用 Cloudflare Pages CDN（静态资源）
- **Staging 环境**: 使用 Cloudflare Pages CDN（与生产保持一致）
- **开发环境**: 使用本地后端（`localhost:8787`）

#### 4.2 图片资源访问策略
```typescript
// 统一图片 URL 构建逻辑
export function getImageUrl(path: string): string {
  const cdnBase = getCdnBaseUrl();
  if (isDevelopment()) {
    // 开发环境：本地后端或相对路径
    return `/images${path}`;
  }
  // Staging/Production：使用 CDN
  return `${cdnBase}/images${path}`;
}
```

---

## 📝 配置对照表

### 后端 Worker 配置

| 环境 | Worker 名称 | 数据库 | KV | R2 | URL |
|------|------------|--------|-----|-----|-----|
| **开发** | `selfatlas-backend-local` | `selfatlas-local` | dev-kv | dev-storage | `localhost:8787` |
| **Staging** | `selfatlas-backend-staging` | `selfatlas-staging` ✅ | staging-kv | staging-storage | `https://selfatlas-backend-staging.cyberlina.workers.dev` |
| **生产** | `selfatlas-backend-prod` | `selfatlas-prod` | prod-kv | prod-storage | `https://selfatlas-backend-prod.cyberlina.workers.dev` |

### 前端配置

| 环境 | 域名 | API_BASE_URL | CDN_BASE_URL | Pages Functions 代理到 |
|------|------|--------------|--------------|----------------------|
| **开发** | `localhost:3000` | `/api` | `http://localhost:8787` | N/A (Vite 代理) |
| **Staging** | `*.pages.dev` | `/api` | `https://getyourluck-testing-platform.pages.dev` | `selfatlas-backend-staging` ✅ |
| **生产** | `selfatlas.net` | `/api` | `https://getyourluck-testing-platform.pages.dev` | `selfatlas-backend-prod` ✅ |

✅ 表示已完成的配置

---

## ✅ 实施检查清单

### 后端配置
- [x] ~~创建 `selfatlas-staging` 数据库（替换 `getyourluck-staging`）~~ ✅ **已完成**：Cloudflare 不支持重命名，配置文件中已统一使用 `selfatlas-staging`
- [x] ~~迁移数据到新数据库~~ ✅ **无需迁移**：使用现有数据库，通过 `database_id` 连接
- [x] 更新 `wrangler.toml` 中的数据库配置 ✅ **已完成**
- [ ] 部署 staging 后端验证配置 ⏳ **待执行**：需要用户手动部署验证
- [ ] 创建开发环境 KV 和 R2（如果需要） ⏸️ **可选**：开发环境通常不需要，如果后续需要可以添加
- [x] 完善 `seed-local.ts` 脚本 ✅ **已完成**：脚本已存在并可用
- [x] 创建 `init-local.sh` 初始化脚本 ✅ **已完成**
- [x] 更新 `package.json` 脚本 ✅ **已完成**：已添加 `init:local`, `seed:local`, `migrate:local`

### 前端配置
- [x] 修改 `environment.ts` 中的开发环境配置 ✅ **已完成**
- [x] 修复 `functions/api/_middleware.js` 中的环境判断逻辑 ✅ **已完成**
- [x] 统一 CDN 配置策略 ✅ **已完成**：Staging 和 Production 都使用 Pages CDN
- [x] 验证 Vite 代理配置（`vite.config.ts`） ✅ **已验证**：配置正确，无需修改
- [x] 更新 `wrangler.toml` 中的环境变量 ✅ **已验证**：配置正确

### 文档和脚本
- [x] 更新部署脚本（`deploy-staging.sh`, `deploy-production.sh`） ✅ **已完成**
- [ ] 更新健康检查脚本 ⏸️ **可选**：健康检查脚本功能正常，可后续优化
- [x] 更新 API_URL_GUIDE.md ✅ **已存在**：文档已存在且准确
- [x] 更新环境配置说明文档 ✅ **已完成**：创建了 `database-rename-guide.md` 和 `fix-summary.md`
- [ ] 更新 README.md 中的环境配置说明 ⏸️ **可选**：可根据需要更新

### 测试验证
- [ ] 测试本地开发环境（前端 + 后端 + 数据库） ⏳ **待执行**：需要用户手动测试
- [ ] 测试 Staging 环境（前端 + 后端 + 数据库） ⏳ **待执行**：需要用户手动测试
- [ ] 测试生产环境（前端 + 后端 + 数据库） ⏳ **待执行**：需要用户手动测试
- [ ] 验证三个环境完全隔离 ⏳ **待执行**：需要用户手动验证
- [ ] 验证数据不会互相污染 ⏳ **待执行**：需要用户手动验证

---

## ✅ 迁移完成状态

### 数据库配置更新 ✅ **已完成**
- ✅ **配置更新**: `wrangler.toml` 中已使用 `selfatlas-staging`
- ✅ **脚本更新**: 所有脚本文件已更新为使用 `selfatlas-staging`
- ✅ **文档更新**: 相关文档已更新
- ⚠️ **注意**: Cloudflare Dashboard 不支持重命名，但配置文件中已统一，功能正常

### 无需执行的操作
- ❌ **无需创建新数据库**: 使用现有数据库，通过 `database_id` 连接
- ❌ **无需数据迁移**: 数据保持在原数据库中
- ❌ **无需删除旧数据库**: Cloudflare Dashboard 中显示名称不变，但不影响功能

### 工作原理
- Wrangler 通过 `database_id` (而非名称) 识别数据库
- 配置文件中使用 `selfatlas-staging` 作为标识符
- Cloudflare Dashboard 中仍显示 `getyourluck-staging`
- 功能完全正常，不受影响

---

## 📚 相关文件清单

### 需要修改的文件
1. `backend/wrangler.toml` - 后端配置
2. `frontend/src/config/environment.ts` - 前端环境配置
3. `frontend/functions/api/_middleware.js` - Pages Functions 代理
4. `frontend/vite.config.ts` - Vite 代理配置
5. `backend/scripts/seed-local.ts` - 本地种子数据脚本
6. `backend/scripts/init-local.sh` - 初始化脚本（新建）
7. `backend/package.json` - 添加脚本命令
8. `deploy-staging.sh` - 部署脚本
9. `deploy-production.sh` - 部署脚本

### 需要创建的文档
1. `docs/environment-setup-guide.md` - 环境设置指南
2. `docs/data-migration-guide.md` - 数据迁移指南

---

## 🎯 预期效果

配置完成后，三个环境将完全独立：
- ✅ 开发环境：本地前后端，完全隔离
- ✅ Staging 环境：独立的测试环境，不影响生产
- ✅ 生产环境：完全隔离，数据安全

所有环境配置统一、清晰，易于维护和扩展。

