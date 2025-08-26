/**
 * Emotional Intelligence Test Result Display Component
 * Psychological test result display component following unified development standards
 * Includes five-dimensional analysis and emotional intelligence improvement plan
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface EQDimension {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  strengths: string[];
  improvementAreas: string[];
}

export interface EQResult {
  totalScore: number;
  maxScore: number;
  overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  levelName: string;
  levelDescription: string;
  dimensions: EQDimension[];
  overallAnalysis: string;
  improvementPlan: {
    shortTerm: string[];
    longTerm: string[];
    dailyPractices: string[];
  };
  careerImplications: string[];
  relationshipInsights: string[];
}

export interface EQResultDisplayProps extends BaseComponentProps {
  result: EQResult;
  onReset: () => void;
  onPractice?: () => void;
}

export const EQResultDisplay: React.FC<EQResultDisplayProps> = ({
  className,
  testId = 'eq-result-display',
  result,
  onReset,
  onPractice,
  ...props
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-red-600 bg-red-50 border-red-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'expert': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      case 'expert': return '🏆';
      default: return '🌱';
    }
  };



  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-8 px-4", className)} data-testid={testId} {...props}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall result */}
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
          <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto text-4xl shadow-lg", 
            getLevelColor(result.overallLevel).split(' ')[0] === 'text-red-600' ? 'bg-red-100' :
            getLevelColor(result.overallLevel).split(' ')[0] === 'text-yellow-600' ? 'bg-yellow-100' :
            getLevelColor(result.overallLevel).split(' ')[0] === 'text-blue-600' ? 'bg-blue-100' :
            getLevelColor(result.overallLevel).split(' ')[0] === 'text-green-600' ? 'bg-green-100' : 'bg-gray-100'
          )}>
            {getLevelIcon(result.overallLevel)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.levelName}</h2>
          <div className={cn("inline-block px-6 py-2 rounded-full text-sm font-medium border mb-4", getLevelColor(result.overallLevel))}>
            Total Score: {result.totalScore}/{result.maxScore}
          </div>
          <div className="text-center text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
            <p className="mb-2">
              <strong>Scoring Explanation:</strong> This test is based on Daniel Goleman's five core dimensions of emotional intelligence, each dimension has a maximum score of {result.maxScore / 5} points, and the total score for five dimensions is {result.maxScore} points.
            </p>
            <p>
              The dimensions are: Self-awareness, Self-management, Motivation, Empathy, and Social skills, comprehensively reflecting your emotional intelligence level.
            </p>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            {result.levelDescription}
          </p>
        </Card>



        {/* Dimensional emotional intelligence analysis */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Dimensional Emotional Intelligence Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.dimensions.map((dimension, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">{dimension.name}</h4>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Score</span>
                    <span className="text-sm font-medium text-gray-900">
                      {dimension.score}/{dimension.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(dimension.score / dimension.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{dimension.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-700 text-sm mb-2">Strengths:</h5>
                    <ul className="space-y-1">
                       {dimension.strengths.map((strength, idx) => (
                         <li key={idx} className="text-xs text-green-600">• {strength}</li>
                       ))}
                     </ul>
                   </div>
                   <div>
                     <h5 className="font-medium text-blue-700 text-sm mb-2">Improvement Areas:</h5>
                     <ul className="space-y-1">
                       {dimension.improvementAreas.map((area, idx) => (
                         <li key={idx} className="text-xs text-blue-600">• {area}</li>
                       ))}
                     </ul>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </Card>



        {/* Improvement plan */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Emotional Intelligence Improvement Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Short-term Goals</h4>
              <ul className="space-y-2">
                {result.improvementPlan.shortTerm.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-2 font-bold">{index + 1}.</span>
                    <span className="text-black text-sm leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Long-term Goals</h4>
              <ul className="space-y-2">
                {result.improvementPlan.longTerm.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-2 font-bold">{index + 1}.</span>
                    <span className="text-black text-sm leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
               <h4 className="font-semibold text-gray-800 mb-3">Daily Practices</h4>
               <ul className="space-y-2">
                 {result.improvementPlan.dailyPractices.map((practice, index) => (
                   <li key={index} className="flex items-start">
                     <span className="text-black mr-2 font-bold">{index + 1}.</span>
                     <span className="text-black text-sm leading-relaxed">{practice}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </Card>

        {/* Career and relationship insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="text-2xl mr-2">💼</span>
              Career Development Impact
            </h3>
            <ul className="space-y-2">
              {result.careerImplications.map((implication, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 text-lg">•</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{implication}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🤝</span>
              Relationship Insights
            </h3>
            <ul className="space-y-2">
              {result.relationshipInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 text-lg">•</span>
                  <span className="text-gray-700 text-sm leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>



        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p>
            Emotional intelligence test results are for reference only, aimed at helping you understand your emotional management abilities.
            Emotional intelligence can be continuously improved through learning and practice, and persistent effort will bring significant improvement.
          </p>
        </div>
      </div>
    </div>
  );
};
