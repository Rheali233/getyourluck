/**
 * Chinese Name Recommendation Page
 * 中文名字推荐页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button, Breadcrumb } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { ChineseNameRecommendationInput } from '../types';

export const NameAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults, analysisResult } = useNumerologyStore();
  
  const [formData, setFormData] = useState<ChineseNameRecommendationInput>({
    originalName: '',
    gender: 'male',
    age: 25,
    personality: '',
    profession: '',
    interests: '',
    desiredMeaning: '',
    culturalPreference: 'balanced',
    usageContext: 'personal'
  });

  // 监听结果加载完成，只有当有Chinese Name Recommendation数据时才跳转到结果页面
  useEffect(() => {
    if (showResults && analysisResult?.chineseNameRecommendation) {
      navigate('/tests/numerology/name/result');
    }
  }, [showResults, analysisResult, navigate]);

  const handleInputChange = (field: keyof ChineseNameRecommendationInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.originalName || !formData.personality || !formData.profession || !formData.desiredMeaning) {
      return;
    }

    try {
      await processNumerologyData('name', {
        fullName: formData.originalName,
        birthDate: '1990-01-01',
        birthTime: '',
        gender: formData.gender,
        calendarType: 'solar',
        // 添加中文名字推荐的特殊字段
        chineseNameRecommendation: formData
      });
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
            <h3 className="text-xl font-bold text-white mb-2">Getting Your Chinese Names</h3>
            <p className="text-red-100 text-sm mb-4">
              Analyzing your characteristics and preferences...
            </p>
            <div className="flex items-center justify-center space-x-2 text-red-200 text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={getBreadcrumbConfig('/tests/numerology/name')} />
        
        {/* Main Title and Description - 左对齐 + 右上角返回按钮 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                Chinese Name Recommendation
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                Get personalized Chinese name recommendations based on your characteristics
              </p>
            </div>
            <button onClick={() => navigate('/tests/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-red-900 font-semibold hover:bg-white/80 transition ml-4">
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
            <h3 className="text-xl font-bold text-red-900 mb-6">Tell Us About Yourself</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基础信息 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Basic Information</h4>
                
                <div>
                  <label className="block text-red-900 font-medium mb-2">Your Original Name *</label>
                  <input
                    type="text"
                    value={formData.originalName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('originalName', e.target.value)}
                    placeholder="e.g., John Smith"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Age *</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 25 : parseInt(value, 10);
                      handleInputChange('age', isNaN(numValue) ? 25 : numValue);
                    }}
                    min="1" max="100"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* 个人特征 */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Personal Characteristics</h4>
                
                <div>
                  <label className="block text-red-900 font-medium mb-2">Your Personality *</label>
                  <input
                    type="text"
                    value={formData.personality}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('personality', e.target.value)}
                    placeholder="e.g., confident, creative, analytical"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Your Profession *</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('profession', e.target.value)}
                    placeholder="e.g., software engineer, teacher, artist"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Your Interests</label>
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('interests', e.target.value)}
                    placeholder="e.g., music, sports, reading, travel"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 期望特征 */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-lg border-b pb-2">Name Preferences</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-red-900 font-medium mb-2">Desired Meaning *</label>
                  <input
                    type="text"
                    value={formData.desiredMeaning}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('desiredMeaning', e.target.value)}
                    placeholder="e.g., wisdom, success, creativity"
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Cultural Style *</label>
                  <select
                    value={formData.culturalPreference}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('culturalPreference', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="traditional">Traditional</option>
                    <option value="modern">Modern</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-red-900 font-medium mb-2">Usage Context *</label>
                  <select
                    value={formData.usageContext}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('usageContext', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                  </select>
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
              disabled={isLoading || !formData.originalName || !formData.personality || !formData.profession || !formData.desiredMeaning}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Getting Recommendations...' : 'Get My Chinese Names'}
            </Button>
          </div>
        </form>
      </div>
    </NumerologyTestContainer>
  );
};
