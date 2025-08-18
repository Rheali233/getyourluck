/**
 * 情感关系会话数据模型
 * 遵循统一开发标准的数据模型规范
 */
import { BaseModel } from "./BaseModel";
import type { Env } from "../index";
export interface RelationshipSessionData {
    id: string;
    testSessionId: string;
    testSubtype: "love_languages" | "attachment_style" | "relationship_skills";
    primaryLoveLanguage?: "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch";
    secondaryLoveLanguage?: "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch";
    attachmentStyle?: "secure" | "anxious" | "avoidant" | "disorganized";
    relationshipSkills?: Record<string, number>;
    communicationStyle?: "assertive" | "passive" | "aggressive" | "passive_aggressive";
    createdAt: Date;
}
export interface CreateRelationshipSessionData {
    testSessionId: string;
    testSubtype: "love_languages" | "attachment_style" | "relationship_skills";
    primaryLoveLanguage?: "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch";
    secondaryLoveLanguage?: "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch";
    attachmentStyle?: "secure" | "anxious" | "avoidant" | "disorganized";
    relationshipSkills?: Record<string, number>;
    communicationStyle?: "assertive" | "passive" | "aggressive" | "passive_aggressive";
}
export declare class RelationshipSessionModel extends BaseModel {
    constructor(env: Env);
    create(data: CreateRelationshipSessionData): Promise<string>;
    findByTestSessionId(testSessionId: string): Promise<RelationshipSessionData | null>;
    findBySubtype(subtype: string): Promise<RelationshipSessionData[]>;
    getLoveLanguageDistribution(): Promise<Record<string, number>>;
    getAttachmentStyleDistribution(): Promise<Record<string, number>>;
    getCommunicationStyleDistribution(): Promise<Record<string, number>>;
    getAverageRelationshipSkills(): Promise<Record<string, number>>;
    findCompatiblePairs(): Promise<Array<{
        loveLanguage: string;
        attachmentStyle: string;
        count: number;
    }>>;
    private mapToData;
}
//# sourceMappingURL=RelationshipSessionModel.d.ts.map