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
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
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
}

export interface TestSubmission {
  testType: string;
  answers: any[];
  userInfo?: {
    userAgent?: string;
    timestamp?: string;
  };
}