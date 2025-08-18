/**
 * 首页模块状态管理
 * 遵循统一开发标准的Zustand状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HomepageModuleState } from '../types';

// 默认用户偏好
const defaultUserPreferences = {
  language: 'zh-CN' as const,
  theme: 'auto' as const,
  cookiesConsent: false,
  analyticsConsent: false,
  marketingConsent: false,
};

// 默认首页配置
const defaultConfig = {
  heroSection: {
    title: '发现真实的自己，遇见更好的未来',
    subtitle: '🌟 通过趣味心理测试和AI智能分析，3分钟get你的性格密码！',
    description: '还在为"我是谁？"而困惑吗？想知道什么职业最适合你？无需注册，测完就走，专业报告即刻到手 ✨',
    features: ['🔬 科学靠谱', '🎯 准到心坎', '🔒 绝对保密', '⚡ 秒出结果', '📱 随时随地'],
    ctaText: '开始测试',
    ctaRoute: '/tests',
  },
  testModules: [
    {
      id: 'psychology',
      name: '心理健康测试',
      description: '揭秘你的性格密码',
      icon: '🧠',
      theme: 'psychology' as const,
      testCount: 1200,
      rating: 4.8,
      isActive: true,
      route: '/tests/psychology',
      features: ['MBTI', '抑郁', '情商'],
      estimatedTime: '3-5分钟',
    },
    {
      id: 'astrology',
      name: '星座运势分析',
      description: '今日运势早知道',
      icon: '⭐',
      theme: 'astrology' as const,
      testCount: 2100,
      rating: 4.7,
      isActive: true,
      route: '/tests/astrology',
      features: ['星座配对', '运势'],
      estimatedTime: '1-2分钟',
    },
    {
      id: 'tarot',
      name: '塔罗牌占卜',
      description: '神秘塔罗解心事',
      icon: '🔮',
      theme: 'tarot' as const,
      testCount: 890,
      rating: 4.6,
      isActive: true,
      route: '/tests/tarot',
      features: ['在线抽牌', '解读'],
      estimatedTime: '2-3分钟',
    },
    {
      id: 'career',
      name: '职业规划测试',
      description: '找到最适合的工作',
      icon: '📊',
      theme: 'career' as const,
      testCount: 1500,
      rating: 4.9,
      isActive: true,
      route: '/tests/career',
      features: ['霍兰德', 'DISC测试'],
      estimatedTime: '5-8分钟',
    },
    {
      id: 'numerology',
      name: '传统命理分析',
      description: '算出你的好运气',
      icon: '🧮',
      theme: 'numerology' as const,
      testCount: 756,
      rating: 4.5,
      isActive: true,
      route: '/tests/numerology',
      features: ['八字', '生肖', '姓名'],
      estimatedTime: '3-5分钟',
    },
    {
      id: 'learning',
      name: '学习能力评估',
      description: '发现学习超能力',
      icon: '📚',
      theme: 'learning' as const,
      testCount: 934,
      rating: 4.7,
      isActive: true,
      route: '/tests/learning',
      features: ['VARK', '认知测试'],
      estimatedTime: '4-6分钟',
    },
    {
      id: 'relationship',
      name: '情感关系测试',
      description: '解锁爱情密码本',
      icon: '💕',
      theme: 'relationship' as const,
      testCount: 1100,
      rating: 4.6,
      isActive: true,
      route: '/tests/relationship',
      features: ['爱之语', '恋爱风格'],
      estimatedTime: '3-4分钟',
    },
  ],
  popularTests: [
    {
      id: 'mbti',
      name: 'MBTI性格测试',
      description: '你是哪种人格？',
      testType: 'psychology',
      rating: 5.0,
      testCount: 2500,
      route: '/tests/psychology/mbti',
    },
    {
      id: 'horoscope',
      name: '今日星座运势',
      description: '今天运气如何？',
      testType: 'astrology',
      rating: 5.0,
      testCount: 3200,
      route: '/tests/astrology/daily',
    },
    {
      id: 'tarot-love',
      name: '塔罗爱情占卜',
      description: 'TA喜欢我吗？',
      testType: 'tarot',
      rating: 5.0,
      testCount: 1800,
      route: '/tests/tarot/love',
    },
    {
      id: 'depression',
      name: '抑郁症筛查',
      description: '心情还好吗？',
      testType: 'psychology',
      rating: 5.0,
      testCount: 1200,
      route: '/tests/psychology/depression',
    },
    {
      id: 'career-interest',
      name: '职业兴趣测试',
      description: '什么工作适合我？',
      testType: 'career',
      rating: 5.0,
      testCount: 1600,
      route: '/tests/career/interest',
    },
  ],
  platformFeatures: [
    {
      id: 'privacy',
      title: '隐私保护',
      description: '无需注册，数据安全',
      icon: '🔒',
      color: 'text-green-600',
    },
    {
      id: 'professional',
      title: '专业准确',
      description: '科学依据，AI驱动',
      icon: '🎯',
      color: 'text-blue-600',
    },
    {
      id: 'fast',
      title: '快速便捷',
      description: '即测即得，多端适配',
      icon: '⚡',
      color: 'text-orange-600',
    },
  ],
  blogArticles: [
    {
      id: 'mbti-guide',
      title: '如何通过MBTI了解自己的性格特点',
      excerpt: 'MBTI性格测试是了解自己的重要工具，本文将详细介绍如何解读MBTI结果...',
      content: 'MBTI（迈尔斯-布里格斯类型指标）是一种广泛使用的性格评估工具...',
      author: '心理学专家',
      publishDate: '2024-01-15',
      readCount: 1200,
      category: '心理测试',
      tags: ['MBTI', '性格测试', '心理学'],
      slug: 'mbti-personality-guide',
    },
    {
      id: 'zodiac-personality',
      title: '十二星座的性格特征和相处之道',
      excerpt: '每个星座都有独特的性格特征，了解这些特征有助于改善人际关系...',
      content: '星座学作为一门古老的学问，通过观察天象来解读人的性格...',
      author: '占星师',
      publishDate: '2024-01-10',
      readCount: 890,
      category: '星座运势',
      tags: ['星座', '性格', '人际关系'],
      slug: 'zodiac-personality-traits',
    },
  ],
  searchPlaceholder: '搜索心理测试、性格分析、星座运势...',
  hotSearches: ['MBTI测试', '今日运势', '塔罗占卜', '职业测试', '恋爱测试'],
};

/**
 * 首页模块状态管理Hook
 */
export const useHomepageStore = create<HomepageModuleState>()(
  persist(
    (set, get) => ({
      // 初始状态
      config: defaultConfig,
      stats: null,
      searchQuery: '',
      searchSuggestions: [],
      searchHistory: [],
      userPreferences: defaultUserPreferences,
      isLoading: false,
      error: null,

      // 配置管理
      loadConfig: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/homepage/config');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            set({ config: result.data, isLoading: false });
          } else {
            throw new Error(result.error || '加载配置失败');
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '加载配置失败' 
          });
        }
      },

      updateConfig: (config) => {
        const currentConfig = get().config;
        if (currentConfig) {
          set({ config: { ...currentConfig, ...config } });
        }
      },

      // 统计数据
      loadStats: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('/api/homepage/stats');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            set({ stats: result.data, isLoading: false });
          } else {
            throw new Error(result.error || '加载统计数据失败');
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '加载统计数据失败' 
          });
        }
      },

      // 搜索功能
      search: async (query) => {
        try {
          set({ isLoading: true, error: null, searchQuery: query });
          // TODO: 实现搜索API调用
          // const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
          // 添加到搜索历史
          get().addToSearchHistory(query);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : '搜索失败' 
          });
        }
      },

      getSearchSuggestions: async (_query) => {
        try {
          // TODO: 实现搜索建议API调用
          // const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
          // set({ searchSuggestions: response.data });
        } catch (error) {
          console.error('获取搜索建议失败:', error);
        }
      },

      addToSearchHistory: (query) => {
        const { searchHistory } = get();
        const newHistory = [
          { id: Date.now().toString(), query, timestamp: new Date().toISOString(), resultCount: 0 },
          ...searchHistory.filter(item => item.query !== query).slice(0, 9)
        ];
        set({ searchHistory: newHistory });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // 用户偏好
      updateUserPreferences: (preferences) => {
        const currentPreferences = get().userPreferences;
        set({ 
          userPreferences: { ...currentPreferences, ...preferences } 
        });
      },

      saveUserPreferences: async () => {
        try {
          const preferences = get().userPreferences;
          // TODO: 保存到API或本地存储
          localStorage.setItem('userPreferences', JSON.stringify(preferences));
        } catch (error) {
          console.error('保存用户偏好失败:', error);
        }
      },

      loadUserPreferences: async () => {
        try {
          // TODO: 从API或本地存储加载
          const stored = localStorage.getItem('userPreferences');
          if (stored) {
            const preferences = JSON.parse(stored);
            set({ userPreferences: { ...defaultUserPreferences, ...preferences } });
          }
        } catch (error) {
          console.error('加载用户偏好失败:', error);
        }
      },

      // 状态管理
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set({
        config: defaultConfig,
        stats: null,
        searchQuery: '',
        searchSuggestions: [],
        searchHistory: [],
        userPreferences: defaultUserPreferences,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'homepage-store',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
        searchHistory: state.searchHistory,
      }),
    }
  )
); 