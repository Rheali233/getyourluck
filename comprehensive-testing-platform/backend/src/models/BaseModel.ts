/**
 * 基础数据模型类
 * 遵循统一开发标准的数据访问层规范
 */

import type { Env } from '../index'
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors'
import { generateUUID, formatDate } from '../../../shared/utils'

export abstract class BaseModel {
  protected db: D1Database
  protected kv: KVNamespace
  protected tableName: string

  constructor(env: Env, tableName: string) {
    this.db = env.DB
    this.kv = env.KV
    this.tableName = tableName
  }

  /**
   * 获取数据库连接
   */
  protected get database(): D1Database {
    return this.db;
  }

  /**
   * 执行数据库查询
   */
  protected async executeQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    try {
      const stmt = this.db.prepare(query)
      const result = params.length > 0 
        ? await stmt.bind(...params).all()
        : await stmt.all()

      if (!result.success) {
        throw new ModuleError(
          `Database query failed: ${result.error}`,
          ERROR_CODES.DATABASE_ERROR,
          500
        )
      }

      return result.results as T[]
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error
      }
      
      throw new ModuleError(
        `Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 执行单条记录查询
   */
  protected async executeQueryFirst<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    try {
      const stmt = this.db.prepare(query)
      const result = params.length > 0 
        ? await stmt.bind(...params).first()
        : await stmt.first()

      return result as T | null
    } catch (error) {
      throw new ModuleError(
        `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 执行插入/更新/删除操作
   */
  protected async executeRun(
    query: string,
    params: any[] = []
  ): Promise<D1Result> {
    try {
      const stmt = this.db.prepare(query)
      const result = params.length > 0 
        ? await stmt.bind(...params).run()
        : await stmt.run()

      if (!result.success) {
        throw new ModuleError(
          `Database operation failed: ${result.error}`,
          ERROR_CODES.DATABASE_ERROR,
          500
        )
      }

      return result
    } catch (error) {
      if (error instanceof ModuleError) {
        throw error
      }
      
      throw new ModuleError(
        `Database operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ERROR_CODES.DATABASE_ERROR,
        500
      )
    }
  }

  /**
   * 缓存数据
   */
  protected async setCache(
    key: string,
    data: any,
    ttl: number = 3600
  ): Promise<void> {
    try {
      await this.kv.put(key, JSON.stringify(data), {
        expirationTtl: ttl,
      })
    } catch (error) {
      // 缓存失败不应该影响主要功能
      console.warn('Cache operation failed:', error)
    }
  }

  /**
   * 获取缓存数据
   */
  protected async getCache<T = any>(key: string): Promise<T | null> {
    try {
      const cached = await this.kv.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.warn('Cache retrieval failed:', error)
      return null
    }
  }

  /**
   * 删除缓存
   */
  protected async deleteCache(key: string): Promise<void> {
    try {
      await this.kv.delete(key)
    } catch (error) {
      console.warn('Cache deletion failed:', error)
    }
  }

  /**
   * 生成新的ID
   */
  protected generateId(): string {
    return generateUUID()
  }

  /**
   * 格式化时间戳
   */
  protected formatTimestamp(date?: Date): string {
    return formatDate(date || new Date())
  }

  /**
   * 验证必填字段
   */
  protected validateRequired(data: Record<string, any>, fields: string[]): void {
    const missing = fields.filter(field => !data[field])
    
    if (missing.length > 0) {
      throw new ModuleError(
        `Missing required fields: ${missing.join(', ')}`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    }
  }
}