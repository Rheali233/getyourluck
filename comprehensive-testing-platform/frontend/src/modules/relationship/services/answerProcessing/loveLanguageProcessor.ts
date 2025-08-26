/**
 * Love Language Answer Processor
 * Processes answers and calculates scores for the five love languages
 */

import type { LoveLanguageQuestion, UserAnswer } from '../../types';

export interface LoveLanguageScores {
  words_of_affirmation: number;
  quality_time: number;
  receiving_gifts: number;
  acts_of_service: number;
  physical_touch: number;
}

export interface LoveLanguageResult {
  scores: LoveLanguageScores;
  primaryType: string;
  secondaryType: string;
  totalScore: number;
  averageScore: number;
  interpretation: string;
}

export class LoveLanguageProcessor {
  /**
   * Process answers and calculate love language scores
   */
  static processAnswers(
    questions: LoveLanguageQuestion[],
    answers: UserAnswer[]
  ): LoveLanguageResult {
    // Initialize score counters
    const scores: LoveLanguageScores = {
      words_of_affirmation: 0,
      quality_time: 0,
      receiving_gifts: 0,
      acts_of_service: 0,
      physical_touch: 0
    };

    const dimensionCounts = {
      words_of_affirmation: 0,
      quality_time: 0,
      receiving_gifts: 0,
      acts_of_service: 0,
      physical_touch: 0
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
    const averageScores: LoveLanguageScores = {
      words_of_affirmation: dimensionCounts.words_of_affirmation > 0 ? scores.words_of_affirmation / dimensionCounts.words_of_affirmation : 0,
      quality_time: dimensionCounts.quality_time > 0 ? scores.quality_time / dimensionCounts.quality_time : 0,
      receiving_gifts: dimensionCounts.receiving_gifts > 0 ? scores.receiving_gifts / dimensionCounts.receiving_gifts : 0,
      acts_of_service: dimensionCounts.acts_of_service > 0 ? scores.acts_of_service / dimensionCounts.acts_of_service : 0,
      physical_touch: dimensionCounts.physical_touch > 0 ? scores.physical_touch / dimensionCounts.physical_touch : 0
    };

    // Calculate total and average scores
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalQuestions = answers.length;
    const averageScore = totalQuestions > 0 ? totalScore / totalQuestions : 0;

    // Determine primary and secondary love languages
    const sortedDimensions = Object.entries(averageScores)
      .sort(([, a], [, b]) => b - a)
      .map(([dimension]) => dimension);

    const primaryType = sortedDimensions[0];
    const secondaryType = sortedDimensions[1];

    // Generate interpretation
    const interpretation = this.generateInterpretation(averageScores, primaryType || '', secondaryType || '');

    return {
      scores: averageScores,
      primaryType: primaryType || '',
      secondaryType: secondaryType || '',
      totalScore,
      averageScore,
      interpretation
    };
  }

  /**
   * Generate interpretation based on scores
   */
  private static generateInterpretation(
    scores: LoveLanguageScores,
    primaryType: string,
    secondaryType: string
  ): string {
    const primaryScore = scores[primaryType as keyof LoveLanguageScores];
    const secondaryScore = scores[secondaryType as keyof LoveLanguageScores];

    let interpretation = `Your primary love language is ${this.getLoveLanguageDisplayName(primaryType)} `;
    interpretation += `with a score of ${primaryScore.toFixed(1)}/5. `;
    interpretation += `Your secondary love language is ${this.getLoveLanguageDisplayName(secondaryType)} `;
    interpretation += `with a score of ${secondaryScore.toFixed(1)}/5. `;

    if (primaryScore >= 4.0) {
      interpretation += `You have a very strong preference for ${this.getLoveLanguageDisplayName(primaryType)}. `;
    } else if (primaryScore >= 3.0) {
      interpretation += `You have a moderate preference for ${this.getLoveLanguageDisplayName(primaryType)}. `;
    } else {
      interpretation += `You have a mild preference for ${this.getLoveLanguageDisplayName(primaryType)}. `;
    }

    interpretation += `This means you feel most loved when others express their affection through ${this.getLoveLanguageDisplayName(primaryType).toLowerCase()}. `;
    interpretation += `Understanding this can help you communicate your needs better and help others love you in the way you prefer.`;

    return interpretation;
  }

  /**
   * Get display name for love language dimension
   */
  private static getLoveLanguageDisplayName(dimension: string): string {
    const displayNames: Record<string, string> = {
      words_of_affirmation: 'Words of Affirmation',
      quality_time: 'Quality Time',
      receiving_gifts: 'Receiving Gifts',
      acts_of_service: 'Acts of Service',
      physical_touch: 'Physical Touch'
    };
    return displayNames[dimension] || dimension;
  }
}
