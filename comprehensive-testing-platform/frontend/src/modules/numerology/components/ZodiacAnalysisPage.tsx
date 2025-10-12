/**
 * Chinese Zodiac Fortune Analysis Page
 * 生肖运势分析专用页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button, DateInput, Breadcrumb } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';

export const ZodiacAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults } = useNumerologyStore();
  
  const [formData, setFormData] = useState({
    birthDate: '',
    name: '' // Optional for zodiac analysis
  });

  // 监听结果加载完成，跳转到结果页面
  useEffect(() => {
    if (showResults) {
      navigate('/numerology/zodiac/result');
    }
  }, [showResults, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.birthDate) {
      return;
    }

    try {
      await processNumerologyData('zodiac', {
        fullName: formData.name || 'Anonymous',
        birthDate: formData.birthDate,
        birthTime: '12:00',
        gender: 'male',
        calendarType: 'solar',
        timeframe: 'yearly' // Default to yearly fortune
      });
      // 导航通过 useEffect 自动处理
    } catch (error) {
      // Error handling is done in the store
    }
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
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Zodiac Fortune</h3>
            <p className="text-white/90 mb-4">
              Please wait while we calculate your Chinese zodiac fortune...
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
        <Breadcrumb items={getBreadcrumbConfig('/numerology/zodiac')} />
        
        {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Chinese Zodiac Fortune
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Discover your Chinese zodiac animal and get personalized yearly fortune guidance
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


              {/* Name (Optional) */}
              <div>
                <label className="block text-red-900 font-medium mb-2">Name (Optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name for personalized analysis"
                  className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
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
              disabled={isLoading || !formData.birthDate}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Get Zodiac Fortune'}
            </Button>
          </div>
        </form>
      </div>
    </NumerologyTestContainer>
  );
};
