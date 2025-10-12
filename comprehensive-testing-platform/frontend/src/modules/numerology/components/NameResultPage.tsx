/**
 * Chinese Name Recommendation Result Page
 * 中文名字推荐结果页面
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button } from '@/components/ui';
import { FeedbackFloatingWidget } from '@/components/ui/FeedbackFloatingWidget';
import { useNumerologyStore } from '../stores/useNumerologyStore';

export const NameResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult, isLoading, error } = useNumerologyStore();

  if (isLoading) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-4">Getting Your Chinese Names</h2>
            <p className="text-gray-200">Analyzing your characteristics and preferences...</p>
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
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Error</h2>
            <p className="text-gray-200 mb-6">{error}</p>
            <Button
              onClick={() => navigate('/numerology/name')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Try Again
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (!analysisResult || !analysisResult.chineseNameRecommendation) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Analysis Available</h2>
            <p className="text-gray-200 mb-6">Please complete the name recommendation analysis first.</p>
            <Button
              onClick={() => navigate('/numerology/name')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start Analysis
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  const recommendation = analysisResult.chineseNameRecommendation;

  return (
    <NumerologyTestContainer>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* 结果页面头部 */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Chinese Name Recommendations
            </h1>
            <button onClick={() => navigate('/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            Personalized names based on your characteristics
          </p>
        </div>

        {/* 主要推荐 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Primary Recommendation</h2>
          
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-red-900 mb-4">
              {recommendation.primaryRecommendation?.name || 'Loading...'}
            </div>
            
            <div className="text-xl text-gray-600 mb-6">
              {recommendation.primaryRecommendation?.pronunciation || 'Loading...'}
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              {recommendation.primaryRecommendation?.meaning || 'Loading...'}
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">Why This Name?</h4>
              <p className="text-gray-700">{recommendation.primaryRecommendation?.whyRecommended || 'Loading...'}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">Cultural Significance</h4>
              <p className="text-gray-700">{recommendation.primaryRecommendation?.culturalSignificance || 'Loading...'}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-3 text-gray-800">Usage Advice</h4>
              <p className="text-gray-700">{recommendation.primaryRecommendation?.usageAdvice || 'Loading...'}</p>
            </div>
          </div>
        </Card>

        {/* 备选推荐 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alternative Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(recommendation.alternativeRecommendations || []).map((alt, index) => {
              // 安全检查：如果alt是undefined或null，跳过渲染
              if (!alt) {
                return null;
              }
              
              return (
                <div key={index} className="border rounded-lg p-6 bg-gray-50">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {alt.name || 'Loading...'}
                    </div>
                    <div className="text-lg text-gray-600 mb-2">
                      {alt.pronunciation || 'Loading...'}
                    </div>
                    <p className="text-gray-700">
                      {alt.meaning || 'Loading...'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Why This Name?</h4>
                      <p className="text-sm text-gray-700">{alt.whyRecommended || 'Loading...'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Cultural Background</h4>
                      <p className="text-sm text-gray-700">{alt.culturalSignificance || 'Loading...'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 总体说明 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Recommendation</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {recommendation.overallExplanation || 'Loading...'}
          </p>
        </Card>

      </div>

      <FeedbackFloatingWidget testContext={{ testType: 'chinese-name-recommendation' }} />
    </NumerologyTestContainer>
  );
};