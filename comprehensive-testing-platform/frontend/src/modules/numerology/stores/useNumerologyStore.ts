/**
 * Numerology Store
 * 命理分析模块状态管理
 */

import { create, type StateCreator } from 'zustand';
import { useUnifiedTestStore } from '@/stores/unifiedTestStore';
import type {
  NumerologyStore,
  NumerologyAnalysis,
  NumerologyBasicInfo,
  NumerologyAnalysisType
} from '../types';
import { withDevtools } from '@/stores/utils/devtools';

const createNumerologyState: StateCreator<NumerologyStore> = (set) => ({
  // 状态
  currentSession: null,
  isLoading: false,
  error: null,
  analysisResult: null,
  showResults: false,

  // 操作
  clearNumerologySession: () => {
    set({
      currentSession: null,
      analysisResult: null,
      showResults: false,
      error: null,
      isLoading: false
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setAnalysisResult: (analysis: NumerologyAnalysis | null) => {
    set({ analysisResult: analysis });
  },

  setShowResults: (show: boolean) => {
    set({ showResults: show });
  }
});

// 命理模块状态管理
const useNumerologyStoreStore = create<NumerologyStore>()(
  withDevtools(createNumerologyState, {
    name: 'numerology-store',
    selectState: (state) => ({
      currentSession: state.currentSession,
      analysisResult: state.analysisResult,
      showResults: state.showResults
    })
  })
);

// 命理模块状态管理 Hook
export const useNumerologyStore = () => {
  // 使用统一测试状态管理
  const unifiedStore = useUnifiedTestStore();
  const numerologyStore = useNumerologyStoreStore();


  // 处理命理分析数据提交
  const processNumerologyData = async (
    analysisType: NumerologyAnalysisType,
    inputData: NumerologyBasicInfo
  ) => {
    try {
      numerologyStore.setLoading(true);
      numerologyStore.setError(null);
      
      // 将命理数据转换为统一测试系统的答案格式
      const answers = [
        {
          questionId: 'numerology_analysis_type',
          answer: {
            type: analysisType,
            inputData: inputData
          }
        }
      ];

      // 使用统一测试系统提交测试
      unifiedStore.setLoading(true);
      unifiedStore.clearError();
      
      // 开始测试会话
      await unifiedStore.startTest('numerology');
      
      // 提交答案
      for (const answer of answers) {
        unifiedStore.submitAnswer(answer.questionId, answer.answer);
      }
      
      // 结束测试，这会自动调用AI分析
      const testResult = await unifiedStore.endTest();
      
      if (!testResult || !testResult.result) {
        throw new Error('No test result returned from unified store');
      }
      
      // 检查 AI 分析是否失败 - 必须严格检查，不允许使用默认值
      // 检查 TestResult 本身和 result 中的错误信息
      if (testResult.aiAnalysisFailed || testResult.aiError || testResult.result.aiAnalysisFailed || testResult.result.aiError) {
        // 提取友好的错误信息（优先使用 TestResult 中的错误信息）
        let errorMessage = testResult.aiError || testResult.result.aiError || 'AI analysis failed. Please try again.';
        
        // 将技术错误信息转换为用户友好的消息
        if (errorMessage.includes('ERR_CONNECTION_CLOSED') || 
            errorMessage.includes('connection closed') || 
            errorMessage.includes('Connection closed') ||
            errorMessage.includes('Network connection lost') || 
            errorMessage.includes('network')) {
          errorMessage = 'Network connection lost. The server may be processing your request. Please try again.';
        } else if (errorMessage.includes('timeout') || errorMessage.includes('Request timeout')) {
          errorMessage = 'Request timed out. The analysis is taking longer than expected. Please try again.';
        } else if (errorMessage.includes('Test result analysis failed')) {
          errorMessage = 'AI analysis failed. Please try again.';
        } else if (errorMessage.includes('503') || errorMessage.includes('Service Unavailable')) {
          errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
        }
        
        // 设置错误状态，确保停留在提交界面
        numerologyStore.setError(errorMessage);
        numerologyStore.setLoading(false);
        numerologyStore.setShowResults(false); // 确保不显示结果页面
        numerologyStore.setAnalysisResult(null); // 清除任何结果数据
        unifiedStore.setError(errorMessage);
        unifiedStore.setLoading(false);
        unifiedStore.setShowResults(false); // 确保不显示结果页面
        throw new Error(errorMessage);
      }
      
      // 检查是否有有效的 AI 分析数据 - 严格验证，不允许不完整的数据
      const aiAnalysis = testResult.result.analysis || testResult.result;
      
      // 验证 AI 分析数据的完整性
      const hasValidData = aiAnalysis && (
        // 对于 BaZi 类型，必须有 keyInsights 和 baZiAnalysis
        (analysisType === 'bazi' && aiAnalysis.keyInsights && Array.isArray(aiAnalysis.keyInsights) && aiAnalysis.keyInsights.length > 0 && aiAnalysis.baZiAnalysis) ||
        // 对于 Zodiac 类型，必须有 zodiacInfo 或 zodiacFortune
        (analysisType === 'zodiac' && (aiAnalysis.zodiacInfo || aiAnalysis.zodiacFortune)) ||
        // 对于 ZiWei 类型，必须有 ziWeiChart
        (analysisType === 'ziwei' && aiAnalysis.ziWeiChart) ||
        // 对于 Name 类型，必须有推荐数据
        (analysisType === 'name' && (aiAnalysis.primaryRecommendation || aiAnalysis.alternativeRecommendations))
      );
      
      if (!hasValidData) {
        // 如果没有有效的 AI 分析数据，视为失败，不允许使用默认值
        const errorMessage = 'AI analysis data is incomplete. Please try again.';
        numerologyStore.setError(errorMessage);
        numerologyStore.setLoading(false);
        numerologyStore.setShowResults(false); // 确保不显示结果页面
        numerologyStore.setAnalysisResult(null); // 清除任何结果数据
        unifiedStore.setError(errorMessage);
        unifiedStore.setLoading(false);
        unifiedStore.setShowResults(false); // 确保不显示结果页面
        throw new Error(errorMessage);
      }
      
      // 对于name类型，AI直接返回推荐数据，不需要从analysis字段提取
      if (analysisType === 'name') {
        const numerologyAnalysis: NumerologyAnalysis = {
          basicInfo: inputData,
          chineseNameRecommendation: aiAnalysis
        } as NumerologyAnalysis;
        
        numerologyStore.setAnalysisResult(numerologyAnalysis);
        numerologyStore.setShowResults(true);
        numerologyStore.setLoading(false); // 修复：同步设置 numerologyStore 的 loading 状态
        unifiedStore.setShowResults(true);
        unifiedStore.setCurrentTestResult(testResult);
        unifiedStore.setLoading(false);
        return;
      }
      
      // 其他类型从analysis字段提取
      const analysis = aiAnalysis.analysis || aiAnalysis;
      
      // 从AI分析结果中提取关键信息 - 只使用AI返回的数据，不使用默认值
      const numerologyAnalysis: NumerologyAnalysis = {
        basicInfo: inputData,
        // 根据分析类型提取相应的数据
        ...(analysisType === 'bazi' && (() => {
          const baZiData = extractBaZiData(analysis);
          return {
            baZi: baZiData,
            fiveElements: baZiData.fiveElements // 直接从 baZi 数据中获取
          };
        })()),
        ...(analysisType === 'zodiac' && {
          zodiac: analysis.zodiacInfo,
          zodiacFortune: analysis.zodiacFortune
        }),
        ...(analysisType === 'ziwei' && {
          ziWeiChart: analysis.ziWeiChart,
          starAnalysis: analysis.starAnalysis,
          fourTransformations: analysis.fourTransformations,
          patterns: analysis.patterns
        }),
        // 通用字段 - 只使用AI返回的数据（不使用默认值）
        wealthAnalysis: analysis.wealthAnalysis,
        relationshipAnalysis: analysis.relationshipAnalysis,
        healthAnalysis: analysis.healthAnalysis,
        fortuneAnalysis: analysis.fortuneAnalysis,
        // 允许从备选字段获取（这些字段都来自AI返回的数据）
        overallInterpretation: analysis.overallInterpretation || analysis.overview,
        personalityTraits: analysis.personalityTraits || analysis.strengths,
        careerGuidance: analysis.careerGuidance || analysis.careerSuggestions,
        relationshipAdvice: analysis.relationshipAdvice || analysis.relationshipInsights,
        healthTips: analysis.personalGrowthRecommendations,
        luckyElements: analysis.luckyElements,
        improvementSuggestions: analysis.improvementSuggestions || analysis.personalGrowthRecommendations
      };

      numerologyStore.setAnalysisResult(numerologyAnalysis);
      numerologyStore.setShowResults(true);
      numerologyStore.setLoading(false); // 修复：同步设置 numerologyStore 的 loading 状态
      unifiedStore.setShowResults(true);
      unifiedStore.setCurrentTestResult(testResult);
      unifiedStore.setLoading(false);
    } catch (error) {
      // 错误处理：确保停留在提交界面，不显示任何结果
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // 设置错误状态
      numerologyStore.setError(errorMessage);
      numerologyStore.setLoading(false);
      numerologyStore.setShowResults(false); // 确保不显示结果页面
      numerologyStore.setAnalysisResult(null); // 清除任何结果数据
      
      unifiedStore.setError(errorMessage);
      unifiedStore.setLoading(false);
      unifiedStore.setShowResults(false); // 确保不显示结果页面
      
      // 不重新抛出错误，让调用方处理（前端组件会显示错误弹窗）
      // throw error; // 注释掉，避免重复处理
    }
  };

  // 从AI分析中提取八字数据 - 必须从AI数据中提取，不允许使用默认值
  const extractBaZiData = (analysis: any) => {
    // 验证必需的数据存在
    if (!analysis.keyInsights || !Array.isArray(analysis.keyInsights) || analysis.keyInsights.length === 0) {
      throw new Error('Missing keyInsights in AI analysis data');
    }
    
    if (!analysis.baZiAnalysis) {
      throw new Error('Missing baZiAnalysis in AI analysis data');
    }
    
    // 从AI的keyInsights中提取八字信息
    const insights = analysis.keyInsights;
    
    const pillars = {
      year: insights.find((i: any) => i.pillar?.includes('Year') || i.pillar?.includes('年柱')),
      month: insights.find((i: any) => i.pillar?.includes('Month') || i.pillar?.includes('月柱')),
      day: insights.find((i: any) => i.pillar?.includes('Day') || i.pillar?.includes('日柱')),
      hour: insights.find((i: any) => i.pillar?.includes('Hour') || i.pillar?.includes('时柱'))
    };

    // 验证四柱数据都存在
    if (!pillars.year || !pillars.month || !pillars.day || !pillars.hour) {
      throw new Error('Incomplete pillar data in AI analysis');
    }

    // 从AI的baZiAnalysis中提取数据
    const baZiAnalysis = analysis.baZiAnalysis;
    
    // 验证必需的分析数据存在
    if (!baZiAnalysis.tenGods || !baZiAnalysis.dayMasterStrength || !baZiAnalysis.favorableElements || !baZiAnalysis.fiveElements) {
      throw new Error('Incomplete baZiAnalysis data in AI response');
    }


    // 辅助函数：解析天干地支信息（只显示英文）
    const getPillarInfo = (element: string) => {
      if (!element) {
        throw new Error('Missing element data in pillar information');
      }
      
      // 尝试解析 "Heavenly Stem over Earthly Branch" 格式
      const parts = element.split(' over ');
      if (parts.length < 2) {
        throw new Error(`Invalid element format: ${element}`);
      }
      
      const heavenlyElement = parts[0]?.trim();
      const earthlyElement = parts[1]?.trim();
      
      if (!heavenlyElement || !earthlyElement) {
        throw new Error(`Incomplete element data: ${element}`);
      }
        
        return {
          heavenlyStem: heavenlyElement,
          earthlyBranch: earthlyElement,
          element: heavenlyElement,
          animal: earthlyElement
      };
    };

    return {
      yearPillar: getPillarInfo(pillars.year.element),
      monthPillar: getPillarInfo(pillars.month.element),
      dayPillar: getPillarInfo(pillars.day.element),
      hourPillar: getPillarInfo(pillars.hour.element),
      // 十神分析 - 必须从AI数据中提取
      tenGods: baZiAnalysis.tenGods,
      // 日主强弱分析 - 必须从AI数据中提取
      dayMasterStrength: baZiAnalysis.dayMasterStrength,
      // 用神忌神分析 - 必须从AI数据中提取
      favorableElements: baZiAnalysis.favorableElements,
      // 五行分析 - 必须从AI数据中提取
      fiveElements: baZiAnalysis.fiveElements
    };
  };




  return {
    isLoading: numerologyStore.isLoading,
    error: numerologyStore.error,
    analysisResult: numerologyStore.analysisResult,
    showResults: numerologyStore.showResults,
    
    // 操作
    processNumerologyData,
    clearNumerologySession: numerologyStore.clearNumerologySession,
    setError: numerologyStore.setError,
    clearError: () => {
      numerologyStore.setError(null);
      unifiedStore.clearError();
    },
    setLoading: numerologyStore.setLoading
  };
};