/**
 * 心理测试题库种子数据
 * 遵循统一开发标准的数据导入规范
 */

import type { 
  CreatePsychologyQuestionCategoryData,
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData 
} from '../src/models';

// MBTI题库种子数据 - 扩展版本（20题核心题目）
export const mbtiQuestions: CreatePsychologyQuestionData[] = [
  // E/I维度题目
  {
    categoryId: 'mbti-category',
    questionText: '在社交场合中，你通常：',
    questionTextEn: 'In social situations, you usually:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '当你需要充电时，你更喜欢：',
    questionTextEn: 'When you need to recharge, you prefer:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '在团队中，你通常：',
    questionTextEn: 'In a team, you usually:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '面对新环境，你倾向于：',
    questionTextEn: 'Facing new environments, you tend to:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的工作方式是：',
    questionTextEn: 'You prefer to work:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 5,
    weight: 1
  },
  // S/N维度题目
  {
    categoryId: 'mbti-category',
    questionText: '你更关注：',
    questionTextEn: 'You focus more on:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '解决问题时，你倾向于：',
    questionTextEn: 'When solving problems, you tend to:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的学习方式是：',
    questionTextEn: 'You prefer to learn:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更相信：',
    questionTextEn: 'You believe more in:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的信息类型是：',
    questionTextEn: 'You prefer information that is:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 10,
    weight: 1
  },
  // T/F维度题目
  {
    categoryId: 'mbti-category',
    questionText: '做决定时，你更依赖：',
    questionTextEn: 'When making decisions, you rely more on:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更重视：',
    questionTextEn: 'You value more:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '处理冲突时，你倾向于：',
    questionTextEn: 'When handling conflicts, you tend to:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更欣赏：',
    questionTextEn: 'You appreciate more:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的领导风格是：',
    questionTextEn: 'You prefer leadership that is:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 15,
    weight: 1
  },
  // J/P维度题目
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的生活方式是：',
    questionTextEn: 'You prefer a lifestyle that is:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 16,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '面对截止日期，你通常：',
    questionTextEn: 'Facing deadlines, you usually:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的工作环境是：',
    questionTextEn: 'You prefer work environments that are:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的旅行方式是：',
    questionTextEn: 'You prefer to travel:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: '你更喜欢的计划方式是：',
    questionTextEn: 'You prefer to plan:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 20,
    weight: 1
  }
];

// MBTI题目选项种子数据 - 扩展版本
export const mbtiOptions: CreatePsychologyQuestionOptionData[] = [
  // E/I维度选项 - 题目1-5
  {
    questionId: 'mbti-q-1',
    optionText: '主动与他人交谈，享受社交',
    optionTextEn: 'Initiate conversations and enjoy socializing',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-1',
    optionText: '等待他人主动，更喜欢独处',
    optionTextEn: 'Wait for others to approach, prefer solitude',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-2',
    optionText: '与朋友一起放松',
    optionTextEn: 'Relax with friends',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-2',
    optionText: '独自一人安静休息',
    optionTextEn: 'Rest quietly alone',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-3',
    optionText: '积极参与讨论',
    optionTextEn: 'Actively participate in discussions',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-3',
    optionText: '倾听他人观点',
    optionTextEn: 'Listen to others\' views',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-4',
    optionText: '主动认识新朋友',
    optionTextEn: 'Actively meet new people',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-4',
    optionText: '等待合适的时机',
    optionTextEn: 'Wait for the right moment',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-5',
    optionText: '在团队中协作',
    optionTextEn: 'Collaborate in teams',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-5',
    optionText: '独立完成任务',
    optionTextEn: 'Complete tasks independently',
    optionValue: 'I',
    orderIndex: 2
  },
  // S/N维度选项 - 题目6-10
  {
    questionId: 'mbti-q-6',
    optionText: '具体的事实和数据',
    optionTextEn: 'Concrete facts and data',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-6',
    optionText: '抽象的概念和理论',
    optionTextEn: 'Abstract concepts and theories',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-7',
    optionText: '使用已知的方法',
    optionTextEn: 'Use known methods',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-7',
    optionText: '尝试创新的方法',
    optionTextEn: 'Try innovative methods',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-8',
    optionText: '通过实践学习',
    optionTextEn: 'Learn through practice',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-8',
    optionText: '通过理论思考',
    optionTextEn: 'Learn through theoretical thinking',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-9',
    optionText: '现实的经验',
    optionTextEn: 'Realistic experience',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-9',
    optionText: '直觉的预感',
    optionTextEn: 'Intuitive hunches',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-10',
    optionText: '具体和明确的',
    optionTextEn: 'Concrete and specific',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-10',
    optionText: '概括和象征的',
    optionTextEn: 'General and symbolic',
    optionValue: 'N',
    orderIndex: 2
  },
  // T/F维度选项 - 题目11-15
  {
    questionId: 'mbti-q-11',
    optionText: '逻辑分析和客观判断',
    optionTextEn: 'Logical analysis and objective judgment',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-11',
    optionText: '考虑他人感受和价值观',
    optionTextEn: 'Consider others\' feelings and values',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-12',
    optionText: '公平和正义',
    optionTextEn: 'Fairness and justice',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-12',
    optionText: '和谐和同情',
    optionTextEn: 'Harmony and compassion',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-13',
    optionText: '直接指出问题',
    optionTextEn: 'Directly point out problems',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-13',
    optionText: '委婉表达意见',
    optionTextEn: 'Express opinions tactfully',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-14',
    optionText: '能力和成就',
    optionTextEn: 'Ability and achievement',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-14',
    optionText: '关系和情感',
    optionTextEn: 'Relationships and emotions',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-15',
    optionText: '客观的评估',
    optionTextEn: 'Objective evaluation',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-15',
    optionText: '主观的感受',
    optionTextEn: 'Subjective feelings',
    optionValue: 'F',
    orderIndex: 2
  },
  // J/P维度选项 - 题目16-20
  {
    questionId: 'mbti-q-16',
    optionText: '计划和组织，喜欢确定性',
    optionTextEn: 'Plan and organize, prefer certainty',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-16',
    optionText: '保持开放，喜欢灵活性',
    optionTextEn: 'Stay open, prefer flexibility',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-17',
    optionText: '提前完成任务',
    optionTextEn: 'Complete tasks early',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-17',
    optionText: '在最后期限前完成',
    optionTextEn: 'Complete near deadline',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-18',
    optionText: '结构化和有序的',
    optionTextEn: 'Structured and organized',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-18',
    optionText: '灵活和自发的',
    optionTextEn: 'Flexible and spontaneous',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-19',
    optionText: '制定详细计划',
    optionTextEn: 'Make detailed plans',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-19',
    optionText: '随遇而安',
    optionTextEn: 'Go with the flow',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-20',
    optionText: '按计划执行',
    optionTextEn: 'Follow the plan',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-20',
    optionText: '根据情况调整',
    optionTextEn: 'Adjust based on circumstances',
    optionValue: 'P',
    orderIndex: 2
  }
];

// PHQ-9题库种子数据 - 完整9道题目
export const phq9Questions: CreatePsychologyQuestionData[] = [
  {
    categoryId: 'phq9-category',
    questionText: '做事时提不起劲或没有兴趣',
    questionTextEn: 'Little interest or pleasure in doing things',
    questionType: 'likert_scale',
    dimension: 'anhedonia',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '感到心情低落、沮丧或绝望',
    questionTextEn: 'Feeling down, depressed, or hopeless',
    questionType: 'likert_scale',
    dimension: 'depressed_mood',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '入睡困难、睡不安或睡得太多',
    questionTextEn: 'Trouble falling or staying asleep, or sleeping too much',
    questionType: 'likert_scale',
    dimension: 'sleep_problems',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '感到疲倦或精力不足',
    questionTextEn: 'Feeling tired or having little energy',
    questionType: 'likert_scale',
    dimension: 'fatigue',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '食欲不振或吃得过多',
    questionTextEn: 'Poor appetite or overeating',
    questionType: 'likert_scale',
    dimension: 'appetite_changes',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '对自己感觉不好，或觉得自己是个失败者',
    questionTextEn: 'Feeling bad about yourself, or feeling like a failure',
    questionType: 'likert_scale',
    dimension: 'guilt_feelings',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '注意力难以集中，如阅读报纸或看电视时',
    questionTextEn: 'Trouble concentrating on things, such as reading the newspaper or watching television',
    questionType: 'likert_scale',
    dimension: 'poor_concentration',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '行动或说话缓慢到别人已经注意到，或相反，坐立不安，比平时更烦躁',
    questionTextEn: 'Moving or speaking slowly enough that other people could have noticed, or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
    questionType: 'likert_scale',
    dimension: 'psychomotor_changes',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: '有不如死掉或用某种方式伤害自己的想法',
    questionTextEn: 'Thoughts that you would be better off dead or of hurting yourself in some way',
    questionType: 'likert_scale',
    dimension: 'suicidal_thoughts',
    orderIndex: 9,
    weight: 1
  }
];

// PHQ-9题目选项种子数据 - 为所有9道题目创建选项
export const phq9Options: CreatePsychologyQuestionOptionData[] = [
  // 题目1的选项
  {
    questionId: 'phq9-q-1',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-1',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-1',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-1',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目2的选项
  {
    questionId: 'phq9-q-2',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-2',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-2',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-2',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目3的选项
  {
    questionId: 'phq9-q-3',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-3',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-3',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-3',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目4的选项
  {
    questionId: 'phq9-q-4',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-4',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-4',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-4',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目5的选项
  {
    questionId: 'phq9-q-5',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-5',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-5',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-5',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目6的选项
  {
    questionId: 'phq9-q-6',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-6',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-6',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-6',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目7的选项
  {
    questionId: 'phq9-q-7',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-7',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-7',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-7',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目8的选项
  {
    questionId: 'phq9-q-8',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-8',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-8',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-8',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目9的选项
  {
    questionId: 'phq9-q-9',
    optionText: '完全不会',
    optionTextEn: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-9',
    optionText: '几天',
    optionTextEn: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-9',
    optionText: '一半以上的天数',
    optionTextEn: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-9',
    optionText: '几乎每天',
    optionTextEn: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  }
];

// 情商题库种子数据
export const eqQuestions: CreatePsychologyQuestionData[] = [
  {
    categoryId: 'eq-category',
    questionText: '我能够准确识别自己的情绪状态',
    questionTextEn: 'I can accurately identify my emotional state',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: '我能够控制自己的情绪反应',
    questionTextEn: 'I can control my emotional reactions',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: '我能够理解他人的情绪',
    questionTextEn: 'I can understand others\' emotions',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: '我能够有效处理人际关系',
    questionTextEn: 'I can effectively handle relationships',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 4,
    weight: 1
  }
];

// 情商题目选项种子数据
export const eqOptions: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'eq-q-1',
    optionText: '完全不同意',
    optionTextEn: 'Strongly disagree',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 1
  },
  {
    questionId: 'eq-q-1',
    optionText: '不同意',
    optionTextEn: 'Disagree',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 2
  },
  {
    questionId: 'eq-q-1',
    optionText: '中立',
    optionTextEn: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 3
  },
  {
    questionId: 'eq-q-1',
    optionText: '同意',
    optionTextEn: 'Agree',
    optionValue: '4',
    optionScore: 4,
    orderIndex: 4
  },
  {
    questionId: 'eq-q-1',
    optionText: '完全同意',
    optionTextEn: 'Strongly agree',
    optionValue: '5',
    optionScore: 5,
    orderIndex: 5
  }
];

// 幸福指数题库种子数据
export const happinessQuestions: CreatePsychologyQuestionData[] = [
  {
    categoryId: 'happiness-category',
    questionText: '我对我的工作感到满意',
    questionTextEn: 'I am satisfied with my work',
    questionType: 'likert_scale',
    domain: 'work',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'happiness-category',
    questionText: '我与家人和朋友的关系很好',
    questionTextEn: 'I have good relationships with family and friends',
    questionType: 'likert_scale',
    domain: 'relationships',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'happiness-category',
    questionText: '我对我的健康状况感到满意',
    questionTextEn: 'I am satisfied with my health',
    questionType: 'likert_scale',
    domain: 'health',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'happiness-category',
    questionText: '我在个人成长方面有进步',
    questionTextEn: 'I am making progress in personal growth',
    questionType: 'likert_scale',
    domain: 'personal_growth',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'happiness-category',
    questionText: '我的生活平衡得很好',
    questionTextEn: 'My life is well balanced',
    questionType: 'likert_scale',
    domain: 'life_balance',
    orderIndex: 5,
    weight: 1
  }
];

// 幸福指数题目选项种子数据
export const happinessOptions: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'happiness-q-1',
    optionText: '非常不满意',
    optionTextEn: 'Very dissatisfied',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 1
  },
  {
    questionId: 'happiness-q-1',
    optionText: '不满意',
    optionTextEn: 'Dissatisfied',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 2
  },
  {
    questionId: 'happiness-q-1',
    optionText: '一般',
    optionTextEn: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 3
  },
  {
    questionId: 'happiness-q-1',
    optionText: '满意',
    optionTextEn: 'Satisfied',
    optionValue: '4',
    optionScore: 4,
    orderIndex: 4
  },
  {
    questionId: 'happiness-q-1',
    optionText: '非常满意',
    optionTextEn: 'Very satisfied',
    optionValue: '5',
    optionScore: 5,
    orderIndex: 5
  }
];

// 导出所有种子数据
export const psychologyQuestionSeeds = {
  mbti: {
    questions: mbtiQuestions,
    options: mbtiOptions
  },
  phq9: {
    questions: phq9Questions,
    options: phq9Options
  },
  eq: {
    questions: eqQuestions,
    options: eqOptions
  },
  happiness: {
    questions: happinessQuestions,
    options: happinessOptions
  }
}; 