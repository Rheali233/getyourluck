/**
 * PHQ-9 Risk Level Progress Bar Component
 * Visualizes current score position within risk levels
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

interface PHQ9RiskLevelProgressBarProps extends BaseComponentProps {
  score: number;
  maxScore?: number;
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  riskLevelName: string;
}

export const PHQ9RiskLevelProgressBar: React.FC<PHQ9RiskLevelProgressBarProps> = ({
  className,
  testId = 'phq9-risk-level-progress-bar',
  score,
  maxScore = 27,
  riskLevel,
  riskLevelName,
  ...props
}) => {
  // Risk level configuration
  const riskLevels = [
    { level: 'minimal', name: 'No Depression', min: 0, max: 4, color: 'from-green-400 to-green-500', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { level: 'mild', name: 'Mild Depression', min: 5, max: 9, color: 'from-yellow-400 to-yellow-500', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { level: 'moderate', name: 'Moderate Depression', min: 10, max: 14, color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { level: 'moderately_severe', name: 'Moderately Severe Depression', min: 15, max: 19, color: 'from-red-400 to-red-500', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { level: 'severe', name: 'Severe Depression', min: 20, max: 27, color: 'from-red-600 to-red-700', bgColor: 'bg-red-200', textColor: 'text-red-900' }
  ];

  // Calculate progress percentage
  const progressPercentage = (score / maxScore) * 100;
  
  // Get risk level for current score
  const currentLevel = riskLevels.find(level => score >= level.min && score <= level.max) || riskLevels[0];

  return (
    <Card className={cn("p-6 bg-white", className)} data-testid={testId} {...props}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
        <span className="text-xl mr-2">⚠️</span>
        Depression Risk Level Assessment
      </h3>
      
      <div className="space-y-6">
        {/* Current score and risk level */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3 shadow-lg">
            <span className="text-white text-2xl font-bold">{score}</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-900 mb-2">{currentLevel?.name || 'Unknown Level'}</h4>
          <p className="text-gray-600">Total Score: {score}/{maxScore}</p>
        </div>
        
        {/* Risk level progress bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Risk Level Progress</span>
            <span className="text-sm text-gray-500">{progressPercentage.toFixed(1)}%</span>
          </div>
          
          {/* Main progress bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={cn(
                  "h-4 rounded-full transition-all duration-1000 ease-out",
                  `bg-gradient-to-r ${currentLevel?.color || 'from-gray-400 to-gray-500'}`
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            {/* Risk level markers */}
            <div className="relative mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                {riskLevels.map((level) => (
                  <div key={level.level} className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mb-1"></div>
                    <span className="text-center max-w-16">{level.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk level detailed description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskLevels.map((level) => (
            <div
              key={level.level}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-300",
                level.level === riskLevel
                  ? `${level.bgColor} border-current ${level.textColor}`
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className={cn(
                  "font-semibold",
                  level.level === riskLevel ? level.textColor : "text-gray-700"
                )}>
                  {level.name}
                </h5>
                <span className={cn(
                  "text-sm font-medium",
                  level.level === riskLevel ? level.textColor : "text-gray-500"
                )}>
                  {level.min}-{level.max} points
                </span>
              </div>
              
              {level.level === riskLevel && (
                <div className="text-sm">
                  <p className="mb-2">
                    <strong>Current Status:</strong> Your score is in the {level.name} range
                  </p>
                  {level.level === 'minimal' && (
                    <p>Your mental health is good, continue to maintain a positive attitude towards life.</p>
                  )}
                  {level.level === 'mild' && (
                    <p>You may be experiencing mild emotional distress, it is recommended to pay attention to your mental health.</p>
                  )}
                  {level.level === 'moderate' && (
                    <p>You may be experiencing moderate depressive symptoms, it is recommended to seek professional help.</p>
                  )}
                  {level.level === 'moderately_severe' && (
                    <p>You may be experiencing moderately severe depressive symptoms, strongly recommend seeking professional help.</p>
                  )}
                  {level.level === 'severe' && (
                    <p>You may be experiencing severe depressive symptoms, please seek immediate medical help.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Important notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-800 mb-2">Important Reminder</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• This test result is for reference only and cannot replace professional medical diagnosis</li>
            <li>• If you experience persistent depressive emotions, please seek professional help promptly</li>
            <li>• Seeking help is a brave act, you are not alone</li>
            <li>• If you have suicidal thoughts, please contact a mental health hotline or seek medical attention immediately</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
