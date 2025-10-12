/**
 * 统一测试结果处理路由
 * 处理所有测试类型的结果生成和AI分析
 */

import { Hono } from 'hono';
import { TestResultService } from '../services/TestResultService';
import { AIService } from '../services/AIService';
import type { APIResponse } from '../../../shared/types/apiResponse';
import type { AppContext } from '../types/env';

const testResultsRoutes = new Hono<AppContext>();

// 处理测试结果生成请求
testResultsRoutes.post('/', async (c) => {
  try {
    const requestId = c.get('requestId') as string;
    const dbService = c.get('dbService');
    const cacheService = c.get('cacheService');
    
    // 获取请求体
    const body = await c.req.json();
    const { testType, answers } = body;
    
    if (!testType || !answers) {
      const response: APIResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'testType and answers are required',
        timestamp: new Date().toISOString(),
        requestId,
      };
      return c.json(response, 400);
    }
    
    // 初始化AI服务
    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    // 初始化测试结果处理服务
    const testResultService = new TestResultService(dbService, cacheService, aiService);
    
    // 处理测试结果
    const result = await testResultService.processTestSubmission(testType, answers);
    
    const response: APIResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      requestId,
    };
    
    return c.json(response);
    
  } catch (error) {
    console.error('Test result processing error:', error);
    
    const response: APIResponse = {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') as string,
    };
    
    return c.json(response, 500);
  }
});

// 获取支持的测试类型
testResultsRoutes.get('/supported-types', async (c) => {
  try {
    const requestId = c.get('requestId') as string;
    const dbService = c.get('dbService');
    const cacheService = c.get('cacheService');
    
    // 初始化AI服务
    const aiService = new AIService(c.env.DEEPSEEK_API_KEY || '');
    
    // 初始化测试结果处理服务
    const testResultService = new TestResultService(dbService, cacheService, aiService);
    
    // 获取支持的测试类型
    const supportedTypes = testResultService.getSupportedTestTypes();
    
    const response: APIResponse = {
      success: true,
      data: {
        supportedTypes,
        count: supportedTypes.length
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    
    return c.json(response);
    
  } catch (error) {
    console.error('Get supported types error:', error);
    
    const response: APIResponse = {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId') as string,
    };
    
    return c.json(response, 500);
  }
});

export default testResultsRoutes;
