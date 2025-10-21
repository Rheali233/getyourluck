/**
 * Career Module State Management - 重构版本
 * 直接使用统一测试状态管理，完全消除重复代码
 */

import { useState } from 'react';
import { useUnifiedTestStore } from '../../../stores/unifiedTestStore';
import {
  CareerTestTypeEnum,
  CareerTestType
} from '../types';
import { questionService } from '@/modules/testing/services/QuestionService';

// Default question data (temporary, will be loaded from API)
const defaultQuestions = {
  [CareerTestTypeEnum.HOLLAND]: [],
  [CareerTestTypeEnum.DISC]: [],
  [CareerTestTypeEnum.LEADERSHIP]: [],
};

/**
 * Career Module State Management Hook - 重构版本
 * 直接使用统一测试状态管理，完全消除重复代码
 */
export const useCareerStore = () => {
  // 直接使用统一测试状态管理
  const unifiedStore = useUnifiedTestStore();
  
  // Career特有的问题数据
  const [questions, setQuestions] = useState(defaultQuestions);
  
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  
  // 从统一Store获取基础状态
  const {
    currentSession,
    testHistory,
    currentTestResult,
    isLoading,
    error,
    currentTestType,
    showResults,
    lastUpdated
  } = unifiedStore;
  
  // Career特有的结果数据
  const [results, setResults] = useState({
    [CareerTestTypeEnum.HOLLAND]: null,
    [CareerTestTypeEnum.DISC]: null,
    [CareerTestTypeEnum.LEADERSHIP]: null,
  });
  
  // 使用统一Store的方法
  const {
    startTest: unifiedStartTest,
    submitAnswer: unifiedSubmitAnswer,
    endTest: unifiedEndTest,
    pauseTest: unifiedPauseTest,
    resumeTest: unifiedResumeTest,
    resetTest: unifiedResetTest,
    setLoading,
    setError,
    setCurrentTestType,
    setShowResults,
    setCurrentTestResult,
    updateProgress
  } = unifiedStore;
  
  // Career特有的方法
  const loadQuestionsFromAPI = async (testType: CareerTestType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await questionService.getQuestionsByType(testType);
      if (response.success && response.data) {
        setQuestions(prev => ({
          ...prev,
          [testType]: response.data
        }));
        setQuestionsLoaded(true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load questions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 重构后的startTest方法
  const startTest = async (testType: CareerTestType) => {
    try {
      // 使用统一Store的startTest
      await unifiedStartTest(testType);
      
      // 加载问题
      if (!questionsLoaded || !questions[testType as keyof typeof questions]?.length) {
        await loadQuestionsFromAPI(testType);
      }
      
      const currentQuestions = questions[testType as keyof typeof questions];
      if (!currentQuestions || currentQuestions.length === 0) {
        throw new Error(`Unable to load ${testType} test questions`);
      }
      
      setCurrentTestType(testType);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start test';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // 重构后的submitAnswer方法
  const submitAnswer = async (questionId: string, answer: string | number) => {
    try {
      // 使用统一Store的submitAnswer
      unifiedSubmitAnswer(questionId, answer);
      
      // Career特有的逻辑
      const currentSession = unifiedStore.currentSession;
      if (currentSession) {
        // 更新进度
        updateProgress();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // 重构后的submitTest方法
  const submitTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentSession = unifiedStore.currentSession;
      if (!currentSession) {
        throw new Error('No active test session');
      }
      
      // 使用统一Store的endTest
      const result = await unifiedEndTest();
      
      if (result) {
        setCurrentTestResult(result);
        setResults(prev => ({
          ...prev,
          [currentSession.testType]: result
        }));
      }
      
      setShowResults(true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit test';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 重构后的resetTest方法
  const resetTest = () => {
    // 使用统一Store的resetTest
    unifiedResetTest();
    
    // 重置Career特有的状态
    setQuestionsLoaded(false);
          setResults({
        [CareerTestTypeEnum.HOLLAND]: null,
        [CareerTestTypeEnum.DISC]: null,
        [CareerTestTypeEnum.LEADERSHIP]: null,
      });
  };
  
  // 返回重构后的状态和方法
  return {
    // 状态
    currentSession,
    testHistory,
    questions,
    results,
    currentTestResult,
    isLoading,
    error,
    currentTestType,
    showResults,
    lastUpdated,
    questionsLoaded,
    
    // 方法
    startTest,
    submitAnswer,
    submitTest,
    resetTest,
    loadQuestionsFromAPI,
    setCurrentTestType,
    setShowResults,
    setCurrentTestResult,
    
    // 使用统一Store的方法
    pauseTest: unifiedPauseTest,
    resumeTest: unifiedResumeTest,
    goToNextQuestion: unifiedStore.goToNextQuestion,
    goToPreviousQuestion: unifiedStore.goToPreviousQuestion,
    getCurrentQuestion: unifiedStore.getCurrentQuestion,
  };
};
