/**
 * Astrology Module Main Component
 * 星座模块主入口，包含路由配置
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AstrologyHomePage } from './components/AstrologyHomePage';
import { FortuneTestPage } from './components/FortuneTestPage';
import { CompatibilityTestPage } from './components/CompatibilityTestPage';
import { BirthChartTestPage } from './components/BirthChartTestPage';

export const AstrologyModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AstrologyHomePage />} />
      <Route path="/fortune" element={<FortuneTestPage />} />
      <Route path="/compatibility" element={<CompatibilityTestPage />} />
      <Route path="/birth-chart" element={<BirthChartTestPage />} />
    </Routes>
  );
};