/**
 * Astrology Components Exports
 * 按依赖顺序导出，避免循环依赖
 */

// 先导出不依赖其他组件的容器组件
export * from './AstrologyTestContainer';

// 再导出页面组件（它们依赖 AstrologyTestContainer）
export * from './AstrologyHomePage';
export * from './FortuneTestPage';
export * from './CompatibilityTestPage';
export * from './BirthChartTestPage';