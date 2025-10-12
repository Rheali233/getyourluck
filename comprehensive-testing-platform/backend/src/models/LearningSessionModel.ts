/**
 * 学习能力会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface LearningSessionData {
  id: string;
  testSessionId: string;
  testSubtype: "vark" | "learning_strategies";
  learningStyle?: "visual" | "auditory" | "reading" | "kinesthetic" | "multimodal";
  cognitiveScore?: number;
  percentileRank?: number;
  learningPreferences?: Record<string, number>;
  strategyRecommendations?: string[];
  createdAt: Date;
}

export interface CreateLearningSessionData {
  testSessionId: string;
  testSubtype: "vark" | "learning_strategies";
  learningStyle?: "visual" | "auditory" | "reading" | "kinesthetic" | "multimodal";
  cognitiveScore?: number;
  percentileRank?: number;
  learningPreferences?: Record<string, number>;
  strategyRecommendations?: string[];
}

export class LearningSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "learning_sessions");
  }

  async create(data: CreateLearningSessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
      .prepare(`
        INSERT INTO learning_sessions (
          id, test_session_id, test_subtype, learning_style,
          cognitive_score, percentile_rank, learning_preferences,
          strategy_recommendations, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.testSubtype,
        data.learningStyle || null,
        data.cognitiveScore || null,
        data.percentileRank || null,
        data.learningPreferences ? JSON.stringify(data.learningPreferences) : null,
        data.strategyRecommendations ? JSON.stringify(data.strategyRecommendations) : null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create learning session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<LearningSessionData | null> {
    const result = await this.safeDB
      .prepare("SELECT * FROM learning_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySubtype(subtype: string): Promise<LearningSessionData[]> {
    const results = await this.safeDB
      .prepare("SELECT * FROM learning_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
      .bind(subtype)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getLearningStyleDistribution(): Promise<Record<string, number>> {
    const results = await this.safeDB
      .prepare(`
        SELECT learning_style, COUNT(*) as count 
        FROM learning_sessions 
        WHERE learning_style IS NOT NULL
        GROUP BY learning_style
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.learning_style] = row.count;
    });

    return distribution;
  }

  async getCognitiveScoreStats(): Promise<{
    average: number;
    median: number;
    min: number;
    max: number;
    count: number;
  }> {
    const results = await this.safeDB
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
    const medianResult = await this.safeDB
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
              average: Math.round((results?.['avg_score'] as number || 0) * 100) / 100,
        median: medianResult?.['cognitive_score'] as number || 0,
        min: results?.['min_score'] as number || 0,
        max: results?.['max_score'] as number || 0,
        count: results?.['count'] as number || 0,
    };
  }

  async getPercentileDistribution(): Promise<Record<string, number>> {
    const results = await this.safeDB
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

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.percentile_range] = row.count;
    });

    return distribution;
  }

  private mapToData(row: any): LearningSessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      testSubtype: row.test_subtype as "vark" | "learning_strategies",
      learningStyle: (row.learning_style as "visual" | "auditory" | "reading" | "kinesthetic" | "multimodal") ?? "visual",
      cognitiveScore: (row.cognitive_score as number) ?? 0,
      percentileRank: (row.percentile_rank as number) ?? 0,
      learningPreferences: row.learning_preferences ? JSON.parse(row.learning_preferences as string) : undefined,
      strategyRecommendations: row.strategy_recommendations ? JSON.parse(row.strategy_recommendations as string) : undefined,
      createdAt: new Date(row.created_at as string),
    };
  }
}