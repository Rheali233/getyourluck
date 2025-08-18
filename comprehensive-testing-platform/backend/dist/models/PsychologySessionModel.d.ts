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
export declare class PsychologySessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreatePsychologySessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<PsychologySessionData | null>;
    findBySubtype(subtype: string): Promise<PsychologySessionData[]>;
    getStatsBySubtype(subtype: string): Promise<{
        totalSessions: number;
        averageScores?: Record<string, number>;
        personalityTypeDistribution?: Record<string, number>;
    }>;
    private mapToData;
}
//# sourceMappingURL=PsychologySessionModel.d.ts.map