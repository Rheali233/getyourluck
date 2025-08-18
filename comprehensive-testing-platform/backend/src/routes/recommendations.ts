/**
 * 推荐系统API路由
 * 提供个性化推荐和测试模块统计功能
 */

import { Hono } from 'hono';
import { HomepageModuleModel } from '../models/HomepageModuleModel';
// import { SearchIndexModel } from '../models/SearchIndexModel'; // 未使用，暂时注释
import { UserPreferencesModel } from '../models/UserPreferencesModel';
import type { Context } from 'hono';

const recommendationsRoutes = new Hono();

// 获取个性化推荐
recommendationsRoutes.get('/', async (c: Context) => {
  try {
    const { userId, sessionId, limit = "6" } = c.req.query();
    
    // 获取用户偏好
    let userPreferences = null;
    if (userId || sessionId) {
      const preferencesModel = new UserPreferencesModel(c.env.DB);
      userPreferences = await preferencesModel.getPreferencesBySessionId(sessionId || userId || '');
    }

    // 获取热门测试模块
    const moduleModel = new HomepageModuleModel(c.env.DB);
    const popularModules = await moduleModel.getModulesStats();

    // 获取搜索历史（如果有sessionId）
    let searchHistory: any[] = [];
    if (sessionId) {
      // const searchModel = new SearchIndexModel(c.env.DB); // 未使用，暂时注释
      // searchHistory = await searchModel.getSearchHistory(sessionId, 10); // 方法不存在，暂时注释
    }

    // 生成推荐逻辑
    const recommendations = await generateRecommendations(
      Array.isArray(popularModules) ? popularModules : [popularModules],
      userPreferences,
      searchHistory,
      parseInt(limit) || 6
    );

    return c.json({
      success: true,
      data: recommendations,
      message: '推荐获取成功'
    });
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    return c.json({
      success: false,
      error: '获取推荐失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 获取测试模块统计
recommendationsRoutes.get('/modules/:moduleId/stats', async (c: Context) => {
  try {
    const { moduleId } = c.req.param();
    if (!moduleId) {
      return c.json({
        success: false,
        error: '模块ID不能为空',
        message: '请提供有效的模块ID'
      }, 400);
    }
    
    const moduleModel = new HomepageModuleModel(c.env.DB);
    const stats = await moduleModel.getModulesStats();

    if (!stats) {
      return c.json({
        success: false,
        error: '模块不存在',
        message: '指定的测试模块不存在'
      }, 404);
    }

    return c.json({
      success: true,
      data: stats,
      message: '统计数据获取成功'
    });
  } catch (error) {
    console.error('Failed to get module stats:', error);
    return c.json({
      success: false,
      error: '获取统计数据失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 获取测试模块评分
recommendationsRoutes.get('/modules/:moduleId/rating', async (c: Context) => {
  try {
    const { moduleId } = c.req.param();
    
    // 这里应该从评分系统获取数据
    // 暂时返回模拟数据
    const rating = {
      moduleId,
      averageRating: 4.2,
      totalRatings: 1250,
      ratingDistribution: {
        5: 45,
        4: 35,
        3: 15,
        2: 3,
        1: 2
      },
      lastUpdated: new Date().toISOString()
    };

    return c.json({
      success: true,
      data: rating,
      message: '评分数据获取成功'
    });
  } catch (error) {
    console.error('Failed to get module rating:', error);
    return c.json({
      success: false,
      error: '获取评分数据失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 获取测试模块使用情况
recommendationsRoutes.get('/modules/:moduleId/usage', async (c: Context) => {
  try {
    const { moduleId } = c.req.param();
    
    // 这里应该从使用统计系统获取数据
    // 暂时返回模拟数据
    const usage = {
      moduleId,
      totalUsers: 8500,
      activeUsers: 3200,
      completionRate: 0.78,
      averageTime: 420, // 秒
      popularTests: ['MBTI测试', '抑郁自评量表', '情商测试'],
      lastUpdated: new Date().toISOString()
    };

    return c.json({
      success: true,
      data: usage,
      message: '使用数据获取成功'
    });
  } catch (error) {
    console.error('Failed to get module usage:', error);
    return c.json({
      success: false,
      error: '获取使用数据失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 获取热门测试模块
recommendationsRoutes.get('/modules/popular', async (c: Context) => {
  try {
    // const { limit = 6 } = c.req.query(); // 未使用，暂时注释
    
    const moduleModel = new HomepageModuleModel(c.env.DB);
    const popularModules = await moduleModel.getModulesStats();

    return c.json({
      success: true,
      data: popularModules,
      message: '热门模块获取成功'
    });
  } catch (error) {
    console.error('Failed to get popular modules:', error);
    return c.json({
      success: false,
      error: '获取热门模块失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 获取新发布的测试模块
recommendationsRoutes.get('/modules/new', async (c: Context) => {
  try {
    // const { limit = 4 } = c.req.query(); // 未使用，暂时注释
    
    const moduleModel = new HomepageModuleModel(c.env.DB);
    const newModules = await moduleModel.getModulesByTheme('new');

    return c.json({
      success: true,
      data: newModules,
      message: '新模块获取成功'
    });
  } catch (error) {
    console.error('Failed to get new modules:', error);
    return c.json({
      success: false,
      error: '获取新模块失败',
      message: '服务器内部错误'
    }, 500);
  }
});

// 检查测试模块可用性
recommendationsRoutes.get('/modules/:moduleId/status', async (c: Context) => {
  try {
    const { moduleId } = c.req.param();
    
    const moduleModel = new HomepageModuleModel(c.env.DB);
    const module = await moduleModel.getModuleById(moduleId || '');

    const isAvailable = module && module.isActive;

    return c.json({
      success: true,
      data: {
        moduleId,
        isAvailable,
        lastChecked: new Date().toISOString()
      },
      message: '状态检查成功'
    });
  } catch (error) {
    console.error('Failed to check module status:', error);
    return c.json({
      success: false,
      error: '状态检查失败',
      message: '服务器内部错误'
    }, 500);
  }
});

/**
 * 生成推荐逻辑
 */
async function generateRecommendations(
  popularModules: any[],
  userPreferences: any,
  searchHistory: any[],
  limit: number
) {
  const recommendations = [];

  // 基于热门模块生成推荐
  for (const module of popularModules.slice(0, limit)) {
    const relevanceScore = calculateRelevanceScore(module, userPreferences, searchHistory);
    
    recommendations.push({
      id: module.id,
      type: 'test' as const,
      title: module.name,
      titleEn: module.nameEn || module.name,
      description: module.description,
      descriptionEn: module.descriptionEn || module.description,
      icon: module.icon || '📋',
      category: module.theme || 'general',
      categoryEn: module.themeEn || module.theme || 'general',
      relevanceScore,
      reason: getRecommendationReason(relevanceScore, module),
      reasonEn: getRecommendationReasonEn(relevanceScore, module),
      metadata: {
        totalUsers: module.totalUsers || 0,
        averageRating: module.averageRating || 0,
        completionRate: module.completionRate || 0
      }
    });
  }

  // 按相关性排序
  recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return recommendations.slice(0, limit);
}

/**
 * 计算相关性分数
 */
function calculateRelevanceScore(module: any, userPreferences: any, searchHistory: any[]): number {
  let score = 0.5; // 基础分数

  // 基于用户偏好调整分数
  if (userPreferences) {
    if (userPreferences.preferredThemes?.includes(module.theme)) {
      score += 0.2;
    }
    if (userPreferences.preferredCategories?.includes(module.category)) {
      score += 0.15;
    }
  }

  // 基于搜索历史调整分数
  if (searchHistory.length > 0) {
    const relevantSearches = searchHistory.filter(search => 
      search.query.toLowerCase().includes(module.name.toLowerCase()) ||
      search.query.toLowerCase().includes(module.theme?.toLowerCase() || '')
    );
    
    if (relevantSearches.length > 0) {
      score += 0.1;
    }
  }

  // 基于模块热度调整分数
  if (module.totalUsers > 1000) score += 0.1;
  if (module.averageRating > 4.0) score += 0.05;

  return Math.min(score, 1.0);
}

/**
 * 获取推荐原因（中文）
 */
function getRecommendationReason(score: number, _module: any): string {
  if (score >= 0.8) return '高度匹配您的兴趣';
  if (score >= 0.6) return '基于您的偏好推荐';
  if (score >= 0.4) return '热门测试推荐';
  return '为您精选推荐';
}

/**
 * 获取推荐原因（英文）
 */
function getRecommendationReasonEn(score: number, _module: any): string {
  if (score >= 0.8) return 'Highly matches your interests';
  if (score >= 0.6) return 'Recommended based on your preferences';
  if (score >= 0.4) return 'Popular test recommendation';
  return 'Curated for you';
}

export default recommendationsRoutes;
