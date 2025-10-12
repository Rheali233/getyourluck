/**
 * Interpersonal Skills Result Display Component
 * 人际技能测试结果显示组件
 * 使用粉/玫色调主题
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface InterpersonalResultDisplayProps extends BaseComponentProps {
  result: any;
}

export const InterpersonalResultDisplay: React.FC<InterpersonalResultDisplayProps> = ({
  className,
  testId = 'interpersonal-result-display',
  result,
  ...props
}) => {
  // 统一等级阈值与文案
  const levelOf = (p: number) => (
    p >= 80 ? 'Very high level' :
    p >= 60 ? 'High level' :
    p >= 40 ? 'Moderate level' :
    'Low level'
  );

  const limitWords = (text: string | undefined, maxWords = 80) => {
    const s = (text || '').trim();
    if (!s) return '';
    const words = s.split(/\s+/);
    if (words.length <= maxWords) return s;
    return words.slice(0, maxWords).join(' ') + '…';
  };

  // 兼容不同结果结构（root 或 data）
  const data: any = (result as any)?.data || result;
  const overallPct: number = Math.round((data.percentage ?? data.overallScore ?? 0) * 100) / 100;
  const overallLevel: string = (data.level as string) || levelOf(Number(overallPct));

  const allDimensions: Array<{ dimension: string; percentage: number; level?: string }> =
    Array.isArray(data.allDimensions) ? data.allDimensions : [];

  const dimensionDetails: Record<string, { description?: string }> = data.dimensionDetails || {};

  // 旧结构回退：从categoryScores构建
  const fallbackDimensions = (() => {
    const cs = data.categoryScores || {};
    const entries = Object.entries(cs) as Array<[string, number]>;
    return entries.map(([k, v]) => ({
      dimension: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      percentage: v,
      level: levelOf(Number(v))
    }));
  })();

  const dimensions = (allDimensions && allDimensions.length > 0) ? allDimensions : fallbackDimensions;

  const categories = dimensions.map(d => ({ name: d.dimension, score: d.percentage, icon: '📈', level: d.level || levelOf(d.percentage) }));

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* Overall - align layout with other modules */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow">
                🤝
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Interpersonal Skills Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Overall: </span>
                <span className="text-pink-600 font-semibold">{overallLevel}</span>
                <span className="ml-2 text-gray-500">({overallPct}%)</span>
              </div>
              {/* Removed overall progress bar per requirement */}
              {data.analysis && (
                <p className="text-sm text-gray-700 leading-relaxed mt-3">
                  {data.analysis}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Interpersonal Dimensions Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Interpersonal Dimensions Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">{category.icon}</span>
                  {category.name}
                </h4>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="text-sm font-medium text-gray-900">{category.level}</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-700",
                        "bg-gradient-to-r from-pink-600 to-pink-500"
                      )}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </div>
                {/* 维度简要描述（来自AI） */}
                {Boolean(dimensionDetails && typeof dimensionDetails === 'object' && (dimensionDetails as any)[category.name] && (dimensionDetails as any)[category.name].description) && (
                  <p className="text-sm text-gray-700">{limitWords((dimensionDetails as any)[category.name].description)}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* (Removed) Strengths and Areas for Improvement */}

        {/* Professional Analysis - 四个模块 */}
        {(data.psychologicalProfile || data.developmentalInsights || data.relationshipDynamics || data.predictiveInsights) && (
          <>
            {/* Psychological Profile */}
            {data.psychologicalProfile && (
              <Card className="p-6 bg-transparent border-0">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">🧠</span>
                  Psychological Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.psychologicalProfile.communicationStyle && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Communication Style</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.psychologicalProfile.communicationStyle}</p>
                    </div>
                  )}
                  {data.psychologicalProfile.empathyPatterns && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Empathy Patterns</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.psychologicalProfile.empathyPatterns}</p>
                    </div>
                  )}
                  {data.psychologicalProfile.selfAwareness && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Self-Awareness</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.psychologicalProfile.selfAwareness}</p>
                    </div>
                  )}
                  {data.psychologicalProfile.emotionRegulation && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Emotion Regulation</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.psychologicalProfile.emotionRegulation}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Developmental Insights */}
            {data.developmentalInsights && (
              <Card className="p-6 bg-transparent border-0">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">🌱</span>
                  Developmental Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.developmentalInsights.backgroundInfluence && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Background Influence</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.developmentalInsights.backgroundInfluence}</p>
                    </div>
                  )}
                  {data.developmentalInsights.culturalFactors && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Cultural Factors</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.developmentalInsights.culturalFactors}</p>
                    </div>
                  )}
                  {data.developmentalInsights.growthPotential && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Growth Potential</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.developmentalInsights.growthPotential}</p>
                    </div>
                  )}
                  {data.developmentalInsights.lifeStageConsiderations && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Life Stage Considerations</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.developmentalInsights.lifeStageConsiderations}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Relationship Dynamics */}
            {data.relationshipDynamics && (
              <Card className="p-6 bg-transparent border-0">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">⚖️</span>
                  Relationship Dynamics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.relationshipDynamics.collaborationPatterns && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Collaboration Patterns</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.relationshipDynamics.collaborationPatterns}</p>
                    </div>
                  )}
                  {data.relationshipDynamics.boundarySetting && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Boundary Setting</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.relationshipDynamics.boundarySetting}</p>
                    </div>
                  )}
                  {data.relationshipDynamics.conflictPatterns && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Conflict Patterns</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.relationshipDynamics.conflictPatterns}</p>
                    </div>
                  )}
                  {data.relationshipDynamics.trustBuilding && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Trust Building</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.relationshipDynamics.trustBuilding}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Predictive Insights */}
            {data.predictiveInsights && (
              <Card className="p-6 bg-transparent border-0">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">🔮</span>
                  Predictive Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.predictiveInsights.workplaceForecasting && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Workplace Forecasting</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.predictiveInsights.workplaceForecasting}</p>
                    </div>
                  )}
                  {data.predictiveInsights.compatibilityMatrix && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Compatibility Matrix</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.predictiveInsights.compatibilityMatrix}</p>
                    </div>
                  )}
                  {data.predictiveInsights.growthRoadmap && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Growth Roadmap</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.predictiveInsights.growthRoadmap}</p>
                    </div>
                  )}
                  {data.predictiveInsights.interventionStrategies && (
                    <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                      <h4 className="font-medium text-pink-900 text-sm mb-2">Intervention Strategies</h4>
                      <p className="text-xs text-gray-700 leading-relaxed">{data.predictiveInsights.interventionStrategies}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        <FeedbackFloatingWidget testContext={{ testType: 'interpersonal' }} />
      </div>
    </div>
  );
};
