/**
 * 学习能力会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class LearningSessionModel extends BaseModel {
    constructor(env) {
        super(env, "learning_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO learning_sessions (
          id, test_session_id, test_subtype, learning_style,
          cognitive_score, percentile_rank, learning_preferences,
          strategy_recommendations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.testSubtype, data.learningStyle || null, data.cognitiveScore || null, data.percentileRank || null, data.learningPreferences ? JSON.stringify(data.learningPreferences) : null, data.strategyRecommendations ? JSON.stringify(data.strategyRecommendations) : null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create learning session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM learning_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySubtype(subtype) {
        const results = await this.db
            .prepare("SELECT * FROM learning_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
            .bind(subtype)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getLearningStyleDistribution() {
        const results = await this.db
            .prepare(`
        SELECT learning_style, COUNT(*) as count 
        FROM learning_sessions 
        WHERE learning_style IS NOT NULL
        GROUP BY learning_style
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.learning_style] = row.count;
        });
        return distribution;
    }
    async getCognitiveScoreStats() {
        const results = await this.db
            .prepare(`
        SELECT 
          AVG(cognitive_score) as avg_score,
          MIN(cognitive_score) as min_score,
          MAX(cognitive_score) as max_score,
          COUNT(*) as count
        FROM learning_sessions 
        WHERE cognitive_score IS NOT NULL
      `)
            .first();
        // 获取中位数需要额外查询
        const medianResult = await this.db
            .prepare(`
        SELECT cognitive_score
        FROM learning_sessions 
        WHERE cognitive_score IS NOT NULL
        ORDER BY cognitive_score
        LIMIT 1 OFFSET (
          SELECT (COUNT(*) - 1) / 2 
          FROM learning_sessions 
          WHERE cognitive_score IS NOT NULL
        )
      `)
            .first();
        return {
            average: Math.round((results?.avg_score || 0) * 100) / 100,
            median: medianResult?.cognitive_score || 0,
            min: results?.min_score || 0,
            max: results?.max_score || 0,
            count: results?.count || 0,
        };
    }
    async getPercentileDistribution() {
        const results = await this.db
            .prepare(`
        SELECT 
          CASE 
            WHEN percentile_rank >= 90 THEN '90-100'
            WHEN percentile_rank >= 75 THEN '75-89'
            WHEN percentile_rank >= 50 THEN '50-74'
            WHEN percentile_rank >= 25 THEN '25-49'
            ELSE '0-24'
          END as percentile_range,
          COUNT(*) as count
        FROM learning_sessions 
        WHERE percentile_rank IS NOT NULL
        GROUP BY percentile_range
        ORDER BY percentile_range DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.percentile_range] = row.count;
        });
        return distribution;
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            testSubtype: row.test_subtype,
            learningStyle: row.learning_style || undefined,
            cognitiveScore: row.cognitive_score || undefined,
            percentileRank: row.percentile_rank || undefined,
            learningPreferences: row.learning_preferences ? JSON.parse(row.learning_preferences) : undefined,
            strategyRecommendations: row.strategy_recommendations ? JSON.parse(row.strategy_recommendations) : undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=LearningSessionModel.js.map