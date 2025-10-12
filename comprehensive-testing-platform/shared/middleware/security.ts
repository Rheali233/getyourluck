/**
 * 安全中间件
 * 提供输入验证、输出清理、CORS等安全功能
 */

import { config, isProduction } from '../config/environment';
import { sanitizeString, isValidUUID } from '../utils';

// 输入验证规则
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'uuid';
  minLength?: number | undefined;
  maxLength?: number | undefined;
  pattern?: RegExp;
  min?: number | undefined;
  max?: number | undefined;
  enum?: any[];
  custom?: (value: any) => boolean;
  message?: string;
}

// 验证结果
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// 输入验证器
export class InputValidator {
  private rules: ValidationRule[];

  constructor(rules: ValidationRule[] = []) {
    this.rules = rules;
  }

  /**
   * 验证输入数据
   */
  validate(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    for (const rule of this.rules) {
      const value = this.getNestedValue(data, rule.field);
      const error = this.validateField(value, rule);
      
      if (error) {
        errors.push(error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 验证单个字段
   */
  private validateField(value: any, rule: ValidationRule): ValidationError | null {
    // 必填字段检查
    if (rule.required && (value === undefined || value === null || value === '')) {
      return {
        field: rule.field,
        message: rule.message || `${rule.field} is required`,
        value
      };
    }

    // 如果字段不是必填且为空，跳过其他验证
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // 类型检查
    if (rule.type && !this.checkType(value, rule.type)) {
      return {
        field: rule.field,
        message: rule.message || `${rule.field} must be of type ${rule.type}`,
        value
      };
    }

    // 字符串长度检查
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        return {
          field: rule.field,
          message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`,
          value
        };
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return {
          field: rule.field,
          message: rule.message || `${rule.field} must be no more than ${rule.maxLength} characters`,
          value
        };
      }

      // 模式匹配检查
      if (rule.pattern && !rule.pattern.test(value)) {
        return {
          field: rule.field,
          message: rule.message || `${rule.field} format is invalid`,
          value
        };
      }
    }

    // 数字范围检查
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return {
          field: rule.field,
          message: rule.message || `${rule.field} must be at least ${rule.min}`,
          value
        };
      }

      if (rule.max !== undefined && value > rule.max) {
        return {
          field: rule.field,
          message: rule.message || `${rule.field} must be no more than ${rule.max}`,
          value
        };
      }
    }

    // 枚举值检查
    if (rule.enum && !rule.enum.includes(value)) {
      return {
        field: rule.field,
        message: rule.message || `${rule.field} must be one of: ${rule.enum.join(', ')}`,
        value
      };
    }

    // 自定义验证
    if (rule.custom && !rule.custom(value)) {
      return {
        field: rule.field,
        message: rule.message || `${rule.field} validation failed`,
        value
      };
    }

    return null;
  }

  /**
   * 检查值类型
   */
  private checkType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'uuid':
        return typeof value === 'string' && isValidUUID(value);
      default:
        return true;
    }
  }

  /**
   * 获取嵌套对象的值
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * 添加验证规则
   */
  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  /**
   * 清除所有规则
   */
  clearRules(): void {
    this.rules = [];
  }
}

// 输出清理器
export class OutputSanitizer {
  /**
   * 清理字符串输出
   */
  static sanitizeString(value: string, maxLength: number = 1000): string {
    if (!config.security.enableOutputSanitization) {
      return value;
    }

    return sanitizeString(value, maxLength);
  }

  /**
   * 清理对象输出
   */
  static sanitizeObject(obj: any, maxDepth: number = 5): any {
    if (!config.security.enableOutputSanitization) {
      return obj;
    }

    return this.sanitizeValue(obj, maxDepth, 0);
  }

  /**
   * 递归清理值
   */
  private static sanitizeValue(value: any, maxDepth: number, currentDepth: number): any {
    if (currentDepth >= maxDepth) {
      return '[Max Depth Reached]';
    }

    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeValue(item, maxDepth, currentDepth + 1));
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitizeValue(val, maxDepth, currentDepth + 1);
      }
      return sanitized;
    }

    return value;
  }

  /**
   * 清理错误信息
   */
  static sanitizeError(error: any): any {
    if (!config.security.enableOutputSanitization) {
      return error;
    }

    if (isProduction()) {
      // 生产环境隐藏敏感信息
      return {
        message: 'An error occurred',
        code: error.code || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        requestId: error.requestId
      };
    }

    return error;
  }
}

// CORS配置
export interface CORSConfig {
  origin: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
  security: {
    enableCORS: boolean;
    allowedOrigins: string[];
  };
}

// CORS中间件
export function createCORSMiddleware(config: CORSConfig) {
  return function corsMiddleware(req: any, res: any, next: any) {
    if (!config.security.enableCORS) {
      return next();
    }

    const origin = req.headers.origin;
    const allowedOrigins = config.security.allowedOrigins;

    // 检查来源
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // 设置CORS头
    res.setHeader('Access-Control-Allow-Methods', config.methods?.join(',') || 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders?.join(',') || 'Content-Type, Authorization');
    
    if (config.exposedHeaders) {
      res.setHeader('Access-Control-Expose-Headers', config.exposedHeaders.join(','));
    }

    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (config.maxAge) {
      res.setHeader('Access-Control-Max-Age', config.maxAge.toString());
    }

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  };
}

// 请求大小限制中间件
export function createRequestSizeLimitMiddleware() {
  return function requestSizeLimitMiddleware(_req: any, res: any, next: any) {
    const maxSize = config.security.maxRequestSize;
    
    if (_req.headers['content-length']) {
      const contentLength = parseInt(_req.headers['content-length'], 10);
      
      if (contentLength > maxSize) {
        return res.status(413).json({
          success: false,
          error: {
            code: 'REQUEST_TOO_LARGE',
            message: `Request size exceeds limit of ${maxSize} bytes`,
            timestamp: new Date().toISOString()
          }
        });
      }
    }

    next();
  };
}

// 安全头中间件
export function createSecurityHeadersMiddleware() {
  return function securityHeadersMiddleware(_req: any, res: any, next: any) {
    // 防止点击劫持
    res.setHeader('X-Frame-Options', 'DENY');
    
    // 防止MIME类型嗅探
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // XSS保护
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // 引用策略
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // 内容安全策略
    if (isProduction()) {
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    }

    next();
  };
}

// 导出常用验证规则
export const commonValidationRules = {
  required: (field: string): ValidationRule => ({
    field,
    required: true,
    message: `${field} is required`
  }),

  string: (field: string, minLength?: number, maxLength?: number): ValidationRule => ({
    field,
    type: 'string',
    minLength: minLength || undefined,
    maxLength: maxLength || undefined,
    message: `${field} must be a string${minLength ? ` with minimum length ${minLength}` : ''}${maxLength ? ` and maximum length ${maxLength}` : ''}`
  }),

  number: (field: string, min?: number, max?: number): ValidationRule => ({
    field,
    type: 'number',
    min: min || undefined,
    max: max || undefined,
    message: `${field} must be a number${min !== undefined ? ` greater than or equal to ${min}` : ''}${max !== undefined ? ` and less than or equal to ${max}` : ''}`
  }),

  uuid: (field: string): ValidationRule => ({
    field,
    type: 'uuid',
    message: `${field} must be a valid UUID`
  }),

  enum: (field: string, values: any[]): ValidationRule => ({
    field,
    enum: values,
    message: `${field} must be one of: ${values.join(', ')}`
  })
};
