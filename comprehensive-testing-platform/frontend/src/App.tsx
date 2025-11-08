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
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
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
// 使用懒加载避免初始化顺序问题和循环依赖
// 修复：使用更明确的变量名避免初始化顺序问题
const AstrologyModule = React.lazy(() => 
  import('@/modules/astrology/AstrologyModule').then(module => ({ default: module.AstrologyModule }))
);
import { TarotModule } from '@/modules/tarot/TarotModule';
import { NumerologyModule } from '@/modules/numerology/NumerologyModule';
import { LearningAbilityHomePage } from '@/modules/learning-ability/components/LearningAbilityHomePage';
import { VARKTestPage } from '@/modules/learning-ability/components/VARKTestPage';
import { SEOToolsPage } from '@/pages/SEOToolsPage';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { DefaultScrollRestoration } from '@/components/ScrollRestoration';
import { CookiesBanner } from '@/modules/homepage/components/CookiesBanner';
import { SuspenseFallback } from '@/components/ui/SuspenseFallback';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <PreloadCriticalModules />
        <DefaultScrollRestoration />
        <CookiesBanner />
        <Routes>
        <Route path="/" element={<Homepage />} />
        {/* About - lazy loaded to keep initial bundle small */}
        <Route
          path="/about"
          element={
            <React.Suspense
              fallback={
                <SuspenseFallback
                  message="Loading About page…"
                  description="We are preparing the about content."
                />
              }
            >
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
            <React.Suspense
              fallback={
                <SuspenseFallback
                  message="Loading Terms of Service…"
                  description="The legal content is loading."
                />
              }
            >
              {React.createElement(React.lazy(() => import('@/pages/Legal/TermsPage')))}
            </React.Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <React.Suspense
              fallback={
                <SuspenseFallback
                  message="Loading Privacy Policy…"
                  description="The privacy details are being fetched."
                />
              }
            >
              {React.createElement(React.lazy(() => import('@/pages/Legal/PrivacyPage')))}
            </React.Suspense>
          }
        />
        <Route
          path="/cookies"
          element={
            <React.Suspense
              fallback={
                <SuspenseFallback
                  message="Loading Cookies Policy…"
                  description="The cookies policy is loading."
                />
              }
            >
              {React.createElement(React.lazy(() => import('@/pages/Legal/CookiesPage')))}
            </React.Suspense>
          }
        />
        {/* Test Center - lazy loaded (exact) */}
        <Route
          path="/tests"
          element={
            <React.Suspense
              fallback={
                <SuspenseFallback
                  message="Loading Test Center…"
                  description="We are gathering the available tests for you."
                />
              }
            >
              <LazyTestCenterPage />
            </React.Suspense>
          }
        />
        {/* Psychology Module Routes - Updated to /tests/psychology */}
        <Route path="/tests/psychology" element={<PsychologyHomePage />} />
        <Route path="/tests/psychology/mbti" element={<GenericTestPage testType="mbti" title="MBTI Personality Test" description="Discover your personality type with the Myers-Briggs Type Indicator test." />} />
        <Route path="/tests/psychology/phq9" element={<GenericTestPage testType="phq9" title="PHQ-9 Depression Screening" description="A brief screening tool for depression assessment." />} />
        <Route path="/tests/psychology/eq" element={<GenericTestPage testType="eq" title="Emotional Intelligence Test" description="Assess your emotional intelligence and self-awareness" />} />
        <Route path="/tests/psychology/happiness" element={<GenericTestPage testType="happiness" title="Happiness Assessment" description="Measure your current happiness and life satisfaction levels." />} />
        
        {/* Career Module Routes - Updated to /tests/career */}
        <Route path="/tests/career/*" element={<CareerModule />} />
        
        {/* Learning Ability Module Routes - Updated to /tests/learning */}
        <Route path="/tests/learning" element={<LearningAbilityHomePage />} />
        <Route path="/tests/learning/vark" element={<VARKTestPage />} />
        
        {/* Relationship Module Routes - Updated to /tests/relationship */}
        <Route path="/tests/relationship" element={<RelationshipHomePage />} />
        <Route path="/tests/relationship/love-language" element={<LoveLanguageTestPage />} />
        <Route path="/tests/relationship/love-style" element={<LoveStyleTestPage />} />
        <Route path="/tests/relationship/interpersonal" element={<InterpersonalTestPage />} />
        {/* Backward-compatibility redirects from underscore paths */}
        <Route path="/tests/relationship/love_language" element={<Navigate to="/tests/relationship/love-language" replace />} />
        <Route path="/tests/relationship/love_style" element={<Navigate to="/tests/relationship/love-style" replace />} />
        
        {/* Astrology Module Routes - Updated to /tests/astrology */}
        <Route path="/tests/astrology/*" element={<React.Suspense fallback={<SuspenseFallback message="Loading Astrology module…" description="We are preparing the astrology content." />}><AstrologyModule /></React.Suspense>} />
        {/* Tarot Module Routes - Updated to /tests/tarot */}
        <Route path="/tests/tarot/*" element={<TarotModule />} />
        {/* Numerology Module Routes - Updated to /tests/numerology */}
        <Route path="/tests/numerology/*" element={<NumerologyModule />} />
        
        {/* Backward compatibility: Old paths redirect to new /tests/* paths */}
        <Route path="/psychology" element={<Navigate to="/tests/psychology" replace />} />
        <Route path="/psychology/mbti" element={<Navigate to="/tests/psychology/mbti" replace />} />
        <Route path="/psychology/phq9" element={<Navigate to="/tests/psychology/phq9" replace />} />
        <Route path="/psychology/eq" element={<Navigate to="/tests/psychology/eq" replace />} />
        <Route path="/psychology/happiness" element={<Navigate to="/tests/psychology/happiness" replace />} />
        <Route path="/career" element={<Navigate to="/tests/career" replace />} />
        <Route path="/career/*" element={<LegacyTestsRedirect />} />
        <Route path="/learning" element={<Navigate to="/tests/learning" replace />} />
        <Route path="/learning/vark" element={<Navigate to="/tests/learning/vark" replace />} />
        <Route path="/relationship" element={<Navigate to="/tests/relationship" replace />} />
        <Route path="/relationship/love-language" element={<Navigate to="/tests/relationship/love-language" replace />} />
        <Route path="/relationship/love-style" element={<Navigate to="/tests/relationship/love-style" replace />} />
        <Route path="/relationship/interpersonal" element={<Navigate to="/tests/relationship/interpersonal" replace />} />
        <Route path="/relationship/love_language" element={<Navigate to="/tests/relationship/love-language" replace />} />
        <Route path="/relationship/love_style" element={<Navigate to="/tests/relationship/love-style" replace />} />
        
        {/* Backward compatibility: Old astrology/tarot/numerology paths redirect to new /tests/* paths */}
        <Route path="/astrology" element={<Navigate to="/tests/astrology" replace />} />
        <Route path="/astrology/*" element={<LegacyTestsRedirect />} />
        <Route path="/tarot" element={<Navigate to="/tests/tarot" replace />} />
        <Route path="/tarot/*" element={<LegacyTestsRedirect />} />
        <Route path="/numerology" element={<Navigate to="/tests/numerology" replace />} />
        <Route path="/numerology/*" element={<LegacyTestsRedirect />} />
        
        {/* Backward compatibility: /tests/* -> strip prefix to new module paths (for other legacy paths) */}
        <Route path="/tests/*" element={<LegacyTestsRedirect />} />
        
        {/* 已删除：ResultPages和ComponentShowcase路由 */}
        </Routes>
        
        {/* Google Analytics */}
        <GoogleAnalytics />
        
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