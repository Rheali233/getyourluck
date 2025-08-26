/**
 * MBTI Personality Type Result Display Component
 * Unified psychological testing result display component following development standards
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { MBTIResult } from '../types';
import { MBTIRelationshipMatrix } from './MBTIRelationshipMatrix';

// Icon Component
const Icon = ({ name, className }: { name: string; className?: string }) => (
  <span className={cn("inline-block", className)}>
    {name === 'star' && '⭐'}
    {name === 'warning' && '⚠️'}
    {name === 'briefcase' && '💼'}
    {name === 'home' && '🏠'}
    {name === 'heart' && '💖'}
    {name === 'users' && '👥'}
    {name === 'lightbulb' && '💡'}
    {name === 'chart' && '📊'}
  </span>
);

export interface MBTIResultDisplayProps extends BaseComponentProps {
  result: MBTIResult;
  onReset: () => void;
  onShare?: () => void;
}

export const MBTIResultDisplay: React.FC<MBTIResultDisplayProps> = ({
  className,
  testId = 'mbti-result-display',
  result,
  onReset,
  onShare,
  ...props
}) => {
  return (
    <div className={cn("bg-blue-50 py-6 px-4", className)} data-testid={testId} {...props}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top summary card: Type info + detailed analysis & career suggestions */}
        <Card className="p-6 bg-white">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Type information (20% width) */}
            <div className="lg:w-1/5 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                {result.personalityType}
              </div>
              <h2 className="text-2xl font-bold text-black text-center">{result.typeName}</h2>
            </div>
            
            {/* Right: Detailed analysis & career suggestions (80% width) */}
            <div className="lg:w-4/5 space-y-4">
              {/* Detailed analysis (no title) */}
              <div>
                <p className="text-sm text-black leading-relaxed">
                  {result.detailedAnalysis}
                </p>
              </div>
              
              {/* Suitable careers */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
                  <Icon name="briefcase" className="mr-2" />
                  Suitable Careers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(result.careerSuggestions || []).map((career, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {career}
                    </span>
                  ))}
                  {(!result.careerSuggestions || result.careerSuggestions.length === 0) && (
                    <span className="text-gray-500 text-sm">Career suggestions feature under development</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dimension overview (more intuitive presentation) */}
        <Card className="p-5 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-black flex items-center">
            <Icon name="chart" className="mr-2" />
            Dimension Overview
          </h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Below is your tendency analysis on the four core dimensions. The progress bar shows your tendency level on each dimension, with higher percentages indicating stronger preference for the left trait.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(result.dimensions || []).map((dimension, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">
                  <div className="text-sm font-medium text-black mb-2">{dimension.name}</div>
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                    <span>{dimension.leftLabel}</span>
                    <span>{dimension.rightLabel}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 relative">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${dimension.score}%` }} />
                </div>
                <div className="text-sm text-gray-700">
                  {dimension.score > 50 ? (
                    <span>Prefer <span className="font-semibold text-blue-600">{dimension.leftLabel}</span></span>
                  ) : (
                    <span>Prefer <span className="font-semibold text-blue-600">{dimension.rightLabel}</span></span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {dimension.score}% tendency
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Strengths and Blind Spots Analysis */}
        <Card className="p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
                <Icon name="star" className="mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {(result.strengths || []).map((s, i) => (
                  <li key={i} className="text-sm text-black">• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
                <Icon name="warning" className="mr-2" />
                Potential Blind Spots
              </h3>
              <ul className="space-y-2">
                {(result.blindSpots || []).map((b, i) => (
                  <li key={i} className="text-sm text-black">• {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>



        {/* Relationship Performance Analysis */}
        <Card className="p-5 bg-white">
          <h3 className="text-lg font-semibold mb-3 text-black flex items-center">
            <Icon name="users" className="mr-2" />
            Relationship Performance Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Workplace Performance */}
            <div className="p-4 rounded-lg bg-white">
              <h4 className="font-semibold text-black mb-2 flex items-center">
                <Icon name="briefcase" className="mr-1" />
                Workplace Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-black">Leadership Style:</span><span className="text-gray-700">{result.relationshipPerformance.workplace.leadershipStyle}</span></div>
                <div><span className="font-medium text-black">Team Collaboration:</span><span className="text-gray-700">{result.relationshipPerformance.workplace.teamCollaboration}</span></div>
                <div><span className="font-medium text-black">Decision Making:</span><span className="text-gray-700">{result.relationshipPerformance.workplace.decisionMaking}</span></div>
              </div>
            </div>

            {/* Family Performance */}
            <div className="p-4 rounded-lg bg-white">
              <h4 className="font-semibold text-black mb-2 flex items-center">
                <Icon name="home" className="mr-1" />
                Family Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-black">Family Role:</span><span className="text-gray-700">{result.relationshipPerformance.family.role}</span></div>
                <div><span className="font-medium text-black">Communication Style:</span><span className="text-gray-700">{result.relationshipPerformance.family.communication}</span></div>
                <div><span className="font-medium text-black">Emotional Expression:</span><span className="text-gray-700">{result.relationshipPerformance.family.emotionalExpression}</span></div>
              </div>
            </div>

            {/* Friendship Performance */}
            <div className="p-4 rounded-lg bg-white">
              <h4 className="font-semibold text-black mb-2 flex items-center">
                <Icon name="users" className="mr-1" />
                Friendship Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-black">Friendship Preferences:</span><span className="text-gray-700">{result.relationshipPerformance.friendship.preferences}</span></div>
                <div><span className="font-medium text-black">Social Pattern:</span><span className="text-gray-700">{result.relationshipPerformance.friendship.socialPattern}</span></div>
                <div><span className="font-medium text-black">Support Style:</span><span className="text-gray-700">{result.relationshipPerformance.friendship.supportStyle}</span></div>
              </div>
            </div>

            {/* Romance Performance */}
            <div className="p-4 rounded-lg bg-white">
              <h4 className="font-semibold text-black mb-2 flex items-center">
                <Icon name="heart" className="mr-1" />
                Romance Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-black">Dating Style:</span><span className="text-gray-700">{result.relationshipPerformance.romance.datingStyle}</span></div>
                <div><span className="font-medium text-black">Emotional Needs:</span><span className="text-gray-700">{result.relationshipPerformance.romance.emotionalNeeds}</span></div>
                <div><span className="font-medium text-black">Relationship Pattern:</span><span className="text-gray-700">{result.relationshipPerformance.romance.relationshipPattern}</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Relationship Compatibility Matrix */}
        <MBTIRelationshipMatrix 
          currentType={result.personalityType} 
          relationshipCompatibility={result.relationshipCompatibility}
        />



        <div className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
          This result is for reference only and does not constitute any clinical or legal advice.
        </div>
      </div>
    </div>
  );
};
