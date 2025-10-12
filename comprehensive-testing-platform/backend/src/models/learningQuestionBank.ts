/**
 * Learning Question Bank Model
 * Manages VARK and Cognitive test questions
 */

import { BaseModel } from './BaseModel';

export interface VARKQuestion {
  id: string;
  questionText: string;
  options: VARKOption[];
  category: string;
  dimension: 'V' | 'A' | 'R' | 'K';
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VARKOption {
  id: string;
  text: string;
  dimension: 'V' | 'A' | 'R' | 'K';
  weight: number;
}

 

export interface CognitiveTask {
  id: string;
  type: 'working_memory' | 'attention' | 'processing_speed' | 'executive_function';
  subtype: string;
  description: string;
  instructions: string;
  duration: number;
  scoring: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class LearningQuestionBankModel extends BaseModel {
  constructor(env: any) {
    super(env, 'learning_question_bank');
  }

  /**
   * Get all VARK questions
   */
  async getVARKQuestions(): Promise<VARKQuestion[]> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT 
          id, question_text, category, dimension, weight, is_active, created_at, updated_at
        FROM vark_questions 
        WHERE is_active = 1 
        ORDER BY category, dimension, weight DESC
      `);
      
      const questions = await stmt.all();
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.results.map(async (question: any) => {
          const optionsStmt = this.safeDB.prepare(`
            SELECT id, text, dimension, weight
            FROM vark_options 
            WHERE question_id = ? AND is_active = 1
            ORDER BY weight DESC
          `);
          
          const options = await optionsStmt.bind(question['id']).all();
          
          return {
            id: question['id'] as string,
            questionText: question['question_text'] as string,
            category: question['category'] as string,
            dimension: question['dimension'] as 'V' | 'A' | 'R' | 'K',
            weight: question['weight'] as number,
            isActive: question['is_active'] === 1,
            createdAt: question['created_at'] as string,
            updatedAt: question['updated_at'] as string,
            options: options.results.map((opt: any) => ({
              id: opt['id'] as string,
              text: opt['text'] as string,
              dimension: opt['dimension'] as 'V' | 'A' | 'R' | 'K',
              weight: opt['weight'] as number
            }))
          };
        })
      );
      
      return questionsWithOptions;
    } catch (error) {
      console.error('Error fetching VARK questions:', error);
      throw new Error('Failed to fetch VARK questions');
    }
  }

  /**
   * Get VARK questions by dimension
   */
  async getVARKQuestionsByDimension(dimension: 'V' | 'A' | 'R' | 'K'): Promise<VARKQuestion[]> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT 
          id, question_text, category, dimension, weight, is_active, created_at, updated_at
        FROM vark_questions 
        WHERE dimension = ? AND is_active = 1 
        ORDER BY weight DESC
      `);
      
      const questions = await stmt.bind(dimension).all();
      
      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.results.map(async (question: any) => {
          const optionsStmt = this.safeDB.prepare(`
            SELECT id, text, dimension, weight
            FROM vark_options 
            WHERE question_id = ? AND is_active = 1
            ORDER BY weight DESC
          `);
          
          const options = await optionsStmt.bind(question['id']).all();
          
          return {
            id: question['id'] as string,
            questionText: question['question_text'] as string,
            category: question['category'] as string,
            dimension: question['dimension'] as 'V' | 'A' | 'R' | 'K',
            weight: question['weight'] as number,
            isActive: question['is_active'] === 1,
            createdAt: question['created_at'] as string,
            updatedAt: question['updated_at'] as string,
            options: options.results.map((opt: any) => ({
              id: opt['id'] as string,
              text: opt['text'] as string,
              dimension: opt['dimension'] as 'V' | 'A' | 'R' | 'K',
              weight: opt['weight'] as number
            }))
          };
        })
      );
      
      return questionsWithOptions;
    } catch (error) {
      console.error('Error fetching VARK questions by dimension:', error);
      throw new Error('Failed to fetch VARK questions by dimension');
    }
  }

  

  

  /**
   * Get all cognitive tasks
   */
  async getCognitiveTasks(): Promise<CognitiveTask[]> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT 
          id, type, subtype, description, instructions, duration, scoring, 
          is_active, created_at, updated_at
        FROM cognitive_tasks 
        WHERE is_active = 1 
        ORDER BY type, subtype
      `);
      
      const tasks = await stmt.all();
      
      return tasks.results.map((task: any) => ({
        id: task['id'] as string,
        type: task['type'] as 'working_memory' | 'attention' | 'processing_speed' | 'executive_function',
        subtype: task['subtype'] as string,
        description: task['description'] as string,
        instructions: task['instructions'] as string,
        duration: task['duration'] as number,
        scoring: task['scoring'] as string,
        isActive: task['is_active'] === 1,
        createdAt: task['created_at'] as string,
        updatedAt: task['updated_at'] as string
      }));
    } catch (error) {
      console.error('Error fetching cognitive tasks:', error);
      throw new Error('Failed to fetch cognitive tasks');
    }
  }

  /**
   * Get cognitive tasks by type
   */
  async getCognitiveTasksByType(type: 'working_memory' | 'attention' | 'processing_speed' | 'executive_function'): Promise<CognitiveTask[]> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT 
          id, type, subtype, description, instructions, duration, scoring, 
          is_active, created_at, updated_at
        FROM cognitive_tasks 
        WHERE type = ? AND is_active = 1 
        ORDER BY subtype
      `);
      
      const tasks = await stmt.bind(type).all();
      
      return tasks.results.map((task: any) => ({
        id: task['id'] as string,
        type: task['type'] as 'working_memory' | 'attention' | 'processing_speed' | 'executive_function',
        subtype: task['subtype'] as string,
        description: task['description'] as string,
        instructions: task['instructions'] as string,
        duration: task['duration'] as number,
        scoring: task['scoring'] as string,
        isActive: task['is_active'] === 1,
        createdAt: task['created_at'] as string,
        updatedAt: task['updated_at'] as string
      }));
    } catch (error) {
      console.error('Error fetching cognitive tasks by type:', error);
      throw new Error('Failed to fetch cognitive tasks by type');
    }
  }

  /**
   * Get question statistics
   */
  async getQuestionStatistics(): Promise<{
    vark: { total: number; byDimension: Record<string, number> };
    cognitive: { total: number; byType: Record<string, number> };
  }> {
    try {
      // VARK statistics
      const varkStmt = this.safeDB.prepare(`
        SELECT dimension, COUNT(*) as count
        FROM vark_questions 
        WHERE is_active = 1 
        GROUP BY dimension
      `);
      const varkStats = await varkStmt.all();
      
      
      // Cognitive statistics
      const cognitiveStmt = this.safeDB.prepare(`
        SELECT type, COUNT(*) as count
        FROM cognitive_tasks 
        WHERE is_active = 1 
        GROUP BY type
      `);
      const cognitiveStats = await cognitiveStmt.all();
      
      return {
        vark: {
          total: varkStats.results.reduce((sum: number, stat: any) => sum + (stat['count'] as number), 0),
          byDimension: varkStats.results.reduce((acc: Record<string, number>, stat: any) => {
            acc[stat['dimension'] as string] = stat['count'] as number;
            return acc;
          }, {} as Record<string, number>)
        },
        cognitive: {
          total: cognitiveStats.results.reduce((sum: number, stat: any) => sum + (stat['count'] as number), 0),
          byType: cognitiveStats.results.reduce((acc: Record<string, number>, stat: any) => {
            acc[stat['type'] as string] = stat['count'] as number;
            return acc;
          }, {} as Record<string, number>)
        }
      };
    } catch (error) {
      console.error('Error fetching question statistics:', error);
      throw new Error('Failed to fetch question statistics');
    }
  }
}
