# 🚀 Staging环境部署指南

## 📋 部署前检查清单

### ✅ 代码准备
- [x] 前端构建成功
- [x] 后端构建成功  
- [x] 所有TypeScript错误已修复
- [x] 所有ESLint警告已清理
- [x] Console语句已清理

### ✅ 环境配置
- [x] Wrangler配置正确
- [x] 数据库连接配置
- [x] 环境变量设置

## 🔧 部署步骤

### 1. 设置Cloudflare API Token

```bash
# 获取API Token: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
export CLOUDFLARE_API_TOKEN=your_api_token_here
```

### 2. 运行部署脚本

```bash
# 执行自动化部署
./deploy-staging.sh
```

### 3. 手动部署（可选）

如果自动化脚本失败，可以手动执行：

#### 部署后端
```bash
cd backend
npm run build
npx wrangler deploy --env staging
```

#### 部署前端
```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name getyourluck-testing-platform --branch staging
```

## 🔗 部署后的URL

### 后端API
- **Staging**: https://selfatlas-backend-staging.cyberlina.workers.dev
- **健康检查**: https://selfatlas-backend-staging.cyberlina.workers.dev/api/health

### 前端应用
- **Staging**: https://staging.getyourluck-testing-platform.pages.dev
- **主分支**: https://getyourluck-testing-platform.pages.dev

## 🧪 部署后验证

### API测试
```bash
# 测试后端健康状态
curl https://selfatlas-backend-staging.cyberlina.workers.dev/api/health

# 测试数据库连接
curl https://selfatlas-backend-staging.cyberlina.workers.dev/api/system/status
```

### 前端测试
1. 访问前端URL
2. 测试各模块功能
3. 检查API调用是否正常
4. 验证数据库交互

## 🔧 故障排除

### 常见问题

1. **API Token错误**
   ```
   Error: In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN
   ```
   **解决**: 设置正确的API Token

2. **数据库连接失败**
   ```
   Error: D1_ERROR: Database not found
   ```
   **解决**: 检查wrangler.toml中的database_id

3. **构建失败**
   ```
   Error: Build failed
   ```
   **解决**: 检查TypeScript错误和依赖问题

### 回滚方案

如果部署出现问题，可以快速回滚：

```bash
# 回滚到上一个版本
npx wrangler rollback --env staging
```

## 📊 监控和日志

### 查看部署日志
```bash
# 查看Worker日志
npx wrangler tail --env staging

# 查看Pages部署状态
npx wrangler pages deployment list --project-name getyourluck-testing-platform
```

### 性能监控
- Cloudflare Analytics
- Worker Analytics
- Pages Analytics

## 🔒 安全检查

- [x] API端点安全配置
- [x] CORS设置正确
- [x] 环境变量安全
- [x] 数据库访问控制

## 📝 部署记录

| 日期 | 版本 | 部署者 | 状态 | 备注 |
|------|------|--------|------|------|
| 2025-10-20 | v1.0.0 | AI Assistant | ✅ 成功 | 初始部署 |

---

**注意**: 确保在部署前已完成所有代码质量检查和功能测试。
