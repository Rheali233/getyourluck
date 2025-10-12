## 博客发布指南（Markdown → D1/R2，无可视化后台）

本文档给出一套稳定、可复制的上线流程：使用固定格式的 Markdown 作为内容源，通过脚本导入到 Cloudflare D1（正文与元信息）与 R2（图片），前端按统一样式渲染安全 HTML。

### 1）内容源与目录结构
- 存放路径：`content/blog/<yyyy>/<mm>/<slug>.md`
- 页面可见文本必须为英文（平台统一要求）。
- 图片：优先使用 R2 链接（或可信 CDN）；建议提供宽高或保持固定比例（封面建议 1280×720，16:9）。

#### Front Matter（YAML 类似，除标注外均建议填写）
```
---
id: intro-001                       # 可选（默认使用 slug）
slug: welcome-to-the-platform       # 必填，小写、短横线分隔、稳定不随意改
title: "Welcome to the Comprehensive Testing Platform"  # 必填
excerpt: "All-in-one platform for psychology, career and traditional modules."
category: Platform                  # 取值示例：Psychology/Career/Relationship/Learning/Astrology/Tarot/Numerology/Platform
tags: ["Platform", "Introduction", "Getting Started"]  # 必须为 JSON 风格的字符串数组
cover: https://<r2>/<path>/cover-1280x720.jpg  # 推荐
metaTitle: "Comprehensive Testing Platform – Introduction"
metaDescription: "Explore our all-in-one platform for psychology, career, astrology, tarot, numerology."
ogImage: https://<r2>/<path>/og.jpg           # 若缺省，回退到 cover
isFeatured: true                               # 可选
status: published                              # draft | published
publishedAt: 2025-09-23T10:00:00.000Z         # 可选（发布时默认 now）
updatedAt: 2025-09-23T10:00:00.000Z           # 可选（缺省则使用 now）
---
```

#### 正文（Markdown）
- 支持：段落、H1–H3、列表、链接、图片、粗体/斜体、分割线等常用语法。
- 建议：
  - 结构用 H2/H3 分层；H1 通常由页面标题承担（不必重复）。
  - 图片写 `alt`：`![alt](url)`。
  - 添加 2–3 个站内相关链接。

### 2）上线自检清单（提交前必看）
- 标题 ≤ 70 字节；描述 120–160 字符；slug 小写且稳定。
- 英文内容；不允许中文或占位文案。
- 图片尽量 ≤ 200KB；封面 1280×720；正文图均有 alt。
- 层级清晰（H2/H3），每节至少一段正文。

### 3）导入流程（本地或 CI）
脚本会读取 Front Matter，执行 Markdown → 安全 HTML 转换，并 upsert 到 D1（内部通过将 SQL 写入临时文件并使用 `--file` 执行，避免引号转义问题）。

#### 本地导入（开发环境）
```
cd comprehensive-testing-platform/backend
npx tsx scripts/import-blog-md.ts ../content/blog/2025/09/welcome-to-the-platform.md --db selfatlas-local --local
```
参数说明：
- `--db <binding>`：对应 wrangler.toml 中的 D1 绑定名
- `--local` / `--remote`：执行至本地/远端 D1
- 支持单文件或目录批量导入

#### CI 导入（预发/生产）
合入目标分支后：
1) 识别变更的 `content/blog/**/*.md`
2) 以 `--remote --db <env-binding>` 执行同一脚本
3) 成功后可触发 `/api/seo` 缓存刷新（可选），保证 sitemap-blog 及时更新

### 4）脚本行为（核心逻辑）
1) 解析 Front Matter 与 Markdown 正文
2) Markdown → 安全 HTML（白名单标签、为 H2 自动生成 id 供目录使用）
3) 字段计算：
   - `id = frontMatter.id || slug`
   - `is_published = status === 'published' ? 1 : 0`
   - `published_at = frontMatter.publishedAt || (is_published ? now : null)`
   - `ogImage = frontMatter.ogImage || cover`
4) Upsert 至 `blog_articles`，保留原有统计字段，更新 meta 与内容；`slug` 写入 `blog_articles.slug`，`cover` 写入 `blog_articles.cover_image`

### 5）前端渲染契约
- 详情 API：`/api/blog/articles/:slug`（仅 slug）返回 `content`（HTML）与 meta/slug 等字段
- 列表 API：`/api/blog/articles` 返回卡片所需字段（含 `slug` 与 `coverImage`）
- 前端在 `prose` 排版下渲染 HTML；右侧目录由 H2 的 id 生成，仅展示主标题
- 移动端目录折叠；桌面端目录 sticky（≈280px），目录卡片为半透明背景、无边框

### 6）回滚与下线
- 将 `status: draft` 并重新导入 → 设置 `is_published=0`
- 或以 SQL 手动切换指定 `id/slug` 的发布状态

### 7）常见问题定位
- 页面不可见：检查 `status=published`、`publishedAt <= now`、导入是否成功
- 布局异常：核对 Markdown 语法（空行、列表、标题层级）；确保图片 alt、尺寸合理
- SEO 不完整：补齐 `metaTitle`、`metaDescription`、`ogImage`；确认 sitemap-blog 已包含该 slug
- 详情 404：确认访问路径中的 `:slug` 与 Front Matter `slug` 一致；如需变更请重新导入或以 SQL 更新 `blog_articles.slug`
- 列表无封面：检查 Front Matter `cover` 是否填写；或以 SQL 设置 `blog_articles.cover_image`

以上为“无可视化后台”发布方式的统一规范与操作说明，是本仓库博客发布的唯一依据。


