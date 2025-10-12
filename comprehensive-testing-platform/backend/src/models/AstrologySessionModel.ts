/**
 * 占星分析会话数据模型
 * 遵循统一开发标准的数据模型规范
 */

import { BaseModel } from "./BaseModel";
import type { Env } from "../index";

export interface AstrologySessionData {
  id: string;
  testSessionId: string;
  birthDate: Date;
  birthTime?: string;
  birthLocation?: string;
  sunSign: string;
  moonSign?: string;
  risingSign?: string;
  planetaryPositions?: Record<string, any>;
  housePositions?: Record<string, any>;
  aspects?: Record<string, any>;
  createdAt: Date;
}

export interface CreateAstrologySessionData {
  testSessionId: string;
  birthDate: Date;
  birthTime?: string;
  birthLocation?: string;
  sunSign: string;
  moonSign?: string;
  risingSign?: string;
  planetaryPositions?: Record<string, any>;
  housePositions?: Record<string, any>;
  aspects?: Record<string, any>;
}

export class AstrologySessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "astrology_sessions");
  }

  async create(data: CreateAstrologySessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.safeDB
      .prepare(`
        INSERT INTO astrology_sessions (
          id, test_session_id, birth_date, birth_time, birth_location,
          sun_sign, moon_sign, rising_sign, planetary_positions,
          house_positions, aspects, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
        data.birthTime || null,
        data.birthLocation || null,
        data.sunSign,
        data.moonSign || null,
        data.risingSign || null,
        data.planetaryPositions ? JSON.stringify(data.planetaryPositions) : null,
        data.housePositions ? JSON.stringify(data.housePositions) : null,
        data.aspects ? JSON.stringify(data.aspects) : null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create astrology session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<AstrologySessionData | null> {
    const result = await this.safeDB
      .prepare("SELECT * FROM astrology_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySunSign(sunSign: string): Promise<AstrologySessionData[]> {
    const results = await this.safeDB
      .prepare("SELECT * FROM astrology_sessions WHERE sun_sign = ? ORDER BY created_at DESC")
      .bind(sunSign)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getSunSignDistribution(): Promise<Record<string, number>> {
    const results = await this.safeDB
      .prepare(`
        SELECT sun_sign, COUNT(*) as count 
        FROM astrology_sessions 
        GROUP BY sun_sign
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.sun_sign] = row.count;
    });

    return distribution;
  }

  async findByBirthDateRange(startDate: Date, endDate: Date): Promise<AstrologySessionData[]> {
    const results = await this.safeDB
      .prepare(`
        SELECT * FROM astrology_sessions 
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

  private mapToData(row: any): AstrologySessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      birthDate: new Date(row.birth_date as string),
      birthTime: (row.birth_time as string) ?? "",
      birthLocation: (row.birth_location as string) ?? "",
      sunSign: row.sun_sign as string,
      moonSign: (row.moon_sign as string) ?? "",
      risingSign: (row.rising_sign as string) ?? "",
      planetaryPositions: row.planetary_positions ? JSON.parse(row.planetary_positions as string) : undefined,
      housePositions: row.house_positions ? JSON.parse(row.house_positions as string) : undefined,
      aspects: row.aspects ? JSON.parse(row.aspects as string) : undefined,
      createdAt: new Date(row.created_at as string),
    };
  }
}