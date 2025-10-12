/**
 * Tarot Module AI Proxy Routes
 * Handles AI analysis requests for tarot readings
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const tarotAIRoutes = new Hono<AppContext>();

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

// 塔罗牌AI解读
tarotAIRoutes.post('/reading', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    // 检查限流
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { sessionId, userContext } = await c.req.json();
    
    // 验证必需参数
    if (!sessionId) {
      return c.json({
        success: false,
        error: 'Session ID is required'
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
    const result = await aiService.analyzeTarotReading(sessionId, userContext || {});
    
    // 记录AI调用日志
    console.log(`AI Call: ${clientIP} - tarot reading - SUCCESS`);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Tarot AI reading error:', error);
    console.log(`AI Call: ${clientIP} - tarot reading - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'Tarot reading analysis failed' 
    }, 500);
  }
});

// 快速塔罗牌解读
tarotAIRoutes.post('/quick-reading', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { cards, question } = await c.req.json();
    
    // 验证必需参数
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return c.json({
        success: false,
        error: 'Cards array is required'
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
    const result = await aiService.analyzeQuickTarotReading(cards, question);
    
    console.log(`AI Call: ${clientIP} - quick tarot reading - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Quick tarot reading error:', error);
    console.log(`AI Call: ${clientIP} - quick tarot reading - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'Quick tarot reading analysis failed' 
    }, 500);
  }
});

export { tarotAIRoutes };
