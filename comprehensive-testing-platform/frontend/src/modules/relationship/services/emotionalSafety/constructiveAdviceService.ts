/**
 * Constructive Advice Service
 * Generates practical, actionable advice for relationship improvement
 */

export interface AdviceContext {
  testType: string;
  scores: Record<string, number>;
  primaryType?: string;
  secondaryType?: string;
  areasForGrowth: string[];
}

export interface ConstructiveAdvice {
  immediateActions: string[];
  shortTermGoals: string[];
  longTermDevelopment: string[];
  relationshipTips: string[];
  selfCareSuggestions: string[];
  resources: string[];
}

export class ConstructiveAdviceService {
  /**
   * Generate constructive advice based on test results
   */
  static generateAdvice(context: AdviceContext): ConstructiveAdvice {
    const { testType, scores, primaryType, secondaryType, areasForGrowth } = context;

    switch (testType) {
      case 'love_language':
        return this.generateLoveLanguageAdvice(scores, primaryType, secondaryType, areasForGrowth);
      case 'love_style':
        return this.generateLoveStyleAdvice(scores, primaryType, secondaryType, areasForGrowth);
      case 'interpersonal':
        return this.generateInterpersonalAdvice(scores, areasForGrowth);
      default:
        return this.generateGenericAdvice(areasForGrowth);
    }
  }

  /**
   * Generate love language specific advice
   */
  private static generateLoveLanguageAdvice(
    _scores: Record<string, number>,
    primaryType?: string,
    _secondaryType?: string,
    _areasForGrowth: string[] = []
  ): ConstructiveAdvice {
    const immediateActions: string[] = [];
    const shortTermGoals: string[] = [];
    const longTermDevelopment: string[] = [];
    const relationshipTips: string[] = [];
    const selfCareSuggestions: string[] = [];
    const resources: string[] = [];

    // Immediate actions
    if (primaryType) {
      immediateActions.push(`Practice expressing love through ${this.getLoveLanguageDisplayName(primaryType).toLowerCase()}`);
      immediateActions.push('Share your love language preferences with your partner');
    }

    // Short term goals
    shortTermGoals.push('Learn to recognize when others are expressing love in different languages');
    shortTermGoals.push('Practice giving love in your partner\'s preferred language');

    // Long term development
    longTermDevelopment.push('Develop flexibility in expressing and receiving love');
    longTermDevelopment.push('Build deeper understanding of different love expressions');

    // Relationship tips
    relationshipTips.push('Communicate openly about your love language needs');
    relationshipTips.push('Be patient as you learn new ways to express love');
    relationshipTips.push('Celebrate small improvements in love expression');

    // Self care suggestions
    selfCareSuggestions.push('Practice self-love in your preferred language');
    selfCareSuggestions.push('Recognize and appreciate your own love expressions');

    // Resources
    resources.push('Read "The 5 Love Languages" by Gary Chapman');
    resources.push('Practice daily love language exercises');
    resources.push('Join love language discussion groups');

    return {
      immediateActions,
      shortTermGoals,
      longTermDevelopment,
      relationshipTips,
      selfCareSuggestions,
      resources
    };
  }

  /**
   * Generate love style specific advice
   */
  private static generateLoveStyleAdvice(
    _scores: Record<string, number>,
    primaryType?: string,
    _secondaryType?: string,
    _areasForGrowth: string[] = []
  ): ConstructiveAdvice {
    const immediateActions: string[] = [];
    const shortTermGoals: string[] = [];
    const longTermDevelopment: string[] = [];
    const relationshipTips: string[] = [];
    const selfCareSuggestions: string[] = [];
    const resources: string[] = [];

    // Immediate actions
    if (primaryType) {
      immediateActions.push(`Embrace your ${this.getLoveStyleDisplayName(primaryType).toLowerCase()} tendencies`);
      immediateActions.push('Identify partners who complement your love style');
    }

    // Short term goals
    shortTermGoals.push('Learn about other love styles and their benefits');
    shortTermGoals.push('Develop flexibility in your relationship approach');

    // Long term development
    longTermDevelopment.push('Build balanced relationships that honor all love styles');
    longTermDevelopment.push('Develop healthy boundaries while maintaining your style');

    // Relationship tips
    relationshipTips.push('Communicate your love style to potential partners');
    relationshipTips.push('Be open to different relationship dynamics');
    relationshipTips.push('Focus on compatibility and mutual understanding');

    // Self care suggestions
    selfCareSuggestions.push('Honor your natural relationship preferences');
    selfCareSuggestions.push('Develop self-awareness about your love patterns');

    // Resources
    resources.push('Explore relationship psychology resources');
    resources.push('Practice mindfulness in relationships');
    resources.push('Seek relationship counseling if needed');

    return {
      immediateActions,
      shortTermGoals,
      longTermDevelopment,
      relationshipTips,
      selfCareSuggestions,
      resources
    };
  }

  /**
   * Generate interpersonal skills advice
   */
  private static generateInterpersonalAdvice(
    _scores: Record<string, number>,
    _areasForGrowth: string[] = []
  ): ConstructiveAdvice {
    const immediateActions: string[] = [];
    const shortTermGoals: string[] = [];
    const longTermDevelopment: string[] = [];
    const relationshipTips: string[] = [];
    const selfCareSuggestions: string[] = [];
    const resources: string[] = [];

    // Immediate actions
    immediateActions.push('Practice one new social skill each day');
    immediateActions.push('Start with low-pressure social situations');

    // Short term goals
    shortTermGoals.push('Improve one interpersonal skill each month');
    shortTermGoals.push('Seek feedback from trusted friends');

    // Long term development
    longTermDevelopment.push('Build a strong social support network');
    longTermDevelopment.push('Develop emotional intelligence and empathy');

    // Relationship tips
    relationshipTips.push('Practice active listening in conversations');
    relationshipTips.push('Learn to express your needs clearly');
    relationshipTips.push('Develop conflict resolution strategies');

    // Self care suggestions
    selfCareSuggestions.push('Practice self-compassion in social situations');
    selfCareSuggestions.push('Take breaks when social interactions become overwhelming');

    // Resources
    resources.push('Read books on communication skills');
    resources.push('Take social skills workshops');
    resources.push('Practice with role-playing exercises');

    return {
      immediateActions,
      shortTermGoals,
      longTermDevelopment,
      relationshipTips,
      selfCareSuggestions,
      resources
    };
  }

  /**
   * Generate generic advice
   */
  private static generateGenericAdvice(_areasForGrowth: string[] = []): ConstructiveAdvice {
    return {
      immediateActions: ['Reflect on your test results', 'Identify one area to focus on'],
      shortTermGoals: ['Set small, achievable goals', 'Track your progress'],
      longTermDevelopment: ['Commit to continuous personal growth', 'Celebrate your achievements'],
      relationshipTips: ['Be patient with yourself', 'Seek support when needed'],
      selfCareSuggestions: ['Practice self-compassion', 'Take time for self-reflection'],
      resources: ['Personal development books', 'Professional counseling if needed']
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
}
