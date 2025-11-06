# API URL 构建指南

## 环境差异说明

### Cloudflare Pages 环境

**工作流程：**
1. 前端请求：`/api/psychology/questions`
2. Cloudflare Pages Functions (`functions/api/_middleware.js`) 拦截 `/api/*` 请求
3. 转发到后端：`https://selfatlas-backend-prod.cyberlina.workers.dev/api/psychology/questions`
4. **重要：Pages Functions 会保留 `/api` 前缀**

**配置：**
- `API_BASE_URL`: `/api` (相对路径)
- 前端只需使用相对路径 `/api/...`，Pages Functions 会自动处理代理

### 本地开发环境

**情况 1：使用 Vite 代理（推荐）**
- `API_BASE_URL`: `/api` (相对路径)
- Vite 代理配置 (`vite.config.ts`) 将 `/api/*` 转发到后端
- 前端使用相对路径，行为与 Cloudflare 一致

**情况 2：直接访问完整 URL**
- `API_BASE_URL`: `https://selfatlas-backend-staging.cyberlina.workers.dev`
- **需要手动添加 `/api` 前缀**
- 前端请求必须是：`https://selfatlas-backend-staging.cyberlina.workers.dev/api/psychology/questions`

## 统一解决方案

### 1. 使用 `buildApiUrl()` 工具函数

```typescript
import { buildApiUrl } from '@/utils/apiUrlBuilder';

// ✅ 正确：自动处理 /api 前缀
const url = buildApiUrl('/psychology/questions');
// 本地完整 URL: https://...workers.dev/api/psychology/questions
// Cloudflare/相对路径: /api/psychology/questions
```

### 2. 使用 `apiClient`（已自动处理）

```typescript
import { apiClient } from '@/services/apiClient';

// ✅ 正确：apiClient 会自动添加 /api 前缀（如果是完整 URL）
await apiClient.get('/psychology/questions');
```

### 3. 禁止直接使用 `getApiBaseUrl()`

```typescript
// ❌ 错误：可能导致路径缺少 /api 前缀
const url = `${getApiBaseUrl()}/psychology/questions`;

// ✅ 正确：使用工具函数
const url = buildApiUrl('/psychology/questions');
```

## 后端路由配置

后端所有路由都注册在 `/api/*` 下：
- `/api/psychology/questions`
- `/api/career/questions`
- `/api/homepage/modules`
- `/api/analytics/events`
- 等等...

**因此前端请求必须包含 `/api` 前缀！**

## 总结

| 环境 | API_BASE_URL | 请求路径 | 处理方式 |
|------|-------------|---------|---------|
| Cloudflare Pages | `/api` | `/api/psychology/questions` | Pages Functions 自动代理 |
| 本地（Vite 代理） | `/api` | `/api/psychology/questions` | Vite 代理自动转发 |
| 本地（完整 URL） | `https://...` | `https://.../api/psychology/questions` | `buildApiUrl()` 自动添加 `/api` |

## 已修复的文件

所有直接使用 `getApiBaseUrl()` 构建 API 路径的地方都已修复：
- ✅ `QuestionService.ts` - 使用 `buildApiUrl()` 逻辑
- ✅ `apiClient.ts` - 自动添加 `/api` 前缀
- ✅ `TestModulesGrid.tsx` - 使用 `buildApiUrl()`
- ✅ `testModuleIntegration.ts` - 使用 `buildApiUrl()`
- ✅ `useHomepageStore.ts` - 使用 `buildApiUrl()`
- ✅ `PersonalizedRecommendations.tsx` - 使用 `buildApiUrl()`
- ✅ `UserBehaviorTracker.tsx` - 使用 `buildApiUrl()`
- ✅ `CookiesBanner.tsx` - 使用 `buildApiUrl()`
- ✅ `SecureCookiesManager.tsx` - 使用 `buildApiUrl()`
- ✅ `ErrorBoundary.tsx` - 使用 `buildApiUrl()`

