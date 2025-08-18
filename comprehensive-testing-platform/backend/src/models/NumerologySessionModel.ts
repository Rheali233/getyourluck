/**
 * 命理分析会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface NumerologyChart {
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  challengeNumbers: number[];
  pinnacleNumbers: number[];
  personalYearNumber?: number;
  karmicDebtNumbers?: number[];
  masterNumbers?: number[];
}

export interface NumerologySessionData {
  id: string;
  testSessionId: string;
  birthDate: Date;
  fullName: string;
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  numerologyChart: NumerologyChart;
  createdAt: Date;
}

export interface CreateNumerologySessionData {
  testSessionId: string;
  birthDate: Date;
  fullName: string;
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  numerologyChart: NumerologyChart;
}

export class NumerologySessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "numerology_sessions");
  }

  async create(data: CreateNumerologySessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO numerology_sessions (
          id, test_session_id, birth_date, full_name,
          life_path_number, destiny_number, soul_urge_number,
          personality_number, birth_day_number, numerology_chart, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
        data.fullName,
        data.lifePathNumber,
        data.destinyNumber,
        data.soulUrgeNumber,
        data.personalityNumber,
        data.birthDayNumber,
        JSON.stringify(data.numerologyChart),
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create numerology session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<NumerologySessionData | null> {
    const result = await this.db
      .prepare("SELECT * FROM numerology_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findByLifePathNumber(lifePathNumber: number): Promise<NumerologySessionData[]> {
    const results = await this.db
      .prepare("SELECT * FROM numerology_sessions WHERE life_path_number = ? ORDER BY created_at DESC")
      .bind(lifePathNumber)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getLifePathDistribution(): Promise<Record<number, number>> {
    const results = await this.db
      .prepare(`
        SELECT life_path_number, COUNT(*) as count 
        FROM numerology_sessions 
        GROUP BY life_path_number
        ORDER BY life_path_number
      `)
      .all();

    const distribution: Record<number, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.life_path_number] = row.count;
    });

    return distribution;
  }

  async getDestinyNumberDistribution(): Promise<Record<number, number>> {
    const results = await this.db
      .prepare(`
        SELECT destiny_number, COUNT(*) as count 
        FROM numerology_sessions 
        GROUP BY destiny_number
        ORDER BY destiny_number
      `)
      .all();

    const distribution: Record<number, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.destiny_number] = row.count;
    });

    return distribution;
  }

  async findByBirthDateRange(startDate: Date, endDate: Date): Promise<NumerologySessionData[]> {
    const results = await this.db
      .prepare(`
        SELECT * FROM numerology_sessions 
        WHERE birth_date BETWEEN ? AND ? 
        ORDER BY birth_date DESC
      `)
      .bind(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getMasterNumberStats(): Promise<{
    masterNumber11: number;
    masterNumber22: number;
    masterNumber33: number;
    totalMasterNumbers: number;
  }> {
    const results = await this.db
      .prepare(`
        SELECT numerology_chart FROM numerology_sessions
      `)
      .all();

    let masterNumber11 = 0;
    let masterNumber22 = 0;
    let masterNumber33 = 0;

    results.results.forEach((row: any) => {
      try {
        const chart = JSON.parse(row.numerology_chart as string) as NumerologyChart;
        if (chart.masterNumbers) {
          if (chart.masterNumbers.includes(11)) masterNumber11++;
          if (chart.masterNumbers.includes(22)) masterNumber22++;
          if (chart.masterNumbers.includes(33)) masterNumber33++;
        }
      } catch (error) {
        console.warn("Failed to parse numerology_chart JSON:", error);
      }
    });

    return {
      masterNumber11,
      masterNumber22,
      masterNumber33,
      totalMasterNumbers: masterNumber11 + masterNumber22 + masterNumber33,
    };
  }

  async getKarmicDebtStats(): Promise<Record<number, number>> {
    const results = await this.db
      .prepare(`
        SELECT numerology_chart FROM numerology_sessions
      `)
      .all();

    const karmicDebtCounts: Record<number, number> = {
      13: 0,
      14: 0,
      16: 0,
      19: 0,
    };

    results.results.forEach((row: any) => {
      try {
        const chart = JSON.parse(row.numerology_chart as string) as NumerologyChart;
        if (chart.karmicDebtNumbers) {
          chart.karmicDebtNumbers.forEach((number) => {
            if (Object.prototype.hasOwnProperty.call(karmicDebtCounts, number)) {
              karmicDebtCounts[number] = (karmicDebtCounts[number] || 0) + 1;
            }
          });
        }
      } catch (error) {
        console.warn("Failed to parse numerology_chart JSON:", error);
      }
    });

    return karmicDebtCounts;
  }

  async getBirthDatePatterns(): Promise<Array<{
    month: number;
    count: number;
  }>> {
    const results = await this.db
      .prepare(`
        SELECT 
          CAST(strftime('%m', birth_date) AS INTEGER) as month,
          COUNT(*) as count
        FROM numerology_sessions 
        GROUP BY month
        ORDER BY month
      `)
      .all();

    return results.results.map((row: any) => ({
      month: row.month,
      count: row.count,
    }));
  }

  private mapToData(row: any): NumerologySessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      birthDate: new Date(row.birth_date as string),
      fullName: row.full_name as string,
      lifePathNumber: row.life_path_number as number,
      destinyNumber: row.destiny_number as number,
      soulUrgeNumber: row.soul_urge_number as number,
      personalityNumber: row.personality_number as number,
      birthDayNumber: row.birth_day_number as number,
      numerologyChart: JSON.parse(row.numerology_chart as string) as NumerologyChart,
      createdAt: new Date(row.created_at as string),
    };
  }
}