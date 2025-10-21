/**
 * 测试会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../index'
import { CACHE_KEYS, DB_TABLES } from '../../../shared/constants'

async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export interface TestSession {
  id: string
  testTypeId: string
  answersData: string // JSON
  resultData: string // JSON
  userAgent?: string
  ipAddressHash?: string
  sessionDuration?: number
  createdAt: string
}

export interface CreateTestSessionData {
  testTypeId: string
  answers: any[]
  result: any
  userAgent?: string
  ipAddress?: string
  sessionDuration?: number
}

export interface TestSessionStats {
  totalSessions: number
  averageScore: number
  completionRate: number
}

export class TestSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, DB_TABLES.TEST_SESSIONS)
  }

  /**
   * 创建测试会话
   */
  async create(sessionData: CreateTestSessionData): Promise<string> {
    this.validateRequired(sessionData, ['testTypeId', 'answers', 'result'])

    const id = this.generateId()
    const now = this.formatTimestamp()
    
    // 哈希IP地址以保护隐私
    const ipAddressHash = sessionData.ipAddress 
      ? await hashString(sessionData.ipAddress)
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
      JSON.stringify(sessionData.answers),
      JSON.stringify(sessionData.result),
      sessionData.userAgent || null,
      ipAddressHash,
      sessionData.sessionDuration || null,
      now,
    ]

    await this.executeRun(query, params)

    // 缓存测试结果
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`
    await this.setCache(cacheKey, {
      id,
      testTypeId: sessionData.testTypeId,
      result: sessionData.result,
      createdAt: now,
    }, 86400) // 24小时缓存

    return id
  }

  /**
   * 根据ID获取测试会话
   */
  async findById(id: string): Promise<TestSession | null> {
    // 先尝试从缓存获取
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`
    const cached = await this.getCache<TestSession>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`
    const result = await this.executeQueryFirst<TestSession>(query, [id])

    if (result) {
      // 缓存结果
      await this.setCache(cacheKey, result, 3600) // 1小时缓存
    }

    return result
  }

  /**
   * 根据测试类型获取统计数据
   */
  async getStatsByTestType(testTypeId: string): Promise<TestSessionStats> {
    const cacheKey = `test_stats:${testTypeId}`
    const cached = await this.getCache<TestSessionStats>(cacheKey)
    
    if (cached) {
      return cached
    }

    const query = `
      SELECT 
        COUNT(*) as total_sessions
      FROM ${this.tableName} 
      WHERE test_type_id = ?
    `

    const result = await this.executeQueryFirst<any>(query, [testTypeId])

    const stats: TestSessionStats = {
      totalSessions: result?.total_sessions || 0,
      averageScore: 0, // 暂时设为0，后续可以优化
      completionRate: 100, // 暂时设为100%，后续可以优化
    }

    // 缓存统计数据
    await this.setCache(cacheKey, stats, 1800) // 30分钟缓存

    return stats
  }

  /**
   * 获取最近的测试会话
   */
  async getRecentSessions(limit: number = 10): Promise<TestSession[]> {
    try {
      const query = `
        SELECT * FROM ${this.tableName} 
        ORDER BY created_at DESC 
        LIMIT ?
      `
      
      const results = await this.executeQuery<TestSession>(query, [limit])
      return results
    } catch (error) {
      console.error("Error in getRecentSessions:", error);
      throw error;
    }
  }

  /**
   * 根据时间范围获取会话数量
   */
  async getSessionCountByDateRange(
    startDate: string,
    endDate: string,
    testTypeId?: string
  ): Promise<number> {
    let query = `
      SELECT COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE created_at BETWEEN ? AND ?
    `
    const params = [startDate, endDate]

    if (testTypeId) {
      query += ' AND test_type_id = ?'
      params.push(testTypeId)
    }

    const result = await this.executeQueryFirst<{ count: number }>(query, params)
    return result?.count || 0
  }

  /**
   * 删除过期的测试会话（数据清理）
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
   * 更新会话持续时间
   */
  async updateSessionDuration(id: string, duration: number): Promise<void> {
    const query = `
      UPDATE ${this.tableName} 
      SET session_duration = ? 
      WHERE id = ?
    `

    await this.executeRun(query, [duration, id])

    // 清除相关缓存
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`
    await this.deleteCache(cacheKey)
  }

  /**
   * 更新会话信息
   */
  async updateSession(id: string, updateData: Partial<TestSession>): Promise<TestSession | null> {
    const allowedFields = ['sessionDuration', 'resultData'];
    const updateFields: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        const dbField = key === 'sessionDuration' ? 'session_duration' : 
                       key === 'resultData' ? 'result_data' : key;
        updateFields.push(`${dbField} = ?`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      return null;
    }

    const query = `
      UPDATE ${this.tableName} 
      SET ${updateFields.join(', ')}, updated_at = ? 
      WHERE id = ?
    `;
    params.push(this.formatTimestamp(), id);

    await this.executeRun(query, params);

    // 清除相关缓存
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
    await this.deleteCache(cacheKey);

    // 返回更新后的会话
    return this.findById(id);
  }

  /**
   * 删除会话
   */
  async deleteSession(id: string): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await this.executeRun(query, [id]);

    // 清除相关缓存
    const cacheKey = `${CACHE_KEYS.TEST_RESULT}${id}`;
    await this.deleteCache(cacheKey);
  }

  /**
   * 根据用户ID获取会话列表
   */
  async getSessionsByUserId(_userId: string, _limit: number = 20, _offset: number = 0): Promise<TestSession[]> {
    // 注意：当前模型没有user_id字段，这里返回空数组
    // 如果需要用户关联，需要先修改数据库结构
    return [];
  }
}