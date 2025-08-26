# UI设计规范文档

**重要说明：** 本UI设计规范与 [统一开发标准](./development-guide.md)
紧密配合，确保视觉设计与代码实现的一致性。所有UI组件都应遵循统一的组件架构规范（BaseComponentProps）和样式系统。

## 0. 语言设计要求

**重要说明：** 本项目的所有UI设计必须使用英文作为主要语言，确保用户体验的一致性和专业性。

### 0.1 UI语言规范

- **界面文本**: 所有按钮、标签、标题、提示信息等必须使用英文
- **内容展示**: 测试题目、结果描述、帮助文本等必须使用英文
- **交互反馈**: 成功提示、错误信息、加载状态等必须使用英文
- **导航元素**: 菜单项、面包屑、页面标题等必须使用英文
- **表单元素**: 输入提示、验证消息、提交按钮等必须使用英文

### 0.2 英文设计原则

1. **简洁明了**: 使用简洁、清晰的英文表达，避免冗长复杂的句子
2. **专业准确**: 测试相关术语使用标准英文表达，保持专业性
3. **用户友好**: 使用友好、鼓励性的语言，提升用户体验
4. **一致性**: 相同功能的文本在整个界面中保持一致的英文表达
5. **可读性**: 确保英文文本在不同设备上的可读性和易理解性

### 0.3 设计注意事项

- **字体选择**: 优先选择对英文显示友好的字体
- **文本长度**: 考虑英文文本长度，预留足够的显示空间
- **响应式适配**: 确保英文文本在不同屏幕尺寸下的正确显示
- **英文优化**: 针对英文文本特点优化UI布局和间距

---

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

每个测试模块使用独特的渐变色彩，与统一开发标准中的MODULE_THEMES配置保持一致：

```css
/* 模块主题色彩 - 与development-guide.md中的MODULE_THEMES对应 */
:root {
  /* 星座模块 */
  --constellation-primary: #a855f7;
  --constellation-secondary: #c084fc;
  --constellation-bg: #fdf4ff;

  /* 心理测试模块 */
  --psychology-primary: #22c55e;
  --psychology-secondary: #4ade80;
  --psychology-bg: #f0fdf4;

  /* 塔罗牌模块 */
  --tarot-primary: #eab308;
  --tarot-secondary: #facc15;
  --tarot-bg: #fefce8;

  /* MBTI测试模块 */
  --mbti-primary: #0ea5e9;
  --mbti-secondary: #38bdf8;
  --mbti-bg: #f0f9ff;

  /* 职业发展模块 */
  --career-primary: #f97316;
  --career-secondary: #fb923c;
  --career-bg: #fff7ed;
}
```

**使用原则：**

- 使用双色渐变 `linear-gradient(135deg, primary, secondary)`
- 背景色用于页面背景和卡片背景
- 保持足够的颜色对比度确保可读性（4.5:1以上）

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

```html
<body class="bg-gradient-to-br from-{theme}-50 to-{theme}-100 min-h-screen">
  <!-- 导航栏 -->
  <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 导航内容 -->
      </div>
    </div>
  </nav>

  <!-- 主要内容 -->
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

#### 塔罗牌等深色主题页面

```html
<body class="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 min-h-screen text-white">
  <nav class="bg-black/30 backdrop-blur-md shadow-lg sticky top-0 z-50">
    <!-- 深色导航栏 -->
  </nav>
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
