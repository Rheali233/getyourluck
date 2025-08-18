/**
 * 测试服务API
 * 遵循统一开发标准的API服务封装
 */

import { apiClient } from './apiClient'
import type { APIResponse, TestResult, TestSubmission } from '@/shared/types/apiResponse'

export const testService = {
  /**
   * 获取测试类型列表
   */
  async getTestTypes(): Promise<APIResponse<any[]>> {
    return apiClient.get('/tests')
  },

  /**
   * 获取特定测试的题目
   */
  async getTestQuestions(testType: string): Promise<APIResponse<any[]>> {
    return apiClient.get(`/tests/${testType}/questions`)
  },

  /**
   * 提交测试答案
   */
  async submitTest(submission: TestSubmission): Promise<APIResponse<TestResult>> {
    return apiClient.post('/tests/submit', submission)
  },

  /**
   * 获取测试结果
   */
  async getTestResult(sessionId: string): Promise<APIResponse<TestResult>> {
    return apiClient.get(`/tests/results/${sessionId}`)
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