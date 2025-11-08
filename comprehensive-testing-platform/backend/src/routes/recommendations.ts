/**
 * 推荐系统API路由
 * 提供英文统一的推荐与模块统计接口
 */

import { Hono } from 'hono';
import type { APIResponse } from '../../../shared/types/apiResponse';
import type { HomepageModule } from '../../../shared/types/homepage';
import { HomepageModuleModel } from '../models/HomepageModuleModel';
import { UserPreferencesModel, type UserPreferencesData } from '../models/UserPreferencesModel';
import type { AppContext } from '../types/env';

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  theme: HomepageModule['theme'];
  relevanceScore: number;
  reasons: string[];
  metrics: {
    averageRating: number;
    totalSessions: number;
    estimatedTime: string;
    lastUpdated: string;
  };
}

interface RecommendationPayload {
  items: RecommendationItem[];
  totalModules: number;
}

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

const recommendationsRoutes = new Hono<AppContext>();

// 获取个性化推荐
recommendationsRoutes.get('/', async (c) => {
  try {
    const { userId, sessionId, limit } = c.req.query();

    const limitValue = normalizeLimit(limit);

    const moduleModel = new HomepageModuleModel(c.env);
    const modules = await moduleModel.getAllActiveModules();

    const preferenceKey = sessionId || userId;
    let preferences: UserPreferencesData | null = null;
    if (preferenceKey) {
      const preferencesModel = new UserPreferencesModel(c.env);
      preferences = await preferencesModel.getPreferencesBySessionId(preferenceKey);
    }

    const items = generateRecommendations(modules, preferences, limitValue);

    const response: APIResponse<RecommendationPayload> = {
      success: true,
      data: {
        items,
        totalModules: modules.length,
      },
      message: 'Recommendations generated successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Unable to build recommendations',
      message: 'An unexpected error occurred while building recommendations',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 获取单个模块的核心统计
recommendationsRoutes.get('/modules/:moduleId/stats', async (c) => {
  try {
    const { moduleId } = c.req.param();

    if (!moduleId) {
      const response: APIResponse = {
        success: false,
        error: 'Module ID is required',
        message: 'Please provide a valid module identifier',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response, 400);
    }

    const moduleModel = new HomepageModuleModel(c.env);
    const module = await moduleModel.getModuleById(moduleId);

    if (!module) {
      const response: APIResponse = {
        success: false,
        error: 'Module not found',
        message: 'The requested module does not exist or is inactive',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response, 404);
    }

    const response: APIResponse = {
      success: true,
      data: {
        id: module.id,
        name: module.name,
        description: module.description,
        theme: module.theme,
        testCount: module.testCount,
        rating: module.rating,
        route: module.route,
        features: module.features,
        estimatedTime: module.estimatedTime,
        updatedAt: module.updatedAt.toISOString(),
      },
      message: 'Module statistics retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to retrieve module statistics',
      message: 'An unexpected error occurred while retrieving module statistics',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 获取模块评分摘要
recommendationsRoutes.get('/modules/:moduleId/rating', async (c) => {
  try {
    const { moduleId } = c.req.param();

    const moduleModel = new HomepageModuleModel(c.env);
    const module = await moduleModel.getModuleById(moduleId);

    if (!module) {
      const response: APIResponse = {
        success: false,
        error: 'Module not found',
        message: 'The requested module does not exist or is inactive',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response, 404);
    }

    const response: APIResponse = {
      success: true,
      data: {
        moduleId: module.id,
        averageRating: Number(module.rating?.toFixed(2)),
        totalRatings: Math.max(module.testCount, 0),
        lastUpdated: module.updatedAt.toISOString(),
      },
      message: 'Module rating summary retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to retrieve rating summary',
      message: 'An unexpected error occurred while retrieving rating information',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 获取模块使用情况
recommendationsRoutes.get('/modules/:moduleId/usage', async (c) => {
  try {
    const { moduleId } = c.req.param();

    const moduleModel = new HomepageModuleModel(c.env);
    const module = await moduleModel.getModuleById(moduleId);

    if (!module) {
      const response: APIResponse = {
        success: false,
        error: 'Module not found',
        message: 'The requested module does not exist or is inactive',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId'),
      };

      return c.json(response, 404);
    }

    const engagementRate = module.testCount > 0 ? Math.min(module.testCount / 5000, 1) : 0;

    const response: APIResponse = {
      success: true,
      data: {
        moduleId: module.id,
        estimatedSessions: module.testCount,
        completionRate: Number(engagementRate.toFixed(2)),
        averageDuration: module.estimatedTime,
        trend: engagementRate > 0.75 ? 'growing' : engagementRate > 0.5 ? 'stable' : 'emerging',
        lastUpdated: module.updatedAt.toISOString(),
      },
      message: 'Module usage metrics retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to retrieve module usage metrics',
      message: 'An unexpected error occurred while retrieving module usage information',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 获取热门模块
recommendationsRoutes.get('/modules/popular', async (c) => {
  try {
    const { limit } = c.req.query();
    const limitValue = normalizeLimit(limit);

    const moduleModel = new HomepageModuleModel(c.env);
    const modules = await moduleModel.getAllActiveModules();

    const popularModules = modules
      .slice()
      .sort((a, b) => b.testCount - a.testCount)
      .slice(0, limitValue)
      .map(mapModuleSummary);

    const response: APIResponse = {
      success: true,
      data: {
        items: popularModules,
        total: modules.length,
      },
      message: 'Popular modules retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to retrieve popular modules',
      message: 'An unexpected error occurred while retrieving popular modules',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 获取最新模块
recommendationsRoutes.get('/modules/new', async (c) => {
  try {
    const { limit } = c.req.query();
    const limitValue = normalizeLimit(limit);

    const moduleModel = new HomepageModuleModel(c.env);
    const modules = await moduleModel.getAllActiveModules();

    const newestModules = modules
      .slice()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limitValue)
      .map(mapModuleSummary);

    const response: APIResponse = {
      success: true,
      data: {
        items: newestModules,
        total: modules.length,
      },
      message: 'Newest modules retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to retrieve newest modules',
      message: 'An unexpected error occurred while retrieving newest modules',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

// 检查模块可用性
recommendationsRoutes.get('/modules/:moduleId/status', async (c) => {
  try {
    const { moduleId } = c.req.param();

    const moduleModel = new HomepageModuleModel(c.env);
    const module = await moduleModel.getModuleById(moduleId);

    const response: APIResponse = {
      success: true,
      data: {
        moduleId,
        isAvailable: Boolean(module?.isActive),
        lastChecked: new Date().toISOString(),
      },
      message: 'Module availability checked successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response);
  } catch (error) {

    const response: APIResponse = {
      success: false,
      error: 'Failed to verify module availability',
      message: 'An unexpected error occurred while checking module availability',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    };

    return c.json(response, 500);
  }
});

/**
 * 生成推荐列表
 */
function generateRecommendations(
  modules: HomepageModule[],
  preferences: UserPreferencesData | null,
  limit: number,
): RecommendationItem[] {
  return modules
    .map((module) => {
      const evaluation = evaluateRelevance(module, preferences);

      return {
        id: module.id,
        title: module.name,
        description: module.description,
        icon: module.icon || '📋',
        route: module.route,
        theme: module.theme,
        relevanceScore: evaluation.score,
        reasons: buildRecommendationReasons(module, evaluation, preferences),
        metrics: {
          averageRating: Number(module.rating?.toFixed(2)),
          totalSessions: module.testCount,
          estimatedTime: module.estimatedTime,
          lastUpdated: module.updatedAt.toISOString(),
        },
      } satisfies RecommendationItem;
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

interface RelevanceEvaluation {
  score: number;
  highlyRated: boolean;
  widelyUsed: boolean;
  recentlyUpdated: boolean;
}

/**
 * 计算推荐权重
 */
function evaluateRelevance(
  module: HomepageModule,
  preferences: UserPreferencesData | null,
): RelevanceEvaluation {
  let score = 0.4;
  let highlyRated = false;
  let widelyUsed = false;
  let recentlyUpdated = false;

  if (module.rating >= 4.5) {
    score += 0.25;
    highlyRated = true;
  } else if (module.rating >= 4.0) {
    score += 0.15;
    highlyRated = true;
  }

  if (module.testCount >= 2000) {
    score += 0.2;
    widelyUsed = true;
  } else if (module.testCount >= 500) {
    score += 0.1;
    widelyUsed = true;
  }

  const updatedWithin30Days = (Date.now() - module.updatedAt.getTime()) <= 30 * 24 * 60 * 60 * 1000;
  if (updatedWithin30Days) {
    score += 0.1;
    recentlyUpdated = true;
  }

  if (preferences?.personalizedContent) {
    score += 0.05;
  }

  return {
    score: Math.min(Number(score.toFixed(2)), 1),
    highlyRated,
    widelyUsed,
    recentlyUpdated,
  };
}

/**
 * 生成推荐理由
 */
function buildRecommendationReasons(
  module: HomepageModule,
  evaluation: RelevanceEvaluation,
  preferences: UserPreferencesData | null,
): string[] {
  const reasons: string[] = [];

  if (evaluation.highlyRated) {
    reasons.push('Consistently high participant rating');
  }

  if (evaluation.widelyUsed) {
    reasons.push('Popular choice among platform participants');
  }

  if (evaluation.recentlyUpdated) {
    reasons.push('Content refreshed recently to include the latest insights');
  }

  if (preferences?.personalizedContent) {
    reasons.push('Personalized recommendations are enabled for your profile');
  }

  if (!reasons.length) {
    reasons.push('Curated to broaden your testing experience');
  }

  if (module.theme === 'learning') {
    reasons.push('Designed to enhance learning strategies and study habits');
  }

  return Array.from(new Set(reasons));
}

/**
 * 格式化模块摘要
 */
function mapModuleSummary(module: HomepageModule) {
  return {
    id: module.id,
    name: module.name,
    description: module.description,
    theme: module.theme,
    route: module.route,
    rating: Number(module.rating?.toFixed(2)),
    totalSessions: module.testCount,
    estimatedTime: module.estimatedTime,
    updatedAt: module.updatedAt.toISOString(),
  };
}

/**
 * 解析limit参数
 */
function normalizeLimit(rawValue?: string, fallback: number = DEFAULT_LIMIT): number {
  if (!rawValue) {
    return fallback;
  }

  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, MAX_LIMIT);
}

export default recommendationsRoutes;
