/**
 * 博客文章数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from './BaseModel';
import type { Env } from '../index';
export interface BlogArticle {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tagsData: string;
    viewCount: number;
    likeCount: number;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateBlogArticleData {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
    publishedAt?: string;
}
export interface BlogArticleListItem {
    id: string;
    title: string;
    excerpt?: string;
    category?: string;
    tags: string[];
    viewCount: number;
    likeCount: number;
    publishedAt?: string;
    createdAt: string;
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare class BlogArticleModel extends BaseModel {
    constructor(env: Env);
    /**
     * 创建博客文章
     */
    create(articleData: CreateBlogArticleData): Promise<string>;
    /**
     * 获取文章列表（分页）
     */
    getList(page?: number, limit?: number, category?: string): Promise<PaginationResult<BlogArticleListItem>>;
    /**
     * 根据ID获取文章详情
     */
    findById(id: string): Promise<BlogArticle | null>;
    /**
     * 增加文章浏览量
     */
    incrementViewCount(id: string): Promise<void>;
    /**
     * 增加文章点赞数
     */
    incrementLikeCount(id: string): Promise<void>;
    /**
     * 获取精选文章
     */
    getFeaturedArticles(limit?: number): Promise<BlogArticleListItem[]>;
    /**
     * 获取热门文章
     */
    getPopularArticles(limit?: number): Promise<BlogArticleListItem[]>;
    /**
     * 获取所有分类
     */
    getCategories(): Promise<string[]>;
    /**
     * 搜索文章
     */
    search(keyword: string, page?: number, limit?: number): Promise<PaginationResult<BlogArticleListItem>>;
}
//# sourceMappingURL=BlogArticleModel.d.ts.map