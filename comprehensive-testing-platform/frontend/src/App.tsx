/**
 * 主应用组件
 * 遵循统一开发标准的应用架构
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { PerformancePanel } from '@/components/PerformancePanel';
import { ApiStatusIndicator } from '@/components/ApiStatusIndicator';
import { GlobalAnalyticsTracker } from '@/components/GlobalAnalyticsTracker';
import { LazyAboutPage, LazyTestCenterPage } from '@/components/LazyComponent';
import { PreloadCriticalModules } from '@/components/Preload';
import { LegacyTestsRedirect } from '@/routes/LegacyTestsRedirect';
import { Homepage } from '@/modules/homepage/components/Homepage';
import { BlogPage } from '@/pages/BlogPage/BlogPage';
import { PsychologyHomePage } from '@/modules/psychology/components/PsychologyHomePage';
import { GenericTestPage } from '@/modules/psychology/components/GenericTestPage';
import { RelationshipHomePage } from '@/modules/relationship/components/RelationshipHomePage';
import { LoveLanguageTestPage } from '@/modules/relationship/components/LoveLanguageTestPage';
import { LoveStyleTestPage } from '@/modules/relationship/components/LoveStyleTestPage';
import { InterpersonalTestPage } from '@/modules/relationship/components/InterpersonalTestPage';
import { CareerModule } from '@/modules/career/CareerModule';
import { AstrologyModule } from '@/modules/astrology/AstrologyModule';
import { TarotModule } from '@/modules/tarot/TarotModule';
import { NumerologyModule } from '@/modules/numerology/NumerologyModule';
import { LearningAbilityHomePage } from '@/modules/learning-ability/components/LearningAbilityHomePage';
import { VARKTestPage } from '@/modules/learning-ability/components/VARKTestPage';
import { SEOToolsPage } from '@/pages/SEOToolsPage';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <PreloadCriticalModules />
        <Routes>
        <Route path="/" element={<Homepage />} />
        {/* About - lazy loaded to keep initial bundle small */}
        <Route
          path="/about"
          element={
            <React.Suspense fallback={<div className="min-h-screen relative"><div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div></div>}>
              <LazyAboutPage />
            </React.Suspense>
          }
        />
        <Route path="/blog/*" element={<BlogPage />} />
        {/* SEO Tools */}
        <Route path="/seo-tools" element={<SEOToolsPage />} />
        {/* Legal Pages */}
        <Route
          path="/terms"
          element={
            <React.Suspense fallback={<div className="min-h-screen relative"><div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div></div>}>
              {React.createElement(React.lazy(() => import('@/pages/Legal/TermsPage')))}
            </React.Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <React.Suspense fallback={<div className="min-h-screen relative"><div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div></div>}>
              {React.createElement(React.lazy(() => import('@/pages/Legal/PrivacyPage')))}
            </React.Suspense>
          }
        />
        <Route
          path="/cookies"
          element={
            <React.Suspense fallback={<div className="min-h-screen relative"><div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div></div>}>
              {React.createElement(React.lazy(() => import('@/pages/Legal/CookiesPage')))}
            </React.Suspense>
          }
        />
        {/* Test Center - lazy loaded (exact) */}
        <Route
          path="/tests"
          element={
            <React.Suspense fallback={<div className="min-h-screen relative"><div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div></div>}>
              <LazyTestCenterPage />
            </React.Suspense>
          }
        />
        {/* Backward compatibility: /tests/* -> strip prefix to new module paths */}
        <Route path="/tests/*" element={<LegacyTestsRedirect />} />
        {/* 已删除：TestPages路由 */}
        <Route path="/psychology" element={<PsychologyHomePage />} />
        <Route path="/psychology/mbti" element={<GenericTestPage testType="mbti" title="MBTI Personality Test" description="Discover your personality type with the Myers-Briggs Type Indicator test." />} />
        <Route path="/psychology/phq9" element={<GenericTestPage testType="phq9" title="PHQ-9 Depression Screening" description="A brief screening tool for depression assessment." />} />
        <Route path="/psychology/eq" element={<GenericTestPage testType="eq" title="Emotional Intelligence Test" description="Assess your emotional intelligence and self-awareness" />} />
        <Route path="/psychology/happiness" element={<GenericTestPage testType="happiness" title="Happiness Assessment" description="Measure your current happiness and life satisfaction levels." />} />
        
        {/* Astrology Module Routes */}
        <Route path="/astrology/*" element={<AstrologyModule />} />
        {/* Tarot Module Routes */}
        <Route path="/tarot/*" element={<TarotModule />} />
        {/* Numerology Module Routes */}
        <Route path="/numerology/*" element={<NumerologyModule />} />
        <Route path="/career/*" element={<CareerModule />} />
        {/* Learning Ability Module Routes */}
        <Route path="/learning" element={<LearningAbilityHomePage />} />
        <Route path="/learning/vark" element={<VARKTestPage />} />
        <Route path="/relationship" element={<RelationshipHomePage />} />
        {/* Canonical hyphenated paths */}
        <Route path="/relationship/love-language" element={<LoveLanguageTestPage />} />
        <Route path="/relationship/love-style" element={<LoveStyleTestPage />} />
        {/* Backward-compatibility redirects from underscore paths */}
        <Route path="/relationship/love_language" element={<Navigate to="/relationship/love-language" replace />} />
        <Route path="/relationship/love_style" element={<Navigate to="/relationship/love-style" replace />} />
        <Route path="/relationship/interpersonal" element={<InterpersonalTestPage />} />
        
        {/* 已删除：ResultPages和ComponentShowcase路由 */}
        </Routes>
        
        {/* Global analytics tracker - lazy-load wrapper can be added by route-level splitting if needed */}
        <GlobalAnalyticsTracker />
        
        {/* 性能监控面板 - 仅开发环境 */}
        <PerformancePanel />
        
        {/* API状态指示器 - 仅开发环境 */}
        <ApiStatusIndicator showDetails={process.env['NODE_ENV'] === 'development'} />
        
        {/* 性能监控 - 仅开发环境 */}
        <PerformanceMonitor enabled={process.env['NODE_ENV'] === 'development'} />
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;