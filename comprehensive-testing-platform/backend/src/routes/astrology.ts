/**
 * Astrology Module Routes
 * 星座占星模块路由
 */

import { Hono } from 'hono';
import type { Context } from 'hono';
import { AstrologyService } from '../services/astrology/AstrologyService';
import type { AppContext } from '../types/env';

const astrologyRoutes = new Hono<AppContext>();

// 兼容预取/预加载的HEAD请求
astrologyRoutes.on('HEAD', '/zodiac-signs', (c: Context<AppContext>) => {
  return c.text('', 204 as any);
});

// 获取星座列表
astrologyRoutes.get('/zodiac-signs', async (c) => {
  try {
    const astrologyService = new AstrologyService(
      c.get('dbService'),
      c.get('cacheService')?.kv || null,
      c.env.DEEPSEEK_API_KEY
    );
    const signs = await astrologyService.getZodiacSigns();

    return c.json({
      success: true,
      data: signs,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId')
    });
  } catch (error) {
    // Error handling for production
    return c.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get zodiac signs'
    }, 500);
  }
});

// 获取运势
astrologyRoutes.get('/fortune/:sign', async (c) => {
  try {
    const sign = c.req.param('sign');
    const timeframe = c.req.query('timeframe');
    const date = c.req.query('date');
    
    if (!sign || !timeframe) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        message: 'Both sign and timeframe are required'
      }, 400);
    }
    
    const astrologyService = new AstrologyService(c.get('dbService'), c.get('cacheService')?.kv || null, c.env.DEEPSEEK_API_KEY);
    const result = await astrologyService.getFortune(sign, timeframe, date);
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId')
    });
  } catch (error) {
    // Error handling for production
    return c.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get fortune reading'
    }, 500);
  }
});

// 获取星座配对分析
astrologyRoutes.post('/compatibility', async (c) => {
  try {
    const { sign1, sign2, relationType } = await c.req.json();
    
    if (!sign1 || !sign2 || !relationType) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        message: 'sign1, sign2, and relationType are required'
      }, 400);
    }
    
    const astrologyService = new AstrologyService(c.get('dbService'), c.get('cacheService')?.kv || null, c.env.DEEPSEEK_API_KEY);
    const result = await astrologyService.getCompatibility(sign1, sign2, relationType);
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId')
    });
  } catch (error) {
    // Error handling for production
    return c.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get compatibility analysis'
    }, 500);
  }
});

// 生成星盘分析
astrologyRoutes.post('/birth-chart', async (c) => {
  try {
    const birthData = await c.req.json();
    
    if (!birthData.birthDate || !birthData.birthTime || !birthData.birthLocation) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        message: 'birthDate, birthTime, and birthLocation are required'
      }, 400);
    }
    
    const astrologyService = new AstrologyService(c.get('dbService'), c.get('cacheService')?.kv || null, c.env.DEEPSEEK_API_KEY);
    const result = await astrologyService.analyzeBirthChart(birthData, {});
    
    return c.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId')
    });
  } catch (error) {
    // Error handling for production
    return c.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to generate birth chart'
    }, 500);
  }
});

// 提交反馈
astrologyRoutes.post('/feedback', async (c) => {
  try {
    const { sessionId, feedback } = await c.req.json();
    
    if (!sessionId || !feedback) {
      return c.json({
        success: false,
        error: 'Missing required parameters',
        message: 'sessionId and feedback are required'
      }, 400);
    }
    
    const astrologyService = new AstrologyService(c.get('dbService'), c.get('cacheService')?.kv || null, c.env.DEEPSEEK_API_KEY);
    await astrologyService.submitFeedback(sessionId, feedback);
    
    return c.json({
      success: true,
      message: 'Feedback submitted successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId')
    });
  } catch (error) {
    // Error handling for production
    return c.json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to submit feedback'
    }, 500);
  }
});

export default astrologyRoutes;
