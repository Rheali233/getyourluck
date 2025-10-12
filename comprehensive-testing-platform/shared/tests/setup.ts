/**
 * 测试环境配置
 * 为共享模块的测试提供基础配置
 */

// 模拟浏览器环境
global.fetch = jest.fn();

// 模拟crypto API
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    subtle: {
      digest: jest.fn()
    }
  }
});

// 模拟console方法
(global as any).console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
};

// 测试工具函数
export const createMockError = (message: string, code: string = 'TEST_ERROR') => {
  const error = new Error(message);
  (error as any).code = code;
  (error as any).statusCode = 500;
  return error;
};

export const createMockContext = (overrides: any = {}) => ({
  userId: 'test-user-id',
  sessionId: 'test-session-id',
  testType: 'test-type',
  action: 'test-action',
  ...overrides
});

export const createMockRequest = (overrides: any = {}) => ({
  testType: 'test-type',
  answers: [{ questionId: '1', selectedOption: 'A', timestamp: Date.now() }],
  context: {},
  options: {},
  ...overrides
});

// 清理函数
export const cleanup = () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
};
