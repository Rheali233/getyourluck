# 综合测试平台开发规范文档

## 0. 项目语言要求

**重要说明：** 本项目的所有用户界面、内容展示、API响应等均使用英文作为主要语言。

### 0.1 语言使用规范

- **用户界面**: 所有前端组件、页面标题、按钮文字、提示信息等必须使用英文
- **内容展示**: 测试题目、结果分析、推荐内容、博客文章等必须使用英文
- **API接口**: 所有API响应中的message、error等字段必须使用英文
- **数据库内容**: 存储的测试题目、结果模板、内容配置等必须使用英文
- **错误信息**: 所有错误提示、验证消息等必须使用英文
- **文档注释**: 代码注释可以使用中文，但用户可见的文本必须使用英文

### 0.2 英文唯一性说明

本项目仅支持英文作为唯一语言，不提供多语言支持：
- 所有文本内容直接使用英文
- 数据库内容仅存储英文版本
- API接口仅返回英文内容
- 前端组件仅显示英文文本

### 0.3 开发注意事项

1. **禁止硬编码中文文本**: 所有用户可见的文本必须直接使用英文或通过英文常量管理
2. **统一英文表达**: 使用标准、清晰的英文表达，避免俚语或过于复杂的词汇
3. **专业术语**: 测试相关的专业术语使用标准英文表达
4. **一致性**: 相同含义的文本在整个系统中保持一致的英文表达
5. **无需i18n**: 不需要实现国际化系统，直接使用英文文本即可

---

## 1. 项目整体架构

### 1.1 技术栈概览

- **前端**: React.js + TypeScript + Tailwind CSS + Vite
- **后端**: Cloudflare Workers + Hono.js + TypeScript
- **数据库**: Cloudflare D1 (SQLite)
- **缓存**: Cloudflare KV
- **部署**: Cloudflare Pages + Workers

### 1.2 项目目录结构

```
comprehensive-testing-platform/
├── frontend/                    # 用户端前端项目
│   ├── src/
│   │   ├── components/         # 组件目录
│   │   │   ├── common/        # 通用组件
│   │   │   │   ├── Navigation/
│   │   │   │   ├── PageHeader/
│   │   │   │   ├── LoadingSpinner/
│   │   │   │   └── ActionButtons/
│   │   │   ├── test/          # 测试相关组件
│   │   │   │   ├── QuestionCard/
│   │   │   │   ├── ProgressBar/
│   │   │   │   ├── ResultDisplay/
│   │   │   │   └── FeedbackButtons/
│   │   │   └── specialized/   # 特殊组件
│   │   │       ├── TarotCards/
│   │   │       ├── ConstellationPicker/
│   │   │       └── ChartDisplay/
│   │   ├── pages/             # 页面组件
│   │   │   ├── HomePage/
│   │   │   ├── TestPages/
│   │   │   ├── ResultPages/
│   │   │   └── BlogPage/
│   │   ├── hooks/             # 自定义Hooks
│   │   ├── utils/             # 工具函数
│   │   ├── services/          # API服务
│   │   ├── stores/            # 状态管理
│   │   ├── styles/            # 样式文件
│   │   └── types/             # TypeScript类型定义
│   ├── public/                # 静态资源
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                     # 后端API项目
│   ├── src/
│   │   ├── routes/            # 路由定义
│   │   │   ├── tests/         # 测试相关路由
│   │   │   ├── blog/          # 博客相关路由
│   │   │   ├── feedback/      # 反馈相关路由
│   │   │   └── analytics/     # 统计相关路由
│   │   ├── services/          # 业务逻辑服务
│   │   │   ├── testEngine/    # 测试引擎
│   │   │   ├── astrology/     # 占星服务
│   │   │   ├── psychology/    # 心理测试服务
│   │   │   └── content/       # 内容管理服务
│   │   ├── models/            # 数据模型
│   │   ├── utils/             # 工具函数
│   │   ├── middleware/        # 中间件
│   │   ├── types/             # TypeScript类型
│   │   └── index.ts           # 入口文件
│   ├── migrations/            # 数据库迁移文件
│   ├── seeds/                 # 种子数据
│   ├── package.json
│   ├── wrangler.toml
│   └── tsconfig.json
├── admin/                       # 管理端前端项目
│   ├── src/
│   │   ├── components/        # 管理组件
│   │   ├── pages/             # 管理页面
│   │   ├── services/          # API服务
│   │   └── utils/             # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── shared/                      # 共享代码
│   ├── types/                 # 共享类型定义
│   ├── constants/             # 常量定义
│   └── utils/                 # 共享工具函数
├── docs/                        # 项目文档
├── scripts/                     # 构建和部署脚本
└── README.md
```

### 1.3 文件命名规范

```typescript
// 组件文件：PascalCase
Navigation.tsx;
PageHeader.tsx;
QuestionCard.tsx;

// 工具文件：camelCase
apiClient.ts;
formatUtils.ts;
testCalculator.ts;

// 常量文件：UPPER_SNAKE_CASE
TEST_TYPES.ts;
API_ENDPOINTS.ts;

// 页面文件：PascalCase + Page后缀
HomePage.tsx;
MBTITestPage.tsx;
ResultPage.tsx;

// Hook文件：camelCase + use前缀
useTestStore.ts;
useAsyncError.ts;
useLocalStorage.ts;
```

## 2. 统一组件架构规范

### 2.1 统一组件接口定义

```typescript
// shared/types/componentInterfaces.ts
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface LoadingProps extends BaseComponentProps {
  isLoading: boolean;
  size?: "small" | "medium" | "large";
  text?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

### 2.2 标准组件结构模板

```typescript
// components/common/PageHeader/PageHeader.tsx
import React from "react";
import { PageHeaderProps } from "./types";
import { cn } from "../../../utils/classNames";

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  theme = "primary",
  onStart,
  className,
  testId,
  ...props
}) => {
  return (
    <div
      className={cn(
        "page-header",
        `page-header--${theme}`,
        "flex flex-col items-center text-center p-8 rounded-lg",
        className,
      )}
      data-testid={testId || "page-header"}
      {...props}
    >
      <div className="page-header__icon mb-4">
        <i className={`fas fa-${icon} text-4xl text-primary-600`} />
      </div>
      <h1 className="page-header__title text-3xl font-bold mb-2 text-gray-900">
        {title}
      </h1>
      <p className="page-header__description text-lg text-gray-600 mb-6 max-w-2xl">
        {description}
      </p>
      {onStart && (
        <button
          className="page-header__start-btn btn btn--primary btn--large"
          onClick={onStart}
          data-testid="start-test-button"
        >
          开始测试
        </button>
      )}
    </div>
  );
};
```

### 2.3 统一Props类型定义

```typescript
// components/common/PageHeader/types.ts
import { BaseComponentProps } from "../../../shared/types/componentInterfaces";

export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  description: string;
  icon: string;
  theme?:
    | "primary"
    | "constellation"
    | "mbti"
    | "tarot"
    | "psychology"
    | "career";
  onStart?: () => void;
}
```

### 2.4 统一组件导出规范

```typescript
// components/common/PageHeader/index.ts
export { PageHeader } from "./PageHeader";
export type { PageHeaderProps } from "./types";

// components/common/index.ts - 统一导出
export { PageHeader } from "./PageHeader";
export { LoadingSpinner } from "./LoadingSpinner";
export { Button } from "./Button";
export { Card } from "./Card";
export { ErrorBoundary } from "./ErrorBoundary";

export type {
  ButtonProps,
  CardProps,
  LoadingSpinnerProps,
  PageHeaderProps,
} from "./types";
```

### 2.5 统一样式类名规范

```typescript
// utils/classNames.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 统一的CSS类名前缀规范
export const CSS_PREFIXES = {
  COMPONENT: "c-", // c-button, c-card
  LAYOUT: "l-", // l-header, l-sidebar
  UTILITY: "u-", // u-text-center, u-margin-top
  STATE: "is-", // is-active, is-loading
  THEME: "t-", // t-dark, t-light
  MODULE: "m-", // m-test, m-blog
} as const;
```

## 3. 统一状态管理规范

### 3.1 统一状态接口定义

```typescript
// shared/types/moduleState.ts
export interface ModuleState {
  isLoading: boolean;
  error: string | null;
  data: any;
  lastUpdated: Date | null;
}

export interface ModuleActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: any) => void;
  reset: () => void;
}

// 测试模块专用状态扩展
export interface TestModuleState extends ModuleState {
  currentTest: string | null;
  currentQuestion: number;
  answers: any[];
  result: any | null;
  progress: number;
}

export interface TestModuleActions extends ModuleActions {
  startTest: (testType: string) => void;
  submitAnswer: (answer: any) => void;
  nextQuestion: () => void;
  calculateResult: () => Promise<void>;
  resetTest: () => void;
}
```

### 3.2 Zustand Store标准实现

```typescript
// stores/testStore.ts
import { create } from "zustand";
import {
  TestModuleActions,
  TestModuleState,
} from "../shared/types/moduleState";

export const useTestStore = create<TestModuleState & TestModuleActions>((
  set,
  get,
) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,

  // 测试专用状态
  currentTest: null,
  currentQuestion: 0,
  answers: [],
  result: null,
  progress: 0,

  // 基础操作
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setData: (data) => set({ data, lastUpdated: new Date() }),

  // 测试专用操作
  startTest: (testType) => {
    set({
      currentTest: testType,
      currentQuestion: 0,
      answers: [],
      result: null,
      progress: 0,
      isLoading: false,
      error: null,
    });
  },

  submitAnswer: (answer) => {
    const { answers, currentQuestion } = get();
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;

    set({
      answers: newAnswers,
      progress: ((currentQuestion + 1) / 20) * 100, // 假设20题
    });
  },

  nextQuestion: () => {
    const { currentQuestion } = get();
    set({ currentQuestion: currentQuestion + 1 });
  },

  calculateResult: async () => {
    set({ isLoading: true, error: null });
    try {
      const { currentTest, answers } = get();
      const result = await calculateTestResult(currentTest, answers);
      set({
        result,
        isLoading: false,
        data: result,
        lastUpdated: new Date(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "计算结果失败",
      });
    }
  },

  reset: () => {
    set({
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      currentTest: null,
      currentQuestion: 0,
      answers: [],
      result: null,
      progress: 0,
    });
  },

  resetTest: () => {
    const { reset } = get();
    reset();
  },
}));
```

## 4. 统一API接口规范

### 4.1 统一API响应格式

```typescript
// shared/types/apiResponse.ts
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TestResult {
  sessionId: string;
  testType: string;
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  completedAt: string;
}

export interface TestSubmission {
  testType: string;
  answers: any[];
  userInfo?: {
    userAgent?: string;
    timestamp?: string;
  };
}
```

### 4.2 统一API客户端

```typescript
// services/apiClient.ts
import { APIResponse, PaginatedResponse } from "../shared/types/apiResponse";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = crypto.randomUUID();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`,
        );
      }

      return result;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient("/api");
```

### 4.3 统一API服务封装

```typescript
// services/testService.ts
import { apiClient } from "./apiClient";
import {
  APIResponse,
  TestResult,
  TestSubmission,
} from "../shared/types/apiResponse";

export const testService = {
  async getTestTypes(): Promise<APIResponse<any[]>> {
    return apiClient.get("/tests");
  },

  async getTestQuestions(testType: string): Promise<APIResponse<any[]>> {
    return apiClient.get(`/tests/${testType}/questions`);
  },

  async submitTest(
    submission: TestSubmission,
  ): Promise<APIResponse<TestResult>> {
    return apiClient.post("/tests/submit", submission);
  },

  async getTestResult(sessionId: string): Promise<APIResponse<TestResult>> {
    return apiClient.get(`/tests/results/${sessionId}`);
  },

  async submitFeedback(
    sessionId: string,
    feedback: "like" | "dislike",
  ): Promise<APIResponse<void>> {
    return apiClient.post("/feedback", { sessionId, feedback });
  },
};

// services/blogService.ts
export const blogService = {
  async getArticles(page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    return apiClient.get(`/blog/articles?page=${page}&limit=${limit}`);
  },

  async getArticle(id: string): Promise<APIResponse<any>> {
    return apiClient.get(`/blog/articles/${id}`);
  },

  async incrementViewCount(id: string): Promise<APIResponse<void>> {
    return apiClient.post(`/blog/articles/${id}/view`, {});
  },
};
```

## 5. 统一错误处理规范

### 5.1 统一错误类型定义

```typescript
// shared/types/errors.ts
export class ModuleError extends Error {
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

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TEST_NOT_FOUND: "TEST_NOT_FOUND",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  RATE_LIMITED: "RATE_LIMITED",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
```

### 5.2 统一错误处理中间件

```typescript
// utils/errorHandler.ts
import { ERROR_CODES, ModuleError } from "../shared/types/errors";

export const errorHandler = {
  handleApiError: (error: any): ModuleError => {
    if (error instanceof ModuleError) {
      return error;
    }

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return new ModuleError(
        "网络连接失败，请检查网络设置",
        ERROR_CODES.NETWORK_ERROR,
        0,
      );
    }

    return new ModuleError(
      error.message || "未知错误",
      "UNKNOWN_ERROR",
      500,
      error,
    );
  },

  formatErrorMessage: (error: ModuleError): string => {
    const errorMessages = {
      [ERROR_CODES.VALIDATION_ERROR]: "输入数据验证失败",
      [ERROR_CODES.NETWORK_ERROR]: "网络连接失败",
      [ERROR_CODES.TEST_NOT_FOUND]: "测试类型不存在",
      [ERROR_CODES.CALCULATION_ERROR]: "结果计算失败",
      [ERROR_CODES.DATABASE_ERROR]: "数据库操作失败",
      [ERROR_CODES.UNAUTHORIZED]: "访问权限不足",
      [ERROR_CODES.RATE_LIMITED]: "请求过于频繁，请稍后再试",
    };

    return errorMessages[error.code as ErrorCode] || error.message;
  },
};
```

### 5.3 错误边界组件

```typescript
// components/common/ErrorBoundary/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>出现了一些问题</h2>
          <p>请刷新页面重试</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 5.2 异步错误处理Hook

```typescript
// hooks/useAsyncError.ts
import { useCallback } from "react";

export const useAsyncError = () => {
  const throwError = useCallback((error: Error) => {
    throw error;
  }, []);

  return throwError;
};
```

## 6. 性能优化规范

### 6.1 组件懒加载

```typescript
// 页面组件懒加载
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

const MBTITest = lazy(() => import("../pages/MBTITest"));
const TarotTest = lazy(() => import("../pages/TarotTest"));

// 使用
<Suspense fallback={<LoadingSpinner />}>
  <MBTITest />
</Suspense>;
```

### 6.2 图片优化

```typescript
// components/common/OptimizedImage/OptimizedImage.tsx
import React, { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  loading = "lazy",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-container ${className}`}>
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </div>
  );
};
```

## 7. 测试规范

### 7.1 组件测试

```typescript
// components/common/PageHeader/PageHeader.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  const defaultProps = {
    title: "测试标题",
    description: "测试描述",
    icon: "brain",
  };

  it("renders title and description", () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByText("测试标题")).toBeInTheDocument();
    expect(screen.getByText("测试描述")).toBeInTheDocument();
  });

  it("calls onStart when button is clicked", () => {
    const onStart = jest.fn();
    render(<PageHeader {...defaultProps} onStart={onStart} />);

    fireEvent.click(screen.getByText("开始测试"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
```

## 8. 代码质量规范

### 8.1 ESLint配置

```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-console": "warn"
  }
}
```

### 8.2 Prettier配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 9. 后端开发规范

### 9.1 Cloudflare Workers项目结构

```typescript
// backend/src/index.ts - 主入口文件
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { testRoutes } from "./routes/tests";
import { blogRoutes } from "./routes/blog";
import { feedbackRoutes } from "./routes/feedback";
import { analyticsRoutes } from "./routes/analytics";

const app = new Hono<{
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
    ENVIRONMENT: string;
  };
}>();

// 中间件
app.use("*", cors());
app.use("*", logger());

// 路由
app.route("/api/tests", testRoutes);
app.route("/api/blog", blogRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/analytics", analyticsRoutes);

// 健康检查
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
```

### 9.2 路由定义规范

```typescript
// backend/src/routes/tests/index.ts
import { Hono } from "hono";
import { testService } from "../../services/testEngine";
import { validateTestSubmission } from "../../middleware/validation";

const testRoutes = new Hono<{
  Bindings: {
    DB: D1Database;
    KV: KVNamespace;
  };
}>();

// 获取测试类型列表
testRoutes.get("/", async (c) => {
  try {
    const tests = await testService.getAllTestTypes(c.env.DB);
    return c.json({ success: true, data: tests });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 获取特定测试的题目
testRoutes.get("/:testType/questions", async (c) => {
  const testType = c.req.param("testType");

  try {
    const questions = await testService.getTestQuestions(c.env.DB, testType);
    return c.json({ success: true, data: questions });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 提交测试答案
testRoutes.post("/submit", validateTestSubmission, async (c) => {
  const submission = await c.req.json();

  try {
    const result = await testService.processTestSubmission(
      c.env.DB,
      c.env.KV,
      submission,
    );
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { testRoutes };
```

### 9.3 服务层设计

```typescript
// backend/src/services/testEngine/TestEngine.ts
export class TestEngine {
  constructor(
    private db: D1Database,
    private kv: KVNamespace,
  ) {}

  async processTestSubmission(submission: TestSubmission): Promise<TestResult> {
    // 1. 验证提交数据
    this.validateSubmission(submission);

    // 2. 获取测试配置
    const testConfig = await this.getTestConfig(submission.testType);

    // 3. 计算结果
    const scores = this.calculateScores(testConfig, submission.answers);

    // 4. 生成结果报告
    const result = await this.generateResult(submission.testType, scores);

    // 5. 保存测试会话
    const sessionId = await this.saveTestSession(submission, result);

    // 6. 缓存结果
    await this.cacheResult(sessionId, result);

    return { sessionId, ...result };
  }

  private validateSubmission(submission: TestSubmission): void {
    if (!submission.testType || !submission.answers) {
      throw new Error("Invalid submission data");
    }
  }

  private async getTestConfig(testType: string): Promise<TestConfig> {
    const cacheKey = `test_config:${testType}`;

    // 先从KV缓存获取
    const cached = await this.kv.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 从数据库获取
    const result = await this.db
      .prepare("SELECT * FROM test_types WHERE id = ?")
      .bind(testType)
      .first();

    if (!result) {
      throw new Error(`Test type ${testType} not found`);
    }

    const config = JSON.parse(result.config as string);

    // 缓存到KV
    await this.kv.put(cacheKey, JSON.stringify(config), {
      expirationTtl: 3600, // 1小时
    });

    return config;
  }

  private calculateScores(config: TestConfig, answers: Answer[]): Scores {
    switch (config.scoringType) {
      case "mbti":
        return this.calculateMBTIScores(config, answers);
      case "weighted_sum":
        return this.calculateWeightedSum(config, answers);
      case "category_based":
        return this.calculateCategoryScores(config, answers);
      default:
        throw new Error(`Unknown scoring type: ${config.scoringType}`);
    }
  }

  private async generateResult(
    testType: string,
    scores: Scores,
  ): Promise<TestResult> {
    const generator = this.getResultGenerator(testType);
    return await generator.generate(scores);
  }

  private async saveTestSession(
    submission: TestSubmission,
    result: TestResult,
  ): Promise<string> {
    const sessionId = crypto.randomUUID();

    await this.db
      .prepare(`
        INSERT INTO test_sessions (id, test_type_id, answers, result, created_at)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        sessionId,
        submission.testType,
        JSON.stringify(submission.answers),
        JSON.stringify(result),
        new Date().toISOString(),
      )
      .run();

    return sessionId;
  }
}
```

### 9.4 数据库操作规范

```typescript
// backend/src/models/TestSession.ts
export class TestSessionModel {
  constructor(private db: D1Database) {}

  async create(session: CreateTestSessionData): Promise<string> {
    const id = crypto.randomUUID();

    const result = await this.db
      .prepare(`
        INSERT INTO test_sessions (
          id, test_type_id, answers, result, 
          user_agent, ip_address, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        session.testTypeId,
        JSON.stringify(session.answers),
        JSON.stringify(session.result),
        session.userAgent,
        session.ipAddress,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw new Error("Failed to create test session");
    }

    return id;
  }

  async findById(id: string): Promise<TestSession | null> {
    const result = await this.db
      .prepare("SELECT * FROM test_sessions WHERE id = ?")
      .bind(id)
      .first();

    if (!result) {
      return null;
    }

    return {
      id: result.id as string,
      testTypeId: result.test_type_id as string,
      answers: JSON.parse(result.answers as string),
      result: JSON.parse(result.result as string),
      userAgent: result.user_agent as string,
      ipAddress: result.ip_address as string,
      createdAt: new Date(result.created_at as string),
    };
  }

  async getStatsByTestType(testTypeId: string): Promise<TestStats> {
    const result = await this.db
      .prepare(`
        SELECT 
          COUNT(*) as total_sessions,
          AVG(json_extract(result, '$.overallScore')) as avg_score
        FROM test_sessions 
        WHERE test_type_id = ?
      `)
      .bind(testTypeId)
      .first();

    return {
      totalSessions: result?.total_sessions as number || 0,
      averageScore: result?.avg_score as number || 0,
    };
  }
}
```

### 9.5 中间件规范

```typescript
// backend/src/middleware/validation.ts
import { Context, Next } from "hono";
import { z } from "zod";

const testSubmissionSchema = z.object({
  testType: z.string().min(1),
  answers: z.array(z.any()).min(1),
  userInfo: z.object({
    userAgent: z.string().optional(),
    timestamp: z.string().optional(),
  }).optional(),
});

export const validateTestSubmission = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    testSubmissionSchema.parse(body);
    await next();
  } catch (error) {
    return c.json({
      success: false,
      error: "Invalid request data",
      details: error.errors,
    }, 400);
  }
};

// 速率限制中间件
export const rateLimiter = (requests: number, windowMs: number) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const key = `rate_limit:${ip}`;

    const current = await c.env.KV.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= requests) {
      return c.json({
        success: false,
        error: "Too many requests",
      }, 429);
    }

    await c.env.KV.put(key, (count + 1).toString(), {
      expirationTtl: Math.floor(windowMs / 1000),
    });

    await next();
  };
};
```

### 9.6 错误处理规范

```typescript
// backend/src/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = async (error: Error, c: Context) => {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return c.json({
      success: false,
      error: error.message,
      code: error.code,
    }, error.statusCode);
  }

  // 数据库错误
  if (error.message.includes("D1_ERROR")) {
    return c.json({
      success: false,
      error: "Database error occurred",
    }, 500);
  }

  // 默认错误
  return c.json({
    success: false,
    error: "Internal server error",
  }, 500);
};
```

## 10. 统一数据库设计规范

### 10.1 统一表命名规范

```sql
-- 表命名规范：模块前缀 + 实体名称（复数形式）
-- 测试模块：test_*
-- 博客模块：blog_*
-- 用户模块：user_*
-- 系统模块：sys_*

-- 字段命名规范：
-- 主键：id (TEXT PRIMARY KEY)
-- 外键：{table_name}_id
-- 时间字段：created_at, updated_at, deleted_at
-- 状态字段：is_active, is_published, is_deleted
-- JSON字段：{field_name}_data 或 {field_name}_config
```

### 10.2 统一数据库迁移

```sql
-- migrations/001_initial_schema.sql
-- 测试类型表
CREATE TABLE IF NOT EXISTS test_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  config_data TEXT NOT NULL, -- JSON配置
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 测试会话表
CREATE TABLE IF NOT EXISTS test_sessions (
  id TEXT PRIMARY KEY,
  test_type_id TEXT NOT NULL,
  answers_data TEXT NOT NULL, -- JSON数组
  result_data TEXT NOT NULL, -- JSON对象
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 测试用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_type_id) REFERENCES test_types(id)
);

-- 用户反馈表
CREATE TABLE IF NOT EXISTS user_feedback (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  feedback_type TEXT NOT NULL, -- 'like', 'dislike', 'comment'
  content TEXT,
  rating INTEGER, -- 1-5星评分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id)
);

-- 博客文章表
CREATE TABLE IF NOT EXISTS blog_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags_data TEXT, -- JSON数组
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分析事件表
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON对象
  session_id TEXT,
  ip_address_hash TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id)
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS sys_configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 0, -- 是否可公开访问
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 统一索引规范
CREATE INDEX idx_test_sessions_type_date ON test_sessions(test_type_id, created_at);
CREATE INDEX idx_test_sessions_created ON test_sessions(created_at DESC);
CREATE INDEX idx_blog_articles_published ON blog_articles(is_published, published_at DESC);
CREATE INDEX idx_blog_articles_category ON blog_articles(category, is_published);
CREATE INDEX idx_user_feedback_session ON user_feedback(session_id);
CREATE INDEX idx_analytics_events_type_time ON analytics_events(event_type, timestamp);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```

### 10.2 种子数据

```typescript
// seeds/testTypes.ts
export const testTypesSeeds = [
  {
    id: "mbti",
    name: "MBTI性格测试",
    category: "psychology",
    description: "16种人格类型测试",
    config: JSON.stringify({
      questionCount: 20,
      scoringType: "mbti",
      dimensions: ["E/I", "S/N", "T/F", "J/P"],
      timeLimit: null,
    }),
  },
  {
    id: "constellation-fortune",
    name: "星座运势",
    category: "astrology",
    description: "每日星座运势查询",
    config: JSON.stringify({
      questionCount: 0,
      scoringType: "constellation",
      requiresBirthInfo: false,
      timeframes: ["daily", "weekly", "monthly"],
    }),
  },
  // ... 更多测试类型
];
```

## 11. 部署和环境配置

### 11.1 Cloudflare配置

```toml
# backend/wrangler.toml
name = "testing-platform-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.development]
vars = { ENVIRONMENT = "development" }

[env.production]
vars = { ENVIRONMENT = "production" }

[[env.production.d1_databases]]
binding = "DB"
database_name = "testing-platform-prod"
database_id = "your-database-id"

[[env.production.kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"

[[env.development.d1_databases]]
binding = "DB"
database_name = "testing-platform-dev"
database_id = "your-dev-database-id"

[[env.development.kv_namespaces]]
binding = "KV"
id = "your-dev-kv-namespace-id"
```

### 11.2 环境变量管理

```typescript
// shared/types/environment.ts
export interface Environment {
  ENVIRONMENT: "development" | "production";
  DB: D1Database;
  KV: KVNamespace;
  API_BASE_URL?: string;
}

// backend/src/utils/config.ts
export const getConfig = (env: Environment) => ({
  isDevelopment: env.ENVIRONMENT === "development",
  isProduction: env.ENVIRONMENT === "production",
  database: env.DB,
  cache: env.KV,
  corsOrigins: env.ENVIRONMENT === "production"
    ? ["https://yourdomain.com"]
    : ["http://localhost:3000"],
});
```

## 12. 开发工作流程

### 12.1 Git工作流

```bash
# 功能开发流程
git checkout -b feature/mbti-test
# 开发功能...
git add .
git commit -m "feat: implement MBTI test functionality"
git push origin feature/mbti-test
# 创建Pull Request

# 提交信息规范
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### 12.2 开发环境启动

```bash
# 前端开发
cd frontend
npm install
npm run dev

# 后端开发
cd backend
npm install
npx wrangler dev

# 管理端开发
cd admin
npm install
npm run dev
```

### 12.3 部署流程

```bash
# 前端部署（自动）
git push origin main  # 推送到main分支自动部署到Cloudflare Pages

# 后端部署
cd backend
npm run deploy:production

# 数据库迁移
npx wrangler d1 migrations apply --remote
```

## 13. 权限控制实现规范

### 13.1 API路由权限设计

```typescript
// backend/src/middleware/auth.ts
import { Context, Next } from "hono";

// 权限验证中间件
export const adminAuth = async (c: Context, next: Next) => {
  const path = c.req.path;

  // 检查是否为管理端API
  if (!path.startsWith("/api/admin/")) {
    await next();
    return;
  }

  // 验证Cloudflare Access头部
  const cfAccessEmail = c.req.header("CF-Access-Authenticated-User-Email");

  if (!cfAccessEmail) {
    return c.json({
      success: false,
      error: "Unauthorized: Admin access required",
    }, 401);
  }

  // 将管理员信息添加到上下文
  c.set("adminEmail", cfAccessEmail);
  await next();
};

// 记录管理员操作
export const logAdminAction = (action: string, resourceType: string) => {
  return async (c: Context, next: Next) => {
    await next();

    // 记录操作日志
    const adminEmail = c.get("adminEmail");
    if (adminEmail && c.res.status < 400) {
      await logOperation(c.env.DB, {
        adminEmail,
        action,
        resourceType,
        resourceId: c.req.param("id"),
        ipAddress: c.req.header("CF-Connecting-IP"),
        description: `${action} ${resourceType}`,
      });
    }
  };
};
```

### 13.2 管理端路由实现

```typescript
// backend/src/routes/admin/index.ts
import { Hono } from "hono";
import { adminAuth, logAdminAction } from "../../middleware/auth";

const adminRoutes = new Hono();

// 应用权限中间件
adminRoutes.use("*", adminAuth);

// 博客管理
adminRoutes.get("/blog/articles", async (c) => {
  // 获取所有博客文章（包括未发布的）
});

adminRoutes.post(
  "/blog/articles",
  logAdminAction("create", "blog_article"),
  async (c) => {
    // 创建博客文章
  },
);

adminRoutes.put(
  "/blog/articles/:id",
  logAdminAction("update", "blog_article"),
  async (c) => {
    // 更新博客文章
  },
);

// 数据统计
adminRoutes.get("/analytics/summary", async (c) => {
  // 获取数据统计摘要
});

adminRoutes.get("/analytics/events", async (c) => {
  // 获取详细事件数据
});

// 用户反馈管理
adminRoutes.get("/feedback", async (c) => {
  // 获取用户反馈列表
});

export { adminRoutes };
```

### 13.3 数据收集服务实现

```typescript
// backend/src/services/analytics/AnalyticsService.ts
export class AnalyticsService {
  constructor(
    private db: D1Database,
    private kv: KVNamespace,
  ) {}

  // 收集事件数据
  async trackEvent(
    eventType: string,
    eventData: any,
    sessionId: string,
    request: Request,
  ) {
    const event = {
      id: crypto.randomUUID(),
      eventType,
      eventData: JSON.stringify(eventData),
      sessionId,
      ipAddress: this.hashIP(request.headers.get("CF-Connecting-IP")),
      userAgent: request.headers.get("User-Agent"),
      timestamp: new Date().toISOString(),
    };

    // 缓冲到KV，避免频繁写入数据库
    const bufferKey = `analytics_buffer:${Date.now()}`;
    await this.kv.put(bufferKey, JSON.stringify(event), {
      expirationTtl: 3600, // 1小时过期
    });
  }

  // 批量处理缓冲的事件
  async flushEvents() {
    const keys = await this.kv.list({ prefix: "analytics_buffer:" });
    const events = [];

    for (const key of keys.keys) {
      const eventData = await this.kv.get(key.name);
      if (eventData) {
        events.push(JSON.parse(eventData));
        await this.kv.delete(key.name);
      }
    }

    if (events.length > 0) {
      await this.batchInsertEvents(events);
    }
  }

  // 批量插入事件到数据库
  private async batchInsertEvents(events: any[]) {
    const stmt = this.db.prepare(`
      INSERT INTO analytics_events 
      (id, event_type, event_data, session_id, ip_address, user_agent, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const batch = events.map((event) =>
      stmt.bind(
        event.id,
        event.eventType,
        event.eventData,
        event.sessionId,
        event.ipAddress,
        event.userAgent,
        event.timestamp,
      )
    );

    await this.db.batch(batch);
  }

  // IP地址哈希处理
  private hashIP(ip: string | null): string {
    if (!ip) return "unknown";
    // 简单哈希，保护隐私的同时支持地理位置分析
    return btoa(ip).substring(0, 8);
  }
}
```

### 13.4 前端权限处理

```typescript
// frontend/src/utils/auth.ts
export const isAdminEnvironment = (): boolean => {
  // 检查是否在管理端域名
  return window.location.hostname.startsWith("admin.");
};

// frontend/src/services/adminApi.ts
class AdminApiClient {
  private baseURL = "/api/admin";

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // 重定向到Cloudflare Access登录
      window.location.reload();
      throw new Error("Authentication required");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const adminApi = new AdminApiClient();
```

### 13.5 Cloudflare Access配置示例

```yaml
# cloudflare-access-config.yaml
applications:
  - name: "测试平台管理后台"
    domain: "admin.yourdomain.com"
    type: "self_hosted"

policies:
  - name: "管理员访问策略"
    decision: "allow"
    rules:
      - email: ["admin@yourdomain.com", "manager@yourdomain.com"]

identity_providers:
  - name: "Google OAuth"
    type: "google"

session_duration: "24h"
```

## 14. 英文内容管理规范

### 14.1 英文内容组织

```typescript
// 英文内容常量管理
// shared/constants/content.ts
export const TEST_CONTENT = {
  mbti: {
    title: "MBTI Personality Test",
    description: "Discover your 16 personality types",
    questions: [
      "I prefer to spend time with others rather than alone",
      "I focus more on facts than possibilities",
      // ... more questions
    ]
  },
  astrology: {
    title: "Astrology Analysis",
    description: "Personal horoscope based on birth information",
    // ... more content
  }
} as const;

// 英文错误信息管理
export const ERROR_MESSAGES = {
  validation: {
    required: "This field is required",
    invalid: "Invalid input format",
    network: "Network connection failed"
  },
  test: {
    notFound: "Test type not found",
    calculationFailed: "Result calculation failed"
  }
} as const;
```

### 14.2 英文内容验证

```typescript
// 英文内容验证工具
export const validateEnglishContent = (content: string): boolean => {
  // 检查是否包含中文字符
  const chineseRegex = /[\u4e00-\u9fff]/;
  if (chineseRegex.test(content)) {
    throw new Error("Content must be in English only");
  }
  
  // 检查英文语法和拼写（可选）
  // 可以使用第三方库进行英文语法检查
  
  return true;
};

// 批量验证英文内容
export const validateAllEnglishContent = (contentObject: Record<string, any>): void => {
  const validateRecursively = (obj: any, path: string = "") => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === "string") {
        try {
          validateEnglishContent(value);
        } catch (error) {
          throw new Error(`English content validation failed at ${currentPath}: ${error.message}`);
        }
      } else if (typeof value === "object" && value !== null) {
        validateRecursively(value, currentPath);
      }
    }
  };
  
  validateRecursively(contentObject);
};
```

### 14.3 英文内容最佳实践

#### 内容编写原则

1. **简洁明了**: 使用简洁、清晰的英文表达
2. **专业准确**: 测试相关术语使用标准英文表达
3. **用户友好**: 使用友好、鼓励性的语言
4. **一致性**: 相同含义的文本保持一致的英文表达
5. **可读性**: 确保英文文本易于理解和阅读

#### 命名规范

```typescript
// 英文内容键值命名规范
const contentKeys = {
  // 页面级别：page.section.item
  "home.hero.title": "Homepage Hero Title",
  "test.mbti.question1": "MBTI Test Question 1",

  // 组件级别：component.element
  "button.submit": "Submit Button",
  "modal.confirm": "Confirmation Modal",

  // 错误信息：error.type.detail
  "error.validation.required": "Required Field Error",
  "error.network.timeout": "Network Timeout Error",
};
```

#### 性能优化

- **内容缓存**: 缓存英文内容避免重复加载
- **按需加载**: 按需加载不同模块的英文内容
- **CDN分发**: 英文内容资源CDN加速
- **预渲染**: SEO友好的英文页面预渲染

这个完善的开发规范文档涵盖了前端、后端、数据库、权限控制、数据收集、英文内容管理等各个方面的开发标准，为团队协作提供了统一的规范基础。

## 15.

统一样式设计规范

### 15.1 Tailwind CSS配置标准

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调系统
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // 模块专用色彩
        constellation: {
          50: "#fdf4ff",
          100: "#fae8ff",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7c3aed",
        },
        psychology: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        tarot: {
          50: "#fefce8",
          100: "#fef3c7",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
        },
        // 语义化颜色
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
```

### 15.2 统一组件样式类

```css
/* styles/components.css */
/* 按钮组件样式 */
.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border
    border-transparent text-sm font-medium rounded-md shadow-sm
    transition-colors duration-200 focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn--primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}

.btn--secondary {
  @apply text-primary-700 bg-primary-100 hover:bg-primary-200
    focus:ring-primary-500;
}

.btn--outline {
  @apply text-primary-600 bg-transparent border-primary-600 hover:bg-primary-50
    focus:ring-primary-500;
}

.btn--ghost {
  @apply text-gray-600 bg-transparent hover:bg-gray-100 focus:ring-gray-500;
}

.btn--small {
  @apply px-3 py-1.5 text-xs;
}

.btn--medium {
  @apply px-4 py-2 text-sm;
}

.btn--large {
  @apply px-6 py-3 text-base;
}

/* 卡片组件样式 */
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden;
}

.card--elevated {
  @apply shadow-md hover:shadow-lg transition-shadow duration-200;
}

.card--interactive {
  @apply cursor-pointer hover:shadow-md transition-shadow duration-200;
}

.card__header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card__body {
  @apply px-6 py-4;
}

.card__footer {
  @apply px-6 py-4 bg-gray-50 border-t border-gray-200;
}

/* 表单组件样式 */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
    placeholder-gray-400 focus:outline-none focus:ring-primary-500
    focus:border-primary-500;
}

.form-error {
  @apply mt-1 text-sm text-red-600;
}

/* 加载状态样式 */
.loading-spinner {
  @apply inline-block animate-spin rounded-full border-2 border-solid
    border-current border-r-transparent;
}

.loading-spinner--small {
  @apply w-4 h-4;
}

.loading-spinner--medium {
  @apply w-6 h-6;
}

.loading-spinner--large {
  @apply w-8 h-8;
}

/* 模块主题样式 */
.theme-constellation {
  @apply bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200;
}

.theme-psychology {
  @apply bg-gradient-to-br from-green-50 to-emerald-50 border-green-200;
}

.theme-tarot {
  @apply bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200;
}

.theme-mbti {
  @apply bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200;
}

.theme-career {
  @apply bg-gradient-to-br from-orange-50 to-red-50 border-orange-200;
}

/* 响应式工具类 */
.container-responsive {
  @apply container mx-auto px-4 sm:px-6 lg:px-8;
}

.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* 动画工具类 */
.animate-fade-in {
  @apply animate-fade-in;
}

.animate-slide-up {
  @apply animate-slide-up;
}

/* 状态指示器 */
.status-indicator {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
    font-medium;
}

.status-indicator--success {
  @apply bg-green-100 text-green-800;
}

.status-indicator--warning {
  @apply bg-yellow-100 text-yellow-800;
}

.status-indicator--error {
  @apply bg-red-100 text-red-800;
}

.status-indicator--info {
  @apply bg-blue-100 text-blue-800;
}
```

### 15.3 设计系统变量

```typescript
// shared/constants/designSystem.ts
export const DESIGN_TOKENS = {
  // 间距系统
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // 字体大小
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  // 圆角
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    full: "9999px",
  },

  // 阴影
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },

  // 断点
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index层级
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// 模块主题配置
export const MODULE_THEMES = {
  constellation: {
    primary: "#a855f7",
    secondary: "#c084fc",
    background: "#fdf4ff",
    text: "#581c87",
  },
  psychology: {
    primary: "#22c55e",
    secondary: "#4ade80",
    background: "#f0fdf4",
    text: "#14532d",
  },
  tarot: {
    primary: "#eab308",
    secondary: "#facc15",
    background: "#fefce8",
    text: "#713f12",
  },
  mbti: {
    primary: "#0ea5e9",
    secondary: "#38bdf8",
    background: "#f0f9ff",
    text: "#0c4a6e",
  },
  career: {
    primary: "#f97316",
    secondary: "#fb923c",
    background: "#fff7ed",
    text: "#9a3412",
  },
} as const;
```

### 15.4 响应式设计规范

```typescript
// utils/responsive.ts
export const RESPONSIVE_BREAKPOINTS = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  largeDesktop: "(min-width: 1280px)",
} as const;

// 响应式Hook
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<
    "mobile" | "tablet" | "desktop" | "largeDesktop"
  >("desktop");

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.matchMedia(RESPONSIVE_BREAKPOINTS.mobile).matches) {
        setScreenSize("mobile");
      } else if (window.matchMedia(RESPONSIVE_BREAKPOINTS.tablet).matches) {
        setScreenSize("tablet");
      } else if (
        window.matchMedia(RESPONSIVE_BREAKPOINTS.largeDesktop).matches
      ) {
        setScreenSize("largeDesktop");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return {
    screenSize,
    isMobile: screenSize === "mobile",
    isTablet: screenSize === "tablet",
    isDesktop: screenSize === "desktop" || screenSize === "largeDesktop",
    isLargeDesktop: screenSize === "largeDesktop",
  };
};
```

## 16. 统一开发标准总结

### 16.1 关键原则

1. **一致性优先**: 所有模块必须遵循相同的架构模式和命名规范
2. **类型安全**: 使用TypeScript严格模式，确保类型安全
3. **可维护性**: 代码结构清晰，易于理解和修改
4. **可测试性**: 所有组件和函数都应该易于测试
5. **性能优化**: 合理使用缓存、懒加载等优化技术
6. **用户体验**: 统一的交互模式和视觉设计

### 16.2 强制性规范

- 所有API响应必须使用统一的`APIResponse`格式
- 所有状态管理必须继承`ModuleState`和`ModuleActions`接口
- 所有组件必须实现`BaseComponentProps`接口
- 所有错误处理必须使用`ModuleError`类
- 所有数据库表必须遵循统一命名规范
- 所有样式必须使用预定义的设计系统变量

### 16.3 代码审查检查点

1. 是否遵循统一的接口定义
2. 是否使用了正确的错误处理方式
3. 是否符合组件架构规范
4. 是否使用了统一的样式类名
5. 是否包含必要的测试用例
6. 是否符合数据库设计规范

### 16.4 开发工具配置

```json
// .eslintrc.js 扩展规则
{
  "rules": {
    // 强制使用统一的接口
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    // 强制使用统一的命名规范
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "suffix": ["Props", "State", "Actions", "Response", "Config"]
      }
    ],
    // 强制错误处理
    "@typescript-eslint/no-floating-promises": "error",
    // 强制类型注解
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

这些统一开发标准确保了：

- 所有模块使用相同的架构模式
- API接口格式一致
- 状态管理方式统一
- 错误处理标准化
- 组件接口规范化
- 样式设计系统化
- 数据库设计规范化

通过遵循这些标准，可以大大提高代码质量、开发效率和维护性。
