/**
 * 基础数据模型类
 * 遵循统一开发标准的数据访问层规范
 */

import type { Env } from '../index'
import { ModuleError, ERROR_CODES } from '../../../shared/types/errors'
// 本地实现通用工具，避免对shared/utils直接编译依赖

export abstract class BaseModel {
  protected db: D1Database | null = null
  protected kv: KVNamespace | null = null
  protected tableName: string
  protected env: Env

  constructor(env: Env, tableName: string) {
    this.env = env
    this.tableName = tableName
  }

  /**
   * 初始化数据库连接
   */
  protected initializeDB(): void {
    if (!this.env.DB) {
      throw new ModuleError('Database connection not available', ERROR_CODES.DATABASE_ERROR, 500)
    }
    
    if (!this.db) {
      this.db = this.env.DB
      this.kv = this.env.KV || null
    }
  }

  /**
   * 获取数据库连接
   */
  protected get database(): D1Database {
    this.initializeDB();
    return this.db!;
  }

  /**
   * 安全的数据库访问方法
   */
  protected get safeDB(): D1Database {
    this.initializeDB();
    return this.db!;
  }

  /**
   * 安全的KV访问方法
   */
  protected get safeKV(): KVNamespace | null {
    this.initializeDB();
    return this.kv;
  }

  /**
   * 执行数据库查询
   */
  protected async executeQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    try {
      this.initializeDB();
      const stmt = this.db!.prepare(query)
      const result = params.length > 0 
        ? await stmt.bind(...params).all()
        : await stmt.all()

      // D1 数据库的 all() 方法不返回 success 属性
      // 如果有错误，会在 catch 块中捕获
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
      this.initializeDB();
      const stmt = this.db!.prepare(query)
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
      this.initializeDB();
      const stmt = this.db!.prepare(query)
      const result = params.length > 0 
        ? await stmt.bind(...params).run()
        : await stmt.run()

      // D1 数据库的 run() 方法不返回 success 属性
      // 如果有错误，会在 catch 块中捕获
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
      if (this.kv) {
        await this.kv.put(key, JSON.stringify(data), {
          expirationTtl: ttl,
        })
      }
    } catch (error) {
      // Cache failure should not affect main functionality
      console.warn('Cache operation failed:', error)
    }
  }

  /**
   * 获取缓存数据
   */
  protected async getCache<T = any>(key: string): Promise<T | null> {
    try {
      if (this.kv) {
        const cached = await this.kv.get(key)
        return cached ? JSON.parse(cached) : null
      }
      return null
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
      if (this.kv) {
        await this.kv.delete(key)
      }
    } catch (error) {
      console.warn('Cache deletion failed:', error)
    }
  }

  /**
   * 生成新的ID
   */
  protected generateId(): string {
    // 使用Web Crypto生成UUID
    return (globalThis as any).crypto?.randomUUID
      ? (globalThis as any).crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }

  /**
   * 格式化时间戳
   */
  protected formatTimestamp(date?: Date): string {
    return (date || new Date()).toISOString()
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

  /**
   * 通用错误构造器
   */
  protected createError(message: string, code: keyof typeof ERROR_CODES = 'DATABASE_ERROR', status: number = 500): ModuleError {
    return new ModuleError(message, ERROR_CODES[code], status)
  }

  /**
   * 通用统计条目数量
   */
  public async count(whereClause: string = '', params: any[] = []): Promise<number> {
    const where = whereClause ? ` WHERE ${whereClause} ` : ''
    const result = await this.executeQueryFirst<{ count: number }>(`SELECT COUNT(*) as count FROM ${this.tableName}${where}`, params)
    return result?.count || 0
  }
}