/**
 * Relationship Module Homepage Component
 * Provides selection and introduction for three test types
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, FAQ } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { TestType, RelationshipTestType } from '../types';
import { RelationshipTestContainer } from './RelationshipTestContainer';
import { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { buildAbsoluteUrl } from '@/config/seo';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';

export interface RelationshipHomePageProps extends BaseComponentProps {
  // eslint-disable-next-line no-unused-vars
  onTestSelect?: (testType: RelationshipTestType) => void;
}

export const RelationshipHomePage: React.FC<RelationshipHomePageProps> = ({
  className,
  testId = 'relationship-home-page',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化（当前未使用，保留以备将来需要）
  // const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
  //   pageType: 'module',
  //   moduleType: 'relationship',
  //   customKeywords: ['love language test', 'relationship advice', 'compatibility analysis']
  // });

  // SEO配置
  const canonical = buildAbsoluteUrl('/tests/relationship');
  const seoConfig = useSEO({
    testType: 'relationship',
    testId: 'home',
    title: 'Free Relationship Tests: Love Language, Love Style & Interpersonal Skills | SelfAtlas',
    description: 'Explore free relationship tests to understand your love language, connection style, and interpersonal skills. Get insights to strengthen your relationships.',
    keywords: ['relationship test', 'love language test', 'love style test', 'interpersonal skills', 'relationship assessment', 'compatibility test', 'relationship advice'],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free Relationship Tests: Love Language, Love Style & Interpersonal Skills | SelfAtlas',
      ogDescription: 'Explore free relationship tests to understand your love language, connection style, and interpersonal skills. Get insights to strengthen your relationships.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Relationship Tests',
      description: 'Explore free relationship tests to understand your love language, connection style, and interpersonal skills. Get personalized insights to strengthen your relationships.',
      inLanguage: 'en-US',
      audience: {
        '@type': 'Audience',
        audienceType: 'Relationship explorers'
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
            name: 'Love Language Test',
            description: 'Discover how you prefer to give and receive love in relationships through comprehensive assessment and personalized insights.'
          },
          {
            '@type': 'Test',
            name: 'Love Style Assessment',
            description: 'Understand your unique approach to romantic relationships and emotional connections for better partnership compatibility.'
          },
          {
            '@type': 'Test',
            name: 'Interpersonal Skills Test',
            description: 'Evaluate and improve your social communication skills and relationship dynamics for stronger personal connections.'
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
        moduleId: 'relationship',
        moduleName: 'Relationships & Communication',
        moduleType: 'test_module'
      }
    });
  }, []);

  const testTypes = [
    {
      type: TestType.LOVE_LANGUAGE,
      name: 'Love Language Test',
      description: 'Discover how you prefer to give and receive love in relationships through comprehensive assessment and personalized insights.',
      icon: '💝',
      color: 'from-pink-500 to-rose-500',
      basis: 'Chapman Theory',
      tags: ['Chapman Theory', 'Love Communication'],
      duration: '~10 min',
      insights: 'AI-guided insights'
    },
    {
      type: TestType.LOVE_STYLE,
      name: 'Love Style Assessment',
      description: 'Understand your unique approach to romantic relationships and emotional connections for better partnership compatibility.',
      icon: '💕',
      color: 'from-pink-500 to-rose-500',
      basis: 'Lee Theory',
      tags: ['Lee Theory', 'Romantic Patterns'],
      duration: '~12 min',
      insights: 'AI-guided insights'
    },
    {
      type: TestType.INTERPERSONAL,
      name: 'Interpersonal Skills Test',
      description: 'Evaluate and improve your social communication skills and relationship dynamics for stronger personal connections.',
      icon: '🤝',
      color: 'from-pink-500 to-rose-500',
      basis: 'Social Psychology',
      tags: ['Social Psychology', 'Communication Skills'],
      duration: '~15 min',
      insights: 'AI-guided insights'
    }
  ];

  const handleTestSelect = (testType: RelationshipTestType) => {
    // 记录测试卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: testType,
        testName: testTypes.find(t => t.type === testType)?.name || 'Unknown',
        moduleId: 'relationship',
        location: 'module_homepage'
      }
    });
    
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/tests/relationship/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <RelationshipTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/relationship')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-900 mb-3">
            Understand Your Relationship Strengths
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-pink-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-pink-800 max-w-3xl">
          Explore evidence-based assessments to uncover your love language, connection patterns, and interpersonal strengths for deeper, more meaningful relationships.
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
          <Card key={test.type} className="border border-pink-200 hover:transition-all duration-300 relative flex flex-col">
            {/* Content Area */}
            <div className="p-4 text-center flex flex-col flex-grow">
              <div className="text-3xl mb-3">{test.icon}</div>
              <h3 className="text-base font-bold text-pink-900 mb-3">{test.name}</h3>
              <p className="text-xs text-pink-800 leading-relaxed mb-4 flex-grow">{test.description}</p>
              
              {/* Test Details: Free | Duration | Insights */}
              <div className="text-xs text-gray-600 mb-3">
                <span className="font-semibold text-pink-600">Free</span>
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
                className="w-full py-2 text-sm bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold rounded-lg transition-all duration-300 mb-2"
              >
                Start Free Test
              </Button>
              
              {/* Learn more link - Centered */}
              <a 
                href={`/tests/relationship/${test.type}`}
                className="text-xs text-pink-600 hover:text-pink-800 underline"
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
        <h2 className="text-2xl font-bold text-pink-900 mb-4">Test Instructions</h2>
        <Card className="p-6 border border-pink-200">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Honest Answers</h3>
              <p className="text-pink-800 text-sm">
                Answer honestly based on your true thoughts and feelings. There are no right or wrong answers - authenticity leads to better insights.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Time Management</h3>
              <p className="text-pink-800 text-sm">
                You can pause anytime. Most tests take 10-15 minutes. We recommend completing in a quiet environment for best results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Privacy Protection</h3>
              <p className="text-pink-800 text-sm">
                Your responses are kept confidential. We never sell your data. See our Privacy Policy for details.
              </p>
            </div>
          </div>
          {/* Tip Section */}
          <div className="mt-6 pt-6 border-t border-pink-200">
            <p className="text-sm text-gray-600 italic">
              <span className="font-semibold text-gray-700">Tip:</span> Results are best interpreted over time. Consider retaking after 2–4 weeks to track changes.
            </p>
          </div>
        </Card>
      </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.relationship}
          titleColor="text-pink-900"
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
                These relationship tests are for educational purposes and self-reflection only. They are not a professional relationship assessment and cannot replace professional relationship counseling or therapy.
              </p>
              <p>
                If you're experiencing significant relationship challenges or need professional guidance, please seek help from a qualified relationship counselor or therapist. Seeking help is a sign of strength, and you are not alone.
              </p>
              <p className="font-semibold">
                Note: For educational and self-reflection purposes only — not a professional assessment. If you need relationship guidance, seek professional help.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 内部链接优化 */}
      <ContextualLinks 
        context="module" 
        moduleType="relationship" 
        className="max-w-6xl mx-auto px-4 py-8" 
      />

    </RelationshipTestContainer>
    </>
  );
};
