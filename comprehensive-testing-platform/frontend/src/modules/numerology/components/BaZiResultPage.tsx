/**
 * BaZi Analysis Result Page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { Button, Card, FeedbackFloatingWidget } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';

export const BaZiResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult, isLoading, error } = useNumerologyStore();

  if (isLoading) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-2xl font-bold text-white mb-4">{UI_TEXT.numerology.bazi.resultPage.loadingTitle}</h2>
            <p className="text-gray-200">{UI_TEXT.numerology.bazi.resultPage.loadingDesc}</p>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (error) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{UI_TEXT.numerology.bazi.resultPage.errorTitle}</h2>
            <p className="text-gray-200 mb-6">{error}</p>
            <Button
              onClick={() => navigate('/tests/numerology/bazi')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {UI_TEXT.numerology.bazi.resultPage.tryAgain}
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (!analysisResult) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">{UI_TEXT.numerology.bazi.resultPage.noAnalysisTitle}</h2>
            <p className="text-gray-200 mb-6">{UI_TEXT.numerology.bazi.resultPage.noAnalysisDesc}</p>
            <Button
              onClick={() => navigate('/tests/numerology/bazi')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {UI_TEXT.numerology.bazi.resultPage.startNew}
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  // 检查BaZi数据是否存在
  if (!analysisResult.baZi || !analysisResult.fiveElements) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">BaZi Analysis Not Available</h2>
            <p className="text-gray-200 mb-6">The BaZi analysis data is not available. Please try again.</p>
            <Button
              onClick={() => navigate('/tests/numerology/bazi')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start New Analysis
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  // 防御性检查：确保所有必需的字段存在
  const safeFiveElements = analysisResult.fiveElements?.elements || {};
  const safeTenGods = analysisResult.baZi?.tenGods || {};
  const safeDayMasterStrength = analysisResult.baZi?.dayMasterStrength || { recommendations: [] };
  const safeFavorableElements = analysisResult.baZi?.favorableElements || { useful: [], harmful: [], neutral: [] };
  const safePersonalityTraits = analysisResult.personalityTraits || [];
  const safeCareerGuidance = analysisResult.careerGuidance || [];
  const safeWealthAnalysis = analysisResult.wealthAnalysis || { wealthSource: [], investmentAdvice: [] };
  const safeHealthAnalysis = analysisResult.healthAnalysis || { weakAreas: [], beneficialActivities: [] };
  const safeFortuneAnalysis = analysisResult.fortuneAnalysis || { currentYear: { advice: [] } };

  return (
    <NumerologyTestContainer>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* 结果页面头部 */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {UI_TEXT.numerology.bazi.resultPage.reportTitle}
            </h1>
            <button onClick={() => navigate('/tests/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            {UI_TEXT.numerology.bazi.resultPage.reportSubtitle}
          </p>
        </div>

        {/* 模块1: Overall Analysis */}
        {analysisResult.overallInterpretation && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{UI_TEXT.numerology.bazi.resultPage.overallTitle}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {analysisResult.overallInterpretation}
            </p>
          </Card>
        )}

        {/* 模块2: Basic BaZi Analysis */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{UI_TEXT.numerology.bazi.resultPage.basicTitle}</h2>
          
          {/* BaZi Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.chartTitle}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {UI_TEXT.numerology.bazi.resultPage.chartIntro}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Year Pillar */}
              <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
                <div className="text-3xl mb-3">🏮</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.pillars.year}</h4>
                <div className="text-gray-700">
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.heavenlyStem}: {analysisResult.baZi.yearPillar.heavenlyStem || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.earthlyBranch}: {analysisResult.baZi.yearPillar.earthlyBranch || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.element}: {analysisResult.baZi.yearPillar.element || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.animal}: {analysisResult.baZi.yearPillar.animal || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                </div>
              </div>

              {/* Month Pillar */}
              <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
                <div className="text-3xl mb-3">🌙</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.pillars.month}</h4>
                <div className="text-gray-700">
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.heavenlyStem}: {analysisResult.baZi.monthPillar.heavenlyStem || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.earthlyBranch}: {analysisResult.baZi.monthPillar.earthlyBranch || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.element}: {analysisResult.baZi.monthPillar.element || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                </div>
              </div>

              {/* Day Pillar */}
              <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
                <div className="text-3xl mb-3">☀️</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.pillars.day}</h4>
                <div className="text-gray-700">
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.heavenlyStem}: {analysisResult.baZi.dayPillar.heavenlyStem || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.earthlyBranch}: {analysisResult.baZi.dayPillar.earthlyBranch || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.element}: {analysisResult.baZi.dayPillar.element || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                </div>
              </div>

              {/* Hour Pillar */}
              <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.pillars.hour}</h4>
                <div className="text-gray-700">
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.heavenlyStem}: {analysisResult.baZi.hourPillar.heavenlyStem || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.earthlyBranch}: {analysisResult.baZi.hourPillar.earthlyBranch || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-sm">{UI_TEXT.numerology.bazi.resultPage.pillars.element}: {analysisResult.baZi.hourPillar.element || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Five Elements Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.fiveElementsTitle}</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              {UI_TEXT.numerology.bazi.resultPage.fiveElementsIntro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {Object.entries(safeFiveElements).map(([element, value]) => {
                // 将数字转换为程度值
                const getStrengthLevel = (num: number) => {
                  if (num >= 3) return { text: 'Strong', color: 'text-green-800', bg: 'bg-green-100' };
                  if (num === 2) return { text: 'Medium', color: 'text-blue-800', bg: 'bg-blue-100' };
                  return { text: 'Weak', color: 'text-orange-800', bg: 'bg-orange-100' };
                };
                
                const strength = getStrengthLevel(value as number);
                
                return (
                <div key={element} className="text-center bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl mb-2">
                    {element === 'metal' && '⚔️'}
                    {element === 'wood' && '🌿'}
                    {element === 'water' && '🌊'}
                    {element === 'fire' && '🔥'}
                    {element === 'earth' && '🏔️'}
                  </div>
                  <div className="text-gray-900 font-medium capitalize mb-1">{element}</div>
                  <div className={`inline-block ${strength.bg} ${strength.color} font-bold text-xs px-2 py-1 rounded-md mb-2`}>
                    {strength.text}
                  </div>
                  <div className="text-gray-600 text-xs leading-relaxed">
                    {element === 'metal' && 'Represents precision, structure, and determination. Associated with autumn and the west.'}
                    {element === 'wood' && 'Symbolizes growth, creativity, and flexibility. Associated with spring and the east.'}
                    {element === 'water' && 'Embodies wisdom, adaptability, and flow. Associated with winter and the north.'}
                    {element === 'fire' && 'Represents passion, leadership, and transformation. Associated with summer and the south.'}
                    {element === 'earth' && 'Symbolizes stability, nurturing, and grounding. Associated with late summer and the center.'}
                  </div>
                </div>
                );
              })}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">{UI_TEXT.numerology.bazi.resultPage.balanceAssessmentTitle}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <span className="font-bold text-gray-900 block mb-2">{UI_TEXT.numerology.bazi.resultPage.dominantElement}</span>
                  <div className="text-gray-800 mb-2">{analysisResult.fiveElements.dominantElement || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-gray-600 text-sm">
                    The strongest element influences core personality and natural talents. This element drives primary motivations and decision-making style.
                  </div>
                </div>
                <div className="text-center">
                  <span className="font-bold text-gray-900 block mb-2">{UI_TEXT.numerology.bazi.resultPage.weakElement}</span>
                  <div className="text-gray-800 mb-2">{analysisResult.fiveElements.weakElement || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-gray-600 text-sm">
                    This element represents areas where challenges may arise or where greater strength and awareness need to be developed.
                  </div>
                </div>
                <div className="text-center">
                  <span className="font-bold text-gray-900 block mb-2">{UI_TEXT.numerology.bazi.resultPage.overallBalance}</span>
                  <div className="text-gray-800 mb-2">{analysisResult.fiveElements.balance || UI_TEXT.numerology.bazi.resultPage.pillars.notAvailable}</div>
                  <div className="text-gray-600 text-sm">
                    A balanced chart indicates harmony and flow, while imbalance suggests areas requiring attention and development.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 模块3: Ten Gods Analysis */}
        {analysisResult.baZi.tenGods && (
          <Card className="bg-white p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{UI_TEXT.numerology.bazi.resultPage.tenGodsTitle}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {UI_TEXT.numerology.bazi.resultPage.tenGodsIntro}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(safeTenGods).map(([key, god]: [string, any]) => {
                // 去掉名称中的英文翻译
                const cleanName = god.name.replace(/\s*\([^)]*\)/, '');
                
                // 获取程度标签样式
                const getStrengthTagStyle = (strength: string) => {
                  switch (strength.toLowerCase()) {
                    case 'strong':
                      return 'bg-green-100 text-green-800';
                    case 'balanced':
                      return 'bg-blue-100 text-blue-800';
                    case 'weak':
                      return 'bg-orange-100 text-orange-800';
                    default:
                      return 'bg-gray-100 text-gray-800';
                  }
                };
                
                return (
                <div key={key} className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                  <div className="text-2xl mb-2">⚔️</div>
                  <div className="text-gray-900 font-bold mb-2">{cleanName}</div>
                  <div className="text-gray-800 text-sm mb-1">{god.element}</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStrengthTagStyle(god.strength)}`}>
                    {god.strength}
                  </div>
                  <div className="text-gray-600 text-xs leading-relaxed">{god.meaning}</div>
                </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 模块4: Day Master Strength */}
        {analysisResult.baZi.dayMasterStrength && (
          <Card className="bg-white p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{UI_TEXT.numerology.bazi.resultPage.dayMasterTitle}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The Ri Zhu (Day Master) represents the core self and how one interacts with the world. Its strength determines the ability to handle life's challenges, make decisions, and achieve goals. Understanding the Day Master's strength helps align with natural energy and maximize potential.
            </p>
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="text-gray-800 mb-6 text-lg leading-relaxed">{analysisResult.baZi.dayMasterStrength.description}</div>

              <h5 className="text-lg font-bold text-gray-900 mb-3">Personalized Recommendations</h5>
              <div className="space-y-2">
                {(safeDayMasterStrength.recommendations || []).map((rec: any, index: number) => (
                  <div key={index}>
                    <p className="text-gray-800 text-lg leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* 模块5: Favorable Elements */}
        {analysisResult.baZi.favorableElements && (
          <Card className="bg-white p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{UI_TEXT.numerology.bazi.resultPage.favorableTitle}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {UI_TEXT.numerology.bazi.resultPage.favorableIntro}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                  <span className="mr-2">✨</span>{UI_TEXT.numerology.bazi.resultPage.favorableUseful}
                </h4>
                <p className="text-gray-700 text-sm mb-3">These elements bring positive energy and support goals:</p>
                <div className="space-y-2">
                  {(safeFavorableElements.useful || []).map((element: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-red-400">✓</span>
                      <span className="text-gray-800">{element}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                  <span className="mr-2">⚠️</span>{UI_TEXT.numerology.bazi.resultPage.favorableHarmful}
                </h4>
                <p className="text-gray-700 text-sm mb-3">These elements may create challenges or drain energy:</p>
                <div className="space-y-2">
                  {(safeFavorableElements.harmful || []).map((element: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-red-400">✗</span>
                      <span className="text-gray-800">{element}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                  <span className="mr-2">⚖️</span>{UI_TEXT.numerology.bazi.resultPage.favorableNeutral}
                </h4>
                <p className="text-gray-700 text-sm mb-3">These elements neither help nor hinder progress:</p>
                <div className="space-y-2">
                  {(safeFavorableElements.neutral || []).map((element: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-red-400">○</span>
                      <span className="text-gray-800">{element}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 模块6: Life Analysis */}
        {(analysisResult.personalityTraits || analysisResult.careerGuidance || analysisResult.wealthAnalysis || analysisResult.relationshipAnalysis || analysisResult.healthAnalysis) && (
          <Card className="bg-white p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.lifeAnalysisTitle}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{UI_TEXT.numerology.bazi.resultPage.lifeAnalysisDescription}</p>
            
            {/* 子模块1: Personality Analysis */}
            {analysisResult.personalityTraits && analysisResult.personalityTraits.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.personalityTitle}</h4>
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="space-y-3">
                    {safePersonalityTraits.map((trait: any, index: number) => (
                      <p key={index} className="text-gray-700 text-sm">{trait}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 子模块2: Career & Wealth Analysis */}
            {(analysisResult.careerGuidance || analysisResult.wealthAnalysis) && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.careerWealthTitle}</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Career Guidance 子模块 */}
                  {analysisResult.careerGuidance && analysisResult.careerGuidance.length > 0 && (
                    <div className="h-full flex flex-col">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">{UI_TEXT.numerology.bazi.resultPage.careerGuidanceTitle}</h5>
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200 flex-1">
                        <div className="space-y-2">
                          {safeCareerGuidance.map((guidance: any, index: number) => (
                            <p key={index} className="text-gray-700 text-sm">• {guidance}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wealth Analysis 子模块 */}
                  {analysisResult.wealthAnalysis && (analysisResult.wealthAnalysis.wealthLevel || (safeWealthAnalysis.wealthSource && safeWealthAnalysis.wealthSource.length > 0) || (safeWealthAnalysis.investmentAdvice && safeWealthAnalysis.investmentAdvice.length > 0)) && (
                    <div className="h-full flex flex-col">
                      <h5 className="text-lg font-bold text-gray-900 mb-3">{UI_TEXT.numerology.bazi.resultPage.wealthAnalysisTitle}</h5>
                      <div className="bg-red-50 rounded-lg p-6 border border-red-200 flex-1">
                        <div className="space-y-4">
                          {analysisResult.wealthAnalysis.wealthLevel && (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.wealthLevel}</h6>
                              <p className="text-gray-700 text-sm capitalize">{String(analysisResult.wealthAnalysis.wealthLevel).replace('_', ' ')}</p>
                            </div>
                          )}
                          {safeWealthAnalysis.wealthSource && safeWealthAnalysis.wealthSource.length > 0 && (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.wealthSources}</h6>
                              <div className="space-y-1">
                                {safeWealthAnalysis.wealthSource.map((source: any, index: number) => (
                                  <p key={index} className="text-gray-700 text-sm">• {source}</p>
                                ))}
                              </div>
                            </div>
                          )}
                          {safeWealthAnalysis.investmentAdvice && safeWealthAnalysis.investmentAdvice.length > 0 && (
                            <div>
                              <h6 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.investmentAdvice}</h6>
                              <div className="space-y-1">
                                {safeWealthAnalysis.investmentAdvice.map((advice: any, index: number) => (
                                  <p key={index} className="text-gray-700 text-sm">• {advice}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 子模块3: Relationship & Marriage Analysis */}
            {analysisResult.relationshipAnalysis && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.relationshipMarriageTitle}</h4>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.marriageTiming}</h5>
                      <p className="text-gray-700 text-sm">{analysisResult.relationshipAnalysis.marriageTiming}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.partnerCharacteristics}</h5>
                      <p className="text-gray-700 text-sm">{analysisResult.relationshipAnalysis.partnerCharacteristics}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.marriageAdvice}</h5>
                      <p className="text-gray-700 text-sm">{analysisResult.relationshipAnalysis.marriageAdvice}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 子模块4: Health Analysis */}
            {analysisResult.healthAnalysis && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.healthTitle}</h4>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.overallHealth}</h5>
                      <p className="text-gray-700 text-sm">{analysisResult.healthAnalysis.overallHealth}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.weakAreas}</h5>
                      <div className="space-y-1">
                        {(safeHealthAnalysis.weakAreas || []).map((area: any, index: number) => (
                          <p key={index} className="text-gray-700 text-sm">• {area}</p>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.healthAdvice}</h5>
                      <div className="space-y-1">
                        {(safeHealthAnalysis.beneficialActivities || []).map((activity: any, index: number) => (
                          <p key={index} className="text-gray-700 text-sm">• {activity}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* 模块10: Fortune Analysis */}
        {analysisResult.fortuneAnalysis && (
          <Card className="bg-white p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.fortuneTimingTitle}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {UI_TEXT.numerology.bazi.resultPage.fortuneAnalysisDescription}
            </p>
            
            {/* 子模块1: Current Year */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.currentYear}</h4>
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.overallFortune}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.currentYear?.overallDescription}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.careerProfessionalLife}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.currentYear?.careerDescription}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.wealthFinancialMatters}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.currentYear?.wealthDescription}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.healthWellbeing}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.currentYear?.healthDescription}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.relationshipsSocialLife}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.currentYear?.relationshipsDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 子模块2: Next Year */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.nextYear}</h4>
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.upcomingTrends}</h5>
                    <p className="text-gray-700 text-sm mb-4">{analysisResult?.fortuneAnalysis?.nextYear?.overallDescription}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">{UI_TEXT.numerology.bazi.resultPage.keyAreasOfFocus}</h5>
                    <div className="space-y-1">
                      {((analysisResult?.fortuneAnalysis?.nextYear?.keyTrends) || []).map((trend: any, index: number) => (
                        <p key={index} className="text-gray-700 text-sm">• {trend}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 子模块3: Strategic Recommendations */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{UI_TEXT.numerology.bazi.resultPage.strategicRecommendations}</h4>
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <p className="text-gray-700 text-sm mb-4">
                  {UI_TEXT.numerology.bazi.resultPage.strategicRecommendationsDesc}
                </p>
                <div className="space-y-3">
                  {((safeFortuneAnalysis.currentYear?.advice) || []).map((rec: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-gray-600 mt-1 font-bold">💡</span>
                      <p className="text-gray-800 text-sm leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

      </div>

      <FeedbackFloatingWidget
        testContext={{ testType: 'numerology', testId: 'bazi-result' }}
      />
    </NumerologyTestContainer>
  );
};
