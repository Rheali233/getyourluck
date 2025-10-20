/**
 * Learning Ability Module Home Page
 * Main landing page for the learning ability module
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { LearningTestContainer } from './LearningTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

export interface LearningAbilityHomePageProps extends BaseComponentProps {
  onTestSelect?: (testType: 'vark') => void;
}

export const LearningAbilityHomePage: React.FC<LearningAbilityHomePageProps> = ({
  className,
  testId = 'learning-ability-homepage',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'learning',
    customKeywords: ['learning assessment', 'cognitive test', 'intelligence evaluation']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'learning',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Learning Ability Tests Collection',
      description: 'A collection of learning ability tests to help you understand your learning style',
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
            name: 'VARK Learning Style Test',
            description: 'Discover your preferred learning style - Visual, Auditory, Reading/Writing, or Kinesthetic'
          },
          
          
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
        moduleId: 'learning',
        moduleName: 'Learning Ability Tests',
        moduleType: 'test_module'
      }
    });
  }, []);

  // Test type information
  const testTypes = [
    {
      type: 'vark',
      title: 'VARK Learning Style Test',
      description: 'Discover your preferred learning style - Visual, Auditory, Reading/Writing, or Kinesthetic',
      duration: '10-15 min',
      questions: 16,
      icon: '🎓',
      color: 'from-cyan-600 to-sky-500',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-300'
    }
  ];

  const handleTestSelect = (testType: 'vark') => {
    // 记录测试卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: testType,
        testName: 'VARK Learning Style Test',
        moduleId: 'learning',
        location: 'module_homepage'
      }
    });
    
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/learning/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <LearningTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/learning')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-3">
            Learning Ability Assessment Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-sky-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-sky-800 max-w-3xl">
          Professional learning ability assessment tools to help you understand your cognitive strengths and optimize your learning potential
        </p>
      </div>
        {/* Test Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {testTypes.map((test) => (
            <Card key={test.type} className="border border-sky-200 hover:transition-all duration-300 relative h-[340px]">
              {/* Content Area - Fixed height */}
              <div className="p-4 text-center h-[240px] flex flex-col justify-start">
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-lg font-bold text-sky-900 mb-3">{test.title}</h3>
                <p className="text-sm text-sky-800 leading-relaxed mb-3">{test.description}</p>
                
                {/* Test Information Tags */}
                <div className="space-y-2">
                  {/* Test Basis */}
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 text-xs bg-sky-50 text-sky-700 rounded-full font-semibold border border-sky-200">
                      Learning Psychology
                    </span>
                  </div>
                  
                  {/* Test Stats */}
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-sky-50 px-2 py-1 rounded-full">
                      <span className="text-sky-700">👥</span>
                      <span className="text-sky-800 font-medium">1.8M+</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-sky-50 px-2 py-1 rounded-full">
                      <span className="text-sky-700">⭐</span>
                      <span className="text-sky-800 font-medium">4.7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Test Button - Absolutely positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button
                  onClick={() => handleTestSelect(test.type as 'vark')}
                  className="w-full py-2 text-sm bg-gradient-to-r from-cyan-600 to-sky-500 hover:text-white font-bold rounded-lg transition-all duration-300"
                >
                  Start Test
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-sky-900 mb-4">Test Instructions</h2>
          <Card className="p-6 border border-sky-200">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-3">Honest Answers</h3>
                <p className="text-sky-800 text-sm">
                  Choose answers based on your true learning preferences and cognitive abilities. There are no right or wrong answers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-3">Time Management</h3>
                <p className="text-sky-800 text-sm">
                  You can pause during the test. We recommend completing it in a quiet environment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-3">Privacy Protection</h3>
                <p className="text-sky-800 text-sm">
                  All test data is processed anonymously with strict privacy protection.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="p-6 border border-sky-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-sky-900 mb-2">Important Notice</h3>
              <p className="text-sky-800 text-sm leading-relaxed">
                The learning ability tests provided on this platform are for self-understanding and educational development purposes only. 
                They cannot replace professional educational assessment or psychological evaluation services. 
                If you're experiencing significant learning challenges, we recommend consulting a qualified educational psychologist or learning specialist. 
                Remember, learning ability development is a journey, and seeking guidance is a sign of educational maturity.
              </p>
            </div>
          </div>
        </Card>

        {/* 内部链接优化 */}
        <ContextualLinks 
          context="module" 
          moduleType="learning" 
          className="max-w-6xl mx-auto px-4 py-8" 
        />

    </LearningTestContainer>
    </>
  );
};
