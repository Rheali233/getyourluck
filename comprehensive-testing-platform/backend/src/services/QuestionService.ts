import { DatabaseService } from './DatabaseService';
import { CacheService } from './CacheService';
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors';

/**
 * 统一问题服务
 * 使用统一的PsychologyQuestionBankModel架构
 * 所有测试类型通过不同的category来区分
 */
export class QuestionService {
  private dbService: DatabaseService;
  private cacheService: CacheService;

  constructor(dbService: DatabaseService, cacheService: CacheService) {
    this.dbService = dbService;
    this.cacheService = cacheService;
  }

  /**
   * 根据测试类型获取问题
   * @param testType 测试类型
   * @param language 语言 (默认: 'en')
   * @returns 问题列表
   */
  async getQuestionsByType(testType: string, language: string = 'en'): Promise<any> {
    try {
      // 检查缓存
      const cacheKey = `questions:${testType}:${language}`;
      const cachedQuestions = await this.cacheService.get(cacheKey);
      
      if (cachedQuestions) {
        return {
          success: true,
          data: cachedQuestions,
          message: 'Questions retrieved from cache'
        };
      }

      // 根据测试类型获取问题
      let questions: any[] = [];
      
      switch (testType.toLowerCase()) {
        case 'mbti':
          questions = await this.getQuestionsByCategory('mbti');
          break;
        case 'phq9':
          questions = await this.getQuestionsByCategory('phq9');
          break;
        case 'eq':
          questions = await this.getQuestionsByCategory('eq');
          break;
        case 'happiness':
          questions = await this.getQuestionsByCategory('happiness');
          break;
        case 'holland':
          questions = await this.getQuestionsByCategory('holland');
          break;
        case 'disc':
          questions = await this.getQuestionsByCategory('disc');
          break;
        case 'leadership':
          questions = await this.getQuestionsByCategory('leadership');
          break;
        case 'love_language':
          questions = await this.getQuestionsByCategory('love_language');
          break;
        case 'love_style':
          questions = await this.getQuestionsByCategory('love_style');
          break;
        case 'interpersonal':
          questions = await this.getQuestionsByCategory('interpersonal');
          break;
        case 'vark':
          questions = await this.getVARKQuestions();
          break;
        
        // cognitive removed
        default:
          throw new ModuleError(
            `Unsupported test type: ${testType}`,
            ERROR_CODES.TEST_NOT_FOUND,
            404
          );
      }

      // 缓存问题（24小时）
      if (questions.length > 0) {
        await this.cacheService.set(cacheKey, questions, { ttl: 86400 });
      }

      return {
        success: true,
        data: questions,
        message: `Questions for ${testType} retrieved successfully`
      };
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error;
      }
      throw new ModuleError(
        `Failed to retrieve questions for ${testType}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  /**
   * 根据分类代码获取问题
   * 统一的访问方式，使用PsychologyQuestionBankModel
   */
  private async getQuestionsByCategory(categoryCode: string): Promise<any[]> {
    try {
      // 获取分类信息
      const category = await this.getCategoryByCode(categoryCode);
      
      if (!category) {
        throw new Error(`Category '${categoryCode}' not found`);
      }

      // 获取问题列表（包含选项）
      const questions = await this.dbService.questionBank.getQuestionsWithOptionsByCategory(category.id);
      
      // 格式化问题数据为前端需要的格式
      const formattedQuestions = this.formatQuestionsForFrontend(questions, category.scoringType);
      
      return formattedQuestions;
    } catch (error) {
      throw new ModuleError(
        `Failed to retrieve questions for category: ${categoryCode}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  /**
   * 获取VARK学习风格测试问题
   */
  private async getVARKQuestions(): Promise<any[]> {
    try {
      // 直接查询数据库获取VARK问题
      const questionsStmt = this.dbService.db.prepare(`
        SELECT 
          id, question_text, category, dimension, weight, is_active, created_at, updated_at
        FROM vark_questions 
        WHERE is_active = 1 
        ORDER BY category, dimension, weight DESC
      `);
      
      const questions = await questionsStmt.all();
      
      // 获取每个问题的选项
      const questionsWithOptions = await Promise.all(
        questions.results.map(async (question: any) => {
          const optionsStmt = this.dbService.db.prepare(`
            SELECT id, text, dimension, weight
            FROM vark_options 
            WHERE question_id = ? AND is_active = 1
            ORDER BY weight DESC
          `);
          
          const options = await optionsStmt.bind(question['id']).all();
          
          return {
            id: question['id'] as string,
            questionText: question['question_text'] as string,
            category: question['category'] as string,
            dimension: question['dimension'] as 'V' | 'A' | 'R' | 'K',
            weight: question['weight'] as number,
            isActive: question['is_active'] === 1,
            createdAt: question['created_at'] as string,
            updatedAt: question['updated_at'] as string,
            options: options.results.map((opt: any) => ({
              id: opt['id'] as string,
              text: opt['text'] as string,
              dimension: opt['dimension'] as 'V' | 'A' | 'R' | 'K',
              weight: opt['weight'] as number
            }))
          };
        })
      );
      
      // 格式化为前端需要的格式（VARK 为多选题）
      return questionsWithOptions.map(question => ({
        id: question.id,
        text: question.questionText,
        format: 'multiple_choice',
        category: question.category,
        dimension: question.dimension,
        weight: question.weight,
        minSelections: 1,
        maxSelections: 4,
        options: question.options.map(option => ({
          id: option.id,
          text: option.text,
          value: option.dimension,
          dimension: option.dimension
        }))
      }));
    } catch (error) {
      throw new ModuleError(
        `Failed to retrieve VARK questions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      );
    }
  }

  

  // cognitive removed

  /**
   * 根据代码获取分类
   */
  private async getCategoryByCode(code: string): Promise<any> {
    try {
      const categories = await this.dbService.questionBank.getAllActiveCategories();
      const category = categories.find((cat: any) => cat.code === code);
      return category;
    } catch (error) {
      return null;
    }
  }

  /**
   * 格式化问题数据为前端需要的格式
   */
  private formatQuestionsForFrontend(questions: any[], scoringType: string): any[] {
    if (!questions || !Array.isArray(questions)) {
      return [];
    }

    return questions.map((question, index) => {
      // 根据scoringType确定问题格式
      let format = 'single_choice'; // 默认格式
      if (scoringType === 'likert') {
        // PHQ-9等李克特量表，使用单选格式显示按钮
        format = 'single_choice';
      } else if (scoringType === 'scale') {
        format = 'scale';
      } else if (scoringType === 'binary') {
        format = 'single_choice';
      }

      // 构建基础问题对象
      const formattedQuestion: any = {
        id: question.id || `q_${index + 1}`,
        text: question.questionText || question.text || question.question || '',
        format: format,
        category: question.category || question.dimension || 'general',
        dimension: question.dimension || null,
        weight: question.weight || 1
      };

      // 根据格式添加特定属性
      if (format === 'single_choice' || format === 'multiple_choice') {
        if (question.options && Array.isArray(question.options)) {
          // 使用数据库中的选项
          formattedQuestion.options = question.options.map((option: any) => ({
            id: option.id || option.optionId || `opt_${Math.random().toString(36).substr(2, 9)}`,
            text: option.optionText || option.text || '',
            value: option.optionValue || option.value || option.id
          }));
        } else if (scoringType === 'likert') {
          // PHQ-9等李克特量表，如果没有数据库选项，生成默认选项数组
          formattedQuestion.options = [
            { id: 'opt_0', text: 'Not at all', value: '0' },
            { id: 'opt_1', text: 'Several days', value: '1' },
            { id: 'opt_2', text: 'More than half the days', value: '2' },
            { id: 'opt_3', text: 'Nearly every day', value: '3' }
          ];
        }
      } else if (format === 'scale') {
        // 对于量表问题，根据scoringType设置合适的量表范围
        if (scoringType === 'scale') {
          // 对于其他量表
          formattedQuestion.minValue = 0;
          formattedQuestion.maxValue = 3;
          formattedQuestion.step = 1;
          formattedQuestion.labels = {
            min: 'Not at all',
            max: 'Nearly every day',
            center: 'Several days'
          };
        }
      }

      return formattedQuestion;
    });
  }
}

// 导出单例实例
export const questionService = new QuestionService(
  new DatabaseService({} as any), // 临时传入空对象，实际使用时需要正确的env
  new CacheService({} as any, 3600) // 临时传入空对象，实际使用时需要正确的KV
);
