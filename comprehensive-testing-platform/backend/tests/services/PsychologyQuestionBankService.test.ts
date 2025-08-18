/**
 * 心理测试题库管理服务单元测试
 * 遵循统一开发标准的测试规范
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PsychologyQuestionBankService } from '../../src/services/PsychologyQuestionBankService';
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors';
import type { Env } from '../../src/index';

// 模拟环境
const mockEnv: Env = {
  DB: {} as D1Database,
  KV: {} as KVNamespace,
  ENVIRONMENT: 'test'
};

// 模拟数据库操作
const mockDb = {
  prepare: vi.fn(),
  run: vi.fn(),
  first: vi.fn(),
  all: vi.fn()
};

// 模拟缓存操作
const mockKv = {
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn()
};

describe('PsychologyQuestionBankService', () => {
  let service: PsychologyQuestionBankService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // 重置模拟环境
    mockEnv.DB = mockDb as any;
    mockEnv.KV = mockKv as any;
    
    service = new PsychologyQuestionBankService(mockEnv);
  });

  describe('createCategory', () => {
    it('应该成功创建题库分类', async () => {
      const categoryData = {
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '16种人格类型测试',
        questionCount: 20,
        dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
        scoringType: 'binary' as const,
        minScore: 0,
        maxScore: 1,
        estimatedTime: 20
      };

      // 模拟数据库操作
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: true })
        })
      });

      const result = await service.createCategory(categoryData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(mockDb.prepare).toHaveBeenCalled();
    });

    it('应该验证分类代码唯一性', async () => {
      const categoryData = {
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '16种人格类型测试',
        questionCount: 20,
        dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
        scoringType: 'binary' as const,
        minScore: 0,
        maxScore: 1,
        estimatedTime: 20
      };

      // 模拟已存在的分类
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 'existing-id' })
        })
      });

      await expect(service.createCategory(categoryData))
        .rejects
        .toThrow(ModuleError);
    });
  });

  describe('getCategoryByCode', () => {
    it('应该从缓存获取分类信息', async () => {
      const mockCategory = {
        id: 'mbti-category',
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '16种人格类型测试',
        questionCount: 20,
        dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
        scoringType: 'binary' as const,
        minScore: 0,
        maxScore: 1,
        estimatedTime: 20,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 模拟缓存命中
      mockKv.get.mockResolvedValue(JSON.stringify(mockCategory));

      const result = await service.getCategoryByCode('mbti');
      
      expect(result).toEqual(mockCategory);
      expect(mockKv.get).toHaveBeenCalledWith('psychology:category:mbti');
    });

    it('应该从数据库获取分类信息并缓存', async () => {
      const mockCategory = {
        id: 'mbti-category',
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '16种人格类型测试',
        questionCount: 20,
        dimensions: '["E/I", "S/N", "T/F", "J/P"]',
        scoring_type: 'binary',
        min_score: 0,
        max_score: 1,
        estimated_time: 20,
        is_active: 1,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockCategory)
        })
      });

      const result = await service.getCategoryByCode('mbti');
      
      expect(result).toBeDefined();
      expect(result?.name).toBe('MBTI性格测试');
      expect(mockKv.put).toHaveBeenCalled();
    });
  });

  describe('getAllActiveCategories', () => {
    it('应该获取所有活跃的题库分类', async () => {
      const mockCategories = [
        {
          id: 'mbti-category',
          name: 'MBTI性格测试',
          code: 'mbti',
          description: '16种人格类型测试',
          question_count: 20,
          dimensions: '["E/I", "S/N", "T/F", "J/P"]',
          scoring_type: 'binary',
          min_score: 0,
          max_score: 1,
          estimated_time: 20,
          is_active: 1,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ results: mockCategories })
        })
      });

      const result = await service.getAllActiveCategories();
      
      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('mbti');
      expect(mockKv.put).toHaveBeenCalled();
    });
  });

  describe('createQuestion', () => {
    it('应该成功创建题库题目', async () => {
      const questionData = {
        categoryId: 'mbti-category',
        questionText: '在社交场合中，你通常：',
        questionTextEn: 'In social situations, you usually:',
        questionType: 'single_choice' as const,
        dimension: 'E/I',
        orderIndex: 1
      };

      // 模拟分类存在
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 'mbti-category' }),
          run: vi.fn().mockResolvedValue({ success: true })
        })
      });

      const result = await service.createQuestion(questionData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('应该验证分类是否存在', async () => {
      const questionData = {
        categoryId: 'non-existent-category',
        questionText: '测试题目',
        questionType: 'single_choice' as const,
        orderIndex: 1
      };

      // 模拟分类不存在
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(null)
        })
      });

      await expect(service.createQuestion(questionData))
        .rejects
        .toThrow(ModuleError);
    });
  });

  describe('getQuestionsByCategory', () => {
    it('应该从缓存获取题目列表', async () => {
      const mockQuestions = [
        {
          id: 'mbti-q-1',
          category_id: 'mbti-category',
          question_text: '在社交场合中，你通常：',
          question_text_en: 'In social situations, you usually:',
          question_type: 'single_choice',
          dimension: 'E/I',
          domain: null,
          weight: 1,
          order_index: 1,
          is_required: 1,
          is_active: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      // 模拟缓存命中
      mockKv.get.mockResolvedValue(JSON.stringify(mockQuestions));

      const result = await service.getQuestionsByCategory('mbti-category');
      
      expect(result).toHaveLength(1);
      expect(result[0].questionText).toBe('在社交场合中，你通常：');
    });
  });

  describe('createQuestionOption', () => {
    it('应该成功创建题目选项', async () => {
      const optionData = {
        questionId: 'mbti-q-1',
        optionText: '主动与他人交谈，享受社交',
        optionTextEn: 'Initiate conversations and enjoy socializing',
        optionValue: 'E',
        orderIndex: 1
      };

      // 模拟数据库操作
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: true })
        })
      });

      const result = await service.createQuestionOption(optionData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('getOptionsByQuestion', () => {
    it('应该获取题目的所有选项', async () => {
      const mockOptions = [
        {
          id: 'opt-1',
          question_id: 'mbti-q-1',
          option_text: '主动与他人交谈，享受社交',
          option_text_en: 'Initiate conversations and enjoy socializing',
          option_value: 'E',
          option_score: null,
          option_description: null,
          order_index: 1,
          is_correct: 0,
          is_active: 1,
          created_at: new Date().toISOString()
        }
      ];

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          all: vi.fn().mockResolvedValue({ results: mockOptions })
        })
      });

      const result = await service.getOptionsByQuestion('mbti-q-1');
      
      expect(result).toHaveLength(1);
      expect(result[0].optionText).toBe('主动与他人交谈，享受社交');
    });
  });

  describe('createConfig', () => {
    it('应该成功创建题库配置', async () => {
      const configData = {
        categoryId: 'mbti-category',
        configKey: 'dimension_weights',
        configValue: '{"E/I": 1, "S/N": 1, "T/F": 1, "J/P": 1}',
        configType: 'json' as const,
        description: 'MBTI各维度权重配置'
      };

      // 模拟数据库操作
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: true })
        })
      });

      const result = await service.createConfig(configData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('getConfigValue', () => {
    it('应该获取配置值', async () => {
      const mockConfig = {
        config_value: '{"E/I": 1, "S/N": 1, "T/F": 1, "J/P": 1}'
      };

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockConfig)
        })
      });

      const result = await service.getConfigValue('mbti-category', 'dimension_weights');
      
      expect(result).toBe('{"E/I": 1, "S/N": 1, "T/F": 1, "J/P": 1}');
    });
  });

  describe('createVersion', () => {
    it('应该成功创建题库版本', async () => {
      const versionData = {
        categoryId: 'mbti-category',
        versionNumber: '1.0.0',
        versionName: 'MBTI标准版',
        description: '基于Myers-Briggs理论的20题标准版本',
        isActive: true
      };

      // 模拟数据库操作
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: true })
        })
      });

      const result = await service.createVersion(versionData);
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('getActiveVersion', () => {
    it('应该获取分类的当前活跃版本', async () => {
      const mockVersion = {
        id: 'mbti-v1',
        category_id: 'mbti-category',
        version_number: '1.0.0',
        version_name: 'MBTI标准版',
        description: '基于Myers-Briggs理论的20题标准版本',
        is_active: 1,
        created_at: new Date().toISOString()
      };

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockVersion)
        })
      });

      const result = await service.getActiveVersion('mbti-category');
      
      expect(result).toBeDefined();
      expect(result?.versionNumber).toBe('1.0.0');
    });
  });

  describe('getQuestionBankStats', () => {
    it('应该获取题库统计信息', async () => {
      const mockCategories = [
        {
          id: 'mbti-category',
          name: 'MBTI性格测试',
          code: 'mbti',
          description: '16种人格类型测试',
          question_count: 20,
          dimensions: '["E/I", "S/N", "T/F", "J/P"]',
          scoring_type: 'binary',
          min_score: 0,
          max_score: 1,
          estimated_time: 20,
          is_active: 1,
          sort_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const mockQuestions = [
        {
          id: 'mbti-q-1',
          category_id: 'mbti-category',
          question_text: '测试题目',
          question_text_en: 'Test question',
          question_type: 'single_choice',
          dimension: 'E/I',
          domain: null,
          weight: 1,
          order_index: 1,
          is_required: 1,
          is_active: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      const mockOptions = [
        {
          id: 'opt-1',
          question_id: 'mbti-q-1',
          option_text: '选项1',
          option_text_en: 'Option 1',
          option_value: 'E',
          option_score: null,
          option_description: null,
          order_index: 1,
          is_correct: 0,
          is_active: 1,
          created_at: new Date().toISOString()
        }
      ];

      // 模拟缓存未命中
      mockKv.get.mockResolvedValue(null);
      
      // 模拟数据库查询
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ total: 1 }),
          all: vi.fn()
            .mockResolvedValueOnce({ results: mockCategories })
            .mockResolvedValueOnce({ results: mockQuestions })
            .mockResolvedValueOnce({ results: mockOptions })
        })
      });

      const result = await service.getQuestionBankStats();
      
      expect(result.totalCategories).toBe(1);
      expect(result.totalQuestions).toBe(1);
      expect(result.totalOptions).toBe(1);
      expect(result.categoryBreakdown.mbti).toBe(1);
      expect(result.dimensionBreakdown['E/I']).toBe(1);
    });
  });

  describe('错误处理', () => {
    it('应该正确处理数据库错误', async () => {
      // 模拟数据库错误
      mockDb.prepare.mockReturnValue({
        bind: vi.fn().mockReturnValue({
          run: vi.fn().mockResolvedValue({ success: false, error: 'Database error' })
        })
      });

      const categoryData = {
        name: 'MBTI性格测试',
        code: 'mbti',
        description: '16种人格类型测试',
        questionCount: 20,
        dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
        scoringType: 'binary' as const,
        minScore: 0,
        maxScore: 1,
        estimatedTime: 20
      };

      await expect(service.createCategory(categoryData))
        .rejects
        .toThrow(ModuleError);
    });

    it('应该正确处理缓存错误', async () => {
      // 模拟缓存错误
      mockKv.get.mockRejectedValue(new Error('Cache error'));

      const result = await service.getCategoryByCode('mbti');
      
      // 缓存错误不应该影响主要功能
      expect(result).toBeNull();
    });
  });
}); 