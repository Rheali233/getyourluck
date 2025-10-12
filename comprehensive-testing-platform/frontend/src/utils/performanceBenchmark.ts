/**
 * 真实的性能基准测试工具
 * 用于验证优化效果，避免虚假声明
 */

// 性能基准配置
interface BenchmarkConfig {
  iterations: number
  warmupRuns: number
  timeout: number
}

// 性能测试结果
interface BenchmarkResult {
  operation: string
  averageTime: number
  minTime: number
  maxTime: number
  totalTime: number
  iterations: number
  success: boolean
  error?: string
}

// 性能基准测试类
export class PerformanceBenchmark {
  private config: BenchmarkConfig
  
  constructor(config: Partial<BenchmarkConfig> = {}) {
    this.config = {
      iterations: 1000,
      warmupRuns: 10,
      timeout: 5000,
      ...config
    }
  }
  
  // 运行性能测试
  async runBenchmark(
    operation: string,
    testFunction: () => any,
    config?: Partial<BenchmarkConfig>
  ): Promise<BenchmarkResult> {
    const testConfig = { ...this.config, ...config }
    const { iterations, warmupRuns, timeout } = testConfig
    
    const startTime = performance.now()
    const times: number[] = []
    let error: string | undefined
    
    try {
      // 预热运行
      for (let i = 0; i < warmupRuns; i++) {
        testFunction()
      }
      
      // 实际测试
      for (let i = 0; i < iterations; i++) {
        const runStart = performance.now()
        testFunction()
        const runTime = performance.now() - runStart
        
        times.push(runTime)
        
        // 检查超时
        if (performance.now() - startTime > timeout) {
          throw new Error('Benchmark timeout')
        }
      }
      
      // 计算统计结果
      const totalTime = times.reduce((sum, time) => sum + time, 0)
      const averageTime = totalTime / times.length
      const minTime = Math.min(...times)
      const maxTime = Math.max(...times)
      
      return {
        operation,
        averageTime,
        minTime,
        maxTime,
        totalTime,
        iterations,
        success: true
      }
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error'
      
      return {
        operation,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        totalTime: 0,
        iterations: times.length,
        success: false,
        error
      }
    }
  }
  
  // 比较两个操作的性能
  async compareBenchmarks(
    operation1: string,
    testFunction1: () => any,
    operation2: string,
    testFunction2: () => any,
    config?: Partial<BenchmarkConfig>
  ) {
    const [result1, result2] = await Promise.all([
      this.runBenchmark(operation1, testFunction1, config),
      this.runBenchmark(operation2, testFunction2, config)
    ])
    
    if (!result1.success || !result2.success) {
      return {
        success: false,
        error: `Benchmark failed: ${result1.error || result2.error}`
      }
    }
    
    const improvement = ((result1.averageTime - result2.averageTime) / result1.averageTime) * 100
    
    return {
      success: true,
      operation1: result1,
      operation2: result2,
      improvement: {
        percentage: improvement,
        absolute: result1.averageTime - result2.averageTime,
        isBetter: improvement > 0
      }
    }
  }
  
  // 生成性能报告
  generateReport(results: BenchmarkResult[]): string {
    const successfulResults = results.filter(r => r.success)
    
    if (successfulResults.length === 0) {
      return 'No successful benchmark results to report.'
    }
    
    let report = 'Performance Benchmark Report\n'
    report += '=============================\n\n'
    
    successfulResults.forEach(result => {
      report += `Operation: ${result.operation}\n`
      report += `  Average Time: ${result.averageTime.toFixed(3)}ms\n`
      report += `  Min Time: ${result.minTime.toFixed(3)}ms\n`
      report += `  Max Time: ${result.maxTime.toFixed(3)}ms\n`
      report += `  Total Time: ${result.totalTime.toFixed(3)}ms\n`
      report += `  Iterations: ${result.iterations}\n\n`
    })
    
    return report
  }
}

// 预定义的性能测试
export const commonBenchmarks = {
  // 测试状态更新性能
  async testStateUpdatePerformance(
    updateFunction: () => void,
    iterations: number = 1000
  ) {
    const benchmark = new PerformanceBenchmark({ iterations })
    
    return benchmark.runBenchmark(
      'State Update',
      updateFunction,
      { iterations }
    )
  },
  
  // 测试渲染性能
  async testRenderPerformance(
    renderFunction: () => void,
    iterations: number = 100
  ) {
    const benchmark = new PerformanceBenchmark({ iterations })
    
    return benchmark.runBenchmark(
      'Component Render',
      renderFunction,
      { iterations }
    )
  },
  
  // 测试缓存性能
  async testCachePerformance(
    cacheFunction: () => any,
    iterations: number = 1000
  ) {
    const benchmark = new PerformanceBenchmark({ iterations })
    
    return benchmark.runBenchmark(
      'Cache Operation',
      cacheFunction,
      { iterations }
    )
  }
}

// 使用示例
export const runPerformanceTests = async () => {
  console.log('Starting performance benchmarks...')
  
  const benchmark = new PerformanceBenchmark()
  
  // 测试基础操作性能
  const results = await Promise.all([
    benchmark.runBenchmark('Array Push', () => {
      const arr: number[] = []
      for (let i = 0; i < 1000; i++) {
        arr.push(i)
      }
    }),
    
    benchmark.runBenchmark('Object Property Access', () => {
      const obj: Record<string, number> = {}
      for (let i = 0; i < 1000; i++) {
        obj[`key${i}`] = i
      }
      for (let i = 0; i < 1000; i++) {
        // 模拟属性访问，实际值未使用
        obj[`key${i}`]
      }
    }),
    
    benchmark.runBenchmark('Function Call', () => {
      const testFn = (x: number) => x * 2
      for (let i = 0; i < 1000; i++) {
        testFn(i)
      }
    })
  ])
  
  const report = benchmark.generateReport(results)
  console.log(report)
  
  return results
}
