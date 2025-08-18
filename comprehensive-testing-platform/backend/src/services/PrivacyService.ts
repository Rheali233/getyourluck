import { D1Database } from '@cloudflare/workers-types';

// 隐私保护配置
interface PrivacyConfig {
  enableDataAnonymization: boolean;
  enableGdprCompliance: boolean;
  enableDataRetention: boolean;
  dataRetentionDays: number;
  enableUserConsent: boolean;
  enableDataPortability: boolean;
  enableRightToBeForgotten: boolean;
}

// 默认隐私配置
const defaultPrivacyConfig: PrivacyConfig = {
  enableDataAnonymization: true,
  enableGdprCompliance: true,
  enableDataRetention: true,
  dataRetentionDays: 730, // 2年
  enableUserConsent: true,
  enableDataPortability: true,
  enableRightToBeForgotten: true
};

// 用户同意类型
export enum ConsentType {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  THIRD_PARTY = 'third_party'
}

// 用户同意状态
export interface UserConsent {
  sessionId: string;
  consentType: ConsentType;
  granted: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: string;
}

// 数据匿名化选项
export interface AnonymizationOptions {
  hashPersonalData: boolean;
  removeIdentifiers: boolean;
  aggregateData: boolean;
  pseudonymizeData: boolean;
}

export class PrivacyService {
  private db: D1Database;
  private config: PrivacyConfig;

  constructor(db: D1Database, config: Partial<PrivacyConfig> = {}) {
    this.db = db;
    this.config = { ...defaultPrivacyConfig, ...config };
  }

  /**
   * 记录用户同意
   */
  async recordUserConsent(consent: UserConsent): Promise<void> {
    try {
      await this.db.prepare(`
        INSERT OR REPLACE INTO user_consents (
          session_id, consent_type, granted, timestamp, ip_address, user_agent, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        consent.sessionId,
        consent.consentType,
        consent.granted ? 1 : 0,
        consent.timestamp,
        consent.ipAddress || null,
        consent.userAgent || null,
        consent.expiresAt || null
      ).run();
    } catch (error) {
      console.error('记录用户同意失败:', error);
      throw new Error('无法记录用户同意');
    }
  }

  /**
   * 获取用户同意状态
   */
  async getUserConsent(sessionId: string, consentType: ConsentType): Promise<boolean> {
    try {
      const result = await this.db.prepare(`
        SELECT granted FROM user_consents 
        WHERE session_id = ? AND consent_type = ? AND (expires_at IS NULL OR expires_at > ?)
        ORDER BY timestamp DESC LIMIT 1
      `).bind(sessionId, consentType, new Date().toISOString()).first<{ granted: number }>();

      return result ? Boolean(result.granted) : false;
    } catch (error) {
      console.error('获取用户同意状态失败:', error);
      return false;
    }
  }

  /**
   * 检查GDPR合规性
   */
  async checkGdprCompliance(sessionId: string): Promise<{
    compliant: boolean;
    missingConsents: ConsentType[];
    dataRetentionStatus: string;
  }> {
    try {
      const requiredConsents = [ConsentType.NECESSARY];
      const missingConsents: ConsentType[] = [];
      
      for (const consentType of requiredConsents) {
        const hasConsent = await this.getUserConsent(sessionId, consentType);
        if (!hasConsent) {
          missingConsents.push(consentType);
        }
      }

      const dataRetentionStatus = await this.checkDataRetention(sessionId);

      return {
        compliant: missingConsents.length === 0 && dataRetentionStatus === 'compliant',
        missingConsents,
        dataRetentionStatus
      };
    } catch (error) {
      console.error('检查GDPR合规性失败:', error);
      return {
        compliant: false,
        missingConsents: [ConsentType.NECESSARY],
        dataRetentionStatus: 'unknown'
      };
    }
  }

  /**
   * 检查数据保留状态
   */
  async checkDataRetention(sessionId: string): Promise<string> {
    try {
      const result = await this.db.prepare(`
        SELECT MIN(timestamp) as oldest_data FROM (
          SELECT timestamp FROM user_consents WHERE session_id = ?
          UNION ALL
          SELECT created_at as timestamp FROM user_preferences WHERE session_id = ?
          UNION ALL
          SELECT created_at as timestamp FROM search_history WHERE session_id = ?
        )
      `).bind(sessionId, sessionId, sessionId).first<{ oldest_data: string }>();

      if (!result?.oldest_data) {
        return 'no_data';
      }

      const oldestData = new Date(result.oldest_data);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetentionDays);

      if (oldestData < cutoffDate) {
        return 'expired';
      }

      return 'compliant';
    } catch (error) {
      console.error('检查数据保留状态失败:', error);
      return 'unknown';
    }
  }

  /**
   * 匿名化用户数据
   */
  async anonymizeUserData(sessionId: string, options: AnonymizationOptions = {}): Promise<void> {
    try {
      const defaultOptions: AnonymizationOptions = {
        hashPersonalData: true,
        removeIdentifiers: true,
        aggregateData: true,
        pseudonymizeData: true
      };

      const finalOptions = { ...defaultOptions, ...options };

      if (finalOptions.hashPersonalData) {
        await this.hashPersonalData(sessionId);
      }

      if (finalOptions.removeIdentifiers) {
        await this.removeIdentifiers(sessionId);
      }

      if (finalOptions.aggregateData) {
        await this.aggregateData(sessionId);
      }

      if (finalOptions.pseudonymizeData) {
        await this.pseudonymizeData(sessionId);
      }
    } catch (error) {
      console.error('匿名化用户数据失败:', error);
      throw new Error('无法匿名化用户数据');
    }
  }

  /**
   * 哈希个人数据
   */
  private async hashPersonalData(sessionId: string): Promise<void> {
    try {
      // 更新用户偏好设置，移除个人标识信息
      await this.db.prepare(`
        UPDATE user_preferences 
        SET language = 'anonymous', theme = 'default', 
            notification_settings = '{}', custom_preferences = '{}'
        WHERE session_id = ?
      `).bind(sessionId).run();

      // 更新搜索历史，移除个人标识
      await this.db.prepare(`
        UPDATE search_history 
        SET session_id = 'anonymous_' || substr(session_id, -8),
            user_agent = 'anonymous'
        WHERE session_id = ?
      `).bind(sessionId).run();
    } catch (error) {
      console.error('哈希个人数据失败:', error);
    }
  }

  /**
   * 移除标识符
   */
  private async removeIdentifiers(sessionId: string): Promise<void> {
    try {
      // 移除IP地址和用户代理信息
      await this.db.prepare(`
        UPDATE user_consents 
        SET ip_address = NULL, user_agent = NULL
        WHERE session_id = ?
      `).bind(sessionId).run();
    } catch (error) {
      console.error('移除标识符失败:', error);
    }
  }

  /**
   * 聚合数据
   */
  private async aggregateData(sessionId: string): Promise<void> {
    try {
      // 将个人数据聚合到匿名统计中
      const searchStats = await this.db.prepare(`
        SELECT COUNT(*) as search_count, 
               COUNT(DISTINCT query) as unique_queries
        FROM search_history 
        WHERE session_id = ?
      `).bind(sessionId).first<{ search_count: number; unique_queries: number }>();

      if (searchStats) {
        await this.db.prepare(`
          INSERT INTO anonymous_analytics (
            data_type, count_value, unique_count, created_at
          ) VALUES (?, ?, ?, ?)
        `).bind(
          'search_activity',
          searchStats.search_count,
          searchStats.unique_queries,
          new Date().toISOString()
        ).run();
      }
    } catch (error) {
      console.error('聚合数据失败:', error);
    }
  }

  /**
   * 伪匿名化数据
   */
  private async pseudonymizeData(sessionId: string): Promise<void> {
    try {
      // 生成伪匿名ID
      const pseudonymId = `pseudo_${sessionId.substring(0, 8)}_${Date.now()}`;
      
      // 更新相关表中的session_id
      await this.db.prepare(`
        UPDATE user_preferences SET session_id = ? WHERE session_id = ?
      `).bind(pseudonymId, sessionId).run();

      await this.db.prepare(`
        UPDATE user_consents SET session_id = ? WHERE session_id = ?
      `).bind(pseudonymId, sessionId).run();

      await this.db.prepare(`
        UPDATE search_history SET session_id = ? WHERE session_id = ?
      `).bind(pseudonymId, sessionId).run();
    } catch (error) {
      console.error('伪匿名化数据失败:', error);
    }
  }

  /**
   * 实现被遗忘权
   */
  async implementRightToBeForgotten(sessionId: string): Promise<void> {
    try {
      // 删除所有用户相关数据
      await this.db.prepare(`
        DELETE FROM user_preferences WHERE session_id = ?
      `).bind(sessionId).run();

      await this.db.prepare(`
        DELETE FROM user_consents WHERE session_id = ?
      `).bind(sessionId).run();

      await this.db.prepare(`
        DELETE FROM search_history WHERE session_id = ?
      `).bind(sessionId).run();

      // 记录删除操作
      await this.db.prepare(`
        INSERT INTO data_deletion_logs (
          session_id, deletion_type, deleted_at, reason
        ) VALUES (?, ?, ?, ?)
      `).bind(
        sessionId,
        'right_to_be_forgotten',
        new Date().toISOString(),
        'GDPR Article 17 - Right to erasure'
      ).run();
    } catch (error) {
      console.error('实现被遗忘权失败:', error);
      throw new Error('无法删除用户数据');
    }
  }

  /**
   * 数据可携带性
   */
  async exportUserData(sessionId: string): Promise<{
    userPreferences: any;
    consentHistory: any[];
    searchHistory: any[];
    exportTimestamp: string;
  }> {
    try {
      const userPreferences = await this.db.prepare(`
        SELECT * FROM user_preferences WHERE session_id = ?
      `).bind(sessionId).first();

      const consentHistory = await this.db.prepare(`
        SELECT * FROM user_consents WHERE session_id = ?
        ORDER BY timestamp DESC
      `).bind(sessionId).all<{
        session_id: string;
        consent_type: string;
        granted: number;
        timestamp: string;
        ip_address?: string;
        user_agent?: string;
        expires_at?: string;
      }>();

      const searchHistory = await this.db.prepare(`
        SELECT * FROM search_history WHERE session_id = ?
        ORDER BY created_at DESC
      `).bind(sessionId).all<{
        id: string;
        session_id: string;
        query: string;
        results_count: number;
        created_at: string;
        user_agent?: string;
      }>();

      return {
        userPreferences: userPreferences || {},
        consentHistory: consentHistory.results || [],
        searchHistory: searchHistory.results || [],
        exportTimestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('导出用户数据失败:', error);
      throw new Error('无法导出用户数据');
    }
  }

  /**
   * 清理过期数据
   */
  async cleanupExpiredData(): Promise<{
    deletedRecords: number;
    anonymizedRecords: number;
  }> {
    try {
      let deletedRecords = 0;
      let anonymizedRecords = 0;

      // 删除过期的同意记录
      const expiredConsents = await this.db.prepare(`
        DELETE FROM user_consents 
        WHERE expires_at IS NOT NULL AND expires_at < ?
      `).bind(new Date().toISOString()).run();
      deletedRecords += expiredConsents.changes || 0;

      // 匿名化过期的搜索历史
      const expiredSearches = await this.db.prepare(`
        SELECT session_id FROM search_history 
        WHERE created_at < ?
      `).bind(
        new Date(Date.now() - this.config.dataRetentionDays * 24 * 60 * 60 * 1000).toISOString()
      ).all<{ session_id: string }>();

      for (const search of expiredSearches.results || []) {
        await this.anonymizeUserData(search.session_id, {
          hashPersonalData: true,
          removeIdentifiers: true,
          aggregateData: true,
          pseudonymizeData: false
        });
        anonymizedRecords++;
      }

      return { deletedRecords, anonymizedRecords };
    } catch (error) {
      console.error('清理过期数据失败:', error);
      return { deletedRecords: 0, anonymizedRecords: 0 };
    }
  }

  /**
   * 获取隐私报告
   */
  async getPrivacyReport(sessionId: string): Promise<{
    dataRetentionStatus: string;
    gdprCompliance: boolean;
    dataTypes: string[];
    lastDataAccess: string;
    consentStatus: Record<ConsentType, boolean>;
  }> {
    try {
      const dataRetentionStatus = await this.checkDataRetention(sessionId);
      const gdprCompliance = await this.checkGdprCompliance(sessionId);
      
      const consentStatus: Record<ConsentType, boolean> = {
        [ConsentType.NECESSARY]: await this.getUserConsent(sessionId, ConsentType.NECESSARY),
        [ConsentType.ANALYTICS]: await this.getUserConsent(sessionId, ConsentType.ANALYTICS),
        [ConsentType.MARKETING]: await this.getUserConsent(sessionId, ConsentType.MARKETING),
        [ConsentType.THIRD_PARTY]: await this.getUserConsent(sessionId, ConsentType.THIRD_PARTY)
      };

      const lastDataAccess = await this.getLastDataAccess(sessionId);

      return {
        dataRetentionStatus,
        gdprCompliance: gdprCompliance.compliant,
        dataTypes: ['preferences', 'consents', 'search_history'],
        lastDataAccess,
        consentStatus
      };
    } catch (error) {
      console.error('获取隐私报告失败:', error);
      throw new Error('无法获取隐私报告');
    }
  }

  /**
   * 获取最后数据访问时间
   */
  private async getLastDataAccess(sessionId: string): Promise<string> {
    try {
      const result = await this.db.prepare(`
        SELECT MAX(last_access) as last_access FROM (
          SELECT updated_at as last_access FROM user_preferences WHERE session_id = ?
          UNION ALL
          SELECT timestamp as last_access FROM user_consents WHERE session_id = ?
          UNION ALL
          SELECT created_at as last_access FROM search_history WHERE session_id = ?
        )
      `).bind(sessionId, sessionId, sessionId).first<{ last_access: string }>();

      return result?.last_access || new Date().toISOString();
    } catch (error) {
      console.error('获取最后数据访问时间失败:', error);
      return new Date().toISOString();
    }
  }
}
