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

// Intelligent compatibility grouping based on MBTI theory
const getCompatibilityLevel = (currentType: string, targetType: string): 'high' | 'medium' | 'low' => {
  // Extract individual preferences
  const currentE = currentType.includes('E');
  const currentS = currentType.includes('S');
  const currentT = currentType.includes('T');
  const currentJ = currentType.includes('J');
  
  const targetE = targetType.includes('E');
  const targetS = targetType.includes('S');
  const targetT = targetType.includes('T');
  const targetJ = targetType.includes('J');
  
  // Calculate compatibility score based on MBTI theory
  let score = 0;
  
  // Energy preference (E/I) - opposites often complement well
  if (currentE !== targetE) score += 2;
  
  // Sensing preference (S/N) - opposites often complement well
  if (currentS !== targetS) score += 2;
  
  // Thinking preference (T/F) - opposites often complement well
  if (currentT !== targetT) score += 2;
  
  // Judging preference (J/P) - opposites often complement well
  if (currentJ !== targetJ) score += 2;
  
  // Determine compatibility level
  if (score >= 6) return 'high';      // High complementarity
  if (score >= 3) return 'medium';    // Moderate complementarity
  return 'low';                        // Low complementarity
};

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
    // If no AI data, provide meaningful default descriptions based on MBTI theory
    return {
      reasons: getDefaultCompatibilityReasons(currentType, targetType),
    };
  };

  // Generate default compatibility reasons based on MBTI theory
  const getDefaultCompatibilityReasons = (current: string, target: string): string[] => {
    // Add safety checks for string parameters
    if (!current || !target || typeof current !== 'string' || typeof target !== 'string') {
      return ['Compatibility analysis unavailable'];
    }
    
    // Extract individual preferences
    const currentE = current.includes('E');
    const currentS = current.includes('S');
    const currentT = current.includes('T');
    const currentJ = current.includes('J');
    
    const targetE = target.includes('E');
    const targetS = target.includes('S');
    const targetT = target.includes('T');
    const targetJ = target.includes('J');
    
    const reasons: string[] = [];
    
    // Analyze compatibility based on MBTI theory
    if (currentE !== targetE) {
      reasons.push('Complementary energy levels');
    }
    if (currentS !== targetS) {
      reasons.push('Balanced perception styles');
    }
    if (currentT !== targetT) {
      reasons.push('Diverse decision-making approaches');
    }
    if (currentJ !== targetJ) {
      reasons.push('Flexible planning preferences');
    }
    
    // Add general compatibility insights
    if (reasons.length === 0) {
      reasons.push('Similar cognitive preferences');
    }
    
    reasons.push('Potential for mutual growth');
    
    return reasons;
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
              .filter((type) => getCompatibilityLevel(currentType.type) === 'high')
              .map((type) => {
                const matchData = getAIMatchData(type.type);
                
                return (
                  <div key={type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${type.color}`
                      )}>
                        {type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{type.name}</div>
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
              .filter((type) => getCompatibilityLevel(currentType.type) === 'medium')
              .map((type) => {
                const matchData = getAIMatchData(type.type);
                
                return (
                  <div key={type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${type.color}`
                      )}>
                        {type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{type.name}</div>
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
              .filter((type) => getCompatibilityLevel(currentType.type) === 'low')
              .map((type) => {
                const matchData = getAIMatchData(type.type);
                
                return (
                  <div key={type.type} className="p-4 rounded-lg bg-white">
                    {/* Type Information */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
                        `bg-gradient-to-r ${type.color}`
                      )}>
                        {type.type}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base">{type.name}</div>
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
