/**
 * 用户偏好设置数据模型
 * 遵循统一开发标准的Cookies管理实现
 */

import { BaseModel } from './BaseModel';


export interface UserPreferencesData {
  id: string;
  sessionId?: string;
  language: string;
  theme: string;
  cookiesConsent: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  notificationEnabled: boolean;
  searchHistoryEnabled: boolean;
  personalizedContent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CookiesConsentData {
  sessionId?: string;
  cookiesConsent: boolean;
  analyticsConsent: boolean;
  marketingConsent: boolean;
  timestamp: Date;
}

export class UserPreferencesModel extends BaseModel {
  constructor(env: any) {
    super(env, 'user_preferences');
  }

  /**
   * 创建或更新用户偏好设置
   */
  async upsertPreferences(preferences: Omit<UserPreferencesData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const id = crypto.randomUUID();
      
      await this.safeDB
        .prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, language, theme, cookies_consent, analytics_consent,
            marketing_consent, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
        .bind(
          id,
          preferences.sessionId || null,
          preferences.language,
          preferences.theme,
          preferences.cookiesConsent ? 1 : 0,
          preferences.analyticsConsent ? 1 : 0,
          preferences.marketingConsent ? 1 : 0,
          preferences.notificationEnabled ? 1 : 0,
          preferences.searchHistoryEnabled ? 1 : 0,
          preferences.personalizedContent ? 1 : 0
        )
        .run();

      return id;
    } catch (error) {
      throw new Error('Failed to create user preferences');
    }
  }

  /**
   * 根据会话ID获取用户偏好设置
   */
  async getPreferencesBySessionId(sessionId: string): Promise<UserPreferencesData | null> {
    try {
      const result = await this.safeDB
        .prepare('SELECT * FROM user_preferences WHERE session_id = ?')
        .bind(sessionId)
        .first();

      return result ? this.mapDatabaseRowToPreferences(result) : null;
    } catch (error) {
      throw new Error('Failed to load user preferences');
    }
  }

  /**
   * 更新Cookies同意状态
   */
  async updateCookiesConsent(sessionId: string, consent: CookiesConsentData): Promise<void> {
    try {
      // 首先检查会话是否存在，如果不存在则创建
      const existingSession = await this.safeDB
        .prepare('SELECT id FROM test_sessions WHERE id = ?')
        .bind(sessionId)
        .first();
      
      if (!existingSession) {
        // 创建测试会话记录
        await this.safeDB
          .prepare(`
            INSERT INTO test_sessions (
              id, test_type, status, started_at, completed_at, 
              user_agent, ip_address, created_at, updated_at
            ) VALUES (
              ?, 'cookies_consent', 'completed', 
              CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
              '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
          `)
          .bind(sessionId)
          .run();
      }

      // 更新或插入用户偏好设置
      await this.safeDB
        .prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, cookies_consent, analytics_consent, marketing_consent, 
            language, theme, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, 'en-US', 'auto', 1, 1, 1, 
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `)
        .bind(
          crypto.randomUUID(),
          sessionId,
          consent.cookiesConsent ? 1 : 0,
          consent.analyticsConsent ? 1 : 0,
          consent.marketingConsent ? 1 : 0
        )
        .run();
    } catch (error) {
      console.error('[UserPreferencesModel] Failed to update cookies consent:', error);
      const errorMessage = error instanceof Error 
        ? `Failed to update cookie consent status: ${error.message}`
        : 'Failed to update cookie consent status';
      throw new Error(errorMessage);
    }
  }

  /**
   * 获取Cookies同意统计
   */
  async getCookiesConsentStats(): Promise<{
    totalUsers: number;
    cookiesConsent: number;
    analyticsConsent: number;
    marketingConsent: number;
    consentRate: number;
  }> {
    try {
      const result = await this.safeDB
        .prepare(`
          SELECT 
            COUNT(*) as total_users,
            SUM(cookies_consent) as cookies_consent,
            SUM(analytics_consent) as analytics_consent,
            SUM(marketing_consent) as marketing_consent
          FROM user_preferences
        `)
        .first();

      if (!result) {
        return {
          totalUsers: 0,
          cookiesConsent: 0,
          analyticsConsent: 0,
          marketingConsent: 0,
          consentRate: 0,
        };
      }

      const totalUsers = result['total_users'] as number;
      const cookiesConsent = result['cookies_consent'] as number || 0;
      const analyticsConsent = result['analytics_consent'] as number || 0;
      const marketingConsent = result['marketing_consent'] as number || 0;

      return {
        totalUsers,
        cookiesConsent,
        analyticsConsent,
        marketingConsent,
        consentRate: totalUsers > 0 ? (cookiesConsent / totalUsers) * 100 : 0,
      };
    } catch (error) {
      throw new Error('Failed to retrieve cookie consent statistics');
    }
  }

  /**
   * 清理过期的用户偏好设置
   */
  async cleanupExpiredPreferences(daysOld: number = 365): Promise<number> {
    try {
      const result = await this.safeDB
        .prepare(`
          DELETE FROM user_preferences 
          WHERE updated_at < datetime('now', '-${daysOld} days')
            AND session_id IS NOT NULL
        `)
        .run();

      return result.meta.changes || 0;
    } catch (error) {
      throw new Error('Failed to clean up expired user preferences');
    }
  }

  /**
   * 获取用户偏好设置列表
   */
  async getPreferencesList(limit: number = 100, offset: number = 0): Promise<UserPreferencesData[]> {
    try {
      const result = await this.safeDB
        .prepare(`
          SELECT * FROM user_preferences 
          ORDER BY updated_at DESC 
          LIMIT ? OFFSET ?
        `)
        .bind(limit, offset)
        .all();

      return result.results?.map(this.mapDatabaseRowToPreferences) || [];
    } catch (error) {
      throw new Error('Failed to retrieve user preferences list');
    }
  }

  /**
   * 删除用户偏好设置
   */
  async deletePreferences(id: string): Promise<void> {
    try {
      await this.safeDB
        .prepare('DELETE FROM user_preferences WHERE id = ?')
        .bind(id)
        .run();
    } catch (error) {
      throw new Error('Failed to delete user preferences');
    }
  }

  /**
   * 将数据库行映射为UserPreferencesData对象
   */
  private mapDatabaseRowToPreferences(row: any): UserPreferencesData {
    return {
      id: row.id as string,
      sessionId: row.session_id as string,
      language: row.language as string,
      theme: row.theme as string,
      cookiesConsent: Boolean(row.cookies_consent),
      analyticsConsent: Boolean(row.analytics_consent),
      marketingConsent: Boolean(row.marketing_consent),
      notificationEnabled: Boolean(row.notification_enabled),
      searchHistoryEnabled: Boolean(row.search_history_enabled),
      personalizedContent: Boolean(row.personalized_content),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
