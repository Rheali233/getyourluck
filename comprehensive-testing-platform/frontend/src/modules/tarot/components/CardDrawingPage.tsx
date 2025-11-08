/**
 * Card Drawing Page
 * 抽牌页面
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import { Card, Breadcrumb, Modal, Input, Button } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/Alert';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { TarotTestContainer } from './TarotTestContainer';
import { TarotCardSelector } from './TarotCardSelector';
import type { DrawnCard } from '../types';
import { useSEO } from '@/hooks/useSEO';
import { SEOHead } from '@/components/SEOHead';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { buildAbsoluteUrl } from '@/config/seo';

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
    showResults,
    currentSession,
    resetTarotAnalysis
  } = useTarotStore();
  const { isLoading, clearError } = useUnifiedTestStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  // 错误弹窗状态（参照 psychology 模块）
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Failed to get AI analysis results for the tarot reading');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // SEO配置
  const canonical = buildAbsoluteUrl(`/tests/tarot/drawing${spreadId ? `?spread=${spreadId}` : ''}`);
  const seoConfig = useSEO({
    testType: 'tarot',
    testId: 'drawing',
    title: 'Free AI-Powered Tarot Card Drawing & Insights | SelfAtlas',
    description: 'Draw tarot cards and receive free AI-powered interpretations. Choose single, three-card, or Celtic cross spreads for guidance tailored to your question.',
    keywords: [
      'tarot card reading',
      'tarot reading',
      'draw tarot cards',
      'tarot spread',
      'tarot interpretation',
      'free tarot reading',
      'tarot card meanings',
      'ai tarot drawing',
      'online tarot spreads'
    ],
    customConfig: {
      canonical: canonical,
      ogTitle: 'Free AI-Powered Tarot Card Drawing & Insights | SelfAtlas',
      ogDescription: 'Draw tarot cards and receive free AI-powered interpretations. Choose single, three-card, or Celtic cross spreads for guidance tailored to your question.',
      ogImage: buildAbsoluteUrl('/og-image.jpg'),
      twitterCard: 'summary_large_image'
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Tarot Card Reading Service',
      description: 'Interactive tarot card readings with multiple spread options and detailed card interpretations',
      inLanguage: 'en-US',
      provider: {
        '@type': 'Organization',
        name: 'SelfAtlas',
        url: 'https://selfatlas.net'
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
    
    // 记录页面访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'page_view',
      ...base,
      data: { 
        route: '/tests/tarot/drawing', 
        pageType: 'test',
        testType: 'tarot_drawing',
        spreadId: spreadId
      },
    });
  }, [cardsLoaded, spreadsLoaded, loadTarotCards, loadTarotSpreads, spreadId]);

  const currentSpread = tarotSpreads.find(spread => spread.id === spreadId) || tarotSpreads[0];

  // 监听结果加载完成，只有当有tarot会话和loading弹窗显示时才跳转到结果页面
  useEffect(() => {
    if (showResults && showLoadingModal && currentSession) {
      setShowLoadingModal(false);
      setIsProcessing(false);
      navigate('/tests/tarot/reading');
    }
  }, [showResults, showLoadingModal, currentSession, navigate]);
  
  // 当有错误且不在 loading 状态时，显示错误弹窗（参照 psychology 模块）
  useEffect(() => {
    if (!error || isLoading) {
      setShowErrorModal(false);
      return;
    }
    
    // 检查是否是 AI 分析错误
    const isAIAnalysisError = (
      error.toLowerCase().includes('ai analysis') ||
      error.toLowerCase().includes('ai service') ||
      error.toLowerCase().includes('analysis failed') ||
      error.toLowerCase().includes('failed to parse') ||
      error.toLowerCase().includes('ai analysis is required') ||
      error.toLowerCase().includes('tarot analysis failed') ||
      error.toLowerCase().includes('test result analysis failed')
    );
    
    // 如果是 AI 分析错误，显示错误弹窗
    if (isAIAnalysisError || !showResults) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error, isLoading, showResults]);

  const handleCardsSelected = async (drawnCards: DrawnCard[]) => {
    // 记录抽牌事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'test_start',
      ...base,
      data: { 
        testType: 'tarot_drawing',
        spreadId: spreadId,
        cardCount: drawnCards.length
      },
    });
    
    // 清除之前的错误
    clearError();
    setShowErrorModal(false);
    
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
  
  // 处理重试提交（参照 psychology 模块）
  const handleRetrySubmit = async () => {
    setShowErrorModal(false);
    setShowFeedbackForm(false);
    clearError();
    // 重新处理选中的牌（需要从当前会话中获取）
    if (currentSession?.drawnCards && currentSession?.selectedSpread) {
      setIsProcessing(true);
      setShowLoadingModal(true);
      try {
        await processSelectedCards(currentSession.selectedSpread.id, currentSession.drawnCards);
      } catch (error) {
        setShowLoadingModal(false);
        setIsProcessing(false);
      }
    }
  };
  
  // 处理反馈提交（参照 psychology 模块）
  const handleSubmitFeedback = async () => {
    if (!feedbackEmail || !feedbackMessage) {
      return;
    }
    
    setIsSubmittingFeedback(true);
    try {
      // 这里可以调用反馈 API
      // await feedbackService.submitFeedback({ email: feedbackEmail, message: feedbackMessage });
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmittingFeedback(false);
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
        <Breadcrumb items={getBreadcrumbConfig('/tests/tarot/drawing')} />
      
      {/* Main Title and Description + Home button at top-right */}
        <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900 mb-3">
            Draw Your Cards
          </h1>
          <button
            onClick={() => navigate('/tests/tarot')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold transition hover:bg-white/80 ml-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tarot Home
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-4xl">
          {currentSpread?.name_en} - {currentSpread?.card_count} cards. Select each card slowly and focus on your intention to receive the clearest guidance.
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
              Please wait while we analyze the cards and generate your personalized tarot reading. Most readings appear in under 10 seconds.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-violet-300">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI分析失败错误弹窗（参照 psychology 模块） */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setShowFeedbackForm(false);
          setFeedbackSubmitted(false);
          setFeedbackEmail('');
          setFeedbackMessage('Failed to get AI analysis results for the tarot reading');
        }}
        title={showFeedbackForm ? "Report Issue" : "Analysis Temporarily Unavailable"}
        size="medium"
        closeOnOverlayClick={false}
      >
        {!showFeedbackForm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Analysis Temporarily Unavailable
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                We encountered an issue while generating your AI-powered analysis. Your card selection has been saved, and you can try submitting again.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                If this problem persists, please contact us at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a> or report the issue using the form below.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetrySubmit}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => setShowFeedbackForm(true)}
                variant="outline"
                className="flex-1 border-violet-300 text-violet-700 hover:bg-violet-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Report Issue
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  resetTarotAnalysis();
                  navigate('/tests/tarot');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Over
              </Button>
            </div>
          </div>
        ) : feedbackSubmitted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Thank You for Your Feedback
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We've received your report and will look into this issue. You can also reach us directly at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetrySubmit}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  resetTarotAnalysis();
                  navigate('/tests/tarot');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Help Us Improve
              </h3>
              <p className="text-sm text-gray-600">
                Please provide your email and describe the issue you encountered. This will help us fix the problem quickly.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={feedbackEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeedbackEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedbackMessage(e.target.value)}
                placeholder="Describe the issue you encountered..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={4}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSubmitFeedback}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isSubmittingFeedback || !feedbackEmail || !feedbackMessage}
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackEmail('');
                  setFeedbackMessage('Failed to get AI analysis results for the tarot reading');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </TarotTestContainer>
    </>
  );
};
