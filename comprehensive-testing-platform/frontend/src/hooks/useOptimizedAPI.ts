/**
 * API集成优化的Hook
 * 提供智能缓存、重试机制和性能监控
 */

import { useState, useCallback, useRef, useEffect } from 'react'
// 暂时禁用store导入，直到接口完善
// import { useUnifiedTestStore } from '../stores/unifiedTestStore'

// API请求配置接口
interface APIRequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  cacheTTL?: number
  retryCount?: number
  retryDelay?: number
  timeout?: number
}

// API响应接口
interface APIResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  timestamp: number
}

// API错误接口
interface APIError {
  message: string
  status?: number
  code?: string
  timestamp: number
}

// API状态接口
interface APIState<T = any> {
  data: T | null
  loading: boolean
  error: APIError | null
  lastUpdated: number | null
  cacheKey: string | null
}

// 缓存项接口
// 暂时禁用缓存接口，直到store接口完善
// interface CacheItem<T = any> {
//   data: T
//   timestamp: number
//   ttl: number
// }

/**
 * 优化的API Hook
 */
export const useOptimizedAPI = <T = any>() => {
  // 暂时禁用store，直到接口完善
  // const store = useUnifiedTestStore()
  const [state, setState] = useState<APIState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
    cacheKey: null
  })
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  // 生成缓存键
  const generateCacheKey = useCallback((config: APIRequestConfig): string => {
    const { url, method, body } = config
    const bodyHash = body ? JSON.stringify(body) : ''
    return `${method || 'GET'}:${url}:${bodyHash}`
  }, [])
  
  // 暂时禁用缓存功能，直到store接口完善
  // const checkCache = useCallback((cacheKey: string: number): T | null => {
  //   return null
  // }, [])
  
  // 暂时禁用缓存功能，直到store接口完善
  // const setCache = useCallback((cacheKey: string, data: T: number) => {
  //   // }, [])
  
  // 执行API请求
  const executeRequest = useCallback(async (
    config: APIRequestConfig,
    retryAttempt: number = 0
  ): Promise<APIResponse<T>> => {
    const { url, method = 'GET', headers = {}, body, timeout = 10000 } = config
    
    // 创建新的AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    
    try {
      const requestConfig: {
        method: string;
        headers: Record<string, string>;
        signal: AbortSignal;
        body?: string;
      } = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: abortControllerRef.current.signal,
        ...(body && { body: JSON.stringify(body) })
      }
      
      // 设置超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      })
      
      const fetchPromise = fetch(url, requestConfig)
      
      const response = await Promise.race([fetchPromise, timeoutPromise])
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: Date.now()
      }
    } catch (error) {
      // 处理重试逻辑
      const { retryCount = 3, retryDelay = 1000 } = config
      
      if (retryAttempt < retryCount && !(error instanceof Error && error.name === 'AbortError')) {
        // 延迟重试
        await new Promise(resolve => {
          retryTimeoutRef.current = setTimeout(resolve, retryDelay * Math.pow(2, retryAttempt))
        })
        
        return executeRequest(config, retryAttempt + 1)
      }
      
      throw error
    }
  }, [])
  
  // 主要的API请求方法
  const request = useCallback(async (config: APIRequestConfig): Promise<T> => {
    const cacheKey = generateCacheKey(config)
    
    // 开始请求
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      cacheKey
    }))
    
    try {
      const response = await executeRequest(config)
      
      setState(prev => ({
        ...prev,
        data: response.data,
        lastUpdated: response.timestamp,
        loading: false,
        error: null
      }))
      
      return response.data
    } catch (error) {
      const apiError: APIError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
      
      throw apiError
    }
  }, [generateCacheKey, executeRequest])
  
  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])
  
  // 手动清理缓存
  const clearCache = useCallback(() => {
    // 暂时禁用缓存功能
    // eslint-disable-next-line no-console
    }, [])
  
  // 刷新数据（忽略缓存）
  const refresh = useCallback(async (config: APIRequestConfig): Promise<T> => {
    // 直接重新请求，忽略缓存
    return request(config)
  }, [request])
  
  return {
    ...state,
    request,
    refresh,
    clearCache,
    // 便捷方法
    get: useCallback((url: string, config?: Partial<APIRequestConfig>) => 
      request({ ...config, url, method: 'GET' }), [request]),
    post: useCallback((url: string, body: any, config?: Partial<APIRequestConfig>) => 
      request({ ...config, url, method: 'POST', body }), [request]),
    put: useCallback((url: string, body: any, config?: Partial<APIRequestConfig>) => 
      request({ ...config, url, method: 'PUT', body }), [request]),
    delete: useCallback((url: string, config?: Partial<APIRequestConfig>) => 
      request({ ...config, url, method: 'DELETE' }), [request])
  }
}

/**
 * 专门用于测试数据的API Hook
 */
export const useTestAPI = () => {
  const api = useOptimizedAPI()
  
  // 获取测试问题
  const getTestQuestions = useCallback(async (testType: string) => {
    return api.get(`/api/v1/tests/${testType}/questions`, {
      cacheTTL: 10 * 60 * 1000, // 10分钟缓存
      retryCount: 2
    })
  }, [api])
  
  // 提交测试答案
  const submitTestAnswer = useCallback(async (testType: string, questionId: string, answer: any) => {
    return api.post(`/api/v1/tests/${testType}/submit`, {
      questionId,
      answer
    }, {
      cacheTTL: 0, // 不缓存答案
      retryCount: 1
    })
  }, [api])
  
  // 获取测试结果
  const getTestResult = useCallback(async (testType: string, sessionId: string) => {
    return api.get(`/api/v1/tests/${testType}/results/${sessionId}`, {
      cacheTTL: 30 * 60 * 1000, // 30分钟缓存
      retryCount: 2
    })
  }, [api])
  
  // 保存测试进度
  const saveTestProgress = useCallback(async (_testType: string, progress: any) => {
    return api.post(`/api/v1/sessions/progress`, progress, {
      cacheTTL: 0, // 不缓存进度
      retryCount: 1
    })
  }, [api])
  
  return {
    ...api,
    getTestQuestions,
    submitTestAnswer,
    getTestResult,
    saveTestProgress
  }
}

/**
 * 专门用于用户数据的API Hook
 */
export const useUserAPI = () => {
  const api = useOptimizedAPI()
  
  // 获取用户信息
  const getUserInfo = useCallback(async (userId: string) => {
    return api.get(`/api/users/${userId}`, {
      cacheTTL: 5 * 60 * 1000, // 5分钟缓存
      retryCount: 2
    })
  }, [api])
  
  // 更新用户偏好
  const updateUserPreferences = useCallback(async (userId: string, preferences: any) => {
    return api.put(`/api/users/${userId}/preferences`, preferences, {
      cacheTTL: 0, // 不缓存偏好
      retryCount: 1
    })
  }, [api])
  
  // 获取用户测试历史
  const getUserTestHistory = useCallback(async (userId: string) => {
    return api.get(`/api/users/${userId}/tests`, {
      cacheTTL: 15 * 60 * 1000, // 15分钟缓存
      retryCount: 2
    })
  }, [api])
  
  return {
    ...api,
    getUserInfo,
    updateUserPreferences,
    getUserTestHistory
  }
}
