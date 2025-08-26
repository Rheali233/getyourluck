/**
 * Positive Reframing Service
 * Ensures all test results are presented in a positive, growth-oriented way
 */

export interface ReframingContext {
  testType: string;
  scores: Record<string, number>;
  primaryType?: string;
  secondaryType?: string;
}

export interface ReframedResult {
  interpretation: string;
  strengths: string[];
  areasForGrowth: string[];
  growthOpportunities: string[];
  positivePerspective: string;
}

export class PositiveReframingService {
  /**
   * Reframe test results in a positive, growth-oriented way
   */
  static reframeResults(context: ReframingContext): ReframedResult {
    const { testType, scores, primaryType, secondaryType } = context;

    switch (testType) {
      case 'love_language':
        return this.reframeLoveLanguageResults(scores, primaryType, secondaryType);
      case 'love_style':
        return this.reframeLoveStyleResults(scores, primaryType, secondaryType);
      case 'interpersonal':
        return this.reframeInterpersonalResults(scores);
      default:
        return this.reframeGenericResults(scores);
    }
  }

  /**
   * Reframe love language results positively
   */
  private static reframeLoveLanguageResults(
    scores: Record<string, number>,
    _primaryType?: string,
    _secondaryType?: string
  ): ReframedResult {
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];
    const growthOpportunities: string[] = [];

    // Identify strengths (scores >= 3.5)
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score >= 3.5) {
        strengths.push(`Strong preference for ${this.getLoveLanguageDisplayName(dimension)}`);
      } else if (score <= 2.5) {
        areasForGrowth.push(`Developing appreciation for ${this.getLoveLanguageDisplayName(dimension)}`);
        growthOpportunities.push(`Learn to express and receive love through ${this.getLoveLanguageDisplayName(dimension).toLowerCase()}`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Balanced approach to different love languages');
      strengths.push('Openness to various forms of love expression');
    }

    const interpretation = `You have discovered your unique way of giving and receiving love! `;
    const positivePerspective = `Every love language is valuable, and understanding yours helps you communicate your needs better. `;
    const growthOpportunitiesText = `This knowledge opens up wonderful opportunities to strengthen your relationships.`;

    return {
      interpretation: interpretation + positivePerspective + growthOpportunitiesText,
      strengths,
      areasForGrowth,
      growthOpportunities,
      positivePerspective
    };
  }

  /**
   * Reframe love style results positively
   */
  private static reframeLoveStyleResults(
    scores: Record<string, number>,
    _primaryType?: string,
    _secondaryType?: string
  ): ReframedResult {
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];
    const growthOpportunities: string[] = [];

    // Identify strengths
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score >= 3.5) {
        strengths.push(`Strong ${this.getLoveStyleDisplayName(dimension)} tendencies`);
      } else if (score <= 2.5) {
        areasForGrowth.push(`Developing ${this.getLoveStyleDisplayName(dimension)} aspects`);
        growthOpportunities.push(`Explore how ${this.getLoveStyleDisplayName(dimension).toLowerCase()} can enrich your relationships`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Balanced approach to different love styles');
      strengths.push('Flexibility in relationship dynamics');
    }

    const interpretation = `Your love style is unique and beautiful! `;
    const positivePerspective = `Every love style has its strengths and can lead to fulfilling relationships. `;
    const growthOpportunitiesText = `Understanding your style helps you find compatible partners and grow together.`;

    return {
      interpretation: interpretation + positivePerspective + growthOpportunitiesText,
      strengths,
      areasForGrowth,
      growthOpportunities,
      positivePerspective
    };
  }

  /**
   * Reframe interpersonal results positively
   */
  private static reframeInterpersonalResults(scores: Record<string, number>): ReframedResult {
    const strengths: string[] = [];
    const areasForGrowth: string[] = [];
    const growthOpportunities: string[] = [];

    // Identify strengths and growth areas
    Object.entries(scores).forEach(([dimension, score]) => {
      if (score >= 3.5) {
        strengths.push(`Strong ${this.getInterpersonalDisplayName(dimension)} skills`);
      } else if (score <= 2.5) {
        areasForGrowth.push(`Developing ${this.getInterpersonalDisplayName(dimension)} abilities`);
        growthOpportunities.push(`Practice ${this.getInterpersonalDisplayName(dimension).toLowerCase()} in daily interactions`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Awareness of your interpersonal skills');
      strengths.push('Willingness to grow and improve');
    }

    const interpretation = `You have valuable insights into your social skills! `;
    const positivePerspective = `Every skill can be developed with practice and patience. `;
    const growthOpportunitiesText = `Your awareness is the first step toward building stronger relationships.`;

    return {
      interpretation: interpretation + positivePerspective + growthOpportunitiesText,
      strengths,
      areasForGrowth,
      growthOpportunities,
      positivePerspective
    };
  }

  /**
   * Generic reframing for unknown test types
   */
  private static reframeGenericResults(_scores: Record<string, number>): ReframedResult {
    const strengths = ['Self-awareness and willingness to learn'];
    const areasForGrowth = ['Continuing personal development'];
    const growthOpportunities = ['Use insights to guide your growth journey'];

    return {
      interpretation: 'You\'ve taken an important step in self-discovery!',
      strengths,
      areasForGrowth,
      growthOpportunities,
      positivePerspective: 'Every assessment is an opportunity for growth and self-improvement.'
    };
  }

  /**
   * Helper methods for display names
   */
  private static getLoveLanguageDisplayName(dimension: string): string {
    const names: Record<string, string> = {
      words_of_affirmation: 'Words of Affirmation',
      quality_time: 'Quality Time',
      receiving_gifts: 'Receiving Gifts',
      acts_of_service: 'Acts of Service',
      physical_touch: 'Physical Touch'
    };
    return names[dimension] || dimension;
  }

  private static getLoveStyleDisplayName(dimension: string): string {
    const names: Record<string, string> = {
      eros: 'Passionate Love',
      ludus: 'Playful Love',
      storge: 'Friendship Love',
      mania: 'Intense Love',
      pragma: 'Practical Love',
      agape: 'Altruistic Love'
    };
    return names[dimension] || dimension;
  }

  private static getInterpersonalDisplayName(dimension: string): string {
    const names: Record<string, string> = {
      social_initiative: 'Social Initiative',
      emotional_support: 'Emotional Support',
      conflict_resolution: 'Conflict Resolution',
      boundary_setting: 'Boundary Setting'
    };
    return names[dimension] || dimension;
  }
}
