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
export declare class CareerSessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateCareerSessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<CareerSessionData | null>;
    findBySubtype(subtype: string): Promise<CareerSessionData[]>;
    getHollandCodeDistribution(): Promise<Record<string, number>>;
    getPopularCareers(limit?: number): Promise<Array<{
        title: string;
        count: number;
    }>>;
    getAverageInterestScores(): Promise<Record<string, number>>;
    private mapToData;
}
//# sourceMappingURL=CareerSessionModel.d.ts.map