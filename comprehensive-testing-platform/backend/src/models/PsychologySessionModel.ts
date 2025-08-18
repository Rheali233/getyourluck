/**
 * 心理测试会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface PsychologySessionData {
  id: string;
  testSessionId: string;
  testSubtype: "mbti" | "big_five" | "phq9" | "happiness";
  personalityType?: string;
  dimensionScores?: Record<string, number>;
  riskLevel?: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
  happinessDomains?: Record<string, number>;
  createdAt: Date;
}

export interface CreatePsychologySessionData {
  testSessionId: string;
  testSubtype: "mbti" | "big_five" | "phq9" | "happiness";
  personalityType?: string;
  dimensionScores?: Record<string, number>;
  riskLevel?: "minimal" | "mild" | "moderate" | "moderately_severe" | "severe";
  happinessDomains?: Record<string, number>;
}

export class PsychologySessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "psychology_sessions");
  }

  async create(data: CreatePsychologySessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO psychology_sessions (
          id, test_session_id, test_subtype, personality_type,
          dimension_scores, risk_level, happiness_domains, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.testSubtype,
        data.personalityType || null,
        data.dimensionScores ? JSON.stringify(data.dimensionScores) : null,
        data.riskLevel || null,
        data.happinessDomains ? JSON.stringify(data.happinessDomains) : null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create psychology session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<PsychologySessionData | null> {
    const result = await this.db
      .prepare("SELECT * FROM psychology_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySubtype(subtype: string): Promise<PsychologySessionData[]> {
    const results = await this.db
      .prepare("SELECT * FROM psychology_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
      .bind(subtype)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getStatsBySubtype(subtype: string): Promise<{
    totalSessions: number;
    averageScores?: Record<string, number>;
    personalityTypeDistribution?: Record<string, number>;
  }> {
    const totalResult = await this.db
      .prepare("SELECT COUNT(*) as total FROM psychology_sessions WHERE test_subtype = ?")
      .bind(subtype)
      .first();

    const stats = {
      totalSessions: (totalResult?.total as number) || 0,
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

      const distribution: Record<string, number> = {};
      typeDistribution.results.forEach((row: any) => {
        distribution[row.personality_type] = row.count;
      });

      return { ...stats, personalityTypeDistribution: distribution };
    }

    return stats;
  }

  private mapToData(row: any): PsychologySessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      testSubtype: row.test_subtype as "mbti" | "big_five" | "phq9" | "happiness",
      personalityType: row.personality_type as string || undefined,
      dimensionScores: row.dimension_scores ? JSON.parse(row.dimension_scores as string) : undefined,
      riskLevel: row.risk_level as "minimal" | "mild" | "moderate" | "moderately_severe" | "severe" || undefined,
      happinessDomains: row.happiness_domains ? JSON.parse(row.happiness_domains as string) : undefined,
      createdAt: new Date(row.created_at as string),
    };
  }
}