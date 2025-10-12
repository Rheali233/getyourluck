/**
 * 首页组件
 * 整合所有首页相关的子组件
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Navigation } from '@/components/ui';
import { Footer } from '@/components/ui';
import { SEOHead } from '@/components/SEOHead';
import { BASE_SEO } from '@/config/seo';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { HeroSection } from './HeroSection';
import { TestModulesGrid } from './TestModulesGrid';
import { BlogRecommendations } from './BlogRecommendations';
import { PopularTests } from './PopularTests';
import { PlatformFeatures } from './PlatformFeatures';
import { FAQ } from './FAQ';

export interface HomepageProps extends BaseComponentProps {
  showNavigation?: boolean;
  showFooter?: boolean;
}

export const Homepage: React.FC<HomepageProps> = ({
  className,
  testId = 'homepage',
  showNavigation = true,
  showFooter = true,
  ...props
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 关键词优化
  const { optimizedTitle, optimizedDescription, baseKeywords } = useKeywordOptimization({
    pageType: 'homepage',
    customKeywords: ['online tests', 'personality analysis', 'career guidance', 'astrology reading']
  });

  // 处理从导航组件传递的滚动状态
  useEffect(() => {
    if (location.state?.scrollTo === 'test-modules-section') {
      const testModulesSection = document.getElementById('test-modules-section');
      if (testModulesSection) {
        // 延迟滚动，确保页面完全加载
        setTimeout(() => {
          testModulesSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // 清除状态，避免重复滚动
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleStartTest = () => {
    // 滚动到测试功能区域
    const testModulesSection = document.getElementById('test-modules-section');
    if (testModulesSection) {
      testModulesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModuleClick = (module: any) => {
    // 直接导航到模块对应路由
    if (module?.route) {
      navigate(module.route);
      return;
    }
    // 模块点击处理
  };

  const handleArticleClick = (article: any) => {
    // 可以在这里添加文章点击的统计或分析逻辑
    console.log('Article clicked:', article.title);
  };

  

  // 处理滚动到指定区域
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={cn("homepage min-h-screen relative", className)}
      data-testid={testId}
      {...props}
    >
      <SEOHead config={{
        ...BASE_SEO,
        title: optimizedTitle,
        description: optimizedDescription,
        keywords: baseKeywords.join(', ')
      }} />
      {/* 浅蓝紫色渐变背景 - 使用CSS而不是复杂的渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      {/* 导航栏 */}
      {showNavigation && <Navigation />}

      {/* 主要内容区域 - 关键内容优先渲染 */}
      <main className="pt-16 relative z-10">
        <HeroSection onStartTest={handleStartTest} />
        <div id="test-modules-section">
          <TestModulesGrid onModuleClick={handleModuleClick} />
        </div>
        {/* 非关键内容延迟加载 */}
        <PerformanceOptimizer delay={300}>
          <PopularTests onTestClick={handleModuleClick} />
        </PerformanceOptimizer>
        <PerformanceOptimizer delay={500}>
          <BlogRecommendations onArticleClick={handleArticleClick} />
        </PerformanceOptimizer>
        <PerformanceOptimizer delay={700}>
          <PlatformFeatures />
        </PerformanceOptimizer>
        <PerformanceOptimizer delay={900}>
          <ContextualLinks context="homepage" className="max-w-6xl mx-auto px-4 py-8" />
        </PerformanceOptimizer>
        <div id="faq-section">
          <FAQ />
        </div>
      </main>

      {/* 页脚 */}
      {showFooter && <div className="relative z-10"><Footer /></div>}
    </div>
  );
};

export default Homepage; 