/**
 * Learning Ability Questions API Route
 * Handles requests for VARK, Raven, and Cognitive test questions
 */

import { Hono } from 'hono';
import { LearningQuestionBankModel } from '../../models/learningQuestionBank';

const learningQuestionsRoutes = new Hono();

// Get VARK learning style questions
learningQuestionsRoutes.get('/vark', async (c) => {
  try {
    if (!c.env?.['DB']) {
      return c.json({
        success: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
        requestId: '',
      }, 500);
    }
    
    const model = new LearningQuestionBankModel(c.env);
    const questions = await model.getVARKQuestions();
    
    return c.json({
      success: true,
      data: questions,
      message: 'VARK questions retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve VARK questions',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Raven endpoint removed

// Cognitive endpoint removed

export { learningQuestionsRoutes };
