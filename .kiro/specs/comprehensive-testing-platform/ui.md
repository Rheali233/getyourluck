# UI设计规范文档

**重要说明：** 本UI设计规范与 [统一开发标准](./development-guide.md)
紧密配合，确保视觉设计与代码实现的一致性。所有UI组件都应遵循统一的组件架构规范（BaseComponentProps）和样式系统。

## 1. 设计原则

### 1.1 设计理念

- **简洁现代**: 清晰的视觉层次，减少认知负担
- **温暖友好**: 使用渐变色彩和圆润形状
- **专业可信**: 保持测试内容的专业性和权威性
- **响应式**: 移动端优先，适配所有设备尺寸

### 1.2 品牌色彩系统

```css
/* 主品牌色 */
:root {
  --primary: #6366f1; /* 主色调 - 靛蓝 */
  --secondary: #8b5cf6; /* 辅助色 - 紫色 */
  --accent: #f59e0b; /* 强调色 - 琥珀 */

  /* 功能色彩 */
  --success: #10b981; /* 成功 - 绿色 */
  --warning: #f59e0b; /* 警告 - 橙色 */
  --error: #ef4444; /* 错误 - 红色 */
  --info: #3b82f6; /* 信息 - 蓝色 */
}
```

### 1.3 模块主题色彩系统

每个测试模块使用完全不同的色彩体系，确保视觉区分度和品牌识别度：

```css
/* 模块主题色彩 - 每个模块使用完全不同的色彩体系 */
:root {
  /* 心理学模块 - 蓝色系 */
  --psychology-primary: #3B82F6; /* blue-500 */
  --psychology-secondary: #6366F1; /* indigo-500 */
  --psychology-bg: #EFF6FF; /* blue-50 */
  --psychology-text: #1E40AF; /* blue-800 */
  --psychology-border: #BFDBFE; /* blue-200 */

  /* 职业发展模块 - 绿色系 */
  --career-primary: #10B981; /* emerald-500 */
  --career-secondary: #14B8A6; /* teal-500 */
  --career-bg: #F0FDF4; /* green-50 */
  --career-text: #065F46; /* emerald-800 */
  --career-border: #A7F3D0; /* emerald-200 */

  /* 关系测试模块 - 粉色系 */
  --relationship-primary: #EC4899; /* pink-500 */
  --relationship-secondary: #F43F5E; /* rose-500 */
  --relationship-bg: #FDF2F8; /* pink-50 */
  --relationship-text: #BE185D; /* pink-800 */
  --relationship-border: #FBCFE8; /* pink-200 */

  /* 学习能力模块 - 青色系 */
  --learning-primary: #0891B2; /* cyan-600 */
  --learning-secondary: #0EA5E9; /* sky-500 */
  --learning-bg: #F0F9FF; /* sky-50 */
  --learning-text: #0C4A6E; /* sky-900 */
  --learning-border: #7DD3FC; /* sky-300 */

  /* 占星模块 - 深紫色系 */
  --astrology-primary: #7C3AED; /* violet-600 */
  --astrology-secondary: #6366F1; /* indigo-500 */
  --astrology-bg: #FAF5FF; /* violet-50 */
  --astrology-text: #4C1D95; /* violet-900 */
  --astrology-border: #C4B5FD; /* violet-300 */

  /* 塔罗模块 - 深棕色系 */
  --tarot-primary: #92400E; /* amber-800 */
  --tarot-secondary: #D97706; /* amber-600 */
  --tarot-bg: #FEF3C7; /* amber-100 */
  --tarot-text: #78350F; /* amber-900 */
  --tarot-border: #FDE68A; /* amber-200 */

  /* 传统命理模块 - 深红色系 */
  --numerology-primary: #DC2626; /* red-600 */
  --numerology-secondary: #EA580C; /* orange-600 */
  --numerology-bg: #FEF2F2; /* red-50 */
  --numerology-text: #991B1B; /* red-800 */
  --numerology-border: #FECACA; /* red-200 */
}
```

**使用原则：**

- 使用双色渐变 `linear-gradient(135deg, primary, secondary)`
- 背景色用于页面背景和卡片背景
- 保持足够的颜色对比度确保可读性（4.5:1以上）
- 每个模块使用完全不同的色彩体系，避免相似色

### 1.4 模块配色使用指南

#### 心理学模块 (Psychology) - 蓝色系
```css
/* 页面背景 */
.psychology-page { @apply bg-blue-50; }

/* 渐变按钮 */
.psychology-button { @apply bg-gradient-to-r from-blue-500 to-indigo-500; }

/* 卡片样式 */
.psychology-card { @apply bg-white/80 border-blue-200; }

/* 文字颜色 */
.psychology-text { @apply text-blue-800; }
```

#### 职业发展模块 (Career) - 绿色系
```css
/* 页面背景 */
.career-page { @apply bg-green-50; }

/* 渐变按钮 */
.career-button { @apply bg-gradient-to-r from-emerald-500 to-teal-500; }

/* 卡片样式 */
.career-card { @apply bg-white/80 border-emerald-200; }

/* 文字颜色 */
.career-text { @apply text-emerald-800; }
```

#### 关系测试模块 (Relationship) - 粉色系
```css
/* 页面背景 */
.relationship-page { @apply bg-pink-50; }

/* 渐变按钮 */
.relationship-button { @apply bg-gradient-to-r from-pink-500 to-rose-500; }

/* 卡片样式 */
.relationship-card { @apply bg-white/80 border-pink-200; }

/* 文字颜色 */
.relationship-text { @apply text-pink-800; }
```

#### 学习能力模块 (Learning) - 青色系
```css
/* 页面背景 */
.learning-page { @apply bg-sky-50; }

/* 渐变按钮 */
.learning-button { @apply bg-gradient-to-r from-cyan-600 to-sky-500; }

/* 卡片样式 */
.learning-card { @apply bg-white/80 border-sky-300; }

/* 文字颜色 */
.learning-text { @apply text-sky-900; }
```

#### 占星模块 (Astrology) - 深紫色系
```css
/* 页面背景 */
.astrology-page { @apply bg-violet-50; }

/* 渐变按钮 */
.astrology-button { @apply bg-gradient-to-r from-violet-600 to-indigo-500; }

/* 卡片样式 */
.astrology-card { @apply bg-white/80 border-violet-300; }

/* 文字颜色 */
.astrology-text { @apply text-violet-900; }
```

#### 塔罗模块 (Tarot) - 深棕色系
```css
/* 页面背景 */
.tarot-page { @apply bg-amber-100; }

/* 渐变按钮 */
.tarot-button { @apply bg-gradient-to-r from-amber-800 to-amber-600; }

/* 卡片样式 */
.tarot-card { @apply bg-white/80 border-amber-200; }

/* 文字颜色 */
.tarot-text { @apply text-amber-900; }
```

#### 传统命理模块 (Numerology) - 深红色系
```css
/* 页面背景 */
.numerology-page { @apply bg-red-50; }

/* 渐变按钮 */
.numerology-button { @apply bg-gradient-to-r from-red-600 to-orange-600; }

/* 卡片样式 */
.numerology-card { @apply bg-white/80 border-red-200; }

/* 文字颜色 */
.numerology-text { @apply text-red-800; }
```

## 2. 字体系统

### 2.1 字体族

使用系统字体栈，确保在不同平台上的最佳显示效果：

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  sans-serif;
```

### 2.2 字体层级

- **页面主标题**: `text-4xl` (36px) - 测试名称
- **结果标题**: `text-3xl` (30px) - 测试结果标题
- **分析标题**: `text-2xl` (24px) - 各分析模块标题
- **卡片标题**: `text-xl` (20px) - 卡片内容标题
- **正文**: `text-base` (16px) - 主要内容文字
- **辅助信息**: `text-sm` (14px) - 说明文字、标签等

## 3. 布局和间距

### 3.1 容器规范

- **主容器**: `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
- **首页容器**: `max-w-7xl mx-auto` (更宽的布局)
- **卡片内边距**: `p-6` 或 `p-8` (根据内容重要性)

### 3.2 间距原则

使用Tailwind CSS的间距系统，常用间距：

- **组件间距**: `mb-8` (32px)
- **卡片间距**: `gap-6` (24px)
- **按钮间距**: `space-x-4` (16px)
- **文字间距**: `mb-4` (16px)

## 4. 核心组件规范

**重要：**
所有UI组件都应实现统一开发标准中定义的BaseComponentProps接口，包括className、testId等属性。

### 4.1 按钮组件

按钮组件应遵循统一开发标准中的Button组件规范：

#### 主要按钮（Primary）

```html
<button class="btn btn--primary btn--large" data-testid="start-test-button">
  开始测试
</button>
```

对应CSS类（遵循统一样式系统）：

```css
.btn--primary {
  @apply text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500;
}
.btn--large {
  @apply px-6 py-3 text-base;
}
```

#### 次要按钮（Secondary）

```html
<button class="btn btn--secondary btn--medium" data-testid="back-button">
  返回
</button>
```

#### 轮廓按钮（Outline）

```html
<button class="btn btn--outline btn--medium" data-testid="retry-button">
  重新测试
</button>
```

#### 操作按钮组

```html
<div class="flex flex-col sm:flex-row gap-4">
  <button class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold">
    分享结果
  </button>
  <button class="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold">
    重新测试
  </button>
</div>
```

### 4.2 卡片组件

卡片组件应遵循统一开发标准中的Card组件规范：

#### 基础卡片

```html
<div class="card card--elevated" data-testid="test-card">
  <div class="card__header">
    <h3>卡片标题</h3>
  </div>
  <div class="card__body">
    <!-- 卡片内容 -->
  </div>
</div>
```

#### 交互式卡片

```html
<div class="card card--interactive" data-testid="option-card">
  <!-- 选项内容 -->
</div>
```

#### 主题卡片

```html
<div class="card theme-psychology" data-testid="psychology-card">
  <!-- 心理测试主题卡片 -->
</div>
```

### 4.3 图标容器

#### 标准图标容器

```html
<div class="w-16 h-16 bg-gradient-to-r from-{theme} to-{theme} rounded-full flex items-center justify-center mb-4 mx-auto">
  <i class="fas fa-icon text-white text-2xl"></i>
</div>
```

#### 大型图标容器（页面头部）

```html
<div class="w-24 h-24 bg-gradient-to-r from-{theme} to-{theme} rounded-full flex items-center justify-center mb-6 mx-auto">
  <i class="fas fa-icon text-white text-4xl"></i>
</div>
```

## 5. 页面布局规范

### 5.1 标准页面结构

#### 心理学模块页面
```html
<body class="bg-blue-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 职业发展模块页面
```html
<body class="bg-green-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 关系测试模块页面
```html
<body class="bg-pink-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 学习能力模块页面
```html
<body class="bg-sky-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 占星模块页面
```html
<body class="bg-violet-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 塔罗模块页面
```html
<body class="bg-amber-100 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

#### 传统命理模块页面
```html
<body class="bg-red-50 min-h-screen">
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 页面内容 -->
  </main>
</body>
```

### 5.2 响应式网格

#### 首页测试卡片网格

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- 测试卡片 -->
</div>
```

#### 结果分析网格

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- 分析卡片 -->
</div>
```

### 5.3 特殊页面布局

#### 塔罗模块深色主题页面

```html
<body class="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 min-h-screen text-white">
  <nav class="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 深色导航栏内容 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 塔罗牌内容 -->
  </main>
</body>
```

#### 占星模块神秘主题页面

```html
<body class="bg-gradient-to-br from-slate-900 via-violet-900 to-blue-900 min-h-screen text-white">
  <nav class="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 神秘主题导航栏 -->
      </div>
    </div>
  </nav>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 占星内容 -->
  </main>
</body>
```

## 6. 交互和动画

### 6.1 标准过渡效果

- **默认过渡**: `transition-all duration-300 ease`
- **悬停上移**: `hover:-translate-y-2`
- **悬停缩放**: `hover:scale-105`
- **阴影增强**: `hover:shadow-2xl`

### 6.2 常用交互模式

#### 卡片悬停效果

```html
<div class="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
  <!-- 卡片内容 -->
</div>
```

#### 按钮点击效果

```html
<button class="transition-all transform hover:scale-105 active:scale-95">
  <!-- 按钮内容 -->
</button>
```

#### 页面加载动画

```html
<div class="animate-fade-in-up" style="animation-delay: 0.2s">
  <!-- 内容 -->
</div>
```

### 6.3 进度指示

#### 测试进度条

```html
<div class="w-full bg-gray-200 rounded-full h-2">
  <div
    class="bg-gradient-to-r from-{theme} to-{theme} h-2 rounded-full transition-all duration-300"
    style="width: 25%"
  >
  </div>
</div>
```

#### 加载动画

```html
<div class="w-16 h-16 border-4 border-{theme} border-t-transparent rounded-full animate-spin mx-auto">
</div>
```

## 7. 组件状态规范

### 7.1 按钮状态

- **默认**: 正常显示
- **悬停**: 颜色加深 + 上移效果
- **禁用**: `disabled:opacity-50 disabled:cursor-not-allowed`
- **加载**: 显示加载图标，禁用点击

### 7.2 选项卡状态

- **默认**: `border-2 border-transparent`
- **悬停**: `hover:border-{theme}-300 hover:bg-{theme}-50`
- **选中**: `border-{theme}-400 bg-{theme}-100`

### 7.3 反馈组件

#### 点赞/差评按钮

```html
<button
  class="px-4 py-2 rounded-lg transition-colors hover:bg-green-100"
  onclick="likeResult()"
>
  <i class="fas fa-thumbs-up mr-2"></i>点赞
</button>
```

## 8. 统一开发标准集成

### 8.1 组件架构要求

所有UI组件必须遵循统一开发标准：

- 实现BaseComponentProps接口（className、testId、data-testid）
- 使用统一的CSS类名前缀系统
- 遵循统一的组件结构和导出规范

### 8.2 样式系统集成

- 使用统一开发标准中定义的DESIGN_TOKENS
- 遵循统一的CSS类名规范（.btn、.card、.form-input等）
- 使用预定义的主题变量和响应式断点

### 8.3 状态管理集成

UI组件状态应与Zustand store集成：

```typescript
// 示例：按钮加载状态
const { isLoading } = useModuleStore();

<button
  className="btn btn--primary"
  disabled={isLoading}
  data-testid="submit-button"
>
  {isLoading ? <LoadingSpinner size="small" /> : "提交"}
</button>;
```

## 9. 实现注意事项

### 9.1 技术要求

- 使用Tailwind CSS + 统一样式系统进行开发
- 所有组件必须包含data-testid属性用于测试
- 确保所有交互元素都有适当的焦点状态
- 保持组件的可复用性和一致性

### 9.2 响应式原则

- 移动端优先设计（遵循RESPONSIVE_BREAKPOINTS）
- 确保触摸目标至少44px×44px
- 在小屏幕上按钮垂直排列
- 使用统一的响应式工具类

### 9.3 可访问性（WCAG 2.1 AA合规）

- 保持足够的颜色对比度（4.5:1以上）
- 为交互元素提供清晰的视觉反馈
- 支持键盘导航和屏幕阅读器
- 使用语义化HTML标记

### 9.4 性能考虑

- 避免过度的动画效果
- 使用CSS transform而非改变布局属性
- 合理使用图片和图标资源
- 遵循统一开发标准中的性能优化指南

### 9.5 错误状态设计

UI应支持统一错误处理机制：

```html
<!-- 错误状态显示 -->
<div
  class="status-indicator status-indicator--error"
  data-testid="error-message"
>
  <i class="fas fa-exclamation-triangle mr-2"></i>
  {errorMessage}
</div>

<!-- 加载状态显示 -->
<div
  class="loading-spinner loading-spinner--medium"
  data-testid="loading-spinner"
>
</div>
```
