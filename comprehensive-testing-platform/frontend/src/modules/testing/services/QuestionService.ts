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
      // 根据测试类型确定API路径
      let apiPath: string;
      if (['mbti', 'phq9', 'eq', 'happiness'].includes(testType)) {
        apiPath = `${this.baseUrl}/psychology/questions`;
      } else if (['holland', 'disc', 'leadership'].includes(testType)) {
        apiPath = `${this.baseUrl}/career/questions`;
      } else if (['vark'].includes(testType)) {
        apiPath = `${this.baseUrl}/learning-ability/questions`;
      } else if (['love_language', 'love_style', 'interpersonal'].includes(testType)) {
        apiPath = `${this.baseUrl}/relationship/questions`;
      } else {
        // 默认使用psychology API
        apiPath = `${this.baseUrl}/psychology/questions`;
      }
      
      // 对于career、learning、relationship和psychology模块，需要调用特定的测试类型端点
      let fullApiPath = apiPath;
      if (['holland', 'disc', 'leadership'].includes(testType)) {
        fullApiPath = `${apiPath}/${testType}`;
      } else if (['vark'].includes(testType)) {
        fullApiPath = `${apiPath}/${testType}`;
      } else if (['love_language', 'love_style', 'interpersonal'].includes(testType)) {
        fullApiPath = `${apiPath}/${testType}`;
      } else if (['mbti', 'phq9', 'eq', 'happiness'].includes(testType)) {
        // Psychology 模块也使用特定端点，就像 DISC 一样
        fullApiPath = `${apiPath}/${testType}`;
      } else {
        fullApiPath = `${apiPath}?language=${language}`;
      }
      
      const response = await fetch(fullApiPath, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // 处理不同API返回的数据结构
      let questions = [];
      if (data.success && data.data) {
        if (['holland', 'disc', 'leadership', 'love_language', 'love_style', 'interpersonal', 'mbti', 'phq9', 'eq', 'happiness'].includes(testType)) {
          // career、relationship和psychology API的特定端点返回 { success: true, data: [...] }
          questions = Array.isArray(data.data) ? data.data : [];
        } else if (['vark'].includes(testType)) {
          // learning API的特定端点返回 { success: true, data: { vark: [...] } }
          questions = data.data[testType] || [];
        } else {
          // 其他情况：可能返回 { success: true, data: { phq9: [...], mbti: [...] } }
          questions = Array.isArray(data.data) ? data.data : (data.data[testType] || []);
        }
      } else if (data.questions || data.data) {
        // 其他API格式
        questions = data.questions || data.data || data;
      }
      
      // 确保questions是数组
      if (!Array.isArray(questions)) {
        questions = [];
      }
      
      // 转换数据格式以匹配前端期望的结构
      questions = this.convertQuestionFormat(questions);
      
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
      const response = await fetch(`${this.baseUrl}/v1/questions/${questionId}?language=${language}`, {
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
   * Convert question format from backend to frontend format
   */
  private convertQuestionFormat(questions: any[]): Question[] {
    if (!Array.isArray(questions)) {
      return [];
    }

    return questions.map((question) => {
      // 确保id字段存在
      if (!question.id) {
        return null;
      }
      
      // 确保text字段存在（后端返回text字段）
      if (!question.text && question.questionText) {
        question.text = question.questionText;
      }
      
      // 转换 type 字段为 format 字段
      if (question.type && !question.format) {
        // 后端返回的type值就是前端format需要的值
        question.format = question.type as QuestionFormat;
        delete question.type;
      }
      
      // 如果没有format，根据options推断
      if (!question.format) {
        if (question.options && question.options.length > 0) {
          question.format = QuestionFormat.LIKERT_SCALE;
        } else {
          question.format = QuestionFormat.SINGLE_CHOICE;
        }
      }
      
      // 确保options字段存在且为数组
      if (!question.options && question.choices) {
        question.options = question.choices;
        delete question.choices;
      }
      
      // 确保options是数组
      if (!Array.isArray(question.options)) {
        question.options = [];
      }
      
      return question;
    }).filter((q): q is Question => q !== null);
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
