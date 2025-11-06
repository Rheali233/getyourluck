# Cloudflare Pages Functions 部署问题修复指南

## 问题描述
手动通过 Dashboard 上传 dist 目录时，`functions` 目录可能不被 Cloudflare Pages 识别，导致 API 请求返回 405 错误。

## 根本原因
Cloudflare Dashboard 的手动上传功能可能不完全支持 Pages Functions 的特殊目录结构。

## 解决方案

### 方案 1：使用 wrangler CLI 部署（推荐）

1. 确保 API Token 有正确权限：
   - Account → Cloudflare Pages → Edit
   - Account → Account Settings → Read

2. 执行部署命令：
```bash
cd comprehensive-testing-platform/frontend
export CLOUDFLARE_API_TOKEN=your_token_here
npx wrangler pages deploy dist --project-name getyourluck-testing-platform --branch staging
```

### 方案 2：使用 GitHub Actions 自动部署

1. 提交代码到 GitHub
2. GitHub Actions 会自动构建并部署
3. 这种方式会正确识别 functions 目录

### 方案 3：通过 Cloudflare Dashboard Git 集成

1. 在 Cloudflare Dashboard 中配置 Git 集成
2. 连接 GitHub 仓库
3. 设置构建命令：`cd comprehensive-testing-platform/frontend && npm install && npm run build`
4. 设置输出目录：`comprehensive-testing-platform/frontend/dist`
5. 保存后，每次推送代码会自动部署

## 验证部署

部署完成后，测试 API 端点：
```bash
curl https://your-pages-url.pages.dev/api/health
```

如果返回 JSON 而不是 HTML，说明 Functions 已正确部署。
