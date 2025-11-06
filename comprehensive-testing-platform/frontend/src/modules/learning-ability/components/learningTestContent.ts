export interface LearningTestPageContent {
  heroDescription: string;
  stats: {
    estimatedMinutes: number;
    format: string;
    insightLabel: string;
  };
  instructionPoints: string[];
  theoreticalPoints: string[];
  disclaimerPoints: string[];
  supportMessage?: string;
  questionCount?: number;
}

export interface LearningTestSeoMeta {
  title: string;
  description: string;
  keywords: string[];
}

const TEST_PAGE_CONTENT: Record<string, LearningTestPageContent> = {
  vark: {
    heroDescription:
      'Free research-informed VARK learning style assessment with instant insights. No account required and not a professional evaluation.',
    stats: {
      estimatedMinutes: 9,
      format: 'Multiple selection',
      insightLabel: 'AI guidance'
    },
    questionCount: 16,
    instructionPoints: [
      'Answer based on how you naturally prefer to absorb and process information.',
      'Select every option that applies — multiple selections are allowed for each scenario.',
      'Complete the test in one sitting to receive the most consistent learning profile.'
    ],
    theoreticalPoints: [
      'Grounded in the VARK learning styles model developed by Neil Fleming and Charles Bonwell.',
      'Explores visual, auditory, reading/writing, and kinesthetic learning preferences.',
      'Designed to translate learning psychology research into practical study strategies.'
    ],
    disclaimerPoints: [
      'For educational and self-reflection purposes only — not a professional assessment.',
      'Use the insights to support study planning rather than as definitive ability labels.',
      'Consult an educational specialist if you need formal evaluation or tailored intervention.'
    ]
  },
  cognitive: {
    heroDescription:
      'Free research-informed cognitive skills checkup with instant guidance. No account required and not a clinical diagnosis.',
    stats: {
      estimatedMinutes: 12,
      format: 'Task-based',
      insightLabel: 'AI guidance'
    },
    questionCount: 20,
    instructionPoints: [
      'Follow the instructions for each interactive task carefully before starting.',
      'Focus on your natural pace — the assessment explores working memory and processing.',
      'Ensure a quiet environment to minimize distractions during task completion.'
    ],
    theoreticalPoints: [
      'Inspired by contemporary cognitive psychology and neuropsychological assessment research.',
      'Screens attention, processing speed, working memory, and executive function patterns.',
      'Supports self-awareness and coaching conversations about cognitive strengths.'
    ],
    disclaimerPoints: [
      'For educational screening only — not a neuropsychological diagnosis.',
      'Use results as prompts for learning strategies, not as definitive clinical conclusions.',
      'Seek professional help if you experience ongoing cognitive or attention challenges.'
    ],
    supportMessage:
      'Need tailored support? Connect with educational psychologists or learning coaches for personalized guidance.'
  }
};

const DEFAULT_TEST_CONTENT: LearningTestPageContent = {
  heroDescription:
    'Free research-informed learning assessment with instant guidance. Not a professional evaluation and no account needed.',
  stats: {
    estimatedMinutes: 10,
    format: 'Single choice',
    insightLabel: 'AI guidance'
  },
  questionCount: 20,
  instructionPoints: [
    'Answer honestly based on your learning habits and study routines.',
    'Trust your instinctive response without overthinking each question.',
    'Try to complete the assessment in a quiet setting for better focus.'
  ],
  theoreticalPoints: [
    'Built on research-informed learning psychology frameworks.',
    'Transforms academic research into easy-to-understand insights.',
    'Helps you plan practical adjustments to support learning progress.'
  ],
  disclaimerPoints: [
    'For educational and self-reflection purposes only — not a professional assessment.',
    'Results do not replace specialized educational evaluation or tutoring.',
    'Seek professional guidance if learning challenges significantly affect daily life.'
  ]
};

export const getLearningTestContent = (testType: string): LearningTestPageContent => {
  return TEST_PAGE_CONTENT[testType] || DEFAULT_TEST_CONTENT;
};

export const getLearningSeoMeta = (
  testType: string,
  fallbackTitle: string,
  fallbackDescription?: string
): LearningTestSeoMeta => {
  const seoConfigs: Record<string, LearningTestSeoMeta> = {
    vark: {
      title: 'Free VARK Learning Style Test | SelfAtlas',
      description:
        'Discover your learning preferences with the free VARK learning style test. Get instant study strategies across visual, auditory, reading/writing, and kinesthetic learning modes.',
      keywords: [
        'vark test',
        'learning style test',
        'learning assessment',
        'study strategies',
        'visual learner test',
        'auditory learner test',
        'kinesthetic learning'
      ]
    },
    cognitive: {
      title: 'Free Cognitive Skills Assessment | SelfAtlas',
      description:
        'Check cognitive strengths with a free research-informed assessment. Explore attention, working memory, processing speed, and executive skills. Instant guidance, not a diagnosis.',
      keywords: [
        'cognitive test',
        'cognitive assessment',
        'learning ability test',
        'executive function test',
        'working memory test',
        'attention assessment'
      ]
    }
  };

  if (seoConfigs[testType]) {
    return seoConfigs[testType];
  }

  return {
    title: `Free ${fallbackTitle} | SelfAtlas`,
    description:
      fallbackDescription ||
      'Take a free learning assessment to understand your study preferences. Receive instant insights and guidance. Not a professional evaluation.',
    keywords: ['learning test', 'learning assessment', 'study strategies', 'learning ability']
  };
};

export const LEARNING_TEST_TYPES: string[] = [
  'mbti',
  'phq9',
  'eq',
  'happiness',
  'vark',
  'love_language',
  'love_style',
  'interpersonal',
  'holland',
  'disc',
  'leadership'
];
