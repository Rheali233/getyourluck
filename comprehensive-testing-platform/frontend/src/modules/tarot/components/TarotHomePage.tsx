/**
 * Tarot Home Page
 * 塔罗牌首页组件
 * 遵循统一开发标准的组件架构
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import { Card, Button, Breadcrumb } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/Alert';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { TarotTestContainer } from './TarotTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

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

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'tarot',
    customKeywords: ['tarot guidance', 'card reading', 'divination']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'tarot',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Tarot Reading Services Collection',
      description: 'A comprehensive collection of tarot reading services including card spreads, personalized readings, and divination guidance',
      provider: {
        '@type': 'Organization',
        name: 'Comprehensive Testing Platform',
        url: 'https://selfatlas.com'
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
    // 加载基础数据
    if (!cardsLoaded) loadTarotCards();
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
  }, [cardsLoaded, categoriesLoaded, spreadsLoaded, loadTarotCards, loadQuestionCategories, loadTarotSpreads]);

  const handleCategorySelect = async (categoryId: string) => {
    // 记录分类选择事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: 'tarot_category',
        testName: questionCategories.find(c => c.id === categoryId)?.name || 'Unknown',
        moduleId: 'tarot',
        location: 'module_homepage'
      }
    });
    
    selectCategory(categoryId);
    // 跳转到推荐页面，让用户选择牌型
    navigate('/tarot/recommendation');
  };

  const handleCustomQuestion = async () => {
    if (questionText.trim()) {
      // 设置默认分类为 general，然后跳转到推荐页面
      selectCategory('general');
      navigate('/tarot/recommendation');
    } else {
      // 如果没有输入，也设置默认分类
      selectCategory('general');
      navigate('/tarot/recommendation');
    }
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
        <Breadcrumb items={getBreadcrumbConfig('/tarot')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-3">
            Tarot Reading Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-3xl whitespace-nowrap">
          Professional tarot card readings to help you gain insights and guidance for your life journey
        </p>
      </div>

      {/* Ask Your Own Question - 胶囊形输入容器（与原型一致） */}
      <div className="mt-18 mb-12">
        <h2 className="text-2xl font-bold text-violet-900 mb-4 max-w-5xl">Ask Your Own Question</h2>
        <div className="max-w-5xl">
          <div className="rounded-2xl bg-white/80 shadow-[0_12px_24px_rgba(0,0,0,0.08)] px-4 py-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="What would you like to know about your future?"
                className="flex-1 h-12 px-4 rounded-xl bg-white/0 text-violet-900 placeholder-violet-700 focus:outline-none focus:ring-0"
              />
              <Button
                onClick={handleCustomQuestion}
                disabled={!questionText.trim()}
                className="h-12 px-5 bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <Card key={category.id} className="hover:transition-all duration-300 relative h-[340px]">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[240px] flex flex-col justify-start">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">{category.name_en}</h3>
              <p className="text-sm text-violet-800 leading-relaxed mb-3">
                {category.description_en}
              </p>
              
              {/* Test Information Tags */}
              <div className="space-y-2">
                {/* Test Basis */}
                <div className="flex items-center justify-center">
                  <span className="px-3 py-1 text-xs bg-violet-50 text-violet-700 rounded-full font-semibold border border-violet-300">
                    {category.name_en.split(' ')[0]} Focus
                  </span>
                </div>
                
                {/* Test Stats */}
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 bg-violet-50 px-2 py-1 rounded-full">
                    <span className="text-violet-700">👥</span>
                    <span className="text-violet-800 font-medium">
                      {category.id === 'love' ? '850K+' :
                       category.id === 'career' ? '720K+' :
                       category.id === 'finance' ? '650K+' :
                       category.id === 'health' ? '580K+' :
                       category.id === 'spiritual' ? '920K+' : '1.2M+'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 bg-violet-50 px-2 py-1 rounded-full">
                    <span className="text-violet-700">⭐</span>
                    <span className="text-violet-800 font-medium">
                      {category.id === 'love' ? '4.9' :
                       category.id === 'career' ? '4.6' :
                       category.id === 'finance' ? '4.7' :
                       category.id === 'health' ? '4.8' :
                       category.id === 'spiritual' ? '4.9' : '4.8'}
                    </span>
                  </div>
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
                Focus on your question and maintain an open mind. The clearer your intention, the more accurate the reading.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Quiet Environment</h3>
              <p className="text-violet-800 text-sm">
                Find a peaceful space where you won't be disturbed. This helps you connect with your inner wisdom.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Privacy Protection</h3>
              <p className="text-violet-800 text-sm">
                All readings are completely private and secure. Your personal information and questions are protected.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Important Notice */}
      <Card className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-violet-900 mb-2">Important Notice</h3>
            <p className="text-violet-800 text-sm leading-relaxed">
              The tarot readings provided on this platform are for guidance and self-reflection purposes only. 
              They cannot replace professional counseling, medical advice, or financial planning. Tarot cards 
              are tools for introspection and should be used as a complement to, not a substitute for, 
              professional guidance. Remember, you have the power to shape your own destiny.
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
    </>
  );
};
