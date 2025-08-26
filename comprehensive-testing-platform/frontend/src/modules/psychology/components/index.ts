// Psychology test module component exports
export { TestContainer } from './TestContainer';
export { QuestionDisplay } from './QuestionDisplay';
export { TestProgress } from './TestProgress';
export { TestResults } from './TestResults';
export { TestPreparation } from './TestPreparation';

// Result display components
export { MBTIResultDisplay } from './MBTIResultDisplay';
export { MBTIRelationshipMatrix } from './MBTIRelationshipMatrix';
export { PHQ9ResultDisplay } from './PHQ9ResultDisplay';
export { PHQ9SymptomRadarChart } from './PHQ9SymptomRadarChart';
export { PHQ9RiskLevelProgressBar } from './PHQ9RiskLevelProgressBar';
export { PHQ9SymptomBarChart } from './PHQ9SymptomBarChart';
export { PHQ9SymptomFilter } from './PHQ9SymptomFilter';
export { AnimatedCard } from './AnimatedCard';
export { ResponsiveGrid, GridLayouts } from './ResponsiveGrid';
export { EQResultDisplay } from './EQResultDisplay';
export { HappinessResultDisplay } from './HappinessResultDisplay';

// Page components
export { PsychologyHomePage } from './PsychologyHomePage';

// Performance optimization components
export { PerformanceMonitor } from './PerformanceMonitor';
export { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';




// Export types
export type { 
  TestResult,
  MBTIResult,
  PHQ9Result,
  EQResult,
  HappinessResult
} from '../types';

// Question bank data exports
export { MBTI_QUESTIONS, REVERSE_SCORED_QUESTIONS, DIMENSION_MAPPING } from '../data/mbti-questions';
