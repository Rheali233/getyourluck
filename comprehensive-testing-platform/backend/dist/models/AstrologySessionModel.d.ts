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
export declare class AstrologySessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateAstrologySessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<AstrologySessionData | null>;
    findBySunSign(sunSign: string): Promise<AstrologySessionData[]>;
    getSunSignDistribution(): Promise<Record<string, number>>;
    findByBirthDateRange(startDate: Date, endDate: Date): Promise<AstrologySessionData[]>;
    private mapToData;
}
//# sourceMappingURL=AstrologySessionModel.d.ts.map