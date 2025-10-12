/**
 * 测试结果处理器接口
 * 使用策略模式替代硬编码的switch语句
 */

import { ModuleError, ERROR_CODES } from '../../../../shared/types/errors'

export interface TestResultProcessor {
  /**
   * 处理测试结果
   * @param answers 答案数据
   * @returns 处理后的结果
   */
  process(answers: any[]): Promise<any>
  
  /**
   * 获取测试类型
   * @returns 测试类型标识
   */
  getTestType(): string
  
  /**
   * 验证答案数据
   * @param answers 答案数据
   * @returns 验证结果
   */
  validateAnswers(answers: any[]): boolean
}

/**
 * 测试结果处理器工厂
 * 负责注册和获取不同类型的处理器
 */
export class TestResultProcessorFactory {
  private processors: Map<string, TestResultProcessor> = new Map()
  
  /**
   * 注册测试结果处理器
   * @param testType 测试类型
   * @param processor 处理器实例
   */
  register(testType: string, processor: TestResultProcessor): void {
    this.processors.set(testType.toLowerCase(), processor)
  }
  
  /**
   * 获取测试结果处理器
   * @param testType 测试类型
   * @returns 处理器实例
   */
  getProcessor(testType: string): TestResultProcessor {
    const processor = this.processors.get(testType.toLowerCase())
    if (!processor) {
      throw new ModuleError(
        `Unsupported test type: ${testType}`,
        ERROR_CODES.TEST_NOT_FOUND,
        404
      )
    }
    return processor
  }
  
  /**
   * 检查是否支持指定的测试类型
   * @param testType 测试类型
   * @returns 是否支持
   */
  supports(testType: string): boolean {
    return this.processors.has(testType.toLowerCase())
  }
  
  /**
   * 获取所有支持的测试类型
   * @returns 测试类型列表
   */
  getSupportedTypes(): string[] {
    return Array.from(this.processors.keys())
  }
  
  /**
   * 移除测试结果处理器
   * @param testType 测试类型
   * @returns 是否成功移除
   */
  removeProcessor(testType: string): boolean {
    return this.processors.delete(testType.toLowerCase())
  }
}
