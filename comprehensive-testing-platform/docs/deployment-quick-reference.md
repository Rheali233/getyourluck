# 🚀 部署快速参考

本文档提供 SelfAtlas 测试平台的快速部署命令和常用操作。

## 📋 快速命令

### 环境部署
```bash
# 开发环境
./scripts/deploy.sh development

# 测试环境
./scripts/deploy.sh staging

# 生产环境
./scripts/deploy.sh production
```

### 健康检查
```bash
# 检查指定环境
./scripts/health-check.sh staging

# 检查所有环境
./scripts/health-check.sh development
./scripts/health-check.sh staging
./scripts/health-check.sh production
```

### 回滚操作
```bash
# 回滚到上一个版本
./scripts/rollback.sh staging

# 回滚到指定版本
./scripts/rollback.sh staging v1.2.3
```

## 🔧 手动部署命令

### 后端部署
```bash
cd comprehensive-testing-platform/backend

# 开发环境
wrangler deploy --env development

# 测试环境
wrangler deploy --env staging

# 生产环境
wrangler deploy --env production
```

### 前端部署
```bash
cd comprehensive-testing-platform/frontend

# 构建
npm run build

# 部署到Pages
wrangler pages deploy dist --project-name="selfatlas-testing-platform"
```

## 🧪 验收测试

### 功能测试
```bash
# 启动本地开发
npm run dev

# 运行测试
npm run test

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

### 性能测试
```bash
# 页面加载时间测试
curl -w "@curl-format.txt" -o /dev/null -s "https://your-frontend-url"

# API响应时间测试
curl -w "@curl-format.txt" -o /dev/null -s "https://your-backend-url/health"
```

## 🚨 紧急处理

### 快速回滚
```bash
# 立即回滚到上一个稳定版本
./scripts/rollback.sh production

# 检查回滚后状态
./scripts/health-check.sh production
```

### 问题诊断
```bash
# 查看后端日志
wrangler tail --env staging

# 查看前端构建日志
wrangler pages deployment list --project-name="selfatlas-testing-platform"

# 检查数据库状态
wrangler d1 execute "database-name" --command="SELECT * FROM test_types LIMIT 5"
```

## 📊 监控检查

### 服务状态
```bash
# 后端健康检查
curl https://selfatlas-backend-staging.cyberlina.workers.dev/health

# 前端页面检查
curl https://7614e3a6.selfatlas-testing-platform.pages.dev

# 数据库连接检查
curl https://selfatlas-backend-staging.cyberlina.workers.dev/api/v1/system/health
```

### 性能指标
- **页面加载时间**: < 2秒
- **API响应时间**: < 1秒
- **错误率**: < 0.1%
- **并发支持**: > 1000用户

## 🔐 安全检查

### 安全头验证
```bash
curl -I https://your-frontend-url | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection"
```

### HTTPS验证
```bash
# 检查SSL证书
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## 📝 常用环境变量

### 开发环境
```bash
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_ANALYTICS=false
```

### 测试环境
```bash
NODE_ENV=staging
LOG_LEVEL=debug
ENABLE_ANALYTICS=true
```

### 生产环境
```bash
NODE_ENV=production
LOG_LEVEL=info
ENABLE_ANALYTICS=true
```

## 🆘 故障排除

### 常见问题
1. **部署失败**: 检查wrangler配置和API密钥
2. **构建失败**: 检查TypeScript编译错误
3. **健康检查失败**: 检查服务配置和网络连接
4. **数据库连接失败**: 检查D1数据库配置

### 联系支持
- **技术问题**: 开发团队
- **运维问题**: 运维团队
- **紧急情况**: 24/7 技术支持

---

**注意**: 在生产环境操作前，请务必在测试环境验证所有命令和流程。
