/**
 * 心理测试会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class PsychologySessionModel extends BaseModel {
    constructor(env) {
        super(env, "psychology_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO psychology_sessions (
          id, test_session_id, test_subtype, personality_type,
          dimension_scores, risk_level, happiness_domains, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.testSubtype, data.personalityType || null, data.dimensionScores ? JSON.stringify(data.dimensionScores) : null, data.riskLevel || null, data.happinessDomains ? JSON.stringify(data.happinessDomains) : null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create psychology session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM psychology_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySubtype(subtype) {
        const results = await this.db
            .prepare("SELECT * FROM psychology_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
            .bind(subtype)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getStatsBySubtype(subtype) {
        const totalResult = await this.db
            .prepare("SELECT COUNT(*) as total FROM psychology_sessions WHERE test_subtype = ?")
            .bind(subtype)
            .first();
        const stats = {
            totalSessions: totalResult?.total || 0,
        };
        if (subtype === "mbti") {
            const typeDistribution = await this.db
                .prepare(`
          SELECT personality_type, COUNT(*) as count 
          FROM psychology_sessions 
          WHERE test_subtype = ? AND personality_type IS NOT NULL
          GROUP BY personality_type
        `)
                .bind(subtype)
                .all();
            const distribution = {};
            typeDistribution.results.forEach((row) => {
                distribution[row.personality_type] = row.count;
            });
            return { ...stats, personalityTypeDistribution: distribution };
        }
        return stats;
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            testSubtype: row.test_subtype,
            personalityType: row.personality_type || undefined,
            dimensionScores: row.dimension_scores ? JSON.parse(row.dimension_scores) : undefined,
            riskLevel: row.risk_level || undefined,
            happinessDomains: row.happiness_domains ? JSON.parse(row.happiness_domains) : undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=PsychologySessionModel.js.map