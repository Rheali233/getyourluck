/**
 * 统一错误处理类型定义
 * 遵循统一开发标准中的ModuleError规范
 */

export class ModuleError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any,
  ) {
    super(message);
    this.name = "ModuleError";
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TEST_NOT_FOUND: "TEST_NOT_FOUND",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  RATE_LIMITED: "RATE_LIMITED",
  NOT_FOUND: "NOT_FOUND",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];