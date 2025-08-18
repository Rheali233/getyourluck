/**
 * 情感关系会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class RelationshipSessionModel extends BaseModel {
    constructor(env) {
        super(env, "relationship_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO relationship_sessions (
          id, test_session_id, test_subtype, primary_love_language,
          secondary_love_language, attachment_style, relationship_skills,
          communication_style, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.testSubtype, data.primaryLoveLanguage || null, data.secondaryLoveLanguage || null, data.attachmentStyle || null, data.relationshipSkills ? JSON.stringify(data.relationshipSkills) : null, data.communicationStyle || null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create relationship session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM relationship_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySubtype(subtype) {
        const results = await this.db
            .prepare("SELECT * FROM relationship_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
            .bind(subtype)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getLoveLanguageDistribution() {
        const results = await this.db
            .prepare(`
        SELECT primary_love_language, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL
        GROUP BY primary_love_language
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.primary_love_language] = row.count;
        });
        return distribution;
    }
    async getAttachmentStyleDistribution() {
        const results = await this.db
            .prepare(`
        SELECT attachment_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE attachment_style IS NOT NULL
        GROUP BY attachment_style
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.attachment_style] = row.count;
        });
        return distribution;
    }
    async getCommunicationStyleDistribution() {
        const results = await this.db
            .prepare(`
        SELECT communication_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE communication_style IS NOT NULL
        GROUP BY communication_style
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.communication_style] = row.count;
        });
        return distribution;
    }
    async getAverageRelationshipSkills() {
        const results = await this.db
            .prepare("SELECT relationship_skills FROM relationship_sessions WHERE relationship_skills IS NOT NULL")
            .all();
        const skillTotals = {};
        results.results.forEach((row) => {
            try {
                const skills = JSON.parse(row.relationship_skills);
                Object.entries(skills).forEach(([skill, score]) => {
                    if (!skillTotals[skill]) {
                        skillTotals[skill] = { sum: 0, count: 0 };
                    }
                    skillTotals[skill].sum += score;
                    skillTotals[skill].count += 1;
                });
            }
            catch (error) {
                console.warn("Failed to parse relationship_skills JSON:", error);
            }
        });
        const averages = {};
        Object.entries(skillTotals).forEach(([skill, { sum, count }]) => {
            averages[skill] = Math.round((sum / count) * 100) / 100;
        });
        return averages;
    }
    async findCompatiblePairs() {
        const results = await this.db
            .prepare(`
        SELECT 
          primary_love_language,
          attachment_style,
          COUNT(*) as count
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL 
          AND attachment_style IS NOT NULL
        GROUP BY primary_love_language, attachment_style
        ORDER BY count DESC
        LIMIT 10
      `)
            .all();
        return results.results.map((row) => ({
            loveLanguage: row.primary_love_language,
            attachmentStyle: row.attachment_style,
            count: row.count,
        }));
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            testSubtype: row.test_subtype,
            primaryLoveLanguage: row.primary_love_language || undefined,
            secondaryLoveLanguage: row.secondary_love_language || undefined,
            attachmentStyle: row.attachment_style || undefined,
            relationshipSkills: row.relationship_skills ? JSON.parse(row.relationship_skills) : undefined,
            communicationStyle: row.communication_style || undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=RelationshipSessionModel.js.map