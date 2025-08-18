/**
 * 首页组件
 * 整合所有首页相关的子组件
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Navigation } from '@/components/ui';
import { Footer } from '@/components/ui';
import { HeroSection } from './HeroSection';
import { TestModulesGrid } from './TestModulesGrid';
import { BlogRecommendations } from './BlogRecommendations';
import { PopularTests } from './PopularTests';
import { PlatformFeatures } from './PlatformFeatures';
import { SearchSection } from './SearchSection';

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
    console.log('Module clicked:', module);
    // 这里可以添加模块点击的逻辑
  };

  const handleArticleClick = (article: any) => {
    console.log('Article clicked:', article);
    // 这里可以添加文章点击的逻辑
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // 这里可以添加搜索逻辑
  };

  return (
    <div
      className={cn("homepage min-h-screen bg-white", className)}
      data-testid={testId}
      {...props}
    >
      {/* 导航栏 */}
      {showNavigation && <Navigation />}

      {/* 主要内容区域 */}
      <main className="pt-16">
        <HeroSection onStartTest={handleStartTest} />
        <div id="test-modules-section">
          <TestModulesGrid onModuleClick={handleModuleClick} />
        </div>
        <PopularTests onTestClick={handleModuleClick} />
        <PlatformFeatures />
        <BlogRecommendations onArticleClick={handleArticleClick} />
        <SearchSection onSearch={handleSearch} />
      </main>

      {/* 页脚 */}
      {showFooter && <Footer />}
    </div>
  );
};

export default Homepage; 