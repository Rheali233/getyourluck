/**
 * Astrology Module Exports
 * 注意：避免循环依赖，按顺序导出
 * 修复：不导出 components，避免初始化顺序问题
 */

// 1. 先导出类型（不依赖其他模块）
export * from './types';

// 2. 导出数据（不依赖其他模块）
export * from './data';

// 3. 导出服务（依赖类型，但不依赖 stores）
export * from './services';

// 4. 导出 stores（依赖服务和统一 store）
export * from './stores/useAstrologyStore';

// 5. 不导出组件，避免初始化顺序问题
// export * from './components'; // 注释掉，避免打包时的初始化顺序问题

// 6. 最后导出主模块（依赖所有组件）
export { AstrologyModule } from './AstrologyModule';