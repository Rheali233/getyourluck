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

    // 兼容不同后端字段：type 或 contentType；字段命名采用多源回退
    const raw = Array.isArray(resp.data?.results) ? resp.data.results : [];
    let mapped: BlogArticleSummary[] = raw
      .filter((r: any) => (r.type || r.contentType) === 'blog')
      .map((r: any) => ({
        id: r.id || r.contentId || r.slug,
        slug: r.slug || r.contentId || r.id,
        title: r.title,
        excerpt: r.excerpt || r.description || '',
        coverImage: r.coverImage || r.cover_image,
        category: r.category,
        tags: r.tags || [],
        author: r.author,
        publishDate: r.publishDate,
        updatedAt: r.updatedAt,
        readTime: r.readTime,
        readCount: r.readCount,
      }));

    // Fallback：若统一搜索无结果，降级到文章列表做前端包含匹配（title/excerpt/category）
    if (mapped.length === 0) {
      try {
        const listResp = await blogService.getArticles(1, Math.max(30, limit));
        const list = (listResp.data || []) as BlogArticleSummary[];
        const kw = keyword.trim().toLowerCase();
        mapped = list.filter((a) => {
          const t = `${a.title || ''} ${a.excerpt || ''} ${a.category || ''}`.toLowerCase();
          return kw && t.includes(kw);
        });
      } catch {
        // noop: 返回空结果
      }
    }

    return { success: true, data: { results: mapped }, timestamp: new Date().toISOString() } as APIResponse<{ results: BlogArticleSummary[] }>;
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

  /**
   * 增加文章点赞数
   */
  async likeArticle(slug: string): Promise<APIResponse<void>> {
    return apiClient.post(`/api/blog/articles/${slug}/like`, {})
  },

  /**
   * 获取文章评论
   */
  async getComments(slug: string, page = 1, limit = 10): Promise<PaginatedResponse<BlogComment[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiClient.get(`/api/blog/articles/${slug}/comments?${params.toString()}`) as Promise<PaginatedResponse<BlogComment[]>>
  },

  /**
   * 添加文章评论
   */
  async addComment(slug: string, comment: BlogCommentRequest): Promise<APIResponse<BlogComment>> {
    return apiClient.post(`/api/blog/articles/${slug}/comments`, comment)
  },
}

// 评论相关类型定义
export interface BlogComment {
  id: string
  articleId: string
  content: string
  author: string
  email?: string
  createdAt: string
  updatedAt?: string
}

export interface BlogCommentRequest {
  content: string
  author: string
  email?: string
}