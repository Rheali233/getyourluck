# 🚀 部署流程指南

本文档详细说明了 SelfAtlas 测试平台的完整部署流程，从开发验收到生产环境部署的全过程。

## 📋 部署流程概览

```
开发完成 → 开发环境验收 → 测试环境部署 → 测试环境验收 → 生产环境部署 → 生产环境验收
   ↓              ↓              ↓              ↓              ↓              ↓
 本地开发      本地验证         Staging        Staging         Production     Production
 环境测试      功能测试         环境部署        环境验收        环境部署        环境验收
```

## 🌍 环境配置

### 开发环境 (Development)
- **后端**: `selfatlas-backend-dev.workers.dev`
- **前端**: 本地开发服务器 (localhost:5173)
- **数据库**: `selfatlas-local` (本地D1数据库)
- **特点**: 调试模式、无缓存、详细日志

### 测试环境 (Staging)
- **后端**: `selfatlas-backend-staging.cyberlina.workers.dev`
- **前端**: `https://7614e3a6.selfatlas-testing-platform.pages.dev`
- **数据库**: `selfatlas-staging`
- **特点**: 接近生产环境、中等性能设置

### 生产环境 (Production)
- **后端**: `selfatlas-backend-prod.workers.dev`
- **前端**: `https://api.selfatlas.net`
- **数据库**: `getyourluck-prod`
- **特点**: 高性能设置、完整缓存、生产级监控

---

## 🔄 详细部署流程

### 阶段1: 开发验收完成 ✅

#### 1.1 代码质量检查
```bash
# TypeScript编译检查
cd comprehensive-testing-platform/frontend && npm run type-check
cd comprehensive-testing-platform/backend && npm run type-check

# ESLint检查
npm run lint --workspaces

# 单元测试
npm run test --workspaces

# 构建验证
npm run build --workspaces
```

#### 1.2 本地功能验收
```bash
# 启动本地开发环境
npm run dev

# 验收清单：
# ✅ 所有模块功能正常
# ✅ 测试流程完整
# ✅ 结果展示正确
# ✅ 响应式设计正常
# ✅ 性能表现良好
# ✅ 无控制台错误
```

#### 1.3 代码审查
- [ ] 代码符合项目规范
- [ ] 无安全漏洞
- [ ] 性能优化完成
- [ ] 文档更新完成

---

### 阶段2: 开发环境部署 🧪

#### 2.1 部署到开发环境
```bash
# 部署后端到开发环境
cd comprehensive-testing-platform/backend
wrangler deploy --env development

# 启动前端开发服务器
cd comprehensive-testing-platform/frontend
npm run dev
```

#### 2.2 开发环境验收
```bash
# 验收测试
curl -X GET "https://selfatlas-backend-dev.workers.dev/health"
curl -X GET "http://localhost:5173"

# 验收清单：
# ✅ 开发环境API正常响应
# ✅ 前端页面正常加载
# ✅ 数据库连接正常
# ✅ 缓存功能正常
# ✅ 日志记录正常
```

---

### 阶段3: 测试环境部署 🧪

#### 3.1 部署到Staging环境
```bash
# 使用部署脚本
./scripts/deploy.sh staging

# 或手动部署
cd comprehensive-testing-platform/backend
wrangler deploy --env staging

cd comprehensive-testing-platform/frontend
wrangler pages deploy dist --project-name="selfatlas-testing-platform"
```

#### 3.2 测试环境验收
```bash
# 验收测试
curl -X GET "https://selfatlas-backend-staging.cyberlina.workers.dev/health"
curl -X GET "https://7614e3a6.selfatlas-testing-platform.pages.dev"

# 功能验收清单：
# ✅ 所有测试模块功能正常
# ✅ 数据库操作正常
# ✅ 缓存机制正常
# ✅ 性能指标达标
# ✅ 安全配置正确
# ✅ 监控告警正常
```

#### 3.3 性能验收
```bash
# 性能测试
# ✅ 页面加载时间 < 2秒
# ✅ API响应时间 < 1秒
# ✅ 并发处理能力测试
# ✅ 内存使用率正常
# ✅ 错误率 < 1%
```

---

### 阶段4: 生产环境部署 🚀

#### 4.1 生产环境准备
```bash
# 1. 确保在main分支
git checkout main
git pull origin main

# 2. 创建生产部署标签
git tag "release-$(date +%Y%m%d-%H%M%S)"
git push origin "release-$(date +%Y%m%d-%H%M%S)"

# 3. 备份生产数据库
wrangler d1 export "getyourluck-prod" --output="backup-$(date +%Y%m%d).sql"
```

#### 4.2 生产环境部署
```bash
# 使用部署脚本
./scripts/deploy.sh production

# 或手动部署
cd comprehensive-testing-platform/backend
wrangler deploy --env production

cd comprehensive-testing-platform/frontend
wrangler pages deploy dist --project-name="selfatlas-frontend-prod"
```

#### 4.3 生产环境验收
```bash
# 验收测试
curl -X GET "https://api.selfatlas.net/health"
curl -X GET "https://selfatlas.net"

# 生产验收清单：
# ✅ 所有功能正常
# ✅ 性能指标达标
# ✅ 安全配置正确
# ✅ 监控告警正常
# ✅ 备份机制正常
# ✅ 回滚准备完成
```

---

## 🛡️ 质量保证机制

### 自动化检查
```bash
# 每次部署前自动执行
npm run quality-check

# 包含：
# - TypeScript编译
# - ESLint检查
# - 单元测试
# - 构建验证
# - 安全扫描
```

### 回滚策略
```bash
# 如果发现问题，立即回滚
./scripts/rollback.sh [environment] [previous-version]

# 回滚清单：
# ✅ 代码回滚
# ✅ 数据库回滚
# ✅ 配置回滚
# ✅ 监控恢复
```

### 监控告警
- **性能监控**: 响应时间、吞吐量
- **错误监控**: 错误率、异常日志
- **资源监控**: CPU、内存、存储
- **业务监控**: 用户行为、转化率

---

## 📊 验收标准

### 功能验收
- [ ] 所有测试模块正常运行
- [ ] 用户流程完整无缺
- [ ] 数据存储和检索正常
- [ ] 第三方集成正常

### 性能验收
- [ ] 页面加载时间 < 2秒
- [ ] API响应时间 < 1秒
- [ ] 并发用户支持 > 1000
- [ ] 错误率 < 0.1%

### 安全验收
- [ ] 输入验证完整
- [ ] 认证授权正常
- [ ] 数据加密正确
- [ ] 安全头配置正确

---

## 🎯 部署命令总结

```bash
# 完整部署流程
./scripts/deploy.sh development  # 开发环境
./scripts/deploy.sh staging      # 测试环境  
./scripts/deploy.sh production   # 生产环境

# 验收测试
./scripts/health-check.sh [environment]

# 回滚操作
./scripts/rollback.sh [environment] [version]
```

---

## 🚨 紧急处理

### 生产环境问题
1. **立即回滚**: 使用回滚脚本快速恢复
2. **问题诊断**: 查看监控和日志
3. **修复验证**: 在测试环境验证修复
4. **重新部署**: 修复后重新部署

### 联系信息
- **技术负责人**: 开发团队
- **运维负责人**: 运维团队
- **紧急联系**: 24/7 技术支持

---

## 📚 相关文档

- [项目架构文档](../README.md)
- [开发指南](./frontend-development-quick-reference.md)
- [API文档](./api-documentation.md)
- [监控指南](./monitoring-guide.md)

---

**注意**: 本部署流程会根据项目发展持续更新，请定期查看最新版本。
