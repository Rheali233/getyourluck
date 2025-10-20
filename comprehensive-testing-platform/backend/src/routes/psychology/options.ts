import { Hono } from 'hono';
import { QuestionBankModel } from '../../models/QuestionBankModel';
import type { AppContext } from '../../types/env';

const optionsRouter = new Hono<AppContext>();

// 获取选项
optionsRouter.get('/', async (c) => {
  try {
    const questionId = c.req.query('question_id');
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    let options;
    if (questionId) {
      options = await questionModel.getOptionsByQuestion(questionId);
    } else {
      // 获取所有选项需要先获取所有题目
      const categories = await questionModel.getAllActiveCategories();
      options = [];
      for (const category of categories) {
        const questions = await questionModel.getQuestionsByCategory(category.id);
        for (const question of questions) {
          const questionOptions = await questionModel.getOptionsByQuestion(question.id);
          options.push(...questionOptions);
        }
      }
    }
    
    return c.json({
      success: true,
      data: options,
      message: 'Successfully retrieved options',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('Failed to get options:', error);
    return c.json({
      success: false,
      error: 'Failed to get options',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 创建选项
optionsRouter.post('/', async (c) => {
  try {
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    const optionData = await c.req.json();
    
    const result = await questionModel.createQuestionOption(optionData);
    
    return c.json({
      success: true,
      data: result,
      message: 'Option created successfully',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('Failed to create option:', error);
    return c.json({
      success: false,
      error: 'Failed to create option',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

// 批量创建选项
optionsRouter.post('/batch', async (c) => {
  try {
    const dbService = c.get('dbService');
    const questionModel = new QuestionBankModel(dbService.env);
    
    const { question_id, options } = await c.req.json();
    
    const results = [];
    for (const option of options) {
      try {
        const optionData = {
          ...option,
          question_id: question_id
        };
        const result = await questionModel.createQuestionOption(optionData);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          data: option
        });
      }
    }
    
    return c.json({
      success: true,
      data: results,
      message: `Batch operation completed for ${options.length} options`,
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    });
  } catch (error) {
    console.error('Failed to batch create options:', error);
    return c.json({
      success: false,
      error: 'Failed to batch create options',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: c.req.header('X-Request-ID')
    }, 500);
  }
});

export { optionsRouter };
