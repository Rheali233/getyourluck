/**
 * Astrology Module AI Proxy Routes
 * Handles AI analysis requests for astrology tests
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const astrologyAIRoutes = new Hono<AppContext>();

// Rate limiting middleware
const rateLimiter = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimiter.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + 60000 }); // 1分钟重置
    return true;
  }
  
  if (userLimit.count >= 10) { // 每分钟最多10次
    return false;
  }
  
  userLimit.count++;
  return true;
};

// 运势AI分析
astrologyAIRoutes.post('/fortune', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    // 检查限流
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { zodiacSign, timeframe, userContext } = await c.req.json();
    
    // 验证必需参数
    if (!zodiacSign || !timeframe) {
      return c.json({
        success: false,
        error: 'Missing required parameters: zodiacSign and timeframe are required'
      }, 400);
    }
    
    // 从环境变量读取 API Key
    const apiKey = c.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    // 调用 AI 服务
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeFortune(zodiacSign, timeframe, userContext || {});
    
    // 记录AI调用日志
    console.log(`AI Call: ${clientIP} - fortune - SUCCESS`);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Fortune AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - fortune - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'Fortune analysis failed' 
    }, 500);
  }
});

// 配对兼容性AI分析
astrologyAIRoutes.post('/compatibility', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { sign1, sign2, relationType, userContext } = await c.req.json();
    
    // 验证必需参数
    if (!sign1 || !sign2 || !relationType) {
      return c.json({
        success: false,
        error: 'Missing required parameters: sign1, sign2, and relationType are required'
      }, 400);
    }
    
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeCompatibility(sign1, sign2, relationType, userContext || {});
    
    console.log(`AI Call: ${clientIP} - compatibility - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Compatibility AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - compatibility - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'Compatibility analysis failed' 
    }, 500);
  }
});

// 出生星盘AI分析
astrologyAIRoutes.post('/birth-chart', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { birthData, userContext } = await c.req.json();
    
    // 验证必需参数
    if (!birthData || !birthData.birthDate || !birthData.birthLocation) {
      return c.json({
        success: false,
        error: 'Missing required parameters: birthDate and birthLocation are required'
      }, 400);
    }
    
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeBirthChart(birthData, userContext || {});
    
    console.log(`AI Call: ${clientIP} - birth-chart - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Birth chart AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - birth-chart - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'Birth chart analysis failed' 
    }, 500);
  }
});

export { astrologyAIRoutes };
