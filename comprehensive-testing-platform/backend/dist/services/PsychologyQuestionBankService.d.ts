/**
 * 心理测试题库管理服务
 * 遵循统一开发标准的服务层规范
 */
import { type PsychologyQuestionCategoryData, type PsychologyQuestionData, type PsychologyQuestionOptionData, type PsychologyQuestionConfigData, type PsychologyQuestionVersionData, type CreatePsychologyQuestionCategoryData, type CreatePsychologyQuestionData, type CreatePsychologyQuestionOptionData, type CreatePsychologyQuestionConfigData, type CreatePsychologyQuestionVersionData } from "../models";
import type { Env } from "../index";
/**
 * 题库查询参数接口
 */
export interface QuestionBankQueryParams {
    categoryCode?: string;
    dimension?: string;
    domain?: string;
    language?: 'zh' | 'en';
    limit?: number;
    offset?: number;
}
/**
 * 题库统计信息接口
 */
export interface QuestionBankStats {
    totalCategories: number;
    totalQuestions: number;
    totalOptions: number;
    categoryBreakdown: Record<string, number>;
    dimensionBreakdown: Record<string, number>;
}
/**
 * 心理测试题库管理服务类
 */
export declare class PsychologyQuestionBankService {
    private questionBankModel;
    private cache;
    private cacheTTL;
    constructor(env: Env);
    /**
     * 创建题库分类
     */
    createCategory(data: CreatePsychologyQuestionCategoryData): Promise<string>;
    /**
     * 根据代码获取题库分类
     */
    getCategoryByCode(code: string): Promise<PsychologyQuestionCategoryData | null>;
    /**
     * 获取所有活跃的题库分类
     */
    getAllActiveCategories(): Promise<PsychologyQuestionCategoryData[]>;
    /**
     * 创建题库题目
     */
    createQuestion(data: CreatePsychologyQuestionData): Promise<string>;
    /**
     * 根据分类获取题目列表
     */
    getQuestionsByCategory(categoryId: string): Promise<PsychologyQuestionData[]>;
    /**
     * 根据维度获取题目列表
     */
    getQuestionsByDimension(dimension: string): Promise<PsychologyQuestionData[]>;
    /**
     * 根据查询参数获取题目列表
     */
    getQuestionsByParams(params: QuestionBankQueryParams): Promise<PsychologyQuestionData[]>;
    /**
     * 创建题目选项
     */
    createQuestionOption(data: CreatePsychologyQuestionOptionData): Promise<string>;
    /**
     * 根据题目获取选项列表
     */
    getOptionsByQuestion(questionId: string): Promise<PsychologyQuestionOptionData[]>;
    /**
     * 创建题库配置
     */
    createConfig(data: CreatePsychologyQuestionConfigData): Promise<string>;
    /**
     * 根据分类获取配置列表
     */
    getConfigsByCategory(categoryId: string): Promise<PsychologyQuestionConfigData[]>;
    /**
     * 根据配置键获取配置值
     */
    getConfigValue(categoryId: string, configKey: string): Promise<string | null>;
    /**
     * 创建题库版本
     */
    createVersion(data: CreatePsychologyQuestionVersionData): Promise<string>;
    /**
     * 获取分类的当前活跃版本
     */
    getActiveVersion(categoryId: string): Promise<PsychologyQuestionVersionData | null>;
    /**
     * 获取题库统计信息
     */
    getQuestionBankStats(): Promise<QuestionBankStats>;
    /**
     * 设置缓存
     */
    private setCache;
    /**
     * 获取缓存
     */
    private getCache;
    /**
     * 清除分类相关缓存
     */
    private clearCategoryCache;
    /**
     * 清除题目相关缓存
     */
    private clearQuestionCache;
    /**
     * 清除配置相关缓存
     */
    private clearConfigCache;
    /**
     * 清除版本相关缓存
     */
    private clearVersionCache;
}
//# sourceMappingURL=PsychologyQuestionBankService.d.ts.map