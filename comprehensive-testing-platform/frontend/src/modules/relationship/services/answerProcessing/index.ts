/**
 * Answer Processing Services Index
 * Export all answer processors for easy importing
 */

export { LoveLanguageProcessor } from './loveLanguageProcessor.js';
export { LoveStyleProcessor } from './loveStyleProcessor.js';
export { InterpersonalProcessor } from './interpersonalProcessor.js';

// Export types
export type { LoveLanguageScores, LoveLanguageResult } from './loveLanguageProcessor.js';
export type { LoveStyleScores, LoveStyleResult } from './loveStyleProcessor.js';
export type { InterpersonalScores, InterpersonalResult } from './interpersonalProcessor.js';
