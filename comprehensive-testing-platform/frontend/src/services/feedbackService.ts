/**
 * 反馈服务封装（前端）
 */
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../../../shared/constants';
import type { APIResponse } from '../../../shared/types/apiResponse';
import type { FeedbackPayload, FeedbackCreateResponse } from '../../../shared/types/feedback';

export const feedbackService = {
  async submit(payload: FeedbackPayload): Promise<APIResponse<FeedbackCreateResponse>> {
    return apiClient.post(`${API_ENDPOINTS.FEEDBACK}/collect`, payload);
  },
  async upload(files: File[]): Promise<{ keys: string[] }> {
    const form = new FormData();
    files.slice(0, 5).forEach((f) => form.append('files', f));
    const res = await fetch(`${API_ENDPOINTS.FEEDBACK}/upload`, {
      method: 'POST',
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Upload failed');
    }
    return { keys: json.data.keys as string[] };
  },
};


