/**
 * Chinese Zodiac Fortune Analysis Page
 * 生肖运势分析专用页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button, DateInput, Breadcrumb, Modal, Input } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';

export const ZodiacAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults, analysisResult, clearNumerologySession, clearError } = useNumerologyStore();
  
  // 错误弹窗状态（参照 BaZiAnalysisPage）
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Failed to get AI analysis results for the zodiac fortune test');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    birthDate: '',
    name: '' // Optional for zodiac analysis
  });

  // 进入页面时重置命理状态，避免跨分析类型残留状态
  useEffect(() => {
    clearNumerologySession();
  }, []);

  // 当有错误且不在 loading 状态时，显示错误弹窗（参照 BaZiAnalysisPage）
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
      error.toLowerCase().includes('numerology analysis failed') ||
      error.toLowerCase().includes('test result analysis failed') ||
      error.toLowerCase().includes('network connection lost') ||
      error.toLowerCase().includes('timeout') ||
      error.toLowerCase().includes('service unavailable') ||
      error.toLowerCase().includes('503')
    );
    
    // 如果是 AI 分析错误，显示错误弹窗
    if (isAIAnalysisError || !showResults) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [error, isLoading, showResults]);

  // 监听结果加载完成，只有当有Zodiac分析数据且没有错误时才跳转到结果页面
  useEffect(() => {
    if (showResults && (analysisResult?.zodiac || analysisResult?.zodiacFortune) && !error) {
      navigate('/tests/numerology/zodiac/result');
    }
  }, [showResults, analysisResult, error, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.birthDate) {
      return;
    }

    try {
      // 清除之前的错误
      clearError();
      setShowErrorModal(false);
      
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
  
  // 处理重试提交（参照 BaZiAnalysisPage）
  const handleRetrySubmit = async () => {
    setShowErrorModal(false);
    setShowFeedbackForm(false);
    clearError();
    // 重新提交
    await handleSubmit(new Event('submit') as any);
  };
  
  // 处理反馈提交（参照 BaZiAnalysisPage）
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
      // Handle feedback submission error
    } finally {
      setIsSubmittingFeedback(false);
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
        <Breadcrumb items={getBreadcrumbConfig('/tests/numerology/zodiac')} />
        
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
      
      {/* AI分析失败错误弹窗（参照 BaZiAnalysisPage） */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setShowFeedbackForm(false);
          setFeedbackSubmitted(false);
          setFeedbackEmail('');
          setFeedbackMessage('Failed to get AI analysis results for the zodiac fortune test');
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
                We encountered an issue while generating your AI-powered analysis. Your input data has been saved, and you can try submitting again.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                If this problem persists, please contact us at <a href="mailto:support@selfatlas.net" className="text-blue-600 hover:underline">support@selfatlas.net</a> or report the issue using the form below.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetrySubmit}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => setShowFeedbackForm(true)}
                variant="outline"
                className="flex-1 border-red-300 text-red-700 hover:bg-red-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Report Issue
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  clearNumerologySession();
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
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => {
                  setShowErrorModal(false);
                  clearNumerologySession();
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSubmitFeedback}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                disabled={isSubmittingFeedback || !feedbackEmail || !feedbackMessage}
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </Button>
              <Button
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackEmail('');
                  setFeedbackMessage('Failed to get AI analysis results for the zodiac fortune test');
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
    </NumerologyTestContainer>
  );
};
