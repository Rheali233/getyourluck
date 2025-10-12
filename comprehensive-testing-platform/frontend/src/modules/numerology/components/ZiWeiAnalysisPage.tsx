/**
 * ZiWei Analysis Page
 * 紫微斗数分析专用页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button, DateInput, TimeInput, Breadcrumb } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';

export const ZiWeiAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults } = useNumerologyStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthTime: '',
    gender: 'male' as 'male' | 'female',
    birthPlace: '',
    calendarType: 'solar' as 'solar' | 'lunar'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 监听结果加载完成，跳转到结果页面
  useEffect(() => {
    if (showResults) {
      navigate('/numerology/ziwei/result');
    }
  }, [showResults, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.birthDate || !formData.birthPlace) {
      return;
    }

    await processNumerologyData('ziwei', {
      fullName: formData.fullName,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      gender: formData.gender,
      calendarType: formData.calendarType
    });
  };

  return (
    <NumerologyTestContainer>
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your ZiWei Chart</h3>
            <p className="text-white/90 mb-4">
              Please wait while we calculate your ZiWei DouShu chart based on your birth information...
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
        <Breadcrumb items={getBreadcrumbConfig('/numerology/ziwei')} />
        
        {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                ZiWei Analysis
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Discover your destiny through the ancient art of ZiWei DouShu
              </p>
            </div>
            <button onClick={() => navigate('/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-red-900 font-semibold hover:bg-white/80 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-8 rounded-lg">
            <h3 className="text-xl font-bold text-red-900 mb-6">Your Birth Information</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Birth Date *</label>
                <DateInput
                  value={formData.birthDate}
                  onChange={(value) => handleInputChange('birthDate', value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Birth Time */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Birth Time *</label>
                <TimeInput
                  value={formData.birthTime}
                  onChange={(value) => handleInputChange('birthTime', value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Birth Place */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Birth Place *</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('birthPlace', e.target.value)}
                  placeholder="Enter your birth city and country"
                  className="w-full px-4 py-3 bg-white/10 border border-red-200/30 rounded-lg text-red-900 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <p className="text-red-300 text-sm mt-1">
                  Birth location affects the calculation of your ZiWei chart
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Gender *</label>
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
                    <span className="text-red-800">Male</span>
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
                    <span className="text-red-800">Female</span>
                  </label>
                </div>
              </div>

              {/* Calendar Type */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Calendar Type *</label>
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
                    <span className="text-red-800">Solar Calendar</span>
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
                    <span className="text-red-800">Lunar Calendar</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !formData.fullName || !formData.birthDate || !formData.birthPlace}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Create ZiWei Chart'}
            </Button>
          </div>
        </form>
      </div>
    </NumerologyTestContainer>
  );
};
