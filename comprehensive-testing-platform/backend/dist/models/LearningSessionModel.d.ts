/**
 * 学习能力会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
export interface LearningSessionData {
    id: string;
    testSessionId: string;
    testSubtype: "vark" | "raven" | "learning_strategies";
    learningStyle?: "visual" | "auditory" | "reading" | "kinesthetic" | "multimodal";
    cognitiveScore?: number;
    percentileRank?: number;
    learningPreferences?: Record<string, number>;
    strategyRecommendations?: string[];
    createdAt: Date;
}
export interface CreateLearningSessionData {
    testSessionId: string;
    testSubtype: "vark" | "raven" | "learning_strategies";
    learningStyle?: "visual" | "auditory" | "reading" | "kinesthetic" | "multimodal";
    cognitiveScore?: number;
    percentileRank?: number;
    learningPreferences?: Record<string, number>;
    strategyRecommendations?: string[];
}
export declare class LearningSessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateLearningSessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<LearningSessionData | null>;
    findBySubtype(subtype: string): Promise<LearningSessionData[]>;
    getLearningStyleDistribution(): Promise<Record<string, number>>;
    getCognitiveScoreStats(): Promise<{
        average: number;
        median: number;
        min: number;
        max: number;
        count: number;
    }>;
    getPercentileDistribution(): Promise<Record<string, number>>;
    private mapToData;
}
//# sourceMappingURL=LearningSessionModel.d.ts.map