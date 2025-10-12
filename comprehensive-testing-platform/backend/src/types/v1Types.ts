/**
 * v1 API 类型定义
 * 仅包含v1路由特有的类型，避免与shared/types重复
 */

// 重新导出shared类型，保持向后兼容
export type { APIResponse, TestSubmission, TestResult } from "../../../shared/types/apiResponse";
export { ModuleError, ERROR_CODES } from "../../../shared/types/errors";

// v1特有的类型定义（如果有的话）
export interface V1TestStats {
  totalSessions: number;
  averageScore: number;
  completionRate: number;
}
