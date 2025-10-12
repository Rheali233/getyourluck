/**
 * 测试环境设置文件
 * 配置测试环境和全局设置
 */

import '@testing-library/jest-dom'
import { vi, beforeAll, afterAll, afterEach } from 'vitest'

// 模拟浏览器环境
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// 模拟sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

// 模拟fetch
global.fetch = vi.fn()

// 模拟IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByType: vi.fn(() => []),
    getEntriesByName: vi.fn(() => []),
  }
})

// 模拟console方法（在测试中静默）
const originalConsole = { ...console }
beforeAll(() => {
  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()
})

afterAll(() => {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
})

// 清理函数
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// 全局测试工具函数
global.testUtils = {
  // 等待异步操作完成
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // 模拟用户事件
  userEvent: {
    click: vi.fn(),
    type: vi.fn(),
    select: vi.fn(),
    hover: vi.fn(),
    focus: vi.fn(),
    blur: vi.fn(),
  },
  
  // 模拟API响应
  mockAPIResponse: (data: any, status = 200) => {
    return Promise.resolve({
      ok: status < 400,
      status,
      json: () => Promise.resolve(data),
      headers: new Map(),
    })
  },
  
  // 模拟API错误
  mockAPIError: (message: string, status = 500) => {
    return Promise.reject(new Error(message))
  }
}

// 类型声明
declare global {
  interface Window {
    testUtils: any
  }
  
  var testUtils: any
}
