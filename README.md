# SelfAtlas 综合测试平台

基于 Cloudflare 全栈架构的现代化在线测试平台，提供心理测试、占星分析、塔罗占卜等多种测试服务。

## 🌍 语言要求

**重要说明：** 本项目的所有用户界面、内容展示、API响应等均使用英文作为主要语言。

- **用户界面**: 所有前端组件、页面标题、按钮文字、提示信息等必须使用英文
- **内容展示**: 测试题目、结果分析、推荐内容、博客文章等必须使用英文  
- **API接口**: 所有API响应中的message、error等字段必须使用英文
- **数据库内容**: 存储的测试题目、结果模板、内容配置等必须使用英文
- **错误信息**: 所有错误提示、验证消息等必须使用英文

详细的语言使用规范请参考 [开发规范文档](./comprehensive-testing-platform/.kiro/specs/comprehensive-testing-platform/development-guide.md#0-项目语言要求)。

## 🏗️ 项目架构

```
selfatlas/
├── comprehensive-testing-platform/     # 主要项目目录
│   ├── frontend/                      # 前端应用 (React + TypeScript)
│   ├── backend/                       # 后端服务 (Cloudflare Workers)
│   └── shared/                        # 共享类型和工具
├── .github/                           # GitHub Actions 工作流
└── docs/                              # 项目文档
```

## 🚀 技术栈

### 前端技术栈
- **框架**: React.js 18+ (函数组件 + Hooks)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS + 自定义设计系统
- **构建**: Vite
- **状态管理**: Zustand
- **路由**: React Router v6
- **测试**: Vitest + React Testing Library

### 后端技术栈
- **运行环境**: Cloudflare Workers
- **框架**: Hono.js
- **语言**: TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2

## 🌐 部署环境

### Cloudflare Pages (前端)
- **项目名称**: `selfatlas-testing-platform`
- **生产环境**: https://selfatlas-testing-platform.pages.dev
- **预览环境**: 每次 PR 自动生成预览链接
- **状态**: ✅ 已部署并正常运行

### Cloudflare Workers (后端)
- **项目名称**: `selfatlas-backend`
- **测试环境**: `selfatlas-backend-staging`
  - **URL**: https://selfatlas-backend-staging.cyberlina.workers.dev
  - **状态**: ✅ 已部署并正常运行
  - **数据库**: D1 数据库已配置
  - **缓存**: KV 存储已配置
  - **存储**: R2 存储桶已配置
- **生产环境**: 待配置 (需要正式域名)
- **开发环境**: 本地开发支持

## 🔧 本地开发

### 环境要求
- Node.js 20+
- npm 或 yarn
- Git

### 前端开发
```bash
cd comprehensive-testing-platform/frontend
npm install
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

### 后端开发
```bash
cd comprehensive-testing-platform/backend
npm install
npm run dev          # 启动本地开发环境
npm run deploy       # 部署到 Cloudflare Workers
```

## 🚀 自动化部署

### GitHub Actions 工作流

#### 1. 前端自动部署 (`cloudflare-pages.yml`)
- **触发条件**: 
  - 推送到 `main` 分支 → 生产部署
  - 创建 PR → 预览部署
  - 手动触发
- **工作流程**:
  1. Checkout 代码
  2. 设置 Node.js 20 环境
  3. 安装依赖 (`npm ci`)
  4. 构建项目 (`npm run build`)
  5. 部署到 Cloudflare Pages

#### 2. 后端自动部署 (`cf-workers-backend.yml`)
- **触发条件**: 推送到 `main` 分支
- **工作流程**:
  1. 构建 Workers 项目
  2. 部署到 Cloudflare Workers

### 必需的 GitHub Secrets

在仓库 **Settings → Secrets and variables → Actions** 中配置：

#### CLOUDFLARE_API_TOKEN
1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 创建新的 API Token
3. 权限配置：
   - **Cloudflare Pages**: Edit
   - **Cloudflare Workers**: Edit
   - **Cloudflare D1**: Edit
   - **Cloudflare KV**: Edit
   - **Cloudflare R2**: Edit
4. 资源范围：选择特定账户或所有账户

#### CLOUDFLARE_ACCOUNT_ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在右侧边栏查看 Account ID

## 📁 配置文件说明

### 前端配置 (`frontend/wrangler.toml`)
```toml
name = "selfatlas-frontend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# Cloudflare Pages 构建产物目录
pages_build_output_dir = "dist"

# 环境变量配置
[env.production.vars]
NODE_ENV = "production"
API_BASE_URL = "https://api.selfatlas.net"
CDN_BASE_URL = "https://cdn.selfatlas.net"

[env.preview.vars]
NODE_ENV = "staging"
API_BASE_URL = "https://selfatlas-backend-staging.cyberlina.workers.dev"
CDN_BASE_URL = "https://staging-cdn.selfatlas.net"
```

### 后端配置 (`backend/wrangler.toml`)
```toml
name = "selfatlas-backend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# 环境配置
[env.staging]
name = "selfatlas-backend-staging"
# 测试环境已配置 D1、KV、R2 等资源

[env.development]
name = "selfatlas-backend-dev"
# 本地开发环境配置

[env.production]
name = "selfatlas-backend-prod"
# 生产环境配置 (需要正式域名)
```

## 🔄 部署流程
### 当前部署状态
- **✅ 前端**: 生产环境和预览环境已部署并正常运行
- **✅ 后端测试环境**: 已部署并正常运行，API 端点已验证
- **⏳ 后端生产环境**: 等待正式域名配置
- **✅ 前后端集成**: 测试环境集成验证成功

### 前端部署流程
1. **开发阶段**: 本地 `npm run dev` 进行开发
2. **提交代码**: 推送到 GitHub 仓库
3. **自动构建**: GitHub Actions 自动触发构建
4. **自动部署**: 构建成功后自动部署到 Cloudflare Pages
5. **访问验证**: 通过 Pages URL 访问部署结果

### 后端部署流程
1. **本地开发**: 使用 `npm run dev` 进行本地测试
2. **代码提交**: 推送到 main 分支
3. **自动部署**: GitHub Actions 自动部署到 Cloudflare Workers
4. **环境切换**: 支持开发/测试/生产环境

## 📊 监控和日志

### Cloudflare Analytics
- 访问 [Cloudflare Analytics](https://dash.cloudflare.com/analytics)
- 查看 Pages 和 Workers 的性能指标
- 监控错误率和响应时间

### GitHub Actions 日志
- 在仓库的 Actions 标签页查看构建日志
- 监控构建状态和部署结果
- 设置构建失败通知

## 🛠️ 故障排除

### 常见问题

#### 1. 构建失败
- 检查 TypeScript 类型错误
- 验证依赖安装是否正确
- 查看 GitHub Actions 日志

#### 2. 部署失败
- 验证 Cloudflare API Token 权限
- 检查 Account ID 是否正确
- 确认项目名称配置

#### 3. 环境变量问题
- 检查 wrangler.toml 配置
- 验证 GitHub Secrets 设置
- 确认环境变量名称正确

### 调试命令
```bash
# 前端构建检查
npm run build

# 类型检查
npx tsc --noEmit

# 本地部署测试
npx wrangler pages deploy dist --project-name selfatlas-testing-platform

# 查看 Workers 日志
npx wrangler tail

# 测试 API 端点 (测试环境)
curl https://selfatlas-backend-staging.cyberlina.workers.dev/health
curl https://selfatlas-backend-staging.cyberlina.workers.dev/api
curl https://selfatlas-backend-staging.cyberlina.workers.dev/api/tests
```

### 已验证的 API 端点
- **健康检查**: `GET /health` ✅
- **API 信息**: `GET /api` ✅
- **测试模块**: `GET /api/tests` ✅
- **博客模块**: `GET /api/blog` ✅
- **首页模块**: `GET /api/homepage` ✅

## 📚 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [项目开发规范](./docs/development-guide.md)

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📊 项目状态

### 开发进度
- **前端**: 100% 完成 ✅
- **后端**: 80% 完成 (测试环境完成，生产环境待配置)
- **前后端集成**: 100% 完成 ✅
- **部署自动化**: 100% 完成 ✅

### 下一步计划
1. 配置正式域名 (selfatlas.net)
2. 部署后端生产环境
3. 完善数据库内容和测试数据
4. 性能优化和监控

---

**最后更新**: 2025-08-18
**维护者**: SelfAtlas 开发团队
**当前状态**: 测试环境完全可用，生产环境部署中
