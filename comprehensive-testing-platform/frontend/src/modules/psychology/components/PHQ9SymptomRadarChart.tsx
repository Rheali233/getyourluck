/**
 * PHQ-9 Symptom Severity Radar Chart Component
 * Implemented with pure CSS + Tailwind, no additional dependencies required
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

interface PHQ9SymptomRadarChartProps extends BaseComponentProps {
  symptoms: Symptom[];
  maxScore?: number;
}

export const PHQ9SymptomRadarChart: React.FC<PHQ9SymptomRadarChartProps> = ({
  className,
  testId = 'phq9-symptom-radar-chart',
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

  // Calculate radar chart angle
  const getAngle = (index: number, total: number) => {
    return (index * 360) / total - 90; // Start from 12 o'clock direction
  };

  // Calculate radar chart position
  const getPosition = (index: number, total: number, radius: number) => {
    const angle = getAngle(index, total);
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  // Generate radar chart path
  const generateRadarPath = (symptoms: Symptom[], radius: number) => {
    if (symptoms.length === 0) return '';
    
    const points = symptoms.map((symptom, index) => {
      const scoreRadius = (symptom.score / maxScore) * radius;
      const scoreX = Math.cos((getAngle(index, symptoms.length) * Math.PI) / 180) * scoreRadius;
      const scoreY = Math.sin((getAngle(index, symptoms.length) * Math.PI) / 180) * scoreRadius;
      return `${scoreX + radius},${scoreY + radius}`;
    });
    
    return `M ${points.join(' L ')} Z`;
  };

  // Generate grid path (commented out, not used)
  // const generateGridPath = (symptoms: Symptom[], radius: number) => {
  //   if (symptoms.length === 0) return '';
    
  //   const points = symptoms.map((symptom, index) => {
  //     const { x, y } = getPosition(index, symptoms.length, radius);
  //     return `${x + radius},${y + radius}`;
  //   });
    
  //   return `M ${points.join(' L ')} Z`;
  // };

  const chartRadius = 120;
  const centerX = chartRadius;
  const centerY = chartRadius;

  return (
    <Card className={cn("p-6 bg-white", className)} data-testid={testId} {...props}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
        <span className="text-xl mr-2">📊</span>
        Symptom Severity Radar Chart
      </h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Radar Chart */}
        <div className="flex-1 flex justify-center">
          <div className="relative" style={{ width: chartRadius * 2, height: chartRadius * 2 }}>
            {/* SVG Radar Chart */}
            <svg
              width={chartRadius * 2}
              height={chartRadius * 2}
              className="absolute inset-0"
            >
              {/* Background Grid */}
              <g className="text-gray-300">
                {/* Concentric Circles Grid */}
                {[0.25, 0.5, 0.75, 1].map((scale, index) => (
                  <circle
                    key={index}
                    cx={centerX}
                    cy={centerY}
                    r={chartRadius * scale}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}
                
                {/* Radial Lines Grid */}
                {symptoms.map((_, index) => {
                  const position = getPosition(index, symptoms.length, chartRadius);
                  return (
                    <line
                      key={index}
                      x1={centerX}
                      y1={centerY}
                      x2={position.x + centerX}
                      y2={position.y + centerY}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  );
                })}
              </g>
              
              {/* Symptom Score Area */}
              <path
                d={generateRadarPath(symptoms, chartRadius)}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="transition-all duration-500 ease-in-out"
              />
              
              {/* Symptom Points */}
              {symptoms.map((symptom, index) => {
                const scoreRadius = (symptom.score / maxScore) * chartRadius;
                const scoreX = Math.cos((getAngle(index, symptoms.length) * Math.PI) / 180) * scoreRadius;
                const scoreY = Math.sin((getAngle(index, symptoms.length) * Math.PI) / 180) * scoreRadius;
                
                return (
                  <g key={index}>
                    {/* Connection Lines */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={scoreX + centerX}
                      y2={scoreY + centerY}
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    {/* Symptom Points */}
                    <circle
                      cx={scoreX + centerX}
                      cy={scoreY + centerY}
                      r="4"
                      fill="rgb(59, 130, 246)"
                      className="transition-all duration-300 ease-in-out hover:r-6"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Symptom Labels */}
            {symptoms.map((symptom, index) => {
              const { x, y } = getPosition(index, symptoms.length, chartRadius + 20);
              const label = symptomLabels[symptom.name as keyof typeof symptomLabels] || symptom.name;
              
              return (
                <div
                  key={index}
                  className="absolute text-xs text-gray-600 font-medium text-center"
                  style={{
                    left: x + centerX - 30,
                    top: y + centerY - 10,
                    width: 60,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend Description */}
        <div className="lg:w-48 space-y-3">
          <div className="text-sm text-gray-600">
            <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Symptom Score Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 bg-opacity-20 rounded mr-2"></div>
                <span>Symptom Severity Area</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <h4 className="font-semibold text-gray-800 mb-2">Scoring Criteria</h4>
            <div className="space-y-1">
              <div>0 points: Not at all</div>
              <div>1 point: Several days</div>
              <div>2 points: More than half the days</div>
              <div>3 points: Nearly every day</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
