/**
 * 博客服务API
 * 遵循统一开发标准的API服务封装
 */

import { apiClient } from './apiClient'
import type { APIResponse, PaginatedResponse } from '@/shared/types/apiResponse'

export const blogService = {
  /**
   * 获取博客文章列表（分页）
   */
  async getArticles(
    page = 1,
    limit = 10,
    category?: string | null
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (category) {
      params.append('category', category)
    }

    return apiClient.get(`/blog/articles?${params.toString()}`) as Promise<PaginatedResponse<any>>
  },

  /**
   * 获取单篇博客文章
   */
  async getArticle(id: string): Promise<APIResponse<any>> {
    return apiClient.get(`/blog/articles/${id}`)
  },

  /**
   * 增加文章浏览量
   */
  async incrementViewCount(id: string): Promise<APIResponse<void>> {
    return apiClient.post(`/blog/articles/${id}/view`, {})
  },
}