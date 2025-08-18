# UI组件库

## 概述

本UI组件库遵循统一开发标准，提供了一套完整的、可复用的前端组件。所有组件都基于`BaseComponentProps`接口，确保一致性和可维护性。

## 组件列表

### 基础组件

#### Button 按钮
- **用途**: 用户交互的主要操作元素
- **变体**: primary, secondary, outline, ghost
- **尺寸**: small, medium, large
- **状态**: 正常、禁用、加载中

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="medium" onClick={handleClick}>
  点击我
</Button>
```

#### Card 卡片
- **用途**: 内容容器，支持标题、描述和操作按钮
- **特性**: 可选的标题和描述，支持操作按钮区域

```tsx
import { Card } from '@/components/ui';

<Card title="标题" description="描述" actions={<Button>操作</Button>}>
  内容区域
</Card>
```

#### PageHeader 页面头部
- **用途**: 页面主要标题区域，支持主题变化
- **主题**: primary, secondary, constellation, psychology, tarot, mbti, career
- **特性**: 可选的图标、描述和操作按钮

```tsx
import { PageHeader } from '@/components/ui';

<PageHeader
  title="页面标题"
  description="页面描述"
  theme="psychology"
  onStart={handleStart}
/>
```

### 表单组件

#### Input 输入框
- **用途**: 文本输入表单元素
- **特性**: 标签、占位符、错误提示、验证状态
- **类型**: text, email, password, number等

```tsx
import { Input } from '@/components/ui';

<Input
  label="用户名"
  placeholder="请输入用户名"
  value={username}
  onChange={setUsername}
  error={errors.username}
  required
/>
```

#### Select 选择框
- **用途**: 下拉选择表单元素
- **特性**: 标签、选项列表、错误提示、验证状态

```tsx
import { Select } from '@/components/ui';

<Select
  label="选择类型"
  options={[
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' }
  ]}
  value={selectedValue}
  onChange={setSelectedValue}
  required
/>
```

#### Form 表单
- **用途**: 表单容器，提供统一的表单样式和行为
- **特性**: 自动阻止默认提交，支持自定义提交处理

```tsx
import { Form } from '@/components/ui';

<Form onSubmit={handleSubmit}>
  <Input label="用户名" />
  <Button type="submit">提交</Button>
</Form>
```

### 状态组件

#### LoadingSpinner 加载旋转器
- **用途**: 显示加载状态的动画组件
- **尺寸**: small, medium, large
- **特性**: 可选的加载文本

```tsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="medium" text="加载中..." />
```

#### Alert 警告
- **用途**: 显示不同类型的消息提示
- **变体**: success, warning, error, info
- **特性**: 可选的标题、关闭按钮

```tsx
import { Alert } from '@/components/ui';

<Alert
  variant="success"
  title="成功"
  message="操作已完成"
  onClose={handleClose}
/>
```

### 交互组件

#### Modal 模态框
- **用途**: 弹窗和对话框
- **尺寸**: small, medium, large, full
- **特性**: ESC键关闭、遮罩层点击关闭、自定义关闭按钮

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="确认操作"
  size="medium"
>
  <p>确认要执行此操作吗？</p>
  <Button onClick={handleConfirm}>确认</Button>
</Modal>
```

## 使用原则

### 1. 统一接口
所有组件都继承自`BaseComponentProps`，确保一致的属性接口：
- `className`: 自定义样式类
- `testId`: 测试标识符
- `data-testid`: 测试属性

### 2. 主题系统
组件支持主题切换，与`ThemeContext`集成：
- 自动适应当前主题
- 支持模块特定主题
- 响应式设计

### 3. 无障碍支持
所有组件都遵循WAI-ARIA标准：
- 语义化HTML
- 键盘导航支持
- 屏幕阅读器兼容

### 4. 响应式设计
组件采用移动优先的响应式设计：
- 自适应不同屏幕尺寸
- 触摸友好的交互
- 一致的视觉体验

## 开发指南

### 添加新组件
1. 在`src/components/ui/`目录下创建组件文件
2. 继承`BaseComponentProps`或相关接口
3. 使用`cn()`工具函数处理样式
4. 添加适当的TypeScript类型
5. 更新组件索引文件

### 组件测试
1. 使用`testId`属性进行测试
2. 确保组件的所有状态都被测试
3. 测试无障碍功能
4. 测试响应式行为

### 样式规范
1. 使用Tailwind CSS类名
2. 遵循设计系统的颜色和间距
3. 保持一致的动画和过渡效果
4. 支持主题切换

## 示例页面

查看`ComponentShowcase`页面了解所有组件的使用示例和变体。

## 更新日志

- **v1.0.0**: 初始版本，包含基础UI组件
- 支持主题系统集成
- 完整的TypeScript类型定义
- 响应式设计和无障碍支持 