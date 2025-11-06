/**
 * Holland Career Interest Test Result Display Component
 * Career test result display component following unified development standards
 * Based on John Holland's RIASEC theory
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { ContextualLinks } from '@/components/InternalLinks';

export interface HollandTypeDetails {
  score: number;
  description: string;
  characteristics: string[];
  careers: string[];
  workEnvironment: string;
}

export interface HollandResult {
  primaryCode: string;
  secondaryCode: string;
  tertiaryCode: string;
  fullCode: string;
  analysis: string;
  hollandTypes: {
    [key: string]: HollandTypeDetails;
  };
  personalityTraits: string[];
  careerClusters: string[];
  specificCareers: string[];
  workEnvironment: string;
  skills: string[];
  growthAreas: string[];
  careerPathways: string[];
  educationRecommendations: string[];
  jobSearchStrategy: string[];
  workplacePreferences: string[];
}

export interface HollandResultDisplayProps extends BaseComponentProps {
  result: HollandResult;
  onExplore?: () => void;
}

export const HollandResultDisplay: React.FC<HollandResultDisplayProps> = ({
  className,
  testId = 'holland-result-display',
  result,
  onExplore,
  ...props
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Realistic': return '🔧';
      case 'Investigative': return '🔬';
      case 'Artistic': return '🎨';
      case 'Social': return '👥';
      case 'Enterprising': return '💼';
      case 'Conventional': return '📊';
      default: return '💼';
    }
  };


  // 描述函数当前未使用，后续需要再启用

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall result - align layout with DISC: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow">
                {getTypeIcon(result.primaryCode)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Holland Career Interest Test</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Primary Career Type: </span>
                <span className="text-emerald-600 font-semibold">
                  {result.primaryCode} - {Object.keys(result.hollandTypes).find(key => key.startsWith(result.primaryCode)) || result.primaryCode}
                </span>
                {result.secondaryCode && (
                  <>
                    {' + '}
                    <span className="text-teal-600 font-semibold">
                      {result.secondaryCode} - {Object.keys(result.hollandTypes).find(key => key.startsWith(result.secondaryCode)) || result.secondaryCode}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.analysis || 'Your detailed analysis will appear here once it is ready.'}
              </p>
            </div>
          </div>
        </Card>

        {/* RIASEC Types Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            RIASEC Types Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(result.hollandTypes).map(([type, details]) => (
              <div key={type} className="p-6 rounded-lg bg-emerald-50 border border-emerald-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">{getTypeIcon(type)}</span>
                  {type}
                  {type.startsWith(result.primaryCode) && (
                    <span className="ml-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">Primary</span>
                  )}
                  {type.startsWith(result.secondaryCode) && (
                    <span className="ml-2 px-2 py-1 bg-teal-200 text-teal-800 text-xs rounded-full">Secondary</span>
                  )}
                  {type.startsWith(result.tertiaryCode) && (
                    <span className="ml-2 px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">Tertiary</span>
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
                      {details.characteristics.map((char, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-500 mr-2 mt-0.5">•</span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Career & Work Style */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">💼</span>
            Career & Work Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🎯</span>
                Specific Careers
              </h4>
              <ul className="space-y-2">
                {result.specificCareers.map((career, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {career}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">📈</span>
                Career Pathways
              </h4>
              <ul className="space-y-2">
                {result.careerPathways.map((pathway, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {pathway}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🌍</span>
                Work Environment
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                {result.workEnvironment || 'Work environment information not available'}
              </p>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">🔍</span>
                Job Search Strategy
              </h4>
              <ul className="space-y-2">
                {result.jobSearchStrategy.map((strategy, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Skills & Development */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🛠️</span>
            Skills & Development
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">💪</span>
                Key Skills
              </h4>
              <ul className="space-y-2">
                {result.skills.map((skill, index) => (
                  <li key={index} className="text-sm text-emerald-800 flex items-start">
                    <span className="text-emerald-600 mr-2 mt-0.5">•</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-teal-50 rounded-lg border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">📚</span>
                Education Recommendations
              </h4>
              <ul className="space-y-2">
                {result.educationRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-teal-800 flex items-start">
                    <span className="text-teal-600 mr-2 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-4 flex items-center text-lg">
                <span className="text-2xl mr-2">📈</span>
                Growth Areas
              </h4>
              <ul className="space-y-2">
                {result.growthAreas.map((area, index) => (
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
          {onExplore && (
            <button
              onClick={onExplore}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
            >
              Explore Career Matches
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This Holland Code assessment supports career exploration. Combine these insights with conversations, research, and professional guidance as needed.
          </p>
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="holland" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'career',
          testId: 'holland',
        }}
      />
    </div>
  );
};
