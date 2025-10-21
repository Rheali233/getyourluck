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
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';

export interface CareerHomePageProps extends BaseComponentProps {
  onTestSelect?: (testType: CareerTestType) => void;
}

export const CareerHomePage: React.FC<CareerHomePageProps> = ({
  className,
  testId = 'career-homepage',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'career',
    customKeywords: ['career guidance', 'job assessment', 'professional development']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'career',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Career Tests Collection',
      description: 'A comprehensive collection of career assessment tests to help you discover your ideal career path',
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
            name: 'Holland Career Interest Test',
            description: 'Discover your career interests and find the perfect job match'
          },
          {
            '@type': 'Test',
            name: 'DISC Behavioral Style Assessment',
            description: 'Understand your work style and improve team collaboration'
          },
          {
            '@type': 'Test',
            name: 'Leadership Assessment',
            description: 'Evaluate your leadership potential and development areas'
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
      description: 'Discover your career interests and find the perfect job match through comprehensive assessment and personalized guidance.',
      icon: '💼',
      color: 'from-emerald-500 to-teal-500',
      basis: 'Holland Theory',
      participants: '2.1M+',
      rating: 4.8,
      tags: ['Holland Theory', 'Career Interests', 'Job Matching', 'Professional Development']
    },
    {
      type: CareerTestTypeEnum.DISC,
      name: 'DISC Behavioral Style Assessment',
      description: 'Understand your work style and improve team collaboration through behavioral analysis and communication insights.',
      icon: '📊',
      color: 'from-emerald-500 to-teal-500',
      basis: 'DISC Model',
      participants: '1.8M+',
      rating: 4.7,
      tags: ['DISC Model', 'Work Style', 'Team Dynamics', 'Communication Skills']
    },
    {
      type: CareerTestTypeEnum.LEADERSHIP,
      name: 'Leadership Assessment',
      description: 'Evaluate your leadership potential and development areas through comprehensive evaluation and growth planning.',
      icon: '⭐',
      color: 'from-emerald-500 to-teal-500',
      basis: 'Leadership Theory',
      participants: '1.5M+',
      rating: 4.9,
      tags: ['Leadership Theory', 'Management Skills', 'Team Leadership', 'Executive Development']
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
      navigate(`/career/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <CareerTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/career')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-3">
            Career Testing Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-green-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-green-800 max-w-3xl">
          Professional career assessment tools to help you understand your interests, work style, and leadership potential
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testTypes.map((test) => (
          <Card key={test.type} className="bg-white border border-emerald-200 hover:transition-all duration-300 relative h-[360px]">
            {/* Content Area - Fixed height */}
            <div className="p-4 text-center h-[260px] flex flex-col justify-start">
              <div className="text-3xl mb-3">{test.icon}</div>
              <h3 className="text-base font-bold text-green-900 mb-3">{test.name}</h3>
              <p className="text-xs text-green-800 leading-relaxed mb-4 flex-grow">{test.description}</p>
              
              {/* Test Information Tags - Only theoretical basis tags */}
              <div className="space-y-2 mt-1">
                {/* Multiple Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full font-semibold border border-emerald-200"
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
                className="w-full py-2 text-sm bg-gradient-to-r from-emerald-600 to-teal-500 hover:text-white font-bold rounded-lg transition-all duration-300"
              >
                Start Test
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-900 mb-4">Test Instructions</h2>
        <Card className="p-6 border border-emerald-200">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Honest Answers</h3>
              <p className="text-green-800 text-sm">
                Choose answers based on your true career interests and work experiences. There are no right or wrong answers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Time Management</h3>
              <p className="text-green-800 text-sm">
                You can pause during the test. We recommend completing it in a quiet environment.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-3">Privacy Protection</h3>
              <p className="text-green-800 text-sm">
                All test data is processed anonymously with strict privacy protection.
              </p>
            </div>
          </div>
        </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.career}
          titleColor="text-green-900"
        />

      {/* Important Notice */}
      <Card className="p-6 border border-emerald-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-green-900 mb-2">Important Notice</h3>
            <p className="text-green-800 text-sm leading-relaxed">
              The career tests provided on this platform are for self-understanding and professional development purposes only. 
              They cannot replace professional career counseling or job placement services. 
              If you're experiencing significant career challenges, we recommend consulting a qualified career counselor or professional development coach. 
              Remember, career development is a journey, and seeking guidance is a sign of professional maturity.
            </p>
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
