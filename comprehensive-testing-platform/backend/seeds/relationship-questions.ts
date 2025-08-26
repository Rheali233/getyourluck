/**
 * Relationship Module question bank seed data
 * Comprehensive collection of all relationship assessment tests
 */

export { loveStyleQuestions, loveStyleOptions, loveStyleCategory, loveStyleConfigs } from './love-style-questions';
export { loveLanguageQuestions, loveLanguageOptions, loveLanguageCategory, loveLanguageConfigs } from './love-language-questions';
export { interpersonalQuestions, interpersonalOptions, interpersonalCategory, interpersonalConfigs } from './interpersonal-questions';

// Relationship module master configuration
export const relationshipModuleConfig = {
  tests: [
    {
      id: 'love-style-category',
      name: 'Love Style Assessment',
      code: 'love_style',
      description: 'Assessment of romantic relationship styles based on John Alan Lee\'s Love Styles Theory',
      questionCount: 30,
      dimensions: ['Eros', 'Ludus', 'Storge', 'Pragma', 'Mania', 'Agape'],
      estimatedTime: 15
    },
    {
      id: 'love-language-category',
      name: 'Love Language Test',
      code: 'love_language',
      description: 'Assessment of how you prefer to give and receive love based on Gary Chapman\'s 5 Love Languages',
      questionCount: 30,
      dimensions: ['Words_of_Affirmation', 'Quality_Time', 'Receiving_Gifts', 'Acts_of_Service', 'Physical_Touch'],
      estimatedTime: 15
    },
    {
      id: 'interpersonal-category',
      name: 'Interpersonal Skills Assessment',
      code: 'interpersonal',
      description: 'Comprehensive assessment of interpersonal communication and relationship skills',
      questionCount: 30,
      dimensions: ['Communication_Skills', 'Empathy', 'Conflict_Resolution', 'Trust_Building', 'Social_Skills'],
      estimatedTime: 15
    }
  ],
  moduleInfo: {
    name: 'Relationship Assessment Module',
    description: 'Comprehensive relationship testing platform covering love styles, love languages, and interpersonal skills',
    version: '1.0.0',
    lastUpdated: '2025-01-25'
  }
};
