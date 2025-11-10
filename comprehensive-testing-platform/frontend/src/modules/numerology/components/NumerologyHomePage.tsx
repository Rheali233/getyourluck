/**
 * Numerology Home Page Component
 * 命理分析模块首页
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Breadcrumb, FAQ } from '@/components/ui';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import type { NumerologyAnalysisType } from '../types';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';
import { buildAbsoluteUrl } from '@/config/seo';

interface NumerologyHomePageProps {
  className?: string;
}

export const NumerologyHomePage: React.FC<NumerologyHomePageProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  // 记录模块访问事件
  React.useEffect(() => {
    const base = buildBaseContext();
    trackEvent({
      eventType: 'module_visit',
      ...base,
      data: {
        moduleId: 'numerology',
        moduleName: 'Numerology & Destiny',
        moduleType: 'test_module'
      }
    });
  }, []);

  // SEO配置
  const canonical = buildAbsoluteUrl('/tests/numerology');
  const seoConfig = useSEO({
    testType: 'numerology',
    testId: 'home',
    title: 'Free Numerology Analysis: BaZi, Chinese Zodiac & Name Guidance | SelfAtlas',
    description: 'Discover your destiny through traditional Chinese numerology. Get free BaZi analysis, Chinese zodiac readings, and personalized name guidance.',
    keywords: [
      'numerology analysis',
      'bazi analysis',
      'chinese zodiac',
      'destiny analysis',
      'name numerology',
      'ziwei chart',
      'chinese fortune'
    ],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free Numerology Analysis: BaZi, Chinese Zodiac & Name Guidance | SelfAtlas',
      ogDescription: 'Discover your destiny through traditional Chinese numerology. Get free BaZi analysis, Chinese zodiac readings, and personalized name guidance.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Numerology Analysis Services',
      description: 'Discover your destiny through traditional Chinese numerology. Get free BaZi birth chart analysis, Chinese zodiac fortune readings, and personalized name recommendations.',
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
            name: 'BaZi Analysis',
            description: 'Analyze your birth chart and five elements based on your birth date and time'
          },
          {
            '@type': 'Service',
            name: 'Chinese Zodiac Fortune',
            description: 'Check your Chinese zodiac fortune and get personalized guidance for different periods'
          },
          {
            '@type': 'Service',
            name: 'Chinese Name Recommendation',
            description: 'Get personalized Chinese name recommendations based on your characteristics'
          },
          {
            '@type': 'Service',
            name: 'ZiWei Analysis',
            description: 'Get a comprehensive ZiWei chart analysis based on your birth information'
          }
        ]
      }
    }
  });

  const analysisTypes = [
    {
      id: 'bazi' as NumerologyAnalysisType,
      title: 'BaZi Analysis',
      description: 'Discover your life patterns through the Four Pillars of Destiny. Analyze your birth chart to understand personality traits, life cycles, and five-element balance.',
      icon: '🌙',
      color: 'from-blue-500 to-cyan-500',
      features: ['Birth Chart Analysis', 'Five Elements', 'Personality Traits', 'Destiny Guidance'],
      tags: ['Four Pillars', 'Five Elements', 'Destiny Analysis']
    },
    {
      id: 'zodiac' as NumerologyAnalysisType,
      title: 'Chinese Zodiac Fortune',
      description: 'Explore fortune predictions based on your zodiac animal. Get insights for different time periods and understand how celestial cycles influence your journey.',
      icon: '🐲',
      color: 'from-purple-500 to-pink-500',
      features: ['Yearly Fortune', 'Monthly Fortune', 'Weekly Fortune', 'Lucky Elements'],
      tags: ['Zodiac Fortune', 'Time Periods', 'Celestial Cycles']
    },
    {
      id: 'name' as NumerologyAnalysisType,
      title: 'Chinese Name Recommendation',
      description: 'Receive personalized name suggestions based on numerology principles. Discover names that harmonize with your character and support your life path.',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
      features: ['Personalized Names', 'Cultural Significance', 'Usage Advice', 'Multiple Options'],
      tags: ['Name Numerology']
    },
    {
      id: 'ziwei' as NumerologyAnalysisType,
      title: 'ZiWei Analysis',
      description: 'Uncover deep insights through the ZiWei Doushu chart. Explore palace positions, star influences, and life guidance based on your birth information.',
      icon: '⭐',
      color: 'from-orange-500 to-red-500',
      features: ['ZiWei Chart', 'Palace Analysis', 'Star Positions', 'Life Guidance'],
      tags: ['ZiWei Chart', 'Palace Analysis', 'Star Positions']
    }
  ];

  const handleAnalysisTypeSelect = (analysisType: NumerologyAnalysisType) => {
    // 记录分析类型选择事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: analysisType,
        testName: analysisTypes.find(a => a.id === analysisType)?.title || 'Unknown',
        moduleId: 'numerology',
        location: 'module_homepage'
      }
    });
    
    navigate(`/tests/numerology/${analysisType}`);
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <NumerologyTestContainer className={className}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/numerology')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Unlock Your Destiny Through Numerology
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-red-900 font-semibold hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl">
          Explore traditional Chinese numerology through BaZi birth charts, zodiac fortune readings, and name analysis for reflective entertainment. Discover insights rooted in centuries of cultural wisdom to inspire self-reflection.
        </p>
      </div>

      {/* Analysis Type Cards - 四列对齐 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {analysisTypes.map((analysis) => (
          <Card key={analysis.id} className="bg-white hover:transition-all duration-300 relative h-[360px] border border-gray-200">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[260px] flex flex-col justify-start">
              <div className="text-3xl mb-3">{analysis.icon}</div>
              <h3 className="text-base font-bold text-red-900 mb-3">{analysis.title}</h3>
              <p className="text-xs text-red-800 leading-relaxed mb-4 flex-grow">
                {analysis.description}
              </p>
              
              {/* Analysis Information Tags - Enhanced with more tags */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {analysis.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full font-semibold border border-red-200"
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
                onClick={() => handleAnalysisTypeSelect(analysis.id)}
                className="w-full py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300"
              >
                Start Analysis
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Analysis Instructions - 与 Choose Analysis Types 同级，单一卡片包裹三列内容 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Analysis Instructions</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Clear Intentions</h3>
              <p className="text-red-800 text-sm">
                Focus on what you want to understand about your life path. Clear intentions help numerology reveal deeper patterns and insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Quiet Environment</h3>
              <p className="text-red-800 text-sm">
                Take a moment in a peaceful setting. This helps you reflect on the ancient wisdom and its relevance to your journey.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Privacy Protection</h3>
              <p className="text-red-800 text-sm">
                Your birth information and analysis results remain completely confidential. We never share your personal details.
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.numerology}
          titleColor="text-white"
        />

      {/* Important Notice */}
      <Card className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-red-900 mb-2">Important Notice</h3>
            <p className="text-red-800 text-sm leading-relaxed">
              Numerology analysis draws from traditional Chinese cultural wisdom spanning centuries. 
              These insights offer symbolic frameworks for self-reflection but cannot replace 
              professional counseling, medical advice, or financial planning. Use these readings 
              as tools for contemplation and consult qualified professionals for important decisions.
            </p>
          </div>
        </div>
      </Card>

      {/* 内部链接优化 */}
      <ContextualLinks 
        context="module" 
        moduleType="numerology" 
        className="max-w-6xl mx-auto px-4 py-8" 
      />
    </NumerologyTestContainer>
    </>
  );
};
