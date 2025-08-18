# 统一React项目结构实施文档

## 概述

本文档描述了任务4.1"创建统一React项目结构"的实施细节。该任务旨在按照统一开发标准建立前端项目的目录结构，配置Tailwind CSS样式系统，建立路由系统和页面结构，以及实现统一的响应式布局组件。

## 项目结构

### 目录结构

```
frontend/
├── public/              # 静态资源
├── src/
│   ├── components/      # UI组件
│   │   ├── common/      # 通用组件 (如导航、页脚)
│   │   └── ui/          # 基础UI组件 (如按钮、卡片)
│   ├── contexts/        # React上下文
│   ├── hooks/           # 自定义Hooks
│   ├── layouts/         # 页面布局组件
│   ├── pages/           # 页面组件
│   ├── services/        # API服务
│   ├── stores/          # 状态管理
│   ├── styles/          # 全局样式
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 应用入口
├── index.html           # HTML模板
├── package.json         # 项目依赖
├── tailwind.config.js   # Tailwind配置
└── vite.config.ts       # Vite配置
```

### 组件架构

项目遵循以下组件架构原则：

1. **基于组件接口**：所有组件基于`BaseComponentProps`接口扩展，确保统一属性
2. **组件命名规范**：使用PascalCase命名组件文件和组件名
3. **功能分离**：将UI、布局、状态和逻辑分离，提高可维护性和可测试性
4. **响应式设计**：所有组件自适应移动和桌面视图

## 统一样式系统

### Tailwind CSS配置

配置了符合设计规范的颜色、字体、间距和动画效果：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // 主题色彩系统
      colors: {
        primary: { /* 主题色彩 */ },
        secondary: { /* 辅助色彩 */ },
        // 模块主题色彩
        constellation: { /* 占星模块色彩 */ },
        psychology: { /* 心理测试模块色彩 */ },
        tarot: { /* 塔罗牌模块色彩 */ },
        mbti: { /* MBTI模块色彩 */ },
        career: { /* 职业发展模块色彩 */ },
      },
      // 字体系统
      fontFamily: { /* 字体定义 */ },
      // 动画效果
      animation: { /* 动画定义 */ },
    },
  },
}
```

### 样式复用与组合

使用`cn()`工具函数合并类名，解决样式冲突：

```typescript
// utils/classNames.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 核心组件

### 基础组件

创建了以下基础UI组件：

1. **Button**：多样式变体（primary, secondary, outline, ghost）
2. **Card**：标准内容容器，支持标题、描述和操作按钮
3. **PageHeader**：页面标题区域，支持主题变化

### 布局组件

1. **MainLayout**：主布局，包含导航、内容区和页脚
2. **ContentLayout**：内容布局，用于设置主内容区的样式和布局

## 主题系统

实现了主题上下文，支持动态切换主题：

```typescript
// contexts/ThemeContext.tsx
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || DEFAULT_THEME;
  });
  
  // ...主题逻辑...
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义Hook
export const useTheme = () => useContext(ThemeContext);
```

## 路由系统

使用React Router实现嵌套路由，与布局组件集成：

```tsx
// App.tsx
const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tests/*" element={<TestPages />} />
          <Route path="/results/*" element={<ResultPages />} />
          <Route path="/blog/*" element={<BlogPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  </ErrorBoundary>
);
```

## 类型系统

统一组件类型定义，确保类型安全：

```typescript
// types/componentTypes.ts
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  // ...更多属性...
}
```

## 响应式设计

所有组件都采用移动优先的响应式设计：

1. **基础断点**：sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
2. **容器适应**：使用Tailwind容器类自动调整内容宽度
3. **网格系统**：使用CSS Grid和Flexbox构建灵活布局

## 性能优化

1. **代码分割**：基于路由的代码分割
2. **懒加载**：使用React.lazy加载非主要路径组件
3. **图片优化**：响应式图片和适当的图片格式

## 辅助功能

所有组件都遵循WAI-ARIA标准，确保：

1. **语义化HTML**：使用合适的HTML元素
2. **键盘导航**：可通过键盘完全操作
3. **屏幕阅读器支持**：合适的ARIA标签和角色

## 下一步计划

1. 实现更多基础UI组件
2. 添加自动化测试
3. 完善文档和示例
4. 建立组件库展示页面

## 总结

统一React项目结构的实现为平台提供了坚实的前端基础，确保了开发效率、代码质量和用户体验。该结构完全符合统一开发标准，提供了一致的组件接口、样式系统和路由架构。 