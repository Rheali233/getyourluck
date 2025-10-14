# 预生产环境发布指南

## 🎯 概述

本文档详细说明了如何将综合测试平台部署到预生产环境（staging），包括发布前检查、部署流程和部署后验证。

## 🌍 环境信息

### 预生产环境配置
- **环境名称**: `staging`
- **前端地址**: `https://7614e3a6.selfatlas-testing-platform.pages.dev`
- **后端地址**: `https://selfatlas-backend-staging.cyberlina.workers.dev`
- **数据库**: `selfatlas-staging` (Cloudflare D1)
- **缓存**: `selfatlas-staging-cache` (Cloudflare KV)
- **存储**: `selfatlas-staging-storage` (Cloudflare R2)

### 技术栈
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Cloudflare Workers + Hono.js + TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2
- **部署**: Cloudflare Pages + Cloudflare Workers

## 📋 发布前检查清单

### 1. 代码质量检查
- [ ] **ESLint 检查**: `npm run lint`
- [ ] **TypeScript 类型检查**: `npm run type-check`
- [ ] **单元测试**: `npm run test`
- [ ] **代码覆盖率**: > 80%
- [ ] **所有测试通过**: 无失败测试

### 2. 构建验证
- [ ] **前端构建**: `npm run build` 成功
- [ ] **后端构建**: `npm run build` 成功
- [ ] **构建产物大小**: 合理范围内
- [ ] **静态资源优化**: 图片、CSS、JS 优化
- [ ] **代码分割**: 按模块正确分割

### 3. 环境配置检查
- [ ] **wrangler.toml**: 配置正确
- [ ] **环境变量**: 所有必需变量已设置
- [ ] **数据库连接**: D1 数据库配置正确
- [ ] **KV 存储**: 缓存配置正确
- [ ] **R2 存储**: 文件存储配置正确
- [ ] **API 密钥**: DeepSeek API 密钥配置

### 4. 数据库迁移
- [ ] **迁移文件**: 所有迁移文件完整
- [ ] **数据库结构**: 与代码同步
- [ ] **种子数据**: 测试数据准备就绪
- [ ] **数据库连接**: 测试连接成功

### 5. 安全验证
- [ ] **敏感信息**: 无硬编码密钥
- [ ] **API 安全**: CORS 配置正确
- [ ] **速率限制**: 防止滥用配置
- [ ] **输入验证**: 所有输入已验证

## 🚀 发布流程

### 阶段 1: 预发布准备

```bash
# 1. 检查 Git 状态
git status
git log --oneline -5

# 2. 确保在正确的分支
git branch --show-current

# 3. 拉取最新代码
git pull origin feature/test-preview
```

### 阶段 2: 代码质量检查

```bash
# 4. 进入项目目录
cd comprehensive-testing-platform

# 5. 安装依赖
npm install

# 6. 前端代码质量检查
cd frontend
npm run code-quality
cd ..

# 7. 后端代码质量检查
cd backend
npm run code-quality
cd ..
```

### 阶段 3: 构建和测试

```bash
# 8. 运行所有测试
npm run test

# 9. 构建前端
cd frontend
npm run build
cd ..

# 10. 构建后端
cd backend
npm run build
cd ..
```

### 阶段 4: 部署到预生产环境

```bash
# 11. 执行部署脚本
./scripts/deploy.sh staging

# 12. 等待部署完成
# 部署过程包括：
# - 前端部署到 Cloudflare Pages
# - 后端部署到 Cloudflare Workers
# - 数据库迁移
# - KV 和 R2 存储配置
```

### 阶段 5: 部署后验证

```bash
# 13. 健康检查
./scripts/health-check.sh staging

# 14. 生产环境验证
./scripts/production-validation.sh staging
```

## 🔍 部署后验证

### 1. 基础功能测试
- [ ] **首页加载**: 访问 `https://7614e3a6.selfatlas-testing-platform.pages.dev`
- [ ] **模块导航**: 测试各模块页面加载
- [ ] **搜索功能**: 测试搜索接口
- [ ] **API 健康**: 检查 `/health` 端点

### 2. 模块功能测试
- [ ] **心理学模块**: 测试心理测试功能
- [ ] **职业发展模块**: 测试职业测试功能
- [ ] **占星模块**: 测试占星分析功能
- [ ] **塔罗模块**: 测试塔罗占卜功能
- [ ] **学习能力模块**: 测试学习能力测试
- [ ] **关系模块**: 测试关系测试功能

### 3. 性能测试
- [ ] **页面加载时间**: < 2秒
- [ ] **API 响应时间**: < 1秒
- [ ] **并发性能**: 支持 100+ 并发用户
- [ ] **缓存效果**: KV 缓存正常工作

### 4. 安全测试
- [ ] **HTTPS**: 所有页面使用 HTTPS
- [ ] **安全头**: 正确设置安全头
- [ ] **输入验证**: 防止 XSS 和 SQL 注入
- [ ] **速率限制**: 防止 API 滥用

## 🛠️ 故障排除

### 常见问题

#### 1. 部署失败
```bash
# 检查 wrangler 登录状态
wrangler whoami

# 检查项目配置
wrangler config

# 查看详细错误日志
wrangler deploy --env staging --verbose
```

#### 2. 数据库连接问题
```bash
# 检查数据库状态
wrangler d1 list

# 检查数据库绑定
wrangler d1 info selfatlas-staging
```

#### 3. 前端构建失败
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install

# 重新构建
npm run build
```

#### 4. API 接口问题
```bash
# 检查后端日志
wrangler tail --env staging

# 测试 API 端点
curl https://selfatlas-backend-staging.cyberlina.workers.dev/health
```

### 回滚流程

如果部署后发现问题，可以快速回滚：

```bash
# 1. 回滚到上一个版本
./scripts/rollback.sh staging

# 2. 验证回滚成功
./scripts/health-check.sh staging
```

## 📊 监控和维护

### 1. 性能监控
- **页面加载时间**: 监控 Core Web Vitals
- **API 响应时间**: 监控 API 性能
- **错误率**: 监控 4xx/5xx 错误
- **用户行为**: 监控用户交互

### 2. 日志监控
- **前端错误**: 监控 JavaScript 错误
- **API 错误**: 监控后端错误日志
- **数据库错误**: 监控数据库连接问题
- **缓存错误**: 监控 KV 存储问题

### 3. 定期维护
- **数据库优化**: 定期清理无用数据
- **缓存清理**: 定期清理过期缓存
- **依赖更新**: 定期更新依赖包
- **安全更新**: 及时应用安全补丁

## 📞 联系和支持

如果在部署过程中遇到问题，请联系：

- **技术负责人**: 开发团队
- **运维支持**: Cloudflare 支持
- **紧急联系**: 项目维护者

---

**注意**: 本指南基于当前项目配置编写，如有配置变更请及时更新本文档。
