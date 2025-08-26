/**
 * Love Style Answer Processor
 * Processes answers and calculates scores for the six love styles
 */

import type { LoveStyleQuestion, UserAnswer } from '../../types';

export interface LoveStyleScores {
  eros: number;
  ludus: number;
  storge: number;
  mania: number;
  pragma: number;
  agape: number;
}

export interface LoveStyleResult {
  scores: LoveStyleScores;
  dominantStyle: string;
  secondaryStyle: string;
  totalScore: number;
  averageScore: number;
  interpretation: string;
  compatibilityInsights: string[];
}

export class LoveStyleProcessor {
  /**
   * Process answers and calculate love style scores
   */
  static processAnswers(
    questions: LoveStyleQuestion[],
    answers: UserAnswer[]
  ): LoveStyleResult {
    // Initialize score counters
    const scores: LoveStyleScores = {
      eros: 0,
      ludus: 0,
      storge: 0,
      mania: 0,
      pragma: 0,
      agape: 0
    };

    const dimensionCounts = {
      eros: 0,
      ludus: 0,
      storge: 0,
      mania: 0,
      pragma: 0,
      agape: 0
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
    const averageScores: LoveStyleScores = {
      eros: dimensionCounts.eros > 0 ? scores.eros / dimensionCounts.eros : 0,
      ludus: dimensionCounts.ludus > 0 ? scores.ludus / dimensionCounts.ludus : 0,
      storge: dimensionCounts.storge > 0 ? scores.storge / dimensionCounts.storge : 0,
      mania: dimensionCounts.mania > 0 ? scores.mania / dimensionCounts.mania : 0,
      pragma: dimensionCounts.pragma > 0 ? scores.pragma / dimensionCounts.pragma : 0,
      agape: dimensionCounts.agape > 0 ? scores.agape / dimensionCounts.agape : 0
    };

    // Calculate total and average scores
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalQuestions = answers.length;
    const averageScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

    // Determine dominant and secondary love styles
    const sortedDimensions = Object.entries(averageScores)
      .sort(([, a], [, b]) => b - a)
      .map(([dimension]) => dimension);

    const dominantStyle = sortedDimensions[0];
    const secondaryStyle = sortedDimensions[1];

    // Generate interpretation
    const interpretation = this.generateInterpretation(averageScores, dominantStyle || '', secondaryStyle || '');
    const compatibilityInsights = this.generateCompatibilityInsights(averageScores, dominantStyle || '');

    return {
      scores: averageScores,
      dominantStyle: dominantStyle || '',
      secondaryStyle: secondaryStyle || '',
      totalScore,
      averageScore,
      interpretation,
      compatibilityInsights
    };
  }

  /**
   * Generate interpretation based on scores
   */
  private static generateInterpretation(
    scores: LoveStyleScores,
    dominantStyle: string,
    secondaryStyle: string
  ): string {
    const dominantScore = scores[dominantStyle as keyof LoveStyleScores];
    const secondaryScore = scores[secondaryStyle as keyof LoveStyleScores];

    let interpretation = `Your dominant love style is ${this.getLoveStyleDisplayName(dominantStyle)} `;
    interpretation += `with a score of ${dominantScore.toFixed(1)}/5. `;
    interpretation += `Your secondary love style is ${this.getLoveStyleDisplayName(secondaryStyle)} `;
    interpretation += `with a score of ${secondaryScore.toFixed(1)}/5. `;

    interpretation += `This combination suggests that you approach relationships with a ${this.getLoveStyleDescription(dominantStyle)}. `;
    interpretation += `Understanding your love style can help you build more compatible and fulfilling relationships.`;

    return interpretation;
  }

  /**
   * Generate compatibility insights
   */
  private static generateCompatibilityInsights(
    _scores: LoveStyleScores,
    dominantStyle: string
  ): string[] {
    const insights: string[] = [];

    // Add general insights based on dominant style
    switch (dominantStyle) {
      case 'eros':
        insights.push('You value passionate, romantic connections');
        insights.push('Look for partners who share your intensity and emotional depth');
        insights.push('Physical attraction and chemistry are important to you');
        break;
      case 'ludus':
        insights.push('You enjoy the playful, fun aspects of dating');
        insights.push('Seek partners who share your sense of humor and playfulness');
        insights.push('Keep relationships light and enjoyable');
        break;
      case 'storge':
        insights.push('You prefer relationships that develop from friendship');
        insights.push('Look for partners who share your values and interests');
        insights.push('Build relationships slowly and steadily');
        break;
      case 'mania':
        insights.push('You experience intense emotional highs and lows');
        insights.push('Work on developing emotional stability and self-love');
        insights.push('Seek partners who can provide emotional security');
        break;
      case 'pragma':
        insights.push('You value practical compatibility and shared goals');
        insights.push('Look for partners who align with your life plans');
        insights.push('Focus on long-term compatibility and stability');
        break;
      case 'agape':
        insights.push('You believe in unconditional love and selfless giving');
        insights.push('Seek partners who appreciate your nurturing nature');
        insights.push('Remember to also receive love and care');
        break;
    }

    return insights;
  }

  /**
   * Get display name for love style dimension
   */
  private static getLoveStyleDisplayName(dimension: string): string {
    const displayNames: Record<string, string> = {
      eros: 'Passionate Love (Eros)',
      ludus: 'Playful Love (Ludus)',
      storge: 'Friendship Love (Storge)',
      mania: 'Possessive Love (Mania)',
      pragma: 'Practical Love (Pragma)',
      agape: 'Altruistic Love (Agape)'
    };
    return displayNames[dimension] || dimension;
  }

  /**
   * Get description for love style
   */
  private static getLoveStyleDescription(dimension: string): string {
    const descriptions: Record<string, string> = {
      eros: 'passionate and emotionally intense approach',
      ludus: 'playful and fun-loving approach',
      storge: 'friendship-based and steady approach',
      mania: 'intense and sometimes possessive approach',
      pragma: 'practical and goal-oriented approach',
      agape: 'selfless and nurturing approach'
    };
    return descriptions[dimension] || 'unique approach';
  }
}
