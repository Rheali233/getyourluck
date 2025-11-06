/**
 * Astrology Service
 * 星座模块API服务，复用统一API客户端
 */

import { apiClient } from '../../../services/apiClient';
// 临时类型定义，直到共享类型可用
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}
import type { 
  ZodiacSign, 
  FortuneReading, 
  CompatibilityAnalysis,
  BirthChart,
  BirthChartRequest
} from '../types';

export const astrologyService = {
  // 获取星座列表
  async getZodiacSigns(): Promise<APIResponse<ZodiacSign[]>> {
    return apiClient.get('/astrology/zodiac-signs');
  },

  // 获取运势
  async getFortune(sign: string, timeframe: string, date?: string): Promise<APIResponse<FortuneReading>> {
    const params = new URLSearchParams({
      timeframe,
      ...(date && { date })
    });
    return apiClient.get(`/astrology/fortune/${sign}?${params}`);
  },

  // 获取星座配对分析
  async getCompatibility(sign1: string, sign2: string, relationType: string): Promise<APIResponse<CompatibilityAnalysis>> {
    return apiClient.post('/astrology/compatibility', {
      sign1,
      sign2,
      relationType
    });
  },

  // 生成星盘分析（设置更长的超时时间，因为 AI 分析可能需要较长时间）
  async getBirthChart(birthData: BirthChartRequest): Promise<APIResponse<BirthChart>> {
    return apiClient.post('/astrology/birth-chart', birthData, { timeout: 120000 }); // 120秒超时
  },

  // 提交反馈
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike'): Promise<APIResponse<void>> {
    return apiClient.post('/astrology/feedback', {
      sessionId,
      feedback
    });
  },

  // ==================== AI分析服务 ====================

  // AI运势分析
  async analyzeFortuneAI(zodiacSign: string, timeframe: string, userContext?: any): Promise<APIResponse<FortuneReading>> {
    return apiClient.post('/v1/ai/astrology/fortune', {
      zodiacSign,
      timeframe,
      userContext
    });
  },

  // AI配对分析
  async analyzeCompatibilityAI(sign1: string, sign2: string, relationType: string, userContext?: any): Promise<APIResponse<CompatibilityAnalysis>> {
    return apiClient.post('/v1/ai/astrology/compatibility', {
      sign1,
      sign2,
      relationType,
      userContext
    });
  },

};