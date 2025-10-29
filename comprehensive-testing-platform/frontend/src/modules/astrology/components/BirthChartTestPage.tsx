/**
 * Birth Chart Analysis Page Component
 * 出生星盘分析页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, DateInput, TimeInput, LocationInput, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { useAstrologyStore } from '../stores/useAstrologyStore';
import { cn } from '@/utils/classNames';
import { AstrologyTestContainer } from './AstrologyTestContainer';

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
    getBirthChart
  } = useAstrologyStore();

  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [birthLocation, setBirthLocation] = useState<string>('');
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);

  // 同步加载状态
  useEffect(() => {
    if (showResults || error) {
      setShowLoadingModal(false);
    }
  }, [showResults, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate || !birthTime || !birthLocation) {
      return;
    }

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

  const handleBack = () => {
    navigate('/tests/astrology');
  };


  if (showResults && birthChartAnalysis) {
    return (
      <AstrologyTestContainer
        testId={testId}
      >
        <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* 结果页面头部 */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Birth Chart Analysis
            </h1>
            <button onClick={handleBack} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            Your personalized birth chart analysis based on your birth details
          </p>
        </div>

        {/* 模块1: Overall Analysis */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Analysis</h2>
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

        {/* 模块2: Core Planetary Positions */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Planetary Positions</h2>
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

        {/* 模块3: Planetary Positions */}
        {birthChartAnalysis.planetaryPositions && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Planetary Positions</h2>
            <div className="text-left mb-6">
              <p className="text-gray-700 text-lg">
                Detailed positions of all planets in your birth chart
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

        {/* 模块4: Personality Profile */}
        {birthChartAnalysis.personalityProfile && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Personality Profile</h2>
            <div className="text-left mb-6">
                <p className="text-gray-700 text-lg">
                Deep insights into your personality based on your astrological profile
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

        {/* 模块5: Life Guidance */}
        {birthChartAnalysis.lifeGuidance && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Life Guidance</h2>
            <div className="text-left mb-6">
                <p className="text-gray-700 text-lg">
                Practical guidance for different areas of your life based on your birth chart
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
        </div>
        <FeedbackFloatingWidget
          containerSelector="#mainContent"
          testContext={{ testType: 'astrology', testId: 'birth-chart' }}
        />
      </AstrologyTestContainer>
    );
  }

  return (
    <AstrologyTestContainer
      testId={testId}
    >
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Birth Chart Analysis
          </h1>
          <button onClick={handleBack} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl">
          Discover the secrets of your birth chart and unlock insights about your personality, 
          relationships, and life path through comprehensive astrological analysis.
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="bg-white p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <p className="text-red-600">{error}</p>
          </div>
        </Card>
      )}

      {/* 选择表单 */}
      <div className="space-y-6">
        {/* 出生信息表单 */}
      <Card className="bg-white p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Enter Your Birth Details</h3>
        <div className="space-y-6">
              <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Birth Date</h4>
                <DateInput
                  value={birthDate}
                  onChange={setBirthDate}
                  required
                />
            </div>

              <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Birth Time</h4>
                <TimeInput
                  value={birthTime}
                  onChange={setBirthTime}
                required
                />
            </div>

              <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Birth Location</h4>
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
                Analyzing Chart...
                </div>
              ) : (
              'Get My Birth Chart'
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
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Birth Chart</h3>
            <p className="text-white/90 mb-4">
              Please wait while we analyze the stars and generate your personalized birth chart reading...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </AstrologyTestContainer>
  );
};
