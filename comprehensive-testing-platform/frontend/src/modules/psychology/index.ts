/**
 * 心理测试模块索引文件
 * 遵循统一开发标准的模块导出规范
 */

// 导出类型和常量
export type {
  BaseQuestion,
  MbtiQuestion,
  Phq9Question,
  EqQuestion,
  HappinessQuestion,
  UserAnswer,
  TestSession,
  MbtiResult,
  Phq9Result,
  EqResult,
  HappinessResult,
  TestResult,
  PsychologyState,
  PsychologyActions,
  PsychologyModuleState,
  TestContainerProps,
  QuestionDisplayProps,
  TestProgressProps,
  ResultsDisplayProps,
  TestSelectionProps,
  MbtiResultsProps,
  Phq9ResultsProps,
  EqResultsProps,
  HappinessResultsProps,
} from './types';

// 导出常量
export { TestType, TestStatus, QuestionType } from './types';

// 导出状态管理
export { usePsychologyStore } from './stores/usePsychologyStore';

// 导出组件
export { TestContainer } from './components/TestContainer';
export { default as QuestionDisplay } from './components/QuestionDisplay';
// export { default as TestProgress } from './components/TestProgress';
// export { default as ResultsDisplay } from './components/ResultsDisplay';
// export { default as TestSelection } from './components/TestSelection'; 