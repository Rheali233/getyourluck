/**
 * Emotional Intelligence Test Result Display Component
 * Psychological test result display component following unified development standards
 * Includes five-dimensional analysis and emotional intelligence improvement plan
 */

import React from 'react';
import { Card, Button, FeedbackFloatingWidget } from '@/components/ui';
import { ContextualLinks } from '@/components/InternalLinks';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface EQDimension {
  name: string;
  // 与后端统一的温和等级文案（可选，缺失时显示 Not Available）
  level?: 'Needs Improvement' | 'Average' | 'Good' | 'Very Good' | 'Excellent';
  description: string;
  strengths: string[];
}

export interface EQResult {
  // 与后端统一的温和等级文案
  overallLevel: 'Needs Improvement' | 'Average' | 'Good' | 'Very Good' | 'Excellent';
  levelName: string;
  dimensions: EQDimension[];
  overallAnalysis: string;
  improvementPlan: {
    shortTerm: string[];
    longTerm: string[];
    dailyPractices: string[];
  };
  error?: string;
}

export interface EQResultDisplayProps extends BaseComponentProps {
  result: EQResult;
  onReset: () => void;
  onRetry?: () => void;
}

export const EQResultDisplay: React.FC<EQResultDisplayProps> = ({
  className,
  testId = 'eq-result-display',
  result,
  onReset,
  onRetry,
  ...props
}) => {
  // 验证结果是否有效（AI分析失败时不应该到达这里，但作为安全措施）
  if (!result || !result.overallLevel || !result.overallAnalysis || !result.dimensions || result.dimensions.length === 0) {
    return (
      <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis Not Available</h2>
            <p className="text-gray-600 mb-4">
              Unable to generate AI analysis for your EQ test results. Please try submitting again.
            </p>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white"
              >
                Retry Analysis
              </Button>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // 使用实际结果，不提供默认值
  const safeResult: any = {
    overallLevel: result.overallLevel,
    levelName: result.levelName || '',
    dimensions: result.dimensions,
    overallAnalysis: typeof result.overallAnalysis === 'string' ? result.overallAnalysis : 
                    typeof result.overallAnalysis === 'object' ? JSON.stringify(result.overallAnalysis) : '',
    improvementPlan: {
      shortTerm: Array.isArray(result.improvementPlan?.shortTerm) ? result.improvementPlan.shortTerm : [],
      longTerm: Array.isArray(result.improvementPlan?.longTerm) ? result.improvementPlan.longTerm : [],
      dailyPractices: Array.isArray(result.improvementPlan?.dailyPractices) ? result.improvementPlan.dailyPractices : []
    }
  };




  const getLevelIcon = (level?: string) => {
    switch (level) {
      case 'Needs Improvement': return '🌱';
      case 'Average': return '🌿';
      case 'Good': return '🌳';
      case 'Very Good': return '🌟';
      case 'Excellent': return '🏆';
      default: return '🌱';
    }
  };




  // 错误状态处理
  if (result?.error) {
    return (
      <div className={cn("bg-red-50 py-6 px-4", className)} data-testid={testId} {...props}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="bg-white rounded-lg p-8 border border-red-200">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Analysis Incomplete</h2>
            <p className="text-gray-700 mb-6">
              We encountered an issue while analyzing your EQ test results. The analysis was incomplete and cannot be displayed properly.
            </p>
            <div className="bg-red-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 font-mono">
                Error: {result.error}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white"
                >
                  Retry Analysis
                </Button>
              )}
              <Button
                onClick={onReset}
                variant="outline"
                className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Take Test Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall result - align layout with DISC: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow">
                {getLevelIcon(safeResult.overallLevel)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Emotional Intelligence Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Overall Level: </span>
                <span className="text-blue-600 font-semibold">
                  {safeResult.overallLevel || 'Unknown'}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {safeResult.overallAnalysis}
              </p>
            </div>
          </div>
        </Card>



        {/* Dimensional emotional intelligence analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Dimensional Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeResult.dimensions.map((dimension: any, index: number) => (
              <div key={index} className="p-6 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{dimension.name}</h4>
                  <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    {dimension.level || 'Not Available'}
                  </span>
                </div>
                {/* 始终显示description */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Analysis:</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {dimension.description || 'No description available for this dimension.'}
                  </p>
                </div>
                
                {/* 始终显示strengths */}
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Strengths:</h5>
                  <ul className="space-y-0.5">
                    {(dimension.strengths && dimension.strengths.length > 0) ? 
                      dimension.strengths.map((strength: any, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-gray-500 mr-2 mt-0.5">•</span>
                          {typeof strength === 'string' ? strength : JSON.stringify(strength)}
                        </li>
                      )) : (
                        <li className="text-sm text-gray-500 italic">No strengths data available</li>
                      )
                    }
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>



        {/* Improvement plan */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Improvement Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Short-term Goals</h4>
              <ul className="space-y-2">
                {safeResult.improvementPlan.shortTerm.length > 0 ? (
                  safeResult.improvementPlan.shortTerm.map((goal: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {typeof goal === 'string' ? goal : JSON.stringify(goal)}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">No short-term goals available</li>
                )}
              </ul>
            </div>
            
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Long-term Goals</h4>
              <ul className="space-y-2">
                {safeResult.improvementPlan.longTerm.length > 0 ? (
                  safeResult.improvementPlan.longTerm.map((goal: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {typeof goal === 'string' ? goal : JSON.stringify(goal)}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">No long-term goals available</li>
                )}
              </ul>
            </div>
            
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Practices</h4>
              <ul className="space-y-2">
                {safeResult.improvementPlan.dailyPractices.length > 0 ? (
                  safeResult.improvementPlan.dailyPractices.map((practice: any, index: number) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2 mt-0.5">•</span>
                      {typeof practice === 'string' ? practice : JSON.stringify(practice)}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">No daily practices available</li>
                )}
              </ul>
            </div>
          </div>
        </Card>


        <div className="text-center text-xs text-gray-500 max-w-2xl mx-auto">
          This result is for reference only and does not constitute any clinical or legal advice.
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="eq" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'psychology',
          testId: 'eq',
        }}
      />
    </div>
  );
};
