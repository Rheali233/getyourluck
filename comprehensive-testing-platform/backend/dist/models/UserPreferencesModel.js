/**
 * 用户偏好设置数据模型
 * 遵循统一开发标准的Cookies管理实现
 */
import { BaseModel } from './BaseModel';
export class UserPreferencesModel extends BaseModel {
    constructor(db) {
        super(db);
    }
    /**
     * 创建或更新用户偏好设置
     */
    async upsertPreferences(preferences) {
        try {
            const id = crypto.randomUUID();
            await this.db
                .prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, language, theme, cookies_consent, analytics_consent,
            marketing_consent, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `)
                .bind(id, preferences.sessionId || null, preferences.language, preferences.theme, preferences.cookiesConsent ? 1 : 0, preferences.analyticsConsent ? 1 : 0, preferences.marketingConsent ? 1 : 0, preferences.notificationEnabled ? 1 : 0, preferences.searchHistoryEnabled ? 1 : 0, preferences.personalizedContent ? 1 : 0)
                .run();
            return id;
        }
        catch (error) {
            console.error('创建用户偏好设置失败:', error);
            throw new Error('创建用户偏好设置失败');
        }
    }
    /**
     * 根据会话ID获取用户偏好设置
     */
    async getPreferencesBySessionId(sessionId) {
        try {
            const result = await this.db
                .prepare('SELECT * FROM user_preferences WHERE session_id = ?')
                .bind(sessionId)
                .first();
            return result ? this.mapDatabaseRowToPreferences(result) : null;
        }
        catch (error) {
            console.error(`获取会话${sessionId}的用户偏好设置失败:`, error);
            throw new Error('获取用户偏好设置失败');
        }
    }
    /**
     * 更新Cookies同意状态
     */
    async updateCookiesConsent(sessionId, consent) {
        try {
            await this.db
                .prepare(`
          INSERT OR REPLACE INTO user_preferences (
            id, session_id, cookies_consent, analytics_consent, marketing_consent, 
            language, theme, notification_enabled, search_history_enabled, 
            personalized_content, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, 'zh-CN', 'auto', 1, 1, 1, 
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `)
                .bind(crypto.randomUUID(), sessionId, consent.cookiesConsent ? 1 : 0, consent.analyticsConsent ? 1 : 0, consent.marketingConsent ? 1 : 0)
                .run();
        }
        catch (error) {
            console.error(`更新会话${sessionId}的Cookies同意状态失败:`, error);
            throw new Error('更新Cookies同意状态失败');
        }
    }
    /**
     * 获取Cookies同意统计
     */
    async getCookiesConsentStats() {
        try {
            const result = await this.db
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
            const totalUsers = result.total_users;
            const cookiesConsent = result.cookies_consent || 0;
            const analyticsConsent = result.analytics_consent || 0;
            const marketingConsent = result.marketing_consent || 0;
            return {
                totalUsers,
                cookiesConsent,
                analyticsConsent,
                marketingConsent,
                consentRate: totalUsers > 0 ? (cookiesConsent / totalUsers) * 100 : 0,
            };
        }
        catch (error) {
            console.error('获取Cookies同意统计失败:', error);
            throw new Error('获取Cookies同意统计失败');
        }
    }
    /**
     * 清理过期的用户偏好设置
     */
    async cleanupExpiredPreferences(daysOld = 365) {
        try {
            const result = await this.db
                .prepare(`
          DELETE FROM user_preferences 
          WHERE updated_at < datetime('now', '-${daysOld} days')
            AND session_id IS NOT NULL
        `)
                .run();
            return result.meta.changes || 0;
        }
        catch (error) {
            console.error('清理过期用户偏好设置失败:', error);
            throw new Error('清理过期用户偏好设置失败');
        }
    }
    /**
     * 获取用户偏好设置列表
     */
    async getPreferencesList(limit = 100, offset = 0) {
        try {
            const result = await this.db
                .prepare(`
          SELECT * FROM user_preferences 
          ORDER BY updated_at DESC 
          LIMIT ? OFFSET ?
        `)
                .bind(limit, offset)
                .all();
            return result.results?.map(this.mapDatabaseRowToPreferences) || [];
        }
        catch (error) {
            console.error('获取用户偏好设置列表失败:', error);
            throw new Error('获取用户偏好设置列表失败');
        }
    }
    /**
     * 删除用户偏好设置
     */
    async deletePreferences(id) {
        try {
            await this.db
                .prepare('DELETE FROM user_preferences WHERE id = ?')
                .bind(id)
                .run();
        }
        catch (error) {
            console.error(`删除用户偏好设置${id}失败:`, error);
            throw new Error('删除用户偏好设置失败');
        }
    }
    /**
     * 将数据库行映射为UserPreferencesData对象
     */
    mapDatabaseRowToPreferences(row) {
        return {
            id: row.id,
            sessionId: row.session_id,
            language: row.language,
            theme: row.theme,
            cookiesConsent: Boolean(row.cookies_consent),
            analyticsConsent: Boolean(row.analytics_consent),
            marketingConsent: Boolean(row.marketing_consent),
            notificationEnabled: Boolean(row.notification_enabled),
            searchHistoryEnabled: Boolean(row.search_history_enabled),
            personalizedContent: Boolean(row.personalized_content),
            createdAt: new Date(row.created_at),
            updatedAt: new Date(row.updated_at),
        };
    }
}
//# sourceMappingURL=UserPreferencesModel.js.map