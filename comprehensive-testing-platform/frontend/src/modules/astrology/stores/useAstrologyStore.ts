/**
 * Astrology Module State Management
 * 复用统一测试状态管理，添加星座特有功能
 */

import { useState } from 'react';
// 确保导入顺序：先导入统一 store，再导入服务
import { useUnifiedTestStore } from '../../../stores/unifiedTestStore';
import { astrologyService } from '../services/astrologyService';

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
  const getFortune = async (sign: string, timeframe: string, date?: string) => {
    try {
      // 使用统一状态管理设置loading状态
      unifiedStore.setLoading(true);
      unifiedStore.clearError();
      
      // 调用实际的API获取运势数据
      const response = await astrologyService.getFortune(sign, timeframe, date);
      
      if (response.success && response.data) {
        // 更新本地星座状态
        setAstrologyState(prev => ({ 
          ...prev, 
          fortuneReading: response.data
        }));
        
        // 更新统一状态管理
        unifiedStore.setShowResults(true);
        unifiedStore.setCurrentTestResult({
          testType: 'fortune',
          result: response.data,
          metadata: {
            processingTime: new Date().toISOString(),
            processor: 'AstrologyService'
          }
        });
        unifiedStore.setLoading(false);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get fortune reading');
      }
    } catch (error) {
      // 错误处理
      const errorMessage = error instanceof Error ? error.message : 'Failed to get fortune reading';
      unifiedStore.setError(errorMessage);
      unifiedStore.setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // 获取兼容性分析
  const getCompatibility = async (sign1: string, sign2: string, relationType: string) => {
    try {
      // 使用统一状态管理设置loading状态
      unifiedStore.setLoading(true);
      unifiedStore.clearError();
      
      // 调用实际的API获取兼容性分析数据
      const response = await astrologyService.getCompatibility(sign1, sign2, relationType);
      
      if (response.success && response.data) {
        // 更新本地星座状态
        setAstrologyState(prev => ({ 
          ...prev, 
          compatibilityAnalysis: response.data
        }));
        
        // 更新统一状态管理
        unifiedStore.setShowResults(true);
        unifiedStore.setCurrentTestResult({
          testType: 'compatibility',
          result: response.data,
          metadata: {
            processingTime: new Date().toISOString(),
            processor: 'AstrologyService'
          }
        });
        unifiedStore.setLoading(false);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get compatibility analysis');
      }
    } catch (error) {
      // 错误处理
      const errorMessage = error instanceof Error ? error.message : 'Failed to get compatibility analysis';
      unifiedStore.setError(errorMessage);
      unifiedStore.setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // 获取出生图
  const getBirthChart = async (birthData: any) => {
    try {
      unifiedStore.setLoading(true);
      unifiedStore.clearError();
      setAstrologyState(prev => ({ ...prev, analysisType: 'birth-chart' }));
      
      // 调用API获取出生图分析
      const response = await astrologyService.getBirthChart(birthData);
      
      if (response.success && response.data) {
        // 检查 AI 分析是否失败
        if (response.data.aiAnalysisFailed || response.data.aiError) {
          const errorMessage = response.data.aiError || 'AI analysis failed. Please try again.';
          unifiedStore.setError(errorMessage);
          unifiedStore.setLoading(false);
          unifiedStore.setShowResults(false); // 确保不显示结果页面
          throw new Error(errorMessage);
        }
        
        setAstrologyState(prev => ({ 
          ...prev, 
          birthChart: response.data,
          analysisType: 'birth-chart'
        }));
        
        // 更新统一Store状态
        unifiedStore.setShowResults(true);
        // 设置测试结果，而不是直接操作 currentSession
        unifiedStore.setCurrentTestResult({
          testType: 'birth-chart',
          result: response.data,
          metadata: {
            processingTime: new Date().toISOString(),
            processor: 'AstrologyService'
          }
        });
        unifiedStore.setLoading(false);
      } else {
        throw new Error(response.error || 'Failed to get birth chart analysis');
      }
    } catch (error) {
      // Log error for monitoring (in production, this would go to a logging service)
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze birth chart';
      unifiedStore.setError(errorMessage);
      unifiedStore.setLoading(false);
      unifiedStore.setShowResults(false); // 确保不显示结果页面
      throw error;
    }
  };

  // 提交反馈
  const submitFeedback = async () => {
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