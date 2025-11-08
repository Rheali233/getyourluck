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
    
    // Get questions for all career test categories (try multiple possible IDs)
    const categoryMap: { [key: string]: string[] } = {
      'holland': ['cat_holland', 'holland-category'],
      'disc': ['cat_disc', 'disc-category'],
      'leadership': ['cat_leadership', 'leadership-category']
    };
    const allQuestions: any = {};
    
    for (const [categoryCode, possibleIds] of Object.entries(categoryMap)) {
      let questions: any[] = [];
      
      // Try each possible category ID
      for (const categoryId of possibleIds) {
        try {
          console.log(`Fetching questions for category: ${categoryId}`);
          const testQuestions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
          if (testQuestions.length > 0) {
            questions = testQuestions;
            console.log(`Found ${questions.length} questions for ${categoryId}`);
            break;
          }
        } catch (error) {
          console.log(`Category ${categoryId} not found, trying next...`);
          continue;
        }
      }
      
      // If still no questions, try finding by code
      if (questions.length === 0) {
        try {
          const category = await questionModel.findCategoryByCode(categoryCode);
          if (category) {
            questions = await questionModel.getQuestionsWithOptionsByCategory(category.id);
            console.log(`Found ${questions.length} questions by code for ${categoryCode}`);
          }
        } catch (error) {
          console.error(`Failed to find category by code for ${categoryCode}:`, error);
        }
      }
      
      allQuestions[categoryCode] = questions;
      if (questions.length > 0) {
        console.log(`First question sample for ${categoryCode}:`, questions[0]);
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
    
    // Map testType to category_id (try multiple possible IDs)
    const categoryIdMap: { [key: string]: string[] } = {
      'holland': ['cat_holland', 'holland-category'],
      'disc': ['cat_disc', 'disc-category'],
      'leadership': ['cat_leadership', 'leadership-category']
    };
    
    const possibleCategoryIds = categoryIdMap[testType];
    if (!possibleCategoryIds) {
      return c.json({
        success: false,
        error: 'Invalid test type',
        message: `Unsupported test type: ${testType}`,
        timestamp: new Date().toISOString(),
        requestId: c.req.header('X-Request-ID')
      }, 400);
    }
    
    // Try each possible category ID until we find one with questions
    let questions: any[] = [];
    let categoryId: string | null = null;
    
    for (const id of possibleCategoryIds) {
      try {
        console.log(`Trying categoryId: ${id}`);
        const testQuestions = await questionModel.getQuestionsWithOptionsByCategory(id);
        if (testQuestions.length > 0) {
          questions = testQuestions;
          categoryId = id;
          console.log(`Found ${questions.length} questions for categoryId: ${id}`);
          break;
        }
      } catch (error) {
        console.log(`Category ${id} not found or has no questions, trying next...`);
        continue;
      }
    }
    
    // If no questions found by ID, try finding by code
    if (questions.length === 0) {
      try {
        const category = await questionModel.findCategoryByCode(testType);
        if (category) {
          categoryId = category.id;
          questions = await questionModel.getQuestionsWithOptionsByCategory(categoryId);
          console.log(`Found ${questions.length} questions by code for ${testType}`);
        }
      } catch (error) {
        console.error(`Failed to find category by code: ${error}`);
      }
    }
    
    if (questions.length === 0) {
      console.log(`No questions found for ${testType} with any category ID`);
    } else {
      console.log(`Retrieved ${questions.length} questions for ${testType} (category: ${categoryId})`);
      console.log('First question sample:', questions[0]);
    }
    
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

export { careerQuestionsRouter };
