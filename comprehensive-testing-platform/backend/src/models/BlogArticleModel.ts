/**
 * 博客文章数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../types/env'
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants'

export interface BlogArticle {
  id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  tagsData: string // JSON
  viewCount: number
  likeCount: number
  isPublished: boolean
  isFeatured: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBlogArticleData {
  title: string
  content: string
  excerpt?: string
  category?: string
  tags?: string[]
  isPublished?: boolean
  isFeatured?: boolean
  publishedAt?: string
}

export interface BlogArticleListItem {
  id: string
  title: string
  excerpt?: string
  category?: string
  tags: string[]
  viewCount: number
  likeCount: number
  publishedAt?: string
  createdAt: string
  // 可选扩展字段（前端卡片展示）
  slug?: string
  coverImage?: string | null
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class BlogArticleModel extends BaseModel {
  constructor(env: Env) {
    super(env, DB_TABLES.BLOG_ARTICLES)
  }

  /**
   * 创建博客文章
   */
  async create(articleData: CreateBlogArticleData): Promise<string> {
    this.validateRequired(articleData, ['title', 'content'])

    const id = this.generateId()
    const now = this.formatTimestamp()

    const query = `
      INSERT INTO ${this.tableName} (
        id, title, content, excerpt, category, tags_data,
        view_count, like_count, is_published, is_featured,
        published_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      id,
      articleData.title,
      articleData.content,
      articleData.excerpt || null,
      articleData.category || null,
      JSON.stringify(articleData.tags || []),
      0, // view_count
      0, // like_count
      articleData.isPublished !== false ? 1 : 0,
      articleData.isFeatured === true ? 1 : 0,
      articleData.publishedAt || (articleData.isPublished !== false ? now : null),
      now,
      now,
    ]

    await this.executeRun(query, params)

    // 清除列表缓存
    await this.deleteCache('blog_articles_list')
    await this.deleteCache('featured_articles')

    return id
  }

  /**
   * 获取文章列表（分页）
   */
  async getList(
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<PaginationResult<BlogArticleListItem>> {
    const offset = (page - 1) * limit
    const cacheKey = `blog_list:${page}:${limit}:${category || 'all'}`
    const cached = await this.getCache<PaginationResult<BlogArticleListItem>>(cacheKey)
    
    if (cached) {
      return cached
    }

    // 构建查询条件
    let whereClause = 'WHERE is_published = 1'
    const params: any[] = []

    if (category) {
      whereClause += ' AND category = ?'
      params.push(category)
    }

    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`
    const countResult = await this.executeQueryFirst<{ total: number }>(countQuery, params)
    const total = countResult?.total || 0

    // 获取文章列表
    const listQuery = `
      SELECT 
        id, title, excerpt, category, tags_data,
        slug,              -- ensure slug is available
        cover_image,       -- optional cover image column
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      ${whereClause}
      ORDER BY published_at DESC, created_at DESC
      LIMIT ? OFFSET ?
    `

    const articles = await this.executeQuery<any>(listQuery, [...params, limit, offset])

    // 转换数据格式
    const data: BlogArticleListItem[] = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || '[]'),
      slug: (article.slug as string) ?? undefined,
      coverImage: (article.cover_image as string | null) ?? null,
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at,
    }))

    const totalPages = Math.ceil(total / limit)
    const result: PaginationResult<BlogArticleListItem> = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    // 缓存结果
    await this.setCache(cacheKey, result, 900) // 15分钟缓存

    return result
  }

  /**
   * 根据ID获取文章详情
   */
  async findById(id: string): Promise<BlogArticle | null> {
    const cacheKey = `${CACHE_KEYS.BLOG_ARTICLE}${id}`
    const cached = await this.getCache<BlogArticle>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `SELECT * FROM ${this.tableName} WHERE id = ? AND is_published = 1`
    const result = await this.executeQueryFirst<BlogArticle>(query, [id])

    if (result) {
      // 缓存结果
      await this.setCache(cacheKey, result, 1800) // 30分钟缓存
    }

    return result
  }

  /**
   * 根据slug获取文章详情
   */
  async findBySlug(slug: string): Promise<BlogArticle | null> {
    const cacheKey = `${CACHE_KEYS.BLOG_ARTICLE}slug:${slug}`
    const cached = await this.getCache<BlogArticle>(cacheKey)
    if (cached) return cached

    const query = `SELECT * FROM ${this.tableName} WHERE slug = ? AND is_published = 1`
    const result = await this.executeQueryFirst<BlogArticle>(query, [slug])
    if (result) {
      await this.setCache(cacheKey, result, 1800)
    }
    return result
  }

  /**
   * 增加文章浏览量
   */
  async incrementViewCount(id: string): Promise<void> {
    const query = `
      UPDATE ${this.tableName} 
      SET view_count = view_count + 1 
      WHERE id = ?
    `

    await this.executeRun(query, [id])

    // 清除相关缓存
    await this.deleteCache(`${CACHE_KEYS.BLOG_ARTICLE}${id}`)
  }

  /**
   * 增加文章点赞数
   */
  async incrementLikeCount(id: string): Promise<void> {
    const query = `
      UPDATE ${this.tableName} 
      SET like_count = like_count + 1 
      WHERE id = ?
    `

    await this.executeRun(query, [id])

    // 清除相关缓存
    await this.deleteCache(`${CACHE_KEYS.BLOG_ARTICLE}${id}`)
  }

  /**
   * 获取精选文章
   */
  async getFeaturedArticles(limit: number = 5): Promise<BlogArticleListItem[]> {
    const cacheKey = 'featured_articles'
    const cached = await this.getCache<BlogArticleListItem[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1 AND is_featured = 1
      ORDER BY published_at DESC
      LIMIT ?
    `

    const articles = await this.executeQuery<any>(query, [limit])

    // 转换数据格式
    const data: BlogArticleListItem[] = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || '[]'),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at,
    }))

    // 缓存结果
    await this.setCache(cacheKey, data, 1800) // 30分钟缓存

    return data
  }

  /**
   * 获取热门文章
   */
  async getPopularArticles(limit: number = 5): Promise<BlogArticleListItem[]> {
    const cacheKey = 'popular_articles'
    const cached = await this.getCache<BlogArticleListItem[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1
      ORDER BY view_count DESC, like_count DESC
      LIMIT ?
    `

    const articles = await this.executeQuery<any>(query, [limit])

    // 转换数据格式
    const data: BlogArticleListItem[] = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || '[]'),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at,
    }))

    // 缓存结果
    await this.setCache(cacheKey, data, 1800) // 30分钟缓存

    return data
  }

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<string[]> {
    const cacheKey = 'blog_categories'
    const cached = await this.getCache<string[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE is_published = 1 AND category IS NOT NULL
      ORDER BY category ASC
    `

    const results = await this.executeQuery<{ category: string }>(query)
    const categories = results.map(row => row.category)

    // 缓存结果
    await this.setCache(cacheKey, categories, 3600) // 1小时缓存

    return categories
  }

  /**
   * 搜索文章
   */
  async search(
    keyword: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginationResult<BlogArticleListItem>> {
    const offset = (page - 1) * limit
    const searchTerm = `%${keyword}%`

    // 获取总数
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM ${this.tableName} 
      WHERE is_published = 1 
      AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)
    `
    const countResult = await this.executeQueryFirst<{ total: number }>(
      countQuery, 
      [searchTerm, searchTerm, searchTerm]
    )
    const total = countResult?.total || 0

    // 获取搜索结果
    const searchQuery = `
      SELECT 
        id, title, excerpt, category, tags_data,
        view_count, like_count, published_at, created_at
      FROM ${this.tableName} 
      WHERE is_published = 1 
      AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)
      ORDER BY published_at DESC
      LIMIT ? OFFSET ?
    `

    const articles = await this.executeQuery<any>(
      searchQuery, 
      [searchTerm, searchTerm, searchTerm, limit, offset]
    )

    // 转换数据格式
    const data: BlogArticleListItem[] = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: JSON.parse(article.tags_data || '[]'),
      viewCount: article.view_count,
      likeCount: article.like_count,
      publishedAt: article.published_at,
      createdAt: article.created_at,
    }))

    const totalPages = Math.ceil(total / limit)
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }
}