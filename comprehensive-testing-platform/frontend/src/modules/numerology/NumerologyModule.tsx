/**
 * Numerology Module Router
 * 命理分析模块路由组件
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NumerologyHomePage } from './components/NumerologyHomePage';
import { NumerologyAnalysisPage } from './components/NumerologyAnalysisPage';
import { BaZiAnalysisPage } from './components/BaZiAnalysisPage';
import { BaZiResultPage } from './components/BaZiResultPage';
import { ZodiacAnalysisPage } from './components/ZodiacAnalysisPage';
import { ZodiacResultPage } from './components/ZodiacResultPage';
import { NameAnalysisPage } from './components/NameAnalysisPage';
import { NameResultPage } from './components/NameResultPage';
import { ZiWeiAnalysisPage } from './components/ZiWeiAnalysisPage';
import { ZiWeiResultPage } from './components/ZiWeiResultPage';

export const NumerologyModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NumerologyHomePage />} />
      <Route path="/bazi" element={<BaZiAnalysisPage />} />
      <Route path="/bazi/result" element={<BaZiResultPage />} />
      <Route path="/zodiac" element={<ZodiacAnalysisPage />} />
      <Route path="/zodiac/result" element={<ZodiacResultPage />} />
      <Route path="/name" element={<NameAnalysisPage />} />
      <Route path="/name/result" element={<NameResultPage />} />
      <Route path="/ziwei" element={<ZiWeiAnalysisPage />} />
      <Route path="/ziwei/result" element={<ZiWeiResultPage />} />
    </Routes>
  );
};
