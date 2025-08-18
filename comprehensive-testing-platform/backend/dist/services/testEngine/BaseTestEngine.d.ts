/**
 * 统一测试引擎基类
 * 遵循统一开发标准的测试引擎规范
 */
import { TestResult, TestSubmission } from "../../../../shared/types/apiResponse";
import { DatabaseService } from "../DatabaseService";
import { CacheService } from "../CacheService";
export interface TestConfig {
    id: string;
    name: string;
    description: string;
    category: string;
    configData: any;
    isActive: boolean;
}
export interface TestSession {
    id: string;
    testTypeId: string;
    answersData: any[];
    resultData: any;
    userAgent?: string;
    ipAddressHash?: string;
    sessionDuration: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface TestProcessOptions {
    includeDetails?: boolean;
    cacheResults?: boolean;
    validateAnswers?: boolean;
}
export interface TestEngineSessionData {
    testTypeId: string;
    answersData: any[];
    resultData: any;
    userAgent?: string;
    ipAddressHash?: string;
    sessionDuration?: number;
}
/**
 * 测试引擎基类
 * 所有具体测试类型的引擎都应该继承此类
 */
export declare abstract class BaseTestEngine {
    protected testType: string;
    protected dbService: DatabaseService;
    protected cacheService: CacheService;
    protected cacheKeyPrefix: string;
    /**
     * 构造函数
     * @param testType 测试类型
     * @param dbService 数据库服务
     * @param cacheService 缓存服务
     */
    constructor(testType: string, dbService: DatabaseService, cacheService: CacheService);
    /**
     * 获取测试配置
     * @returns 测试配置
     */
    getTestConfig(): Promise<TestConfig>;
    /**
     * 获取测试题目
     * @returns 测试题目数据
     */
    getQuestions(): Promise<any>;
    /**
     * 处理测试提交
     * @param submission 测试提交数据
     * @param options 处理选项
     * @returns 测试结果
     */
    processSubmission(submission: TestSubmission, options?: TestProcessOptions): Promise<TestResult>;
    /**
     * 获取测试结果
     * @param sessionId 会话ID
     * @returns 测试结果
     */
    getResult(sessionId: string): Promise<TestResult>;
    /**
     * 创建或更新测试会话
     * @param submission 测试提交数据
     * @param result 计算结果
     * @returns 会话ID
     */
    protected saveSession(submission: TestSubmission, result: any): Promise<string>;
    /**
     * 生成测试题目（由子类实现）
     * @param configData 配置数据
     */
    protected abstract generateQuestions(configData: any): Promise<any[]>;
    /**
     * 验证答案（由子类实现）
     * @param answers 答案数据
     */
    protected abstract validateAnswers(answers: any[]): Promise<void>;
    /**
     * 计算测试结果（由子类实现）
     * @param submission 测试提交数据
     */
    protected abstract calculateResult(submission: TestSubmission): Promise<any>;
}
//# sourceMappingURL=BaseTestEngine.d.ts.map