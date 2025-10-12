/**
 * MBTI Personality Type Result Display Component
 * Unified psychological testing result display component following development standards
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { MBTIResult } from '../types';
import { MBTIRelationshipMatrix } from './MBTIRelationshipMatrix';


export interface MBTIResultDisplayProps extends BaseComponentProps {
  result: MBTIResult;
}

export const MBTIResultDisplay: React.FC<MBTIResultDisplayProps> = ({
  className,
  testId = 'mbti-result-display',
  result,
  ...props
}) => {
  // 添加默认值处理，防止访问 undefined 属性
  const safeResult = {
    personalityType: result?.personalityType || 'Unknown',
    typeName: result?.typeName || 'Unknown Type',
    typeDescription: result?.typeDescription || 'No description available',
    detailedAnalysis: result?.detailedAnalysis || 'No detailed analysis available',
    dimensions: result?.dimensions || [],
    strengths: result?.strengths || [],
    blindSpots: result?.blindSpots || [],
    careerSuggestions: result?.careerSuggestions || [],
    relationshipPerformance: result?.relationshipPerformance || {
      workplace: {
        leadershipStyle: 'Not specified',
        teamCollaboration: 'Not specified',
        decisionMaking: 'Not specified'
      },
      family: {
        role: 'Not specified',
        communication: 'Not specified',
        emotionalExpression: 'Not specified'
      },
      friendship: {
        preferences: 'Not specified',
        socialPattern: 'Not specified',
        supportStyle: 'Not specified'
      },
      romance: {
        datingStyle: 'Not specified',
        emotionalNeeds: 'Not specified',
        relationshipPattern: 'Not specified'
      }
    },
    relationshipCompatibility: result?.relationshipCompatibility || {}
  };
  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* Top summary card - align layout with DISC: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow">
                {safeResult.personalityType}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">MBTI Personality Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Personality Type: </span>
                <span className="text-blue-600 font-semibold">
                  {safeResult.personalityType} - {safeResult.typeName}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {safeResult.detailedAnalysis || 'Analysis not available'}
              </p>
            </div>
          </div>
        </Card>

        {/* Dimension overview */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Dimension Overview
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Below is your tendency analysis on the four core dimensions. The progress bar shows your tendency level on each dimension, with higher percentages indicating stronger preference for the left trait.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(safeResult.dimensions || []).map((dimension, index) => (
              <div key={index} className="p-6 rounded-lg bg-blue-50 border border-emerald-200 text-center">
                <div className="mb-4">
                  <div className="text-lg font-semibold text-gray-900 mb-2">{dimension.name}</div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <span>{dimension.leftLabel}</span>
                    <span>{dimension.rightLabel}</span>
                  </div>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2 mb-3 relative">
                  <div className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    dimension.score >= 80 ? "bg-gradient-to-r from-blue-500 to-indigo-500" :
                    dimension.score >= 60 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                    "bg-gradient-to-r from-red-400 to-pink-400"
                  )} style={{ width: `${dimension.score}%` }} />
                </div>
                <div className="text-sm text-gray-700">
                  {dimension.score > 50 ? (
                    <span>Prefer <span className="font-semibold text-blue-600">{dimension.leftLabel}</span></span>
                  ) : (
                    <span>Prefer <span className="font-semibold text-indigo-600">{dimension.rightLabel}</span></span>
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
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-blue-50 border border-emerald-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">⭐</span>
                Strengths
              </h3>
              <ul className="space-y-2">
                {(safeResult.strengths || []).map((s, i) => (
                  <li key={i} className="text-sm text-blue-800 flex items-start">
                    <span className="text-blue-600 mr-2 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-lg bg-indigo-50 border border-teal-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">⚠️</span>
                Potential Blind Spots
              </h3>
              <ul className="space-y-2">
                {(safeResult.blindSpots || []).map((b, i) => (
                  <li key={i} className="text-sm text-indigo-800 flex items-start">
                    <span className="text-indigo-600 mr-2 mt-0.5">•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>



        {/* Relationship Performance Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">👥</span>
            Relationship Performance Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workplace Performance */}
            <div className="p-6 rounded-lg bg-blue-50 border border-emerald-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">💼</span>
                Workplace Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-gray-800">Leadership Style:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.workplace.leadershipStyle}</span></div>
                <div><span className="font-medium text-gray-800">Team Collaboration:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.workplace.teamCollaboration}</span></div>
                <div><span className="font-medium text-gray-800">Decision Making:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.workplace.decisionMaking}</span></div>
              </div>
            </div>

            {/* Family Performance */}
            <div className="p-6 rounded-lg bg-indigo-50 border border-teal-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏠</span>
                Family Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-gray-800">Family Role:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.family.role}</span></div>
                <div><span className="font-medium text-gray-800">Communication Style:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.family.communication}</span></div>
                <div><span className="font-medium text-gray-800">Emotional Expression:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.family.emotionalExpression}</span></div>
              </div>
            </div>

            {/* Friendship Performance */}
            <div className="p-6 rounded-lg bg-blue-50 border border-emerald-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">👥</span>
                Friendship Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-gray-800">Friendship Preferences:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.friendship.preferences}</span></div>
                <div><span className="font-medium text-gray-800">Social Pattern:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.friendship.socialPattern}</span></div>
                <div><span className="font-medium text-gray-800">Support Style:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.friendship.supportStyle}</span></div>
              </div>
            </div>

            {/* Romance Performance */}
            <div className="p-6 rounded-lg bg-indigo-50 border border-teal-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">💖</span>
                Romance Performance
              </h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium text-gray-800">Dating Style:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.romance.datingStyle}</span></div>
                <div><span className="font-medium text-gray-800">Emotional Needs:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.romance.emotionalNeeds}</span></div>
                <div><span className="font-medium text-gray-800">Relationship Pattern:</span><span className="text-gray-600 ml-2">{safeResult.relationshipPerformance.romance.relationshipPattern}</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Relationship Compatibility Matrix */}
        <MBTIRelationshipMatrix 
          currentType={safeResult.personalityType} 
          relationshipCompatibility={safeResult.relationshipCompatibility}
        />


        <div className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
          This result is for reference only and does not constitute any clinical or legal advice.
        </div>
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'psychology',
          testId: 'mbti',
        }}
      />
    </div>
  );
};
