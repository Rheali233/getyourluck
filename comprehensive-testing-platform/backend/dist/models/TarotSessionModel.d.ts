/**
 * 塔罗牌会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
export interface TarotCard {
    id: string;
    name: string;
    suit?: string;
    number?: number;
    isReversed: boolean;
    meaning: string;
    reversedMeaning?: string;
}
export interface TarotSessionData {
    id: string;
    testSessionId: string;
    spreadType: "single" | "three_card" | "celtic_cross" | "relationship" | "career";
    cardsDrawn: TarotCard[];
    cardPositions?: Record<string, any>;
    interpretationTheme?: string;
    questionCategory?: "love" | "career" | "finance" | "health" | "spiritual" | "general";
    createdAt: Date;
}
export interface CreateTarotSessionData {
    testSessionId: string;
    spreadType: "single" | "three_card" | "celtic_cross" | "relationship" | "career";
    cardsDrawn: TarotCard[];
    cardPositions?: Record<string, any>;
    interpretationTheme?: string;
    questionCategory?: "love" | "career" | "finance" | "health" | "spiritual" | "general";
}
export declare class TarotSessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateTarotSessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<TarotSessionData | null>;
    findBySpreadType(spreadType: string): Promise<TarotSessionData[]>;
    findByQuestionCategory(category: string): Promise<TarotSessionData[]>;
    getSpreadTypeStats(): Promise<Record<string, number>>;
    getPopularCards(limit?: number): Promise<Array<{
        cardName: string;
        count: number;
    }>>;
    private mapToData;
}
//# sourceMappingURL=TarotSessionModel.d.ts.map