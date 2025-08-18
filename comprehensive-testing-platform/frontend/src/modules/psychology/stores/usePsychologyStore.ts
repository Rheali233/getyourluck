/**
 * 心理测试模块状态管理
 * 遵循统一开发标准的Zustand状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PsychologyModuleState, TestType, TestStatus, TestSession, UserAnswer, BaseQuestion, TestResult } from '../types';

// 默认题库数据（简化版本，实际应从API加载）
const defaultQuestions = {
  [TestType.MBTI]: [
    {
      id: 'mbti-1',
      text: '在社交场合中，你通常：',
      type: 'single_choice' as const,
      required: true,
      order: 1,
      dimension: 'E-I' as const,
      options: [
        { id: 'mbti-1-e', text: '喜欢与很多人交谈，感到精力充沛', value: 'E' },
        { id: 'mbti-1-i', text: '更喜欢与少数人深入交谈，感到放松', value: 'I' },
      ],
    },
    {
      id: 'mbti-2',
      text: '你更倾向于：',
      type: 'single_choice' as const,
      required: true,
      order: 2,
      dimension: 'S-N' as const,
      options: [
        { id: 'mbti-2-s', text: '关注具体的事实和细节', value: 'S' },
        { id: 'mbti-2-n', text: '关注可能性和未来趋势', value: 'N' },
      ],
    },
    // 更多MBTI题目...
  ],
  [TestType.PHQ9]: [
    {
      id: 'phq9-1',
      text: '做事时提不起劲或没有兴趣',
      type: 'likert_scale' as const,
      required: true,
      order: 1,
      symptom: 'anhedonia',
      options: [
        { id: 'phq9-1-0', text: '完全不会', value: 0, description: '过去两周内完全没有这种感觉' },
        { id: 'phq9-1-1', text: '几天', value: 1, description: '过去两周内有几天有这种感觉' },
        { id: 'phq9-1-2', text: '一半以上的天数', value: 2, description: '过去两周内有一半以上的天数有这种感觉' },
        { id: 'phq9-1-3', text: '几乎每天', value: 3, description: '过去两周内几乎每天都有这种感觉' },
      ],
    },
    // 更多PHQ-9题目...
  ],
  [TestType.EQ]: [
    {
      id: 'eq-1',
      text: '我能够准确识别自己的情绪状态',
      type: 'likert_scale' as const,
      required: true,
      order: 1,
      dimension: 'self_awareness' as const,
      options: [
        { id: 'eq-1-1', text: '完全不同意', value: 1, description: '我完全无法识别自己的情绪' },
        { id: 'eq-1-2', text: '不同意', value: 2, description: '我很少能识别自己的情绪' },
        { id: 'eq-1-3', text: '中立', value: 3, description: '我有时能识别自己的情绪' },
        { id: 'eq-1-4', text: '同意', value: 4, description: '我经常能识别自己的情绪' },
        { id: 'eq-1-5', text: '完全同意', value: 5, description: '我总能准确识别自己的情绪' },
      ],
    },
    // 更多情商题目...
  ],
  [TestType.HAPPINESS]: [
    {
      id: 'happiness-1',
      text: '总的来说，我对我的生活感到满意',
      type: 'likert_scale' as const,
      required: true,
      order: 1,
      domain: 'life_balance' as const,
      options: [
        { id: 'happiness-1-1', text: '非常不同意', value: 1, description: '我对生活完全不满意' },
        { id: 'happiness-1-2', text: '不同意', value: 2, description: '我对生活不太满意' },
        { id: 'happiness-1-3', text: '有点不同意', value: 3, description: '我对生活有点不满意' },
        { id: 'happiness-1-4', text: '中立', value: 4, description: '我对生活没有特别感觉' },
        { id: 'happiness-1-5', text: '有点同意', value: 5, description: '我对生活有点满意' },
        { id: 'happiness-1-6', text: '同意', value: 6, description: '我对生活满意' },
        { id: 'happiness-1-7', text: '非常同意', value: 7, description: '我对生活非常满意' },
      ],
    },
    // 更多幸福指数题目...
  ],
};

/**
 * 心理测试模块状态管理Hook
 */
export const usePsychologyStore = create<PsychologyModuleState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentSession: null,
      testHistory: [],
      questions: defaultQuestions,
      results: {
        [TestType.MBTI]: null,
        [TestType.PHQ9]: null,
        [TestType.EQ]: null,
        [TestType.HAPPINESS]: null,
      },
      isLoading: false,
      error: null,
      currentTestType: null,
      showResults: false,

      // 测试会话管理
      startTest: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // 加载题库
          await get().loadQuestions(testType);
          
          // 创建新的测试会话
          const session: TestSession = {
            id: Date.now().toString(),
            testType,
            status: TestStatus.IN_PROGRESS,
            startTime: new Date().toISOString(),
            answers: [],
            progress: 0,
            currentQuestionIndex: 0,
            totalQuestions: get().questions[testType].length,
          };
          
          set({
            currentSession: session,
            currentTestType: testType,
            showResults: false,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '启动测试失败' 
          });
        }
      },

      pauseTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: { ...currentSession, status: TestStatus.PAUSED }
          });
        }
      },

      resumeTest: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: { ...currentSession, status: TestStatus.IN_PROGRESS }
          });
        }
      },

      endTest: async () => {
        try {
          const { currentSession } = get();
          if (!currentSession) return;

          // 生成测试结果
          const results = await get().generateResults(currentSession.testType);
          
          // 保存结果
          await get().saveResults(currentSession.testType, results);
          
          // 更新会话状态
          const updatedSession = {
            ...currentSession,
            status: TestStatus.COMPLETED,
            endTime: new Date().toISOString(),
            progress: 100,
          };
          
          // 添加到历史记录
          const updatedHistory = [updatedSession, ...get().testHistory];
          
          set({
            currentSession: null,
            testHistory: updatedHistory,
            results: {
              ...get().results,
              [currentSession.testType]: results,
            },
            showResults: true,
            currentTestType: null,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '完成测试失败' 
          });
        }
      },

      resetTest: () => {
        set({
          currentSession: null,
          currentTestType: null,
          showResults: false,
          error: null,
        });
      },

      // 答题管理
      submitAnswer: (questionId: string, answer: string | number) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const userAnswer: UserAnswer = {
          questionId,
          answer,
          timestamp: new Date().toISOString(),
        };

        const updatedAnswers = [
          ...currentSession.answers.filter(a => a.questionId !== questionId),
          userAnswer,
        ];

        const progress = (updatedAnswers.length / currentSession.totalQuestions) * 100;

        set({
          currentSession: {
            ...currentSession,
            answers: updatedAnswers,
            progress,
          },
        });
      },

      goToQuestion: (index: number) => {
        const { currentSession } = get();
        if (!currentSession || index < 0 || index >= currentSession.totalQuestions) return;

        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: index,
          },
        });
      },

      goToNextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        if (nextIndex < currentSession.totalQuestions) {
          get().goToQuestion(nextIndex);
        }
      },

      goToPreviousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const prevIndex = currentSession.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
          get().goToQuestion(prevIndex);
        }
      },

      // 题库管理
      loadQuestions: async (testType: TestType) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: 从API加载题库数据
          // const response = await api.get(`/psychology/questions/${testType}`);
          // set({ questions: { ...get().questions, [testType]: response.data } });
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '加载题库失败' 
          });
        }
      },

      getCurrentQuestion: () => {
        const { currentSession, questions, currentTestType } = get();
        if (!currentSession || !currentTestType) return null;

        const questionList = questions[currentTestType];
        if (!questionList || currentSession.currentQuestionIndex >= questionList.length) {
          return null;
        }

        return questionList[currentSession.currentQuestionIndex];
      },

      // 结果管理
      generateResults: async (testType: TestType): Promise<TestResult> => {
        const { currentSession } = get();
        if (!currentSession) {
          throw new Error('没有活跃的测试会话');
        }

        // TODO: 实现具体的结果生成逻辑
        // 这里应该根据不同的测试类型和答案计算相应的结果
        switch (testType) {
          case TestType.MBTI:
            return generateMbtiResults(currentSession);
          case TestType.PHQ9:
            return generatePhq9Results(currentSession);
          case TestType.EQ:
            return generateEqResults(currentSession);
          case TestType.HAPPINESS:
            return generateHappinessResults(currentSession);
          default:
            throw new Error('不支持的测试类型');
        }
      },

      saveResults: async (testType: TestType, results: TestResult) => {
        try {
          // TODO: 保存结果到API或本地存储
          console.log('保存测试结果:', { testType, results });
        } catch (error) {
          console.error('保存结果失败:', error);
        }
      },

      loadResults: async (testType: TestType) => {
        try {
          // TODO: 从API或本地存储加载结果
          return get().results[testType];
        } catch (error) {
          console.error('加载结果失败:', error);
          return null;
        }
      },

      // 历史管理
      loadTestHistory: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: 从API加载测试历史
          // const response = await api.get('/psychology/history');
          // set({ testHistory: response.data });
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '加载测试历史失败' 
          });
        }
      },

      deleteTestSession: async (sessionId: string) => {
        try {
          // TODO: 从API删除测试会话
          const updatedHistory = get().testHistory.filter(session => session.id !== sessionId);
          set({ testHistory: updatedHistory });
        } catch (error) {
          console.error('删除测试会话失败:', error);
        }
      },

      // 状态管理
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setCurrentTestType: (testType: TestType | null) => set({ currentTestType: testType }),
      setShowResults: (show: boolean) => set({ showResults: show }),
      reset: () => set({
        currentSession: null,
        testHistory: [],
        results: {
          [TestType.MBTI]: null,
          [TestType.PHQ9]: null,
          [TestType.EQ]: null,
          [TestType.HAPPINESS]: null,
        },
        isLoading: false,
        error: null,
        currentTestType: null,
        showResults: false,
      }),
    }),
    {
      name: 'psychology-store',
      partialize: (state) => ({
        testHistory: state.testHistory,
        results: state.results,
      }),
    }
  )
);

// 辅助函数：生成MBTI结果
function generateMbtiResults(session: TestSession) {
  // TODO: 实现MBTI结果生成逻辑
  return {
    type: 'INTJ',
    dimensions: {
      E_I: { score: 60, preference: 'I' },
      S_N: { score: 70, preference: 'N' },
      T_F: { score: 80, preference: 'T' },
      J_P: { score: 65, preference: 'J' },
    },
    description: '建筑师型人格，富有想象力和战略性的思考者...',
    strengths: ['战略思维', '独立性强', '追求完美'],
    weaknesses: ['过于理想化', '不善于表达情感'],
    careerSuggestions: ['科学家', '工程师', '战略分析师'],
    relationshipAdvice: ['需要理解和支持的伴侣'],
    developmentTips: ['培养情感表达能力', '学会团队合作'],
  };
}

// 辅助函数：生成PHQ-9结果
function generatePhq9Results(session: TestSession) {
  // TODO: 实现PHQ-9结果生成逻辑
  return {
    totalScore: 5,
    riskLevel: 'mild' as const,
    symptoms: {
      'anhedonia': 1,
      'depressed_mood': 1,
      'sleep_problems': 1,
      'fatigue': 1,
      'appetite_changes': 1,
    },
    assessment: '您目前有轻度的抑郁症状...',
    recommendations: ['保持规律作息', '增加运动量', '寻求社交支持'],
    professionalHelp: ['如果症状持续，建议咨询专业心理医生'],
    resources: ['心理健康热线', '心理咨询服务'],
    disclaimer: '本测试仅供参考，不能替代专业医疗诊断',
  };
}

// 辅助函数：生成情商结果
function generateEqResults(session: TestSession) {
  // TODO: 实现情商结果生成逻辑
  return {
    totalScore: 75,
    dimensions: {
      self_awareness: { score: 80, level: '高', description: '您对自己的情绪有很好的认知' },
      self_management: { score: 70, level: '中高', description: '您能够较好地管理自己的情绪' },
      social_awareness: { score: 75, level: '中高', description: '您对他人的情绪比较敏感' },
      relationship_management: { score: 75, level: '中高', description: '您的人际关系管理能力良好' },
    },
    overallLevel: '中高',
    strengths: ['情绪认知能力强', '人际关系良好'],
    improvementAreas: ['情绪调节技巧', '压力管理能力'],
    practicalTips: ['练习深呼吸', '培养积极思维'],
    exercises: ['情绪日记', '冥想练习'],
  };
}

// 辅助函数：生成幸福指数结果
function generateHappinessResults(session: TestSession) {
  // TODO: 实现幸福指数结果生成逻辑
  return {
    totalScore: 6.2,
    domains: {
      work: { score: 6.5, level: '满意', suggestions: ['寻找工作意义', '提升技能'] },
      relationships: { score: 7.0, level: '很满意', suggestions: ['维护重要关系', '表达感激'] },
      health: { score: 6.0, level: '满意', suggestions: ['规律运动', '健康饮食'] },
      personal_growth: { score: 6.5, level: '满意', suggestions: ['设定目标', '学习新技能'] },
      life_balance: { score: 5.5, level: '一般', suggestions: ['时间管理', '优先级排序'] },
    },
    overallLevel: '满意',
    lifeSatisfaction: '您对生活整体感到满意',
    improvementPlan: ['改善工作生活平衡', '增加运动时间'],
    dailyPractices: ['感恩练习', '积极思考'],
    longTermGoals: ['职业发展', '健康生活'],
  };
} 