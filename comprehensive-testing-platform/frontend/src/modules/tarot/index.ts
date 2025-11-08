/**
 * Tarot Module Export
 * 塔罗牌模块导出文件
 * 注意：避免循环依赖，按顺序导出
 */

// 1. 先导出类型（不依赖其他模块）
export * from './types';

// 2. 导出数据（不依赖其他模块）
export * from './data';

// 3. 导出服务（依赖类型，但不依赖 stores）
export * from './services/tarotService';

// 4. 导出 stores（依赖服务和统一 store）
export * from './stores/useTarotStore';

// 5. 导出组件（依赖 stores 和 services）
export * from './components';

// 6. 最后导出主模块（依赖所有组件）
export { TarotModule } from './TarotModule';
