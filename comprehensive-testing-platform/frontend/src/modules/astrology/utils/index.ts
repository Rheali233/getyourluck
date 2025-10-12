/**
 * Astrology Module Utilities
 */

// 简单的类型保护函数
export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.length > 0;
}

// 安全的日期格式化 - 已删除未使用的函数

// 生成UUID（简化版）
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}