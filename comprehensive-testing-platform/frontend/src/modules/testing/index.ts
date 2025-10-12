/**
 * Testing Module Index
 * Exports all public interfaces and components
 */

// Core types and interfaces
export * from './types/TestTypes';
export * from './core/TestFlow';

// Store
export { useTestStore } from './stores/useTestStore';

// Core components
export { TestContainer } from './components/TestContainer';
export { QuestionDisplay } from './components/QuestionDisplay';
export { TestProgress } from './components/TestProgress';

// Test implementations
export { PHQ9Test } from './implementations/PHQ9Test';

// Example pages

// Services
export { questionService, QuestionService } from './services/QuestionService';
export type { QuestionServiceResponse, QuestionsByType } from './services/QuestionService';
