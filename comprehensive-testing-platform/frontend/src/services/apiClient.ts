/**
 * 统一API客户端
 * 遵循统一开发标准的API接口规范
 */

import type { APIResponse } from '../../../shared/types/apiResponse'
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors'
import { environmentConfig } from '../config/environment'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = environmentConfig.API_BASE_URL
  }

  async request<T>(
    endpoint: string,
    options: Record<string, any> = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const requestId = crypto.randomUUID()

    const config: {
      headers: Record<string, string>;
      method?: string;
      body?: string;
    } = {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(options['headers'] || {}),
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        // 尝试解析错误响应
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // 如果无法解析JSON，使用默认错误消息
        }
        
        throw new ModuleError(
          errorMessage,
          this.getErrorCodeFromStatus(response.status),
          response.status
        )
      }

      const result = await response.json()
      
      // 验证响应格式
      if (typeof result !== 'object' || result === null) {
        throw new ModuleError(
          'Invalid response format',
          ERROR_CODES.NETWORK_ERROR,
          500
        )
      }

      return result as APIResponse<T>
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error
      }

      // 处理网络错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ModuleError(
          'Network connection failed',
          ERROR_CODES.NETWORK_ERROR,
          0
        )
      }

      // 处理其他错误
      throw new ModuleError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        ERROR_CODES.NETWORK_ERROR,
        500
      )
    }
  }

  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return ERROR_CODES.VALIDATION_ERROR
      case 401:
        return ERROR_CODES.UNAUTHORIZED
      case 404:
        return ERROR_CODES.TEST_NOT_FOUND
      case 429:
        return ERROR_CODES.RATE_LIMITED
      case 500:
        return ERROR_CODES.DATABASE_ERROR
      default:
        return ERROR_CODES.NETWORK_ERROR
    }
  }
}

export const apiClient = new ApiClient()