# 快速开始指南

本指南将帮助你在 10 分钟内完成项目的基础设置和首次部署。

## ⚡ 快速部署清单

### ✅ 必需配置 (5分钟)

1. **Cloudflare 账户信息**
   - [ ] 获取 Account ID
   - [ ] 创建 API Token (Pages:Edit + Workers:Edit 权限)

2. **GitHub Secrets 配置**
   - [ ] 添加 `CLOUDFLARE_API_TOKEN`
   - [ ] 添加 `CLOUDFLARE_ACCOUNT_ID`

### 🚀 自动部署 (5分钟)

1. **推送代码到 main 分支**
2. **GitHub Actions 自动构建部署**
3. **访问部署结果**

## 🔧 详细步骤

### 第一步：获取 Cloudflare 配置

#### 1.1 获取 Account ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 右侧边栏查看 Account ID (32位十六进制)

#### 1.2 创建 API Token
1. 访问 [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 选择 "Custom token"
4. 权限配置：
   ```
   Cloudflare Pages: Edit
   Cloudflare Workers: Edit
   ```
5. 资源范围：选择你的账户
6. 生成并保存 Token

### 第二步：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加两个 secrets：
   - `CLOUDFLARE_API_TOKEN`: 你的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

### 第三步：触发自动部署

#### 方式一：推送代码 (推荐)
```bash
git add .
git commit -m "feat: initial deployment setup"
git push origin main
```

#### 方式二：手动触发
1. 进入 GitHub 仓库的 **Actions** 标签页
2. 选择 **Deploy Frontend to Cloudflare Pages** 工作流
3. 点击 **Run workflow**

### 第四步：验证部署

1. 等待 GitHub Actions 完成 (约 2-3 分钟)
2. 访问部署结果：
   - 生产环境：https://getyourluck-testing-platform.pages.dev
   - 或查看 Actions 日志中的部署链接

## 📱 移动端测试

部署完成后，建议在移动设备上测试：
1. 响应式布局
2. 触摸交互
3. 性能表现

## 🔍 常见问题快速解决

### 问题 1：构建失败
**解决方案**: 检查 Actions 日志，通常是 TypeScript 类型错误

### 问题 2：部署失败
**解决方案**: 验证 GitHub Secrets 配置是否正确

### 问题 3：页面无法访问
**解决方案**: 检查 Cloudflare Pages 项目状态

## 📚 下一步

完成快速部署后，建议阅读：
- [部署配置指南](./deployment-guide.md) - 详细配置说明
- [开发规范](./development-guide.md) - 代码开发标准
- [项目架构](./architecture.md) - 系统架构设计

## 🆘 需要帮助？

如果遇到问题：
1. 查看 GitHub Actions 日志
2. 检查 Cloudflare Dashboard 状态
3. 参考故障排除章节
4. 提交 Issue 到项目仓库

---

**快速开始指南版本**: 1.0.0  
**预计完成时间**: 10 分钟  
**最后更新**: 2024-08-18
