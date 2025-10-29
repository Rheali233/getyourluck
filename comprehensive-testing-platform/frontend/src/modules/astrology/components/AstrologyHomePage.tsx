/**
 * Astrology Module Homepage Component
 * 星座模块主页，提供三大功能入口
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Breadcrumb, FAQ } from '@/components/ui';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { AstrologyTestContainer } from './AstrologyTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';

export interface AstrologyHomePageProps extends BaseComponentProps {
  // eslint-disable-next-line no-unused-vars
  onFeatureSelect?: (featureId: string) => void;
}

export const AstrologyHomePage: React.FC<AstrologyHomePageProps> = ({
  className,
  testId = 'astrology-home-page',
  onFeatureSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'astrology',
    customKeywords: ['horoscope reading', 'zodiac analysis', 'astrological guidance', 'astrologer bot', 'AI astrologer bot']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'astrology',
    testId: 'home',
    title: `${optimizedTitle} | Astrologer Bot`,
    description: `${optimizedDescription} Experience guided, AI‑assisted readings powered by our astrologer bot for horoscope, compatibility, and birth chart insights.`,
    keywords: ['astrology reading','horoscope reading','zodiac compatibility','birth chart analysis','astrologer bot','AI astrologer bot'],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Astrology Services Collection',
      description: 'A comprehensive collection of astrology services including horoscope readings, compatibility analysis, and birth chart interpretation',
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
            name: 'Zodiac Fortune Forecast',
            description: 'Get your daily, weekly, or monthly horoscope with detailed insights'
          },
          {
            '@type': 'Service',
            name: 'Zodiac Compatibility',
            description: 'Discover compatibility between different zodiac signs for love, friendship, and work'
          },
          {
            '@type': 'Service',
            name: 'Birth Chart Analysis',
            description: 'Comprehensive birth chart interpretation with detailed planetary analysis'
          }
        ]
      }
    }
  });

  // 确保页面滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 记录模块访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'module_visit',
      ...base,
      data: {
        moduleId: 'astrology',
        moduleName: 'Astrology & Fortune',
        moduleType: 'test_module'
      }
    });
  }, []);

  const astrologyFeatures = [
    {
      id: 'fortune',
      name: 'Zodiac Fortune Forecast',
      description: 'Get your daily, weekly, or monthly horoscope with detailed insights and personalized guidance for personal growth.',
      icon: '🌟',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/fortune',
      features: ['Daily Fortune', 'Weekly Trends', 'Monthly Outlook'],
      popularity: '2.1M+ users',
      rating: 4.8,
      estimatedTime: '2-3 min',
      questions: 'Personalized reading',
      basis: 'Traditional Astrology',
      tags: ['Traditional Astrology', 'Daily Guidance', 'Predictive Analysis', 'Personal Growth']
    },
    {
      id: 'compatibility',
      name: 'Zodiac Compatibility',
      description: 'Discover compatibility between different zodiac signs for love, friendship, and work relationships through comprehensive analysis.',
      icon: '💕',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/compatibility',
      features: ['Love Match', 'Friendship Analysis', 'Work Compatibility'],
      popularity: '1.8M+ users',
      rating: 4.7,
      estimatedTime: '3-5 min',
      questions: 'Two zodiac signs',
      basis: 'Synastry Analysis',
      tags: ['Synastry Analysis', 'Relationship Dynamics', 'Love Compatibility', 'Interpersonal Harmony']
    },
    {
      id: 'birth_chart',
      name: 'Birth Chart Analysis',
      description: 'Generate your personal birth chart with comprehensive astrological insights and detailed life analysis based on planetary positions.',
      icon: '🌌',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/birth-chart',
      features: ['Sun/Moon/Rising', 'House Analysis', 'Planetary Aspects'],
      popularity: '950K+ users',
      rating: 4.9,
      estimatedTime: '5-8 min',
      questions: 'Birth details',
      basis: 'Natal Chart',
      tags: ['Natal Chart', 'Planetary Analysis', 'Life Purpose', 'Personality Insights']
    }
  ];

  const handleFeatureSelect = (feature: { id: string; path: string }) => {
    // 记录功能卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: feature.id,
        testName: astrologyFeatures.find(f => f.id === feature.id)?.name || 'Unknown',
        moduleId: 'astrology',
        location: 'module_homepage'
      }
    });
    
    if (onFeatureSelect) {
      onFeatureSelect(feature.id);
    } else {
      // 默认导航到功能页面
      navigate(feature.path);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <AstrologyTestContainer {...props} className={className} data-testid={testId}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/astrology')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Astrology Analysis Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl">
          Explore the stars with our astrologer bot delivering guided, AI‑assisted readings for horoscope, compatibility, and birth charts, combining traditional insight with fast, privacy‑first analysis across modules.
        </p>
      </div>

      {/* 功能选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {astrologyFeatures.map((feature) => (
          <Card key={feature.id} className="bg-white hover:transition-all duration-300 relative h-[360px] border border-gray-200">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[260px] flex flex-col justify-start">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-base font-bold text-gray-900 mb-3">{feature.name}</h3>
              <p className="text-xs text-gray-700 leading-relaxed mb-4 flex-grow">
                {feature.description}
              </p>
              
              {/* Test Information Tags - Only theoretical basis tags */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {feature.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-semibold border border-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Analysis Button - Absolutely positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button
                onClick={() => handleFeatureSelect(feature)}
                className="w-full py-2 text-sm bg-gradient-to-r from-[#0B132B] to-[#5F0F40] hover:from-[#1C2541] hover:to-[#5F0F40] text-white font-bold rounded-lg transition-all duration-300"
              >
                Start Analysis
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 使用说明 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
        <Card className="bg-white p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Choose Your Analysis</h3>
              <p className="text-gray-700 text-sm">
                Select horoscope, compatibility, or birth chart. Our astrologer bot clarifies your intent and recommends a focused starting path.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Provide Information</h3>
              <p className="text-gray-700 text-sm">
                Enter zodiac sign, birth details, or partner data. The astrologer bot validates inputs and adapts prompts for precision.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Get Insights</h3>
              <p className="text-gray-700 text-sm">
                Receive structured insights and next steps. The astrologer bot explains reasoning, timing windows, and optional follow‑up recommendations.
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.astrology}
          titleColor="text-white"
        />

      {/* 重要提示 */}
      <Card className="bg-white p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">🌟</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About Astrological Analysis</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Readings are guidance, not directives; our astrologer bot augments human tradition with transparent reasoning, respectful boundaries, and optional follow‑ups—use insights thoughtfully and consult professionals when necessary.
            </p>
          </div>
        </div>
      </Card>

      {/* 内部链接优化 */}
      <ContextualLinks 
        context="module" 
        moduleType="astrology" 
        className="max-w-6xl mx-auto px-4 py-8" 
      />
    </AstrologyTestContainer>
    </>
  );
};