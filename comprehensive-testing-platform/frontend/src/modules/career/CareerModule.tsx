/**
 * Career Module Main Component
 * Main entry point for career testing module with routing
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CareerHomePage } from './components/CareerHomePage';
import { CareerTestPage } from './components/CareerTestPage';

export const CareerModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CareerHomePage />} />
      <Route path="/:testType" element={<CareerTestPage />} />
    </Routes>
  );
};
