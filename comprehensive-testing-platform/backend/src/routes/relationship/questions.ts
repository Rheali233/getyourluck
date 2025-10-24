/**
 * Relationship Module Questions API Route
 * Provides question data for all relationship assessment tests
 */

import { Hono } from 'hono';
import { QuestionBankModel } from '../../models/QuestionBankModel';
import type { AppContext } from '../../types/env';

const relationshipQuestionsRouter = new Hono<AppContext>();

// Get all relationship test questions
relationshipQuestionsRouter.get('/', async (c) => {
  try {
    const questionModel = new QuestionBankModel(c.env);
    
    // Get questions for all relationship test categories
    const categories = ['cat_love_style', 'cat_love_language', 'cat_interpersonal'];
    const allQuestions: any = {};
    
    for (const categoryId of categories) {
      try {
        const questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
        const categoryCode = categoryId.replace('cat_', '').replace('_', '-');
        allQuestions[categoryCode] = questions;
      } catch (error) {
        console.error(`Failed to get questions for ${categoryId}:`, error);
        allQuestions[categoryId.replace('cat_', '').replace('_', '-')] = [];
      }
    }
    
    return c.json({
      success: true,
      data: allQuestions,
      message: 'Successfully retrieved all relationship test questions',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('Failed to get relationship questions:', error);
    return c.json({
      success: false,
      error: 'Failed to retrieve questions',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// Get questions for a specific relationship test type
relationshipQuestionsRouter.get('/:testType', async (c) => {
  try {
    const testType = c.req.param('testType');
    
    // Validate test type
    const validTestTypes = ['love_style', 'love_language', 'interpersonal'];
    if (!validTestTypes.includes(testType)) {
      return c.json({
        success: false,
        error: 'Invalid test type',
        message: `Supported test types: ${validTestTypes.join(', ')}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    const questionModel = new QuestionBankModel(c.env);
    
    // Map testType to category_id
    const categoryIdMap: { [key: string]: string } = {
      'love_style': 'cat_love_style',
      'love_language': 'cat_love_language',
      'interpersonal': 'cat_interpersonal'
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

export { relationshipQuestionsRouter };
