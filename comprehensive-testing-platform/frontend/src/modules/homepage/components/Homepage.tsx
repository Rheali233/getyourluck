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
import { SEOManager } from './SEOManager';
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

  const handleArticleClick = (_article: any) => {
    // 可以在这里添加文章点击的统计或分析逻辑
    // // 引用以避免未使用变量的 ESLint 报错
    void _article;
  };

  

  // 处理滚动到指定区域
  // const handleScrollToSection = (sectionId: string) => {
  //   const element = document.getElementById(sectionId);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  return (
    <div
      className={cn("homepage min-h-screen relative", className)}
      data-testid={testId}
      {...props}
    >
      <SEOManager
        pageType="homepage"
        metadata={{
          title: optimizedTitle,
          description: optimizedDescription,
          keywords: baseKeywords.join(', '),
          ogTitle: optimizedTitle,
          ogDescription: optimizedDescription,
          ogImage: `${window.location.origin}/og-image.jpg`,
        }}
        robots="index,follow"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Comprehensive Testing Platform',
            description: 'Personality, psychology, career, astrology and more tests',
            url: window.location.origin
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Comprehensive Testing Platform',
            description: 'A modern online testing platform offering psychology, astrology, tarot and career tests',
            url: window.location.origin
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Test Modules',
            description: 'A curated list of test modules including psychology, astrology, tarot, career and more',
            url: window.location.href,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Personality & Mind', url: `${window.location.origin}/psychology` },
              { '@type': 'ListItem', position: 2, name: 'Astrology & Fortune', url: `${window.location.origin}/astrology` },
              { '@type': 'ListItem', position: 3, name: 'Tarot & Divination', url: `${window.location.origin}/tarot` },
              { '@type': 'ListItem', position: 4, name: 'Career & Development', url: `${window.location.origin}/career` },
              { '@type': 'ListItem', position: 5, name: 'Numerology & Destiny', url: `${window.location.origin}/numerology` },
              { '@type': 'ListItem', position: 6, name: 'Learning & Intelligence', url: `${window.location.origin}/learning` },
              { '@type': 'ListItem', position: 7, name: 'Relationships & Communication', url: `${window.location.origin}/relationship` }
            ]
          },
          // CollectionPage JSON-LD 已添加
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'SelfAtlas Test Center & Modules',
            description: 'Collection of psychology, career, numerology and tarot modules (MBTI, EQ, Holland, BaZi, Chinese Name, Tarot Reading) to start your tests quickly.',
            url: window.location.origin,
            hasPart: {
              '@type': 'ItemList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'MBTI Personality Test', url: `${window.location.origin}/psychology/mbti` },
                { '@type': 'ListItem', position: 2, name: 'Emotional Intelligence Test', url: `${window.location.origin}/psychology/eq` },
                { '@type': 'ListItem', position: 3, name: 'Holland Code Career Interest Assessment', url: `${window.location.origin}/career` },
                { '@type': 'ListItem', position: 4, name: 'Tarot Reading', url: `${window.location.origin}/tarot` },
                { '@type': 'ListItem', position: 5, name: 'BaZi Analysis', url: `${window.location.origin}/numerology/bazi` },
                { '@type': 'ListItem', position: 6, name: 'Chinese Name Recommendation', url: `${window.location.origin}/numerology/name` }
              ]
            }
          },
          // FAQPage JSON-LD（从默认 FAQ 列表生成）
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'Homepage FAQ',
            description: 'Answers to common questions about SelfAtlas tests and features',
            url: window.location.origin,
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What makes SelfAtlas different from other testing platforms?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'SelfAtlas uniquely combines Western psychology (MBTI, Big Five) with Eastern wisdom (Astrology, Tarot, Numerology). Our 7 comprehensive test categories provide multiple perspectives on your personality, career, and relationships.'
                }
              },
              {
                '@type': 'Question',
                name: 'How accurate are the test results?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Psychology tests are based on validated theories like MBTI and Big Five. Traditional modules follow established wisdom systems. Our AI analysis provides personalized insights beyond generic results.'
                }
              },
              {
                '@type': 'Question',
                name: 'How long do the tests take?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Most tests take 5–15 minutes. Psychology tests are typically 10–15 minutes, while Astrology or Tarot take 5–10 minutes.'
                }
              }
            ]
          }
        ]}
      />
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