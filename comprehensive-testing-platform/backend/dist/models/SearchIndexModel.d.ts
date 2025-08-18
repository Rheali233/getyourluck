/**
 * 搜索索引数据模型
 * 遵循统一开发标准的搜索功能实现
 */
import { BaseModel } from './BaseModel';
import type { SearchSuggestion } from '../../../shared/types/homepage';
export interface SearchIndexData {
    id: string;
    contentType: 'test' | 'blog' | 'category' | 'tag';
    contentId: string;
    title: string;
    description?: string;
    content?: string;
    keywords?: string;
    language: string;
    relevanceScore: number;
    searchCount: number;
    lastSearched?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface SearchResult {
    id: string;
    contentType: string;
    contentId: string;
    title: string;
    description?: string;
    relevanceScore: number;
    searchCount: number;
}
export declare class SearchIndexModel extends BaseModel {
    constructor(env: any);
    /**
     * 搜索内容
     */
    search(query: string, language?: string, limit?: number): Promise<SearchResult[]>;
    /**
     * 获取搜索建议
     */
    getSearchSuggestions(query: string, language?: string, limit?: number): Promise<SearchSuggestion[]>;
    /**
     * 获取热门搜索关键词
     */
    getPopularKeywords(language?: string, limit?: number): Promise<string[]>;
    /**
     * 增加搜索次数
     */
    incrementSearchCount(id: string): Promise<void>;
    /**
     * 记录搜索关键词
     */
    recordSearchKeyword(keyword: string, language?: string): Promise<void>;
    /**
     * 添加搜索索引
     */
    addSearchIndex(data: Omit<SearchIndexData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
    /**
     * 更新搜索索引
     */
    updateSearchIndex(id: string, data: Partial<SearchIndexData>): Promise<void>;
    /**
     * 删除搜索索引
     */
    deleteSearchIndex(id: string): Promise<void>;
    /**
     * 将数据库行映射为SearchResult对象
     */
    private mapDatabaseRowToSearchResult;
}
//# sourceMappingURL=SearchIndexModel.d.ts.map