/**
 * Tarot Service
 * 塔罗牌模块API服务，复用统一API客户端
 */

import { apiClient } from '../../../services/apiClient';
import type { APIResponse } from '../../../../../shared/types/apiResponse';
import type { 
  TarotCard, 
  QuestionCategory, 
  TarotSpread, 
  TarotRecommendation
} from '../types';

export const tarotService = {
  // 获取塔罗牌列表
  async getTarotCards(): Promise<APIResponse<TarotCard[]>> {
    return apiClient.get('/api/tarot/cards');
  },

  // 获取问题分类
  async getQuestionCategories(): Promise<APIResponse<QuestionCategory[]>> {
    return apiClient.get('/api/tarot/categories');
  },

  // 获取牌阵配置
  async getTarotSpreads(): Promise<APIResponse<TarotSpread[]>> {
    return apiClient.get('/api/tarot/spreads');
  },

  // 获取推荐
  async getRecommendation(request: {
    categoryId: string;
    questionText?: string;
    language?: string;
  }): Promise<APIResponse<TarotRecommendation>> {
    return apiClient.post('/api/tarot/recommendation', request);
  },

  // 提交反馈
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike'): Promise<APIResponse<void>> {
    return apiClient.post('/api/tarot/feedback', {
      sessionId,
      feedback
    });
  }
};
