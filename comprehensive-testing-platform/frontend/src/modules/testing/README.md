# 统一测试架构 (Unified Testing Architecture)

## 概述

这是重构后的统一测试架构，为所有测试模块提供了一致的接口和组件。该架构基于以下设计原则：

- **单一职责原则**: 每个组件和类都有明确的职责
- **开闭原则**: 对扩展开放，对修改封闭
- **依赖倒置原则**: 依赖抽象而非具体实现
- **接口隔离原则**: 客户端不应该依赖它不需要的接口

## 架构组件

### 1. 核心类型定义 (`types/TestTypes.ts`)

定义了所有测试相关的类型和接口：

- `TestCategory`: 测试分类枚举
- `QuestionFormat`: 问题格式枚举
- `AnswerType`: 答案类型枚举
- `ResultType`: 结果类型枚举
- `TestStatus`: 测试状态枚举
- `Question`: 问题接口
- `TestAnswer`: 测试答案接口
- `TestResult`: 测试结果接口
- `TestSession`: 测试会话接口

### 2. 测试流程接口 (`core/TestFlow.ts`)

定义了所有测试必须实现的核心接口：

- `ITestFlow<T>`: 测试流程接口
- `BaseTestFlow<T>`: 抽象基类，提供通用实现
- `TestFlowRegistry`: 测试流程注册器

### 3. 统一状态管理 (`stores/useTestStore.ts`)

使用 Zustand 管理所有测试的通用状态：

- 测试会话管理
- 问题和答案管理
- 进度跟踪
- 结果管理

### 4. 通用组件 (`components/`)

- `TestContainer`: 测试容器组件
- `QuestionDisplay`: 问题显示组件
- `TestProgress`: 测试进度组件
- `TestControls`: 测试控制组件
- `TestResults`: 测试结果组件

## 使用方法

### 1. 创建新的测试类型

```typescript
import { BaseTestFlow } from '../core/TestFlow';
import type { PsychologyTestType } from '../types/TestTypes';

export interface MyTestType extends PsychologyTestType {
  id: 'my_test';
  name: 'My Test Name';
  // ... 其他属性
}

export class MyTest extends BaseTestFlow<MyTestType> {
  constructor() {
    const testType: MyTestType = {
      id: 'my_test',
      name: 'My Test Name',
      category: TestCategory.PSYCHOLOGY,
      questionFormat: QuestionFormat.SINGLE_CHOICE,
      answerType: AnswerType.STRING,
      resultType: ResultType.CATEGORY,
      totalQuestions: 10,
      estimatedTime: 15,
      // ... 其他属性
    };
    
    super(testType);
    this.initializeQuestions();
  }
  
  // 实现抽象方法
  async startTest(): Promise<void> { /* ... */ }
  submitAnswer(questionId: string, answer: any): void { /* ... */ }
  async generateResults(): Promise<TestResult<any>> { /* ... */ }
  async analyzeResults(): Promise<any> { /* ... */ }
}
```

### 2. 使用测试容器组件

```typescript
import { TestContainer } from '../components/TestContainer';
import { useTestStore } from '../stores/useTestStore';

const MyTestPage: React.FC = () => {
  const { setQuestions } = useTestStore();
  
  const questions = [/* 你的问题数组 */];
  
  useEffect(() => {
    setQuestions(questions);
  }, [setQuestions]);
  
  return (
    <TestContainer
      testType="my_test"
      questions={questions}
      onTestComplete={(result) => console.log('Test completed:', result)}
      onTestPause={() => console.log('Test paused')}
      onTestResume={() => console.log('Test resumed')}
    />
  );
};
```

### 3. 自定义问题显示

```typescript
import { QuestionDisplay } from '../components/QuestionDisplay';

// 问题格式会自动根据 Question 的 format 属性渲染
const customQuestion: Question = {
  id: 'custom_q1',
  text: 'Your custom question?',
  format: QuestionFormat.SCALE,
  minValue: 1,
  maxValue: 10,
  // ... 其他属性
};
```

## 扩展性

### 1. 添加新的问题格式

```typescript
// 在 TestTypes.ts 中添加新的枚举值
export enum QuestionFormat {
  // ... 现有格式
  NEW_FORMAT = 'new_format'
}

// 在 QuestionDisplay.tsx 中添加渲染逻辑
const renderNewFormat = () => {
  // 实现新的渲染逻辑
};

// 在 renderQuestionContent 中添加 case
case QuestionFormat.NEW_FORMAT:
  return renderNewFormat();
```

### 2. 添加新的答案类型

```typescript
// 在 TestTypes.ts 中添加新的枚举值
export enum AnswerType {
  // ... 现有类型
  NEW_TYPE = 'new_type'
}

// 在相关组件中添加验证逻辑
const validateNewType = (answer: any): boolean => {
  // 实现新的验证逻辑
  return true;
};
```

### 3. 添加新的结果类型

```typescript
// 在 TestTypes.ts 中添加新的枚举值
export enum ResultType {
  // ... 现有类型
  NEW_RESULT = 'new_result'
}

// 在 TestResults.tsx 中添加渲染逻辑
const renderNewResult = () => {
  // 实现新的渲染逻辑
};
```

## 最佳实践

### 1. 测试实现

- 继承 `BaseTestFlow<T>` 而不是直接实现 `ITestFlow<T>`
- 使用 `protected` 方法如 `setQuestions()`, `addAnswer()` 等
- 在 `submitAnswer()` 中实现答案验证
- 在 `generateResults()` 中实现结果计算逻辑

### 2. 状态管理

- 使用 `useTestStore()` 管理测试状态
- 避免在组件中直接操作状态
- 使用提供的 actions 如 `startTest()`, `submitAnswer()` 等

### 3. 组件使用

- 优先使用 `TestContainer` 作为测试页面的主要组件
- 根据需要自定义 `QuestionDisplay` 的样式
- 使用 `TestProgress` 显示测试进度
- 使用 `TestControls` 提供导航和控制功能

### 4. 错误处理

- 在测试实现中添加适当的错误处理
- 使用 `setError()` 设置错误状态
- 在 UI 中显示错误信息

## 迁移指南

### 从旧架构迁移

1. **替换状态管理**: 将现有的测试状态管理替换为 `useTestStore`
2. **重构测试逻辑**: 将测试逻辑重构为继承 `BaseTestFlow` 的类
3. **更新组件**: 将现有的测试组件替换为新的通用组件
4. **调整类型**: 更新类型定义以使用新的接口

### 示例迁移

```typescript
// 旧的方式
const [questions, setQuestions] = useState([]);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState({});

// 新的方式
const { 
  questions, 
  currentQuestionIndex, 
  answers, 
  submitAnswer, 
  goToNextQuestion 
} = useTestStore();
```

## 故障排除

### 常见问题

1. **类型错误**: 确保所有类型都正确导入和使用
2. **状态不同步**: 检查是否正确使用了 `useTestStore` 的 actions
3. **组件不渲染**: 确保问题格式和答案类型正确设置
4. **构建失败**: 检查 TypeScript 类型定义和导入

### 调试技巧

- 使用 Redux DevTools 查看状态变化
- 在组件中添加 `console.log` 调试状态
- 检查浏览器控制台的错误信息
- 验证问题数据的格式是否正确

## 未来扩展

该架构设计为支持以下扩展：

- 自适应测试
- 协作测试
- 游戏化测试
- 沉浸式测试
- 生物反馈测试
- 实时分析

每个扩展都可以通过实现相应的接口和组件来实现，而不会影响现有的功能。
