/**
 * Compatibility Test Page Component
 * 星座配对分析页面
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

export interface CompatibilityTestPageProps extends BaseComponentProps {}

export const CompatibilityTestPage: React.FC<CompatibilityTestPageProps> = ({
  className,
  testId = 'compatibility-test-page',
  ...props
}) => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    showResults,
    compatibilityAnalysis,
    getCompatibility,
    clearError
  } = useAstrologyStore();

  const [sign1, setSign1] = useState<string>('');
  const [sign2, setSign2] = useState<string>('');
  const [relationType, setRelationType] = useState<string>('love');
  const [showLoadingModal, setShowLoadingModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    clearError();
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

  const relationTypes = [
    { id: 'love', name: 'Love Compatibility', description: 'Romantic relationship analysis', icon: '💕' },
    { id: 'friendship', name: 'Friendship Compatibility', description: 'Friendship potential and dynamics', icon: '👫' },
    { id: 'work', name: 'Work Compatibility', description: 'Professional collaboration analysis', icon: '💼' }
  ];

  const handleSubmit = async () => {
    if (!sign1 || !sign2 || isSubmitting) {
      return;
    }

    try {
      // 防止重复提交
      setIsSubmitting(true);
      setShowLoadingModal(true);
      
      await getCompatibility(sign1, sign2, relationType);
      
      // 成功后弹窗会自动关闭，页面会跳转到结果页面
    } catch (error) {
      // 错误时关闭弹窗
      setShowLoadingModal(false);
      // console.error('Compatibility analysis failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Challenging';
  };

  // 显示结果
  if (showResults && compatibilityAnalysis) {
    // 优先使用AI生成的详细数据，如果没有则使用基础数据
    const sign1Data = compatibilityAnalysis.zodiacSignComparison?.sign1 || ZODIAC_SIGNS.find(s => s.id === compatibilityAnalysis.sign1);
    const sign2Data = compatibilityAnalysis.zodiacSignComparison?.sign2 || ZODIAC_SIGNS.find(s => s.id === compatibilityAnalysis.sign2);
    
    // 类型安全的属性访问函数
    const getSignName = (sign: any) => sign?.name || sign?.name_en || 'Unknown';
    const getRulingPlanet = (sign: any) => sign?.rulingPlanet || sign?.ruling_planet || 'Unknown';
    const getDateRange = (sign: any) => {
      if (sign?.dateRange) return sign.dateRange;
      if (sign?.date_range) return `${sign.date_range.start} - ${sign.date_range.end}`;
      return 'Unknown';
    };
    const getKeyTraits = (sign: any) => sign?.keyTraits || sign?.traits || [];
    const getElementalNature = (sign: any) => sign?.elementalNature;
    const getQualityTraits = (sign: any) => sign?.qualityTraits;

    return (
      <AstrologyTestContainer className={className} data-testid={testId} {...props}>
        <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* Main Title and Description + Home button at top-right */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 capitalize">
          {compatibilityAnalysis.relationType} Compatibility Analysis
        </h1>
        <button onClick={() => navigate('/astrology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Center
        </button>
        </div>
        <p className="text-xl text-gray-200 max-w-4xl">
          {getSignName(sign1Data)} & {getSignName(sign2Data)}
        </p>
        </div>

        {/* 模块1: Compatibility Overview */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compatibility Overview</h2>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2 text-[#5F0F40]">
                {compatibilityAnalysis.overallScore}%
              </div>
              <div className="text-lg font-medium text-gray-700 mb-4">
                {getCompatibilityLabel(compatibilityAnalysis.overallScore)} Match
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <span className="text-sm text-[#5F0F40] font-medium">Element Compatibility</span>
                  <div className="font-semibold text-gray-900">{compatibilityAnalysis.elementCompatibility}</div>
                </div>
                <div className="text-center">
                  <span className="text-sm text-[#5F0F40] font-medium">Quality Compatibility</span>
                  <div className="font-semibold text-gray-900">{compatibilityAnalysis.qualityCompatibility}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 模块2: Zodiac Signs Comparison */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Zodiac Signs Comparison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sign 1 */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">{sign1Data?.symbol}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{getSignName(sign1Data)}</h3>
                <p className="text-sm text-[#5F0F40] capitalize font-medium mb-2">{sign1Data?.element} • {sign1Data?.quality}</p>
                <p className="text-xs text-gray-500">Ruled by {getRulingPlanet(sign1Data)}</p>
                <p className="text-xs text-gray-500">{getDateRange(sign1Data)}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">🌟 Key Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {getKeyTraits(sign1Data).map((trait: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-[#5F0F40]/10 text-[#5F0F40] border border-[#5F0F40]/30 rounded-full text-sm font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">💫 Elemental Nature</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getElementalNature(sign1Data) || 
                      (sign1Data?.element === 'fire' && 'Fire signs are passionate, energetic, and natural leaders who bring enthusiasm and courage to relationships.') ||
                      (sign1Data?.element === 'earth' && 'Earth signs are practical, reliable, and grounded, providing stability and security in relationships.') ||
                      (sign1Data?.element === 'air' && 'Air signs are intellectual, communicative, and social, bringing mental stimulation and fresh perspectives to relationships.') ||
                      (sign1Data?.element === 'water' && 'Water signs are emotional, intuitive, and nurturing, bringing deep emotional connection and empathy to relationships.') ||
                      'Elemental nature analysis not available.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">⚡ Quality Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getQualityTraits(sign1Data) || 
                      (sign1Data?.quality === 'cardinal' && 'Cardinal signs are initiators and leaders, always ready to start new projects and take charge in relationships.') ||
                      (sign1Data?.quality === 'fixed' && 'Fixed signs are stable and determined, providing consistency and loyalty in relationships.') ||
                      (sign1Data?.quality === 'mutable' && 'Mutable signs are adaptable and flexible, bringing versatility and compromise to relationships.') ||
                      'Quality traits analysis not available.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Sign 2 */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#0B132B] to-[#5F0F40] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">{sign2Data?.symbol}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{getSignName(sign2Data)}</h3>
                <p className="text-sm text-[#5F0F40] capitalize font-medium mb-2">{sign2Data?.element} • {sign2Data?.quality}</p>
                <p className="text-xs text-gray-500">Ruled by {getRulingPlanet(sign2Data)}</p>
                <p className="text-xs text-gray-500">{getDateRange(sign2Data)}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">🌟 Key Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {getKeyTraits(sign2Data).map((trait: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-[#5F0F40]/10 text-[#5F0F40] border border-[#5F0F40]/30 rounded-full text-sm font-medium">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">💫 Elemental Nature</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getElementalNature(sign2Data) || 
                      (sign2Data?.element === 'fire' && 'Fire signs are passionate, energetic, and natural leaders who bring enthusiasm and courage to relationships.') ||
                      (sign2Data?.element === 'earth' && 'Earth signs are practical, reliable, and grounded, providing stability and security in relationships.') ||
                      (sign2Data?.element === 'air' && 'Air signs are intellectual, communicative, and social, bringing mental stimulation and fresh perspectives to relationships.') ||
                      (sign2Data?.element === 'water' && 'Water signs are emotional, intuitive, and nurturing, bringing deep emotional connection and empathy to relationships.') ||
                      'Elemental nature analysis not available.'
                    }
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">⚡ Quality Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getQualityTraits(sign2Data) || 
                      (sign2Data?.quality === 'cardinal' && 'Cardinal signs are initiators and leaders, always ready to start new projects and take charge in relationships.') ||
                      (sign2Data?.quality === 'fixed' && 'Fixed signs are stable and determined, providing consistency and loyalty in relationships.') ||
                      (sign2Data?.quality === 'mutable' && 'Mutable signs are adaptable and flexible, bringing versatility and compromise to relationships.') ||
                      'Quality traits analysis not available.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 模块3: Relationship Analysis */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Relationship Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💪 Strengths</h3>
              <ul className="space-y-3">
                {compatibilityAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#5F0F40] mr-3 mt-1">•</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Challenges</h3>
              <ul className="space-y-3">
                {compatibilityAnalysis.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-3 mt-1">•</span>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* 模块4: Relationship Advice */}
        <Card className="bg-white/80 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Relationship Advice</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Astrological Guidance</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {compatibilityAnalysis.advice}
              </p>
            </div>
          </div>
        </Card>
        </div>
        <FeedbackFloatingWidget
          containerSelector="#mainContent"
          testContext={{ testType: 'astrology', testId: 'compatibility' }}
        />
      </AstrologyTestContainer>
    );
  }

  // 显示输入表单
  return (
    <AstrologyTestContainer className={className} data-testid={testId} {...props}>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig('/astrology/compatibility')} />
      
      {/* Main Title and Description + Home button at top-right */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Zodiac Compatibility
          </h1>
          <button onClick={() => navigate('/astrology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-gray-200 max-w-3xl">
          Discover the compatibility between different zodiac signs
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <Card className="bg-white/80 p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <p className="text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {/* 选择表单 */}
      <div className="space-y-6">
        {/* 选择关系类型 */}
        <Card className="bg-white/80 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Relationship Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setRelationType(type.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                  relationType === type.id
                    ? "border-[#5F0F40] bg-gradient-to-r from-[#0B132B]/10 to-[#5F0F40]/10"
                    : "border-gray-300 bg-white hover:border-[#5F0F40]/50 hover:bg-gray-50"
                )}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className={cn(
                  "font-medium mb-1",
                  relationType === type.id ? "text-[#5F0F40]" : "text-gray-900"
                )}>{type.name}</div>
                <div className={cn(
                  "text-sm",
                  relationType === type.id ? "text-[#5F0F40]/80" : "text-gray-600"
                )}>{type.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* 选择第一个星座 */}
        <Card className="bg-white/80 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Select First Zodiac Sign</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSign1(sign.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-center min-h-[120px] flex flex-col justify-center",
                  sign1 === sign.id
                    ? "border-[#5F0F40] bg-gradient-to-r from-[#0B132B]/10 to-[#5F0F40]/10 text-[#5F0F40]"
                    : "border-gray-300 bg-white hover:border-[#5F0F40]/50 hover:bg-gray-50"
                )}
              >
                <div className="text-3xl mb-3">{sign.symbol}</div>
                <div className={cn(
                  "font-medium mb-2",
                  sign1 === sign.id ? "text-[#5F0F40]" : "text-gray-900"
                )}>{sign.name_en}</div>
                <div className={cn(
                  "text-sm",
                  sign1 === sign.id ? "text-[#5F0F40]/80" : "text-gray-600"
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

        {/* 选择第二个星座 */}
        <Card className="bg-white/80 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Second Zodiac Sign</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign.id}
                onClick={() => setSign2(sign.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-center min-h-[120px] flex flex-col justify-center",
                  sign2 === sign.id
                    ? "border-[#5F0F40] bg-gradient-to-r from-[#0B132B]/10 to-[#5F0F40]/10 text-[#5F0F40]"
                    : "border-gray-300 bg-white hover:border-[#5F0F40]/50 hover:bg-gray-50"
                )}
              >
                <div className="text-3xl mb-3">{sign.symbol}</div>
                <div className={cn(
                  "font-medium mb-2",
                  sign2 === sign.id ? "text-[#5F0F40]" : "text-gray-900"
                )}>{sign.name_en}</div>
                <div className={cn(
                  "text-sm",
                  sign2 === sign.id ? "text-[#5F0F40]/80" : "text-gray-600"
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
            disabled={!sign1 || !sign2 || isLoading || isSubmitting}
            className={cn(
              "px-8 py-3 text-lg bg-gradient-to-r from-[#0B132B] to-[#5F0F40] text-gray-900 rounded-xl font-semibold",
              "hover:from-[#1C2541] hover:to-[#5F0F40] transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading || isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-100 mr-2"></div>
                Analyzing Compatibility...
              </div>
            ) : (
              'Analyze Compatibility'
            )}
          </Button>
        </div>
      </div>

      {/* 加载弹窗 */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0B132B]/95 to-[#5F0F40]/95 backdrop-blur-md rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl border border-[#5F0F40]/30">
            <div className="w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Compatibility</h3>
            <p className="text-white/90 mb-4">
              Please wait while we analyze the compatibility between your selected zodiac signs...
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
  );
};