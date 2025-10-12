/**
 * 职业发展会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface CareerSessionData {
  id: string;
  testSessionId: string;
  testSubtype: "holland" | "career_values" | "skills_assessment";
  hollandCode?: string;
  interestScores?: Record<string, number>;
  valuesRanking?: string[];
  skillsProfile?: Record<string, number>;
  careerMatches?: Array<{
    title: string;
    matchScore: number;
    description: string;
    requirements: string[];
  }>;
  createdAt: Date;
}

export interface CreateCareerSessionData {
  testSessionId: string;
  testSubtype: "holland" | "career_values" | "skills_assessment";
  hollandCode?: string;
  interestScores?: Record<string, number>;
  valuesRanking?: string[];
  skillsProfile?: Record<string, number>;
  careerMatches?: Array<{
    title: string;
    matchScore: number;
    description: string;
    requirements: string[];
  }>;
}

export class CareerSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "career_sessions");
  }

  async create(data: CreateCareerSessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
      .prepare(`
        INSERT INTO career_sessions (
          id, test_session_id, test_subtype, holland_code,
          interest_scores, values_ranking, skills_profile,
          career_matches, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.testSubtype,
        data.hollandCode || null,
        data.interestScores ? JSON.stringify(data.interestScores) : null,
        data.valuesRanking ? JSON.stringify(data.valuesRanking) : null,
        data.skillsProfile ? JSON.stringify(data.skillsProfile) : null,
        data.careerMatches ? JSON.stringify(data.careerMatches) : null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create career session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<CareerSessionData | null> {
    const result = await this.safeDB
      .prepare("SELECT * FROM career_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySubtype(subtype: string): Promise<CareerSessionData[]> {
    const results = await this.safeDB
      .prepare("SELECT * FROM career_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
      .bind(subtype)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getHollandCodeDistribution(): Promise<Record<string, number>> {
    const results = await this.safeDB
      .prepare(`
        SELECT holland_code, COUNT(*) as count 
        FROM career_sessions 
        WHERE holland_code IS NOT NULL
        GROUP BY holland_code
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.holland_code] = row.count;
    });

    return distribution;
  }

  async getPopularCareers(limit: number = 20): Promise<Array<{ title: string; count: number }>> {
    const results = await this.safeDB
      .prepare("SELECT career_matches FROM career_sessions WHERE career_matches IS NOT NULL")
      .all();

    const careerCounts: Record<string, number> = {};

    results.results.forEach((row: any) => {
      try {
        const matches = JSON.parse(row.career_matches as string) as Array<{
          title: string;
          matchScore: number;
          description: string;
          requirements: string[];
        }>;
        
        matches.forEach(match => {
          careerCounts[match.title] = (careerCounts[match.title] || 0) + 1;
        });
      } catch (error) {
        console.warn("Failed to parse career_matches JSON:", error);
      }
    });

    return Object.entries(careerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([title, count]) => ({ title, count }));
  }

  async getAverageInterestScores(): Promise<Record<string, number>> {
    const results = await this.safeDB
      .prepare("SELECT interest_scores FROM career_sessions WHERE interest_scores IS NOT NULL")
      .all();

    const scoreTotals: Record<string, { sum: number; count: number }> = {};

    results.results.forEach((row: any) => {
      try {
        const scores = JSON.parse(row.interest_scores as string) as Record<string, number>;
        
        Object.entries(scores).forEach(([interest, score]) => {
          if (!scoreTotals[interest]) {
            scoreTotals[interest] = { sum: 0, count: 0 };
          }
          scoreTotals[interest].sum += score;
          scoreTotals[interest].count += 1;
        });
      } catch (error) {
        console.warn("Failed to parse interest_scores JSON:", error);
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(scoreTotals).forEach(([interest, { sum, count }]) => {
      averages[interest] = Math.round((sum / count) * 100) / 100;
    });

    return averages;
  }

  private mapToData(row: any): CareerSessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      testSubtype: row.test_subtype as "holland" | "career_values" | "skills_assessment",
      hollandCode: (row.holland_code as string) ?? "",
      interestScores: row.interest_scores ? JSON.parse(row.interest_scores as string) : undefined,
      valuesRanking: row.values_ranking ? JSON.parse(row.values_ranking as string) : undefined,
      skillsProfile: row.skills_profile ? JSON.parse(row.skills_profile as string) : undefined,
      careerMatches: row.career_matches ? JSON.parse(row.career_matches as string) : undefined,
      createdAt: new Date(row.created_at as string),
    };
  }
}