/**
 * 统一会话管理数据模型
 * 整合所有测试类型的会话数据，提供统一的接口
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../index'
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants'

// 统一的会话状态枚举
export enum SessionStatus {
  CREATED = 'created',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  EXPIRED = 'expired'
}

// 统一的测试类型枚举
export enum TestCategory {
  PSYCHOLOGY = 'psychology',
  CAREER = 'career',
  RELATIONSHIP = 'relationship',
  LEARNING = 'learning',
  ASTROLOGY = 'astrology',
  TAROT = 'tarot',
  NUMEROLOGY = 'numerology'
}

// 统一的会话数据接口
export interface UnifiedSession {
  id: string
  testTypeId: string
  testCategory: TestCategory
  status: SessionStatus
  answersData: any // 统一的答案数据格式
  resultData: any // 统一的结果数据格式
  metadata: any // 扩展元数据
  userAgent?: string
  ipAddressHash?: string
  sessionDuration?: number
  startedAt: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

// 创建会话数据接口
export interface CreateUnifiedSessionData {
  testTypeId: string
  testCategory: TestCategory
  answers?: any[]
  metadata?: any
  userAgent?: string
  ipAddress?: string
}

// 更新会话数据接口
export interface UpdateUnifiedSessionData {
  status?: SessionStatus
  answers?: any[]
  result?: any
  metadata?: any
  sessionDuration?: number
}

// 会话统计接口
export interface SessionStats {
  totalSessions: number
  completedSessions: number
  abandonedSessions: number
  averageSessionDuration: number
  completionRate: number
  averageScore?: number
}

// 测试类型统计接口
export interface TestTypeStats {
  testTypeId: string
  totalSessions: number
  completedSessions: number
  averageScore?: number
  completionRate: number
  averageSessionDuration: number
}

export class UnifiedSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, DB_TABLES.TEST_SESSIONS)
  }

  /**
   * 创建统一会话
   */
  async create(sessionData: CreateUnifiedSessionData): Promise<string> {
    this.validateRequired(sessionData, ['testTypeId', 'testCategory'])

    const id = this.generateId()
    const now = this.formatTimestamp()
    
    // 哈希IP地址以保护隐私
    const ipAddressHash = sessionData.ipAddress 
      ? await this.hashString(sessionData.ipAddress)
      : null

    const query = `
      INSERT INTO ${this.tableName} (
        id, test_type_id, answers_data, result_data,
        user_agent, ip_address_hash, session_duration, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      id,
      sessionData.testTypeId,
      JSON.stringify(sessionData.answers || []),
      JSON.stringify({}), // 初始结果为空
      sessionData.userAgent || null,
      ipAddressHash,
      null, // 初始会话时长为空
      now,
    ]

    await this.executeRun(query, params)

    // 缓存会话信息
    const cacheKey = `${CACHE_KEYS.USER_SESSION}${id}`
    await this.setCache(cacheKey, {
      id,
      testTypeId: sessionData.testTypeId,
      testCategory: sessionData.testCategory,
      status: SessionStatus.CREATED,
      startedAt: now,
      createdAt: now,
    }, 86400) // 24小时缓存

    return id
  }

  /**
   * 根据ID获取会话
   */
  async findById(id: string): Promise<UnifiedSession | null> {
    // 先尝试从缓存获取
    const cacheKey = `${CACHE_KEYS.USER_SESSION}${id}`
    const cached = await this.getCache<UnifiedSession>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`
    const result = await this.executeQueryFirst<any>(query, [id])
    
    if (!result) {
      return null
    }

    const session = this.mapToUnifiedSession(result)
    
    // 更新缓存
    await this.setCache(cacheKey, session, 86400)
    
    return session
  }

  /**
   * 更新会话状态和数据
   */
  async updateSession(id: string, updateData: UpdateUnifiedSessionData): Promise<UnifiedSession | null> {
    // const allowedFields = ['sessionDuration', 'resultData'] // 暂时注释掉，后续可能使用
    const updateFields: string[] = []
    const params: any[] = []

    // 构建更新字段
    if (updateData.status !== undefined) {
      updateFields.push('status = ?')
      params.push(updateData.status)
    }
    
    if (updateData.answers !== undefined) {
      updateFields.push('answers_data = ?')
      params.push(JSON.stringify(updateData.answers))
    }
    
    if (updateData.result !== undefined) {
      updateFields.push('result_data = ?')
      params.push(JSON.stringify(updateData.result))
    }
    
    if (updateData.sessionDuration !== undefined) {
      updateFields.push('session_duration = ?')
      params.push(updateData.sessionDuration)
    }

    if (updateFields.length === 0) {
      return null
    }

    const query = `
      UPDATE ${this.tableName} 
      SET ${updateFields.join(', ')}, updated_at = ? 
      WHERE id = ?
    `
    params.push(this.formatTimestamp(), id)

    await this.executeRun(query, params)

    // 清除相关缓存
    const cacheKey = `${CACHE_KEYS.USER_SESSION}${id}`
    await this.deleteCache(cacheKey)

    // 返回更新后的会话
    return this.findById(id)
  }

  /**
   * 获取最近的会话
   */
  async getRecentSessions(limit: number = 10): Promise<UnifiedSession[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      ORDER BY created_at DESC 
      LIMIT ?
    `

    const results = await this.executeQuery<any>(query, [limit])
    return results.map(result => this.mapToUnifiedSession(result))
  }

  /**
   * 根据测试类型获取会话
   */
  async getSessionsByTestType(testTypeId: string, limit: number = 20, offset: number = 0): Promise<UnifiedSession[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE test_type_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `

    const results = await this.executeQuery<any>(query, [testTypeId, limit, offset])
    return results.map(result => this.mapToUnifiedSession(result))
  }

  /**
   * 根据用户ID获取会话
   */
  async getSessionsByUserId(userId: string, limit: number = 20, offset: number = 0): Promise<UnifiedSession[]> {
    // 这里可以根据实际的用户标识字段进行调整
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE ip_address_hash = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `

    const results = await this.executeQuery<any>(query, [userId, limit, offset])
    return results.map(result => this.mapToUnifiedSession(result))
  }

  /**
   * 获取会话统计信息
   */
  async getSessionStats(): Promise<SessionStats> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN result_data IS NOT NULL AND result_data != '{}' THEN 1 END) as completed,
        COUNT(CASE WHEN result_data IS NULL OR result_data = '{}' THEN 1 END) as abandoned,
        AVG(session_duration) as avg_duration
      FROM ${this.tableName}
    `

    const result = await this.executeQueryFirst<any>(query)
    
    if (!result) {
      return {
        totalSessions: 0,
        completedSessions: 0,
        abandonedSessions: 0,
        averageSessionDuration: 0,
        completionRate: 0
      }
    }

    const total = result.total || 0
    const completed = result.completed || 0
    const avgDuration = result.avg_duration || 0

    return {
      totalSessions: total,
      completedSessions: completed,
      abandonedSessions: total - completed,
      averageSessionDuration: avgDuration,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  }

  /**
   * 获取测试类型统计信息
   */
  async getTestTypeStats(testTypeId: string): Promise<TestTypeStats> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN result_data IS NOT NULL AND result_data != '{}' THEN 1 END) as completed,
        AVG(session_duration) as avg_duration
      FROM ${this.tableName}
      WHERE test_type_id = ?
    `

    const result = await this.executeQueryFirst<any>(query, [testTypeId])
    
    if (!result) {
      return {
        testTypeId,
        totalSessions: 0,
        completedSessions: 0,
        completionRate: 0,
        averageSessionDuration: 0
      }
    }

    const total = result.total || 0
    const completed = result.completed || 0
    const avgDuration = result.avg_duration || 0

    return {
      testTypeId,
      totalSessions: total,
      completedSessions: completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageSessionDuration: avgDuration
    }
  }

  /**
   * 删除过期的会话
   */
  async deleteExpiredSessions(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    const cutoffTimestamp = this.formatTimestamp(cutoffDate)

    const query = `DELETE FROM ${this.tableName} WHERE created_at < ?`
    const result = await this.executeRun(query, [cutoffTimestamp])

    return (result as any).changes || 0
  }

  /**
   * 映射数据库结果到统一会话对象
   */
  private mapToUnifiedSession(row: any): UnifiedSession {
    // 尝试从result_data中提取测试类型信息
    let testCategory = TestCategory.PSYCHOLOGY // 默认值
    let status = SessionStatus.CREATED
    
    try {
      if (row.result_data && row.result_data !== '{}') {
        const resultData = JSON.parse(row.result_data)
        if (resultData.testCategory) {
          testCategory = resultData.testCategory
        }
        status = SessionStatus.COMPLETED
      }
    } catch (error) {
      // 如果解析失败，使用默认值
    }

    return {
      id: row.id,
      testTypeId: row.test_type_id,
      testCategory,
      status,
      answersData: row.answers_data ? JSON.parse(row.answers_data) : [],
      resultData: row.result_data ? JSON.parse(row.result_data) : {},
      metadata: {}, // 可以从其他字段提取
      userAgent: row.user_agent,
      ipAddressHash: row.ip_address_hash,
      sessionDuration: row.session_duration,
      startedAt: row.created_at,
      completedAt: row.result_data && row.result_data !== '{}' ? row.created_at : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at
    }
  }

  /**
   * 哈希字符串（用于IP地址）
   */
  private async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}
