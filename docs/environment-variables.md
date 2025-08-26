# 🔐 环境变量配置文档

## 📋 概述

本文档记录了项目在不同环境中需要的所有环境变量，包括前端、后端和部署相关的配置。

## 🌍 环境分类

### 开发环境 (Development)
- **用途**: 本地开发和测试
- **配置文件**: `.env.local`
- **特点**: 使用本地服务和模拟数据

### 测试环境 (Staging)
- **用途**: 集成测试和预发布验证
- **配置文件**: Cloudflare Dashboard
- **特点**: 使用Cloudflare Staging服务

### 生产环境 (Production)
- **用途**: 正式用户访问
- **配置文件**: Cloudflare Dashboard
- **特点**: 使用Cloudflare Production服务

## 🎯 前端环境变量

### 基础配置
```bash
# 环境标识
VITE_ENVIRONMENT=development|staging|production

# API基础URL
VITE_API_BASE_URL=http://localhost:8787|https://getyourluck-backend-staging.cyberlina.workers.dev|https://api.getyourluck.com

# CDN基础URL
VITE_CDN_BASE_URL=http://localhost:8787|https://staging-cdn.getyourluck.com|https://cdn.getyourluck.com

# Pages项目名称
VITE_PAGES_PROJECT_NAME=getyourluck-testing-platform
```

### AI服务配置
```bash
# DeepSeek API密钥
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here

# AI服务配置
VITE_AI_SERVICE_ENABLED=true
VITE_AI_SERVICE_TIMEOUT=30000
VITE_AI_SERVICE_RETRY_COUNT=3
```

### 功能开关
```bash
# 功能模块开关
VITE_ENABLE_ANALYTICS=false|true|true
VITE_ENABLE_CACHE=false|true|true
VITE_ENABLE_DEBUG=false|true|false

# 测试功能
VITE_ENABLE_TEST_MODE=true|false|false
VITE_ENABLE_MOCK_DATA=true|false|false
```

## ⚡ 后端环境变量

### 基础配置
```bash
# 环境标识
NODE_ENV=development|staging|production

# 日志级别
LOG_LEVEL=debug|debug|info

# 端口配置
PORT=8787|8787|8787
```

### AI服务配置
```bash
# DeepSeek API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_BASE_URL=https://api.deepseek.com
DEEPSEEK_API_TIMEOUT=30000
DEEPSEEK_API_RETRY_COUNT=3

# AI服务开关
ENABLE_AI_SERVICE=true
AI_SERVICE_RATE_LIMIT=100
AI_SERVICE_CACHE_TTL=3600
```

### 数据库配置
```bash
# D1数据库配置
DB_BINDING=DB
DB_NAME=getyourluck-local|getyourluck-staging|getyourluck-prod

# 数据库连接池
DB_MAX_CONNECTIONS=10
DB_CONNECTION_TIMEOUT=5000
DB_QUERY_TIMEOUT=10000
```

### 缓存配置
```bash
# KV存储配置
KV_BINDING=CACHE
KV_TTL=300|1800|3600

# 缓存策略
CACHE_ENABLED=false|true|true
CACHE_MAX_SIZE=100
CACHE_CLEANUP_INTERVAL=3600000
```

### 安全配置
```bash
# 请求限制
MAX_REQUEST_SIZE=2097152|1048576|1048576
RATE_LIMIT_WINDOW=60000|60000|60000
RATE_LIMIT_MAX=1000|200|100

# 安全头
ENABLE_SECURITY_HEADERS=true
ENABLE_CORS=true
CORS_ORIGIN=*|https://*.getyourluck.com|https://getyourluck.com
```

## 🚀 部署环境变量

### Cloudflare配置
```bash
# 账户信息
CF_ACCOUNT_ID=257a0c6111ab57bbec3f4e18492c6ac9
CF_API_TOKEN=your_cloudflare_api_token_here

# 项目配置
CF_PAGES_PROJECT_NAME=getyourluck-testing-platform
CF_WORKERS_PROJECT_NAME=getyourluck-backend
```

### 构建配置
```bash
# 构建工具
BUILD_TOOL=vite
BUILD_OUTPUT_DIR=dist
BUILD_SOURCE_MAP=true|false|false

# 优化配置
BUILD_MINIFY=true
BUILD_COMPRESS=true
BUILD_TREESHAKE=true
```

## 📁 配置文件位置

### 前端配置
```
comprehensive-testing-platform/frontend/
├── .env.local              # 本地开发环境变量
├── .env.example            # 环境变量示例文件
├── src/config/environment.ts # 环境配置管理
└── wrangler.toml           # Cloudflare Pages配置
```

### 后端配置
```
comprehensive-testing-platform/backend/
├── .env.local              # 本地开发环境变量
├── .env.example            # 环境变量示例文件
├── wrangler.toml           # Cloudflare Workers配置
└── wrangler.dev.toml       # 开发环境配置
```

### 根目录配置
```
getyourluck/
├── .env                    # 全局环境变量
├── .env.example            # 全局环境变量示例
└── .gitignore              # Git忽略文件
```

## 🔧 配置方法

### 方法1: 本地开发 (.env.local)
```bash
# 创建本地环境文件
cp .env.example .env.local

# 编辑环境变量
nano .env.local

# 重启开发服务器
npm run dev
```

### 方法2: Cloudflare Dashboard
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择你的Workers项目
3. 进入 "Settings" → "Variables"
4. 添加或编辑环境变量
5. 重新部署项目

### 方法3: Wrangler CLI
```bash
# 设置环境变量
npx wrangler secret put DEEPSEEK_API_KEY --env staging

# 查看环境变量
npx wrangler secret list --env staging

# 删除环境变量
npx wrangler secret delete DEEPSEEK_API_KEY --env staging
```

## ✅ 环境变量检查清单

### 前端检查
- [ ] VITE_ENVIRONMENT 已设置
- [ ] VITE_API_BASE_URL 已设置
- [ ] VITE_DEEPSEEK_API_KEY 已设置
- [ ] VITE_CDN_BASE_URL 已设置
- [ ] VITE_PAGES_PROJECT_NAME 已设置

### 后端检查
- [ ] NODE_ENV 已设置
- [ ] DEEPSEEK_API_KEY 已设置
- [ ] LOG_LEVEL 已设置
- [ ] DB_BINDING 已设置
- [ ] KV_BINDING 已设置

### 部署检查
- [ ] CF_ACCOUNT_ID 已设置
- [ ] CF_API_TOKEN 已设置
- [ ] CF_PAGES_PROJECT_NAME 已设置
- [ ] CF_WORKERS_PROJECT_NAME 已设置

## 🚨 安全注意事项

### 敏感信息保护
1. **API密钥**: 永远不要提交到Git仓库
2. **数据库密码**: 使用环境变量或secrets管理
3. **访问令牌**: 定期轮换和更新
4. **调试信息**: 生产环境禁用详细日志

### 最佳实践
1. **最小权限**: 只授予必要的权限
2. **环境隔离**: 不同环境使用不同的密钥
3. **定期轮换**: 定期更新API密钥和令牌
4. **监控告警**: 配置异常访问监控

## 🔍 故障排除

### 常见问题
1. **环境变量未生效**
   - 检查变量名拼写
   - 确认配置文件位置
   - 重启开发服务器

2. **API调用失败**
   - 验证API密钥
   - 检查API端点URL
   - 确认网络连接

3. **构建失败**
   - 检查必需的环境变量
   - 验证配置文件语法
   - 查看构建日志

### 调试命令
```bash
# 检查环境变量
echo $VITE_API_BASE_URL
echo $NODE_ENV

# 验证配置
npx wrangler whoami
npx wrangler pages project list

# 查看日志
npx wrangler tail --env staging
```

---

**最后更新**: 2024年12月
**维护者**: AI Assistant
**状态**: 🟢 配置完整
