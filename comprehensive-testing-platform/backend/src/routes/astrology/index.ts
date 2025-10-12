/**
 * Astrology Routes
 * 星座模块API路由
 */

import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppContext } from '../../types/env';
import { AstrologyService } from '../../services/astrology/AstrologyService';
import { errorHandler } from '../../middleware/errorHandler';

const astrologyRoutes = new Hono<AppContext>();

// 兼容预取/预加载可能触发的HEAD请求（使用 on 注册 HEAD 方法）
astrologyRoutes.on('HEAD', '/zodiac-signs', (c: Context<AppContext>) => {
  return c.text('', 204);
});

// 获取星座列表
astrologyRoutes.get('/zodiac-signs', async (c) => {
  try {
    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const signs = await astrologyService.getZodiacSigns();
    
    return c.json({
      success: true,
      data: signs,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取运势
astrologyRoutes.get('/fortune/:sign', async (c) => {
  try {
    const sign = c.req.param('sign');
    const timeframe = c.req.query('timeframe') || 'daily';
    const date = c.req.query('date');
    
    // 调试信息
    console.log('Fortune request params:', { sign, timeframe, date });
    
    if (!sign) {
      return c.json({
        success: false,
        error: 'Zodiac sign parameter is required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const fortune = await astrologyService.getFortune(sign, timeframe, date);
    
    return c.json({
      success: true,
      data: fortune,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 星座配对分析
astrologyRoutes.post('/compatibility', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.sign1 || !request.sign2) {
      return c.json({
        success: false,
        error: 'Both zodiac signs are required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const compatibility = await astrologyService.getCompatibility(
      request.sign1,
      request.sign2,
      request.relationType || 'love'
    );
    
    return c.json({
      success: true,
      data: compatibility,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 生成星盘分析
astrologyRoutes.post('/birth-chart', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.birthDate || !request.birthLocation) {
      return c.json({
        success: false,
        error: 'Birth date and location are required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const birthChart = await astrologyService.analyzeBirthChart(request, {
      requestId: c.get('requestId') || '',
      userAgent: c.req.header('User-Agent') || '',
      ip: c.req.header('CF-Connecting-IP') || ''
    });
    
    return c.json({
      success: true,
      data: birthChart,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 获取行星解读
astrologyRoutes.post('/planet-interpretation', async (c) => {
  try {
    const request = await c.req.json();
    
    if (!request.planet || !request.sign) {
      return c.json({
        success: false,
        error: 'Planet and sign are required',
        timestamp: new Date().toISOString(),
        requestId: c.get('requestId') || ''
      }, 400);
    }

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    const interpretation = await astrologyService.getPlanetInterpretation(request.planet, request.sign);
    
    return c.json({
      success: true,
      data: interpretation,
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') || ''
    });
  } catch (error) {
    return errorHandler(error, c);
  }
});

// 提交反馈
astrologyRoutes.post('/feedback', async (c) => {
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

    const astrologyService = new AstrologyService(c.env.DB, c.env.KV, c.env.DEEPSEEK_API_KEY);
    await astrologyService.submitFeedback(request.sessionId, request.feedback);
    
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

export default astrologyRoutes;