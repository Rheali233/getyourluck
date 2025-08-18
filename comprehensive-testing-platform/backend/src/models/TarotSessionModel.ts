/**
 * 塔罗牌会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface TarotCard {
  id: string;
  name: string;
  suit?: string;
  number?: number;
  isReversed: boolean;
  meaning: string;
  reversedMeaning?: string;
}

export interface TarotSessionData {
  id: string;
  testSessionId: string;
  spreadType: "single" | "three_card" | "celtic_cross" | "relationship" | "career";
  cardsDrawn: TarotCard[];
  cardPositions?: Record<string, any>;
  interpretationTheme?: string;
  questionCategory?: "love" | "career" | "finance" | "health" | "spiritual" | "general";
  createdAt: Date;
}

export interface CreateTarotSessionData {
  testSessionId: string;
  spreadType: "single" | "three_card" | "celtic_cross" | "relationship" | "career";
  cardsDrawn: TarotCard[];
  cardPositions?: Record<string, any>;
  interpretationTheme?: string;
  questionCategory?: "love" | "career" | "finance" | "health" | "spiritual" | "general";
}

export class TarotSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "tarot_sessions");
  }

  async create(data: CreateTarotSessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO tarot_sessions (
          id, test_session_id, spread_type, cards_drawn,
          card_positions, interpretation_theme, question_category, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.spreadType,
        JSON.stringify(data.cardsDrawn),
        data.cardPositions ? JSON.stringify(data.cardPositions) : null,
        data.interpretationTheme || null,
        data.questionCategory || null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create tarot session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<TarotSessionData | null> {
    const result = await this.db
      .prepare("SELECT * FROM tarot_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySpreadType(spreadType: string): Promise<TarotSessionData[]> {
    const results = await this.db
      .prepare("SELECT * FROM tarot_sessions WHERE spread_type = ? ORDER BY created_at DESC")
      .bind(spreadType)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async findByQuestionCategory(category: string): Promise<TarotSessionData[]> {
    const results = await this.db
      .prepare("SELECT * FROM tarot_sessions WHERE question_category = ? ORDER BY created_at DESC")
      .bind(category)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getSpreadTypeStats(): Promise<Record<string, number>> {
    const results = await this.db
      .prepare(`
        SELECT spread_type, COUNT(*) as count 
        FROM tarot_sessions 
        GROUP BY spread_type
        ORDER BY count DESC
      `)
      .all();

    const stats: Record<string, number> = {};
    results.results.forEach((row: any) => {
      stats[row.spread_type] = row.count;
    });

    return stats;
  }

  async getPopularCards(limit: number = 10): Promise<Array<{ cardName: string; count: number }>> {
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

    const cardCounts: Record<string, number> = {};
    
    results.results.forEach((row: any) => {
      try {
        const cards = JSON.parse(row.cards_drawn as string) as TarotCard[];
        cards.forEach(card => {
          cardCounts[card.name] = (cardCounts[card.name] || 0) + 1;
        });
      } catch (error) {
        console.warn("Failed to parse cards_drawn JSON:", error);
      }
    });

    return Object.entries(cardCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([cardName, count]) => ({ cardName, count }));
  }

  private mapToData(row: any): TarotSessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      spreadType: row.spread_type as "single" | "three_card" | "celtic_cross" | "relationship" | "career",
      cardsDrawn: JSON.parse(row.cards_drawn as string) as TarotCard[],
      cardPositions: row.card_positions ? JSON.parse(row.card_positions as string) : undefined,
      interpretationTheme: (row.interpretation_theme as string) ?? "",
      questionCategory: (row.question_category as "love" | "career" | "finance" | "health" | "spiritual" | "general") ?? "general",
      createdAt: new Date(row.created_at as string),
    };
  }
}