/**
 * Relationship Module AI Proxy Routes
 * Handles AI analysis requests for relationship tests
 */

import { Hono } from 'hono';
import { AIService } from '../../services/AIService';
import type { AppContext } from '../../types/env';

const relationshipAIRoutes = new Hono<AppContext>();

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

// Love Language AI 分析
relationshipAIRoutes.post('/love_language', async (c) => {
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
    const result = await aiService.analyzeLoveLanguage(answers, context);
    
    console.log(`AI Call: ${clientIP} - love-language - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Love Language AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - love-language - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// Love Style AI 分析
relationshipAIRoutes.post('/love_style', async (c) => {
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
    const result = await aiService.analyzeLoveStyle(answers, context);
    
    console.log(`AI Call: ${clientIP} - love-style - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Love Style AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - love-style - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

// Interpersonal Skills AI 分析
relationshipAIRoutes.post('/interpersonal', async (c) => {
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
    const result = await aiService.analyzeInterpersonal(answers, context);
    
    console.log(`AI Call: ${clientIP} - interpersonal - SUCCESS`);
    return c.json({ success: true, data: result });
  } catch (error) {
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    console.error('Interpersonal AI analysis error:', error);
    console.log(`AI Call: ${clientIP} - interpersonal - FAILED`);
    
    return c.json({ 
      success: false, 
      error: 'AI analysis failed' 
    }, 500);
  }
});

export { relationshipAIRoutes };
