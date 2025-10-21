/**
 * Learning Test Model
 * Manages test sessions, answers, and results for learning ability tests
 */

import { BaseModel } from './BaseModel';

export interface LearningTestSession {
  id: string;
  userId?: string;
  testType: 'vark';
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  language: string;
  userAgent?: string;
  ipAddress?: string;
  totalQuestions: number;
  answeredQuestions: number;
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface VARKAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedOptions: string[];
  timeSpent: number;
  createdAt: string;
}

 

export interface CognitiveAnswer {
  id: string;
  sessionId: string;
  taskId: string;
  taskType: string;
  results: any;
  timeSpent: number;
  createdAt: string;
}

export interface VARKResult {
  id: string;
  sessionId: string;
  scores: {
    V: number;
    A: number;
    R: number;
    K: number;
  };
  primaryStyle: 'V' | 'A' | 'R' | 'K';
  secondaryStyles: ('V' | 'A' | 'R' | 'K')[];
  isMixed: boolean;
  balanceScore: number;
  styleAnalysis: string;
  learningAdvice: string;
  environmentSuggestions: string;
  createdAt: string;
}

 

// CognitiveResult interface removed - no longer needed

export interface TestFeedback {
  id: string;
  sessionId: string;
  feedback: 'like' | 'dislike';
  rating?: number;
  comments?: string;
  createdAt: string;
}

export class LearningTestModel extends BaseModel {
  constructor(env: any) {
    super(env, 'learning_test');
  }

  /**
   * Create a new test session
   */
  async createTestSession(sessionData: Omit<LearningTestSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Generate deterministic TEXT id to satisfy FK to TEXT primary key
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const stmt = this.safeDB.prepare(`
        INSERT INTO learning_test_sessions (
          id, user_id, test_type, start_time, language, user_agent, ip_address, 
          total_questions, answered_questions, time_spent, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      await stmt.bind(
        sessionId,
        sessionData.userId || null,
        sessionData.testType,
        sessionData.startTime,
        sessionData.language,
        sessionData.userAgent || null,
        sessionData.ipAddress || null,
        sessionData.totalQuestions,
        sessionData.answeredQuestions,
        sessionData.timeSpent,
        sessionData.status
      ).run();
      
      // Return the generated TEXT id for FK consistency
      return sessionId;
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to create test session');
    }
  }

  /**
   * Update test session
   */
  async updateTestSession(sessionId: string, updates: Partial<LearningTestSession>): Promise<void> {
    try {
      const updateFields = [];
      const values = [];
      
      if (updates.endTime !== undefined) {
        updateFields.push('end_time = ?');
        values.push(updates.endTime);
      }
      if (updates.status !== undefined) {
        updateFields.push('status = ?');
        values.push(updates.status);
      }
      if (updates.answeredQuestions !== undefined) {
        updateFields.push('answered_questions = ?');
        values.push(updates.answeredQuestions);
      }
      if (updates.timeSpent !== undefined) {
        updateFields.push('time_spent = ?');
        values.push(updates.timeSpent);
      }
      
      if (updateFields.length === 0) {
        return;
      }
      
      updateFields.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(sessionId);
      
      const stmt = this.safeDB.prepare(`
        UPDATE learning_test_sessions 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `);
      
      await stmt.bind(...values).run();
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to update test session');
    }
  }

  /**
   * Get test session by ID
   */
  async getTestSession(sessionId: string): Promise<LearningTestSession | null> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT * FROM learning_test_sessions WHERE id = ?
      `);
      
      const result = await stmt.bind(sessionId).first();
      
      if (!result) {
        return null;
      }
      
      return {
        id: result['id'] as string,
        userId: result['user_id'] as string | undefined,
        testType: result['test_type'] as 'vark',
        startTime: result['start_time'] as string,
        endTime: result['end_time'] as string | undefined,
        status: result['status'] as 'in_progress' | 'completed' | 'abandoned',
        language: result['language'] as string,
        userAgent: result['user_agent'] as string | undefined,
        ipAddress: result['ip_address'] as string | undefined,
        totalQuestions: result['total_questions'] as number,
        answeredQuestions: result['answered_questions'] as number,
        timeSpent: result['time_spent'] as number,
        createdAt: result['created_at'] as string,
        updatedAt: result['updated_at'] as string
      } as LearningTestSession;
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to fetch test session');
    }
  }

  /**
   * Save VARK answer
   */
  async saveVARKAnswer(answer: Omit<VARKAnswer, 'id' | 'createdAt'>): Promise<string> {
    try {
      const stmt = this.safeDB.prepare(`
        INSERT INTO vark_answers (
          session_id, question_id, selected_options, time_spent
        ) VALUES (?, ?, ?, ?)
      `);
      
      const result = await stmt.bind(
        answer.sessionId,
        answer.questionId,
        JSON.stringify(answer.selectedOptions),
        answer.timeSpent
      ).run();
      
      return result.meta.last_row_id?.toString() || '';
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to save VARK answer');
    }
  }

  /**
   * Save Raven answer
   */
  

  /**
   * Save cognitive answer
   */
  async saveCognitiveAnswer(answer: Omit<CognitiveAnswer, 'id' | 'createdAt'>): Promise<string> {
    try {
      const stmt = this.safeDB.prepare(`
        INSERT INTO cognitive_answers (
          session_id, task_id, task_type, results, time_spent
        ) VALUES (?, ?, ?, ?, ?)
      `);
      
      const result = await stmt.bind(
        answer.sessionId,
        answer.taskId,
        answer.taskType,
        JSON.stringify(answer.results),
        answer.timeSpent
      ).run();
      
      return result.meta.last_row_id?.toString() || '';
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to save cognitive answer');
    }
  }

  /**
   * Save VARK result
   */
  async saveVARKResult(result: Omit<VARKResult, 'id' | 'createdAt'>): Promise<string> {
    try {
      const stmt = this.safeDB.prepare(`
        INSERT INTO vark_results (
          session_id, scores, primary_style, secondary_styles, is_mixed, 
          balance_score, style_analysis, learning_advice, environment_suggestions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const resultId = await stmt.bind(
        result.sessionId,
        JSON.stringify(result.scores),
        result.primaryStyle,
        JSON.stringify(result.secondaryStyles),
        result.isMixed ? 1 : 0,
        result.balanceScore,
        result.styleAnalysis,
        result.learningAdvice,
        result.environmentSuggestions
      ).run();
      
      return resultId.meta.last_row_id?.toString() || '';
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to save VARK result');
    }
  }

  /**
   * Save Raven result
   */
  

  // Cognitive result methods removed - no longer needed

  /**
   * Get test result by session ID
   */
  async getTestResult(sessionId: string): Promise<any> {
    try {
      const session = await this.getTestSession(sessionId);
      if (!session) {
        return null;
      }
      
      switch (session.testType) {
        case 'vark':
          return await this.getVARKResult(sessionId);
        default:
          return null;
      }
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to fetch test result');
    }
  }

  /**
   * Get VARK result
   */
  private async getVARKResult(sessionId: string): Promise<VARKResult | null> {
    try {
      const stmt = this.safeDB.prepare(`
        SELECT * FROM vark_results WHERE session_id = ?
      `);
      
      const result = await stmt.bind(sessionId).first();
      if (!result) {
        return null;
      }
      
      return {
        id: result['id'] as string,
        sessionId: result['session_id'] as string,
        scores: JSON.parse(result['scores'] as string),
        primaryStyle: result['primary_style'] as 'V' | 'A' | 'R' | 'K',
        secondaryStyles: JSON.parse(result['secondary_styles'] as string),
        isMixed: result['is_mixed'] === 1,
        balanceScore: result['balance_score'] as number,
        styleAnalysis: result['style_analysis'] as string,
        learningAdvice: result['learning_advice'] as string,
        environmentSuggestions: result['environment_suggestions'] as string,
        createdAt: result['created_at'] as string
      };
    } catch (error) {
      // Error logging removed for production
      return null;
    }
  }

  /**
   * Get Raven result
   */
  

  // cognitive result retrieval removed

  /**
   * Submit feedback
   */
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike', rating?: number, comments?: string): Promise<void> {
    try {
      const stmt = this.safeDB.prepare(`
        INSERT INTO test_feedback (
          session_id, feedback, rating, comments
        ) VALUES (?, ?, ?, ?)
      `);
      
      await stmt.bind(sessionId, feedback, rating || null, comments || null).run();
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to submit feedback');
    }
  }

  /**
   * Process test submission and generate results
   */
  async processTestSubmission(testType: string, answers: any[], sessionData: any): Promise<any> {
    try {
      // Normalize inputs to avoid undefined bindings
      const totalQuestions = Array.isArray(answers) ? answers.length : 0;

      // Create a session when missing to match PHQ-9 tolerance
      let sessionId = sessionData?.sessionId as string | undefined;
      if (!sessionId) {
        sessionId = await this.createTestSession({
          testType: ('vark'),
          startTime: new Date().toISOString(),
          status: 'in_progress',
          language: sessionData?.language || 'en',
          userAgent: sessionData?.userAgent || 'Unknown',
          ipAddress: sessionData?.ipAddress || 'Unknown',
          totalQuestions: totalQuestions,
          answeredQuestions: 0,
          timeSpent: 0,
        });
      }

      // Ensure startTime is valid, use current time as fallback
      const startTimeMs = sessionData?.startTime && !isNaN(new Date(sessionData.startTime).getTime())
        ? new Date(sessionData.startTime).getTime()
        : Date.now();

      const timeSpent = Math.max(0, Date.now() - startTimeMs);

      // Update session status safely
      await this.updateTestSession(sessionId, {
        status: 'completed',
        endTime: new Date().toISOString(),
        answeredQuestions: totalQuestions,
        timeSpent
      });
      
      // Generate results based on test type
      let result: any;
      switch (testType) {
        case 'vark':
          result = this.calculateVARKResult(answers);
          await this.saveVARKResult({ sessionId, ...result });
          break;
        default:
          throw new Error('Unknown test type');
      }

      // Normalize response to align with frontend expectations
      return {
        sessionId,
        testType,
        ...result,
        completedAt: new Date().toISOString(),
        status: 'completed'
      };
    } catch (error) {
      // Error logging removed for production
      throw new Error('Failed to process test submission');
    }
  }

  /**
   * Calculate VARK result from answers
   */
  private calculateVARKResult(answers: VARKAnswer[]): Omit<VARKResult, 'id' | 'sessionId' | 'createdAt'> {
    // Robust VARK scoring without DB lookups:
    // Derive dimension from optionId suffix (e.g., *_v|*_a|*_r|*_k) and sum counts as weights.
    const scores: { V: number; A: number; R: number; K: number } = { V: 0, A: 0, R: 0, K: 0 };

    if (!Array.isArray(answers)) {
      return {
        scores,
        primaryStyle: 'V',
        secondaryStyles: ['A', 'R'],
        isMixed: false,
        balanceScore: 0,
        styleAnalysis: 'Insufficient answers to calculate result.',
        learningAdvice: 'Provide more answers to improve accuracy.',
        environmentSuggestions: 'Use a balanced learning environment.'
      };
    }

    for (const answer of answers) {
      const optionIds = Array.isArray(answer.selectedOptions) ? answer.selectedOptions : [];
      for (const optionId of optionIds) {
        if (typeof optionId !== 'string') {
          continue;
        }
        // Try to infer dimension by suffix _v/_a/_r/_k
        const lower = optionId.toLowerCase();
        let dim: 'V' | 'A' | 'R' | 'K' | null = null;
        if (lower.endsWith('_v')) {
          dim = 'V';
        } else if (lower.endsWith('_a')) {
          dim = 'A';
        } else if (lower.endsWith('_r')) {
          dim = 'R';
        } else if (lower.endsWith('_k')) {
          dim = 'K';
        }

        if (dim) {
          scores[dim] += 1; // treat as weight 1 if actual weight is unknown here
        }
      }
    }

    // Calculate primary and secondary styles
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a) as [keyof typeof scores, number][];
    const primaryStyle = (sorted[0]?.[0] || 'V') as 'V' | 'A' | 'R' | 'K';
    const secondaryStyles = sorted.slice(1, 3).map(([k]) => k as 'V' | 'A' | 'R' | 'K');

    const top = scores[primaryStyle];
    const firstSecondary = secondaryStyles.length > 0 ? (secondaryStyles[0] as 'V' | 'A' | 'R' | 'K') : null;
    const second = firstSecondary ? scores[firstSecondary] : 0;

    return {
      scores,
      primaryStyle,
      secondaryStyles,
      isMixed: top - second < 2, // simple mixed threshold
      balanceScore: Math.min(scores.V, scores.A, scores.R, scores.K),
      styleAnalysis: `Your primary learning preference appears to be ${primaryStyle}, with ${secondaryStyles.join(' and ')} as secondary styles.`,
      learningAdvice: `Leverage ${primaryStyle}-oriented study techniques while incorporating ${secondaryStyles.join(' and ')} methods for balance.`,
      environmentSuggestions: `Create an environment that supports ${primaryStyle} learning (e.g., tools and materials that align with this style).`
    };
  }

  /**
   * Calculate Raven result from answers
   */
  

  // cognitive calculation removed
}
