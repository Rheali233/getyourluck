/**
 * 心理测试答题数据验证和格式化服务
 * 遵循统一开发标准的服务层规范
 */
import type { PsychologyAnswerData, CreatePsychologyAnswerData, AnswerValidationResult, AnswerFormatOptions, AnswerExportData } from "../types/psychology/AnswerData";
/**
 * 心理测试答题数据验证和格式化服务类
 */
export declare class PsychologyAnswerValidationService {
    /**
     * 验证答题数据
     */
    validateAnswerData(data: CreatePsychologyAnswerData): AnswerValidationResult;
    /**
     * 验证MBTI答题数据
     */
    private validateMbtiAnswer;
    /**
     * 验证PHQ-9答题数据
     */
    private validatePhq9Answer;
    /**
     * 验证情商答题数据
     */
    private validateEqAnswer;
    /**
     * 验证幸福指数答题数据
     */
    private validateHappinessAnswer;
    /**
     * 验证元数据
     */
    private validateMetadata;
    /**
     * 获取PHQ-9严重程度
     */
    private getPhq9Severity;
    /**
     * 格式化答题数据
     */
    formatAnswerData(data: PsychologyAnswerData, options: AnswerFormatOptions): Record<string, any>;
    /**
     * 格式化答题会话数据
     */
    formatAnswerSession(session: any, options: AnswerFormatOptions): Record<string, any>;
    /**
     * 计算平均答题时间
     */
    private calculateAverageResponseTime;
    /**
     * 计算完成率
     */
    private calculateCompletionRate;
    /**
     * 导出答题数据
     */
    exportAnswerData(sessionId: string, testType: string, answers: PsychologyAnswerData[], options: AnswerFormatOptions): AnswerExportData;
    /**
     * 根据测试类型获取总题目数
     */
    private getTotalQuestionsByType;
    /**
     * 清理答题数据
     */
    cleanAnswerData(data: PsychologyAnswerData): PsychologyAnswerData;
    /**
     * 批量清理答题数据
     */
    cleanAnswerDataBatch(data: PsychologyAnswerData[]): PsychologyAnswerData[];
}
//# sourceMappingURL=PsychologyAnswerValidationService.d.ts.map