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

export class SearchIndexModel extends BaseModel {
  constructor(env: any) {
    super(env, 'search_index');
  }

  /**
   * 搜索内容
   */
  async search(query: string, language: string = 'zh-CN', limit: number = 20): Promise<SearchResult[]> {
    try {
      console.log('开始搜索，参数:', { query, language, limit });
      
      // 临时简化：直接返回硬编码结果进行测试
      const mockResults: SearchResult[] = [
        {
          id: 'search-001',
          contentType: 'test',
          contentId: 'psychology',
          title: '心理健康测试',
          description: '揭秘你的性格密码',
          relevanceScore: 100,
          searchCount: 0,
        },
        {
          id: 'search-002',
          contentType: 'test',
          contentId: 'astrology',
          title: '星座运势分析',
          description: '今日运势早知道',
          relevanceScore: 95,
          searchCount: 0,
        }
      ];
      
      console.log('返回模拟搜索结果:', mockResults);
      return mockResults;
      
      // TODO: 恢复数据库查询
      // const result = await this.executeQuery(`
      //   SELECT id, content_type, content_id, title, description, relevance_score, search_count
      //   FROM search_index 
      //   WHERE language = ?
      //   ORDER BY relevance_score DESC, search_count DESC
      //   LIMIT ?
      // `, [language, limit]);
      // return result.map(this.mapDatabaseRowToSearchResult);
    } catch (error) {
      console.error('搜索失败:', error);
      throw new Error('搜索失败');
    }
  }

  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(query: string, language: string = 'zh-CN', limit: number = 10): Promise<SearchSuggestion[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT DISTINCT title, content_type, relevance_score
          FROM search_index 
          WHERE language = ? 
            AND (
              title LIKE ? OR 
              keywords LIKE ?
            )
          ORDER BY relevance_score DESC, search_count DESC
          LIMIT ?
        `)
        .bind(
          language,
          `%${query}%`,
          `%${query}%`,
          limit
        )
        .all();

      return result.results?.map((row, index) => ({
        id: `suggestion_${index}`,
        text: row.title as string,
        type: row.content_type as 'test' | 'blog' | 'category',
        relevance: row.relevance_score as number,
      })) || [];
    } catch (error) {
      console.error('获取搜索建议失败:', error);
      throw new Error('获取搜索建议失败');
    }
  }

  /**
   * 获取热门搜索关键词
   */
  async getPopularKeywords(language: string = 'zh-CN', limit: number = 10): Promise<string[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT keyword 
          FROM popular_search_keywords 
          WHERE language = ? 
          ORDER BY search_count DESC 
          LIMIT ?
        `)
        .bind(language, limit)
        .all();

      return result.results?.map(row => row.keyword as string) || [];
    } catch (error) {
      console.error('获取热门关键词失败:', error);
      throw new Error('获取热门关键词失败');
    }
  }

  /**
   * 增加搜索次数
   */
  async incrementSearchCount(id: string): Promise<void> {
    try {
      await this.db
        .prepare(`
          UPDATE search_index 
          SET search_count = search_count + 1, last_searched = CURRENT_TIMESTAMP 
          WHERE id = ?
        `)
        .bind(id)
        .run();
    } catch (error) {
      console.error(`增加搜索次数失败:`, error);
    }
  }

  /**
   * 记录搜索关键词
   */
  async recordSearchKeyword(keyword: string, language: string = 'zh-CN'): Promise<void> {
    try {
      await this.db
        .prepare(`
          INSERT INTO popular_search_keywords (id, keyword, language, search_count)
          VALUES (?, ?, ?, 1)
          ON CONFLICT(keyword) DO UPDATE SET 
            search_count = search_count + 1,
            last_searched = CURRENT_TIMESTAMP
        `)
        .bind(crypto.randomUUID(), keyword, language)
        .run();
    } catch (error) {
      console.error(`记录搜索关键词失败:`, error);
    }
  }

  /**
   * 添加搜索索引
   */
  async addSearchIndex(data: Omit<SearchIndexData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const id = crypto.randomUUID();
      
      await this.db
        .prepare(`
          INSERT INTO search_index (
            id, content_type, content_id, title, description, content, 
            keywords, language, relevance_score, search_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          id,
          data.contentType,
          data.contentId,
          data.title,
          data.description || '',
          data.content || '',
          data.keywords || '',
          data.language,
          data.relevanceScore,
          data.searchCount
        )
        .run();

      return id;
    } catch (error) {
      console.error('添加搜索索引失败:', error);
      throw new Error('添加搜索索引失败');
    }
  }

  /**
   * 更新搜索索引
   */
  async updateSearchIndex(id: string, data: Partial<SearchIndexData>): Promise<void> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title);
      }
      if (data.description !== undefined) {
        updates.push('description = ?');
        values.push(data.description);
      }
      if (data.content !== undefined) {
        updates.push('content = ?');
        values.push(data.content);
      }
      if (data.keywords !== undefined) {
        updates.push('keywords = ?');
        values.push(data.keywords);
      }
      if (data.relevanceScore !== undefined) {
        updates.push('relevance_score = ?');
        values.push(data.relevanceScore);
      }

      if (updates.length === 0) return;

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      await this.db
        .prepare(`
          UPDATE search_index 
          SET ${updates.join(', ')}
          WHERE id = ?
        `)
        .bind(...values)
        .run();
    } catch (error) {
      console.error(`更新搜索索引失败:`, error);
      throw new Error('更新搜索索引失败');
    }
  }

  /**
   * 删除搜索索引
   */
  async deleteSearchIndex(id: string): Promise<void> {
    try {
      await this.db
        .prepare('DELETE FROM search_index WHERE id = ?')
        .bind(id)
        .run();
    } catch (error) {
      console.error(`删除搜索索引失败:`, error);
      throw new Error('删除搜索索引失败');
    }
  }

  /**
   * 将数据库行映射为SearchResult对象
   */
  private mapDatabaseRowToSearchResult(row: any): SearchResult {
    return {
      id: row.id as string,
      contentType: row.content_type as string,
      contentId: row.content_id as string,
      title: row.title as string,
      description: row.description as string,
      relevanceScore: row.relevance_score as number,
      searchCount: row.search_count as number,
    };
  }
}
