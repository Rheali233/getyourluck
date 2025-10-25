# Cloudflare Pages 配置指南

## 🚨 紧急修复：图片加载问题

### 问题原因

Cloudflare Pages 的路由配置导致所有请求（包括静态图片）都被重定向到 `index.html`。

### ✅ 解决方案：在 Cloudflare Dashboard 中配置

请按以下步骤操作：

---

## 步骤1：登录 Cloudflare Dashboard

1. 访问 https://dash.cloudflare.com/
2. 登录你的账户
3. 进入 **Workers & Pages**
4. 选择项目 **getyourluck-testing-platform**

---

## 步骤2：检查构建配置

1. 点击 **Settings** 标签
2. 找到 **Build configuration** 部分
3. 确认以下配置：

```
Build command: npm run build
Build output directory: comprehensive-testing-platform/frontend/dist
Root directory: /
```

---

## 步骤3：配置重定向规则（最关键）

### 方法A：在 Dashboard 中配置（推荐）

1. 在项目设置页面，找到 **Redirects/Rewrites** 或 **Routing** 部分
2. 删除所有现有的通配符规则
3. 只添加以下规则：

```
Source: /api/*
Destination: https://selfatlas-backend-prod.cyberlina.workers.dev/api/:splat
Status: 301
```

4. **不要添加** `/* /index.html 200` 这样的规则！

###方法B：使用单页应用（SPA）模式

1. 在项目设置中，找到 **Build settings**
2. 启用 **Single Page Application (SPA)** 模式
3. 这会自动将 404 请求重定向到 `index.html`，同时保留静态文件

---

## 步骤4：清除缓存

1. 在项目设置中，找到 **Purge cache**
2. 点击 **Purge everything**
3. 等待缓存清除完成

---

## 步骤5：触发重新部署

1. 返回项目主页
2. 点击 **Create deployment**
3. 选择 `main` 分支
4. 点击 **Save and Deploy**

---

## 步骤6：验证修复

等待部署完成后：

1. 打开无痕窗口
2. 访问 https://selfatlas.net/assets/blog/psychology/mbti-compatibility/cover.png
3. **应该看到图片**（不是 HTML 页面）
4. 访问 https://selfatlas.net
5. **所有图片应该正常显示**，请求数 < 100

---

## 🔍 调试工具

如果问题仍然存在，使用以下命令检查：

```bash
# 检查图片返回的 Content-Type
curl -I https://selfatlas.net/assets/blog/psychology/mbti-compatibility/cover.png

# 应该看到：
# content-type: image/png
# 而不是：
# content-type: text/html
```

---

## 📚 参考文档

- [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/platform/redirects/)
- [Cloudflare Pages SPA Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/#deploy-with-cloudflare-pages)

---

## ⚠️ 重要提示

- **删除或禁用所有 `/* /index.html 200` 规则**
- **启用 SPA 模式** 或 **不配置任何 catch-all 规则**
- Cloudflare Pages 会自动将 404 返回给浏览器，让 React Router 处理客户端路由

