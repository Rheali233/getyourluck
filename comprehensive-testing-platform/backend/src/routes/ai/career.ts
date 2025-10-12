/**
 * Career Module AI Proxy Routes
 * Handles AI analysis requests for career tests
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const careerAIRoutes = new Hono<AppContext>();

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

// Holland Code AI 分析
careerAIRoutes.post('/holland', async (c) => {
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
    const result = await aiService.analyzeHollandCode(answers, context);
    
    console.log(`AI Call: ${clientIP} - holland - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Holland Code AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - holland - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// DISC AI 分析
careerAIRoutes.post('/disc', async (c) => {
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
    const result = await aiService.analyzeDISC(answers, context);
    
    console.log(`AI Call: ${clientIP} - disc - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('DISC AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - disc - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// Leadership AI 分析
careerAIRoutes.post('/leadership', async (c) => {
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
    const result = await aiService.analyzeLeadership(answers, context);
    
    console.log(`AI Call: ${clientIP} - leadership - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Leadership AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - leadership - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

export { careerAIRoutes };
