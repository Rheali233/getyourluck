/**
 * Numerology Analysis Page Component
 * 命理分析页面组件
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNumerologyStore } from '../stores/useNumerologyStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Breadcrumb } from '@/components/ui';
import ErrorMessage from '@/components/ui/Alert';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { NumerologyInputForm } from './NumerologyInputForm';
import { NumerologyResultDisplay } from './NumerologyResultDisplay';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import type { NumerologyAnalysisType, NumerologyBasicInfo } from '../types';

export const NumerologyAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisType } = useParams<{ analysisType: string }>();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  const {
    processNumerologyData,
    analysisResult,
    showResults,
    isLoading,
    error,
    clearNumerologySession
  } = useNumerologyStore();

  const currentAnalysisType = (analysisType as NumerologyAnalysisType) || 'bazi';

  // 监听结果加载完成，关闭loading弹窗
  useEffect(() => {
    if (showResults && showLoadingModal) {
      setShowLoadingModal(false);
    }
  }, [showResults, showLoadingModal]);

  const handleFormSubmit = async (data: NumerologyBasicInfo) => {
    setShowLoadingModal(true);
    try {
      await processNumerologyData(currentAnalysisType, data);
    } catch (error) {
      setShowLoadingModal(false);
    }
  };

  const handleBack = () => {
    navigate('/numerology');
  };

  const handleNewAnalysis = () => {
    clearNumerologySession();
    setShowLoadingModal(false);
  };

  const getAnalysisTypeTitle = () => {
    switch (currentAnalysisType) {
      case 'bazi':
        return 'BaZi Analysis';
      case 'zodiac':
        return 'Chinese Zodiac Fortune';
      case 'name':
        return 'Name Analysis';
      case 'ziwei':
        return 'ZiWei Analysis';
      default:
        return 'Numerology Analysis';
    }
  };

  const getAnalysisTypeDescription = () => {
    switch (currentAnalysisType) {
      case 'bazi':
        return 'Analyze your birth chart and five elements based on your birth date and time';
      case 'zodiac':
        return 'Check your Chinese zodiac fortune and get personalized guidance for different periods';
      case 'name':
        return 'Analyze your name and get insights about your personality and destiny';
      case 'ziwei':
        return 'Get a comprehensive ZiWei chart analysis based on your birth information';
      default:
        return 'Get personalized numerology insights';
    }
  };

  if (isLoading && !showResults) {
    return <LoadingSpinner message="Loading numerology analysis..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (showResults && analysisResult) {
    return (
      <NumerologyTestContainer>
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbConfig(`/numerology/${currentAnalysisType}`)} />
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your {getAnalysisTypeTitle()}
            </h1>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto">
              Discover what the ancient wisdom reveals about your destiny
            </p>
          </div>

          <NumerologyResultDisplay
            analysis={analysisResult}
            onBack={handleBack}
            onNewAnalysis={handleNewAnalysis}
          />
        </div>
      </NumerologyTestContainer>
    );
  }

  return (
    <NumerologyTestContainer>
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={getBreadcrumbConfig(`/numerology/${currentAnalysisType}`)} />
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {getAnalysisTypeTitle()}
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto">
            {getAnalysisTypeDescription()}
          </p>
        </div>

        <NumerologyInputForm
          analysisType={currentAnalysisType}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Loading弹窗 */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Destiny</h3>
            <p className="text-white/90 mb-4">
              Please wait while we analyze your information and generate your personalized numerology reading...
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </NumerologyTestContainer>
  );
};
