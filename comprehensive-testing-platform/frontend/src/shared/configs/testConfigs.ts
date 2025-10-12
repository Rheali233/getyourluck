/**
 * 测试配置模块
 * 为所有测试类型提供统一的配置信息
 */

export interface TestConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  questionCount: number;
  instructions: {
    preparation: string[];
    answering: string[];
    privacy: string[];
  };
  theoreticalBasis: Array<{
    title: string;
    content: string[];
  }>;
  disclaimers: string[];
  themes: string[];
  sectionOrder: string[];
  metadata?: Record<string, any>;
}

export const testConfigs: Record<string, TestConfig> = {
  // MBTI人格测试
  mbti: {
    id: 'mbti',
    title: 'MBTI Personality Type Indicator',
    description: 'Discover your personality type based on the Myers-Briggs Type Indicator framework.',
    category: 'personality',
    duration: 15,
    questionCount: 20,
    instructions: {
      preparation: [
        'Find a quiet environment where you can focus',
        'Answer honestly based on your natural preferences',
        'Don\'t overthink - go with your first instinct'
      ],
      answering: [
        'Choose the option that best describes you',
        'Consider how you usually are, not how you wish to be',
        'There are no right or wrong answers'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'You can delete your data at any time'
      ]
    },
    theoreticalBasis: [
      {
        title: 'Four Dichotomies',
        content: [
          'Extraversion (E) vs. Introversion (I)',
          'Sensing (S) vs. Intuition (N)',
          'Thinking (T) vs. Feeling (F)',
          'Judging (J) vs. Perceiving (P)'
        ]
      },
      {
        title: 'Scientific Foundation',
        content: [
          'Based on Carl Jung\'s theory of psychological types',
          'Developed by Isabel Myers and Katharine Briggs',
          'Widely used in career counseling and personal development'
        ]
      }
    ],
    disclaimers: [
      'This is not a clinical assessment',
      'Results are for self-discovery purposes only',
      'Personality types can change over time'
    ],
    themes: ['psychology', 'personality', 'self-discovery'],
    sectionOrder: ['preparation', 'questions', 'results', 'interpretation']
  },

  // PHQ-9抑郁筛查
  phq9: {
    id: 'phq9',
    title: 'PHQ-9 Depression Screening',
    description: 'A validated screening tool for depression symptoms.',
    category: 'mental-health',
    duration: 10,
    questionCount: 9,
    instructions: {
      preparation: [
        'Answer based on your experience over the last 2 weeks',
        'Be honest about your current mental state',
        'This is a screening tool, not a diagnosis'
      ],
      answering: [
        'Rate how often you experienced each symptom',
        'Choose the option that best describes your experience',
        'Consider both frequency and severity'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'Consider sharing results with a mental health professional'
      ]
    },
    theoreticalBasis: [
      {
        title: 'Clinical Validation',
        content: [
          'Developed by Dr. Robert Spitzer and colleagues',
          'Widely used in clinical and research settings',
          'Validated across diverse populations'
        ]
      },
      {
        title: 'Symptom Assessment',
        content: [
          'Covers all nine DSM-IV criteria for depression',
          'Measures both frequency and severity of symptoms',
          'Provides standardized scoring and interpretation'
        ]
      }
    ],
    disclaimers: [
      'This is a screening tool, not a diagnosis',
      'Consult a mental health professional for clinical assessment',
      'Results should not replace professional medical advice'
    ],
    themes: ['psychology', 'mental-health', 'depression'],
    sectionOrder: ['preparation', 'questions', 'results', 'resources']
  },

  // 情商测试
  eq: {
    id: 'eq',
    title: 'Emotional Intelligence Assessment',
    description: 'Evaluate your emotional awareness, regulation, and social skills.',
    category: 'emotional-intelligence',
    duration: 20,
    questionCount: 40,
    instructions: {
      preparation: [
        'Reflect on your emotional experiences',
        'Consider how you handle different situations',
        'Be honest about your emotional responses'
      ],
      answering: [
        'Choose the option that best reflects your behavior',
        'Think about typical responses, not ideal ones',
        'Consider both your thoughts and actions'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'Use results for personal growth and development'
      ]
    },
    theoreticalBasis: [
      {
        title: 'EI Framework',
        content: [
          'Self-awareness and self-regulation',
          'Social awareness and relationship management',
          'Motivation and empathy'
        ]
      },
      {
        title: 'Research Basis',
        content: [
          'Based on established EI models',
          'Incorporates current research findings',
          'Designed for practical application'
        ]
      }
    ],
    disclaimers: [
      'This is a self-assessment tool',
      'Results are for personal development purposes',
      'Emotional intelligence can be developed and improved'
    ],
    themes: ['psychology', 'emotional-intelligence', 'personal-development'],
    sectionOrder: ['preparation', 'questions', 'results', 'development']
  },

  // 幸福感测试
  happiness: {
    id: 'happiness',
    title: 'Happiness and Life Satisfaction Assessment',
    description: 'Measure your current happiness levels and life satisfaction.',
    category: 'well-being',
    duration: 12,
    questionCount: 25,
    instructions: {
      preparation: [
        'Reflect on your overall life satisfaction',
        'Consider different areas of your life',
        'Think about both recent and long-term experiences'
      ],
      answering: [
        'Rate your satisfaction with each aspect',
        'Be honest about your current feelings',
        'Consider both positive and negative factors'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'Use insights for personal growth and improvement'
      ]
    },
    theoreticalBasis: [
      {
        title: 'Well-being Research',
        content: [
          'Based on positive psychology research',
          'Incorporates multiple happiness factors',
          'Considers both hedonic and eudaimonic well-being'
        ]
      },
      {
        title: 'Life Domains',
        content: [
          'Personal relationships and social connections',
          'Career and personal achievements',
          'Health and physical well-being',
          'Personal growth and meaning'
        ]
      }
    ],
    disclaimers: [
      'This is a self-assessment tool',
      'Happiness levels can fluctuate over time',
      'Results are for personal insight and development'
    ],
    themes: ['psychology', 'well-being', 'happiness'],
    sectionOrder: ['preparation', 'questions', 'results', 'insights']
  },

  // 霍兰德职业兴趣测试
  holland: {
    id: 'holland',
    title: 'Holland Code Career Interest Assessment',
    description: 'Discover your career interests based on the Holland Code theory.',
    category: 'career',
    duration: 15,
    questionCount: 60,
    instructions: {
      preparation: [
        'Think about activities you enjoy',
        'Consider both work and leisure interests',
        'Focus on what you like, not what you\'re good at'
      ],
      answering: [
        'Choose activities you would enjoy doing',
        'Don\'t worry about skills or qualifications',
        'Go with your natural preferences'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'Use insights for career exploration and planning'
      ]
    },
    theoreticalBasis: [
      {
        title: 'Holland Theory',
        content: [
          'Six personality types: RIASEC',
          'Realistic, Investigative, Artistic',
          'Social, Enterprising, Conventional'
        ]
      },
      {
        title: 'Career Applications',
        content: [
          'Widely used in career counseling',
          'Helps identify suitable career paths',
          'Supports educational and career planning'
        ]
      }
    ],
    disclaimers: [
      'This is a career exploration tool',
      'Interests can change over time',
      'Consider multiple factors in career decisions'
    ],
    themes: ['career', 'interests', 'planning'],
    sectionOrder: ['preparation', 'questions', 'results', 'careers']
  },

  // 爱的语言测试
  loveLanguage: {
    id: 'loveLanguage',
    title: 'Love Language Assessment',
    description: 'Discover your primary love language and how you express and receive love.',
    category: 'relationships',
    duration: 10,
    questionCount: 30,
    instructions: {
      preparation: [
        'Think about romantic and close relationships',
        'Consider how you show love to others',
        'Reflect on what makes you feel loved'
      ],
      answering: [
        'Choose the option that best describes you',
        'Think about your natural preferences',
        'Consider both giving and receiving love'
      ],
      privacy: [
        'Your responses are completely confidential',
        'Results are stored securely and anonymously',
        'Use insights to improve your relationships'
      ]
    },
    theoreticalBasis: [
      {
        title: 'Five Love Languages',
        content: [
          'Words of Affirmation',
          'Acts of Service',
          'Receiving Gifts',
          'Quality Time',
          'Physical Touch'
        ]
      },
      {
        title: 'Research Foundation',
        content: [
          'Based on Dr. Gary Chapman\'s research',
          'Widely used in relationship counseling',
          'Helps improve communication and understanding'
        ]
      }
    ],
    disclaimers: [
      'This is a relationship insight tool',
      'Love languages can vary by relationship',
      'Results are for personal growth and understanding'
    ],
    themes: ['relationships', 'love', 'communication'],
    sectionOrder: ['preparation', 'questions', 'results', 'understanding']
  }
};

// 获取测试配置的辅助函数
export function getTestConfig(testType: string): TestConfig | undefined {
  return testConfigs[testType];
}

// 获取所有测试类型
export function getAllTestTypes(): string[] {
  return Object.keys(testConfigs);
}

// 按类别获取测试类型
export function getTestTypesByCategory(category: string): string[] {
  return Object.values(testConfigs)
    .filter(config => config.category === category)
    .map(config => config.id);
}

// 获取测试配置摘要
export function getTestConfigSummary(testType: string): Partial<TestConfig> | undefined {
  const config = getTestConfig(testType);
  if (!config) return undefined;

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    category: config.category,
    duration: config.duration,
    questionCount: config.questionCount
  };
}
