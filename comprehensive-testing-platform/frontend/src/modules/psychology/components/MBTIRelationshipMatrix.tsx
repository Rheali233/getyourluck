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

// Extract MBTI preferences from type string
const extractPreferences = (type: string) => {
  if (!type || typeof type !== 'string') {
    return { E: false, S: false, T: false, J: false };
  }
  return {
    E: type.includes('E'),
    S: type.includes('S'),
    T: type.includes('T'),
    J: type.includes('J')
  };
};

// Intelligent compatibility grouping based on MBTI theory
const getCompatibilityLevel = (currentType: string, targetType: string): 'high' | 'medium' | 'low' => {
  // Validate input types
  if (!currentType || !targetType || 
      currentType === 'Unknown' || targetType === 'Unknown' ||
      typeof currentType !== 'string' || typeof targetType !== 'string') {
    return 'low';
  }
  
  const current = extractPreferences(currentType);
  const target = extractPreferences(targetType);
  
  // Calculate compatibility score based on MBTI theory
  let score = 0;
  
  // Energy preference (E/I) - opposites often complement well
  if (current.E !== target.E) score += 2;
  
  // Sensing preference (S/N) - opposites often complement well
  if (current.S !== target.S) score += 2;
  
  // Thinking preference (T/F) - opposites often complement well
  if (current.T !== target.T) score += 2;
  
  // Judging preference (J/P) - opposites often complement well
  if (current.J !== target.J) score += 2;
  
  // Determine compatibility level
  if (score >= 6) return 'high';      // High complementarity
  if (score >= 3) return 'medium';    // Moderate complementarity
  return 'low';                        // Low complementarity
};

interface MBTIRelationshipMatrixProps extends BaseComponentProps {
  currentType: string;
  relationshipCompatibility?: {
    highlyCompatible?: CompatibilityEntry[];
    moderatelyCompatible?: CompatibilityEntry[];
    potentiallyChallenging?: CompatibilityEntry[];
  };
}

// Define compatibility entry type
interface CompatibilityEntry {
  type: string;
  name: string;
  reasons: string[];
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

  // Get AI-generated compatibility groups
  const getAICompatibilityGroups = (): {
    highlyCompatible: CompatibilityEntry[];
    moderatelyCompatible: CompatibilityEntry[];
    potentiallyChallenging: CompatibilityEntry[];
  } => {
    if (relationshipCompatibility && relationshipCompatibility['highlyCompatible']) {
      return {
        highlyCompatible: Array.isArray(relationshipCompatibility['highlyCompatible']) 
          ? relationshipCompatibility['highlyCompatible'] as CompatibilityEntry[] 
          : [],
        moderatelyCompatible: Array.isArray(relationshipCompatibility['moderatelyCompatible']) 
          ? relationshipCompatibility['moderatelyCompatible'] as CompatibilityEntry[] 
          : [],
        potentiallyChallenging: Array.isArray(relationshipCompatibility['potentiallyChallenging']) 
          ? relationshipCompatibility['potentiallyChallenging'] as CompatibilityEntry[] 
          : []
      };
    }
    // Fallback to default grouping if no AI data
    return {
      highlyCompatible: otherTypes.filter(type => getCompatibilityLevel(currentType, type.type) === 'high').map(type => ({
        type: type.type,
        name: type.name,
        reasons: getDefaultCompatibilityReasons(currentType, type.type)
      })),
      moderatelyCompatible: otherTypes.filter(type => getCompatibilityLevel(currentType, type.type) === 'medium').map(type => ({
        type: type.type,
        name: type.name,
        reasons: getDefaultCompatibilityReasons(currentType, type.type)
      })),
      potentiallyChallenging: otherTypes.filter(type => getCompatibilityLevel(currentType, type.type) === 'low').map(type => ({
        type: type.type,
        name: type.name,
        reasons: getDefaultCompatibilityReasons(currentType, type.type)
      }))
    };
  };

  // Generate default compatibility reasons based on MBTI theory
  const getDefaultCompatibilityReasons = (current: string, target: string): string[] => {
    // Add safety checks for string parameters
    if (!current || !target || typeof current !== 'string' || typeof target !== 'string') {
      return ['Compatibility analysis unavailable'];
    }
    
    const currentPrefs = extractPreferences(current);
    const targetPrefs = extractPreferences(target);
    
    const reasons: string[] = [];
    
    // Analyze compatibility based on MBTI theory
    if (currentPrefs.E !== targetPrefs.E) {
      reasons.push('Complementary energy levels');
    }
    if (currentPrefs.S !== targetPrefs.S) {
      reasons.push('Balanced perception styles');
    }
    if (currentPrefs.T !== targetPrefs.T) {
      reasons.push('Diverse decision-making approaches');
    }
    if (currentPrefs.J !== targetPrefs.J) {
      reasons.push('Flexible planning preferences');
    }
    
    // Add general compatibility insights
    if (reasons.length === 0) {
      reasons.push('Similar cognitive preferences');
    }
    
    reasons.push('Potential for mutual growth');
    
    return reasons;
  };
  
  // Compatibility card component
  const CompatibilityCard: React.FC<{ compatibility: CompatibilityEntry }> = ({ compatibility }) => {
    const typeInfo = MBTI_TYPES.find(t => t.type === compatibility.type);
    const color = typeInfo?.color || 'from-gray-500 to-slate-600';
    
    return (
      <div className="p-4 rounded-lg bg-white">
        {/* Type Information */}
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm",
            `bg-gradient-to-r ${color}`
          )}>
            {compatibility.type}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-base">{compatibility.name}</div>
          </div>
        </div>
        
        {/* Matching Reason */}
        {compatibility.reasons && compatibility.reasons.length > 0 && (
          <div className="space-y-2">
            {compatibility.reasons.map((reason: string, index: number) => (
              <div key={index} className="text-sm text-black">{reason}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const compatibilityGroups = getAICompatibilityGroups();

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
            {compatibilityGroups.highlyCompatible.map((compatibility: CompatibilityEntry) => (
              <CompatibilityCard key={compatibility.type} compatibility={compatibility} />
            ))}
          </div>
        </div>

        {/* Moderately compatible group */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-blue-700 flex items-center">
            <span className="mr-2">✨</span>
            Moderately Compatible (Complementary but requires adjustment)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compatibilityGroups.moderatelyCompatible.map((compatibility: CompatibilityEntry) => (
              <CompatibilityCard key={compatibility.type} compatibility={compatibility} />
            ))}
          </div>
        </div>

        {/* Potentially challenging group */}
        <div>
          <h4 className="text-md font-semibold mb-3 text-yellow-700 flex items-center">
            <span className="mr-2">🤝</span>
            Potentially Challenging (Different values and thinking patterns)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compatibilityGroups.potentiallyChallenging.map((compatibility: CompatibilityEntry) => (
              <CompatibilityCard key={compatibility.type} compatibility={compatibility} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
