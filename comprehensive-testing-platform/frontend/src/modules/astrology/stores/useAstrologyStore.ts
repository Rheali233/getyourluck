/**
 * Astrology Module State Management
 * 复用统一测试状态管理，添加星座特有功能
 */

import { useState } from 'react';
import { useUnifiedTestStore } from '../../../stores/unifiedTestStore';

// 星座模块特有状态
interface AstrologyState {
  zodiacSigns: any[];
  selectedZodiacSign: string | null;
  selectedDate: string | null;
  fortuneReading: any | null;
  compatibilityAnalysis: any | null;
  birthChart: any | null;
  analysisType: string | null;
}

/**
 * 星座测试状态管理Hook
 * 复用统一测试状态管理，添加星座特有功能
 */
export const useAstrologyStore = () => {
  // 直接使用统一测试状态管理
  const unifiedStore = useUnifiedTestStore();
  
  // 星座特有状态
  const [astrologyState, setAstrologyState] = useState<AstrologyState>({
    zodiacSigns: [],
    selectedZodiacSign: null,
    selectedDate: null,
    fortuneReading: null,
    compatibilityAnalysis: null,
    birthChart: null,
    analysisType: null
  });

  // 加载星座列表
  const loadZodiacSigns = async () => {
    // 暂时空实现
  };

  // 选择星座
  const selectZodiacSign = (sign: string) => {
    setAstrologyState(prev => ({ ...prev, selectedZodiacSign: sign }));
  };

  // 设置日期
  const setDate = (date: string) => {
    setAstrologyState(prev => ({ ...prev, selectedDate: date }));
  };

  // 获取运势
  const getFortune = async () => {
    // 暂时空实现
  };

  // 获取兼容性分析
  const getCompatibility = async (partnerSign: string) => {
    // 暂时空实现
  };

  // 获取出生图
  const getBirthChart = async (birthDate: string, birthTime: string, birthPlace: string) => {
    // 暂时空实现
  };

  // 提交反馈
  const submitFeedback = async (feedback: any) => {
    // 暂时空实现
  };

  // 重置分析
  const resetAnalysis = () => {
    setAstrologyState(prev => ({
      ...prev,
      fortuneReading: null,
      compatibilityAnalysis: null,
      birthChart: null,
      analysisType: null
    }));
  };
  
  // 返回合并的状态和方法
  return {
    // 统一Store状态
    currentSession: unifiedStore.currentSession,
    testHistory: unifiedStore.testHistory,
    currentTestResult: unifiedStore.currentTestResult,
    isLoading: unifiedStore.isLoading,
    error: unifiedStore.error,
    currentTestType: unifiedStore.currentTestType,
    showResults: unifiedStore.showResults,
    lastUpdated: unifiedStore.lastUpdated,
    
    // 星座特有状态
    ...astrologyState,
    
    // 统一Store方法
    setLoading: unifiedStore.setLoading,
    setError: unifiedStore.setError,
    setCurrentTestType: unifiedStore.setCurrentTestType,
    setShowResults: unifiedStore.setShowResults,
    setCurrentTestResult: unifiedStore.setCurrentTestResult,
    clearError: unifiedStore.clearError,
    
    // 星座特有方法
    loadZodiacSigns,
    selectZodiacSign,
    setDate,
    getFortune,
    getCompatibility,
    getBirthChart,
    submitFeedback,
    resetAnalysis,
    
    // 使用统一Store的其他方法
    pauseTest: unifiedStore.pauseTest,
    resumeTest: unifiedStore.resumeTest,
    goToNextQuestion: unifiedStore.goToNextQuestion,
    goToPreviousQuestion: unifiedStore.goToPreviousQuestion,
    getCurrentQuestion: unifiedStore.getCurrentQuestion,
  };
};