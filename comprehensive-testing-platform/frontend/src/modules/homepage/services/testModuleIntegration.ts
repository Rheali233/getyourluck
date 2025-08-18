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
    name: '心理健康测试',
    nameEn: 'Psychology Tests',
    description: '揭秘你的性格密码',
    descriptionEn: 'Discover your personality secrets',
    icon: '🧠',
    color: 'blue',
    route: '/tests/psychology',
    features: ['MBTI', '抑郁', '情商'],
    featuresEn: ['MBTI', 'Depression', 'EQ']
  },
  astrology: {
    id: 'astrology',
    name: '星座运势分析',
    nameEn: 'Astrology Analysis',
    description: '今日运势早知道',
    descriptionEn: 'Know your daily fortune',
    icon: '⭐',
    color: 'purple',
    route: '/tests/astrology',
    features: ['星座配对', '运势'],
    featuresEn: ['Zodiac Matching', 'Fortune']
  },
  tarot: {
    id: 'tarot',
    name: '塔罗牌占卜',
    nameEn: 'Tarot Reading',
    description: '神秘塔罗解心事',
    descriptionEn: 'Mysterious tarot reveals your heart',
    icon: '🔮',
    color: 'indigo',
    route: '/tests/tarot',
    features: ['在线抽牌', '解读'],
    featuresEn: ['Online Drawing', 'Interpretation']
  },
  career: {
    id: 'career',
    name: '职业规划测试',
    nameEn: 'Career Planning',
    description: '找到最适合的工作',
    descriptionEn: 'Find your perfect career path',
    icon: '💼',
    color: 'green',
    route: '/tests/career',
    features: ['霍兰德', 'DISC测试'],
    featuresEn: ['Holland Code', 'DISC Test']
  },
  numerology: {
    id: 'numerology',
    name: '传统命理分析',
    nameEn: 'Numerology Analysis',
    description: '算出你的好运气',
    descriptionEn: 'Calculate your good fortune',
    icon: '🔢',
    color: 'orange',
    route: '/tests/numerology',
    features: ['八字', '生肖', '姓名'],
    featuresEn: ['BaZi', 'Chinese Zodiac', 'Name Analysis']
  },
  learning: {
    id: 'learning',
    name: '学习能力评估',
    nameEn: 'Learning Assessment',
    description: '发现学习超能力',
    descriptionEn: 'Discover your learning superpowers',
    icon: '📚',
    color: 'teal',
    route: '/tests/learning',
    features: ['学习风格', '认知能力'],
    featuresEn: ['Learning Style', 'Cognitive Ability']
  },
  relationship: {
    id: 'relationship',
    name: '情感关系测试',
    nameEn: 'Relationship Tests',
    description: '了解你的爱情密码',
    descriptionEn: 'Understand your love code',
    icon: '💕',
    color: 'pink',
    route: '/tests/relationship',
    features: ['恋爱类型', '沟通方式'],
    featuresEn: ['Love Type', 'Communication Style']
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
    estimatedTime: '10-15分钟'
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
    estimatedTime: '10-15分钟'
  };
};

/**
 * 获取测试模块统计数据
 */
export const getTestModuleStats = async (moduleId: TestModuleId): Promise<any | null> => {
  try {
    const response = await fetch(`/api/homepage/modules/${moduleId}/stats`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Failed to fetch stats for module ${moduleId}:`, error);
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
    const response = await fetch(`/api/homepage/modules/${moduleId}/rating`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Failed to fetch rating for module ${moduleId}:`, error);
    return null;
  }
};

/**
 * 获取测试模块使用情况
 */
export const getTestModuleUsage = async (moduleId: TestModuleId): Promise<any | null> => {
  try {
    const response = await fetch(`/api/homepage/modules/${moduleId}/usage`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Failed to fetch usage for module ${moduleId}:`, error);
    return null;
  }
};

/**
 * 获取个性化推荐
 */
export const getPersonalizedRecommendations = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/homepage/recommendations');
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch personalized recommendations:', error);
    return [];
  }
};

/**
 * 记录测试模块访问
 */
export const recordModuleVisit = async (moduleId: TestModuleId): Promise<boolean> => {
  try {
    const response = await fetch('/api/homepage/analytics', {
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
    console.error(`Failed to record visit for module ${moduleId}:`, error);
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
    const response = await fetch(`/api/homepage/modules/${moduleId}/status`);
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.success ? data.data.isAvailable : false;
  } catch (error) {
    console.error(`Failed to check availability for module ${moduleId}:`, error);
    return false;
  }
};

/**
 * 获取热门测试模块
 */
export const getPopularTestModules = async (limit: number = 6): Promise<TestModule[]> => {
  try {
    const response = await fetch(`/api/homepage/modules/popular?limit=${limit}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch popular test modules:', error);
    return [];
  }
};

/**
 * 获取新发布的测试模块
 */
export const getNewTestModules = async (limit: number = 4): Promise<TestModule[]> => {
  try {
    const response = await fetch(`/api/homepage/modules/new?limit=${limit}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch new test modules:', error);
    return [];
  }
};
