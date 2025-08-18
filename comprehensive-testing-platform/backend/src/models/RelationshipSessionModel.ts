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

export class RelationshipSessionModel extends BaseModel {
  constructor(env: Env) {
    super(env, "relationship_sessions");
  }

  async create(data: CreateRelationshipSessionData): Promise<string> {
    const id = this.generateId();

    const result = await this.db
      .prepare(`
        INSERT INTO relationship_sessions (
          id, test_session_id, test_subtype, primary_love_language,
          secondary_love_language, attachment_style, relationship_skills,
          communication_style, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        id,
        data.testSessionId,
        data.testSubtype,
        data.primaryLoveLanguage || null,
        data.secondaryLoveLanguage || null,
        data.attachmentStyle || null,
        data.relationshipSkills ? JSON.stringify(data.relationshipSkills) : null,
        data.communicationStyle || null,
        new Date().toISOString(),
      )
      .run();

    if (!result.success) {
      throw this.createError("Failed to create relationship session", "DATABASE_ERROR");
    }

    return id;
  }

  async findByTestSessionId(testSessionId: string): Promise<RelationshipSessionData | null> {
    const result = await this.db
      .prepare("SELECT * FROM relationship_sessions WHERE test_session_id = ?")
      .bind(testSessionId)
      .first();

    if (!result) {
      return null;
    }

    return this.mapToData(result);
  }

  async findBySubtype(subtype: string): Promise<RelationshipSessionData[]> {
    const results = await this.db
      .prepare("SELECT * FROM relationship_sessions WHERE test_subtype = ? ORDER BY created_at DESC")
      .bind(subtype)
      .all();

    return results.results.map(result => this.mapToData(result));
  }

  async getLoveLanguageDistribution(): Promise<Record<string, number>> {
    const results = await this.db
      .prepare(`
        SELECT primary_love_language, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL
        GROUP BY primary_love_language
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.primary_love_language] = row.count;
    });

    return distribution;
  }

  async getAttachmentStyleDistribution(): Promise<Record<string, number>> {
    const results = await this.db
      .prepare(`
        SELECT attachment_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE attachment_style IS NOT NULL
        GROUP BY attachment_style
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.attachment_style] = row.count;
    });

    return distribution;
  }

  async getCommunicationStyleDistribution(): Promise<Record<string, number>> {
    const results = await this.db
      .prepare(`
        SELECT communication_style, COUNT(*) as count 
        FROM relationship_sessions 
        WHERE communication_style IS NOT NULL
        GROUP BY communication_style
        ORDER BY count DESC
      `)
      .all();

    const distribution: Record<string, number> = {};
    results.results.forEach((row: any) => {
      distribution[row.communication_style] = row.count;
    });

    return distribution;
  }

  async getAverageRelationshipSkills(): Promise<Record<string, number>> {
    const results = await this.db
      .prepare("SELECT relationship_skills FROM relationship_sessions WHERE relationship_skills IS NOT NULL")
      .all();

    const skillTotals: Record<string, { sum: number; count: number }> = {};

    results.results.forEach((row: any) => {
      try {
        const skills = JSON.parse(row.relationship_skills as string) as Record<string, number>;
        
        Object.entries(skills).forEach(([skill, score]) => {
          if (!skillTotals[skill]) {
            skillTotals[skill] = { sum: 0, count: 0 };
          }
          skillTotals[skill].sum += score;
          skillTotals[skill].count += 1;
        });
      } catch (error) {
        console.warn("Failed to parse relationship_skills JSON:", error);
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(skillTotals).forEach(([skill, { sum, count }]) => {
      averages[skill] = Math.round((sum / count) * 100) / 100;
    });

    return averages;
  }

  async findCompatiblePairs(): Promise<Array<{
    loveLanguage: string;
    attachmentStyle: string;
    count: number;
  }>> {
    const results = await this.db
      .prepare(`
        SELECT 
          primary_love_language,
          attachment_style,
          COUNT(*) as count
        FROM relationship_sessions 
        WHERE primary_love_language IS NOT NULL 
          AND attachment_style IS NOT NULL
        GROUP BY primary_love_language, attachment_style
        ORDER BY count DESC
        LIMIT 10
      `)
      .all();

    return results.results.map((row: any) => ({
      loveLanguage: row.primary_love_language,
      attachmentStyle: row.attachment_style,
      count: row.count,
    }));
  }

  private mapToData(row: any): RelationshipSessionData {
    return {
      id: row.id as string,
      testSessionId: row.test_session_id as string,
      testSubtype: row.test_subtype as "love_languages" | "attachment_style" | "relationship_skills",
      primaryLoveLanguage: row.primary_love_language as "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch" || undefined,
      secondaryLoveLanguage: row.secondary_love_language as "words_of_affirmation" | "acts_of_service" | "receiving_gifts" | "quality_time" | "physical_touch" || undefined,
      attachmentStyle: row.attachment_style as "secure" | "anxious" | "avoidant" | "disorganized" || undefined,
      relationshipSkills: row.relationship_skills ? JSON.parse(row.relationship_skills as string) : undefined,
      communicationStyle: row.communication_style as "assertive" | "passive" | "aggressive" | "passive_aggressive" || undefined,
      createdAt: new Date(row.created_at as string),
    };
  }
}