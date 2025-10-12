# 前端开发快速参考指南

## 🚀 快速开始

### 1. 创建新模块页面

```typescript
// 1. 创建页面组件
export const ModuleHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error } = useUnifiedTestStore();

  if (isLoading) return <LoadingSpinner message="Loading..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <ModuleTestContainer>
      {/* 页面内容 */}
    </ModuleTestContainer>
  );
};

// 2. 添加到路由
<Route path="/module" element={<ModuleHomePage />} />
```

### 2. 状态管理模式

```typescript
// 统一 + 模块双仓库模式
export const useModuleStore = () => {
  const unifiedStore = useUnifiedTestStore();
  const moduleStore = useModuleStoreStore();
  
  return {
    ...unifiedStore,    // 全局状态
    ...moduleStore,     // 模块状态
    // 模块方法
    loadModuleData,
    processModuleAction,
  };
};
```

### 3. API服务模式

```typescript
// API服务
export const moduleService = {
  async getData(): Promise<APIResponse<DataType[]>> {
    return apiClient.get('/api/module/data');
  },
  
  async processData(data: ProcessData): Promise<APIResponse<ResultType>> {
    return apiClient.post('/api/module/process', data);
  }
};
```

## 🎨 UI组件规范

### 容器组件

```typescript
// 模块容器
<ModuleTestContainer>
  <div className="max-w-6xl mx-auto py-8 px-4">
    {children}
  </div>
</ModuleTestContainer>
```

### 卡片组件

```typescript
// 标准卡片
<Card className="bg-white/60 backdrop-blur-md rounded-lg shadow-sm p-8">
  <h2 className="text-2xl font-bold text-module-900 mb-4">Title</h2>
  <p className="text-module-800">Content</p>
</Card>
```

### 按钮组件

```typescript
// 主要按钮
<Button className="bg-gradient-to-r from-module-600 to-module-500 hover:from-module-700 hover:to-module-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
  Action
</Button>

// 次要按钮
<Button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg">
  Secondary
</Button>
```

### 输入框组件

```typescript
// 标准输入框
<input 
  type="text"
  className="flex-1 h-12 px-4 rounded-xl bg-white/0 text-module-900 placeholder-module-700 focus:outline-none focus:ring-0"
  placeholder="Enter text..."
/>
```

## 🎨 主题系统

### 主题配置

```typescript
// 实际主题配置 (来自 themeConfigs.ts)
const themeConfigs = {
  tarot: {
    colors: {
      primary: 'amber',
      secondary: 'orange',
      accent: 'yellow'
    },
    gradients: {
      background: 'from-amber-50 to-orange-50',
      primary: 'from-amber-500 to-orange-500'
    }
  },
  psychology: {
    colors: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'indigo'
    },
    gradients: {
      background: 'from-purple-50 to-pink-50',
      primary: 'from-purple-500 to-pink-500'
    }
  }
};

// 实际使用的样式类名 (在Tarot组件中)
// 背景: bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-200 via-violet-300 to-violet-500
// 卡片: bg-white/60 backdrop-blur-md
// 文字: text-violet-900, text-violet-800, text-violet-700
// 按钮: bg-gradient-to-r from-violet-600 to-indigo-500
```

### 响应式设计

```typescript
// 网格布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// 文本大小
<h1 className="text-4xl md:text-5xl font-bold">
<h2 className="text-2xl font-bold">
<p className="text-lg">

// 间距
<div className="mb-8">
<div className="py-8 px-4">
```

## 🔧 性能优化

### 懒加载

```typescript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

### 状态优化

```typescript
// 使用useCallback
const handleAction = useCallback(async () => {
  // 处理逻辑
}, [dependencies]);

// 使用useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 图片优化

```typescript
<img 
  src={imageUrl} 
  loading="lazy" 
  alt={altText}
  className="w-full h-auto"
/>
```

## 🧪 测试模式

### 组件测试

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onAction={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## 📁 文件结构

```
modules/module-name/
├── components/
│   ├── ModuleHomePage.tsx
│   ├── ModuleTestPage.tsx
│   ├── ModuleResultPage.tsx
│   ├── ModuleTestContainer.tsx
│   └── index.ts
├── stores/
│   └── useModuleStore.ts
├── services/
│   └── moduleService.ts
├── types/
│   └── index.ts
├── data/
│   └── moduleData.ts
├── ModuleModule.tsx
└── index.ts
```

## 🚨 常见错误避免

### 1. 状态管理错误

```typescript
// ❌ 错误：直接修改状态
state.data.push(newItem);

// ✅ 正确：使用不可变更新
setState(prev => ({ ...prev, data: [...prev.data, newItem] }));
```

### 2. 副作用错误

```typescript
// ❌ 错误：缺少依赖
useEffect(() => {
  fetchData();
}, []); // 缺少fetchData依赖

// ✅ 正确：包含所有依赖
useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 3. 类型安全错误

```typescript
// ❌ 错误：使用any
const data: any = response.data;

// ✅ 正确：定义具体类型
const data: ModuleDataType = response.data;
```

## 📋 开发检查清单

### 组件开发
- [ ] 使用TypeScript类型定义
- [ ] 实现错误边界
- [ ] 添加加载状态
- [ ] 遵循命名规范
- [ ] 添加适当的注释

### 状态管理
- [ ] 使用统一状态管理
- [ ] 实现错误处理
- [ ] 添加缓存策略
- [ ] 优化重渲染

### 性能优化
- [ ] 实现懒加载
- [ ] 使用useCallback/useMemo
- [ ] 优化图片加载
- [ ] 减少不必要的API调用

### 测试
- [ ] 添加单元测试
- [ ] 测试用户交互
- [ ] 测试错误场景
- [ ] 测试边界条件

---

*此快速参考指南基于Tarot模块的最佳实践，适用于所有模块开发。*
