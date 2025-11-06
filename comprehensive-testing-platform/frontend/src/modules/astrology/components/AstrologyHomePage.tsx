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
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { buildAbsoluteUrl } from '@/config/seo';
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

  // SEO配置
  const canonical = buildAbsoluteUrl('/tests/astrology');
  const seoConfig = useSEO({
    testType: 'astrology',
    testId: 'home',
    title: 'Free AI Astrology Readings | Daily Horoscope & Compatibility Insights',
    description: 'Access free AI-guided astrology readings for fortunes, compatibility, and birth charts. Get instant guidance for your mood, relationships, and intentions.',
    keywords: [],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free AI Astrology Readings | Daily Horoscope & Compatibility Insights',
      ogDescription: 'Access free AI-guided astrology readings for fortunes, compatibility, and birth charts. Get instant guidance for your mood, relationships, and intentions.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Free AI Astrology Readings',
      description: 'Free AI-guided astrology readings for fortunes, compatibility, and birth charts with instant guidance and no signup.',
      url: canonical,
      inLanguage: 'en-US',
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
            name: 'Zodiac Fortune Forecast',
            description: 'Choose a timeframe to receive a personalized horoscope with mood cues and action prompts.'
          },
          {
            '@type': 'Service',
            name: 'Zodiac Compatibility',
            description: 'Compare two zodiac signs for love, friendship, and teamwork chemistry insights.'
          },
          {
            '@type': 'Service',
            name: 'Birth Chart Analysis',
            description: 'AI-assisted natal chart storytelling with planet, house, and life theme highlights.'
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
      description: 'Pick a timeframe and receive a tailored horoscope with emotional cues, practical prompts, and a share-ready highlight.',
      icon: '🌟',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/fortune',
      tags: ['Daily Boost', 'Weekly Flow', 'Monthly Focus'],
      ctaLabel: 'Generate Fortune'
    },
    {
      id: 'compatibility',
      name: 'Zodiac Compatibility',
      description: 'Compare two signs to reveal chemistry for love, friendship, and teamwork, complete with conversational cues.',
      icon: '💕',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/compatibility',
      tags: ['Love Insight', 'Friendship Harmony', 'Team Dynamics'],
      ctaLabel: 'Check Compatibility'
    },
    {
      id: 'birth_chart',
      name: 'Birth Chart Analysis',
      description: 'Unlock an AI-assisted natal story covering planets, houses, and life themes with reflection prompts.',
      icon: '🌌',
      color: 'from-[#0B132B] to-[#5F0F40]',
      path: '/tests/astrology/birth-chart',
      tags: ['Life Blueprint', 'Planet Highlights', 'Growth Paths'],
      ctaLabel: 'Decode Birth Chart'
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
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Discover Your Daily Cosmic Story
            </h1>
            <p className="text-base text-gray-200">Instant, AI-guided astrology readings shaped for your current mood and moments.</p>
            <p className="text-sm text-gray-300">Free experience • No signup • Share-ready highlights</p>
          </div>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
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
                {feature.ctaLabel}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 使用说明 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
        <Card className="bg-white p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Pick Your Reading</h3>
              <p className="text-gray-700 text-sm">
                Select the experience that fits your intention—boost your vibe, explore chemistry, or decode your natal story.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Share Quick Details</h3>
              <p className="text-gray-700 text-sm">
                Enter the signs or birth data needed so the AI can shape a story that relates directly to you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Enjoy & Share</h3>
              <p className="text-gray-700 text-sm">
                Browse your narrative, capture the highlight you love most, and share it with someone who will smile.
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
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Important Notice</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              These readings provide inspiration and reflection only. For medical, legal, or financial matters, please consult licensed professionals and use your judgment.
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