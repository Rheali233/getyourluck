/**
 * Career Module Questions API Route
 * Provides question data for all career assessment tests
 */

import { Hono } from 'hono';
import { QuestionBankModel } from '../../models/QuestionBankModel';
import type { AppContext } from '../../types/env';

const careerQuestionsRouter = new Hono<AppContext>();

// Get all career test questions
careerQuestionsRouter.get('/', async (c) => {
  try {
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    // Get questions for all career test categories
    const categories = ['holland-category', 'disc-category', 'leadership-category'];
    const allQuestions: any = {};
    
    for (const categoryId of categories) {
      try {
        const questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
        const categoryCode = categoryId.replace('-category', '');
        allQuestions[categoryCode] = questions;
      } catch (error) {
        console.error(`Failed to get questions for ${categoryId}:`, error);
        allQuestions[categoryId.replace('-category', '')] = [];
      }
    }
    
    return c.json({
      success: true,
      data: allQuestions,
      message: 'Successfully retrieved all career test questions',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('Failed to get career questions:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve questions',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// Get questions for a specific career test type
careerQuestionsRouter.get('/:testType', async (c) => {
  try {
    const testType = c.req.param('testType');
    
    // Validate test type
    const validTestTypes = ['holland', 'disc', 'leadership'];
    if (!validTestTypes.includes(testType)) {
      return c.json({
        success: false,
        error: 'Invalid test type',
        message: `Supported test types: ${validTestTypes.join(', ')}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    // Map testType to category_id
    const categoryIdMap: { [key: string]: string } = {
      'holland': 'holland-category',
      'disc': 'disc-category',
      'leadership': 'leadership-category'
    };
    
    const categoryId = categoryIdMap[testType];
    if (!categoryId) {
      return c.json({
        success: false,
        error: 'Invalid test type',
        message: `Unsupported test type: ${testType}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    const questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
    
    return c.json({
      success: true,
      data: questions,
      message: `Successfully retrieved ${testType} questions`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error(`Failed to get ${c.req.param('testType')} questions:`, error);
    return c.json({
      success: false,
      error: `Failed to fetch ${c.req.param('testType')} questions`,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

export default careerQuestionsRouter;
