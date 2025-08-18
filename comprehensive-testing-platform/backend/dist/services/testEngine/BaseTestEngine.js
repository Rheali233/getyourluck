/**
 * 统一测试引擎基类
 * 遵循统一开发标准的测试引擎规范
 */
import { ModuleError, ERROR_CODES } from "../../../../shared/types/errors";
/**
 * 测试引擎基类
 * 所有具体测试类型的引擎都应该继承此类
 */
export class BaseTestEngine {
    testType;
    dbService;
    cacheService;
    cacheKeyPrefix;
    /**
     * 构造函数
     * @param testType 测试类型
     * @param dbService 数据库服务
     * @param cacheService 缓存服务
     */
    constructor(testType, dbService, cacheService) {
        this.testType = testType;
        this.dbService = dbService;
        this.cacheService = cacheService;
        this.cacheKeyPrefix = `test_engine:${this.testType}:`;
    }
    /**
     * 获取测试配置
     * @returns 测试配置
     */
    async getTestConfig() {
        // 尝试从缓存获取
        const cacheKey = `${this.cacheKeyPrefix}config`;
        const cachedConfig = await this.cacheService.get(cacheKey);
        if (cachedConfig) {
            return cachedConfig;
        }
        // 从数据库获取
        const config = await this.dbService.testTypes.findById(this.testType);
        if (!config) {
            throw new ModuleError(`Test type '${this.testType}' not found`, ERROR_CODES.TEST_NOT_FOUND, 404);
        }
        // 转换为TestConfig类型
        const testConfig = {
            id: config.id,
            name: config.name || '',
            description: config.description || '',
            category: config.category || '',
            configData: config.configData,
            isActive: config.isActive || false
        };
        // 存入缓存
        const cacheOptions = { ttl: 3600 }; // 缓存1小时
        await this.cacheService.set(cacheKey, testConfig, cacheOptions);
        return testConfig;
    }
    /**
     * 获取测试题目
     * @returns 测试题目数据
     */
    async getQuestions() {
        const config = await this.getTestConfig();
        // 解析配置数据
        const configData = typeof config.configData === 'string'
            ? JSON.parse(config.configData)
            : config.configData;
        return {
            testType: config.id,
            name: config.name,
            description: config.description,
            category: config.category,
            questionCount: configData.questionCount || 0,
            timeLimit: configData.timeLimit || 0,
            instructions: configData.instructions || "",
            questions: await this.generateQuestions(configData),
        };
    }
    /**
     * 处理测试提交
     * @param submission 测试提交数据
     * @param options 处理选项
     * @returns 测试结果
     */
    async processSubmission(submission, options = { validateAnswers: true, cacheResults: true }) {
        // 验证测试类型
        if (submission.testType !== this.testType) {
            throw new ModuleError(`Invalid test type: ${submission.testType}, expected: ${this.testType}`, ERROR_CODES.VALIDATION_ERROR, 400);
        }
        // 验证答案（如果启用验证）
        if (options.validateAnswers) {
            await this.validateAnswers(submission.answers);
        }
        // 计算结果
        const result = await this.calculateResult(submission);
        // 创建或更新测试会话
        const sessionId = await this.saveSession(submission, result);
        // 组装返回结果
        const testResult = {
            sessionId,
            testType: this.testType,
            scores: result.scores || {},
            interpretation: result.interpretation || "",
            recommendations: result.recommendations || [],
            completedAt: new Date().toISOString(),
        };
        // 缓存结果（如果启用）
        if (options.cacheResults) {
            const cacheKey = `${this.cacheKeyPrefix}result:${sessionId}`;
            const cacheOptions = { ttl: 86400 }; // 缓存24小时
            await this.cacheService.set(cacheKey, testResult, cacheOptions);
        }
        return testResult;
    }
    /**
     * 获取测试结果
     * @param sessionId 会话ID
     * @returns 测试结果
     */
    async getResult(sessionId) {
        // 尝试从缓存获取
        const cacheKey = `${this.cacheKeyPrefix}result:${sessionId}`;
        const cachedResult = await this.cacheService.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        // 从数据库获取
        const session = await this.dbService.testSessions.findById(sessionId);
        if (!session || session.testTypeId !== this.testType) {
            throw new ModuleError(`Test session '${sessionId}' not found or invalid type`, ERROR_CODES.TEST_NOT_FOUND, 404);
        }
        // 构建结果
        const resultData = typeof session.resultData === 'string'
            ? JSON.parse(session.resultData)
            : (session.resultData || {});
        // 处理日期格式
        let completedAt = new Date().toISOString();
        if (typeof session.createdAt === 'string') {
            completedAt = session.createdAt;
        }
        else if (session.createdAt && typeof session.createdAt === 'object') {
            try {
                completedAt = session.createdAt.toISOString();
            }
            catch (e) {
                completedAt = new Date().toISOString();
            }
        }
        const result = {
            sessionId: session.id,
            testType: session.testTypeId,
            scores: resultData.scores || {},
            interpretation: resultData.interpretation || "",
            recommendations: resultData.recommendations || [],
            completedAt: completedAt,
        };
        // 存入缓存
        const cacheOptions = { ttl: 86400 }; // 缓存24小时
        await this.cacheService.set(cacheKey, result, cacheOptions);
        return result;
    }
    /**
     * 创建或更新测试会话
     * @param submission 测试提交数据
     * @param result 计算结果
     * @returns 会话ID
     */
    async saveSession(submission, result) {
        // 创建测试会话数据
        return await this.dbService.testSessions.create({
            testTypeId: this.testType,
            answers: submission.answers,
            result: result,
            userAgent: submission.userInfo?.userAgent ?? "", // 使用空字符串代替null
            ipAddress: "", // 空字符串代替undefined
            sessionDuration: 0, // 可以在前端计算并提交
        });
    }
}
//# sourceMappingURL=BaseTestEngine.js.map