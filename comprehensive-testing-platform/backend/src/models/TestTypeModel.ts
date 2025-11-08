/**
 * 测试类型数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../types/env'
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants'

export interface TestType {
  id: string
  name: string
  category: string
  description?: string
  configData: string // JSON
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TestConfig {
  questions: any[]
  scoringType: string
  scoringRules: any
  resultTemplates: any
  timeLimit?: number
  questionCount: number
}

export interface CreateTestTypeData {
  id: string
  name: string
  category: string
  description?: string
  config: TestConfig
  isActive?: boolean
  sortOrder?: number
}

export class TestTypeModel extends BaseModel {
  constructor(env: Env) {
    super(env, DB_TABLES.TEST_TYPES)
  }

  /**
   * 创建测试类型
   */
  async create(testTypeData: CreateTestTypeData): Promise<string> {
    this.validateRequired(testTypeData, ['id', 'name', 'category', 'config'])

    const now = this.formatTimestamp()

    const query = `
      INSERT INTO ${this.tableName} (
        id, name, category, description, config_data,
        is_active, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      testTypeData.id,
      testTypeData.name,
      testTypeData.category,
      testTypeData.description || null,
      JSON.stringify(testTypeData.config),
      testTypeData.isActive !== false ? 1 : 0,
      testTypeData.sortOrder || 0,
      now,
      now,
    ]

    await this.executeRun(query, params)

    // 缓存测试配置
    const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${testTypeData.id}`
    await this.setCache(cacheKey, testTypeData.config, 3600) // 1小时缓存

    return testTypeData.id
  }

  /**
   * 获取所有活跃的测试类型
   */
  async getAllActive(): Promise<TestType[]> {
    try {
      const cacheKey = 'active_test_types'
      const cached = await this.getCache<TestType[]>(cacheKey)
      
      if (cached) {
        return cached
      }

      const query = `
        SELECT * FROM ${this.tableName} 
        WHERE is_active = 1 
        ORDER BY sort_order ASC, name ASC
      `

      const results = await this.executeQuery<TestType>(query)

      // 缓存结果
      await this.setCache(cacheKey, results, 1800) // 30分钟缓存

      return results
    } catch (error) {
      throw error;
    }
  }

  /**
   * 根据ID获取测试类型
   */
  async findById(id: string): Promise<TestType | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`
    return this.executeQueryFirst<TestType>(query, [id])
  }

  /**
   * 根据分类获取测试类型
   */
  async findByCategory(category: string): Promise<TestType[]> {
    const cacheKey = `test_types_category:${category}`
    const cached = await this.getCache<TestType[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE category = ? AND is_active = 1 
      ORDER BY sort_order ASC, name ASC
    `

    const results = await this.executeQuery<TestType>(query, [category])

    // 缓存结果
    await this.setCache(cacheKey, results, 1800) // 30分钟缓存

    return results
  }

  /**
   * 获取测试配置
   */
  async getConfig(id: string): Promise<TestConfig | null> {
    const cacheKey = `${CACHE_KEYS.TEST_CONFIG}${id}`
    const cached = await this.getCache<TestConfig>(cacheKey)
    
    if (cached) {
      return cached
    }

    const testType = await this.findById(id)
    
    if (!testType) {
      return null
    }

    try {
      const config = JSON.parse(testType.configData) as TestConfig
      
      // 缓存配置
      await this.setCache(cacheKey, config, 3600) // 1小时缓存
      
      return config
    } catch (error) {
      console.error('Failed to parse test config:', error)
      return null
    }
  }

  /**
   * 更新测试类型
   */
  async update(id: string, updateData: Partial<CreateTestTypeData>): Promise<void> {
    const now = this.formatTimestamp()
    const fields: string[] = []
    const params: any[] = []

    // 动态构建更新字段
    if (updateData.name !== undefined) {
      fields.push('name = ?')
      params.push(updateData.name)
    }

    if (updateData.category !== undefined) {
      fields.push('category = ?')
      params.push(updateData.category)
    }

    if (updateData.description !== undefined) {
      fields.push('description = ?')
      params.push(updateData.description)
    }

    if (updateData.config !== undefined) {
      fields.push('config_data = ?')
      params.push(JSON.stringify(updateData.config))
    }

    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?')
      params.push(updateData.isActive ? 1 : 0)
    }

    if (updateData.sortOrder !== undefined) {
      fields.push('sort_order = ?')
      params.push(updateData.sortOrder)
    }

    if (fields.length === 0) {
      return // 没有需要更新的字段
    }

    fields.push('updated_at = ?')
    params.push(now)
    params.push(id)

    const query = `
      UPDATE ${this.tableName} 
      SET ${fields.join(', ')} 
      WHERE id = ?
    `

    await this.executeRun(query, params)

    // 清除相关缓存
    await this.deleteCache(`${CACHE_KEYS.TEST_CONFIG}${id}`)
    await this.deleteCache('active_test_types')
  }

  /**
   * 删除测试类型（软删除 - 设置为不活跃）
   */
  async softDelete(id: string): Promise<void> {
    await this.update(id, { isActive: false })
  }

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<string[]> {
    const cacheKey = 'test_categories'
    const cached = await this.getCache<string[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT DISTINCT category 
      FROM ${this.tableName} 
      WHERE is_active = 1 
      ORDER BY category ASC
    `

    const results = await this.executeQuery<{ category: string }>(query)
    const categories = results.map(row => row.category)

    // 缓存结果
    await this.setCache(cacheKey, categories, 3600) // 1小时缓存

    return categories
  }
}