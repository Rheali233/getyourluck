/**
 * Learning Ability Module AI Proxy Routes
 * Handles AI analysis requests for learning ability tests
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const learningAIRoutes = new Hono<AppContext>();

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

// VARK AI 分析
learningAIRoutes.post('/vark', async (c) => {
  try {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.' 
      }, 429);
    }
    
    const { scores, primaryStyle, secondaryStyles, answers } = await c.req.json();
    const apiKey = c.env.DEEPSEEK_API_KEY;
    
    // Debug logging removed for production
    
    if (!apiKey) {
      return c.json({ 
        success: false, 
        error: 'AI service not configured - DEEPSEEK_API_KEY is missing' 
      }, 500);
    }
    
    const aiService = new AIService(apiKey);
    const result = await aiService.analyzeVARK(scores, primaryStyle, secondaryStyles, answers);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    // Error logging removed for production
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// Raven removed

// Cognitive AI 分析
learningAIRoutes.post('/cognitive', async (c) => {
  const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
  // 保留限流检查以防止滥用
  if (!checkRateLimit(clientIP)) {
    return c.json({ 
      success: false, 
      error: 'Rate limit exceeded. Please try again later.' 
    }, 429);
  }
  // 模块暂未实现，返回统一错误
  return c.json({ 
    success: false, 
    error: 'Cognitive analysis is not available.' 
  }, 501);
});

export { learningAIRoutes };
