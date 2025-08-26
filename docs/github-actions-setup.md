# 🔧 GitHub Actions 配置文档

## 📋 概述

本文档说明如何配置GitHub Actions来自动部署项目到Cloudflare平台，解决secrets配置问题。

## ⚠️ 当前警告状态

以下GitHub Actions工作流存在secrets配置警告：

```
cf-workers-backend.yml:
- Context access might be invalid: CF_API_TOKEN
- Context access might be invalid: CF_ACCOUNT_ID
```

## 🔑 需要配置的Secrets

### 1. CF_API_TOKEN
**描述**: Cloudflare API Token，用于访问Cloudflare服务
**获取方式**: 
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 "My Profile" → "API Tokens"
3. 点击 "Create Token"
4. 选择 "Custom token" 模板
5. 配置权限：
   - **Zone**: 选择你的域名或 "All zones"
   - **Account**: 选择 "All accounts"
   - **Permissions**: 
     - Workers Scripts: Edit
     - Workers Routes: Edit
     - Account Settings: Read
     - D1: Edit
     - KV Storage: Edit
     - R2 Storage: Edit
     - Pages: Edit

### 2. CF_ACCOUNT_ID
**描述**: Cloudflare账户ID
**获取方式**:
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 在右侧边栏找到 "Account ID"
3. 复制显示的ID: `257a0c6111ab57bbec3f4e18492c6ac9`

## ⚙️ 配置步骤

### 步骤1: 在GitHub仓库中设置Secrets

1. 进入你的GitHub仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中点击 "Secrets and variables" → "Actions"
4. 点击 "New repository secret"
5. 添加以下secrets：

```
Name: CF_API_TOKEN
Value: [你的Cloudflare API Token]

Name: CF_ACCOUNT_ID  
Value: 257a0c6111ab57bbec3f4e18492c6ac9
```

### 步骤2: 验证Secrets配置

在GitHub Actions工作流中，这些secrets会被正确引用：

```yaml
- name: Publish to Cloudflare Workers (staging)
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CF_API_TOKEN }}
    accountId: ${{ secrets.CF_ACCOUNT_ID }}
    workingDirectory: comprehensive-testing-platform/backend
    command: deploy --env staging
```

## 🚀 工作流配置

### 当前配置的工作流

1. **cf-pages-frontend.yml** - 前端构建和Pages部署
2. **cf-workers-backend.yml** - 后端Workers部署
3. **cloudflare-pages.yml** - 通用Pages配置

### 触发条件

```yaml
on:
  push:
    branches:
      - chore/cf-test-deploy  # 测试部署分支
      - main                   # 主分支
```

### 部署环境

- **测试分支**: 自动部署到staging环境
- **主分支**: 自动部署到production环境

## 🔍 故障排除

### 常见问题

1. **Secrets未找到**
   - 确认secrets名称拼写正确
   - 确认secrets已添加到正确的仓库
   - 检查仓库权限设置

2. **API Token权限不足**
   - 检查API Token的权限配置
   - 确认Token未过期
   - 验证账户权限

3. **部署失败**
   - 检查Cloudflare账户状态
   - 验证wrangler.toml配置
   - 查看GitHub Actions日志

### 调试命令

```bash
# 本地测试Cloudflare配置
npx wrangler whoami

# 测试API Token权限
npx wrangler pages project list

# 检查Workers状态
npx wrangler deployment list --env staging
```

## 📊 监控和日志

### GitHub Actions监控

- **Actions标签**: 查看所有工作流运行状态
- **实时日志**: 点击具体运行查看详细日志
- **失败通知**: 配置邮件或Slack通知

### Cloudflare监控

- **Dashboard**: 查看部署状态和性能
- **Analytics**: 监控访问量和错误率
- **Logs**: 查看实时日志和错误

## 🔐 安全最佳实践

### Secrets管理

1. **定期轮换**: 每90天更新一次API Token
2. **最小权限**: 只授予必要的权限
3. **环境隔离**: 不同环境使用不同的Token
4. **访问控制**: 限制Token的使用范围

### 部署安全

1. **分支保护**: 保护main分支，要求PR审查
2. **环境验证**: 部署前进行自动化测试
3. **回滚策略**: 准备快速回滚方案
4. **监控告警**: 配置异常监控和告警

## 📞 支持信息

### GitHub Actions支持

- **文档**: https://docs.github.com/en/actions
- **Marketplace**: https://github.com/marketplace?type=actions
- **社区**: GitHub Discussions

### Cloudflare支持

- **文档**: https://developers.cloudflare.com/
- **社区**: https://community.cloudflare.com/
- **支持**: https://support.cloudflare.com/

## ✅ 配置检查清单

- [ ] CF_API_TOKEN 已添加到GitHub Secrets
- [ ] CF_ACCOUNT_ID 已添加到GitHub Secrets
- [ ] API Token 具有足够权限
- [ ] 工作流文件语法正确
- [ ] 触发条件配置正确
- [ ] 环境变量配置完整
- [ ] 测试部署成功
- [ ] 生产部署配置完成

---

**最后更新**: 2024年12月
**维护者**: AI Assistant
**状态**: ⚠️ 需要配置Secrets
