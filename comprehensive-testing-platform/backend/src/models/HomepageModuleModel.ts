/**
 * 首页模块数据模型
 * 遵循统一开发标准的数据模型规范
 */

import type { HomepageModule } from '../../../shared/types/homepage';
import { BaseModel } from './BaseModel';

export class HomepageModuleModel extends BaseModel {
  constructor(env: any) {
    super(env, 'homepage_modules');
  }

  /**
   * 获取所有活跃的测试模块
   */
  async getAllActiveModules(): Promise<HomepageModule[]> {
    try {
      const result = await this.safeDB
        .prepare(`
          SELECT * FROM homepage_modules 
          WHERE is_active = 1 
          ORDER BY sort_order ASC, created_at ASC
        `)
        .all();

      return result.results?.map(this.mapDatabaseRowToModule) || [];
    } catch (error) {
      throw new Error('Failed to fetch active modules');
    }
  }

  /**
   * 根据主题获取测试模块
   */
  async getModulesByTheme(theme: string): Promise<HomepageModule[]> {
    try {
      const result = await this.safeDB
        .prepare(`
          SELECT * FROM homepage_modules 
          WHERE theme = ? AND is_active = 1 
          ORDER BY sort_order ASC
        `)
        .bind(theme)
        .all();

      return result.results?.map(this.mapDatabaseRowToModule) || [];
    } catch (error) {
      throw new Error(`Failed to fetch modules for theme ${theme}`);
    }
  }

  /**
   * 根据ID获取测试模块
   */
  async getModuleById(id: string): Promise<HomepageModule | null> {
    try {
      const result = await this.safeDB
        .prepare('SELECT * FROM homepage_modules WHERE id = ? AND is_active = 1')
        .bind(id)
        .first();

      return result ? this.mapDatabaseRowToModule(result) : null;
    } catch (error) {
      throw new Error('Failed to fetch module');
    }
  }

  /**
   * 更新测试模块统计信息
   */
  async updateModuleStats(id: string, testCount: number, rating: number): Promise<void> {
    try {
      await this.safeDB
        .prepare(`
          UPDATE homepage_modules 
          SET test_count = ?, rating = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `)
        .bind(testCount, rating, id)
        .run();
    } catch (error) {
      throw new Error('Failed to update module statistics');
    }
  }

  /**
   * 获取测试模块统计摘要
   */
  async getModulesStats(): Promise<{
    totalModules: number;
    totalTests: number;
    averageRating: number;
    activeThemes: string[];
  }> {
    try {
      // 分别查询统计信息，避免SQLite兼容性问题
      const countResult = await this.safeDB
        .prepare('SELECT COUNT(*) as total_modules FROM homepage_modules WHERE is_active = 1')
        .first();
        
      const sumResult = await this.safeDB
        .prepare('SELECT SUM(test_count) as total_tests, AVG(rating) as average_rating FROM homepage_modules WHERE is_active = 1')
        .first();
        
      const themesResult = await this.safeDB
        .prepare('SELECT DISTINCT theme FROM homepage_modules WHERE is_active = 1')
        .all();

      if (!countResult || !sumResult) {
        return {
          totalModules: 0,
          totalTests: 0,
          averageRating: 0,
          activeThemes: [],
        };
      }

      return {
        totalModules: (countResult as any)['total_modules'] as number,
        totalTests: (sumResult as any)['total_tests'] as number || 0,
        averageRating: (sumResult as any)['average_rating'] as number || 0,
        activeThemes: themesResult.results?.map((row: any) => row.theme as string) || [],
      };
    } catch (error) {
      throw new Error('Failed to retrieve module statistics summary');
    }
  }

  /**
   * 将数据库行映射为HomepageModule对象
   */
  private mapDatabaseRowToModule(row: any): HomepageModule {
    return {
      id: row.id as string,
      name: row.name as string,
      description: row.description as string,
      icon: row.icon as string,
      theme: (row as any)['theme'] as 'psychology' | 'astrology' | 'tarot' | 'career' | 'learning' | 'relationship' | 'numerology',
      testCount: row.test_count as number,
      rating: row.rating as number,
      isActive: Boolean(row.is_active),
      route: row.route as string,
      features: JSON.parse(row.features_data as string),
      estimatedTime: row.estimated_time as string,
      sortOrder: row.sort_order as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
