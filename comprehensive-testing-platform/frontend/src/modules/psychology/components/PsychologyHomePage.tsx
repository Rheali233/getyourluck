/**
 * Psychology Module Homepage Component
 * Provides selection and introduction for four test types
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Card } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { PsychologyTestType, PsychologyTestTypes } from '../types';
import { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';
import { PsychologyTestContainer } from './PsychologyTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';


export interface PsychologyHomePageProps extends BaseComponentProps {
  // eslint-disable-next-line no-unused-vars
  onTestSelect?: (testType: PsychologyTestType) => void;
}

export const PsychologyHomePage: React.FC<PsychologyHomePageProps> = ({
  className,
  testId = 'psychology-home-page',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'module',
    moduleType: 'psychology',
    customKeywords: ['mental health', 'personality assessment', 'psychological evaluation']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'psychology',
    testId: 'home',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Psychology Tests Collection',
      description: 'A comprehensive collection of psychological tests including personality, emotional intelligence, and mental health assessments',
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
            name: 'MBTI Personality Test',
            description: 'Discover your personality type and understand your true self'
          },
          {
            '@type': 'Test',
            name: 'Emotional Intelligence Test',
            description: 'Assess your emotional intelligence and interpersonal skills'
          },
          {
            '@type': 'Test',
            name: 'Depression Screening (PHQ-9)',
            description: 'Professional depression screening based on PHQ-9 criteria'
          },
          {
            '@type': 'Test',
            name: 'Happiness Assessment',
            description: 'Evaluate your happiness levels and life satisfaction'
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
        moduleId: 'psychology',
        moduleName: 'Psychology Tests',
        moduleType: 'test_module'
      }
    });
  }, []);

  const testTypes = [
    {
      type: PsychologyTestTypes.MBTI,
      name: 'MBTI Personality Test',
      description: 'Discover your personality type and understand your true self',
      icon: '🧠',
      color: 'from-blue-500 to-indigo-500',
      duration: '15-20 min',
      questions: '64 questions',
      basis: 'Jungian Theory',
      participants: '2.5M+',
      rating: 4.8
    },
    {
      type: PsychologyTestTypes.PHQ9,
      name: 'PHQ-9 Depression Screening',
      description: 'Professional depression assessment and mental health evaluation',
      icon: '💙',
      color: 'from-blue-500 to-indigo-500',
      duration: '5-10 min',
      questions: '9 questions',
      basis: 'DSM-5 Standard',
      participants: '1.8M+',
      rating: 4.9
    },
    {
      type: PsychologyTestTypes.EQ,
      name: 'Emotional Intelligence Test',
      description: 'Measure your emotional intelligence and social skills',
      icon: '❤️',
      color: 'from-blue-500 to-indigo-500',
      duration: '10-15 min',
      questions: '50 questions',
      basis: 'Goleman Model',
      participants: '1.2M+',
      rating: 4.7
    },
    {
      type: PsychologyTestTypes.HAPPINESS,
      name: 'Happiness Index Assessment',
      description: 'Evaluate your happiness level and life satisfaction',
      icon: '😊',
      color: 'from-blue-500 to-indigo-500',
      duration: '15-20 min',
      questions: '50 questions',
      basis: 'Positive Psychology',
      participants: '980K+',
      rating: 4.6
    }
  ];

  const handleTestSelect = (testType: PsychologyTestType) => {
    // 记录测试卡片点击事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_card_click',
      ...base,
      data: {
        testType: testType,
        testName: testTypes.find(t => t.type === testType)?.name || 'Unknown',
        moduleId: 'psychology',
        location: 'module_homepage'
      }
    });
    
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/psychology/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <PsychologyTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/psychology')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Psychological Testing Center
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-blue-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>
        <p className="text-xl text-blue-800 max-w-3xl">
          Professional psychological assessment tools to help you understand yourself better and achieve personal growth
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testTypes.map((test) => (
            <Card key={test.type} className="border border-blue-200 hover:transition-all duration-300 relative h-[340px]">
              {/* Content Area - Fixed height */}
              <div className="p-4 text-center h-[240px] flex flex-col justify-start">
                <div className="text-4xl mb-4">{test.icon}</div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">{test.name}</h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">{test.description}</p>
                
                {/* Test Information Tags */}
                <div className="space-y-2">
                  {/* Test Basis */}
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-semibold border border-blue-200">
                      {test.basis}
                    </span>
                  </div>
                  
                  {/* Test Stats */}
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                      <span className="text-blue-700">👥</span>
                      <span className="text-blue-800 font-medium">{test.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                      <span className="text-blue-700">⭐</span>
                      <span className="text-blue-800 font-medium">{test.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Test Button - Absolutely positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button
                  onClick={() => handleTestSelect(test.type)}
                  className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-500 hover:text-white font-bold rounded-lg transition-all duration-300"
                >
                  Start Test
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Test Instructions</h2>
          <Card className="p-6 border border-blue-200">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Honest Answers</h3>
                <p className="text-blue-800 text-sm">
                  Choose answers based on your true thoughts and feelings. There are no right or wrong answers.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Time Management</h3>
                <p className="text-blue-800 text-sm">
                  You can pause during the test. We recommend completing it in a quiet environment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Privacy Protection</h3>
                <p className="text-blue-800 text-sm">
                  All test data is processed anonymously with strict privacy protection.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                The psychological tests provided on this platform are for self-understanding and reference purposes only. 
                They cannot replace professional psychological counseling or medical diagnosis. 
                If you experience persistent distress or need professional help, we recommend consulting a mental health expert or doctor. 
                Remember, seeking help is a courageous act, and you are not alone.
              </p>
            </div>
          </div>
        </Card>

        {/* 内部链接优化 */}
        <ContextualLinks 
          context="module" 
          moduleType="psychology" 
          className="max-w-6xl mx-auto px-4 py-8" 
        />

    </PsychologyTestContainer>
    </>
  );
};
