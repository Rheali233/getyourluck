/**
 * Test Results Component
 * Relationship test results display with charts following development standards
 */

import React from 'react';
import { Button, Card } from '@/components/ui';
import { LoveStyleChart, InterpersonalChart } from './charts';
import type { TestResultsProps } from '../types';
import { cn } from '@/utils/classNames';

export const TestResults: React.FC<TestResultsProps> = ({
  className,
  testId = 'test-results',
  result,
  testType,
  onRetakeTest,
  onShareResult,
  ...props
}) => {
  // Get test type display name
  const getTestTypeDisplayName = (type: string) => {
    switch (type) {
      case 'love_language':
        return 'Love Language Test Results';
      case 'love_style':
        return 'Love Style Assessment Results';
      case 'interpersonal':
        return 'Interpersonal Skills Results';
      default:
        return 'Test Results';
    }
  };

  // Get primary type display name
  const getPrimaryTypeDisplayName = (type: string) => {
    switch (type) {
      case 'words_of_affirmation':
        return 'Words of Affirmation';
      case 'quality_time':
        return 'Quality Time';
      case 'receiving_gifts':
        return 'Receiving Gifts';
      case 'acts_of_service':
        return 'Acts of Service';
      case 'physical_touch':
        return 'Physical Touch';
      case 'eros':
        return 'Passionate Love (Eros)';
      case 'ludus':
        return 'Playful Love (Ludus)';
      case 'storge':
        return 'Friendship Love (Storge)';
      case 'mania':
        return 'Possessive Love (Mania)';
      case 'pragma':
        return 'Practical Love (Pragma)';
      case 'agape':
        return 'Altruistic Love (Agape)';
      case 'social_initiative':
        return 'Social Initiative';
      case 'emotional_support':
        return 'Emotional Support';
      case 'conflict_resolution':
        return 'Conflict Resolution';
      case 'boundary_setting':
        return 'Boundary Setting';
      default:
        return type;
    }
  };

  return (
    <div
      className={cn("min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8 px-4", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {getTestTypeDisplayName(testType)}
          </h1>
          <p className="text-lg text-gray-600">
            Congratulations on completing your assessment!
          </p>
        </div>

        {/* Loading State */}
        {!result && (
          <Card className="bg-white shadow-lg p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Your Results</h3>
            <p className="text-gray-600">Please wait while we analyze your answers and create your personalized report...</p>
          </Card>
        )}

        {/* Error State */}
        {!result && (
          <Card className="bg-red-50 border border-red-200 p-6 mb-8">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">No Results Available</h3>
              <p className="text-red-600 mb-4">Unable to load test results. Please try taking the test again.</p>
              <Button
                onClick={onRetakeTest}
                variant="outline"
                size="small"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Your Love Language Profile - Simplified Layout */}
        {testType === 'love_language' && result.scores && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Love Language Profile
            </h2>
            
            {/* AI Generated Summary */}
            <div className="text-center mb-6">
              <p className="text-gray-700 leading-relaxed">
                {result.summary || `Based on your ${testType} test results, you have completed a comprehensive assessment that reveals your unique relationship communication patterns. Your primary love language is ${result.primaryType}, with ${result.secondaryType} as your secondary preference. This understanding will help you build stronger, more meaningful connections with your partner.`}
              </p>
            </div>
            
            {/* Primary Type */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Primary Love Language
              </h3>
              {result.primaryType && (
                <div>
                  <h4 className="text-xl font-bold text-pink-700 mb-2">
                    {getPrimaryTypeDisplayName(result.primaryType)}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    This is your dominant way of expressing and receiving love. 
                    You naturally communicate affection through this language.
                  </p>
                </div>
              )}
            </div>
            
            {/* Secondary Type */}
            {result.secondaryType && result.secondaryType !== result.primaryType && (
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Secondary Love Language
                </h3>
                <div>
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    {getPrimaryTypeDisplayName(result.secondaryType)}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    This complements your primary love language and provides 
                    additional ways to connect with your partner.
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* Other Test Types - Keep Original Layout */}
        {testType === 'love_style' && result.scores && (
          <div className="mb-8">
            <LoveStyleChart
              scores={result.scores as any}
              dominantStyle={result.primaryType || ''}
              secondaryStyle={result.secondaryType || ''}
              testId="love-style-results-chart"
            />
          </div>
        )}
        
        {testType === 'interpersonal' && result.scores && (
          <div className="mb-8">
            <InterpersonalChart
              scores={result.scores as any}
              overallScore={Object.values(result.scores).reduce((sum, score) => sum + score, 0) / 4}
              testId="interpersonal-results-chart"
            />
          </div>
        )}



        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Relationship Advice */}
        {result.relationshipAdvice && result.relationshipAdvice.length > 0 && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Relationship Improvement Tips
            </h3>
            <div className="space-y-3">
              {result.relationshipAdvice.map((advice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{advice}</span>
                </div>
              ))}
            </div>
          </Card>
        )}


      </div>
    </div>
  );
};
