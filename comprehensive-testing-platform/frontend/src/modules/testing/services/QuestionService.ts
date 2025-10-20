import { Question, QuestionFormat } from '../types/TestTypes';
import { getApiBaseUrl } from '@/config/environment';

/**
 * Unified Question Service
 * Provides question loading functionality for all test modules
 */

export interface QuestionServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QuestionsByType {
  [testType: string]: Question[];
}

export class QuestionService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // 优先使用传入的baseUrl，否则使用环境配置的API地址
    this.baseUrl = baseUrl || getApiBaseUrl();
  }

  /**
   * Get questions by test type and language
   */
  async getQuestionsByType(
    testType: string, 
    language: string = 'en'
  ): Promise<QuestionServiceResponse<Question[]>> {
    try {
      // 统一使用 v1 接口
      const apiPath = `${this.baseUrl}/api/v1/tests/${testType}/questions`;
      
      const response = await fetch(`${apiPath}?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 处理嵌套的数据结构
      let questions = data.questions || data.data || data;
      
      // 如果questions是数组，直接使用；如果是对象，尝试提取其中的data字段
      if (Array.isArray(questions)) {
        // 直接是数组
      } else if (questions && typeof questions === 'object' && questions.data) {
        // 嵌套结构，提取内层的data
        questions = questions.data;
      }
      
      // 为 learning 模块转换数据格式
      if (['vark'].includes(testType)) {
        questions = this.convertLearningQuestions(questions, testType);
      }
      
      // Debug logging removed for production
      
      return {
        success: true,
        data: questions,
        message: 'Questions loaded successfully'
      };
    } catch (error) {
      // Log error for debugging
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load questions'
      };
    }
  }

  /**
   * Get all questions for multiple test types
   */
  async getQuestionsByTypes(
    testTypes: string[], 
    language: string = 'en'
  ): Promise<QuestionServiceResponse<QuestionsByType>> {
    try {
      const promises = testTypes.map(type => this.getQuestionsByType(type, language));
      const results = await Promise.all(promises);
      
      const questionsByType: QuestionsByType = {};
      let hasErrors = false;
      
      results.forEach((result, index) => {
        const testType = testTypes[index];
        if (result.success && result.data && testType) {
          questionsByType[testType] = result.data;
        } else {
          hasErrors = true;
          // Log error for debugging
        }
      });

      if (hasErrors) {
        return {
          success: false,
          error: 'Some questions failed to load',
          data: questionsByType
        };
      }

      return {
        success: true,
        data: questionsByType,
        message: 'All questions loaded successfully'
      };
    } catch (error) {
      // Log error for debugging
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load questions'
      };
    }
  }

  /**
   * Get question by ID
   */
  async getQuestionById(
    questionId: string, 
    language: string = 'en'
  ): Promise<QuestionServiceResponse<Question>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/questions/${questionId}?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.question || data,
        message: 'Question loaded successfully'
      };
    } catch (error) {
      // Log error for debugging
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load question'
      };
    }
  }

  /**
   * Convert learning module questions to unified Question format
   */
  private convertLearningQuestions(questions: any[], testType: string): Question[] {
    if (!Array.isArray(questions)) {
      return [];
    }

    return questions.map((question) => {
      if (testType === 'vark') {
        return this.convertVARKQuestion(question);
      }
      return question as Question;
    });
  }

  /**
   * Convert VARK question format
   */
  private convertVARKQuestion(varkQuestion: any): Question {
    return {
      id: varkQuestion.id,
      // 兼容 v1 直接返回 text 与老格式 questionText
      text: varkQuestion.text || varkQuestion.questionText,
      format: QuestionFormat.MULTIPLE_CHOICE,
      category: varkQuestion.category,
      weight: varkQuestion.weight,
      options: varkQuestion.options?.map((option: any) => ({
        id: option.id,
        text: option.text,
        value: option.dimension, // VARK uses dimension as value
        description: option.text
      })) || [],
      // VARK specific fields
      dimension: varkQuestion.dimension,
      minSelections: 1,
      maxSelections: 4 // Allow multiple selections for VARK
    };
  }

  

  /**
   * Convert Cognitive question format
   */
  // cognitive removed
}

// Export singleton instance
export const questionService = new QuestionService();
