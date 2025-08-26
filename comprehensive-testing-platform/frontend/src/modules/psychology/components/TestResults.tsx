/**
 * Test Results Component
 * Displays appropriate result display components based on test type
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import { 
  MBTIResultDisplay, 
  PHQ9ResultDisplay, 
  EQResultDisplay, 
  HappinessResultDisplay
} from './index';
import type { TestResult, MBTIResult, PHQ9Result, EQResult, HappinessResult } from '../types';

interface TestResultsProps {
  results: TestResult;
  onReset: () => void;
  onBackToHome: () => void;
  className?: string;
  testId?: string;
}

export const TestResults: React.FC<TestResultsProps> = ({
  className,
  testId = 'test-results',
  results,
  onReset,
  onBackToHome,
  ...props
}) => {
  // Test result data

  // Render appropriate result display component based on test type
  const renderResultComponent = () => {
    switch (results.testType) {
      case 'mbti':
        return (
          <MBTIResultDisplay
            result={results.result as MBTIResult}
            onReset={onReset}
            onShare={() => {
              // Share functionality to be implemented
            }}
          />
        );
      
      case 'phq9':
        return (
          <PHQ9ResultDisplay
            result={results.result as PHQ9Result}
            onReset={onReset}
            onSeekHelp={() => {
              // Seek help functionality to be implemented
            }}
          />
        );
      
      case 'eq':
        return (
          <EQResultDisplay
            result={results.result as EQResult}
            onReset={onReset}
            onPractice={() => {
              // Start practice functionality to be implemented
            }}
          />
        );
      
      case 'happiness':
        return (
          <HappinessResultDisplay
            result={results.result as HappinessResult}
            onReset={onReset}
            onStartJourney={() => {
              // Start happiness journey functionality to be implemented
            }}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Results</h2>
            <p className="text-gray-600 mb-8">Unknown test type</p>
            <button
              onClick={onReset}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retake Test
            </button>
          </div>
        );
    }
  };

  return (
    <div className={cn("min-h-screen", className)} data-testid={testId} {...props}>
      {renderResultComponent()}
    </div>
  );
};
