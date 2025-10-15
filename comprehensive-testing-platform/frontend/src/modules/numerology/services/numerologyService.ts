/**
 * Numerology Service
 * 命理分析模块服务层
 */

import { apiClient } from '@/services/apiClient';
import type {
  NumerologyBasicInfo,
  // NumerologyAnalysis,
  NumerologyAnalysisRequest,
  NumerologyAnalysisResponse,
  NumerologySession
} from '../types';

class NumerologyService {
  private baseUrl = '/api/numerology';

  /**
   * 开始命理分析
   */
  async startAnalysis(request: NumerologyAnalysisRequest): Promise<NumerologyAnalysisResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/analyze`, request);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 提交命理数据
   */
  async submitData(data: NumerologyBasicInfo): Promise<NumerologyAnalysisResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/submit`, data);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取命理分析结果
   */
  async getAnalysis(sessionId: string): Promise<NumerologyAnalysisResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/analysis/${sessionId}`);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取命理会话历史
   */
  async getSessions(): Promise<NumerologySession[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sessions`);
      return response.data as NumerologySession[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除命理会话
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.baseUrl}/sessions/${sessionId}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取生肖运势
   */
  async getZodiacFortune(animal: string, period: 'year' | 'month' | 'week' = 'year'): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/zodiac/${animal}/fortune?period=${period}`);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取姓名分析
   */
  async analyzeName(name: string): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/name/analyze`, { name });
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取紫微斗数分析
   */
  async getZiWeiAnalysis(birthInfo: NumerologyBasicInfo): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/ziwei/analyze`, birthInfo);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取生辰八字分析
   */
  async getBaZiAnalysis(birthInfo: NumerologyBasicInfo): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/bazi/analyze`, birthInfo);
      return response.data as NumerologyAnalysisResponse;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 验证出生日期
   */
  validateBirthDate(date: string, type: 'solar' | 'lunar'): boolean {
    const dateObj = new Date(date);
    const now = new Date();
    
    // 基本验证
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    // 不能是未来日期
    if (dateObj > now) {
      return false;
    }
    
    // 不能太早（比如1900年之前）
    const minDate = new Date('1900-01-01');
    if (dateObj < minDate) {
      return false;
    }
    
    return true;
  }

  /**
   * 验证姓名
   */
  validateName(name: string): boolean {
    // 基本验证
    if (!name || name.trim().length === 0) {
      return false;
    }
    
    // 长度验证（1-10个字符）
    if (name.trim().length < 1 || name.trim().length > 10) {
      return false;
    }
    
    // 字符验证（只允许中文、英文字母和空格）
    const nameRegex = /^[\u4e00-\u9fa5a-zA-Z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return false;
    }
    
    return true;
  }

  /**
   * 格式化出生信息
   */
  formatBirthInfo(birthInfo: NumerologyBasicInfo): NumerologyBasicInfo {
    return {
      ...birthInfo,
      fullName: birthInfo.fullName.trim(),
      birthDate: birthInfo.birthDate,
      birthTime: birthInfo.birthTime || '',
      gender: birthInfo.gender,
      calendarType: birthInfo.calendarType
    };
  }

  /**
   * 计算年龄
   */
  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * 获取生肖动物
   */
  getZodiacAnimal(birthYear: number): string {
    const zodiacAnimals = [
      'monkey', 'rooster', 'dog', 'pig', 'rat', 'ox',
      'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat'
    ];
    
    return zodiacAnimals[birthYear % 12] || 'unknown';
  }

  /**
   * 获取五行属性
   */
  getElement(year: number): string {
    const elements = ['metal', 'water', 'wood', 'fire', 'earth'];
    return elements[year % 5] || 'unknown';
  }
}

export const numerologyService = new NumerologyService();
export default numerologyService;
