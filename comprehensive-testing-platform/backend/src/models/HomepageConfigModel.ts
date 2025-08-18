/**
 * 首页配置数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel';

export interface HomepageConfigData {
  key: string;
  value: string; // JSON格式的配置值
  description?: string;
  isPublic: boolean;
  updatedAt: Date;
}

export class HomepageConfigModel extends BaseModel {
  constructor(env: any) {
    super(env, 'homepage_config');
  }

  /**
   * 获取所有公开配置
   */
  async getAllPublicConfigs(): Promise<Record<string, any>> {
    try {
      const result = await this.db
        .prepare(`
          SELECT key, value, description 
          FROM homepage_config 
          WHERE is_public = 1
        `)
        .all();

      const configs: Record<string, any> = {};
      
      result.results?.forEach((row) => {
        try {
          configs[(row as any)['key'] as string] = JSON.parse((row as any)['value'] as string);
        } catch (error) {
          console.warn(`解析配置${(row as any)['key']}失败:`, error);
          configs[(row as any)['key'] as string] = (row as any)['value'];
        }
      });

      return configs;
    } catch (error) {
      console.error('获取首页配置失败:', error);
      throw new Error('获取首页配置失败');
    }
  }

  /**
   * 根据键获取配置
   */
  async getConfigByKey(key: string): Promise<any> {
    try {
      const result = await this.db
        .prepare('SELECT value FROM homepage_config WHERE key = ? AND is_public = 1')
        .bind(key)
        .first();

      if (!result) {
        return null;
      }

      try {
        return JSON.parse((result as any)['value'] as string);
      } catch (error) {
        console.warn(`解析配置${key}失败:`, error);
        return (result as any)['value'];
      }
    } catch (error) {
      console.error(`获取配置${key}失败:`, error);
      throw new Error(`获取配置失败`);
    }
  }

  /**
   * 更新配置
   */
  async updateConfig(key: string, value: any, description?: string): Promise<void> {
    try {
      const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      await this.db
        .prepare(`
          INSERT OR REPLACE INTO homepage_config (key, value, description, updated_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        `)
        .bind(key, jsonValue, description || '')
        .run();
    } catch (error) {
      console.error(`更新配置${key}失败:`, error);
      throw new Error('更新配置失败');
    }
  }

  /**
   * 批量更新配置
   */
  async batchUpdateConfigs(configs: Record<string, any>): Promise<void> {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO homepage_config (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);

      const batch = Object.entries(configs).map(([key, value]) => {
        const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
        return stmt.bind(key, jsonValue);
      });

      await this.db.batch(batch);
    } catch (error) {
      console.error('批量更新配置失败:', error);
      throw new Error('批量更新配置失败');
    }
  }

  /**
   * 删除配置
   */
  async deleteConfig(key: string): Promise<void> {
    try {
      await this.db
        .prepare('DELETE FROM homepage_config WHERE key = ?')
        .bind(key)
        .run();
    } catch (error) {
      console.error(`删除配置${key}失败:`, error);
      throw new Error('删除配置失败');
    }
  }

  /**
   * 获取配置列表
   */
  async getConfigList(): Promise<HomepageConfigData[]> {
    try {
      const result = await this.db
        .prepare(`
          SELECT key, value, description, is_public, updated_at
          FROM homepage_config
          ORDER BY key ASC
        `)
        .all();

      return result.results?.map(this.mapDatabaseRowToConfig) || [];
    } catch (error) {
      console.error('获取配置列表失败:', error);
      throw new Error('获取配置列表失败');
    }
  }

  /**
   * 将数据库行映射为HomepageConfigData对象
   */
  private mapDatabaseRowToConfig(row: any): HomepageConfigData {
    return {
      key: row.key as string,
      value: row.value as string,
      description: row.description as string,
      isPublic: Boolean(row.is_public),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
