/**
 * Tarot Module State Management
 * 塔罗牌模块状态管理
 * 复用统一测试状态管理，添加塔罗牌特有功能
 */

import { useState, useCallback } from 'react';
import { create } from 'zustand';
import { useUnifiedTestStore } from '../../../stores/unifiedTestStore';
import type { 
  TarotCard, 
  DrawnCard, 
  TarotSpread, 
  QuestionCategory,
  TarotSession,
  TarotRecommendation,
  AIReading,
  BasicReading
} from '../types';
import { tarotService } from '../services/tarotService';
import { tarotSpreads } from '../data/tarotSpreads';

// 塔罗牌模块特有状态
interface TarotState {
  // 基础数据
  tarotCards: TarotCard[];
  questionCategories: QuestionCategory[];
  tarotSpreads: TarotSpread[];
  
  // 当前会话状态
  currentSession: TarotSession | null;
  questionText: string;
  selectedCategory: string | null;
  selectedSpread: TarotSpread | null;
  drawnCards: DrawnCard[];
  basicReading: BasicReading | null;
  aiReading: AIReading | null;
  recommendation: TarotRecommendation | null;
  
  // 加载状态
  cardsLoaded: boolean;
  categoriesLoaded: boolean;
  spreadsLoaded: boolean;
}

// 塔罗牌状态管理接口
interface TarotStore extends TarotState {
  // 状态更新方法
  // eslint-disable-next-line no-unused-vars
  setTarotState: (newState: Partial<TarotState>) => void;
  resetTarotState: () => void;
}

// 创建 Zustand store
const useTarotStoreStore = create<TarotStore>((set) => ({
  // 初始状态
  tarotCards: [],
  questionCategories: [],
  tarotSpreads: [],
  currentSession: null,
  questionText: '',
  selectedCategory: null,
  selectedSpread: null,
  drawnCards: [],
  basicReading: null,
  aiReading: null,
  recommendation: null,
  cardsLoaded: false,
  categoriesLoaded: false,
  spreadsLoaded: false,
  
  // 状态更新方法
  setTarotState: (newState) => set((currentState) => ({ ...currentState, ...newState })),
  resetTarotState: () => set({
    tarotCards: [],
    questionCategories: [],
    tarotSpreads: [],
    currentSession: null,
    questionText: '',
    selectedCategory: null,
    selectedSpread: null,
    drawnCards: [],
    basicReading: null,
    aiReading: null,
    recommendation: null,
    cardsLoaded: false,
    categoriesLoaded: false,
    spreadsLoaded: false
  })
}));

/**
 * Tarot Module State Management Hook
 * 复用统一测试状态管理，添加塔罗牌特有功能
 */
export const useTarotStore = () => {
  // 直接使用统一测试状态管理
  const unifiedStore = useUnifiedTestStore();
  
  // 使用 Zustand store 管理塔罗牌状态
  const tarotStore = useTarotStoreStore();
  
  // 请求跟踪
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  
  // 从统一Store获取基础状态
  const {
    testHistory,
    currentTestResult,
    error,
    currentTestType,
    showResults,
    lastUpdated
  } = unifiedStore;
  
  // 使用统一Store的基础方法
  const {
    setLoading,
    setError,
    setCurrentTestType,
    setShowResults,
    setCurrentTestResult,
    clearError
  } = unifiedStore;
  
  // 加载塔罗牌数据 - 加载完整的78张牌
  const loadTarotCards = useCallback(async () => {
    if (tarotStore.cardsLoaded) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 直接加载完整的78张塔罗牌数据
      const { allTarotCards } = await import('../data/tarotCards');
      
      // 设置完整数据
      tarotStore.setTarotState({
        tarotCards: allTarotCards,
        cardsLoaded: true
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tarot cards';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tarotStore.cardsLoaded, setLoading, setError]);
  
  // 加载问题分类
  const loadQuestionCategories = useCallback(async () => {
    if (tarotStore.categoriesLoaded) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await tarotService.getQuestionCategories();
      if (response.success && response.data) {
        tarotStore.setTarotState({
          questionCategories: response.data || [],
          categoriesLoaded: true
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load question categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tarotStore.categoriesLoaded, setLoading, setError]);
  
  // 加载牌阵配置
  const loadTarotSpreads = useCallback(async () => {
    if (tarotStore.spreadsLoaded) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 直接使用本地数据
      tarotStore.setTarotState({
        tarotSpreads: tarotSpreads,
        spreadsLoaded: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tarot spreads';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tarotStore.spreadsLoaded, setLoading, setError]);
  
  // 设置问题文本
  const setQuestionText = useCallback((text: string) => {
    tarotStore.setTarotState({
      questionText: text
    });
  }, [tarotStore]);
  
  // 选择问题分类
  const selectCategory = useCallback((categoryId: string) => {
    tarotStore.setTarotState({
      selectedCategory: categoryId
    });
  }, [tarotStore]);
  
  // 获取推荐
  const getRecommendation = useCallback(async (categoryId: string, questionText?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tarotService.getRecommendation({
        categoryId,
        ...(questionText && { questionText }),
        language: 'en'
      });
      
      if (response.success && response.data) {
        tarotStore.setTarotState({
          recommendation: response.data || null
        });
        return response.data;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get recommendation';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);
  
  // 使用预选卡牌进行解读 - 完全使用统一测试系统
  const processSelectedCards = useCallback(async (spreadId: string, drawnCards: DrawnCard[]) => {
    const requestId = `process_${spreadId}_${Date.now()}`;
    if (unifiedStore.isLoading) { 
      return; 
    }

    // 添加最小加载时间，确保用户能看到加载弹窗
    const minLoadingTime = 2000; // 2秒
    const startTime = Date.now();

    try {
      setCurrentRequestId(requestId);
      setLoading(true);
      setError(null);

      // 使用统一测试类型
      const testType = 'tarot';
      await unifiedStore.startTest(testType);

      const spread = tarotStore.tarotSpreads.find(s => s.id === spreadId);
      if (!spread) { 
        throw new Error('Spread not found'); 
      }

      // 将卡牌数据转换为统一测试系统的答案格式
      const answers = drawnCards.map((drawnCard, index) => ({
        questionId: `tarot_card_${index + 1}`,
        answer: {
          card: drawnCard.card,
          position: drawnCard.position,
          isReversed: drawnCard.isReversed,
          spreadType: spread.name_en,
          questionText: tarotStore.questionText,
          questionCategory: tarotStore.selectedCategory || 'general'
        },
        timestamp: new Date().toISOString()
      }));

      // 提交所有答案到统一测试系统
      for (const answer of answers) {
        unifiedStore.submitAnswer(answer.questionId, answer.answer);
      }

      // 结束测试，这会自动调用AI分析
      const testResult = await unifiedStore.endTest();
      
      if (testResult) {
        // 创建完整的会话数据
        const sessionData = {
          id: testResult.result.sessionId || `tarot_${Date.now()}`,
          questionText: tarotStore.questionText,
          questionCategory: tarotStore.selectedCategory || '',
          selectedSpread: spread,
          drawnCards: drawnCards,
          basicReading: testResult.result.basicReading || {
            summary: 'Basic reading completed',
            key_themes: drawnCards.map(card => card.card.name_en),
            general_advice: 'Review the cards for guidance'
          },
          // AI分析结果可能在不同的字段中
          aiReading: testResult.result.aiReading || 
                    testResult.result.overall_interpretation ? {
                      sessionId: testResult.result.sessionId || `tarot_${Date.now()}`,
                      overall_interpretation: testResult.result.overall_interpretation,
                      card_interpretations: testResult.result.card_interpretations || [],
                      synthesis: testResult.result.synthesis,
                      action_guidance: testResult.result.action_guidance || [],
                      timing_advice: testResult.result.timing_advice,
                      emotional_insights: testResult.result.emotional_insights,
                      spiritual_guidance: testResult.result.spiritual_guidance,
                      warning_signs: testResult.result.warning_signs,
                      opportunities: testResult.result.opportunities,
                      generated_at: testResult.result.generated_at || new Date().toISOString()
                    } : null,
          createdAt: new Date().toISOString()
        };

        // 更新塔罗模块状态
        tarotStore.setTarotState({
          currentSession: sessionData,
          drawnCards: drawnCards,
          basicReading: testResult.result.basicReading,
          selectedSpread: spread,
          aiReading: sessionData.aiReading
        });

        setCurrentTestResult(testResult);
        setShowResults(true);
        
        // 确保最小加载时间
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // 现在设置加载完成
        setLoading(false);
        
      } else {
        throw new Error('No test result returned from unified store');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process cards';
      setError(errorMessage);
      
      // 确保最小加载时间
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setLoading(false);
    } finally {
      setCurrentRequestId(null);
    }
  }, [unifiedStore.isLoading, currentRequestId, tarotStore.questionText, tarotStore.selectedCategory, tarotStore.tarotSpreads, unifiedStore, setCurrentRequestId, setLoading, setError, setCurrentTestResult, setShowResults]);
  
  // 获取AI解读 - 现在通过统一测试系统自动处理
  const getAIReading = useCallback(async () => {
    // AI解读现在通过统一测试系统自动处理
    // 在 processSelectedCards 中，AI分析已经通过 unifiedStore.endTest() 自动完成
    // 这里只需要从 currentTestResult 中获取 AI 分析结果
    const currentResult = unifiedStore.currentTestResult;
    if (currentResult && currentResult.result && currentResult.result.aiReading) {
      tarotStore.setTarotState({
        aiReading: currentResult.result.aiReading
      });
    }
  }, [unifiedStore, tarotStore]);
  
  // 提交反馈
  const submitFeedback = useCallback(async (sessionId: string, feedback: 'like' | 'dislike') => {
    try {
      await tarotService.submitFeedback(sessionId, feedback);
    } catch (error) {
      // 忽略反馈提交错误
    }
  }, []);
  
  // 重置塔罗牌分析
  const resetTarotAnalysis = useCallback(() => {
    // 重置统一Store
    unifiedStore.resetTest();
    
    // 重置塔罗牌特有状态
    tarotStore.resetTarotState();
  }, [unifiedStore]);
  
  // 返回合并的状态和方法
  return {
    // 统一Store状态
    testHistory,
    currentTestResult,
    error,
    currentTestType,
    showResults,
    lastUpdated,
    
    // 塔罗牌特有状态
    ...tarotStore,
    
    // 统一Store方法
    setLoading,
    setError,
    setCurrentTestType,
    setShowResults,
    setCurrentTestResult,
    clearError,
    
    // 塔罗牌特有方法
    loadTarotCards,
    loadQuestionCategories,
    loadTarotSpreads,
    setQuestionText,
    selectCategory,
    getRecommendation,
    processSelectedCards,
    getAIReading,
    submitFeedback,
    resetTarotAnalysis,
    
    // 使用统一Store的其他方法
    pauseTest: unifiedStore.pauseTest,
    resumeTest: unifiedStore.resumeTest,
    goToNextQuestion: unifiedStore.goToNextQuestion,
    goToPreviousQuestion: unifiedStore.goToPreviousQuestion,
    getCurrentQuestion: unifiedStore.getCurrentQuestion,
  };
};
