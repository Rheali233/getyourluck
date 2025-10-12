/**
 * 统一API响应格式定义
 * 遵循统一开发标准中的APIResponse规范
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
  version?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TestResult {
  sessionId: string;
  testType: string;
  scores: Record<string, number>;
  interpretation: string;
  recommendations: string[];
  completedAt: string;
  // 新增字段
  status: 'completed' | 'failed';
  metadata?: Record<string, any>;
  aiAnalysis?: any;
  // 兼容性字段
  categories?: string[];
  dimensions?: Record<string, any>;
}

// 测试答案接口
export interface TestAnswer {
  questionId: string;
  value: string | number | boolean | string[];
  dimension?: string; // 用于DISC测试的维度字段
  category?: string;  // 用于Holland测试的类别字段
  timestamp?: string; // 答案时间戳
}

// 用户信息接口
export interface UserInfo {
  userAgent?: string;
  timestamp?: string;
}

// 测试提交接口
export interface TestSubmission {
  testType: string;
  answers: TestAnswer[];
  userInfo?: UserInfo;
}