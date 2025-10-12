/**
 * usePerformanceMonitor Hook 单元测试
 */

import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePerformanceMonitor } from '../../../src/hooks/usePerformanceMonitor'

// 模拟performance API
const mockPerformance = {
  now: vi.fn(() => 1000)
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
})

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPerformance.now.mockReturnValue(1000)
  })

  it('should initialize with default metrics', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    expect(result.current.metrics).toEqual({
      renderCount: 0,
      renderTime: 0,
      stateUpdateCount: 0,
      cacheHitRate: 0,
      averageResponseTime: 0
    })
  })

  it('should increment render count on each render', () => {
    const { result, rerender } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    expect(result.current.metrics.renderCount).toBe(0)
    
    rerender()
    expect(result.current.metrics.renderCount).toBe(1)
    
    rerender()
    expect(result.current.metrics.renderCount).toBe(2)
  })

  it('should record state update times correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    act(() => {
      result.current.recordStateUpdate(50)
    })
    
    expect(result.current.metrics.stateUpdateCount).toBe(1)
    expect(result.current.metrics.averageResponseTime).toBe(50)
    
    act(() => {
      result.current.recordStateUpdate(100)
    })
    
    expect(result.current.metrics.stateUpdateCount).toBe(2)
    expect(result.current.metrics.averageResponseTime).toBe(75) // (50 + 100) / 2
  })

  it('should calculate cache hit rate correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 初始状态
    expect(result.current.metrics.cacheHitRate).toBe(0)
    
    // 记录缓存命中
    act(() => {
      result.current.recordCacheHit()
    })
    
    expect(result.current.metrics.cacheHitRate).toBe(100) // 1/1 = 100%
    
    // 记录缓存未命中
    act(() => {
      result.current.recordCacheMiss()
    })
    
    expect(result.current.metrics.cacheHitRate).toBe(50) // 1/2 = 50%
    
    // 再次命中
    act(() => {
      result.current.recordCacheHit()
    })
    
    expect(result.current.metrics.cacheHitRate).toBe(66.7) // 2/3 ≈ 66.7%
  })

  it('should calculate performance score correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 初始分数应该是100
    const initialScore = result.current.getPerformanceReport().performanceScore
    expect(initialScore).toBe(100)
    
    // 模拟性能问题
    act(() => {
      result.current.recordStateUpdate(200) // 超过100ms阈值
    })
    
    const scoreAfterSlowUpdate = result.current.getPerformanceReport().performanceScore
    expect(scoreAfterSlowUpdate).toBeLessThan(100)
    
    // 模拟缓存命中率低
    act(() => {
      result.current.recordCacheMiss()
      result.current.recordCacheMiss()
      result.current.recordCacheMiss()
      result.current.recordCacheHit()
    })
    
    const scoreAfterLowCacheHit = result.current.getPerformanceReport().performanceScore
    expect(scoreAfterLowCacheHit).toBeLessThan(scoreAfterSlowUpdate)
  })

  it('should provide comprehensive performance report', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 记录一些性能数据
    act(() => {
      result.current.recordStateUpdate(50)
      result.current.recordCacheHit()
      result.current.recordCacheMiss()
    })
    
    const report = result.current.getPerformanceReport()
    
    expect(report).toHaveProperty('componentName', 'TestComponent')
    expect(report).toHaveProperty('renderCount')
    expect(report).toHaveProperty('renderTime')
    expect(report).toHaveProperty('stateUpdateCount')
    expect(report).toHaveProperty('cacheHitRate')
    expect(report).toHaveProperty('averageResponseTime')
    expect(report).toHaveProperty('totalCacheRequests')
    expect(report).toHaveProperty('cacheHits')
    expect(report).toHaveProperty('cacheMisses')
    expect(report).toHaveProperty('performanceScore')
  })

  it('should reset metrics correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 记录一些数据
    act(() => {
      result.current.recordStateUpdate(50)
      result.current.recordCacheHit()
    })
    
    expect(result.current.metrics.stateUpdateCount).toBe(1)
    expect(result.current.metrics.cacheHitRate).toBe(100)
    
    // 重置
    act(() => {
      result.current.resetMetrics()
    })
    
    expect(result.current.metrics).toEqual({
      renderCount: 0,
      renderTime: 0,
      stateUpdateCount: 0,
      cacheHitRate: 0,
      averageResponseTime: 0
    })
  })

  it('should maintain performance history correctly', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 记录多次状态更新
    for (let i = 0; i < 150; i++) {
      act(() => {
        result.current.recordStateUpdate(50 + i)
      })
    }
    
    // 应该只保留最近100次
    expect(result.current.metrics.stateUpdateCount).toBe(150)
    
    const report = result.current.getPerformanceReport()
    expect(report.performanceScore).toBeGreaterThan(0)
  })

  it('should handle edge cases gracefully', () => {
    const { result } = renderHook(() => usePerformanceMonitor('TestComponent'))
    
    // 测试极端值
    act(() => {
      result.current.recordStateUpdate(0)
      result.current.recordStateUpdate(10000) // 非常慢的更新
    })
    
    const report = result.current.getPerformanceReport()
    expect(report.performanceScore).toBeGreaterThanOrEqual(0)
    expect(report.performanceScore).toBeLessThanOrEqual(100)
  })
})
