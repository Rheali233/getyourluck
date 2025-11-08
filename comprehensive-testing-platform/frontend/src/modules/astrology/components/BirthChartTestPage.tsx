/**
 * Birth Chart Analysis Page Component
 * 出生星盘分析页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, DateInput, TimeInput, LocationInput, FeedbackFloatingWidget, Breadcrumb, Modal, Input } from '@/components/ui';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useAstrologyStore } from '../stores/useAstrologyStore';
import { cn } from '@/utils/classNames';
import { AstrologyTestContainer } from './AstrologyTestContainer';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { resolveAbsoluteUrl } from '@/utils/browserEnv';

export interface BirthChartTestPageProps extends BaseComponentProps {}

export const BirthChartTestPage: React.FC<BirthChartTestPageProps> = ({
  testId = 'birth-chart-test-page'
}) => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    showResults,
    birthChart: birthChartAnalysis,
    getBirthChart,
    clearError
  } = useAstrologyStore();

  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [birthLocation, setBirthLocation] = useState<string>('');
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  
  // 错误弹窗状态（参照 psychology 模块）
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Failed to get AI analysis results for the birth chart');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const breadcrumbItems = getBreadcrumbConfig('/tests/astrology/birth-chart');

  const canonical = resolveAbsoluteUrl('/tests/astrology/birth-chart', 'https://selfatlas.net');
  const seoConfig = useSEO({
    testType: 'astrology',
    testId: 'birth-chart',
    title: 'Free AI Birth Chart Reading | Personalized Natal Insights',
    description: 'Generate your natal chart instantly with AI-crafted chapters. Discover planet placements, life themes, and reflection cues without any signup.',
    keywords: [],
    customConfig: {
      canonical,
      ogTitle: 'Free AI Birth Chart Reading | Personalized Natal Insights',
      ogDescription: 'Generate your natal chart instantly with AI-crafted chapters. Discover planet placements, life themes, and reflection cues without any signup.',
      ogImage: resolveAbsoluteUrl('/og-image.jpg', 'https://selfatlas.net'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI-Assisted Birth Chart Reading',
      description: 'Instant AI birth chart analysis with personalized narratives for planets, houses, and life themes.',
      url: canonical,
      inLanguage: 'en-US',
      provider: {
        '@type': 'Organization',
        name: 'SelfAtlas',
        url: 'https://selfatlas.net'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      serviceType: 'Astrology Reading',
      availableLanguage: 'English'
    }
  });

  // 同步加载状态
  useEffect(() => {
    if (showResults || error) {
      setShowLoadingModal(false);
    }
  }, [showResults, error]);
  
  // 当有错误且不在 loading 状态时，显示错误弹窗（参照 psychology 模块）
  useEffect(() => {
    if (!error || isLoading) {
      setShowErrorModal(false);
      return;
    }
    
    // 检查是否是 AI 分析错误
    const isAIAnalysisError = (
      error.toLowerCase().includes('ai analysis') ||
      error.toLowerCase().includes('ai service') ||
      error.toLowerCase().includes('analysis failed') ||
      error.toLowerCase().includes('failed to parse') ||
      error.toLowerCase().includes('ai analysis is required') ||
      error.toLowerCase().includes('birth chart analysis failed') ||
      error.toLowerCase().includes('test result analysis failed')
    );
    
    // 如果是 AI 分析错误，显示错误弹窗
    if (isAIAnalysisError || !showResults) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error, isLoading, showResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate || !birthTime || !birthLocation) {
      return;
    }

    // 清除之前的错误
    clearError();
    setShowErrorModal(false);
    
    // 立即显示加载弹窗
    setShowLoadingModal(true);

    try {
      await getBirthChart({
        birthDate,
        birthTime,
        birthLocation
      });
    } catch (error) {
      // Error handling is managed by the store
    }
  };
  
  // 处理重试提交（参照 psychology 模块）
  const handleRetrySubmit = async () => {
    setShowErrorModal(false);
    setShowFeedbackForm(false);
    clearError();
    // 重新提交
    await handleSubmit(new Event('submit') as any);
  };
  
  // 处理反馈提交（参照 psychology 模块）
  const handleSubmitFeedback = async () => {
    if (!feedbackEmail || !feedbackMessage) {
      return;
    }
    
    setIsSubmittingFeedback(true);
    try {
      // 这里可以调用反馈 API
      // await feedbackService.submitFeedback({ email: feedbackEmail, message: feedbackMessage });
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleBack = () => {
    navigate('/tests/astrology');
  };


  if (showResults && birthChartAnalysis) {
    return (
      <>
        <SEOHead config={seoConfig} />
        <AstrologyTestContainer
          testId={testId}
        >
        {/* 面包屑导航 */}
        <Breadcrumb items={breadcrumbItems} />
        <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* 结果页面头部 */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Your Birth Chart Narrative
              </h1>
              <p className="text-base text-gray-200">AI-crafted chapters distilling your planets, houses, and life themes into clear reflections.</p>
            </div>
            <button onClick={handleBack} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Astrology Hub
            </button>
          </div>
          <p className="text-sm text-gray-300">Bookmark the chapters that resonate and revisit them whenever you need perspective.</p>
        </div>

        {/* 模块1: Cosmic Snapshot */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cosmic Snapshot</h2>
          <div className="text-left">
            <p className="text-gray-700 leading-relaxed text-lg">
              {(() => {
                // 优先使用AI返回的综合分析结果
                if (birthChartAnalysis.personalityAnalysis) {
                  return birthChartAnalysis.personalityAnalysis;
                }
                
                // 如果没有综合分析，基于具体星座信息生成个性化概述
                if (birthChartAnalysis.sunSign && birthChartAnalysis.moonSign && birthChartAnalysis.risingSign) {
                  const sunSign = birthChartAnalysis.sunSign;
                  const moonSign = birthChartAnalysis.moonSign;
                  const risingSign = birthChartAnalysis.risingSign;
                  
                  // 基于星座组合生成个性化分析
                  return `Your birth chart shows a fascinating combination of ${sunSign} Sun, ${moonSign} Moon, and ${risingSign} Rising sign. This unique astrological signature creates a distinctive personality profile that influences how you approach life, relationships, and personal growth. Your ${sunSign} Sun provides your core identity and life purpose, while your ${moonSign} Moon shapes your emotional responses and inner needs. The ${risingSign} Rising sign influences how others perceive you and your outward personality expression.`;
                }
                
                // 如果连基本星座信息都没有，显示处理中提示
                return "Your birth chart analysis is being processed. Please wait for the complete analysis results.";
              })()}
            </p>
          </div>
        </Card>

        {/* 模块2: Identity Chapters */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Chapters</h2>
          <div className="text-left mb-6">
              <p className="text-gray-700 text-lg">
                Your fundamental astrological blueprint based on your birth details
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sun Sign */}
            <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">☀️</div>
                <h3 className="text-lg font-semibold text-gray-900">Sun in {birthChartAnalysis.sunSign}</h3>
                <p className="text-gray-600 text-sm">Your core identity and ego expression</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {birthChartAnalysis.corePlanetaryPositions?.sunInterpretation || 
                   `Your Sun in ${birthChartAnalysis.sunSign} represents your core identity and life purpose.`}
                </p>
                {birthChartAnalysis.personalityProfile?.strengths && birthChartAnalysis.personalityProfile.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Strengths:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {birthChartAnalysis.personalityProfile.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-500 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Moon Sign */}
            <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">🌙</div>
                <h3 className="text-lg font-semibold text-gray-900">Moon in {birthChartAnalysis.moonSign}</h3>
                <p className="text-gray-600 text-sm">Your emotional nature and inner self</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {birthChartAnalysis.corePlanetaryPositions?.moonInterpretation || 
                   `Your Moon in ${birthChartAnalysis.moonSign} reveals your emotional needs and inner world.`}
                </p>
                {birthChartAnalysis.lifeGuidance?.personalGrowth && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Emotional Growth:</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {birthChartAnalysis.lifeGuidance.personalGrowth}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rising Sign */}
            <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">⬆️</div>
                <h3 className="text-lg font-semibold text-gray-900">Rising in {birthChartAnalysis.risingSign}</h3>
                <p className="text-gray-600 text-sm">Your outward personality and first impressions</p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {birthChartAnalysis.corePlanetaryPositions?.risingInterpretation || 
                   `Your Rising sign in ${birthChartAnalysis.risingSign} represents your outward personality and first impressions.`}
                </p>
                {birthChartAnalysis.personalityProfile?.challenges && birthChartAnalysis.personalityProfile.challenges.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Growth Areas:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {birthChartAnalysis.personalityProfile.challenges.slice(0, 2).map((challenge: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 模块3: Planet Map */}
        {birthChartAnalysis.planetaryPositions && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Planet Map</h2>
            <div className="text-left mb-6">
              <p className="text-gray-700 text-lg">
                Every planet placement mapped with quick-read interpretations
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(birthChartAnalysis.planetaryPositions).map(([planet, sign]) => (
                <div key={planet} className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3 text-[#1C2541]">
                      {(() => {
                        const planetIcons: Record<string, string> = {
                          sun: '⊙',
                          moon: '☽',
                          mercury: '☿',
                          venus: '♀',
                          mars: '♂',
                          jupiter: '♃',
                          saturn: '♄',
                          uranus: '♅',
                          neptune: '♆',
                          pluto: '♇'
                        };
                        return planetIcons[planet.toLowerCase()] || '○';
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{planet}</h3>
                      <span className="text-sm text-[#1C2541] font-medium">{sign as string}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {(() => {
                      // 优先使用AI个性化解读
                      if (birthChartAnalysis.planetaryInterpretations) {
                        const planetKey = planet.toLowerCase() as keyof typeof birthChartAnalysis.planetaryInterpretations;
                        if (birthChartAnalysis.planetaryInterpretations[planetKey]) {
                          return birthChartAnalysis.planetaryInterpretations[planetKey];
                        }
                      }
                      
                      // 降级到通用描述
                      const planetDescriptions: Record<string, string> = {
                        sun: `Your Sun in ${sign} represents your core identity and life purpose. This placement influences your fundamental personality traits and how you express your authentic self.`,
                        moon: `Your Moon in ${sign} reveals your emotional nature and inner needs. This placement shows how you process feelings and what makes you feel emotionally secure.`,
                        mercury: `Your Mercury in ${sign} influences your communication style and thought processes. This placement affects how you learn, express ideas, and process information.`,
                        venus: `Your Venus in ${sign} governs your approach to love, beauty, and relationships. This placement influences your values, aesthetic preferences, and romantic style.`,
                        mars: `Your Mars in ${sign} represents your energy, drive, and how you take action. This placement influences your assertiveness, passion, and approach to challenges.`,
                        jupiter: `Your Jupiter in ${sign} brings expansion and growth opportunities. This placement influences your beliefs, philosophy, and areas where you naturally excel.`,
                        saturn: `Your Saturn in ${sign} represents lessons, discipline, and structure. This placement shows areas where you need to work hard but can achieve mastery.`,
                        uranus: `Your Uranus in ${sign} brings innovation and sudden changes. This placement influences your unique perspective and areas where you break from tradition.`,
                        neptune: `Your Neptune in ${sign} governs intuition, spirituality, and creativity. This placement influences your dreams, ideals, and connection to the mystical.`,
                        pluto: `Your Pluto in ${sign} represents transformation and power. This placement influences areas of deep change and your ability to regenerate and evolve.`
                      };
                      return planetDescriptions[planet.toLowerCase()] || `Your ${planet} in ${sign} influences various aspects of your personality and life experience.`;
                    })()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 模块4: Personality Chapters */}
        {birthChartAnalysis.personalityProfile && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Personality Chapters</h2>
            <div className="text-left mb-6">
                <p className="text-gray-700 text-lg">
                Deep-dive narratives summarizing traits, strengths, and growth edges
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Traits */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Traits</h3>
                <div className="space-y-3">
                  {birthChartAnalysis.personalityProfile.coreTraits.map((trait: string, index: number) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {trait}
                    </p>
                  ))}
                </div>
                </div>

                {/* Strengths */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Strengths</h3>
                <div className="space-y-3">
                  {birthChartAnalysis.personalityProfile.strengths.map((strength: string, index: number) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {strength}
                    </p>
                  ))}
                </div>
                </div>

                {/* Challenges */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Challenges</h3>
                <div className="space-y-3">
                  {birthChartAnalysis.personalityProfile.challenges.map((challenge: string, index: number) => (
                    <p key={index} className="text-gray-700 leading-relaxed">
                      {challenge}
                    </p>
                  ))}
                </div>
              </div>

              {/* Life Purpose */}
              <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Life Purpose</h3>
                <p className="text-gray-700 leading-relaxed">
                  {birthChartAnalysis.personalityProfile.lifePurpose}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 模块5: Life Navigation */}
        {birthChartAnalysis.lifeGuidance && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Life Navigation</h2>
            <div className="text-left mb-6">
                <p className="text-gray-700 text-lg">
                Practical cues for career, relationships, and growth inspired by your chart
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Career */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Career</h3>
                <p className="text-gray-700 leading-relaxed">
                  {birthChartAnalysis.lifeGuidance.career}
                </p>
                </div>

                {/* Relationships */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Relationships</h3>
                <p className="text-gray-700 leading-relaxed">
                  {birthChartAnalysis.lifeGuidance.relationships}
                </p>
                </div>

                {/* Personal Growth */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Growth</h3>
                <p className="text-gray-700 leading-relaxed">
                  {birthChartAnalysis.lifeGuidance.personalGrowth}
                </p>
                </div>

                {/* Challenges */}
                <div className="bg-[#5F0F40]/10 rounded-lg border border-[#5F0F40]/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Challenges</h3>
                <p className="text-gray-700 leading-relaxed">
                  {birthChartAnalysis.lifeGuidance.challenges}
                </p>
              </div>
            </div>
          </Card>
        )}
        <Card className="bg-white p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Important Notice</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            This birth chart narrative is designed for inspiration and self-reflection. For medical, financial, or legal decisions, consult licensed professionals and combine these insights with your personal judgment.
          </p>
        </Card>
        <div className="text-center text-sm text-gray-600">
          Share Hint: Keep the chapter that resonates bookmarked or copy a favorite line to share with someone who follows your journey.
        </div>
        </div>
        <FeedbackFloatingWidget
          containerSelector="#mainContent"
          testContext={{ testType: 'astrology', testId: 'birth-chart' }}
        />
        </AstrologyTestContainer>
      </>
    );
  }

  return (
    <>
      <SEOHead config={seoConfig} />
      <AstrologyTestContainer
        testId={testId}
      >
      {/* 面包屑导航 */}
      <Breadcrumb items={breadcrumbItems} />
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              AI-Assisted Birth Chart Narrative
            </h1>
            <p className="text-base text-gray-200">Enter your birth details to receive AI-crafted chapters covering identity, life themes, and reflection prompts.</p>
            <p className="text-sm text-gray-300">Free experience • No signup • Privacy-conscious</p>
          </div>
          <button onClick={handleBack} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Astrology Hub
          </button>
        </div>
      </div>


      {/* 选择表单 */}
      <div className="space-y-6">
        {/* 出生信息表单 */}
      <Card className="bg-white p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Enter Your Birth Details</h3>
        <div className="space-y-6">
              <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Birth Date</h4>
                <span className="text-xs text-gray-500">Sets the pace for your solar story.</span>
              </div>
                <DateInput
                  value={birthDate}
                  onChange={setBirthDate}
                  required
                />
            </div>

              <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Birth Time</h4>
                <span className="text-xs text-gray-500">Helps decode your rising sign and daily rhythm.</span>
              </div>
                <TimeInput
                  value={birthTime}
                  onChange={setBirthTime}
                required
                />
            </div>

              <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-medium text-gray-900">Birth Location</h4>
                <span className="text-xs text-gray-500">Anchors house placements for life areas.</span>
              </div>
                <LocationInput
                  value={birthLocation}
                  onChange={setBirthLocation}
                  required
                />
            </div>
          </div>
        </Card>

          {/* 提交按钮 */}
        <div className="text-center">
            <Button
              onClick={handleSubmit}
            disabled={!birthDate || !birthTime || !birthLocation || isLoading}
              className={cn(
              "px-8 py-3 text-lg bg-gradient-to-r from-[#0B132B] to-[#5F0F40] text-gray-100 rounded-xl font-semibold",
                "hover:from-[#1C2541] hover:to-[#5F0F40] transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-100 mr-2"></div>
                  Crafting Narrative...
                </div>
              ) : (
              'Generate My Birth Chart Story'
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
            <h3 className="text-xl font-semibold text-white mb-2">Weaving Your Natal Chapters</h3>
            <p className="text-white/90 mb-4">
              Give us a moment to translate your birth details into AI-guided chapters you can revisit anytime.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI分析失败错误弹窗（参照 psychology 模块） */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setShowFeedbackForm(false);
          setFeedbackSubmitted(false);
          setFeedbackEmail('');
          setFeedbackMessage('Failed to get AI analysis results for the birth chart');
        }}
        title={showFeedbackForm ? "Report Issue" : "Analysis Temporarily Unavailable"}
        size="medium"
        closeOnOverlayClick={false}
      >
        {!showFeedbackForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Analysis Temporarily Unavailable
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                We encountered an issue while generating your AI-powered analysis. Your input data has been saved, and you can try submitting again.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                If this problem persists, please contact us at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a> or report the issue using the form below.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetrySubmit}
                className="flex-1 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] hover:from-[#1C2541] hover:to-[#5F0F40] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => setShowFeedbackForm(true)}
                variant="outline"
                className="flex-1 border-[#5F0F40] text-[#5F0F40] hover:bg-[#5F0F40]/10 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Report Issue
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  clearError();
                  setBirthDate('');
                  setBirthTime('');
                  setBirthLocation('');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Over
              </Button>
            </div>
          </div>
        ) : feedbackSubmitted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank You for Your Feedback
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We've received your report and will look into this issue. You can also reach us directly at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetrySubmit}
                className="flex-1 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] hover:from-[#1C2541] hover:to-[#5F0F40] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  clearError();
                  setBirthDate('');
                  setBirthTime('');
                  setBirthLocation('');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Help Us Improve
              </h3>
              <p className="text-sm text-gray-600">
                Please provide your email and describe the issue you encountered. This will help us fix the problem quickly.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={feedbackEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedbackEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackMessage(e.target.value)}
                placeholder="Describe the issue you encountered..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5F0F40]"
                rows={4}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSubmitFeedback}
                className="flex-1 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] hover:from-[#1C2541] hover:to-[#5F0F40] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isSubmittingFeedback || !feedbackEmail || !feedbackMessage}
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackEmail('');
                  setFeedbackMessage('Failed to get AI analysis results for the birth chart');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AstrologyTestContainer>
    </>
  );
};
