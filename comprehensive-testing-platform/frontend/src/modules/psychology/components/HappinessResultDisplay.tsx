/**
 * Happiness Index Domain Analysis Result Display Component
 * Psychology test result display component following unified development standards
 * Includes five-domain analysis and quality of life improvement plan
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { ContextualLinks } from '@/components/InternalLinks';

export interface HappinessDomain {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  currentStatus: string;
  improvementAreas: string[];
  positiveAspects: string[];
}

export interface HappinessResult {
  happinessLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  levelName: string;
  domains: HappinessDomain[];
  overallAnalysis: string;
  improvementPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    dailyHabits: string[];
  };
}

export interface HappinessResultDisplayProps extends BaseComponentProps {
  result: HappinessResult;
}

export const HappinessResultDisplay: React.FC<HappinessResultDisplayProps> = ({
  className,
  testId = 'happiness-result-display',
  result,
  ...props
}) => {
  // 验证结果是否有效（AI分析失败时不应该到达这里，但作为安全措施）
  if (!result || !result.happinessLevel || !result.overallAnalysis || !result.domains || result.domains.length === 0) {
    return (
      <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis Not Available</h2>
            <p className="text-gray-600 mb-4">
              Unable to generate AI analysis for your Happiness test results. Please try submitting again.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // 使用实际结果，不提供默认值
  const safeResult: any = {
    happinessLevel: result.happinessLevel,
    levelName: result.levelName || '',
    domains: result.domains,
    overallAnalysis: result.overallAnalysis,
    improvementPlan: {
      immediate: Array.isArray(result.improvementPlan?.immediate) ? result.improvementPlan.immediate : [],
      shortTerm: Array.isArray(result.improvementPlan?.shortTerm) ? result.improvementPlan.shortTerm : [],
      longTerm: Array.isArray(result.improvementPlan?.longTerm) ? result.improvementPlan.longTerm : [],
      dailyHabits: Array.isArray(result.improvementPlan?.dailyHabits) ? result.improvementPlan.dailyHabits : []
    }
  };

  const getHappinessLevelIcon = (level: string) => {
    switch (level) {
      case 'very_unhappy': return '😢';
      case 'unhappy': return '😔';
      case 'moderate': return '😐';
      case 'happy': return '😊';
      case 'very_happy': return '😄';
      default: return '😊';
    }
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
                {getHappinessLevelIcon(safeResult.happinessLevel)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Happiness Index Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Happiness Level: </span>
                <span className="text-blue-600 font-semibold">
                  {safeResult.levelName}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {safeResult.overallAnalysis}
              </p>
            </div>
          </div>
        </Card>

        {/* Life Domain Happiness Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🏠</span>
            Life Domain Happiness Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeResult.domains.map((domain: any, index: number) => (
              <div key={index} className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{domain.name}</h4>
                  <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    {domain.score}/{domain.maxScore}
                  </span>
                </div>
                {domain.description && (
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {domain.description}
                  </p>
                )}
                
                {(domain.positiveAspects?.length || 0) > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-800 text-sm mb-2">Strengths:</h5>
                    <ul className="space-y-0.5">
                       {(domain.positiveAspects || []).map((strength: any, idx: number) => (
                         <li key={idx} className="text-sm text-blue-800 flex items-start">
                           <span className="text-blue-600 mr-2 mt-0.5">•</span>
                           {typeof strength === 'string' ? strength : JSON.stringify(strength)}
                         </li>
                       ))}
                     </ul>
                  </div>
                )}
                
                {(domain.improvementAreas?.length || 0) > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-800 text-sm mb-2">Areas for Growth:</h5>
                    <ul className="space-y-0.5">
                       {(domain.improvementAreas || []).map((area: any, idx: number) => (
                         <li key={idx} className="text-sm text-blue-800 flex items-start">
                           <span className="text-blue-600 mr-2 mt-0.5">•</span>
                           {typeof area === 'string' ? area : JSON.stringify(area)}
                         </li>
                       ))}
                     </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>





        {/* Happiness Improvement Plan */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Happiness Improvement Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeResult.improvementPlan.immediate.length > 0 && (
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions</h4>
                <ul className="space-y-2">
                  {safeResult.improvementPlan.immediate.map((action: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {safeResult.improvementPlan.shortTerm.length > 0 && (
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Short-term Goals</h4>
                <ul className="space-y-2">
                  {safeResult.improvementPlan.shortTerm.map((goal: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {safeResult.improvementPlan.longTerm.length > 0 && (
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Long-term Plans</h4>
                <ul className="space-y-2">
                  {safeResult.improvementPlan.longTerm.map((plan: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {plan}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {safeResult.improvementPlan.dailyHabits.length > 0 && (
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Habits</h4>
                <ul className="space-y-2">
                  {safeResult.improvementPlan.dailyHabits.map((habit: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {habit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>







        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-3xl mx-auto">
          <p className="leading-relaxed">
            <strong>Important Reminder:</strong> The happiness index test results are for reference only, intended to help you understand your current life satisfaction.
            Happiness can be enhanced through positive actions and mindset adjustments. If you experience persistent distress,
            we recommend seeking professional psychological counseling or life coaching.
          </p>
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="happiness" className="mt-4" />

      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'psychology',
          testId: 'happiness',
        }}
      />
    </div>
  );
};
