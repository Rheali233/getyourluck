/**
 * Relationship Test AI Service
 * Uses backend AI proxy for secure analysis
 */

import type { TestSession, TestResult } from '../types';
import { getApiBaseUrl } from '@/config/environment';

export class RelationshipAIService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/ai/relationship';
  }

  /**
   * Analyze test results using AI service
   */
  async analyzeTest(session: TestSession): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseURL}/${session.testType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: session.answers,
          context: { testType: session.testType }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return this.parseAIResponse(result.data, session.testType);
      }
      
      throw new Error(result.error || 'AI analysis failed');
    } catch (error) {
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取测试结果
   */
  async getTestResult(sessionId: string): Promise<TestResult> {
    try {
      // Implementation: Actual result retrieval
      // This would typically call the backend result endpoint
      const response = await fetch(`${getApiBaseUrl()}/api/v1/relationship/results/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve result: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to retrieve test result');
      }
      
    } catch (error) {
      throw new Error(`Failed to retrieve test result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 提交反馈
   */
  async submitFeedback(sessionId: string, feedback: { type: 'like' | 'dislike'; comment?: string }): Promise<{ success: boolean; message: string }> {
    try {
      // Implementation: Actual feedback submission
      // This would typically call the backend feedback endpoint
      const response = await fetch(`${getApiBaseUrl()}/api/v1/relationship/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...feedback,
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'Feedback submitted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to submit feedback');
      }
      
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse AI response based on test type
   */
  private parseAIResponse(response: any, testType: string): TestResult {
    switch (testType) {
      case 'love_language':
        return this.parseLoveLanguageAIResponse(response);
      case 'love_style':
        return this.parseLoveStyleAIResponse(response);
      case 'interpersonal':
        return this.parseInterpersonalAIResponse(response);
      default:
        throw new Error(`Unsupported test type: ${testType}`);
    }
  }

  /**
   * Parse Love Language AI response
   */
  private parseLoveLanguageAIResponse(response: any): TestResult {
    // Extract detailed analysis for primary and secondary love languages
    const primaryAnalysis = response.primaryLanguageAnalysis || {};
    const secondaryAnalysis = response.secondaryLanguageAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'love_language',
      scores: {}, // No scores needed for text-only display
      primaryType: response.primaryType || 'words_of_affirmation',
      secondaryType: response.secondaryType || 'quality_time',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        primaryAnalysis.relationshipBenefits || 'Strong love expression skills',
        secondaryAnalysis.relationshipBenefits || 'Additional love language abilities'
      ].filter(Boolean),
      areasForGrowth: [
        primaryAnalysis.potentialMisunderstandings || 'Communication improvement areas',
        secondaryAnalysis.potentialMisunderstandings || 'Additional growth opportunities'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Love Style AI response
   */
  private parseLoveStyleAIResponse(response: any): TestResult {
    // Extract detailed analysis for dominant and secondary styles
    const dominantAnalysis = response.dominantStyleAnalysis || {};
    const secondaryAnalysis = response.secondaryStyleAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'love_style',
      scores: {}, // No scores needed for text-only display
      primaryType: response.dominantStyle || response.primaryType || 'secure',
      secondaryType: response.secondaryStyle || response.secondaryType || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        dominantAnalysis.strengths || 'Strong emotional foundation',
        secondaryAnalysis.strengths || 'Additional relationship skills'
      ].filter(Boolean),
      areasForGrowth: [
        dominantAnalysis.challenges || 'Personal development areas',
        secondaryAnalysis.challenges || 'Growth opportunities'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Interpersonal AI response
   */
  private parseInterpersonalAIResponse(response: any): TestResult {
    // Extract detailed interpersonal analysis
    const interpersonalAnalysis = response.interpersonalAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'interpersonal',
      scores: {}, // No scores needed for text-only display
      primaryType: response.communicationStyle || 'assertive',
      secondaryType: response.conflictResolution || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        interpersonalAnalysis.communicationStrengths || 'Strong communication skills',
        interpersonalAnalysis.conflictStrengths || 'Effective conflict resolution',
        interpersonalAnalysis.emotionalStrengths || 'Good emotional intelligence'
      ].filter(Boolean),
      areasForGrowth: [
        interpersonalAnalysis.communicationGrowthAreas || 'Communication improvement areas',
        interpersonalAnalysis.conflictGrowthAreas || 'Conflict resolution development',
        interpersonalAnalysis.emotionalGrowthAreas || 'Emotional intelligence growth'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }
}

export const relationshipAIService = new RelationshipAIService();
