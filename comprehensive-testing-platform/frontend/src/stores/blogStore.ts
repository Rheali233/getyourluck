/**
 * 博客模块状态管理
 * 遵循统一开发标准的ModuleState接口
 */

import { create } from 'zustand'
import type { ModuleState, ModuleActions } from '../../../shared/types/moduleState'
import type { PaginatedResponse } from '../../../shared/types/apiResponse'
import { blogService, type BlogArticleDetail, type BlogArticleSummary } from '@/services/blogService'

interface BlogState extends ModuleState {
  articles: BlogArticleSummary[]
  currentArticle: BlogArticleDetail | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  categories: string[]
  selectedCategory: string | null
}

interface BlogActions extends ModuleActions {
  fetchArticles: (page?: number, category?: string) => Promise<void>
  fetchArticle: (idOrSlug: string) => Promise<void>
  setSelectedCategory: (category: string | null) => void
  incrementViewCount: (id: string) => Promise<void>
}

export const useBlogStore = create<BlogState & BlogActions>((set) => ({
  // 基础状态
  isLoading: false,
  error: null,
  data: null,
  lastUpdated: null,

  // 博客专用状态
  articles: [],
  currentArticle: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  categories: [],
  selectedCategory: null,

  // 基础操作
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  setData: (data: any) => set({ data, lastUpdated: new Date() }),

  // 博客专用操作
  fetchArticles: async (page = 1, category?: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await blogService.getArticles(page, 12, category)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch articles')
      }

      const paginatedResponse = response as PaginatedResponse<BlogArticleSummary[]>
      
      set({
        articles: paginatedResponse.data || [],
        pagination: paginatedResponse.pagination,
        isLoading: false,
        data: paginatedResponse.data || [],
        lastUpdated: new Date(),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch articles'
      set({
        isLoading: false,
        error: errorMessage,
      })
    }
  },

  fetchArticle: async (idOrSlug: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await blogService.getArticle(idOrSlug)
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Article not found')
      }

      set({
        currentArticle: response.data as BlogArticleDetail,
        isLoading: false,
        data: response.data,
        lastUpdated: new Date(),
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch article'
      set({
        isLoading: false,
        error: errorMessage,
      })
    }
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category })
  },

  incrementViewCount: async (id: string) => {
    try {
      await blogService.incrementViewCount(id)
    } catch {
      /* noop */
    }
  },

  reset: () => {
    set({
      isLoading: false,
      error: null,
      data: null,
      lastUpdated: null,
      articles: [],
      currentArticle: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      categories: [],
      selectedCategory: null,
    })
  },
}))