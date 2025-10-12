// 更新为温和的level词汇
export const EQ_LEVELS = {
  'Needs Improvement': { min: 0, max: 40 },
  'Average': { min: 41, max: 60 },
  'Good': { min: 61, max: 80 },
  'Very Good': { min: 81, max: 90 },
  'Excellent': { min: 91, max: 100 }
} as const;

export type EQLevel = keyof typeof EQ_LEVELS;
