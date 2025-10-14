/**
 * Card Drawing Page
 * 抽牌页面
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import { Card, Breadcrumb } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/Alert';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { TarotTestContainer } from './TarotTestContainer';
import { TarotCardSelector } from './TarotCardSelector';
import type { DrawnCard } from '../types';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { useKeywordOptimization } from '@/hooks/useKeywordOptimization';

export const CardDrawingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const spreadId = searchParams.get('spread') || 'single_card';
  
  const {
    loadTarotCards,
    loadTarotSpreads,
    cardsLoaded,
    spreadsLoaded,
    tarotCards,
    tarotSpreads,
    processSelectedCards,
    error,
    showResults
  } = useTarotStore();
  const { isLoading } = useUnifiedTestStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // 关键词优化
  const { optimizedTitle, optimizedDescription } = useKeywordOptimization({
    pageType: 'test',
    testType: 'tarot',
    customKeywords: ['tarot card reading', 'divination', 'spiritual guidance']
  });

  // SEO配置
  const seoConfig = useSEO({
    testType: 'tarot',
    testId: 'drawing',
    title: optimizedTitle,
    description: optimizedDescription,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Tarot Card Reading Service',
      description: 'Interactive tarot card readings with multiple spread options and detailed card interpretations',
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
      serviceType: 'Tarot Reading',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
      category: 'Divination Services'
    }
  });

  useEffect(() => {
    if (!cardsLoaded) {
      loadTarotCards();
    }
    if (!spreadsLoaded) {
      loadTarotSpreads();
    }
  }, [cardsLoaded, spreadsLoaded, loadTarotCards, loadTarotSpreads]);

  const currentSpread = tarotSpreads.find(spread => spread.id === spreadId) || tarotSpreads[0];

  // 监听结果加载完成，关闭loading弹窗
  useEffect(() => {
    if (showResults && showLoadingModal) {
      setShowLoadingModal(false);
      setIsProcessing(false);
      navigate('/tarot/reading');
    }
  }, [showResults, showLoadingModal, navigate]);

  const handleCardsSelected = async (drawnCards: DrawnCard[]) => {
    setIsProcessing(true);
    setShowLoadingModal(true);
    try {
      // 不等待 processSelectedCards 完成，让它在后台运行
      processSelectedCards(spreadId, drawnCards);
    } catch (error) {
      setShowLoadingModal(false);
      setIsProcessing(false);
    }
  };

  if (isLoading && (!cardsLoaded || !spreadsLoaded)) {
    return <LoadingSpinner message="Loading tarot data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <SEOHead config={seoConfig} />
      <TarotTestContainer>
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/tarot/drawing')} />
      
      {/* Main Title and Description + Home button at top-right */}
        <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-3">
            Draw Your Cards
          </h1>
          <button onClick={() => navigate('/tarot')} className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold hover:hover:bg-white/80 transition ml-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Center
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-4xl">
          {currentSpread?.name_en} - {currentSpread?.card_count} cards
        </p>
      </div>

      {/* Spread Information */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-violet-900 mb-4">
          {currentSpread?.name_en}
        </h2>
        <p className="text-violet-800 mb-6">
          {currentSpread?.description_en}
        </p>
        
        <div>
          <h3 className="text-lg font-bold text-violet-900 mb-4">Card Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSpread?.positions.map((position, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="bg-violet-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <span className="text-violet-900 font-medium block">{position.name}</span>
                  <p className="text-violet-800 text-sm leading-relaxed">{position.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Card Selection Area */}
      <Card className="p-8">
        {tarotCards.length > 0 && currentSpread ? (
          <TarotCardSelector
            cards={tarotCards}
            spreadPositions={currentSpread.positions}
            onCardsSelected={handleCardsSelected}
            isLoading={isProcessing}
          />
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔮</div>
            <p className="text-violet-800">Loading tarot cards...</p>
          </div>
        )}
      </Card>

      {/* Loading弹窗 */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-violet-900 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Tarot Reading</h3>
            <p className="text-violet-200 mb-4">
              Please wait while we analyze the cards and generate your personalized tarot reading...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-violet-300">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </TarotTestContainer>
    </>
  );
};
