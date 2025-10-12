/**
 * Tarot Module Main Component
 * 塔罗牌模块主入口，包含路由配置
 * 遵循统一开发标准的模块架构
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TarotHomePage } from './components/TarotHomePage';
import { RecommendationPage } from './components/RecommendationPage';
import { CardDrawingPage } from './components/CardDrawingPage';
import { ReadingResultPage } from './components/ReadingResultPage';

export const TarotModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TarotHomePage />} />
      <Route path="/recommendation" element={<RecommendationPage />} />
      <Route path="/drawing" element={<CardDrawingPage />} />
      <Route path="/reading" element={<ReadingResultPage />} />
    </Routes>
  );
};
