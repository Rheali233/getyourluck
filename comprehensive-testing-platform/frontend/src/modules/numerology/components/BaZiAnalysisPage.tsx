/**
 * BaZi Analysis Page
 * 八字分析专用页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Button, Card, Breadcrumb } from '@/components/ui';
import { NumerologyDateInput } from './NumerologyDateInput';
import { NumerologyTimeInput } from './NumerologyTimeInput';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';

export const BaZiAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults, analysisResult } = useNumerologyStore();
  
  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'test',
    testType: 'bazi',
    customKeywords: ['bazi analysis', 'eight pillars', 'chinese astrology']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'numerology',
    testId: 'bazi',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'BaZi Analysis Service',
      description: 'Professional BaZi (Eight Pillars of Destiny) analysis based on your birth information',
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
      serviceType: 'Numerology Analysis',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
      category: 'Chinese Astrology Services'
    }
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthTime: '',
    gender: 'male' as 'male' | 'female',
    calendarType: 'solar' as 'solar' | 'lunar'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 监听结果加载完成，只有当有BaZi分析数据时才跳转到结果页面
  useEffect(() => {
    if (showResults && analysisResult?.baZi) {
      navigate('/numerology/bazi/result');
    }
  }, [showResults, analysisResult, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.birthDate) {
      return;
    }

    try {
      await processNumerologyData('bazi', {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        gender: formData.gender,
        calendarType: formData.calendarType
      });
      // 导航通过 useEffect 自动处理
    } catch (error) {
      // Error handling is done in the store
    }
  };

  return (
    <>
      <SEOHead config={seoConfig} />
      <NumerologyTestContainer>
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{UI_TEXT.numerology.bazi.analysisPage.loadingTitle}</h3>
            <p className="text-white/90 mb-4">
              {UI_TEXT.numerology.bazi.analysisPage.loadingDesc}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={getBreadcrumbConfig('/numerology/bazi')} />
        
        {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {UI_TEXT.numerology.bazi.analysisPage.headerTitle}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                {UI_TEXT.numerology.bazi.analysisPage.headerSubtitle}
              </p>
            </div>
            <button onClick={() => navigate('/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-red-900 font-semibold hover:bg-white/80 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {UI_TEXT.numerology.bazi.analysisPage.backToCenter}
            </button>
          </div>
        </div>


        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-red-900 mb-4">{UI_TEXT.numerology.bazi.analysisPage.form.sectionTitle}</h3>
            
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-red-900 font-medium mb-1">{UI_TEXT.numerology.bazi.analysisPage.form.fullName}</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                  placeholder={UI_TEXT.numerology.bazi.analysisPage.form.fullNamePlaceholder}
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-red-900 font-medium mb-1">{UI_TEXT.numerology.bazi.analysisPage.form.birthDate}</label>
                <NumerologyDateInput
                  value={formData.birthDate}
                  onChange={(value) => handleInputChange('birthDate', value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Birth Time */}
              <div>
                <label className="block text-red-900 font-medium mb-1">{UI_TEXT.numerology.bazi.analysisPage.form.birthTime}</label>
                <NumerologyTimeInput
                  value={formData.birthTime}
                  onChange={(value) => handleInputChange('birthTime', value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-red-900 font-medium mb-1">{UI_TEXT.numerology.bazi.analysisPage.form.gender}</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-800">{UI_TEXT.numerology.bazi.analysisPage.form.genderMale}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-800">{UI_TEXT.numerology.bazi.analysisPage.form.genderFemale}</span>
                  </label>
                </div>
              </div>

              {/* Calendar Type */}
              <div>
                <label className="block text-red-900 font-medium mb-1">{UI_TEXT.numerology.bazi.analysisPage.form.calendarType}</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="calendarType"
                      value="solar"
                      checked={formData.calendarType === 'solar'}
                      onChange={(e) => handleInputChange('calendarType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-800">{UI_TEXT.numerology.bazi.analysisPage.form.calendarSolar}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="calendarType"
                      value="lunar"
                      checked={formData.calendarType === 'lunar'}
                      onChange={(e) => handleInputChange('calendarType', e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-red-800">{UI_TEXT.numerology.bazi.analysisPage.form.calendarLunar}</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !formData.fullName || !formData.birthDate}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? UI_TEXT.numerology.bazi.analysisPage.buttons.analyzing : UI_TEXT.numerology.bazi.analysisPage.buttons.start}
            </Button>
          </div>
        </form>
      </div>
    </NumerologyTestContainer>
    </>
  );
};
