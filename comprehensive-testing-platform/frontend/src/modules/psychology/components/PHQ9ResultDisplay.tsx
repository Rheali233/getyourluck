/**
 * PHQ-9 Depression Risk Assessment Result Display Component
 * Psychology test result display component following unified development standards
 * Focuses on psychological safety and professional advice
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { PHQ9Result } from '../types';
import { cn } from '@/utils/classNames';

import { AnimatedCard } from './AnimatedCard';
import { ResponsiveGrid, GridLayouts } from './ResponsiveGrid';

export interface PHQ9ResultDisplayProps extends BaseComponentProps {
  result: PHQ9Result;
  onReset: () => void;
  onSeekHelp?: () => void;
}

export const PHQ9ResultDisplay: React.FC<PHQ9ResultDisplayProps> = ({
  className,
  testId = 'phq9-result-display',
  result,
  onReset,
  onSeekHelp,
  ...props
}) => {
  return (
    <div className={cn("bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4", className)} data-testid={testId} {...props}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Overall Score Card */}
        <AnimatedCard delay={0} direction="up">
          <Card className="p-6 text-center bg-white/80 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
              <span className="text-white text-xl font-bold">{result.totalScore}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{result.riskLevelName}</h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto">
              {result.riskDescription}
            </p>
          </Card>
        </AnimatedCard>



        {/* Symptom Analysis */}
        <AnimatedCard delay={1000} direction="up">
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
              <span className="text-xl mr-2">📊</span>
              Symptom Detailed Analysis
            </h3>
            
            {/* Scoring Rules Explanation */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-900 mb-2">📋 PHQ-9 Scoring Rules Explanation</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Scoring Standard:</strong> Each symptom is scored 0-3 points</p>
                <p><strong>0 points:</strong> Not at all (not in the past 2 weeks)</p>
                <p><strong>1 point:</strong> Several days (a few days in the past 2 weeks)</p>
                <p><strong>2 points:</strong> More than half the days (more than half the time in the past 2 weeks)</p>
                <p><strong>3 points:</strong> Nearly every day (almost every day in the past 2 weeks)</p>
                <p><strong>Total Score Range:</strong> 0-27 points</p>
                <p><strong>Risk Levels:</strong> 0-4 points (No depression), 5-9 points (Mild), 10-14 points (Moderate), 15-19 points (Moderately severe), 20-27 points (Severe)</p>
              </div>
            </div>
            
            <ResponsiveGrid {...GridLayouts.symptoms}>
              {result.symptoms.map((symptom, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{symptom.name}</span>
                    <span className="text-sm text-gray-600">Score: {symptom.score}</span>
                  </div>
                  <p className="text-sm text-gray-600">{symptom.description}</p>
                </div>
              ))}
            </ResponsiveGrid>
          </Card>
        </AnimatedCard>

        {/* Suggestions and Help */}
        <AnimatedCard delay={1200} direction="up">
          <ResponsiveGrid {...GridLayouts.recommendations}>
            {/* Suggestions */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 text-base">•</span>
                    <span className="text-gray-700 leading-relaxed text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Professional Help */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center">
                <span className="text-xl mr-2">🏥</span>
                Professional Help
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.professionalHelp.needed 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {result.professionalHelp.needed ? 'Help Needed' : 'No Help Needed'}
                  </span>
                  {result.professionalHelp.needed && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.professionalHelp.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      result.professionalHelp.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {result.professionalHelp.urgency === 'high' ? 'Urgent' :
                       result.professionalHelp.urgency === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {result.professionalHelp.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-700">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </ResponsiveGrid>
        </AnimatedCard>

        {/* Follow-up Suggestions */}
        <AnimatedCard delay={1400} direction="up">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="text-2xl mr-2">📋</span>
              Follow-up Suggestions
            </h3>
            <p className="text-gray-700 leading-relaxed">{result.followUpAdvice}</p>
          </Card>
        </AnimatedCard>



        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-3xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This test result is for reference only and cannot replace professional medical diagnosis.
            If you experience persistent depressive emotions or need help, please consult a mental health expert or doctor promptly.
            Remember, seeking help is a brave act, you are not alone.
          </p>
        </div>
      </div>
    </div>
  );
};
