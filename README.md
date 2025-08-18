# GetYourLuck 综合测试平台

基于 Cloudflare 全栈架构的现代化在线测试平台，提供心理测试、占星分析、塔罗占卜等多种测试服务。

## 🏗️ 项目架构

```
getyourluck/
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
- **项目名称**: `getyourluck-testing-platform`
- **生产环境**: https://getyourluck-testing-platform.pages.dev
- **预览环境**: 每次 PR 自动生成预览链接

### Cloudflare Workers (后端)
- **项目名称**: `getyourluck-backend`
- **环境**: 开发/测试/生产

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
name = "getyourluck-frontend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# Cloudflare Pages 构建产物目录
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

### 后端配置 (`backend/wrangler.toml`)
```toml
name = "getyourluck-backend"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# 环境配置
[env.development]
name = "getyourluck-backend-dev"
vars = { NODE_ENV = "development" }

[env.production]
name = "getyourluck-backend-prod"
vars = { NODE_ENV = "production" }
```

## 🔄 部署流程

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
npx wrangler pages deploy dist --project-name getyourluck-testing-platform

# 查看 Workers 日志
npx wrangler tail
```

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

---

**最后更新**: 2024-08-18
**维护者**: GetYourLuck 开发团队
