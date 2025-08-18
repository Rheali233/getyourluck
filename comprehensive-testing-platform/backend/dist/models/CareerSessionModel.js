/**
 * 职业发展会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class CareerSessionModel extends BaseModel {
    constructor(env) {
        super(env, "career_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO career_sessions (
          id, test_session_id, test_subtype, holland_code,
          interest_scores, values_ranking, skills_profile,
          career_matches, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.testSubtype, data.hollandCode || null, data.interestScores ? JSON.stringify(data.interestScores) : null, data.valuesRanking ? JSON.stringify(data.valuesRanking) : null, data.skillsProfile ? JSON.stringify(data.skillsProfile) : null, data.careerMatches ? JSON.stringify(data.careerMatches) : null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create career session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM career_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySubtype(subtype) {
        const results = await this.db
            .prepare("SELECT * FROM career_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
            .bind(subtype)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getHollandCodeDistribution() {
        const results = await this.db
            .prepare(`
        SELECT holland_code, COUNT(*) as count 
        FROM career_sessions 
        WHERE holland_code IS NOT NULL
        GROUP BY holland_code
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.holland_code] = row.count;
        });
        return distribution;
    }
    async getPopularCareers(limit = 20) {
        const results = await this.db
            .prepare("SELECT career_matches FROM career_sessions WHERE career_matches IS NOT NULL")
            .all();
        const careerCounts = {};
        results.results.forEach((row) => {
            try {
                const matches = JSON.parse(row.career_matches);
                matches.forEach(match => {
                    careerCounts[match.title] = (careerCounts[match.title] || 0) + 1;
                });
            }
            catch (error) {
                console.warn("Failed to parse career_matches JSON:", error);
            }
        });
        return Object.entries(careerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([title, count]) => ({ title, count }));
    }
    async getAverageInterestScores() {
        const results = await this.db
            .prepare("SELECT interest_scores FROM career_sessions WHERE interest_scores IS NOT NULL")
            .all();
        const scoreTotals = {};
        results.results.forEach((row) => {
            try {
                const scores = JSON.parse(row.interest_scores);
                Object.entries(scores).forEach(([interest, score]) => {
                    if (!scoreTotals[interest]) {
                        scoreTotals[interest] = { sum: 0, count: 0 };
                    }
                    scoreTotals[interest].sum += score;
                    scoreTotals[interest].count += 1;
                });
            }
            catch (error) {
                console.warn("Failed to parse interest_scores JSON:", error);
            }
        });
        const averages = {};
        Object.entries(scoreTotals).forEach(([interest, { sum, count }]) => {
            averages[interest] = Math.round((sum / count) * 100) / 100;
        });
        return averages;
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            testSubtype: row.test_subtype,
            hollandCode: row.holland_code || undefined,
            interestScores: row.interest_scores ? JSON.parse(row.interest_scores) : undefined,
            valuesRanking: row.values_ranking ? JSON.parse(row.values_ranking) : undefined,
            skillsProfile: row.skills_profile ? JSON.parse(row.skills_profile) : undefined,
            careerMatches: row.career_matches ? JSON.parse(row.career_matches) : undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=CareerSessionModel.js.map