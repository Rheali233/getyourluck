/**
 * Interpersonal Skills Bar Chart Component
 * Displays four interpersonal dimensions in a bar chart
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { InterpersonalScores } from '../../services/answerProcessing';

export interface InterpersonalChartProps extends BaseComponentProps {
  scores: InterpersonalScores;
  overallScore?: number;
}

export const InterpersonalChart: React.FC<InterpersonalChartProps> = ({
  className,
  testId = 'interpersonal-chart',
  scores,
  overallScore,
  ...props
}) => {
  // Convert scores to chart data
  const chartData = [
    { 
      dimension: 'Social Initiative', 
      score: scores.social_initiative, 
      color: '#3B82F6',
      description: 'Starting conversations and social interactions'
    },
    { 
      dimension: 'Emotional Support', 
      score: scores.emotional_support, 
      color: '#10B981',
      description: 'Providing empathy and emotional care'
    },
    { 
      dimension: 'Conflict Resolution', 
      score: scores.conflict_resolution, 
      color: '#F59E0B',
      description: 'Resolving disagreements constructively'
    },
    { 
      dimension: 'Boundary Setting', 
      score: scores.boundary_setting, 
      color: '#8B5CF6',
      description: 'Setting and maintaining personal boundaries'
    }
  ];

  const maxScore = 5;
  const maxBarHeight = 120;

  // Calculate bar heights
  const getBarHeight = (score: number) => {
    return (score / maxScore) * maxBarHeight;
  };

  // Get score level description
  const getScoreLevel = (score: number) => {
    if (score >= 4.0) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 3.0) return { level: 'Good', color: 'text-blue-600' };
    if (score >= 2.0) return { level: 'Fair', color: 'text-yellow-600' };
    return { level: 'Developing', color: 'text-red-600' };
  };

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-lg ${className}`}
      data-testid={testId}
      {...props}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Your Interpersonal Skills Profile
      </h3>

      {/* Overall Score */}
      {overallScore && (
        <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {overallScore.toFixed(1)}/5
          </div>
          <div className="text-sm text-blue-700">
            Overall Interpersonal Skills Score
          </div>
        </div>
      )}
      
      {/* Bar Chart */}
      <div className="space-y-6">
        {chartData.map((item, index) => {
          const barHeight = getBarHeight(item.score);
          const scoreLevel = getScoreLevel(item.score);
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">
                    {item.dimension}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-semibold ${scoreLevel.color}`}>
                    {item.score.toFixed(1)}/5
                  </div>
                  <div className={`text-xs ${scoreLevel.color}`}>
                    {scoreLevel.level}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(item.score / maxScore) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
              
              {/* Score Bar */}
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="absolute bottom-0 w-full transition-all duration-500"
                  style={{ 
                    height: `${barHeight}px`,
                    backgroundColor: item.color
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 text-center text-white text-sm font-medium">
                  {item.score.toFixed(1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Score Levels:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>4.0-5.0: Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>3.0-3.9: Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>2.0-2.9: Fair</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>1.0-1.9: Developing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
