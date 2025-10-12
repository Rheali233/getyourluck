/**
 * Psychology Module AI Proxy Routes
 * Handles AI analysis requests for psychological tests
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const psychologyAIRoutes = new Hono<AppContext>();

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

// MBTI AI 分析
psychologyAIRoutes.post('/mbti', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    // 检查限流
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { answers, context } = await c.req.json();
    
    // 从环境变量读取 API Key (安全)
    const apiKey = c.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    // 调用 AI 服务
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeMBTI(answers, context);
    
    // 记录AI调用日志
    console.log(`AI Call: ${clientIP} - mbti - SUCCESS`);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('MBTI AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - mbti - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// PHQ-9 AI 分析
psychologyAIRoutes.post('/phq9', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { answers, context } = await c.req.json();
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzePHQ9(answers, context);
    
    console.log(`AI Call: ${clientIP} - phq9 - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('PHQ-9 AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - phq9 - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// EQ AI 分析
psychologyAIRoutes.post('/eq', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { answers, context } = await c.req.json();
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeEQ(answers, context);
    
    console.log(`AI Call: ${clientIP} - eq - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('EQ AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - eq - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// Happiness AI 分析
psychologyAIRoutes.post('/happiness', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { answers, context } = await c.req.json();
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeHappiness(answers, context);
    
    console.log(`AI Call: ${clientIP} - happiness - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Happiness AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - happiness - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

export { psychologyAIRoutes };
