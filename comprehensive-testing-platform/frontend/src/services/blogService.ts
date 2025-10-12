/**
 * 博客服务API
 * 遵循统一开发标准的API服务封装
 */

import { apiClient } from './apiClient'
import type { APIResponse, PaginatedResponse } from '../../../shared/types/apiResponse'

// 博客文章类型定义（前端消费字段，英文内容）
export interface BlogArticleSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  category?: string
  tags?: string[]
  author?: string
  publishDate?: string
  updatedAt?: string
  readTime?: string
  readCount?: number
}

export interface BlogArticleDetail extends BlogArticleSummary {
  content?: string // 建议为Markdown或安全HTML
  contentHtml?: string // 后端直接返回的安全HTML
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  wordCount?: number
  relatedArticles?: Array<Pick<BlogArticleSummary, 'id' | 'slug' | 'title'>>
}

export const blogService = {
  /**
   * 获取博客文章列表（分页）
   */
  async getArticles(
    page = 1,
    limit = 10,
    category?: string | null
  ): Promise<PaginatedResponse<BlogArticleSummary[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (category) {
      params.append('category', category)
    }

    return apiClient.get(`/api/blog/articles?${params.toString()}`) as Promise<PaginatedResponse<BlogArticleSummary[]>>
  },

  /**
   * 搜索博客文章（使用通用搜索API）
   */
  async searchArticles(keyword: string, limit = 24): Promise<APIResponse<{ results: BlogArticleSummary[] }>> {
    const q = encodeURIComponent(keyword);
    const resp = await apiClient.get(`/api/search?q=${q}&lang=en-US&limit=${limit}`) as APIResponse<any>;
    // 兼容：筛选出博客类型结果并映射为 BlogArticleSummary（后端需提供相应字段）
    const mapped: BlogArticleSummary[] = (resp.data?.results || [])
      .filter((r: any) => r.type === 'blog')
      .map((r: any) => ({
        id: r.id,
        slug: r.slug || r.id,
        title: r.title,
        excerpt: r.excerpt || '',
        coverImage: r.coverImage,
        category: r.category,
        tags: r.tags || [],
        author: r.author,
        publishDate: r.publishDate,
        updatedAt: r.updatedAt,
        readTime: r.readTime,
        readCount: r.readCount,
      }));
    return { ...(resp as any), data: { results: mapped } } as APIResponse<{ results: BlogArticleSummary[] }>;
  },

  /**
   * 获取单篇博客文章
   */
  async getArticle(idOrSlug: string): Promise<APIResponse<BlogArticleDetail>> {
    return apiClient.get(`/api/blog/articles/${idOrSlug}`) as Promise<APIResponse<BlogArticleDetail>>
  },

  /**
   * 增加文章浏览量
   */
  async incrementViewCount(id: string): Promise<APIResponse<void>> {
    return apiClient.post(`/api/blog/articles/${id}/view`, {})
  },

  // 基于 slug 的浏览量统计（新）
  async incrementViewCountBySlug(slug: string): Promise<APIResponse<void>> {
    return apiClient.post(`/api/blog/articles/${slug}/view`, {})
  },
}