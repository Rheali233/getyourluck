/**
 * 测试引擎模块索引
 * 遵循统一开发标准的模块导出规范
 */
import { BaseTestEngine, TestConfig, TestSession, TestProcessOptions } from './BaseTestEngine';
import { DatabaseService } from '../DatabaseService';
import { CacheService } from '../CacheService';
export declare enum TestTypes {
    MBTI = "mbti",
    TAROT = "tarot",
    ASTROLOGY = "astrology",
    PSYCHOLOGY = "psychology",
    CAREER = "career",
    LEARNING = "learning",
    RELATIONSHIP = "relationship",
    NUMEROLOGY = "numerology"
}
/**
 * 统一测试引擎服务类
 * 提供对所有测试类型的统一访问接口
 */
export declare class TestEngineService {
    private dbService;
    private cacheService;
    /**
     * 构造函数
     * @param dbService 数据库服务
     * @param cacheService 缓存服务
     */
    constructor(dbService: DatabaseService, cacheService: CacheService);
    /**
     * 获取所有测试类型
     * @param activeOnly 是否只获取激活的测试类型
     * @returns 测试类型列表
     */
    getTestTypes(activeOnly?: boolean): Promise<TestConfig[]>;
    /**
     * 获取测试配置
     * @param testType 测试类型
     * @returns 测试配置
     */
    getTestConfig(testType: string): Promise<TestConfig>;
    /**
     * 获取测试结果
     * @param sessionId 会话ID
     * @returns 测试结果
     */
    getTestResult(sessionId: string): Promise<any>;
    /**
     * 保存测试会话
     * @param sessionData 会话数据
     * @returns 会话ID
     */
    saveTestSession(sessionData: {
        testTypeId: string;
        answersData: any[];
        resultData: any;
        userAgent?: string | null;
        ipAddressHash?: string;
        sessionDuration?: number;
    }): Promise<string>;
}
export { BaseTestEngine, TestConfig, TestSession, TestProcessOptions };
//# sourceMappingURL=index.d.ts.map