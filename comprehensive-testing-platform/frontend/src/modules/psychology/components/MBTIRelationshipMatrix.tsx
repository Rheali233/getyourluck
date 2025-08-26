/**
 * MBTI Relationship Compatibility Matrix Component
 * Implemented with pure CSS + Tailwind, no additional dependencies required
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

// MBTI type information
const MBTI_TYPES = [
  { type: 'INTJ', name: 'Architect', color: 'from-purple-500 to-indigo-600' },
  { type: 'INTP', name: 'Logician', color: 'from-blue-500 to-cyan-600' },
  { type: 'ENTJ', name: 'Commander', color: 'from-red-500 to-pink-600' },
  { type: 'ENTP', name: 'Debater', color: 'from-orange-500 to-red-600' },
  { type: 'INFJ', name: 'Advocate', color: 'from-green-500 to-emerald-600' },
  { type: 'INFP', name: 'Mediator', color: 'from-pink-500 to-rose-600' },
  { type: 'ENFJ', name: 'Protagonist', color: 'from-yellow-500 to-orange-600' },
  { type: 'ENFP', name: 'Campaigner', color: 'from-yellow-500 to-green-600' },
  { type: 'ISTJ', name: 'Logistician', color: 'from-gray-500 to-slate-600' },
  { type: 'ISFJ', name: 'Defender', color: 'from-blue-500 to-indigo-600' },
  { type: 'ESTJ', name: 'Executive', color: 'from-green-500 to-teal-600' },
  { type: 'ESFJ', name: 'Consul', color: 'from-pink-500 to-purple-600' },
  { type: 'ISTP', name: 'Virtuoso', color: 'from-gray-500 to-blue-600' },
  { type: 'ISFP', name: 'Adventurer', color: 'from-green-500 to-blue-600' },
  { type: 'ESTP', name: 'Entrepreneur', color: 'from-orange-500 to-yellow-600' },
  { type: 'ESFP', name: 'Entertainer', color: 'from-yellow-500 to-pink-600' }
];

// Simplified grouping logic - evenly distribute 16 types into three groups
const getCompatibilityLevel = (index: number): 'high' | 'medium' | 'low' => {
  if (index < 6) return 'high';      // First 6 as highly compatible
  if (index < 11) return 'medium';   // Next 5 as moderately compatible
  return 'low';                       // Last 5 as low compatibility
};

// This function is no longer needed as we have removed the match level display

interface MBTIRelationshipMatrixProps extends BaseComponentProps {
  currentType: string;
  relationshipCompatibility?: {
    [key: string]: {
      reasons: string[];
    };
  };
}

export const MBTIRelationshipMatrix: React.FC<MBTIRelationshipMatrixProps> = ({
  className,
  testId = 'mbti-relationship-matrix',
  currentType,
  relationshipCompatibility,
  ...props
}) => {
  // Filter out current type
  const otherTypes = MBTI_TYPES.filter(type => type.type !== currentType);
  
  // Get AI-generated match data
  const getAIMatchData = (targetType: string) => {
    if (relationshipCompatibility && relationshipCompatibility[targetType]) {
      return relationshipCompatibility[targetType];
    }
    // If no AI data, return default value
    return {
      reasons: ['AI analysis data missing'],
    };
  };
  
  return (
    <Card className={cn("p-5 bg-white", className)} data-testid={testId} {...props}>
      <h3 className="text-lg font-semibold mb-4 text-black flex items-center">
        <span className="mr-2">🔗</span>
        Relationship Compatibility with Other Types
      </h3>
      
      {/* Relationship matrix grouped by compatibility type */}
      <div className="space-y-6">
        {/* Highly compatible group */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-green-700 flex items-center">
            <span className="mr-2">💫</span>
            Highly Compatible (Shared values, easy to get along)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTypes
              .filter((_type, index) => getCompatibilityLevel(index) === 'high')
              .map((_type) => {
                const matchData = getAIMatchData(_type.type);
                
                return (
                  <div key={_type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${_type.color}`
                      )}>
                        {_type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{_type.name}</div>
                      </div>
                    </div>
                    
                    {/* Matching Reason */}
                    {matchData?.reasons && matchData.reasons.length > 0 && (
                      <div className="space-y-2">
                        {matchData.reasons.map((reason, index) => (
                          <div key={index} className="text-sm text-black">{reason}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Moderately compatible group */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-blue-700 flex items-center">
            <span className="mr-2">✨</span>
            Moderately Compatible (Complementary but requires adjustment)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTypes
              .filter((_type, index) => getCompatibilityLevel(index) === 'medium')
              .map((_type) => {
                const matchData = getAIMatchData(_type.type);
                
                return (
                  <div key={_type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${_type.color}`
                      )}>
                        {_type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{_type.name}</div>
                      </div>
                    </div>
                    
                    {/* Matching Reason */}
                    {matchData?.reasons && matchData.reasons.length > 0 && (
                      <div className="space-y-2">
                        {matchData.reasons.map((reason, index) => (
                          <div key={index} className="text-sm text-black">{reason}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Potentially challenging group */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-yellow-700 flex items-center">
            <span className="mr-2">🤝</span>
            Potentially Challenging (Different values and thinking patterns)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTypes
              .filter((_type, index) => getCompatibilityLevel(index) === 'low')
              .map((_type) => {
                const matchData = getAIMatchData(_type.type);
                
                return (
                  <div key={_type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${_type.color}`
                      )}>
                        {_type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{_type.name}</div>
                      </div>
                    </div>
                    
                    {/* Matching Reason */}
                    {matchData?.reasons && matchData.reasons.length > 0 && (
                      <div className="space-y-2">
                        {matchData.reasons.map((reason, index) => (
                          <div key={index} className="text-sm text-black">{reason}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Card>
  );
};
