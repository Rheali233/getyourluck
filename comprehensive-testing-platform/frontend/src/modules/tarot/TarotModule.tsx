/**
 * Tarot Module Main Component
 * 塔罗牌模块主入口，包含路由配置
 * 使用动态导入避免循环依赖和初始化顺序问题
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 使用动态导入避免循环依赖和初始化顺序问题
const TarotHomePage = React.lazy(() => import('./components/TarotHomePage').then(m => ({ default: m.TarotHomePage })));
const RecommendationPage = React.lazy(() => import('./components/RecommendationPage').then(m => ({ default: m.RecommendationPage })));
const CardDrawingPage = React.lazy(() => import('./components/CardDrawingPage').then(m => ({ default: m.CardDrawingPage })));
const ReadingResultPage = React.lazy(() => import('./components/ReadingResultPage').then(m => ({ default: m.ReadingResultPage })));

export const TarotModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<React.Suspense fallback={<div>Loading...</div>}><TarotHomePage /></React.Suspense>} />
      <Route path="/recommendation" element={<React.Suspense fallback={<div>Loading...</div>}><RecommendationPage /></React.Suspense>} />
      <Route path="/drawing" element={<React.Suspense fallback={<div>Loading...</div>}><CardDrawingPage /></React.Suspense>} />
      <Route path="/reading" element={<React.Suspense fallback={<div>Loading...</div>}><ReadingResultPage /></React.Suspense>} />
    </Routes>
  );
};
