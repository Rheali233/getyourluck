/**
 * 用户反馈共享类型定义（英文 UI 文案，中文注释）
 */

// 反馈分类
export type FeedbackCategory =
  | "bug"
  | "incorrect_result"
  | "feature_request"
  | "other";

// 反馈请求载荷（前端提交 → 后端）
export interface FeedbackPayload {
  testType: string; // 模块类型（psychology/tarot/...）
  testId?: string; // 测试ID（可选）
  resultId?: string; // 结果ID（可选）
  sessionId?: string; // 会话ID（可选，统一store可提供）
  rating: number; // 满意度 1-5
  category: FeedbackCategory; // 分类
  message: string; // 描述（必填）
  email?: string; // 可选联系方式
  canContact: boolean; // 是否同意联系
  screenshotUrl?: string; // 可选截图 URL（如 R2 链接）
  images?: string[]; // 可选上传图片（R2 key 或 URL）
  client: {
    ua: string;
    platform: string;
    locale: string;
  };
  createdAt: string; // ISO 时间
}

// 反馈响应
export interface FeedbackCreateResponse {
  feedbackId: string;
}


