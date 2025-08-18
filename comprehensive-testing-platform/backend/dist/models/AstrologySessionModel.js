/**
 * 占星分析会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
export class AstrologySessionModel extends BaseModel {
    constructor(env) {
        super(env, "astrology_sessions");
    }
    async create(data) {
        const id = this.generateId();
        const result = await this.db
            .prepare(`
        INSERT INTO astrology_sessions (
          id, test_session_id, birth_date, birth_time, birth_location,
          sun_sign, moon_sign, rising_sign, planetary_positions,
          house_positions, aspects, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(id, data.testSessionId, data.birthDate.toISOString().split('T')[0], // YYYY-MM-DD format
        data.birthTime || null, data.birthLocation || null, data.sunSign, data.moonSign || null, data.risingSign || null, data.planetaryPositions ? JSON.stringify(data.planetaryPositions) : null, data.housePositions ? JSON.stringify(data.housePositions) : null, data.aspects ? JSON.stringify(data.aspects) : null, new Date().toISOString())
            .run();
        if (!result.success) {
            throw this.createError("Failed to create astrology session", "DATABASE_ERROR");
        }
        return id;
    }
    async findByTestSessionId(testSessionId) {
        const result = await this.db
            .prepare("SELECT * FROM astrology_sessions WHERE test_session_id = ?")
            .bind(testSessionId)
            .first();
        if (!result) {
            return null;
        }
        return this.mapToData(result);
    }
    async findBySunSign(sunSign) {
        const results = await this.db
            .prepare("SELECT * FROM astrology_sessions WHERE sun_sign = ? ORDER BY created_at DESC")
            .bind(sunSign)
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    async getSunSignDistribution() {
        const results = await this.db
            .prepare(`
        SELECT sun_sign, COUNT(*) as count 
        FROM astrology_sessions 
        GROUP BY sun_sign
        ORDER BY count DESC
      `)
            .all();
        const distribution = {};
        results.results.forEach((row) => {
            distribution[row.sun_sign] = row.count;
        });
        return distribution;
    }
    async findByBirthDateRange(startDate, endDate) {
        const results = await this.db
            .prepare(`
        SELECT * FROM astrology_sessions 
        WHERE birth_date BETWEEN ? AND ? 
        ORDER BY birth_date DESC
      `)
            .bind(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])
            .all();
        return results.results.map(result => this.mapToData(result));
    }
    mapToData(row) {
        return {
            id: row.id,
            testSessionId: row.test_session_id,
            birthDate: new Date(row.birth_date),
            birthTime: row.birth_time || undefined,
            birthLocation: row.birth_location || undefined,
            sunSign: row.sun_sign,
            moonSign: row.moon_sign || undefined,
            risingSign: row.rising_sign || undefined,
            planetaryPositions: row.planetary_positions ? JSON.parse(row.planetary_positions) : undefined,
            housePositions: row.house_positions ? JSON.parse(row.house_positions) : undefined,
            aspects: row.aspects ? JSON.parse(row.aspects) : undefined,
            createdAt: new Date(row.created_at),
        };
    }
}
//# sourceMappingURL=AstrologySessionModel.js.map