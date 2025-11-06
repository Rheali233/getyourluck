/**
 * 首页组件
 * 整合所有首页相关的子组件
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestModule } from '@/modules/homepage/types';
import type { BlogArticle as HomepageBlogArticle } from './BlogRecommendations';
import type { PopularTest } from './PopularTests';
import { getLocationHref, getLocationOrigin, resolveAbsoluteUrl } from '@/utils/browserEnv';
import { cn } from '@/utils/classNames';
import { Navigation } from '@/components/ui';
import { Footer } from '@/components/ui';
import { SEOManager } from './SEOManager';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import { ContextualLinks } from '@/components/InternalLinks';
import { HeroSection } from './HeroSection';
import { TestModulesGrid } from './TestModulesGrid';
import { BlogRecommendations } from './BlogRecommendations';
import { PopularTests } from './PopularTests';
import { PlatformFeatures } from './PlatformFeatures';
import { FAQ } from './FAQ';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

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
  const origin = getLocationOrigin();
  const currentUrl = getLocationHref();

  // SEO配置
  const seoTitle = 'Free AI-Powered Self-Discovery Tests | SelfAtlas';
  const seoDescription = 'Free & instant AI-powered MBTI, career, tarot, astrology, and numerology tests. No account required. Evidence-based insights. Start your self-discovery today.';

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
    // 记录CTA点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'cta_click',
      ...base,
      data: {
        name: 'Start Free Test',
        location: 'hero_section',
        target: 'test-modules-section'
      }
    });
    
    // 滚动到测试功能区域
    const testModulesSection = document.getElementById('test-modules-section');
    if (testModulesSection) {
      testModulesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModuleClick = (module: TestModule | PopularTest) => {
    // 记录模块卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'module_card_click',
      ...base,
      data: {
        moduleId: module?.id || 'unknown',
        moduleName: module?.name || 'unknown',
        moduleRoute: module?.route || 'unknown',
        location: 'test_modules_grid'
      }
    });
    
    // 直接导航到模块对应路由
    if (module?.route) {
      navigate(module.route);
      return;
    }
    // 模块点击处理
  };

  const handleArticleClick = (article: HomepageBlogArticle) => {
    // 记录文章点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'article_click',
      ...base,
      data: {
        articleId: article?.id || 'unknown',
        articleTitle: article?.title || 'unknown',
        articleUrl: article?.slug ? `/blog/${article.slug}` : 'unknown',
        location: 'blog_recommendations'
      }
    });
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
          title: seoTitle,
          description: seoDescription,
          ogTitle: seoTitle,
          ogDescription: seoDescription,
          ogImage: resolveAbsoluteUrl('/og-image.jpg'),
        }}
        robots="index,follow"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'SelfAtlas',
            description: 'Free AI-powered self-discovery tests including personality, career, astrology, tarot, and numerology analysis',
            url: origin || '',
            inLanguage: 'en-US',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
            urlTemplate: origin ? `${origin}/search?q={search_term_string}` : '/search?q={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SelfAtlas',
            description: 'A modern online testing platform offering free AI-powered psychology, astrology, tarot, numerology, and career tests',
            url: origin || '',
            logo: resolveAbsoluteUrl('/logo.png'),
            sameAs: [
              resolveAbsoluteUrl('/blog'),
              resolveAbsoluteUrl('/tests')
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Test Modules',
            description: 'A curated list of test modules including psychology, astrology, tarot, career and more',
            url: currentUrl,
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Personality & Mind', url: resolveAbsoluteUrl('/tests/psychology') },
              { '@type': 'ListItem', position: 2, name: 'Astrology & Fortune', url: resolveAbsoluteUrl('/tests/astrology') },
              { '@type': 'ListItem', position: 3, name: 'Tarot & Divination', url: resolveAbsoluteUrl('/tests/tarot') },
              { '@type': 'ListItem', position: 4, name: 'Career & Development', url: resolveAbsoluteUrl('/tests/career') },
              { '@type': 'ListItem', position: 5, name: 'Numerology & Destiny', url: resolveAbsoluteUrl('/tests/numerology') },
              { '@type': 'ListItem', position: 6, name: 'Learning & Intelligence', url: resolveAbsoluteUrl('/tests/learning') },
              { '@type': 'ListItem', position: 7, name: 'Relationships & Communication', url: resolveAbsoluteUrl('/tests/relationship') }
            ]
          },
          // CollectionPage JSON-LD 已添加
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'SelfAtlas Test Center & Modules',
            description: 'Collection of psychology, career, numerology and tarot modules (MBTI, EQ, Holland, BaZi, Chinese Name, Tarot Reading) to start your tests quickly.',
            url: origin || '',
            hasPart: {
              '@type': 'ItemList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'MBTI Personality Test', url: resolveAbsoluteUrl('/tests/psychology/mbti') },
                { '@type': 'ListItem', position: 2, name: 'Emotional Intelligence Test', url: resolveAbsoluteUrl('/tests/psychology/eq') },
                { '@type': 'ListItem', position: 3, name: 'Holland Code Career Interest Assessment', url: resolveAbsoluteUrl('/tests/career') },
                { '@type': 'ListItem', position: 4, name: 'Tarot Reading', url: resolveAbsoluteUrl('/tests/tarot') },
                { '@type': 'ListItem', position: 5, name: 'BaZi Analysis', url: resolveAbsoluteUrl('/tests/numerology/bazi') },
                { '@type': 'ListItem', position: 6, name: 'Chinese Name Recommendation', url: resolveAbsoluteUrl('/tests/numerology/name') }
              ]
            }
          },
          // FAQPage JSON-LD（从默认 FAQ 列表生成）
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            name: 'Homepage FAQ',
            description: 'Answers to common questions about SelfAtlas tests and features',
            url: origin || '',
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
        <PerformanceOptimizer delay={200}>
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