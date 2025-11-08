/**
 * 统一API客户端
 * 遵循统一开发标准的API接口规范
 */

import type { APIResponse } from '../../../shared/types/apiResponse'
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors'
import { getApiBaseUrl } from '../config/environment'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = getApiBaseUrl()
  }

  async request<T>(
    endpoint: string,
    options: Record<string, any> = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const requestId = crypto.randomUUID()

    // 设置超时时间（默认 60 秒，对于长时间运行的请求如 birth chart）
    const timeout = options.timeout || 60000

    const config: {
      headers: Record<string, string>;
      method?: string;
      body?: string;
      signal?: AbortSignal;
    } = {
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...(options['headers'] || {}),
      },
      ...options,
    }

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
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
      clearTimeout(timeoutId)
      
      if (error instanceof ModuleError) {
        throw error
      }

      // 处理超时错误
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ModuleError(
          'Request timeout - The server is taking too long to respond. Please try again.',
          ERROR_CODES.NETWORK_ERROR,
          0
        )
      }

      // 处理连接关闭错误（ERR_CONNECTION_CLOSED）
      if (error instanceof Error && (
        error.message.includes('ERR_CONNECTION_CLOSED') ||
        error.message.includes('connection closed') ||
        error.message.includes('Connection closed') ||
        error.message.includes('Failed to fetch') ||
        error.name === 'TypeError' && error.message.includes('fetch')
      )) {
        throw new ModuleError(
          'Network connection lost. The server may be processing your request. Please try again.',
          ERROR_CODES.NETWORK_ERROR,
          0
        )
      }

      // 处理网络错误（包括 ERR_NETWORK_CHANGED）
      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
        throw new ModuleError(
          'Network connection failed. Please check your internet connection and try again.',
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

  async post<T>(endpoint: string, data: any, options: Record<string, any> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
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