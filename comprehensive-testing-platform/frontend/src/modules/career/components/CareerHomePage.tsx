/**
 * Career Module Home Page
 * Main entry point for career testing module
 * Updated to match Psychology module layout with green theme
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, FAQ } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { CareerTestTypeEnum, CareerTestType } from '../types';
import { CareerTestContainer } from './CareerTestContainer';
import { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { buildAbsoluteUrl } from '@/config/seo';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';

export interface CareerHomePageProps extends BaseComponentProps {
  // eslint-disable-next-line no-unused-vars
  onTestSelect?: (testType: CareerTestType) => void;
}

export const CareerHomePage: React.FC<CareerHomePageProps> = ({
  className,
  testId = 'career-homepage',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化（当前未使用，保留以备将来需要）
  // const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
  //   pageType: 'module',
  //   moduleType: 'career',
  //   customKeywords: ['career guidance', 'job assessment', 'professional development']
  // });

  // SEO配置
  const canonical = buildAbsoluteUrl('/tests/career');
  const seoConfig = useSEO({
    testType: 'career',
    testId: 'home',
    title: 'Discover Free Career Tests: Holland, DISC & Leadership | SelfAtlas',
    description: 'Explore science-backed career tests to clarify your interests, work style, and leadership strengths. Access free AI-guided insights to plan your next step.',
    keywords: [
      'career tests',
      'career assessment',
      'Holland test',
      'DISC assessment',
      'leadership test',
      'career potential',
      'ai-guided insights',
      'career planning'
    ],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Discover Free Career Tests: Holland, DISC & Leadership | SelfAtlas',
      ogDescription: 'Explore science-backed career tests to clarify your interests, work style, and leadership strengths. Access free AI-guided insights to plan your next step.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Career Tests',
      description: 'Explore science-backed career tests to clarify your interests, work style, and leadership strengths. Access free AI-guided insights to plan your next step with confidence.',
      inLanguage: 'en-US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Career explorers'
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
            '@type': 'Test',
            name: 'Holland Career Interest Test',
            description: 'Identify the environments where you thrive and receive tailored career directions in minutes.'
          },
          {
            '@type': 'Test',
            name: 'DISC Behavioral Style Assessment',
            description: 'Decode your work style and uncover practical ways to collaborate with any team or manager.'
          },
          {
            '@type': 'Test',
            name: 'Leadership Assessment',
            description: 'Spot your leadership strengths and pinpoint the next skills to grow for bigger opportunities.'
          }
        ]
      }
    }
  });

  // Ensure page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 记录模块访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'module_visit',
      ...base,
      data: {
        moduleId: 'career',
        moduleName: 'Career & Development',
        moduleType: 'test_module'
      }
    });
  }, []);

  // Test type information
  const testTypes = [
    {
      type: CareerTestTypeEnum.HOLLAND,
      name: 'Holland Career Interest Test',
      description: 'Identify the environments where you thrive and receive a tailored list of career directions in minutes.',
      icon: '💼',
      color: 'from-emerald-500 to-teal-500',
      basis: 'Holland Theory',
      tags: ['Holland Theory', 'Career Interests'],
      duration: '~15 min',
      insights: 'AI-guided insights'
    },
    {
      type: CareerTestTypeEnum.DISC,
      name: 'DISC Behavioral Style Assessment',
      description: 'Decode your work style and uncover practical ways to collaborate with any team or manager.',
      icon: '📊',
      color: 'from-emerald-500 to-teal-500',
      basis: 'DISC Model',
      tags: ['DISC Model', 'Work Style'],
      duration: '~10 min',
      insights: 'AI-guided insights'
    },
    {
      type: CareerTestTypeEnum.LEADERSHIP,
      name: 'Leadership Assessment',
      description: 'Spot your leadership strengths and pinpoint the next skills to grow for bigger opportunities.',
      icon: '⭐',
      color: 'from-emerald-500 to-teal-500',
      basis: 'Leadership Theory',
      tags: ['Leadership Theory', 'Management Skills'],
      duration: '~15 min',
      insights: 'AI-guided insights'
    }
  ];

  const handleTestSelect = (testType: CareerTestType) => {
    // 记录测试卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: testType,
        testName: testTypes.find(t => t.type === testType)?.name || 'Unknown',
        moduleId: 'career',
        location: 'module_homepage'
      }
    });
    
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/tests/career/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <CareerTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/career')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3">
            Discover Your Career Potential
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-green-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-green-800 max-w-3xl">
          Explore science-backed assessments to clarify your interests, work style, and leadership strengths so you can move forward with confidence.
        </p>
      </div>

      {/* Progress Recovery Prompts */}
      <div className="mb-6">
        {testTypes.map((test) => (
          <ProgressRecoveryPrompt
            key={test.type}
            testType={test.type}
            className="mb-3"
            onRecover={() => handleTestSelect(test.type)}
          />
        ))}
      </div>

      {/* Test Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {testTypes.map((test) => (
          <Card key={test.type} className="border border-emerald-200 hover:transition-all duration-300 relative flex flex-col">
            {/* Content Area */}
            <div className="p-4 text-center flex flex-col flex-grow">
              <div className="text-3xl mb-3">{test.icon}</div>
              <h3 className="text-base font-bold text-green-900 mb-3">{test.name}</h3>
              <p className="text-xs text-green-800 leading-relaxed mb-4 flex-grow">{test.description}</p>
              
              {/* Test Details: Free | Duration | Insights */}
              <div className="text-xs text-gray-600 mb-3">
                <span className="font-semibold text-green-600">Free</span>
                {test.duration && (
                  <>
                    <span className="mx-1">|</span>
                    <span>{test.duration}</span>
                  </>
                )}
                {test.insights && (
                  <>
                    <span className="mx-1">|</span>
                    <span>{test.insights}</span>
                  </>
                )}
              </div>
              
              {/* Test Information Tags */}
              <div className="space-y-2 mt-1 mb-3">
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium border border-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Free Test Button and Learn more link - Fixed at bottom, centered */}
            <div className="px-4 pb-3 pt-0 flex flex-col items-center">
              <Button
                onClick={() => handleTestSelect(test.type)}
                className="w-full py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold rounded-lg transition-all duration-300 mb-2"
              >
                Start Free Test
              </Button>
              
              {/* Learn more link - Centered */}
              <a 
                href={`/tests/career/${test.type}`}
                className="text-xs text-green-600 hover:text-green-800 underline"
                onClick={(e) => {
                  e.preventDefault();
                  handleTestSelect(test.type);
                }}
              >
                Learn more →
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Test Instructions</h2>
        <Card className="p-6 border border-emerald-200">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Honest Answers</h3>
              <p className="text-green-800 text-sm">
                Respond with your real experiences—there are no right or wrong answers, and authenticity unlocks the sharpest insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Time Management</h3>
              <p className="text-green-800 text-sm">
                Take the assessment at your pace—most finish in 10–15 minutes. Choose a quiet moment so your answers reflect your best thinking.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Privacy Protection</h3>
              <p className="text-green-800 text-sm">
                Your responses stay confidential and are never sold. Review our Privacy Policy anytime for the full story.
              </p>
            </div>
          </div>
          {/* Tip Section */}
          <div className="mt-6 pt-6 border-t border-emerald-200">
            <p className="text-sm text-gray-600 italic">
              <span className="font-semibold text-gray-700">Tip:</span> Revisit in 2–4 weeks to compare progress and notice how your priorities evolve.
            </p>
          </div>
        </Card>
      </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.career}
          titleColor="text-green-900"
        />

      {/* Important Notice */}
      <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Important Notice</h3>
            <div className="text-yellow-800 text-sm leading-relaxed space-y-2">
              <p>
                Use these assessments for self-reflection and exploration—they do not replace professional career counseling or job placement services.
              </p>
              <p>
                If you want tailored guidance, connect with a qualified career counselor or professional development coach. Seeking support is a proactive step toward growth.
              </p>
              <p className="font-semibold">
                Use your results as a launchpad for meaningful career conversations and next steps.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 内部链接优化 */}
      <ContextualLinks 
        context="module" 
        moduleType="career" 
        className="max-w-6xl mx-auto px-4 py-8" 
      />

    </CareerTestContainer>
    </>
  );
};
