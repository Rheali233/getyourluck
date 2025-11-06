/**
 * Tarot Home Page
 * 塔罗牌首页组件
 * 遵循统一开发标准的组件架构
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import { Card, Button, Breadcrumb, FAQ } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/Alert';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { TarotTestContainer } from './TarotTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';
import { TarotPerformanceMonitor, useTarotPerformance } from './TarotPerformanceMonitor';
import { resolveAbsoluteUrl } from '@/utils/browserEnv';
import { buildAbsoluteUrl } from '@/config/seo';

export const TarotHomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loadTarotCards,
    loadQuestionCategories,
    loadTarotSpreads,
    questionCategories,
    categoriesLoaded,
    error,
    cardsLoaded,
    spreadsLoaded,
    selectCategory,
    setQuestionText,
    questionText
  } = useTarotStore();
  const { isLoading } = useUnifiedTestStore();
  const { startDataLoad, endDataLoad, markFirstCardRender } = useTarotPerformance();

  // SEO配置
  const canonical = resolveAbsoluteUrl('/tests/tarot');
  const seoConfig = useSEO({
    testType: 'tarot',
    testId: 'home',
    title: 'Free AI-Powered Tarot Card Readings: Personalized Guidance & Insights | SelfAtlas',
    description: 'Get free personalized tarot readings with AI-powered interpretations. Pick spreads for love, career, or life guidance, or ask a custom question.',
    keywords: [
      'tarot reading',
      'tarot card reading',
      'free tarot',
      'tarot guidance',
      'card spread',
      'divination',
      'tarot insights',
      'ai tarot reading',
      'online tarot spread',
      'ask tarot question'
    ],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free AI-Powered Tarot Card Readings: Personalized Guidance & Insights | SelfAtlas',
      ogDescription: 'Get free personalized tarot readings with AI-powered interpretations. Pick spreads for love, career, or life guidance, or ask a custom question.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Tarot Reading Services',
      description: 'Get free personalized tarot readings with AI-powered card interpretations. Choose from multiple spreads for love, career, and life guidance.',
      inLanguage: 'en-US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Tarot enthusiasts'
      },
      provider: {
        '@type': 'Organization',
        name: 'SelfAtlas',
        url: 'https://selfatlas.net'
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'Service',
            name: 'Tarot Card Reading',
            description: 'Interactive tarot card readings with multiple spread options and detailed interpretations'
          },
          {
            '@type': 'Service',
            name: 'Tarot Spread Recommendation',
            description: 'Get personalized tarot spread recommendations based on your questions and concerns'
          },
          {
            '@type': 'Service',
            name: 'Custom Question Reading',
            description: 'Ask specific questions and receive personalized tarot card guidance'
          }
        ]
      }
    }
  });

  useEffect(() => {
    // 开始性能监控
    startDataLoad();
    
    // 加载基础数据
    if (!cardsLoaded) {
      loadTarotCards().then(() => {
        endDataLoad();
        markFirstCardRender();
      });
    } else {
      endDataLoad();
      markFirstCardRender();
    }
    
    if (!categoriesLoaded) loadQuestionCategories();
    if (!spreadsLoaded) loadTarotSpreads();
    
    // 记录模块访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'module_visit',
      ...base,
      data: {
        moduleId: 'tarot',
        moduleName: 'Tarot & Divination',
        moduleType: 'test_module'
      }
    });
  }, []); // 移除所有依赖项，只在组件挂载时执行一次

  const handleCategorySelect = async (categoryId: string) => {
    // 记录分类选择事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: 'tarot_category',
        testName: questionCategories.find(c => c.id === categoryId)?.name_en || 'Unknown',
        moduleId: 'tarot',
        location: 'module_homepage'
      }
    });
    
    selectCategory(categoryId);
    // 跳转到推荐页面，让用户选择牌型
    navigate('/tests/tarot/recommendation');
  };

  const handleQuickStart = () => {
    selectCategory('general');
    navigate('/tests/tarot/recommendation');
  };

  const handleCustomQuestion = async () => {
    if (!questionText.trim()) {
      handleQuickStart();
      return;
    }

    selectCategory('general');
    navigate('/tests/tarot/recommendation');
  };

  if (isLoading && !cardsLoaded) {
    return <LoadingSpinner message="Loading tarot cards..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <SEOHead config={seoConfig} />
      <TarotTestContainer>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/tarot')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-3">
            Discover Your Path Through Tarot Wisdom
          </h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold transition hover:bg-white/80 ml-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-3xl">
          Explore symbolic insights and intuitive guidance through personalized, AI-powered tarot card readings. Choose a spread or ask your own question to receive instant guidance for your journey.
        </p>
      </div>

      {/* Ask Your Own Question - 胶囊形输入容器（与原型一致） */}
      <div className="mt-18 mb-12">
        <h2 className="text-2xl font-bold text-violet-900 mb-4 max-w-5xl">Ask Your Own Question</h2>
        <div className="max-w-5xl">
          <div className="rounded-2xl bg-white/85 shadow-[0_12px_24px_rgba(0,0,0,0.06)] px-6 py-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold uppercase tracking-wide text-violet-700">Type your question</span>
              <span className="text-sm text-violet-600">Example: "What should I focus on this month to feel more confident?"</span>
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask anything that is on your mind..."
                className="flex-1 h-12 rounded-xl border border-violet-200 bg-white px-4 text-violet-900 placeholder-violet-500 shadow-sm transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <Button
                onClick={handleCustomQuestion}
                disabled={!questionText.trim()}
                className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Reading
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title - Question Categories */}
      <h2 className="text-2xl font-bold text-violet-900 mb-4">Choose Question Categories</h2>

      {/* Question Categories Grid - 三列 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {questionCategories.map((category) => (
          <Card key={category.id} className="bg-white hover:transition-all duration-300 relative h-[360px] border border-violet-200">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[260px] flex flex-col justify-start">
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="text-base font-bold text-violet-900 mb-3">{category.name_en}</h3>
              <p className="text-xs text-violet-800 leading-relaxed mb-4 flex-grow">
                {category.description_en}
              </p>
              
              {/* Test Information Tags - Differentiated by category */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags - Dynamic based on category */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {(() => {
                    // Generate differentiated tags based on category
                    const categoryName = category.name_en.toLowerCase();
                    let tags: string[] = [];
                    
                    if (categoryName.includes('love') || categoryName.includes('relationship')) {
                      tags = ['Relationship Guidance', 'Love Wisdom', 'Emotional Insights'];
                    } else if (categoryName.includes('career') || categoryName.includes('work') || categoryName.includes('finance')) {
                      tags = ['Career Guidance', 'Professional Growth', 'Financial Wisdom'];
                    } else if (categoryName.includes('health') || categoryName.includes('wellness')) {
                      tags = ['Wellness Guidance', 'Health Insights', 'Self-Care Wisdom'];
                    } else if (categoryName.includes('spiritual') || categoryName.includes('spirituality')) {
                      tags = ['Spiritual Guidance', 'Inner Wisdom', 'Soul Insights'];
                    } else {
                      // Default tags for general or other categories
                      tags = ['Tarot Reading', 'Symbolic Guidance', 'Life Wisdom'];
                    }
                    
                    return tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-violet-50 text-violet-700 rounded-full font-semibold border border-violet-200"
                      >
                        {tag}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* Start Reading Button - Absolutely positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button
                onClick={() => handleCategorySelect(category.id)}
                className="w-full py-2 text-sm bg-gradient-to-r from-violet-600 to-indigo-500 hover:text-white font-bold rounded-lg transition-all duration-300"
              >
                Start Reading
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Reading Instructions - 与 Choose Question Categories 同级，单一卡片包裹三列内容 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-violet-900 mb-4">Reading Instructions</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Clear Intentions</h3>
              <p className="text-violet-800 text-sm">
                Focus your question in your mind. The clearer your intention, the more meaningful the cards' guidance will be.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Quiet Environment</h3>
              <p className="text-violet-800 text-sm">
                Find a peaceful moment where you can reflect. This helps you connect with the cards' symbolic messages.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Privacy Protection</h3>
              <p className="text-violet-800 text-sm">
                Your readings are completely private. We never share your questions or interpretations with anyone.
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.tarot}
          titleColor="text-violet-900"
        />

      {/* Important Notice */}
      <Card className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-violet-900 mb-2">Important Notice</h3>
            <p className="text-violet-800 text-sm leading-relaxed">
              The tarot readings provided here are tools for self-reflection and symbolic exploration. 
              They offer perspectives for contemplation but cannot replace professional counseling, 
              medical advice, or financial planning. Use these insights as a starting point for 
              deeper reflection and consider consulting qualified professionals for serious matters.
            </p>
          </div>
        </div>
      </Card>

      {/* 内部链接优化 */}
      <ContextualLinks 
        context="module" 
        moduleType="tarot" 
        className="max-w-6xl mx-auto px-4 py-8" 
      />
    </TarotTestContainer>
    
    {/* 性能监控组件 */}
    <TarotPerformanceMonitor 
      enabled={process.env['NODE_ENV'] === 'development'}
    />
    </>
  );
};
