/**
 * 测试服务API
 * 遵循统一开发标准的API服务封装
 */

import { apiClient } from './apiClient'
import type { APIResponse, TestResult, TestSubmission } from '../../../shared/types/apiResponse'

export const testService = {
  /**
   * 获取测试类型列表
   */
  async getTestTypes(): Promise<APIResponse<any[]>> {
    return apiClient.get('/v1/tests')
  },

  /**
   * 获取特定测试的题目
   */
  async getTestQuestions(testType: string): Promise<APIResponse<any[]>> {
    return apiClient.get(`/v1/tests/${testType}/questions`)
  },

  /**
   * 提交测试答案
   * 对于需要 AI 分析的测试（如 MBTI、birth-chart），设置更长的超时时间
   */
  async submitTest(submission: TestSubmission): Promise<APIResponse<TestResult>> {
    // 需要 AI 分析的测试类型，设置 120 秒超时
    const aiTestTypes = ['mbti', 'phq9', 'eq', 'happiness', 'birth-chart', 'compatibility', 'fortune'];
    const timeout = aiTestTypes.includes(submission.testType) ? 120000 : 60000; // 120秒或60秒
    
    return apiClient.post(`/v1/tests/${submission.testType}/submit`, submission, { timeout })
  },

  /**
   * 获取测试结果
   * 修复: 需要提供 testType 参数
   */
  async getTestResult(testType: string, sessionId: string): Promise<APIResponse<TestResult>> {
    return apiClient.get(`/v1/tests/${testType}/results/${sessionId}`)
  },

  /**
   * 新增: 通过会话ID获取结果 (兼容性方法)
   */
  async getTestResultBySession(sessionId: string): Promise<APIResponse<TestResult>> {
    // 先通过会话ID获取基本信息，再调用具体的结果接口
    return apiClient.get(`/v1/tests/results/${sessionId}`)
  },

  /**
   * 提交反馈
   */
  async submitFeedback(
    sessionId: string,
    feedback: 'like' | 'dislike',
    comment?: string
  ): Promise<APIResponse<void>> {
    return apiClient.post('/feedback', {
      sessionId,
      feedback,
      comment,
    })
  },
}