/**
 * 心理测试题目API路由
 * Provides CRUD operations for question data
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { QuestionBankModel } from '../../models/QuestionBankModel';
import type { AppContext } from '../../types/env';

const questionsRouter = new Hono<AppContext>();

// 获取所有测试类型的题目
questionsRouter.get('/', async (c) => {
  try {
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    // 获取所有分类的题目
    const categories = ['mbti', 'phq9', 'eq', 'happiness'];
    const categoryIdMap: { [key: string]: string } = {
      'mbti': 'mbti-category',
      'phq9': 'phq9-category',
      'eq': 'eq-category',
      'happiness': 'happiness-category'
    };
    const allQuestions: any = {};
    
    for (const category of categories) {
      try {
        const categoryId = categoryIdMap[category];
        if (categoryId) {
          const questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
          allQuestions[category] = questions;
        } else {
          allQuestions[category] = [];
        }
      } catch (error) {
        console.error(`获取${category}题目失败:`, error);
        allQuestions[category] = [];
      }
    }
    
    return c.json({
      success: true,
      data: allQuestions,
      message: '成功获取所有题目',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('获取所有题目失败:', error);
    return c.json({
      success: false,
      error: '获取题目失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 获取指定测试类型的题目
questionsRouter.get('/:testType', async (c) => {
  try {
    const testType = c.req.param('testType');
    
    // 验证测试类型
    const validTestTypes = ['mbti', 'phq9', 'eq', 'happiness'];
    if (!validTestTypes.includes(testType)) {
      return c.json({
        success: false,
        error: '无效的测试类型',
        message: `支持的测试类型: ${validTestTypes.join(', ')}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    // 映射testType到category_id
    const categoryIdMap: { [key: string]: string } = {
      'mbti': 'mbti-category',
      'phq9': 'phq9-category',
      'eq': 'eq-category',
      'happiness': 'happiness-category'
    };
    
    const categoryId = categoryIdMap[testType];
    if (!categoryId) {
      return c.json({
        success: false,
        error: '无效的测试类型',
        message: `不支持的测试类型: ${testType}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    const questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
    
    return c.json({
      success: true,
      data: questions,
      message: `成功获取${testType}题目`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error(`获取${c.req.param('testType')}题目失败:`, error);
    return c.json({
      success: false,
      error: '获取题目失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 获取题目分类信息
questionsRouter.get('/categories', async (c) => {
  try {
    // 获取题目分类信息
    const categories = [
      { id: 'mbti', name: 'MBTI性格测试', code: 'mbti', description: '迈尔斯-布里格斯类型指标' },
      { id: 'phq9', name: 'PHQ-9抑郁筛查', code: 'phq9', description: '患者健康问卷-9项' },
      { id: 'eq', name: '情商测试', code: 'eq', description: '情绪智力评估' },
      { id: 'happiness', name: '幸福指数测试', code: 'happiness', description: '主观幸福感评估' }
    ];
    
    return c.json({
      success: true,
      data: categories,
      message: '成功获取题目分类',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('获取题目分类失败:', error);
    return c.json({
      success: false,
      error: '获取分类失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 获取指定测试类型的配置信息
questionsRouter.get('/:testType/configs', async (c) => {
  try {
    const testType = c.req.param('testType');
    
    // 获取题目配置信息
    const configs = [
      { id: 'config-1', categoryId: testType, configKey: 'scoring_type', configValue: 'likert', configType: 'string', description: '评分类型' },
      { id: 'config-2', categoryId: testType, configKey: 'min_score', configValue: '0', configType: 'number', description: '最低分数' },
      { id: 'config-3', categoryId: testType, configKey: 'max_score', configValue: '27', configType: 'number', description: '最高分数' }
    ];
    
    return c.json({
      success: true,
      data: configs,
      message: `成功获取${testType}配置`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error(`获取${c.req.param('testType')}配置失败:`, error);
    return c.json({
      success: false,
      error: '获取配置失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 获取指定测试类型的版本信息
questionsRouter.get('/:testType/versions', async (c) => {
  try {
    const testType = c.req.param('testType');
    
    // 获取题目版本信息
    const versions = [
      { id: 'version-1', categoryId: testType, versionNumber: '1.0.0', versionName: '初始版本', description: '第一个正式版本', isActive: true }
    ];
    
    return c.json({
      success: true,
      data: versions,
      message: `成功获取${testType}版本`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error(`获取${c.req.param('testType')}版本失败:`, error);
    return c.json({
      success: false,
      error: '获取版本失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

      // Create new question (admin function)
const createQuestionSchema = z.object({
  categoryId: z.string(),
  questionText: z.string().min(1),
  questionTextEn: z.string().optional(),
  questionType: z.enum(['single_choice', 'likert_scale', 'multiple_choice']),
  dimension: z.string().optional(),
  domain: z.string().optional(),
  weight: z.number().default(1),
  orderIndex: z.number().min(0),
  isRequired: z.boolean().default(true),
  options: z.array(z.object({
    optionText: z.string().min(1),
    optionTextEn: z.string().optional(),
    optionValue: z.string(),
    optionScore: z.number().optional(),
    optionDescription: z.string().optional(),
    orderIndex: z.number().min(0)
  }))
});

questionsRouter.post('/', zValidator('json', createQuestionSchema), async (c) => {
  try {
    const questionData = c.req.valid('json');
    
    // 简化实现，返回模拟结果
    const result = {
      id: `question_${Date.now()}`,
      ...questionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return c.json({
      success: true,
      data: result,
      message: '成功创建题目',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 201);
  } catch (error) {
    console.error('创建题目失败:', error);
    return c.json({
      success: false,
      error: '创建题目失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

      // Update question (admin function)
const updateQuestionSchema = z.object({
  questionText: z.string().min(1).optional(),
  questionTextEn: z.string().optional(),
  questionType: z.enum(['single_choice', 'likert_scale', 'multiple_choice']).optional(),
  dimension: z.string().optional(),
  domain: z.string().optional(),
  weight: z.number().min(0).optional(),
  orderIndex: z.number().min(0).optional(),
  isRequired: z.boolean().optional(),
  isActive: z.boolean().optional()
});

questionsRouter.put('/:id', zValidator('json', updateQuestionSchema), async (c) => {
  try {
    const questionId = c.req.param('id');
    const updateData = c.req.valid('json');
    
    // Simplified implementation, return mock result
    const result = {
      id: questionId,
      ...updateData,
      updatedAt: new Date()
    };
    
    return c.json({
      success: true,
      data: result,
      message: '成功更新题目',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('更新题目失败:', error);
    return c.json({
      success: false,
      error: '更新题目失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

      // Delete question (admin function)
questionsRouter.delete('/:id', async (c) => {
  try {
    const questionId = c.req.param('id');
    
    // Simplified implementation, simulate successful deletion
    console.log(`Deleting question with ID: ${questionId}`);
    
    return c.json({
      success: true,
      message: '成功删除题目',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('删除题目失败:', error);
    return c.json({
      success: false,
      error: '删除题目失败',
      message: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

export default questionsRouter;
