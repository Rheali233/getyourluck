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
export declare class NumerologySessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateNumerologySessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<NumerologySessionData | null>;
    findByLifePathNumber(lifePathNumber: number): Promise<NumerologySessionData[]>;
    getLifePathDistribution(): Promise<Record<number, number>>;
    getDestinyNumberDistribution(): Promise<Record<number, number>>;
    findByBirthDateRange(startDate: Date, endDate: Date): Promise<NumerologySessionData[]>;
    getMasterNumberStats(): Promise<{
        masterNumber11: number;
        masterNumber22: number;
        masterNumber33: number;
        totalMasterNumbers: number;
    }>;
    getKarmicDebtStats(): Promise<Record<number, number>>;
    getBirthDatePatterns(): Promise<Array<{
        month: number;
        count: number;
    }>>;
    private mapToData;
}
//# sourceMappingURL=NumerologySessionModel.d.ts.map