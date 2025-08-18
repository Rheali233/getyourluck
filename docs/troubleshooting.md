# 故障排除指南

本文档提供常见问题的解决方案和调试技巧。

## 🚨 紧急问题

### 网站无法访问
**症状**: 网站完全无法加载
**快速检查**:
1. 检查 Cloudflare Pages 状态
2. 查看 GitHub Actions 构建状态
3. 验证域名配置

**解决方案**:
```bash
# 检查部署状态
npx wrangler pages project list

# 重新部署
npx wrangler pages deploy dist --project-name getyourluck-testing-platform
```

## 🔧 构建问题

### TypeScript 编译错误
**症状**: `npm run build` 失败，显示类型错误
**常见原因**:
- 类型定义不匹配
- 导入路径错误
- 接口定义缺失

**解决方案**:
```bash
# 检查类型错误
npx tsc --noEmit

# 修复类型问题
npm run type-check

# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 依赖安装失败
**症状**: `npm install` 失败
**解决方案**:
```bash
# 清理缓存
npm cache clean --force

# 使用 yarn 替代
yarn install

# 检查 Node.js 版本
node --version  # 需要 20+
```

## 🚀 部署问题

### GitHub Actions 失败
**症状**: 自动部署工作流失败
**检查步骤**:
1. 查看 Actions 日志
2. 验证 Secrets 配置
3. 检查构建命令

**常见 Secrets 问题**:
```bash
# 验证 Secrets 是否存在
# 在仓库 Settings → Secrets → Actions 中检查：
# - CLOUDFLARE_API_TOKEN
# - CLOUDFLARE_ACCOUNT_ID
```

### Cloudflare Pages 部署失败
**症状**: 构建成功但部署失败
**解决方案**:
```bash
# 检查项目状态
npx wrangler pages project list

# 手动部署测试
npx wrangler pages deploy dist --project-name getyourluck-testing-platform

# 检查权限
npx wrangler whoami
```

## 🌐 运行时问题

### 环境变量未定义
**症状**: 应用运行时环境变量为 undefined
**检查项目**:
1. `wrangler.toml` 配置
2. Cloudflare Pages 环境变量设置
3. GitHub Secrets 配置

**解决方案**:
```toml
# frontend/wrangler.toml
[env.production.vars]
NODE_ENV = "production"
API_BASE_URL = "https://api.getyourluck.com"
```

### API 调用失败
**症状**: 前端无法调用后端 API
**检查项目**:
1. API 端点是否正确
2. CORS 配置
3. 网络请求状态

**调试方法**:
```javascript
// 在浏览器控制台检查
console.log('API URL:', process.env.API_BASE_URL);
console.log('Response:', await fetch('/api/test'));
```

## 📱 移动端问题

### 响应式布局问题
**症状**: 移动端显示异常
**检查项目**:
1. Tailwind CSS 响应式类名
2. 媒体查询配置
3. 视口设置

**解决方案**:
```html
<!-- 确保视口设置正确 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 触摸交互问题
**症状**: 移动端触摸不响应
**检查项目**:
1. 触摸事件监听器
2. 按钮大小 (最小 44x44px)
3. 触摸友好的组件

## 🔍 调试技巧

### 前端调试
```bash
# 开发模式
npm run dev

# 构建检查
npm run build

# 类型检查
npx tsc --noEmit

# 代码质量检查
npm run lint
```

### 后端调试
```bash
# 本地开发
npm run dev

# 查看日志
npx wrangler tail

# 测试 API
curl https://your-worker.your-subdomain.workers.dev/health
```

### 网络调试
```bash
# 检查 DNS
nslookup getyourluck-testing-platform.pages.dev

# 检查 HTTPS
curl -I https://getyourluck-testing-platform.pages.dev

# 检查 Cloudflare 状态
npx wrangler pages project list
```

## 📊 性能问题

### 页面加载缓慢
**症状**: 页面加载时间超过 3 秒
**优化建议**:
1. 启用代码分割
2. 优化图片资源
3. 使用 CDN 加速
4. 启用缓存策略

### 构建时间过长
**症状**: GitHub Actions 构建时间超过 5 分钟
**优化建议**:
1. 启用依赖缓存
2. 优化构建命令
3. 使用并行构建
4. 清理不必要的依赖

## 🆘 获取帮助

### 自助排查
1. 查看本文档
2. 检查 GitHub Issues
3. 搜索 Stack Overflow

### 提交 Issue
如果问题无法解决，请提交 Issue：
1. 描述问题现象
2. 提供错误日志
3. 说明复现步骤
4. 附上环境信息

### Issue 模板
```markdown
## 问题描述
[详细描述问题]

## 复现步骤
1. 
2. 
3. 

## 期望结果
[描述期望的正确行为]

## 实际结果
[描述实际发生的错误]

## 环境信息
- 操作系统: 
- Node.js 版本: 
- 浏览器版本: 
- 错误日志: 
```

## 📚 相关资源

- [Cloudflare 官方文档](https://developers.cloudflare.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

---

**故障排除指南版本**: 1.0.0  
**最后更新**: 2024-08-18  
**维护者**: GetYourLuck 开发团队
