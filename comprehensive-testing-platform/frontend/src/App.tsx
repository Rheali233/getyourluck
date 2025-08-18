/**
 * 主应用组件
 * 遵循统一开发标准的应用架构
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { MainLayout } from '@/layouts/MainLayout';
import { Homepage } from '@/modules/homepage/components/Homepage';
import { BlogPage } from '@/pages/BlogPage/BlogPage';
import { TestPages } from '@/pages/TestPages/TestPages';
import { ResultPages } from '@/pages/ResultPages/ResultPages';
import { ComponentShowcase } from '@/pages/ComponentShowcase';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/tests/*" element={<TestPages />} />
        <Route path="/results/*" element={<ResultPages />} />
        <Route path="/components" element={<ComponentShowcase />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;