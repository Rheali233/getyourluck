/**
 * Tarot Routes
 * 塔罗牌模块API路由
 */

import { Hono } from 'hono';
import type { AppContext } from '../../types/env';
import { TarotService } from '../../services/tarot/TarotService';
import { errorHandler } from '../../middleware/errorHandler';

const tarotRoutes = new Hono<AppContext>();

// 获取塔罗牌列表
tarotRoutes.get('/cards', async (c) => {
  try {
    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const cards = await tarotService.getTarotCards();
    
    return c.json({
      success: true,
      data: cards,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 清除塔罗牌缓存
tarotRoutes.post('/cards/clear-cache', async (c) => {
  try {
    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    await tarotService.clearTarotCardsCache();
    
    return c.json({
      success: true,
      message: 'Tarot cards cache cleared successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取问题分类
tarotRoutes.get('/categories', async (c) => {
  try {
    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const categories = await tarotService.getQuestionCategories();
    
    return c.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取牌阵配置
tarotRoutes.get('/spreads', async (c) => {
  try {
    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const spreads = await tarotService.getTarotSpreads();
    
    return c.json({
      success: true,
      data: spreads,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取推荐
tarotRoutes.post('/recommendation', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.categoryId) {
      return c.json({
        success: false,
        error: 'Category ID is required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const recommendation = await tarotService.getRecommendation(request);
    
    return c.json({
      success: true,
      data: recommendation,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 抽牌
tarotRoutes.post('/draw', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.spreadId) {
      return c.json({
        success: false,
        error: 'Spread ID is required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const result = await tarotService.drawCards(request, {
      requestId: c.get('requestId') || '',
      userAgent: c.req.header('User-Agent') || '',
      ip: c.req.header('CF-Connecting-IP') || ''
    });
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取AI解读
tarotRoutes.get('/ai-reading/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    if (!sessionId) {
      return c.json({
        success: false,
        error: 'Session ID is required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const reading = await tarotService.getAIReading(sessionId, {
      requestId: c.get('requestId') || '',
      userAgent: c.req.header('User-Agent') || '',
      ip: c.req.header('CF-Connecting-IP') || ''
    });
    
    return c.json({
      success: true,
      data: reading,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 提交反馈
tarotRoutes.post('/feedback', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.sessionId || !request.feedback) {
      return c.json({
        success: false,
        error: 'Session ID and feedback are required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const tarotService = new TarotService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    await tarotService.submitFeedback(request.sessionId, request.feedback);
    
    return c.json({
      success: true,
      message: 'Feedback submitted successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

export default tarotRoutes;
