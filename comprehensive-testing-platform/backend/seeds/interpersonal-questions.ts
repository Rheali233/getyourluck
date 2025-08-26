/**
 * Interpersonal Skills Assessment question bank seed data
 * 30 questions covering communication, empathy, conflict resolution, trust building, and social skills
 * All content in English only
 */

import type { 
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData 
} from '../src/models';

// Interpersonal Skills Assessment question bank seed data (30 questions, 5-point Likert scale)
export const interpersonalQuestions: CreatePsychologyQuestionData[] = [
  // Communication Skills dimension questions (6 questions)
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can clearly express my thoughts and feelings to others.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I actively listen when others are speaking to me.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can ask clarifying questions when I don\'t understand something.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can provide constructive feedback to others.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can adapt my communication style to different situations.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can communicate effectively in both one-on-one and group settings.',
    questionType: 'likert_scale',
    dimension: 'Communication_Skills',
    orderIndex: 6,
    weight: 1
  },

  // Empathy dimension questions (6 questions)
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can understand and share the feelings of others.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can see situations from another person\'s perspective.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can recognize when someone needs emotional support.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can respond appropriately to others\' emotional states.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 10,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can show compassion towards others in difficult situations.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can validate others\' feelings without judgment.',
    questionType: 'likert_scale',
    dimension: 'Empathy',
    orderIndex: 12,
    weight: 1
  },

  // Conflict Resolution dimension questions (6 questions)
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can stay calm during disagreements with others.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can find common ground with people who have different opinions.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can compromise when necessary to resolve conflicts.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 15,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can address conflicts directly rather than avoiding them.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 16,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can separate the person from the problem during conflicts.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can work towards win-win solutions in conflicts.',
    questionType: 'likert_scale',
    dimension: 'Conflict_Resolution',
    orderIndex: 18,
    weight: 1
  },

  // Trust Building dimension questions (6 questions)
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can build trust through consistent and reliable behavior.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can keep confidential information private.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 20,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can admit when I make mistakes.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can follow through on my commitments to others.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can be honest even when it\'s difficult.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can show vulnerability when appropriate.',
    questionType: 'likert_scale',
    dimension: 'Trust_Building',
    orderIndex: 24,
    weight: 1
  },

  // Social Skills dimension questions (6 questions)
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can easily start conversations with new people.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 25,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can read social cues and adjust my behavior accordingly.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 26,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can work effectively in group settings.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can build and maintain friendships with different types of people.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 28,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can adapt my communication style to different audiences.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 29,
    weight: 1
  },
  {
    categoryId: 'interpersonal-category',
    questionText: 'I can navigate social situations with confidence and ease.',
    questionType: 'likert_scale',
    dimension: 'Social_Skills',
    orderIndex: 30,
    weight: 1
  }
];

// Likert scale options for all Interpersonal questions
export const interpersonalOptions: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'all-interpersonal-questions',
    optionText: 'Strongly Disagree',
    optionValue: '1',
    optionScore: 1,
    optionDescription: 'Completely does not match my situation',
    orderIndex: 1,
    isCorrect: false
  },
  {
    questionId: 'all-interpersonal-questions',
    optionText: 'Disagree',
    optionValue: '2',
    optionScore: 2,
    optionDescription: 'Mostly does not match my situation',
    orderIndex: 2,
    isCorrect: false
  },
  {
    questionId: 'all-interpersonal-questions',
    optionText: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    optionDescription: 'Partially matches my situation',
    orderIndex: 3,
    isCorrect: false
  },
  {
    questionId: 'all-interpersonal-questions',
    optionText: 'Agree',
    optionValue: '4',
    optionScore: 4,
    optionDescription: 'Mostly matches my situation',
    orderIndex: 4,
    isCorrect: false
  },
  {
    questionId: 'all-interpersonal-questions',
    optionText: 'Strongly Agree',
    optionValue: '5',
    optionScore: 5,
    optionDescription: 'Completely matches my situation',
    orderIndex: 5,
    isCorrect: false
  }
];

// Interpersonal category configuration
export const interpersonalCategory = {
  id: 'interpersonal-category',
  name: 'Interpersonal Skills Assessment',
  code: 'interpersonal',
  description: 'Comprehensive assessment of interpersonal communication and relationship skills',
  questionCount: 30,
  dimensions: ['Communication_Skills', 'Empathy', 'Conflict_Resolution', 'Trust_Building', 'Social_Skills'],
  scoringType: 'likert' as const,
  minScore: 30,
  maxScore: 150,
  estimatedTime: 15
};

// Interpersonal configuration data
export const interpersonalConfigs = [
  {
    id: 'interpersonal-config-1',
    categoryId: 'interpersonal-category',
    configKey: 'dimension_weights',
    configValue: '{"Communication_Skills": 1, "Empathy": 1, "Conflict_Resolution": 1, "Trust_Building": 1, "Social_Skills": 1}',
    configType: 'json' as const,
    description: 'Interpersonal Skills Assessment dimension weights configuration'
  },
  {
    id: 'interpersonal-config-2',
    categoryId: 'interpersonal-category',
    configKey: 'scoring_algorithm',
    configValue: 'dimension_average',
    configType: 'string' as const,
    description: 'Interpersonal Skills Assessment scoring algorithm: dimension average'
  },
  {
    id: 'interpersonal-config-3',
    categoryId: 'interpersonal-category',
    configKey: 'interpretation_rules',
    configValue: '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}',
    configType: 'json' as const,
    description: 'Interpersonal Skills Assessment interpretation threshold rules'
  }
];
