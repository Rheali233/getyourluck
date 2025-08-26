/**
 * PHQ-9 Symptom Score Bar Chart Component
 * Displays score comparison for 9 symptoms
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

interface Symptom {
  name: string;
  score: number;
  description: string;
}

interface PHQ9SymptomBarChartProps extends BaseComponentProps {
  symptoms: Symptom[];
  maxScore?: number;
}

export const PHQ9SymptomBarChart: React.FC<PHQ9SymptomBarChartProps> = ({
  className,
  testId = 'phq9-symptom-bar-chart',
  symptoms,
  maxScore = 3,
  ...props
}) => {
  // Symptom name mapping (simplified display)
  const symptomLabels = {
    'anhedonia': 'Anhedonia',
    'depressed_mood': 'Depressed Mood',
    'sleep_problems': 'Sleep Problems',
    'fatigue': 'Fatigue',
    'appetite_changes': 'Appetite Changes',
    'guilt_feelings': 'Guilt Feelings',
    'poor_concentration': 'Poor Concentration',
    'psychomotor_changes': 'Psychomotor Changes',
    'suicidal_thoughts': 'Suicidal Thoughts'
  };

  // Get symptom severity color
  const getSeverityColor = (score: number) => {
    if (score === 0) return 'bg-green-100 text-green-800';
    if (score === 1) return 'bg-yellow-100 text-yellow-800';
    if (score === 2) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // Get symptom severity description
  const getSeverityDescription = (score: number) => {
    if (score === 0) return 'None';
    if (score === 1) return 'Mild';
    if (score === 2) return 'Moderate';
    return 'Severe';
  };

  return (
    <Card className={cn("p-6 bg-white", className)} data-testid={testId} {...props}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
        <span className="text-xl mr-2">📈</span>
        Symptom Score Detailed Analysis
      </h3>
      
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">None (0 points)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Mild (1 point)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Moderate (2 points)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Severe (3 points)</span>
          </div>
        </div>
        
        {/* Symptom Bar Chart */}
        <div className="space-y-4">
          {symptoms.map((symptom, index) => {
            const percentage = (symptom.score / maxScore) * 100;
            const label = symptomLabels[symptom.name as keyof typeof symptomLabels] || symptom.name;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{label}</h4>
                    <p className="text-xs text-gray-500">{symptom.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getSeverityColor(symptom.score)
                    )}>
                      {getSeverityDescription(symptom.score)}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 min-w-[2rem] text-right">
                      {symptom.score}/{maxScore}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={cn(
                        "h-3 rounded-full transition-all duration-1000 ease-out",
                        symptom.score === 0 ? 'bg-green-400' :
                        symptom.score === 1 ? 'bg-yellow-400' :
                        symptom.score === 2 ? 'bg-orange-400' : 'bg-red-400'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {/* Score Markers */}
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Statistics Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Symptom Statistics Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {symptoms.filter(s => s.score === 0).length}
              </div>
              <div className="text-gray-600">No Symptoms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {symptoms.filter(s => s.score === 1).length}
              </div>
              <div className="text-gray-600">Mild Symptoms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {symptoms.filter(s => s.score === 2).length}
              </div>
              <div className="text-gray-600">Moderate Symptoms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {symptoms.filter(s => s.score === 3).length}
              </div>
              <div className="text-gray-600">Severe Symptoms</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
