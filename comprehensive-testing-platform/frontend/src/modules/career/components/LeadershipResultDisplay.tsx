/**
 * Leadership Test Result Display Component
 * Psychology test result display component following unified development standards
 * Based on modern leadership theories
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { ContextualLinks } from '@/components/InternalLinks';

export interface LeadershipDimension {
  name: string;
  level: string;
  description: string;
  strengths: string[];
  improvementAreas: string[];
}

export interface LeadershipResult {
  overallScore: number;
  maxScore: number;
  leadershipLevel: string;
  analysis: string;
  leadershipDimensions: LeadershipDimension[];
  strengths: string[];
  leadershipChallenges: string[];
  developmentPlan: string[];
  mentoringAdvice: string[];
  organizationalImpact: string[];
  recommendations: string[];
}

export interface LeadershipResultDisplayProps extends BaseComponentProps {
  result: LeadershipResult;
  onDevelop?: () => void;
}

export const LeadershipResultDisplay: React.FC<LeadershipResultDisplayProps> = ({
  className,
  testId = 'leadership-result-display',
  result,
  onDevelop,
  ...props
}) => {
  // 保留等级图标映射，颜色分支已不再使用

  const getLevelIcon = (level: string | undefined) => {
    if (!level || typeof level !== 'string') {
      return '❓';
    }
    switch (level.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      case 'expert': return '👑';
      default: return '🌱';
    }
  };

  const getLevelPercentage = (level: string): number => {
    switch (level.toLowerCase()) {
      case 'exceptional': return 95;
      case 'high': return 85;
      case 'good': return 75;
      case 'moderate': return 65;
      case 'developing': return 55;
      case 'needs improvement': return 35;
      default: return 50;
    }
  };

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall result - align layout with MBTI: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
                {getLevelIcon(result.leadershipLevel)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Leadership Assessment</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.analysis || 'Analysis not available'}
              </p>
            </div>
          </div>
        </Card>

        {/* Leadership Dimensions */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Leadership Dimensions Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(result.leadershipDimensions || []).map((dimension, index) => (
              <div key={index} className="p-6 rounded-lg bg-emerald-50 border border-emerald-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">{dimension.name}</h4>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="text-sm font-medium text-gray-900">
                      {dimension.level}
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-1000",
                        getLevelPercentage(dimension.level || 'moderate') >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                        getLevelPercentage(dimension.level || 'moderate') >= 60 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                        "bg-gradient-to-r from-red-400 to-pink-400"
                      )}
                      style={{ width: `${getLevelPercentage(dimension.level || 'moderate')}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{dimension.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-emerald-700 text-sm mb-2">Strengths:</h5>
                    <ul className="space-y-0.5">
                       {(dimension.strengths || []).map((strength, idx) => (
                         <li key={idx} className="text-sm text-gray-600 flex items-start">
                           <span className="text-gray-500 mr-2 mt-0.5">•</span>
                           {strength}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div>
                     <h5 className="font-medium text-teal-700 text-sm mb-2">Improvement Areas:</h5>
                     <ul className="space-y-0.5">
                       {(dimension.improvementAreas || []).map((area, idx) => (
                         <li key={idx} className="text-sm text-gray-600 flex items-start">
                           <span className="text-gray-500 mr-2 mt-0.5">•</span>
                           {area}
                         </li>
                       ))}
                     </ul>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Organizational Impact & Recommendations */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            Organizational Impact & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 text-lg flex items-center">
                <span className="text-2xl mr-2">🏢</span>
                Organizational Impact
              </h4>
              <ul className="space-y-2">
                {(result.organizationalImpact || []).map((impact, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 text-lg flex items-center">
                <span className="text-2xl mr-2">💡</span>
                Recommendations
              </h4>
              <ul className="space-y-2">
                {(result.recommendations || []).map((recommendation, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>


        {/* Development & Mentoring */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🌱</span>
            Development & Mentoring
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 text-lg flex items-center">
                <span className="text-2xl mr-2">📈</span>
                Development Plan
              </h4>
              <ul className="space-y-2">
                {(result.developmentPlan || []).map((plan, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {plan}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 text-lg flex items-center">
                <span className="text-2xl mr-2">🎓</span>
                Mentoring Advice
              </h4>
              <ul className="space-y-2">
                {(result.mentoringAdvice || []).map((advice, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {advice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onDevelop && (
            <button
              onClick={onDevelop}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
            >
              Develop Leadership
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This leadership assessment is based on modern leadership theories and is for educational and professional development purposes only. It should not replace professional leadership training or executive coaching.
          </p>
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="leadership" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'career',
          testId: 'leadership',
        }}
      />
    </div>
  );
};
