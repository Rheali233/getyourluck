/**
 * Psychology Module Homepage Component
 * Provides selection and introduction for four test types
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, FAQ } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { PsychologyTestType, PsychologyTestTypes } from '../types';
import { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';
import { PsychologyTestContainer } from './PsychologyTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { ContextualLinks } from '@/components/InternalLinks';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { FAQ_CONFIG } from '@/shared/configs/FAQ_CONFIG';


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

  // 关键词优化（当前未使用，保留以备将来需要）
  // const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
  //   pageType: 'module',
  //   moduleType: 'psychology',
  //   customKeywords: ['mental health', 'personality assessment', 'psychological evaluation']
  // });

  // SEO配置
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/tests/psychology`;
  const seoConfig = useSEO({
    testType: 'psychology',
    testId: 'home',
    title: 'Free Psychological Tests: Personality, EQ, PHQ-9 & More | SelfAtlas',
    description: 'Free research-informed psychological assessments to understand your personality, emotional intelligence, and mental wellness. Instant, personalized insights — not a diagnosis.',
    keywords: ['psychological tests', 'personality test', 'MBTI', 'emotional intelligence', 'EQ test', 'PHQ-9', 'depression screening', 'happiness assessment', 'free psychological assessments', 'mental wellness'],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free Psychological Tests: Personality, EQ, PHQ-9 & More | SelfAtlas',
      ogDescription: 'Free research-informed psychological assessments to understand your personality, emotional intelligence, and mental wellness. Instant, personalized insights — not a diagnosis.',
      ogImage: `${typeof window !== 'undefined' ? window.location.origin : ''}/og-image.jpg`,
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Psychological Tests',
      description: 'Free research-informed psychological assessments to understand your personality, emotional intelligence, and mental wellness. Instant, personalized insights — not a diagnosis.',
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
            name: 'MBTI Personality Test',
            description: 'Discover your personality type using a popular framework. Get practical insights tailored to your preferences in about 10 minutes.'
          },
          {
            '@type': 'Test',
            name: 'Emotional Intelligence Test',
            description: 'Assess your emotional awareness and social skills with research-informed insights. Get practical tips to improve your relationships.'
          },
          {
            '@type': 'Test',
            name: 'PHQ-9 Depression Screening',
            description: 'Research-informed PHQ-9 self-screening questionnaire. For educational purposes only — not a diagnosis. If you\'re experiencing distress, please seek professional help.'
          },
          {
            '@type': 'Test',
            name: 'Happiness Index Assessment',
            description: 'Evaluate your happiness and life satisfaction using research-informed positive psychology models. Discover what contributes to your well-being.'
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
      description: 'Discover your personality type using a popular framework. Get practical insights tailored to your preferences in about 10 minutes.',
      icon: '🧠',
      color: 'from-blue-500 to-indigo-500',
      basis: 'Jungian Theory',
      tags: ['Popular Model', 'Personality Assessment'],
      duration: '~10 min',
      insights: 'AI insights'
    },
    {
      type: PsychologyTestTypes.PHQ9,
      name: 'PHQ-9 Depression Screening',
      description: 'Research-informed PHQ-9 self-screening questionnaire. For educational purposes only — not a diagnosis. If you\'re experiencing distress, please seek professional help.',
      icon: '💙',
      color: 'from-blue-500 to-indigo-500',
      basis: 'DSM-5 Standard',
      tags: ['PHQ-9 items', 'Self-screening'],
      duration: '~5 min',
      insights: 'Automated scoring'
    },
    {
      type: PsychologyTestTypes.EQ,
      name: 'Emotional Intelligence Test',
      description: 'Assess your emotional awareness and social skills with research-informed insights. Get practical tips to improve your relationships.',
      icon: '❤️',
      color: 'from-blue-500 to-indigo-500',
      basis: 'Goleman Model',
      tags: ['Goleman-inspired', 'Emotional Skills'],
      duration: '~15 min',
      insights: 'AI insights'
    },
    {
      type: PsychologyTestTypes.HAPPINESS,
      name: 'Happiness Index Assessment',
      description: 'Evaluate your happiness and life satisfaction using research-informed positive psychology models. Discover what contributes to your well-being.',
      icon: '😊',
      color: 'from-blue-500 to-indigo-500',
      basis: 'Positive Psychology',
      tags: ['Positive Psychology', 'PERMA Model'],
      duration: '~10 min',
      insights: 'AI insights'
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
      navigate(`/tests/psychology/${testType}`);
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <PsychologyTestContainer className={className || ''} data-testid={testId} {...props}>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/psychology')} />
      
      {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Psychological Tests
          </h1>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-blue-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            back to home
          </button>
        </div>
        <p className="text-xl text-blue-800 max-w-3xl">
          Free research-informed psychological assessments to understand your personality, emotional intelligence, and mental wellness. Instant, personalized insights — not a diagnosis.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {testTypes.map((test) => (
            <Card key={test.type} className="border border-blue-200 hover:transition-all duration-300 relative flex flex-col">
              {/* Content Area */}
              <div className="p-4 text-center flex flex-col flex-grow">
                <div className="text-3xl mb-3">{test.icon}</div>
                <h3 className="text-base font-bold text-blue-900 mb-3">{test.name}</h3>
                <p className="text-xs text-blue-800 leading-relaxed mb-4 flex-grow">{test.description}</p>
                
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
                  className="w-full py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-bold rounded-lg transition-all duration-300 mb-2"
                >
                  Start Free Test
                </Button>
                
                {/* Learn more link - Centered */}
                <a 
                  href={`/tests/psychology/${test.type}`}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
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
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Test Instructions</h2>
          <Card className="p-6 border border-blue-200">
            <div className="grid md:grid-cols-3 gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Honest Answers</h3>
                <p className="text-blue-800 text-sm">
                  Answer honestly based on your true thoughts and feelings. There are no right or wrong answers - authenticity leads to better insights.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Time Management</h3>
                <p className="text-blue-800 text-sm">
                  You can pause anytime. Most tests take 10-15 minutes. We recommend completing in a quiet environment for best results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-3">Privacy Protection</h3>
                <p className="text-blue-800 text-sm">
                  Your responses are kept confidential. We never sell your data. See our Privacy Policy for details.
                </p>
              </div>
            </div>
            {/* Tip Section */}
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm text-gray-600 italic">
                <span className="font-semibold text-gray-700">Tip:</span> Results are best interpreted over time. Consider retaking after 2–4 weeks to track changes.
              </p>
            </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <FAQ 
          items={FAQ_CONFIG.psychology}
          titleColor="text-blue-900"
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
                  These psychological tests are for educational purposes and self-reflection only. They are not a medical or psychological diagnosis and cannot replace professional counseling or medical treatment.
                </p>
                <p>
                  If you're experiencing persistent distress or mental health concerns, please seek help from a qualified mental health professional or doctor. Seeking help is a sign of strength, and you are not alone.
                </p>
                <p className="font-semibold">
                  Note: For educational and self-reflection purposes only — not a diagnosis. If in crisis, seek professional help.
                </p>
              </div>
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
