/**
 * 分析事件数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from './BaseModel'
import type { Env } from '../index'
import { DB_TABLES } from '../../../shared/constants'
import { hashString } from '../../../shared/utils'

export interface AnalyticsEvent {
  id: string
  eventType: string
  eventData?: string // JSON
  sessionId?: string
  ipAddressHash?: string
  userAgent?: string
  timestamp: string
}

export interface CreateAnalyticsEventData {
  eventType: string
  eventData?: any
  sessionId?: string
  ipAddress?: string
  userAgent?: string
}

export interface EventStats {
  eventType: string
  count: number
  percentage: number
}

export interface AnalyticsOverview {
  totalEvents: number
  uniqueSessions: number
  topEvents: EventStats[]
  timeRange: string
}

export class AnalyticsEventModel extends BaseModel {
  constructor(env: Env) {
    super(env, DB_TABLES.ANALYTICS_EVENTS)
  }

  /**
   * 创建分析事件
   */
  async create(eventData: CreateAnalyticsEventData): Promise<string> {
    this.validateRequired(eventData, ['eventType'])

    const id = this.generateId()
    const now = this.formatTimestamp()
    
    // 哈希IP地址以保护隐私
    const ipAddressHash = eventData.ipAddress 
      ? await hashString(eventData.ipAddress)
      : null

    const query = `
      INSERT INTO ${this.tableName} (
        id, event_type, event_data, session_id,
        ip_address_hash, user_agent, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      id,
      eventData.eventType,
      eventData.eventData ? JSON.stringify(eventData.eventData) : null,
      eventData.sessionId || null,
      ipAddressHash,
      eventData.userAgent || null,
      now,
    ]

    await this.executeRun(query, params)

    return id
  }

  /**
   * 获取事件统计
   */
  async getEventStats(
    startDate?: string,
    endDate?: string,
    limit: number = 10
  ): Promise<EventStats[]> {
    let whereClause = ''
    const params: any[] = []

    if (startDate && endDate) {
      whereClause = 'WHERE timestamp BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }

    const query = `
      SELECT 
        event_type,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ${this.tableName} ${whereClause}), 2) as percentage
      FROM ${this.tableName} 
      ${whereClause}
      GROUP BY event_type
      ORDER BY count DESC
      LIMIT ?
    `

    params.push(limit)

    const results = await this.executeQuery<any>(query, params)

    return results.map(row => ({
      eventType: row.event_type,
      count: row.count,
      percentage: row.percentage,
    }))
  }

  /**
   * 获取分析概览
   */
  async getOverview(
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsOverview> {
    const timeRange = startDate && endDate 
      ? `${startDate} to ${endDate}`
      : 'All time'

    let whereClause = ''
    const params: any[] = []

    if (startDate && endDate) {
      whereClause = 'WHERE timestamp BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }

    // 获取总事件数和唯一会话数
    const overviewQuery = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM ${this.tableName} 
      ${whereClause}
    `

    const overviewResult = await this.executeQueryFirst<any>(overviewQuery, params)

    // 获取热门事件
    const topEvents = await this.getEventStats(startDate, endDate, 5)

    return {
      totalEvents: overviewResult?.total_events || 0,
      uniqueSessions: overviewResult?.unique_sessions || 0,
      topEvents,
      timeRange,
    }
  }

  /**
   * 根据事件类型获取事件
   */
  async findByEventType(
    eventType: string,
    limit: number = 100,
    startDate?: string,
    endDate?: string
  ): Promise<AnalyticsEvent[]> {
    let whereClause = 'WHERE event_type = ?'
    const params: any[] = [eventType]

    if (startDate && endDate) {
      whereClause += ' AND timestamp BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }

    const query = `
      SELECT * FROM ${this.tableName} 
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT ?
    `

    params.push(limit)

    return this.executeQuery<AnalyticsEvent>(query, params)
  }

  /**
   * 根据会话ID获取事件
   */
  async findBySessionId(sessionId: string): Promise<AnalyticsEvent[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `

    return this.executeQuery<AnalyticsEvent>(query, [sessionId])
  }

  /**
   * 获取每日事件统计
   */
  async getDailyStats(
    days: number = 30,
    eventType?: string
  ): Promise<Array<{ date: string; count: number }>> {
    let whereClause = `WHERE timestamp >= datetime('now', '-${days} days')`
    const params: any[] = []

    if (eventType) {
      whereClause += ' AND event_type = ?'
      params.push(eventType)
    }

    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM ${this.tableName} 
      ${whereClause}
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `

    const results = await this.executeQuery<any>(query, params)

    return results.map(row => ({
      date: row.date,
      count: row.count,
    }))
  }

  /**
   * 获取用户行为路径
   */
  async getUserJourney(sessionId: string): Promise<AnalyticsEvent[]> {
    const query = `
      SELECT * FROM ${this.tableName} 
      WHERE session_id = ? 
      ORDER BY timestamp ASC
    `

    return this.executeQuery<AnalyticsEvent>(query, [sessionId])
  }

  /**
   * 删除过期的分析事件（数据清理）
   */
  async deleteExpiredEvents(daysOld: number = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    const cutoffTimestamp = this.formatTimestamp(cutoffDate)

    const query = `DELETE FROM ${this.tableName} WHERE timestamp < ?`
    const result = await this.executeRun(query, [cutoffTimestamp])

    return result.changes || 0
  }

  /**
   * 批量创建事件（用于高频事件）
   */
  async createBatch(events: CreateAnalyticsEventData[]): Promise<number> {
    if (events.length === 0) {
      return 0
    }

    const now = this.formatTimestamp()
    const values: string[] = []
    const params: any[] = []

    for (const eventData of events) {
      const id = this.generateId()
      const ipAddressHash = eventData.ipAddress 
        ? await hashString(eventData.ipAddress)
        : null

      values.push('(?, ?, ?, ?, ?, ?, ?)')
      params.push(
        id,
        eventData.eventType,
        eventData.eventData ? JSON.stringify(eventData.eventData) : null,
        eventData.sessionId || null,
        ipAddressHash,
        eventData.userAgent || null,
        now
      )
    }

    const query = `
      INSERT INTO ${this.tableName} (
        id, event_type, event_data, session_id,
        ip_address_hash, user_agent, timestamp
      ) VALUES ${values.join(', ')}
    `

    const result = await this.executeRun(query, params)
    return result.changes || 0
  }
}