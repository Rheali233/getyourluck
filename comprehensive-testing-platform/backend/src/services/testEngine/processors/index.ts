/**
 * 测试结果处理器索引文件
 * 导出所有处理器和工厂类
 */

export { TestResultProcessorFactory } from '../TestResultProcessor'
export type { TestResultProcessor } from '../TestResultProcessor'
export { MBTIResultProcessor } from './MBTIResultProcessor'
export { PHQ9ResultProcessor } from './PHQ9ResultProcessor'
export { EQResultProcessor } from './EQResultProcessor'
export { HappinessResultProcessor } from './HappinessResultProcessor'
export { HollandResultProcessor } from './HollandResultProcessor'
export { DISCResultProcessor } from './DISCResultProcessor'
export { LeadershipResultProcessor } from './LeadershipResultProcessor'
export { LoveLanguageResultProcessor } from './LoveLanguageResultProcessor'
export { LoveStyleResultProcessor } from './LoveStyleResultProcessor'
export { InterpersonalResultProcessor } from './InterpersonalResultProcessor'
export { VARKResultProcessor } from './VARKResultProcessor'
// export { CognitiveResultProcessor } from './CognitiveResultProcessor'
export { TarotResultProcessor } from './TarotResultProcessor'
export { NumerologyResultProcessor } from './NumerologyResultProcessor'

// 导出处理器类型
export type ProcessorType = 'mbti' | 'phq9' | 'eq' | 'happiness' | 'holland' | 'disc' | 'leadership' | 'love_language' | 'love_style' | 'interpersonal' | 'vark' | 'tarot' | 'numerology'

// 处理器映射
export const PROCESSOR_MAP = {
  mbti: 'MBTIResultProcessor',
  phq9: 'PHQ9ResultProcessor',
  eq: 'EQResultProcessor',
  happiness: 'HappinessResultProcessor',
  holland: 'HollandResultProcessor',
  disc: 'DISCResultProcessor',
  leadership: 'LeadershipResultProcessor',
  love_language: 'LoveLanguageResultProcessor',
  love_style: 'LoveStyleResultProcessor',
  interpersonal: 'InterpersonalResultProcessor',
  vark: 'VARKResultProcessor',
  // raven removed
  tarot: 'TarotResultProcessor',
  numerology: 'NumerologyResultProcessor'
} as const
