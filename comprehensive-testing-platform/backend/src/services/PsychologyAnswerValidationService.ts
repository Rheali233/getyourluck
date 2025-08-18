/**
 * 心理测试答题数据验证和格式化服务
 * 遵循统一开发标准的服务层规范
 */

// import { ModuleError, ERROR_CODES } from "../../../shared/types/errors"; // 未使用，暂时注释
import type { 
  PsychologyAnswerData,
  CreatePsychologyAnswerData,
  // AnswerValidationRule, // 未使用，暂时注释
  AnswerValidationResult,
  AnswerFormatOptions,
  AnswerExportData,
  MbtiAnswerData,
  Phq9AnswerData,
  EqAnswerData,
  HappinessAnswerData
} from "../types/psychology/AnswerData";

/**
 * 心理测试答题数据验证和格式化服务类
 */
export class PsychologyAnswerValidationService {
  
  // ==================== 答题数据验证 ====================

  /**
   * 验证答题数据
   */
  validateAnswerData(data: CreatePsychologyAnswerData): AnswerValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // 基础字段验证
    if (!data.sessionId) {
      errors.push('会话ID不能为空');
    }

    if (!data.questionId) {
      errors.push('题目ID不能为空');
    }

    if (data.responseTime < 0) {
      errors.push('答题时间不能为负数');
    }

    if (data.responseTime > 300000) { // 5分钟
      warnings.push('答题时间过长，可能影响结果准确性');
    }

    // 根据测试类型进行特定验证
    switch (data.testType) {
      case 'mbti':
        this.validateMbtiAnswer(data as any, errors, warnings, suggestions);
        break;
      case 'phq9':
        this.validatePhq9Answer(data as any, errors, warnings, suggestions);
        break;
      case 'eq':
        this.validateEqAnswer(data as any, errors, warnings, suggestions);
        break;
      case 'happiness':
        this.validateHappinessAnswer(data as any, errors, warnings, suggestions);
        break;
      default:
        errors.push(`不支持的测试类型: ${(data as any).testType}`);
    }

    // 元数据验证
    if (data.metadata) {
      this.validateMetadata(data.metadata, errors, warnings);
    }

    const isValid = errors.length === 0;
    
    return {
      isValid,
      errors,
      warnings,
      suggestions: suggestions.length > 0 ? suggestions : []
    };
  }

  /**
   * 验证MBTI答题数据
   */
  private validateMbtiAnswer(
    data: any, 
    errors: string[], 
    warnings: string[], 
    _suggestions: string[]
  ): void {
    // 维度验证
    const validDimensions = ['E/I', 'S/N', 'T/F', 'J/P'];
    if (!validDimensions.includes(data.dimension)) {
      errors.push(`无效的MBTI维度: ${data.dimension}`);
    }

    // 偏好验证
    const validPreferences = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
    if (!validPreferences.includes(data.preference)) {
      errors.push(`无效的MBTI偏好: ${data.preference}`);
    }

    // 维度与偏好一致性验证
    if (data.dimension && data.preference) {
      const dimensionMap: Record<string, string[]> = {
        'E/I': ['E', 'I'],
        'S/N': ['S', 'N'],
        'T/F': ['T', 'F'],
        'J/P': ['J', 'P']
      };
      
      if (!dimensionMap[data.dimension]?.includes(data.preference)) {
        errors.push(`维度 ${data.dimension} 与偏好 ${data.preference} 不匹配`);
      }
    }

    // 信心度验证
    if (data.confidence < 1 || data.confidence > 5) {
      errors.push('信心度必须在1-5之间');
    }

    if (data.confidence < 3) {
      warnings.push('信心度较低，建议重新考虑答案');
    }
  }

  /**
   * 验证PHQ-9答题数据
   */
  private validatePhq9Answer(
    data: any, 
    errors: string[], 
    warnings: string[], 
    _suggestions: string[]
  ): void {
    // 维度验证
    const validDimensions = [
      'anhedonia', 'depressed_mood', 'sleep_problems', 'fatigue',
      'appetite_changes', 'poor_concentration', 'psychomotor_changes',
      'suicidal_thoughts', 'guilt_feelings'
    ];
    
    if (!validDimensions.includes(data.dimension)) {
      errors.push(`无效的PHQ-9维度: ${data.dimension}`);
    }

    // 分数验证
    if (data.score < 0 || data.score > 3) {
      errors.push('PHQ-9分数必须在0-3之间');
    }

    // 严重程度验证
    const validSeverities = ['none', 'mild', 'moderate', 'severe'];
    if (!validSeverities.includes(data.severity)) {
      errors.push(`无效的严重程度: ${data.severity}`);
    }

    // 分数与严重程度一致性验证
    if (data.score !== undefined && data.severity) {
      const expectedSeverity = this.getPhq9Severity(data.score);
      if (data.severity !== expectedSeverity) {
        warnings.push(`分数 ${data.score} 与严重程度 ${data.severity} 可能不匹配，建议检查`);
      }
    }

    // 自杀想法特殊处理
    if (data.dimension === 'suicidal_thoughts' && data.score > 0) {
      warnings.push('检测到自杀想法相关症状，建议寻求专业帮助');
      _suggestions.push('请考虑联系心理健康专业人士或拨打心理援助热线');
    }
  }

  /**
   * 验证情商答题数据
   */
  private validateEqAnswer(
    data: any, 
    errors: string[], 
    warnings: string[], 
    _suggestions: string[]
  ): void {
    // 维度验证
    const validDimensions = [
      'self_awareness', 'self_management', 'social_awareness', 'relationship_management'
    ];
    
    if (!validDimensions.includes(data.dimension)) {
      errors.push(`无效的情商维度: ${data.dimension}`);
    }

    // 分数验证
    if (data.score < 1 || data.score > 5) {
      errors.push('情商分数必须在1-5之间');
    }

    // 信心度验证
    if (data.confidence < 1 || data.confidence > 5) {
      errors.push('信心度必须在1-5之间');
    }

    // 反思内容验证
    if (data.reflection && data.reflection.length > 500) {
      warnings.push('反思内容过长，建议精简');
    }
  }

  /**
   * 验证幸福指数答题数据
   */
  private validateHappinessAnswer(
    data: any, 
    errors: string[], 
    warnings: string[], 
    _suggestions: string[]
  ): void {
    // 领域验证
    const validDomains = [
      'work', 'relationships', 'health', 'personal_growth', 'life_balance'
    ];
    
    if (!validDomains.includes(data.domain)) {
      errors.push(`无效的幸福指数领域: ${data.domain}`);
    }

    // 分数验证
    if (data.score < 1 || data.score > 7) {
      errors.push('幸福指数分数必须在1-7之间');
    }

    // 满意度验证
    if (data.satisfaction < 1 || data.satisfaction > 10) {
      errors.push('满意度必须在1-10之间');
    }

    // 重要性验证
    if (data.importance < 1 || data.importance > 10) {
      errors.push('重要性必须在1-10之间');
    }

    // 改善建议验证
    if (data.improvement && data.improvement.length > 300) {
      warnings.push('改善建议过长，建议精简');
    }
  }

  /**
   * 验证元数据
   */
  private validateMetadata(
    metadata: Record<string, any>, 
    _errors: string[], 
    warnings: string[]
  ): void {
    // 检查元数据大小
    const metadataSize = JSON.stringify(metadata).length;
    if (metadataSize > 10000) { // 10KB
      warnings.push('元数据过大，可能影响性能');
    }

    // 检查敏感信息
    const sensitiveKeys = ['password', 'token', 'key', 'secret'];
    for (const key of sensitiveKeys) {
      if (metadata[key]) {
        warnings.push(`元数据包含敏感信息: ${key}`);
      }
    }
  }

  /**
   * 获取PHQ-9严重程度
   */
  private getPhq9Severity(score: number): string {
    if (score === 0) return 'none';
    if (score === 1) return 'mild';
    if (score === 2) return 'moderate';
    return 'severe';
  }

  // ==================== 答题数据格式化 ====================

  /**
   * 格式化答题数据
   */
  formatAnswerData(
    data: PsychologyAnswerData, 
    options: AnswerFormatOptions
  ): Record<string, any> {
    const formatted: Record<string, any> = {
      id: data.id,
      sessionId: data.sessionId,
      questionId: data.questionId,
      testType: data.testType,
      answerValue: data.answerValue,
      responseTime: data.responseTime
    };

    // 根据选项添加字段
    if (options.includeTimestamps) {
      formatted["timestamp"] = (data as any)["timestamp"].toISOString();
    }

    if (options.includeMetadata && (data as any)["metadata"]) {
      formatted["metadata"] = (data as any)["metadata"];
    }

    // 根据测试类型添加特定字段
    switch (data.testType) {
      case 'mbti':
        formatted["dimension"] = (data as MbtiAnswerData)["dimension"];
        formatted["preference"] = (data as MbtiAnswerData)["preference"];
        formatted["confidence"] = (data as MbtiAnswerData)["confidence"];
        break;
      case 'phq9':
        formatted["dimension"] = (data as Phq9AnswerData)["dimension"];
        formatted["score"] = (data as Phq9AnswerData)["score"];
        formatted["severity"] = (data as Phq9AnswerData)["severity"];
        if ((data as Phq9AnswerData)["symptomDescription"]) {
          formatted["symptomDescription"] = (data as Phq9AnswerData)["symptomDescription"];
        }
        break;
      case 'eq':
        formatted["dimension"] = (data as EqAnswerData)["dimension"];
        formatted["score"] = (data as EqAnswerData)["score"];
        formatted["confidence"] = (data as EqAnswerData)["confidence"];
        if ((data as EqAnswerData)["reflection"]) {
          formatted["reflection"] = (data as EqAnswerData)["reflection"];
        }
        break;
      case 'happiness':
        formatted["domain"] = (data as HappinessAnswerData)["domain"];
        formatted["score"] = (data as HappinessAnswerData)["score"];
        formatted["satisfaction"] = (data as HappinessAnswerData)["satisfaction"];
        formatted["importance"] = (data as HappinessAnswerData)["importance"];
        if ((data as HappinessAnswerData)["improvement"]) {
          formatted["improvement"] = (data as HappinessAnswerData)["improvement"];
        }
        break;
    }

    return formatted;
  }

  /**
   * 格式化答题会话数据
   */
  formatAnswerSession(
    session: any, 
    options: AnswerFormatOptions
  ): Record<string, any> {
    const formatted: Record<string, any> = {
      id: session.id,
      testType: session.testType,
      sessionId: session.sessionId,
      status: session.status,
      progress: session.progress,
      totalTime: session.totalTime
    };

    if (options.includeTimestamps) {
      formatted["startTime"] = (session as any)["startTime"].toISOString();
      if ((session as any)["endTime"]) {
        formatted["endTime"] = (session as any)["endTime"].toISOString();
      }
    }

    if (options.includeCalculations) {
      formatted["averageResponseTime"] = this.calculateAverageResponseTime((session as any)["answers"]);
      formatted["completionRate"] = this.calculateCompletionRate((session as any)["answers"]);
    }

    if (options.includeMetadata && (session as any)["metadata"]) {
      formatted["metadata"] = (session as any)["metadata"];
    }

    return formatted;
  }

  /**
   * 计算平均答题时间
   */
  private calculateAverageResponseTime(answers: PsychologyAnswerData[]): number {
    if (answers.length === 0) return 0;
    const totalTime = answers.reduce((sum, answer) => sum + answer.responseTime, 0);
    return Math.round(totalTime / answers.length);
  }

  /**
   * 计算完成率
   */
  private calculateCompletionRate(answers: PsychologyAnswerData[]): number {
    if (answers.length === 0) return 0;
    const validAnswers = answers.filter(answer => 
      answer.answerValue !== null && answer.answerValue !== undefined
    );
    return Math.round((validAnswers.length / answers.length) * 100);
  }

  // ==================== 答题数据导出 ====================

  /**
   * 导出答题数据
   */
  exportAnswerData(
    sessionId: string,
    testType: string,
    answers: PsychologyAnswerData[],
    options: AnswerFormatOptions
  ): AnswerExportData {
    const exportTime = new Date();
    const totalQuestions = this.getTotalQuestionsByType(testType);
    const answeredQuestions = answers.length;
    const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);
    const totalTime = answers.reduce((sum, answer) => sum + answer.responseTime, 0);

    // 计算平均分数（如果适用）
    let averageScore: number | undefined;
    if (testType === 'phq9' || testType === 'eq' || testType === 'happiness') {
      const scores = answers.map(answer => {
        if ('score' in answer) return answer.score;
        return 0;
      }).filter(score => score > 0);
      
      if (scores.length > 0) {
        averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 100) / 100;
      }
    }

    return {
      sessionId,
      testType,
      exportTime,
      format: options.format,
      data: answers.map(answer => this.formatAnswerData(answer, options)) as any,
      summary: {
        totalQuestions,
        answeredQuestions,
        completionRate,
        averageScore: averageScore || 0,
        totalTime
      },
      metadata: options.includeMetadata ? { exportOptions: options } : {}
    };
  }

  /**
   * 根据测试类型获取总题目数
   */
  private getTotalQuestionsByType(testType: string): number {
    const questionCounts: Record<string, number> = {
      'mbti': 20,
      'phq9': 9,
      'eq': 40,
      'happiness': 30
    };
    return questionCounts[testType] || 0;
  }

  // ==================== 答题数据清理 ====================

  /**
   * 清理答题数据
   */
  cleanAnswerData(data: PsychologyAnswerData): PsychologyAnswerData {
    const cleaned = { ...data };

    // 清理元数据中的敏感信息
    if (cleaned.metadata) {
      const sensitiveKeys = ['password', 'token', 'key', 'secret', 'session'];
      for (const key of sensitiveKeys) {
        delete cleaned.metadata[key];
      }
    }

    // 标准化时间格式
    if (cleaned["timestamp"]) {
      cleaned["timestamp"] = new Date(cleaned["timestamp"]);
    }

    // 验证数值范围
    if (cleaned.responseTime < 0) {
      cleaned.responseTime = 0;
    }

    return cleaned;
  }

  /**
   * 批量清理答题数据
   */
  cleanAnswerDataBatch(data: PsychologyAnswerData[]): PsychologyAnswerData[] {
    return data.map(answer => this.cleanAnswerData(answer));
  }
} 