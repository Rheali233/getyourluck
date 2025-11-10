# Cloudflare 缓存清除指南

## 📋 概述

当 Cloudflare Pages 部署后出现静态资源 MIME 类型错误时，可能需要清除 Cloudflare 的缓存以确保最新配置生效。

## 🔧 方法 1：通过 Cloudflare Dashboard 清除缓存

### 步骤 1：登录 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 使用您的账户凭据登录

### 步骤 2：选择您的账户

1. 在顶部导航栏，选择包含 `getyourluck-testing-platform` 项目的账户

### 步骤 3：进入 Pages 项目

1. 在左侧菜单中，点击 **"Workers & Pages"** 或 **"Pages"**
2. 找到并点击项目：**`getyourluck-testing-platform`**

### 步骤 4：清除部署缓存

**对于 Cloudflare Pages，缓存清除方法：**

1. 在项目页面，找到 **"Deployments"** 标签页
2. 找到最新的部署（staging 分支）
3. 点击部署右侧的 **"..."** 菜单
4. 选择 **"Retry deployment"** 或 **"Redeploy"** 来触发重新部署

**或者：**

1. 在项目设置中，找到 **"Custom domains"** 或 **"Settings"**
2. 查看是否有缓存相关设置
3. 如果使用自定义域名，可能需要清除该域名的缓存

### 步骤 5：清除域名缓存（如果使用自定义域名）

如果您使用了自定义域名（如 `staging.getyourluck-testing-platform.pages.dev`）：

1. 在 Cloudflare Dashboard 中，选择对应的域名（如果有）
2. 进入 **"Caching"** 标签页
3. 点击 **"Purge Everything"** 按钮
4. 确认清除所有缓存

## 🔧 方法 2：通过 Cloudflare API 清除缓存

### 使用 curl 命令清除缓存

```bash
# 设置 API Token
export CLOUDFLARE_API_TOKEN="your_api_token_here"
export ZONE_ID="your_zone_id_here"  # 如果有自定义域名

# 清除所有缓存
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### 使用 Wrangler CLI

```bash
# 清除特定 URL 的缓存
npx wrangler pages deployment list --project-name=getyourluck-testing-platform

# 重新部署以清除缓存
cd comprehensive-testing-platform/frontend
npx wrangler pages deploy dist \
  --project-name getyourluck-testing-platform \
  --branch staging
```

## 🔧 方法 3：强制重新部署（推荐用于 Pages）

对于 Cloudflare Pages，最有效的方法是触发一次新的部署：

```bash
cd comprehensive-testing-platform/frontend

# 方法 1：使用 wrangler 重新部署
npx wrangler pages deploy dist \
  --project-name getyourluck-testing-platform \
  --branch staging

# 方法 2：通过 Git 触发部署
# 创建一个空提交来触发重新部署
git commit --allow-empty -m "chore: trigger redeploy to clear cache"
git push origin staging
```

## 🔧 方法 4：使用浏览器清除缓存

在清除 Cloudflare 缓存后，还需要清除浏览器缓存：

1. **Chrome/Edge**:
   - 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
   - 选择 "缓存的图片和文件"
   - 点击 "清除数据"

2. **Firefox**:
   - 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
   - 选择 "缓存"
   - 点击 "立即清除"

3. **Safari**:
   - 按 `Cmd+Option+E` 清除缓存
   - 或使用 "开发" → "清空缓存"

4. **使用无痕模式**:
   - 打开浏览器的无痕/隐私模式
   - 访问网站以查看最新内容

## ⚠️ 注意事项

1. **Cloudflare Pages 缓存**:
   - Cloudflare Pages 的缓存机制与传统的 CDN 缓存略有不同
   - Pages 主要缓存静态资源，Functions 通常不缓存
   - 重新部署通常会自动清除相关缓存

2. **等待时间**:
   - 清除缓存后，可能需要等待几分钟才能生效
   - 全球 CDN 节点可能需要更长时间同步

3. **验证缓存清除**:
   ```bash
   # 检查响应头中的缓存信息
   curl -I https://staging.getyourluck-testing-platform.pages.dev/css/index-D3nnq2mv.css
   
   # 查看 Cache-Control 和 ETag 头
   ```

## 🎯 针对当前问题的建议

对于 `_routes.json` 配置不生效的问题：

1. **立即操作**:
   ```bash
   # 重新部署以触发配置更新
   cd comprehensive-testing-platform/frontend
   npx wrangler pages deploy dist \
     --project-name getyourluck-testing-platform \
     --branch staging
   ```

2. **等待 5-10 分钟**，让 Cloudflare 处理新配置

3. **清除浏览器缓存**，使用无痕模式访问

4. **验证修复**:
   ```bash
   # 检查 _routes.json 是否返回 JSON 而不是 HTML
   curl https://staging.getyourluck-testing-platform.pages.dev/_routes.json
   
   # 检查静态资源是否返回正确的 MIME 类型
   curl -I https://staging.getyourluck-testing-platform.pages.dev/css/index-D3nnq2mv.css
   ```

## 📚 相关资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare 缓存清除文档](https://developers.cloudflare.com/cache/how-to/purge-cache/)
- [Cloudflare API 文档](https://developers.cloudflare.com/api/)

