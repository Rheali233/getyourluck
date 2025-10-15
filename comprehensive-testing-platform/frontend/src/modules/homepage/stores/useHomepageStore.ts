/**
 * 首页模块状态管理
 * 遵循统一开发标准的Zustand状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HomepageModuleState } from '../types';
import { getApiBaseUrl } from '@/config/environment';

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
      route: '/psychology',
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
      route: '/astrology',
      features: ['星座', '运势', '塔罗'],
      estimatedTime: '2-3分钟',
    },
    {
      id: 'tarot',
      name: '塔罗牌占卜',
      description: '神秘力量指引',
      icon: '🔮',
      theme: 'tarot' as const,
      testCount: 1800,
      rating: 4.6,
      isActive: true,
      route: '/tarot',
      features: ['塔罗', '占卜', '指引'],
      estimatedTime: '1-2分钟',
    },
    {
      id: 'career',
      name: '职业发展测试',
      description: '找到你的职业方向',
      icon: '💼',
      theme: 'career' as const,
      testCount: 1500,
      rating: 4.9,
      isActive: true,
      route: '/career',
      features: ['职业', '发展', '规划'],
      estimatedTime: '5-8分钟',
    },
    {
      id: 'numerology',
      name: '数字命理分析',
      description: '数字背后的秘密',
      icon: '🔢',
      theme: 'numerology' as const,
      testCount: 900,
      rating: 4.5,
      isActive: true,
      route: '/numerology',
      features: ['数字', '命理', '分析'],
      estimatedTime: '3-4分钟',
    },
    {
      id: 'learning',
      name: '学习能力测试',
      description: '发现你的学习风格',
      icon: '📚',
      theme: 'learning' as const,
      testCount: 800,
      rating: 4.4,
      isActive: true,
      route: '/learning',
      features: ['学习', '能力', '风格'],
      estimatedTime: '4-6分钟',
    },
    {
      id: 'relationship',
      name: '人际关系测试',
      description: '改善你的社交技能',
      icon: '💕',
      theme: 'relationship' as const,
      testCount: 1100,
      rating: 4.7,
      isActive: true,
      route: '/relationship',
      features: ['人际', '关系', '社交'],
      estimatedTime: '3-5分钟',
    },
  ],
  popularTests: [
    {
      id: 'mbti-test',
      name: 'MBTI性格测试',
      description: '16种人格类型，发现真实的自己',
      testType: 'psychology',
      rating: 4.8,
      testCount: 50000,
      image: '/images/tests/mbti.jpg',
      route: '/psychology/mbti',
    },
    {
      id: 'daily-fortune',
      name: '今日运势',
      description: '每日星座运势，把握每一天',
      testType: 'astrology',
      rating: 4.6,
      testCount: 30000,
      image: '/images/tests/fortune.jpg',
      route: '/astrology/fortune',
    },
    {
      id: 'tarot-reading',
      name: '塔罗牌占卜',
      description: '神秘塔罗，指引人生方向',
      testType: 'tarot',
      rating: 4.5,
      testCount: 25000,
      image: '/images/tests/tarot.jpg',
      route: '/tarot/reading',
    },
    {
      id: 'career-guidance',
      name: '职业指导测试',
      description: '找到最适合你的职业道路',
      testType: 'career',
      rating: 4.9,
      testCount: 20000,
      image: '/images/tests/career.jpg',
      route: '/career/guidance',
    },
  ],
  platformFeatures: [
    {
      id: 'ai-analysis',
      title: 'AI智能分析',
      description: '基于大数据和机器学习，提供精准的性格分析',
      icon: '🤖',
      color: 'blue',
    },
    {
      id: 'privacy-protection',
      title: '隐私保护',
      description: '严格的数据加密和隐私保护，你的信息绝对安全',
      icon: '🔒',
      color: 'green',
    },
    {
      id: 'instant-results',
      title: '即时结果',
      description: '无需等待，测试完成后立即获得详细分析报告',
      icon: '⚡',
      color: 'yellow',
    },
    {
      id: 'mobile-friendly',
      title: '移动优先',
      description: '完美适配手机、平板、电脑，随时随地开始测试',
      icon: '📱',
      color: 'purple',
    },
  ],
  blogArticles: [
    {
      id: 'mbti-guide',
      title: 'MBTI性格测试完全指南',
      excerpt: '深入了解16种人格类型，发现你的性格密码...',
      content: 'MBTI（Myers-Briggs Type Indicator）是世界上最广泛使用的性格测试工具...',
      author: '心理学专家',
      publishDate: '2024-01-15',
      readCount: 1500,
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
      userPreferences: defaultUserPreferences,
      isLoading: false,
      error: null,

      // 配置管理
      loadConfig: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`${getApiBaseUrl()}/api/homepage/config`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            set({ config: result.data, isLoading: false });
          } else {
            throw new Error(result.error || 'Failed to load config');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load config',
            isLoading: false 
          });
        }
      },

      updateConfig: (newConfig) => {
        set((state) => ({
          config: state.config ? { ...state.config, ...newConfig } : null
        }));
      },

      // 统计数据
      loadStats: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch(`${getApiBaseUrl()}/api/homepage/stats`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result.success) {
            set({ stats: result.data, isLoading: false });
          } else {
            throw new Error(result.error || 'Failed to load stats');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load stats',
            isLoading: false 
          });
        }
      },

      // 用户偏好
      updateUserPreferences: (newPreferences) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...newPreferences }
        }));
      },

      saveUserPreferences: async () => {
        try {
          const { userPreferences } = get();
          const response = await fetch(`${getApiBaseUrl()}/api/user/preferences`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPreferences),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || 'Failed to save preferences');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save preferences'
          });
        }
      },

      loadUserPreferences: async () => {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/user/preferences`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          if (result.success && result.data) {
            set({ userPreferences: { ...defaultUserPreferences, ...result.data } });
          }
        } catch (error) {
          // 使用默认偏好，不设置错误状态
        }
      },

      // 状态管理
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      reset: () => {
        set({
          config: defaultConfig,
          stats: null,
          userPreferences: defaultUserPreferences,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: 'homepage-store',
      partialize: (state) => ({
        userPreferences: state.userPreferences,
      }),
    }
  )
);