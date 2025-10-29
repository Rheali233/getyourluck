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
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';

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

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'numerology',
    customKeywords: ['bazi analysis', 'chinese zodiac', 'destiny analysis']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'numerology',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Numerology Analysis Services Collection',
      description: 'A comprehensive collection of numerology analysis services including BaZi, Chinese zodiac, name analysis, and ZiWei chart interpretation',
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
      description: 'Analyze your birth chart and five elements for life insight and guidance.',
      icon: '🌙',
      color: 'from-blue-500 to-cyan-500',
      features: ['Birth Chart Analysis', 'Five Elements', 'Personality Traits', 'Destiny Guidance'],
      tags: ['BaZi', 'Five Elements']
    },
    {
      id: 'zodiac' as NumerologyAnalysisType,
      title: 'Chinese Zodiac Fortune',
      description: 'Check your Chinese zodiac fortune and receive period‑based personalized guidance.',
      icon: '🐲',
      color: 'from-purple-500 to-pink-500',
      features: ['Yearly Fortune', 'Monthly Fortune', 'Weekly Fortune', 'Lucky Elements'],
      tags: ['Zodiac', 'Luck Insights']
    },
    {
      id: 'name' as NumerologyAnalysisType,
      title: 'Chinese Name Recommendation',
      description: 'Get personalized Chinese name recommendations with cultural meaning and usage advice.',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
      features: ['Personalized Names', 'Cultural Significance', 'Usage Advice', 'Multiple Options'],
      tags: ['Name Selection', 'Cultural Meaning']
    },
    {
      id: 'ziwei' as NumerologyAnalysisType,
      title: 'ZiWei Analysis',
      description: 'Receive a comprehensive ZiWei chart analysis based on your birth information.',
      icon: '⭐',
      color: 'from-orange-500 to-red-500',
      features: ['ZiWei Chart', 'Palace Analysis', 'Star Positions', 'Life Guidance'],
      tags: ['ZiWei', 'Chart Reading']
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
        testName: analysisTypes.find(a => a.id === analysisType)?.name || 'Unknown',
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
            Numerology Analysis Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-red-900 font-semibold hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl whitespace-nowrap">
          Professional numerology analysis to help you discover your destiny through ancient Chinese wisdom
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
              
              {/* Analysis Information Tags - Only theoretical basis tags */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {analysis.tags?.slice(0,2).map((tag, index) => (
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
                Focus on your question and maintain an open mind. The clearer your intention, the more accurate the analysis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Quiet Environment</h3>
              <p className="text-red-800 text-sm">
                Find a peaceful space where you won't be disturbed. This helps you connect with your inner wisdom.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-red-900 mb-3">Privacy Protection</h3>
              <p className="text-red-800 text-sm">
                All analyses are completely private and secure. Your personal information and questions are protected.
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
              The numerology analyses provided on this platform are for guidance and self-reflection purposes only. 
              They cannot replace professional counseling, medical advice, or financial planning. Numerology 
              is a tool for introspection and should be used as a complement to, not a substitute for, 
              professional guidance. Remember, you have the power to shape your own destiny.
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
