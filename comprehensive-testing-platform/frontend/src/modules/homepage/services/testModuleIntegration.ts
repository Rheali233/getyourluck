import { getApiBaseUrl } from '@/config/environment';

/**
 * 测试模块集成服务
 * 负责与7个测试模块的数据接口集成和状态管理
 */

import type { 
  TestModule
} from '../types';

// 测试模块配置
export const TEST_MODULES = {
  psychology: {
    id: 'psychology',
    name: 'Psychology Tests',
    description: 'Discover your personality secrets',
    icon: '🧠',
    color: 'blue',
    route: '/tests/psychology',
    features: ['MBTI', 'Depression', 'EQ']
  },
  astrology: {
    id: 'astrology',
    name: 'Astrology Analysis',
    description: 'Know your daily fortune',
    icon: '⭐',
    color: 'purple',
    route: '/tests/astrology',
    features: ['Zodiac Matching', 'Fortune']
  },
  tarot: {
    id: 'tarot',
    name: 'Tarot Reading',
    description: 'Mysterious tarot reveals your heart',
    icon: '🔮',
    color: 'indigo',
    route: '/tests/tarot',
    features: ['Online Drawing', 'Interpretation']
  },
  career: {
    id: 'career',
    name: 'Career Planning',
    description: 'Find your perfect career path',
    icon: '💼',
    color: 'green',
    route: '/tests/career',
    features: ['Holland Code', 'DISC Test']
  },
  numerology: {
    id: 'numerology',
    name: 'Numerology Analysis',
    description: 'Calculate your good fortune',
    icon: '🔢',
    color: 'orange',
    route: '/tests/numerology',
    features: ['BaZi', 'Chinese Zodiac', 'Name Analysis']
  },
  learning: {
    id: 'learning',
    name: 'Learning Assessment',
    description: 'Discover your learning superpowers',
    icon: '📚',
    color: 'teal',
    route: '/tests/learning',
    features: ['Learning Style']
  },
  relationship: {
    id: 'relationship',
    name: 'Relationship Tests',
    description: 'Understand your love code',
    icon: '💕',
    color: 'pink',
    route: '/tests/relationship',
    features: ['Love Type', 'Communication Style']
  }
} as const;

export type TestModuleId = keyof typeof TEST_MODULES;

/**
 * 获取所有测试模块信息
 */
export const getAllTestModules = (): TestModule[] => {
  return Object.values(TEST_MODULES).map(module => ({
    id: module.id,
    name: module.name,
    description: module.description,
    icon: module.icon,
    theme: module.id as TestModule['theme'],
    testCount: 0,
    rating: 4.5,
    isActive: true,
    route: module.route,
    features: [...module.features],
    estimatedTime: '10-15 minutes'
  }));
};

/**
 * 根据ID获取测试模块信息
 */
export const getTestModuleById = (id: TestModuleId): TestModule | null => {
  const module = TEST_MODULES[id];
  if (!module) return null;

  return {
    id: module.id,
    name: module.name,
    description: module.description,
    icon: module.icon,
    theme: module.id as TestModule['theme'],
    testCount: 0,
    rating: 4.5,
    isActive: true,
    route: module.route,
    features: [...module.features],
    estimatedTime: '10-15 minutes'
  };
};

/**
 * 获取测试模块统计数据
 */
export const getTestModuleStats = async (moduleId: TestModuleId): Promise<any | null> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/${moduleId}/stats`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    // 使用受控错误输出，避免直接使用 console
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return null;
  }
};

/**
 * 获取所有测试模块的统计数据
 */
export const getAllTestModuleStats = async (): Promise<Record<TestModuleId, any>> => {
  const stats: Record<TestModuleId, any> = {} as Record<TestModuleId, any>;
  
  const promises = Object.keys(TEST_MODULES).map(async (moduleId) => {
    const moduleStats = await getTestModuleStats(moduleId as TestModuleId);
    if (moduleStats) {
      stats[moduleId as TestModuleId] = moduleStats;
    }
  });
  
  await Promise.all(promises);
  return stats;
};

/**
 * 获取测试模块评分
 */
export const getTestModuleRating = async (moduleId: TestModuleId): Promise<any | null> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/${moduleId}/rating`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return null;
  }
};

/**
 * 获取测试模块使用情况
 */
export const getTestModuleUsage = async (moduleId: TestModuleId): Promise<any | null> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/${moduleId}/usage`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return null;
  }
};

/**
 * 获取个性化推荐
 */
export const getPersonalizedRecommendations = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/homepage/recommendations`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return [];
  }
};

/**
 * 记录测试模块访问
 */
export const recordModuleVisit = async (moduleId: TestModuleId): Promise<boolean> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/homepage/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: 'module_visit',
        moduleId,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId()
      })
    });
    
    return response.ok;
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return false;
  }
};

/**
 * 获取会话ID
 */
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

/**
 * 检查测试模块是否可用
 */
export const checkModuleAvailability = async (moduleId: TestModuleId): Promise<boolean> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/${moduleId}/status`);
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.success ? data.data.isAvailable : false;
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return false;
  }
};

/**
 * 获取热门测试模块
 */
export const getPopularTestModules = async (limit: number = 6): Promise<TestModule[]> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/popular?limit=${limit}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return [];
  }
};

/**
 * 获取新发布的测试模块
 */
export const getNewTestModules = async (limit: number = 4): Promise<TestModule[]> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/homepage/modules/new?limit=${limit}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    if (process.env['NODE_ENV'] === 'development') {
      // eslint-disable-next-line no-console
      }
    return [];
  }
};
