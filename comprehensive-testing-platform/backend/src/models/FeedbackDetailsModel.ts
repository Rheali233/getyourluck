/**
 * 详细反馈模型（结构化反馈）
 */
import { BaseModel } from './BaseModel'
import type { Env } from '../types/env'

export interface FeedbackDetailsRecord {
  id: string
  test_type: string
  test_id?: string | null
  result_id?: string | null
  session_id?: string | null
  rating: number
  category: string
  message: string
  email?: string | null
  can_contact: number
  screenshot_url?: string | null
  client_ua?: string | null
  client_platform?: string | null
  client_locale?: string | null
  ip_hash?: string | null
  created_at: string
}

export interface CreateFeedbackDetails {
  testType: string
  testId?: string
  resultId?: string
  sessionId?: string
  rating: number
  category: string
  message: string
  email?: string
  canContact: boolean
  screenshotUrl?: string
  images?: string[]
  client: {
    ua: string
    platform: string
    locale: string
  }
  ipHash?: string
}

export class FeedbackDetailsModel extends BaseModel {
  constructor(env: Env) {
    super(env, 'user_feedback_details')
  }

  async create(data: CreateFeedbackDetails): Promise<string> {
    const id = this.generateId()
    const now = this.formatTimestamp()
    const query = `
      INSERT INTO ${this.tableName} (
        id, test_type, test_id, result_id, session_id, rating, category, message,
        email, can_contact, screenshot_url, client_ua, client_platform, client_locale,
        ip_hash, created_at, images_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const params = [
      id,
      data.testType,
      data.testId || null,
      data.resultId || null,
      data.sessionId || null,
      data.rating,
      data.category,
      data.message,
      data.email || null,
      data.canContact ? 1 : 0,
      data.screenshotUrl || null,
      data.client.ua || null,
      data.client.platform || null,
      data.client.locale || 'en',
      data.ipHash || null,
      now,
      data.images ? JSON.stringify(data.images) : null,
    ]
    await this.executeRun(query, params)
    return id
  }
}


