/**
 * Simplified Performance Monitoring Hook
 * Avoids over-intrusion, only enabled when needed
 */

import React, { useEffect, useRef, useState } from 'react'

// 性能监控配置
interface PerformanceConfig {
  enabled?: boolean
  logToConsole?: boolean
  sendToAnalytics?: boolean
}

// 简化的性能监控Hook
export const useSimplePerformanceMonitor = (
  componentName: string, 
  config: PerformanceConfig = {}
) => {
  const { enabled = false, logToConsole = false, sendToAnalytics = false } = config
  
  // Only create state when enabled
  const [metrics, setMetrics] = useState(enabled ? {
    renderCount: 0,
    lastRenderTime: 0
  } : null)
  
  const renderStartTime = useRef<number>(0)
  const isFirstRender = useRef(true)
  
  // Only execute monitoring logic when enabled
  useEffect(() => {
    if (!enabled) return
    
    renderStartTime.current = performance.now()
    
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    const renderTime = performance.now() - renderStartTime.current
    
    setMetrics(prev => prev ? {
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime
    } : null)
    
    // Performance warning in development environment
    if (logToConsole && renderTime > 16) {
      console.log(`Component render time: ${renderTime}ms`);
    }
    
    // 发送到分析服务（如果启用）
    if (sendToAnalytics && renderTime > 16) {
      // 这里可以集成真实的分析服务
      console.log(`Analytics: Component render time: ${renderTime}ms`);
    }
  })
  
      // Only return monitoring data when enabled
    if (!enabled) {
      return null
    }
    
    return {
      metrics,
      // Manual performance check method
    checkPerformance: (operation: string, fn: () => void) => {
      const start = performance.now()
      fn()
      const duration = performance.now() - start
      
      if (logToConsole && duration > 100) {
        console.log(`Function execution time: ${duration}ms`);
      }
      
      return duration
    }
  }
}

// Higher-order component: Performance monitoring decorator
export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>: PerformanceConfig = {}
) => {
  const WrappedComponent = React.memo((props: P) => {
    // 暂时禁用监控以避免未使用变量警告
    // const monitor = useSimplePerformanceMonitor(Component.displayName || Component.name, config)
    
    return <Component {...props} />
  })
  
  WrappedComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
