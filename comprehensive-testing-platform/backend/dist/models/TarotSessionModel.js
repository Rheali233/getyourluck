/**
 * 塔罗牌会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class TarotSessionModel extends BaseModel {
    constructor(env) {
        super(env, "tarot_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO tarot_sessions (
          id, test_session_id, spread_type, cards_drawn,
          card_positions, interpretation_theme, question_category, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.spreadType, JSON.stringify(data.cardsDrawn), data.cardPositions ? JSON.stringify(data.cardPositions) : null, data.interpretationTheme || null, data.questionCategory || null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create tarot session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM tarot_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySpreadType(spreadType) {
        const results = await this.db
            .prepare("SELECT * FROM tarot_sessions WHERE spread_type = ? ORDER BY created_at DESC")
            .bind(spreadType)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async findByQuestionCategory(category) {
        const results = await this.db
            .prepare("SELECT * FROM tarot_sessions WHERE question_category = ? ORDER BY created_at DESC")
            .bind(category)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getSpreadTypeStats() {
        const results = await this.db
            .prepare(`
        SELECT spread_type, COUNT(*) as count 
        FROM tarot_sessions 
        GROUP BY spread_type
        ORDER BY count DESC
      `)
            .all();
        const stats = {};
        results.results.forEach((row) => {
            stats[row.spread_type] = row.count;
        });
        return stats;
    }
    async getPopularCards(limit = 10) {
        // 这需要更复杂的查询来分析JSON数组中的卡牌
        // 简化版本，实际实现可能需要更复杂的JSON查询
        const results = await this.db
            .prepare(`
        SELECT cards_drawn, COUNT(*) as session_count
        FROM tarot_sessions 
        GROUP BY cards_drawn
        ORDER BY session_count DESC
        LIMIT ?
      `)
            .bind(limit)
            .all();
        const cardCounts = {};
        results.results.forEach((row) => {
            try {
                const cards = JSON.parse(row.cards_drawn);
                cards.forEach(card => {
                    cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
                });
            }
            catch (error) {
                console.warn("Failed to parse cards_drawn JSON:", error);
            }
        });
        return Object.entries(cardCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([cardName, count]) => ({ cardName, count }));
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            spreadType: row.spread_type,
            cardsDrawn: JSON.parse(row.cards_drawn),
            cardPositions: row.card_positions ? JSON.parse(row.card_positions) : undefined,
            interpretationTheme: row.interpretation_theme || undefined,
            questionCategory: row.question_category || undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=TarotSessionModel.js.map