/**
 * Astrology Module Main Component
 * 星座模块主入口，包含路由配置
 * 使用动态导入避免循环依赖
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 使用动态导入避免循环依赖和初始化顺序问题
// 修复：使用更安全的动态导入语法，避免 'm' 变量初始化问题
const AstrologyHomePage = React.lazy(() => 
  import('./components/AstrologyHomePage').then(module => ({ default: module.AstrologyHomePage }))
);
const FortuneTestPage = React.lazy(() => 
  import('./components/FortuneTestPage').then(module => ({ default: module.FortuneTestPage }))
);
const CompatibilityTestPage = React.lazy(() => 
  import('./components/CompatibilityTestPage').then(module => ({ default: module.CompatibilityTestPage }))
);
const BirthChartTestPage = React.lazy(() => 
  import('./components/BirthChartTestPage').then(module => ({ default: module.BirthChartTestPage }))
);

export const AstrologyModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<React.Suspense fallback={<div>Loading...</div>}><AstrologyHomePage /></React.Suspense>} />
      <Route path="/fortune" element={<React.Suspense fallback={<div>Loading...</div>}><FortuneTestPage /></React.Suspense>} />
      <Route path="/compatibility" element={<React.Suspense fallback={<div>Loading...</div>}><CompatibilityTestPage /></React.Suspense>} />
      <Route path="/birth-chart" element={<React.Suspense fallback={<div>Loading...</div>}><BirthChartTestPage /></React.Suspense>} />
    </Routes>
  );
};