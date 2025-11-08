/**
 * Chinese Name Recommendation Page
 * 中文名字推荐页面
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button, Breadcrumb, Modal, Input } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { ChineseNameRecommendationInput } from '../types';

export const NameAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { processNumerologyData, isLoading, error, showResults, analysisResult, clearNumerologySession, clearError } = useNumerologyStore();
  
  // 错误弹窗状态（参照 BaZiAnalysisPage）
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('Failed to get AI analysis results for the Chinese name recommendation test');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
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

  // 监听结果加载完成，只有当有Chinese Name Recommendation数据且没有错误时才跳转到结果页面
  useEffect(() => {
    if (showResults && analysisResult?.chineseNameRecommendation && !error) {
      navigate('/tests/numerology/name/result');
    }
  }, [showResults, analysisResult, error, navigate]);

  const handleInputChange = (field: keyof ChineseNameRecommendationInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.originalName || !formData.personality || !formData.profession || !formData.desiredMeaning) {
      return;
    }

    try {
      // 清除之前的错误
      clearError();
      setShowErrorModal(false);
      
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
      
      {/* AI分析失败错误弹窗（参照 BaZiAnalysisPage） */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setShowFeedbackForm(false);
          setFeedbackSubmitted(false);
          setFeedbackEmail('');
          setFeedbackMessage('Failed to get AI analysis results for the Chinese name recommendation test');
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
                  setFeedbackMessage('Failed to get AI analysis results for the Chinese name recommendation test');
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
