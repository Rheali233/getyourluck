// Psychology test module component exports

// Result display components
export { MBTIResultDisplay } from './MBTIResultDisplay';
export { MBTIRelationshipMatrix } from './MBTIRelationshipMatrix';
export { PHQ9ResultDisplay } from './PHQ9ResultDisplay';
// Removed unused chart components
export { PHQ9SymptomFilter } from './PHQ9SymptomFilter';
export { AnimatedCard } from './AnimatedCard';
export { ResponsiveGrid, GridLayouts } from './ResponsiveGrid';
export { EQResultDisplay } from './EQResultDisplay';
export { HappinessResultDisplay } from './HappinessResultDisplay';

// Page components
export { PsychologyHomePage } from './PsychologyHomePage';
export { PsychologyTestContainer } from './PsychologyTestContainer';

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
