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

/* eslint-disable no-unused-vars */
interface BlogActions extends ModuleActions {
  fetchArticles(page?: number, category?: string, tag?: string): Promise<void>
  fetchArticle(slug: string): Promise<void>
  setSelectedCategory(category: string | null): void
}
/* eslint-enable no-unused-vars */

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
  fetchArticles: async (page = 1, category?: string, tag?: string) => {
    set({ isLoading: true, error: null })
    
    // 检查缓存
    const cacheKey = `blog_articles_${page}_${category || 'all'}_${tag || 'all'}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    
    // 如果缓存存在且未过期（30分钟内）
    if (cachedData && cacheTimestamp) {
      const now = Date.now();
      const cacheTime = parseInt(cacheTimestamp);
      const isExpired = (now - cacheTime) > 1800000; // 30分钟
      
      if (!isExpired) {
        const cached = JSON.parse(cachedData);
        set({
          articles: cached.articles || [],
          pagination: cached.pagination,
          isLoading: false,
          data: cached.articles || [],
          lastUpdated: new Date(),
        });
        return;
      }
    }
    
    try {
      const response = await blogService.getArticles(page, 12, category, tag)
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch articles')
      }

      const paginatedResponse = response as PaginatedResponse<BlogArticleSummary[]>
      
      // 缓存数据
      const cacheData = {
        articles: paginatedResponse.data || [],
        pagination: paginatedResponse.pagination
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      
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

  fetchArticle: async (slug: string) => {
    set({ isLoading: true, error: null })
    
    // 检查缓存
    const cacheKey = `blog_article_${slug}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    let shouldUseCached = false;

    if (cachedData && cacheTimestamp) {
      const now = Date.now();
      const cacheTime = parseInt(cacheTimestamp, 10);
      const isExpired = (now - cacheTime) > 3600000; // 1小时

      if (!isExpired) {
        try {
          const cached = JSON.parse(cachedData) as BlogArticleDetail;
          shouldUseCached = true;
          set({
            currentArticle: cached,
            isLoading: false,
            data: cached,
            lastUpdated: new Date(),
          });
        } catch (error) {
          console.warn('Failed to parse cached article, ignore cache', error);
        }
      }
    }

    try {
      const response = await blogService.getArticle(slug)
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Article not found')
      }

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

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
        error: shouldUseCached ? null : errorMessage,
      })
    }
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category })
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