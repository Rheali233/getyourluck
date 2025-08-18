# 综合测试平台项目结构文档

## 📁 项目整体架构

```
comprehensive-testing-platform/
├── backend/                     # Cloudflare Workers 后端API
├── frontend/                    # React 用户端前端
├── admin/                       # React 管理端前端 (待开发)
├── shared/                      # 共享代码和类型定义
├── docs/                        # 项目文档
├── scripts/                     # 构建和部署脚本 (待开发)
└── README.md                    # 项目说明
```

## 🔧 后端架构 (Backend)

### 核心文件结构

```
backend/
├── src/
│   ├── index.ts                 # Cloudflare Workers 主入口
│   ├── middleware/              # 中间件层
│   │   ├── errorHandler.ts      # 统一错误处理
│   │   ├── validation.ts        # 数据验证中间件
│   │   └── rateLimiter.ts       # 速率限制中间件
│   ├── routes/                  # API路由层
│   │   ├── tests/index.ts       # 测试相关路由
│   │   ├── blog/index.ts        # 博客相关路由
│   │   ├── feedback/index.ts    # 反馈相关路由
│   │   └── analytics/index.ts   # 分析统计路由
│   ├── models/                  # 数据模型层
│   │   ├── BaseModel.ts         # 基础模型类
│   │   ├── TestSessionModel.ts  # 测试会话模型
│   │   ├── TestTypeModel.ts     # 测试类型模型
│   │   ├── BlogArticleModel.ts  # 博客文章模型
│   │   ├── UserFeedbackModel.ts # 用户反馈模型
│   │   └── AnalyticsEventModel.ts # 分析事件模型
│   └── utils/                   # 工具函数层
│       ├── databaseManager.ts   # 数据库管理器
│       ├── migrations.ts        # 迁移定义
│       └── migrationRunner.ts   # 迁移执行器
├── migrations/                  # 数据库迁移文件
│   └── 001_initial_schema.sql   # 初始数据库架构
├── package.json                 # 依赖配置
├── wrangler.toml               # Cloudflare Workers 配置
├── tsconfig.json               # TypeScript 配置
└── .eslintrc.json              # ESLint 配置
```

### 技术栈

- **运行环境**: Cloudflare Workers
- **框架**: Hono.js
- **语言**: TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **存储**: Cloudflare R2

## 🎨 前端架构 (Frontend)

### 核心文件结构

```
frontend/
├── src/
│   ├── components/              # 组件库
│   │   ├── common/              # 通用组件
│   │   │   ├── Navigation/Navigation.tsx      # 导航组件
│   │   │   └── ErrorBoundary/ErrorBoundary.tsx # 错误边界组件
│   │   ├── test/                # 测试相关组件 (待开发)
│   │   └── specialized/         # 特殊组件 (待开发)
│   ├── pages/                   # 页面组件
│   │   └── HomePage/HomePage.tsx # 首页
│   ├── stores/                  # 状态管理 (Zustand)
│   │   ├── testStore.ts         # 测试状态管理
│   │   └── blogStore.ts         # 博客状态管理
│   ├── services/                # API服务层
│   │   └── apiClient.ts         # API客户端
│   ├── styles/                  # 样式文件
│   │   └── index.css            # 全局样式
│   ├── hooks/                   # 自定义Hooks (待开发)
│   ├── utils/                   # 工具函数 (待开发)
│   └── types/                   # 前端特定类型 (待开发)
├── public/                      # 静态资源 (待开发)
├── tailwind.config.js          # Tailwind CSS 配置
├── package.json                 # 依赖配置 (待创建)
├── vite.config.ts              # Vite 配置 (待创建)
└── tsconfig.json               # TypeScript 配置 (待创建)
```

### 技术栈

- **框架**: React.js 18+
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **构建工具**: Vite
- **部署**: Cloudflare Pages

## 🔗 共享代码 (Shared)

### 文件结构

```
shared/
├── types/                       # 统一类型定义
│   ├── componentInterfaces.ts   # 组件接口定义
│   ├── moduleState.ts          # 状态管理接口
│   ├── apiResponse.ts          # API响应接口
│   ├── errors.ts               # 错误处理类型
│   └── index.ts                # 统一导出
├── constants/                   # 常量定义
│   └── index.ts                # 系统常量
└── utils/                       # 共享工具函数
    └── index.ts                # 工具函数集合
```

### 核心接口规范

#### 1. 统一状态管理接口

```typescript
// ModuleState - 所有模块状态的基础接口
interface ModuleState {
  isLoading: boolean;
  error: string | null;
  data: any;
  lastUpdated: Date | null;
}

// ModuleActions - 所有模块操作的基础接口
interface ModuleActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: any) => void;
  reset: () => void;
}
```

#### 2. 统一API响应格式

```typescript
// APIResponse - 所有API响应的统一格式
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}
```

#### 3. 统一组件接口

```typescript
// BaseComponentProps - 所有组件的基础属性
interface BaseComponentProps {
  className?: string;
  testId?: string;
  "data-testid"?: string;
}
```

#### 4. 统一错误处理

```typescript
// ModuleError - 统一错误处理类
class ModuleError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = "ModuleError";
  }
}
```

## 📊 数据库架构

### 核心数据表

```sql
-- 测试类型表
test_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  config_data TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- 测试会话表
test_sessions (
  id TEXT PRIMARY KEY,
  test_type_id TEXT NOT NULL,
  answers_data TEXT NOT NULL,
  result_data TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- 博客文章表
blog_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- 用户反馈表
user_feedback (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  feedback_type TEXT NOT NULL,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

-- 分析事件表
analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🎯 模块化架构

### 测试模块

每个测试模块都遵循统一的架构模式：

```
测试模块/
├── 后端API (routes/tests/)
├── 前端组件 (components/test/)
├── 状态管理 (stores/)
├── 数据模型 (models/)
└── 类型定义 (shared/types/)
```

### 支持的测试类型

1. **心理测试模块** (psychology-module)
2. **占星分析模块** (astrology-module)
3. **塔罗占卜模块** (tarot-module)
4. **职业发展模块** (career-module)
5. **学习能力模块** (learning-ability-module)
6. **情感关系模块** (relationship-module)
7. **命理分析模块** (numerology-module)

## 🔧 开发工具配置

### TypeScript 配置

- 严格类型检查
- 路径别名配置
- Cloudflare Workers 类型支持

### ESLint 配置

- TypeScript 规则
- 代码质量检查
- 统一代码风格

### Tailwind CSS 配置

- 自定义主题色彩
- 响应式断点
- 组件样式系统

## 📈 部署架构

```
用户请求 → Cloudflare CDN → Cloudflare Pages (前端)
                           ↓
                    Cloudflare Workers (后端API)
                           ↓
                    Cloudflare D1 (数据库)
                    Cloudflare KV (缓存)
                    Cloudflare R2 (存储)
```

## 🔒 安全和合规

### 数据保护

- IP地址哈希化存储
- 敏感数据加密
- GDPR合规设计

### 访问控制

- API速率限制
- 请求验证
- 错误信息脱敏

## 📝 开发规范

### 命名规范

- **文件**: PascalCase (组件), camelCase (工具)
- **变量**: camelCase
- **常量**: UPPER_SNAKE_CASE
- **数据库表**: snake_case
- **API端点**: kebab-case

### 代码组织

- 单一职责原则
- 统一接口规范
- 模块化设计
- 类型安全

## 🚀 开发状态

### 已完成

✅ **后端基础架构**
- Cloudflare Workers 项目结构
- 统一类型定义和接口
- 错误处理中间件
- API路由基础框架
- 数据模型层
- 数据库迁移系统

✅ **前端基础组件**
- React 项目结构
- 状态管理 (Zustand)
- API客户端
- 基础组件 (Navigation, ErrorBoundary)
- 首页组件

### 进行中

🔄 **前端完整架构** (任务1.2)
🔄 **数据库初始化** (任务1.3)

### 待开发

⏳ **核心测试模块** (任务5.1-5.3)
⏳ **管理后台** (任务9.1-9.3)
⏳ **部署和优化** (任务10.1-10.3)

---

**文档版本**: v1.0  
**最后更新**: 2024年1月  
**维护者**: 综合测试平台开发团队