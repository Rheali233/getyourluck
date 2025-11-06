/**
 * DISC Behavior Style Test Result Display Component
 * Psychology test result display component following unified development standards
 * Based on William Marston's DISC theory
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { ContextualLinks } from '@/components/InternalLinks';

export interface DISCStyleDetails {
  score: number;
  description: string;
  characteristics: string[];
  strengths: string[];
  challenges: string[];
  workStyle: string;
  communicationStyle: string;
}

export interface DISCResult {
  primaryStyle: string;
  secondaryStyle: string;
  analysis: string;
  discStyles: {
    [key: string]: DISCStyleDetails;
  };
  workStyle: string;
  communicationStyle: string;
  leadershipStyle: string;
  teamRole: string;
  stressBehaviors: string[];
  motivationFactors: string[];
  developmentAreas: string[];
}

export interface DISCResultDisplayProps extends BaseComponentProps {
  result: DISCResult;
  onLearn?: () => void;
}

export const DISCResultDisplay: React.FC<DISCResultDisplayProps> = ({
  className,
  testId = 'disc-result-display',
  result,
  onLearn,
  ...props
}) => {
  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'Dominance': return '🔥';
      case 'Influence': return '💬';
      case 'Steadiness': return '🤝';
      case 'Conscientiousness': return '📊';
      default: return '👤';
    }
  };


  // 描述函数当前未使用，后续需要再启用

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall result - align layout with Leadership: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
                {getStyleIcon(result.primaryStyle)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">DISC Behavioral Style Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Primary Style Combination: </span>
                <span className="text-emerald-600 font-semibold">
                  {result.primaryStyle === 'D' ? 'Dominance' : 
                   result.primaryStyle === 'I' ? 'Influence' : 
                   result.primaryStyle === 'S' ? 'Steadiness' : 
                   result.primaryStyle === 'C' ? 'Conscientiousness' : result.primaryStyle}
                  {result.secondaryStyle && (
                    <>
                      {' + '}
                      {result.secondaryStyle === 'D' ? 'Dominance' : 
                       result.secondaryStyle === 'I' ? 'Influence' : 
                       result.secondaryStyle === 'S' ? 'Steadiness' : 
                       result.secondaryStyle === 'C' ? 'Conscientiousness' : result.secondaryStyle}
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.analysis || 'Your detailed analysis will appear here once it is ready.'}
              </p>
            </div>
          </div>
        </Card>

        {/* DISC Styles Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            DISC Styles Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result?.discStyles ?? {}).map(([style, details]) => (
              <div key={style} className="p-6 rounded-lg bg-emerald-50 border border-emerald-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-900">
                  {style}
                  {style === result.primaryStyle && (
                    <span className="ml-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">Primary</span>
                  )}
                  {style === result.secondaryStyle && (
                    <span className="ml-2 px-2 py-1 bg-teal-200 text-teal-800 text-xs rounded-full">Secondary</span>
                  )}
                </h4>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="text-sm font-medium text-gray-900">
                      {details.score >= 45 ? 'High' : 
                       details.score >= 30 ? 'Moderate' : 
                       details.score >= 20 ? 'Low' : 'Very Low'}
                    </span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-1000",
                        details.score >= 45 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                        details.score >= 30 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                        "bg-gradient-to-r from-red-400 to-pink-400"
                      )}
                      style={{ width: `${Math.min((details.score / 60) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{details.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-emerald-700 text-sm mb-2">Characteristics:</h5>
                    <ul className="space-y-0.5">
                      {(details.characteristics || []).map((char, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-500 mr-2 mt-0.5">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-emerald-700 text-sm mb-2">Strengths:</h5>
                    <ul className="space-y-0.5">
                      {(details.strengths || []).map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-500 mr-2 mt-0.5">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-teal-700 text-sm mb-2">Challenges:</h5>
                    <ul className="space-y-0.5">
                      {(details.challenges || []).map((challenge, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-500 mr-2 mt-0.5">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Work Style & Communication */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">💼</span>
            Work Style & Communication
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">⚙️</span>
                Work Style
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {result.workStyle || 'Work style information not available'}
              </p>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">💬</span>
                Communication Style
              </h4>
              <p className="text-sm text-teal-800 leading-relaxed">
                {result.communicationStyle || 'Communication style information not available'}
              </p>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🎯</span>
                Leadership Style
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {result.leadershipStyle || 'Leadership style information not available'}
              </p>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">👥</span>
                Team Role
              </h4>
              <p className="text-sm text-teal-800 leading-relaxed">
                {result.teamRole || 'Team role information not available'}
              </p>
            </div>
          </div>
        </Card>

        {/* Motivation & Development */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            Motivation & Development
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🚀</span>
                Motivation Factors
              </h4>
              <ul className="space-y-2">
                {(result.motivationFactors || []).map((factor, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">⚠️</span>
                Stress Behaviors
              </h4>
              <ul className="space-y-2">
                {(result.stressBehaviors || []).map((behavior, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {behavior}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">📈</span>
                Development Areas
              </h4>
              <ul className="space-y-2">
                {(result.developmentAreas || []).map((area, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onLearn && (
            <button
              onClick={onLearn}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
            >
              Explore DISC Guidance
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This DISC assessment supports professional development. Combine these insights with workplace feedback or coaching for the best outcomes.
          </p>
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="disc" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'career',
          testId: 'disc',
        }}
      />
    </div>
  );
};
