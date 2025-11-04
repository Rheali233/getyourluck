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
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
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

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'relationship',
    customKeywords: ['love language test', 'relationship advice', 'compatibility analysis']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'relationship',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Relationship Tests Collection',
      description: 'A comprehensive collection of relationship assessment tests to help you understand and improve your relationships',
      provider: {
        '@type': 'Organization',
        name: 'Comprehensive Testing Platform',
        url: 'https://selfatlas.com'
      },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'Test',
            name: 'Love Language Test',
            description: 'Discover how you prefer to give and receive love in relationships'
          },
          {
            '@type': 'Test',
            name: 'Love Style Assessment',
            description: 'Understand your unique approach to romantic relationships'
          },
          {
            '@type': 'Test',
            name: 'Interpersonal Skills Test',
            description: 'Evaluate your communication and social interaction abilities'
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
      tags: ['Chapman Theory', 'Love Communication', 'Relationship Dynamics', 'Emotional Intelligence']
    },
    {
      type: TestType.LOVE_STYLE,
      name: 'Love Style Assessment',
      description: 'Understand your unique approach to romantic relationships and emotional connections for better partnership compatibility.',
      icon: '💕',
      color: 'from-pink-500 to-rose-500',
      basis: 'Lee Theory',
      tags: ['Lee Theory', 'Romantic Patterns', 'Attachment Styles', 'Love Compatibility']
    },
    {
      type: TestType.INTERPERSONAL,
      name: 'Interpersonal Skills Test',
      description: 'Evaluate and improve your social communication skills and relationship dynamics for stronger personal connections.',
      icon: '🤝',
      color: 'from-pink-500 to-rose-500',
      basis: 'Social Psychology',
      tags: ['Social Psychology', 'Communication Skills', 'Social Intelligence', 'Relationship Building']
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
            Relationship Testing Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-pink-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-pink-800 max-w-3xl">
          Professional relationship assessment tools to help you understand your love language, 
          relationship style, and interpersonal skills for stronger connections
        </p>
      </div>

      {/* Test Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testTypes.map((test) => (
          <Card key={test.type} className="bg-white border border-pink-200 hover:transition-all duration-300 relative h-[360px]">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[260px] flex flex-col justify-start">
              <div className="text-3xl mb-3">{test.icon}</div>
              <h3 className="text-base font-bold text-pink-900 mb-3">{test.name}</h3>
              <p className="text-xs text-pink-800 leading-relaxed mb-4 flex-grow">{test.description}</p>
              
              {/* Test Information Tags - Only theoretical basis tags */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-pink-50 text-pink-700 rounded-full font-semibold border border-pink-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Start Test Button - Absolutely positioned at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button
                onClick={() => handleTestSelect(test.type)}
                className="w-full py-2 text-sm bg-gradient-to-r from-pink-600 to-rose-500 hover:text-white font-bold rounded-lg transition-all duration-300"
              >
                Start Test
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-pink-900 mb-4">Test Instructions</h2>
        <Card className="p-6 border border-pink-200">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💖</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Honest Reflection</h3>
              <p className="text-pink-800 text-sm">
                Answer based on your true feelings and experiences in relationships. 
                There are no right or wrong answers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Take Your Time</h3>
              <p className="text-pink-800 text-sm">
                You can pause during the test. We recommend completing it in a quiet environment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-pink-900 mb-3">Privacy Protection</h3>
              <p className="text-pink-800 text-sm">
                All test data is processed anonymously with strict privacy protection.
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.relationship}
          titleColor="text-pink-900"
        />

      {/* Important Notice */}
      <Card className="p-6 border border-pink-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-pink-900 mb-2">Important Notice</h3>
            <p className="text-pink-800 text-sm leading-relaxed">
              The relationship tests provided on this platform are for self-understanding and personal growth purposes only. 
              They cannot replace professional relationship counseling or therapy. 
              If you're experiencing significant relationship challenges, we recommend consulting a qualified relationship counselor or therapist. 
              Remember, seeking help is a sign of strength, and healthy relationships are built on open communication and mutual respect.
            </p>
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
