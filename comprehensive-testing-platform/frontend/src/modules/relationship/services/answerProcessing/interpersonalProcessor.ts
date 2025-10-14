/**
 * Interpersonal Skills Answer Processor
 * Processes answers and calculates scores for interpersonal skills
 */

import type { InterpersonalQuestion, UserAnswer } from '../../types';

export interface InterpersonalScores {
  social_initiative: number;
  emotional_support: number;
  conflict_resolution: number;
  boundary_setting: number;
}

export interface InterpersonalResult {
  scores: InterpersonalScores;
  overallScore: number;
  strengths: string[];
  areasForGrowth: string[];
  interpretation: string;
  recommendations: string[];
}

export class InterpersonalProcessor {
  /**
   * Process answers and calculate interpersonal skill scores
   */
  static processAnswers(
    questions: InterpersonalQuestion[],
    answers: UserAnswer[]
  ): InterpersonalResult {
    // Initialize score counters
    const scores: InterpersonalScores = {
      social_initiative: 0,
      emotional_support: 0,
      conflict_resolution: 0,
      boundary_setting: 0
    };

    const dimensionCounts = {
      social_initiative: 0,
      emotional_support: 0,
      conflict_resolution: 0,
      boundary_setting: 0
    };

    // Calculate scores for each dimension
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question && typeof answer.answer === 'number') {
        const dimension = question.dimension;
        scores[dimension] += answer.answer;
        dimensionCounts[dimension]++;
      }
    });

    // Calculate average scores for each dimension
    const averageScores: InterpersonalScores = {
      social_initiative: dimensionCounts.social_initiative > 0 ? scores.social_initiative / dimensionCounts.social_initiative : 0,
      emotional_support: dimensionCounts.emotional_support > 0 ? scores.emotional_support / dimensionCounts.emotional_support : 0,
      conflict_resolution: dimensionCounts.conflict_resolution > 0 ? scores.conflict_resolution / dimensionCounts.conflict_resolution : 0,
      boundary_setting: dimensionCounts.boundary_setting > 0 ? scores.boundary_setting / dimensionCounts.boundary_setting : 0
    };

    // Calculate overall score
    const overallScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0) / 4;

    // Identify strengths and areas for growth
    const strengths = this.identifyStrengths(averageScores);
    const areasForGrowth = this.identifyAreasForGrowth(averageScores);

    // Generate interpretation
    const interpretation = this.generateInterpretation(averageScores, overallScore, strengths, areasForGrowth);
    const recommendations = this.generateRecommendations(averageScores, areasForGrowth);

    return {
      scores: averageScores,
      overallScore,
      strengths,
      areasForGrowth,
      interpretation,
      recommendations
    };
  }

  /**
   * Identify strengths (scores >= 4.0)
   */
  private static identifyStrengths(scores: InterpersonalScores): string[] {
    const strengths: string[] = [];
    
    if (scores.social_initiative >= 4.0) {
      strengths.push('Strong social initiative and networking skills');
    }
    if (scores.emotional_support >= 4.0) {
      strengths.push('Excellent emotional support and empathy');
    }
    if (scores.conflict_resolution >= 4.0) {
      strengths.push('Strong conflict resolution abilities');
    }
    if (scores.boundary_setting >= 4.0) {
      strengths.push('Good boundary setting and self-advocacy');
    }

    return strengths.length > 0 ? strengths : ['You have a balanced approach to interpersonal skills'];
  }

  /**
   * Identify areas for growth (scores <= 2.5)
   */
  private static identifyAreasForGrowth(scores: InterpersonalScores): string[] {
    const areas: string[] = [];
    
    if (scores.social_initiative <= 2.5) {
      areas.push('Social initiative and networking');
    }
    if (scores.emotional_support <= 2.5) {
      areas.push('Emotional support and empathy');
    }
    if (scores.conflict_resolution <= 2.5) {
      areas.push('Conflict resolution and communication');
    }
    if (scores.boundary_setting <= 2.5) {
      areas.push('Boundary setting and self-advocacy');
    }

    return areas;
  }

  /**
   * Generate interpretation based on scores
   */
  private static generateInterpretation(
    _scores: InterpersonalScores,
    overallScore: number,
    strengths: string[]: string[]
  ): string {
    let interpretation = `Your overall interpersonal skills score is ${overallScore.toFixed(1)}/5. `;

    if (overallScore >= 4.0) {
      interpretation += 'You have excellent interpersonal skills and are very effective in social situations. ';
    } else if (overallScore >= 3.0) {
      interpretation += 'You have good interpersonal skills with room for improvement in specific areas. ';
    } else {
      interpretation += 'You have developing interpersonal skills and can benefit from focused improvement efforts. ';
    }

    if (strengths.length > 0) {
      interpretation += `Your strengths include: ${strengths.join(', ')}. `;
    }

    if (_areasForGrowth.length > 0) {
      interpretation += `Areas for growth include: ${_areasForGrowth.join(', ')}. `;
    }

    interpretation += 'Focusing on these areas can significantly improve your relationships and social interactions.';

    return interpretation;
  }

  /**
   * Generate recommendations based on scores
   */
  private static generateRecommendations(
    scores: InterpersonalScores: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (scores.social_initiative <= 2.5) {
      recommendations.push('Practice starting conversations with new people in low-pressure situations');
      recommendations.push('Join social groups or clubs to build networking skills');
    }

    if (scores.emotional_support <= 2.5) {
      recommendations.push('Practice active listening by focusing on others\' feelings');
      recommendations.push('Learn to validate others\' emotions without trying to fix them');
    }

    if (scores.conflict_resolution <= 2.5) {
      recommendations.push('Practice using "I" statements to express concerns');
      recommendations.push('Learn to take breaks during heated discussions');
    }

    if (scores.boundary_setting <= 2.5) {
      recommendations.push('Practice saying "no" to small requests to build confidence');
      recommendations.push('Identify your core values and priorities');
    }

    return recommendations.length > 0 ? recommendations : ['Continue developing your interpersonal skills through practice and reflection'];
  }
}
