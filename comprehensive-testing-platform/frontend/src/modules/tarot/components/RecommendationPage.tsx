/**
 * Recommendation Page
 * 推荐页面
 */

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import { Card, Button, Breadcrumb } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/Alert';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { TarotTestContainer } from './TarotTestContainer';

export const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    loadTarotSpreads,
    tarotSpreads,
    spreadsLoaded,
    selectedCategory,
    questionText,
    error
  } = useTarotStore();
  const { isLoading } = useUnifiedTestStore();

  // 问题类型到推荐牌型的映射（基于塔罗牌专业分析）
  const categoryToSpreadMap = {
    'love': 'relationship',        // 爱情关系 → 关系牌阵（专门分析感情关系）
    'career': 'career',           // 事业工作 → 事业牌阵（专门分析职业发展）
    'finance': 'three_card',      // 财务金钱 → 三张牌（过去、现在、未来财务趋势）
    'health': 'three_card',       // 健康生活 → 三张牌（健康状态的时间线分析）
    'spiritual': 'celtic_cross',  // 精神成长 → 凯尔特十字（深度精神探索）
    'general': 'single_card'      // 一般指导 → 单张牌（简单直接的日常指导）
  };

  // 计算推荐牌型
  const recommendedSpread = useMemo(() => {
    if (!selectedCategory || !tarotSpreads.length) {
      return null;
    }
    
    const spreadId = categoryToSpreadMap[selectedCategory as keyof typeof categoryToSpreadMap];
    const spread = tarotSpreads.find(spread => spread.id === spreadId) || null;
    
    return spread;
  }, [selectedCategory, tarotSpreads]);

  // 判断是否显示推荐牌型（只有选择了问题类型且没有自定义输入时才显示）
  const shouldShowRecommendation = selectedCategory && !questionText && recommendedSpread;

  useEffect(() => {
    if (!spreadsLoaded) {
      loadTarotSpreads();
    }
  }, [spreadsLoaded, loadTarotSpreads]);

  const handleSpreadSelect = (spreadId: string) => {
    navigate(`/tarot/drawing?spread=${spreadId}`);
  };

  if (isLoading && !spreadsLoaded) {
    return <LoadingSpinner message="Loading tarot spreads..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <TarotTestContainer>
      {/* 面包屑导航 */}
      <Breadcrumb items={getBreadcrumbConfig('/tarot/recommendation')} />
      
      {/* Main Title and Description + Home button at top-right */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-3">
            Choose Your Spread
          </h1>
          <button onClick={() => navigate('/tarot')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-3xl">
          {shouldShowRecommendation 
            ? `Based on your ${selectedCategory} question, here's our recommendation:` 
            : 'Select the tarot spread that resonates with your question'
          }
        </p>
      </div>

      {/* Recommendation Section - Only show when user selected a category and didn't input custom question */}
      {shouldShowRecommendation && recommendedSpread && (
        <Card className="p-8 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">✨</span>
              <h2 className="text-3xl font-bold text-violet-900">Recommended for You</h2>
            </div>
            <div className="bg-violet-50/80 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-violet-900 mb-3">
                {recommendedSpread.name_en}
              </h3>
              <p className="text-violet-800 mb-4 text-lg">
                {recommendedSpread.description_en}
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm mb-6">
                <span className="bg-violet-50 text-violet-800 px-4 py-2 rounded-full font-semibold">
                  🎴 {recommendedSpread.card_count} Cards
                </span>
                <span className="bg-violet-50 text-violet-800 px-4 py-2 rounded-full font-semibold">📊 Level {recommendedSpread.difficulty_level}</span>
                <span className="bg-violet-50 text-violet-800 px-4 py-2 rounded-full font-semibold">⭐ Perfect for {selectedCategory} questions</span>
              </div>
              <Button
                onClick={() => handleSpreadSelect(recommendedSpread.id)}
                className="bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Use This Spread
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* All Spreads Section - 标题与原型一致 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-violet-900 text-center mb-8">
          {shouldShowRecommendation ? 'Or Choose from All Spreads' : 'Available Spreads'}
        </h2>
      </div>

      {/* Spreads Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarotSpreads.map((spread) => (
          <Card
            key={spread.id}
            onClick={() => handleSpreadSelect(spread.id)}
            className="p-6 cursor-pointer hover:transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {spread.card_count === 1 ? '🎴' : 
                 spread.card_count === 3 ? '🎴🎴🎴' : 
                 spread.card_count === 5 ? '🎴🎴🎴🎴🎴' : 
                 spread.card_count === 7 ? '🎴🎴🎴🎴🎴🎴🎴' : '🎴'}
              </div>
              <h3 className="text-xl font-bold text-violet-900 mb-2">
                {spread.name_en}
              </h3>
              <p className="text-violet-800 mb-4">
                {spread.description_en}
              </p>
              <div className="flex justify-center gap-2 mb-4">
                <span className="bg-violet-50 text-violet-800 px-2 py-1 rounded-full text-sm">
                  {spread.card_count} cards
                </span>
                <span className="bg-violet-50 text-violet-800 px-2 py-1 rounded-full text-sm">
                  Level {spread.difficulty_level}
                </span>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Card>
        ))}
      </div>

    </TarotTestContainer>
  );
};
