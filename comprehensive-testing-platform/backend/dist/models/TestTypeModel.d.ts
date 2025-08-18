/**
 * 测试类型数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import type { Env } from '../index';
export interface TestType {
    id: string;
    name: string;
    category: string;
    description?: string;
    configData: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}
export interface TestConfig {
    questions: any[];
    scoringType: string;
    scoringRules: any;
    resultTemplates: any;
    timeLimit?: number;
    questionCount: number;
}
export interface CreateTestTypeData {
    id: string;
    name: string;
    category: string;
    description?: string;
    config: TestConfig;
    isActive?: boolean;
    sortOrder?: number;
}
export declare class TestTypeModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建测试类型
     */
    create(testTypeData: CreateTestTypeData): Promise<string>;
    /**
     * 获取所有活跃的测试类型
     */
    getAllActive(): Promise<TestType[]>;
    /**
     * 根据ID获取测试类型
     */
    findById(id: string): Promise<TestType | null>;
    /**
     * 根据分类获取测试类型
     */
    findByCategory(category: string): Promise<TestType[]>;
    /**
     * 获取测试配置
     */
    getConfig(id: string): Promise<TestConfig | null>;
    /**
     * 更新测试类型
     */
    update(id: string, updateData: Partial<CreateTestTypeData>): Promise<void>;
    /**
     * 删除测试类型（软删除 - 设置为不活跃）
     */
    softDelete(id: string): Promise<void>;
    /**
     * 获取所有分类
     */
    getCategories(): Promise<string[]>;
}
//# sourceMappingURL=TestTypeModel.d.ts.map