/**
 * Fortune Test Page Component
 * 运势查询页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, FeedbackFloatingWidget, Breadcrumb } from '@/components/ui';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useAstrologyStore } from '../stores/useAstrologyStore';
import { ZODIAC_SIGNS } from '../data/zodiac-signs';
import { cn } from '@/utils/classNames';
import { AstrologyTestContainer } from './AstrologyTestContainer';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';

export interface FortuneTestPageProps extends BaseComponentProps {}

export const FortuneTestPage: React.FC<FortuneTestPageProps> = ({
  className,
  testId = 'fortune-test-page',
  ...props
}) => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    showResults,
    fortuneReading,
    getFortune,
    // submitFeedback,
    // resetAnalysis,
    clearError
  } = useAstrologyStore();

  const [selectedSign, setSelectedSign] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('daily');
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'test',
    testType: 'fortune',
    customKeywords: ['horoscope reading', 'zodiac fortune', 'astrological guidance']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'astrology',
    testId: 'fortune',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Horoscope Reading Service',
      description: 'Personalized horoscope readings for all zodiac signs with daily, weekly, and monthly fortune predictions',
      provider: {
        '@type': 'Organization',
        name: 'Comprehensive Testing Platform',
        url: 'https://selfatlas.com'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      serviceType: 'Astrology Reading',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
      category: 'Astrology Services'
    }
  });

  // Helper function for weekly date range formatting
  const formatWeeklyDateRange = (dateString: string) => {
    const startDate = new Date(dateString + 'T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
    const startDay = startDate.toLocaleDateString('en-US', { day: 'numeric' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
    const endDay = endDate.toLocaleDateString('en-US', { day: 'numeric' });

    if (startMonth === endMonth) {
      return `Week of ${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `Week of ${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // 清除之前的错误
    clearError();
    
    // 记录页面访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'page_view',
      ...base,
      data: { 
        route: '/astrology/fortune', 
        pageType: 'test',
        testType: 'fortune'
      },
    });
  }, [clearError]);

  // 监听loading状态变化，同步显示加载弹窗
  useEffect(() => {
    if (isLoading) {
      setShowLoadingModal(true);
    } else if (showResults || error) {
      setShowLoadingModal(false);
      setIsSubmitting(false);
    }
  }, [isLoading, showResults, error]);

  const timeframes = [
    { id: 'daily', name: 'Daily Fortune', description: 'Today\'s horoscope and guidance' },
    { id: 'weekly', name: 'Weekly Fortune', description: 'This week\'s trends and opportunities' },
    { id: 'monthly', name: 'Monthly Fortune', description: 'This month\'s overview and planning' },
    { id: 'yearly', name: 'Yearly Fortune', description: 'This year\'s major themes and opportunities' }
  ];

  const handleSubmit = async () => {
    if (!selectedSign || isSubmitting) {
      return;
    }

    // 记录测试开始事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_start',
      ...base,
      data: { 
        testType: 'fortune',
        zodiacSign: selectedSign,
        fortuneType: selectedFortuneType
      },
    });

    try {
      // 防止重复提交
      setIsSubmitting(true);
      setShowLoadingModal(true);
      
      // 所有时间范围都使用当日日期
      const today = new Date().toISOString().split('T')[0];
      await getFortune(selectedSign, selectedTimeframe, today);
      
      // 成功后弹窗会自动关闭，页面会跳转到结果页面
    } catch (error) {
      // 错误时关闭弹窗
      setShowLoadingModal(false);
      // } finally {
      setIsSubmitting(false);
    }
  };

  // const handleReset = () => {
  //   resetAnalysis();
  //   setSelectedSign('');
  //   setSelectedTimeframe('daily');
  //   setIsSubmitting(false);
  // };

  // const handleFeedback = async (feedback: 'like' | 'dislike') => {
  //   if (fortuneReading?.sessionId) {
  //     await submitFeedback(fortuneReading.sessionId, feedback);
  //   }
  // };

  // 显示结果
  if (showResults && fortuneReading) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <AstrologyTestContainer className={className} data-testid={testId} {...props}>
        <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
          {/* Main Title and Description + Home button at top-right */}
          <div className="mb-8">
          <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Horoscope Reading
          </h1>
            <button onClick={() => navigate('/astrology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-4xl">
            {ZODIAC_SIGNS.find(s => s.id === fortuneReading.zodiacSign)?.name_en} Fortune for {
              (() => {
                const today = new Date().toISOString().split('T')[0] as string;
                let dateToUse: string = today;
                
                if (fortuneReading.date && 
                    fortuneReading.date !== 'undefined' && 
                    fortuneReading.date !== 'null' &&
                    fortuneReading.date !== '') {
                  dateToUse = String(fortuneReading.date);
                }
                
                try {
                  if (fortuneReading.timeframe === 'daily') {
                    return new Date(dateToUse).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  } else if (fortuneReading.timeframe === 'weekly') {
                    return formatWeeklyDateRange(dateToUse);
                  } else if (fortuneReading.timeframe === 'monthly') {
                    return new Date(dateToUse).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    });
                  } else if (fortuneReading.timeframe === 'yearly') {
                    return new Date(dateToUse).toLocaleDateString('en-US', { 
                      year: 'numeric' 
                    });
                  } else {
                    return new Date(dateToUse).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  }
                } catch (error) {
                  return new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                }
              })()
            }
          </p>
        </div>

        {/* 模块1: Your Horoscope Overview */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Horoscope Overview</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {ZODIAC_SIGNS.find(s => s.id === fortuneReading.zodiacSign)?.name_en} Fortune
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {fortuneReading.overall.description}
              </p>
            </div>
          </div>
        </Card>

        {/* 模块2: Core Life Areas */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Life Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Love */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💕 Love & Relationships</h3>
              <p className="text-gray-700 leading-relaxed">{fortuneReading.love.description}</p>
            </div>

            {/* Career */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💼 Career & Work</h3>
              <p className="text-gray-700 leading-relaxed">{fortuneReading.career.description}</p>
            </div>

            {/* Wealth */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💰 Wealth & Finance</h3>
              <p className="text-gray-700 leading-relaxed">{fortuneReading.wealth.description}</p>
            </div>

            {/* Health (optional) */}
            {fortuneReading.health && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🏥 Health & Wellness</h3>
                <p className="text-gray-700 leading-relaxed">{fortuneReading.health.description}</p>
              </div>
            )}
          </div>
        </Card>

        {/* 模块3: Personal Guidance */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Guidance</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Astrological Advice</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {fortuneReading.advice}
              </p>
            </div>
          </div>
        </Card>

        {/* 模块4: Lucky Elements */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lucky Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lucky Colors */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎨 Lucky Colors</h3>
              <div className="flex flex-wrap gap-2">
                {fortuneReading.luckyElements.colors.map((color, index) => (
                  <span key={index} className="px-3 py-2 bg-[#5F0F40]/10 text-[#5F0F40] border border-[#5F0F40]/30 rounded-full text-sm font-medium">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            {/* Lucky Numbers */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔢 Lucky Numbers</h3>
              <div className="flex flex-wrap gap-2">
                {fortuneReading.luckyElements.numbers.map((number, index) => (
                  <span key={index} className="px-3 py-2 bg-[#5F0F40]/10 text-[#5F0F40] border border-[#5F0F40]/30 rounded-full text-sm font-medium">
                    {number}
                  </span>
                ))}
              </div>
            </div>

            {/* Lucky Directions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">🧭 Lucky Directions</h3>
              <div className="flex flex-wrap gap-2">
                {fortuneReading.luckyElements.directions.map((direction, index) => (
                  <span key={index} className="px-3 py-2 bg-[#5F0F40]/10 text-[#5F0F40] border border-[#5F0F40]/30 rounded-full text-sm font-medium">
                    {direction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
        </div>
        <FeedbackFloatingWidget
          containerSelector="#mainContent"
          testContext={{ testType: 'astrology', testId: 'fortune' }}
        />
        </AstrologyTestContainer>
      </>
    );
  }

  // 显示输入表单
  return (
    <>
      <SEOHead config={seoConfig} />
      <AstrologyTestContainer className={className} data-testid={testId} {...props}>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig('/astrology/fortune')} />
      
      {/* Main Title and Description + Home button at top-right */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Horoscope Reading
          </h1>
          <button onClick={() => navigate('/astrology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl">
          Discover your cosmic guidance and unlock the secrets of the stars
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="bg-white/80 p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      )}

      {/* 选择表单 */}
      <div className="space-y-6">
        {/* 选择时间范围 */}
        <Card className="bg-white/80 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
            selectedTimeframe === timeframe.id
              ? "border-[#5F0F40] bg-gradient-to-r from-[#0B132B]/10 to-[#5F0F40]/10"
              : "border-gray-300 bg-white hover:border-[#5F0F40]/50 hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "font-medium mb-1",
                  selectedTimeframe === timeframe.id ? "text-[#5F0F40]" : "text-gray-900"
                )}>{timeframe.name}</div>
                <div className={cn(
                  "text-sm",
                  selectedTimeframe === timeframe.id ? "text-[#5F0F40]/80" : "text-gray-600"
                )}>{timeframe.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* 选择星座 */}
        <Card className="bg-white/80 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Your Zodiac Sign</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(sign.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-center min-h-[120px] flex flex-col justify-center",
            selectedSign === sign.id
              ? "border-[#5F0F40] bg-gradient-to-r from-[#0B132B]/10 to-[#5F0F40]/10 text-[#5F0F40]"
              : "border-gray-300 bg-white hover:border-[#5F0F40]/50 hover:bg-gray-50"
                )}
              >
                <div className="text-3xl mb-3">{sign.symbol}</div>
                <div className={cn(
                  "font-medium mb-2",
                  selectedSign === sign.id ? "text-[#5F0F40]" : "text-gray-900"
                )}>{sign.name_en}</div>
                <div className={cn(
                  "text-sm",
                  selectedSign === sign.id ? "text-[#5F0F40]/80" : "text-gray-600"
                )}>
                  {(() => {
                    const startMonth = parseInt(sign.date_range.start.split('-')[0] || '1');
                    const startDay = sign.date_range.start.split('-')[1] || '1';
                    const endMonth = parseInt(sign.date_range.end.split('-')[0] || '1');
                    const endDay = sign.date_range.end.split('-')[1] || '1';
                    
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    
                    if (startMonth > endMonth) {
                      // 跨年情况（摩羯座）
                      return `Dec ${startDay} - Jan ${endDay}`;
                    } else {
                      // 同年内
                      return `${monthNames[startMonth - 1]} ${startDay} - ${monthNames[endMonth - 1]} ${endDay}`;
                    }
                  })()}
                </div>
              </button>
            ))}
          </div>
        </Card>


        {/* 提交按钮 */}
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={!selectedSign || isLoading || isSubmitting}
            className={cn(
              "px-8 py-3 text-lg bg-gradient-to-r from-[#0B132B] to-[#5F0F40] text-gray-100 rounded-xl font-semibold",
              "hover:from-[#1C2541] hover:to-[#5F0F40] transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-100 mr-2"></div>
                Generating Reading...
              </div>
            ) : (
              'Get My Fortune'
            )}
          </Button>
        </div>
      </div>

      {/* Loading弹窗 */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0B132B]/95 to-[#5F0F40]/95 backdrop-blur-md rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border border-[#5F0F40]/30">
            <div className="w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Fortune</h3>
            <p className="text-white/90 mb-4">
              Please wait while we analyze the stars and generate your personalized horoscope reading...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </AstrologyTestContainer>
    </>
  );
};