/**
 * Learning Ability Test Analysis API Route
 * Handles test submission, analysis, and result generation
 */

import { Hono } from 'hono';
import { LearningTestModel } from '../../models/learningTest';

const learningTestRoutes = new Hono();

// Create new test session
learningTestRoutes.post('/create-session', async (c) => {
  try {
    if (!(c.env as any)?.['DB']) {
      return c.json({
        success: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
        requestId: '',
      }, 500);
    }
    
    const body = await c.req.json();
    const { testType, totalQuestions, language = 'en' } = body;
    
    const model = new LearningTestModel(c.env);
    const sessionId = await model.createTestSession({
      testType,
      totalQuestions,
      language,
      status: 'in_progress',
      startTime: new Date().toISOString(),
      answeredQuestions: 0,
      timeSpent: 0,
      userAgent: c.req.header('User-Agent') || 'Unknown',
      ipAddress: c.req.header('CF-Connecting-IP') || 'Unknown'
    });
    
    return c.json({
      success: true,
      data: { sessionId },
      message: 'Test session created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create test session',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Submit test answers and generate results
learningTestRoutes.post('/submit', async (c) => {
  try {
    if (!(c.env as any)?.['DB']) {
      return c.json({
        success: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
        requestId: '',
      }, 500);
    }
    
    const body = await c.req.json();
    const { testType } = body || {};
    // Frontend may send answers in unified format; normalize for learning module
    let answers = body?.answers || [];
    if (Array.isArray(answers) && testType === 'vark') {
      // Convert unified value[] to selectedOptions[] expected by model
      answers = answers.map((a: any) => ({
        questionId: a.questionId,
        selectedOptions: Array.isArray(a.value) ? a.value : (Array.isArray(a.selectedOptions) ? a.selectedOptions : []),
        timeSpent: typeof a.timeSpent === 'number' ? a.timeSpent : 0
      }));
    }

    // Basic validation aligned with PHQ-9
    const validTypes = ['vark'];
    if (!testType || !validTypes.includes(testType)) {
      return c.json({
        success: false,
        error: 'Invalid test type',
        message: `Supported test types: ${validTypes.join(', ')}`,
        timestamp: new Date().toISOString()
      }, 400);
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return c.json({
        success: false,
        error: 'Answers must be a non-empty array',
        timestamp: new Date().toISOString()
      }, 400);
    }

    // Sanitize answers per test type
    let sanitizedAnswers: any[] = [];
    if (testType === 'vark') {
      sanitizedAnswers = (answers || [])
        .filter((a: any) => a && typeof a.questionId === 'string')
        .map((a: any) => ({
          questionId: a.questionId,
          selectedOptions: Array.isArray(a.selectedOptions) ? a.selectedOptions : [],
          timeSpent: typeof a.timeSpent === 'number' ? a.timeSpent : 0
        }));
    }

    if (sanitizedAnswers.length === 0) {
      return c.json({
        success: false,
        error: 'No valid answers provided',
        timestamp: new Date().toISOString()
      }, 400);
    }
    
    const model = new LearningTestModel(c.env);
    const result = await model.processTestSubmission(testType, sanitizedAnswers, body?.sessionData || {});
    
    return c.json({
      success: true,
      data: result,
      message: 'Test submitted and analyzed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process test submission',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get test result by session ID
learningTestRoutes.get('/result/:sessionId', async (c) => {
  try {
    if (!(c.env as any)?.['DB']) {
      return c.json({
        success: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
        requestId: '',
      }, 500);
    }
    
    const sessionId = c.req.param('sessionId');
    const model = new LearningTestModel(c.env);
    const result = await model.getTestResult(sessionId);
    
    return c.json({
      success: true,
      data: result,
      message: 'Test result retrieved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve test result',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Submit feedback for test result
learningTestRoutes.post('/feedback/:sessionId', async (c) => {
  try {
    if (!(c.env as any)?.['DB']) {
      return c.json({
        success: false,
        error: 'Database not available',
        timestamp: new Date().toISOString(),
        requestId: '',
      }, 500);
    }
    
    const sessionId = c.req.param('sessionId');
    const body = await c.req.json();
    const { feedback, rating, comments } = body;
    
    const model = new LearningTestModel(c.env);
    await model.submitFeedback(sessionId, feedback, rating, comments);
    
    return c.json({
      success: true,
      message: 'Feedback submitted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit feedback',
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export { learningTestRoutes };
