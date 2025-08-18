/**
 * 心理测试题库数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
export interface PsychologyQuestionCategoryData {
    id: string;
    name: string;
    code: string;
    description: string;
    questionCount: number;
    dimensions: string[];
    scoringType: 'binary' | 'likert' | 'scale';
    minScore: number;
    maxScore: number;
    estimatedTime: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PsychologyQuestionData {
    id: string;
    categoryId: string;
    questionText: string;
    questionTextEn?: string;
    questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
    dimension?: string;
    domain?: string;
    weight: number;
    orderIndex: number;
    isRequired: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PsychologyQuestionOptionData {
    id: string;
    questionId: string;
    optionText: string;
    optionTextEn?: string;
    optionValue: string;
    optionScore?: number;
    optionDescription?: string;
    orderIndex: number;
    isCorrect: boolean;
    isActive: boolean;
    createdAt: Date;
}
export interface PsychologyQuestionConfigData {
    id: string;
    categoryId: string;
    configKey: string;
    configValue: string;
    configType: 'string' | 'number' | 'boolean' | 'json';
    description: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface PsychologyQuestionVersionData {
    id: string;
    categoryId: string;
    versionNumber: string;
    versionName: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
}
export interface CreatePsychologyQuestionCategoryData {
    name: string;
    code: string;
    description: string;
    questionCount: number;
    dimensions: string[];
    scoringType: 'binary' | 'likert' | 'scale';
    minScore: number;
    maxScore: number;
    estimatedTime: number;
    sortOrder?: number;
}
export interface CreatePsychologyQuestionData {
    categoryId: string;
    questionText: string;
    questionTextEn?: string;
    questionType: 'single_choice' | 'likert_scale' | 'multiple_choice';
    dimension?: string;
    domain?: string;
    weight?: number;
    orderIndex: number;
    isRequired?: boolean;
}
export interface CreatePsychologyQuestionOptionData {
    questionId: string;
    optionText: string;
    optionTextEn?: string;
    optionValue: string;
    optionScore?: number;
    optionDescription?: string;
    orderIndex: number;
    isCorrect?: boolean;
}
export interface CreatePsychologyQuestionConfigData {
    categoryId: string;
    configKey: string;
    configValue: string;
    configType: 'string' | 'number' | 'boolean' | 'json';
    description: string;
    isPublic?: boolean;
}
export interface CreatePsychologyQuestionVersionData {
    categoryId: string;
    versionNumber: string;
    versionName: string;
    description: string;
    isActive?: boolean;
}
/**
 * 心理测试题库数据模型类
 */
export declare class PsychologyQuestionBankModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建题库分类
     */
    createCategory(data: CreatePsychologyQuestionCategoryData): Promise<string>;
    /**
     * 根据代码查找题库分类
     */
    findCategoryByCode(code: string): Promise<PsychologyQuestionCategoryData | null>;
    /**
     * 获取所有活跃的题库分类
     */
    getAllActiveCategories(): Promise<PsychologyQuestionCategoryData[]>;
    /**
     * 创建题库题目
     */
    createQuestion(data: CreatePsychologyQuestionData): Promise<string>;
    /**
     * 根据分类ID获取题目列表
     */
    getQuestionsByCategory(categoryId: string): Promise<PsychologyQuestionData[]>;
    /**
     * 根据维度获取题目列表
     */
    getQuestionsByDimension(dimension: string): Promise<PsychologyQuestionData[]>;
    /**
     * 创建题目选项
     */
    createQuestionOption(data: CreatePsychologyQuestionOptionData): Promise<string>;
    /**
     * 根据题目ID获取选项列表
     */
    getOptionsByQuestion(questionId: string): Promise<PsychologyQuestionOptionData[]>;
    /**
     * 创建题库配置
     */
    createConfig(data: CreatePsychologyQuestionConfigData): Promise<string>;
    /**
     * 根据分类ID获取配置列表
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
    private mapToCategoryData;
    private mapToQuestionData;
    private mapToOptionData;
    private mapToConfigData;
    private mapToVersionData;
}
//# sourceMappingURL=PsychologyQuestionBankModel.d.ts.map