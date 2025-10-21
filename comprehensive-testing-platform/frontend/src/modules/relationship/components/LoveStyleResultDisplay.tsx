/**
 * Love Style Result Display Component
 * 爱情风格测试结果显示组件
 * 使用粉/玫色调主题，参考Love Language的UI设计
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import { ContextualLinks } from '@/components/InternalLinks';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestResult } from '@/modules/testing/types/TestTypes';

export interface LoveStyleResultDisplayProps extends BaseComponentProps {
  result: TestResult;
  onReset: () => void;
  onShare?: () => void;
}

export const LoveStyleResultDisplay: React.FC<LoveStyleResultDisplayProps> = ({
  className,
  testId = 'love-style-result-display',
  result,
  // onReset,
  // onShare,
  ...props
}) => {
  
  // Extract data from TestResult format
  let primaryStyle = (result as any).primaryStyle || (result as any).dominantStyle || result.data?.dominantStyle || 'Unknown';
  let secondaryStyle = (result as any).secondaryStyle || result.data?.secondaryStyle || '';
  const rootScores: Record<string, number> = (result as any).scores || (result as any).allScores || result.data?.allScores || {};
  const analysis = (result as any).analysis || result.data?.analysis || result.data?.interpretation || (result as any).interpretation || '';
  const meta = (result as any).metadata || result.data?.metadata || {};
  
  // 新增专业解读字段
  const psychologicalProfile = (result as any).psychologicalProfile || result.data?.psychologicalProfile || {};
  const developmentalInsights = (result as any).developmentalInsights || result.data?.developmentalInsights || {};
  const relationshipDynamicsDetailed = (result as any).relationshipDynamics || result.data?.relationshipDynamics || {};
  const predictiveInsights = (result as any).predictiveInsights || result.data?.predictiveInsights || {};


  // const normalizeText = (text: string) =>
  //   (text || '')
  //     .toLowerCase()
  //     .replace(/\s+/g, ' ')
  //     .replace(/[.,;:!?'"()\[\]{}]/g, '')
  //     .trim();

  const professionalContextTexts: string[] = [];
  // Psychological Profile
  Object.values(psychologicalProfile || {}).forEach((v) => {
    if (typeof v === 'string') professionalContextTexts.push(v);
  });
  // Developmental Insights
  Object.values(developmentalInsights || {}).forEach((v) => {
    if (typeof v === 'string') professionalContextTexts.push(v);
  });
  // Relationship Dynamics (detailed)
  Object.values(relationshipDynamicsDetailed || {}).forEach((v) => {
    if (typeof v === 'string') professionalContextTexts.push(v);
  });
  // Predictive Insights
  Object.values(predictiveInsights || {}).forEach((v) => {
    if (typeof v === 'string') professionalContextTexts.push(v);
  });

  // const professionalContextCombined = normalizeText(professionalContextTexts.join(' '));


  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'Eros': return '💕';
      case 'Ludus': return '🎮';
      case 'Storge': return '🤝';
      case 'Pragma': return '📊';
      case 'Mania': return '🔥';
      case 'Agape': return '🙏';
      default: return '💕';
    }
  };

  // 处理风格数据，确保有百分比和等级
  const rawStyles = [
    { name: 'Eros', score: rootScores['Eros'] || 0 },
    { name: 'Ludus', score: rootScores['Ludus'] || 0 },
    { name: 'Storge', score: rootScores['Storge'] || 0 },
    { name: 'Pragma', score: rootScores['Pragma'] || 0 },
    { name: 'Mania', score: rootScores['Mania'] || 0 },
    { name: 'Agape', score: rootScores['Agape'] || 0 },
  ];
  
  // 动态分母：使用 metadata.totalQuestions 推断每维题数；每题满分5分
  const questionsPerDimension = Math.max(1, Math.round(((meta as any).totalQuestions || 30) / 6));
  const maxPerDimension = questionsPerDimension * 5;
  const styles = rawStyles
    .map(s => ({ ...s, percent: Math.max(0, Math.min(100, Math.round((s.score / maxPerDimension) * 100))) }))
    .sort((a, b) => b.percent - a.percent);

  // 如果AI没有提供primary/secondary，从排序结果推断
  if (primaryStyle === 'Unknown' && styles.length > 0) {
    const top = styles[0];
    if (top && top.percent > 0) primaryStyle = top.name as any;
  }
  if (!secondaryStyle && styles.length > 1) {
    const second = styles[1];
    if (second && second.percent > 0) secondaryStyle = second.name as any;
  }

  // Alignment level labels（与Love Language阈值一致，但术语改为alignment）
  const levelOf = (p: number) => (
    p >= 80 ? 'Very high alignment' :
    p >= 60 ? 'High alignment' :
    p >= 40 ? 'Moderate alignment' :
    'Low alignment'
  );


  // 专业科学描述 - 根据评分结果描述特征和倾向
  const getProfessionalDescription = (name: string, percent: number): string => {
    const level = levelOf(percent);
    const intensity = level.includes('Very high') ? 'highly' : level.includes('High') ? 'moderately' : level.includes('Moderate') ? 'somewhat' : 'minimally';
    
    switch (name) {
      case 'Eros':
        return `Shows ${intensity} passionate romantic tendencies with ${level.includes('Low') ? 'limited' : level.includes('Moderate') ? 'balanced' : 'strong'} emotional intensity and physical expression preferences.`;
      case 'Ludus':
        return `Exhibits ${intensity} playful relationship patterns with ${level.includes('Low') ? 'preference for' : level.includes('Moderate') ? 'balanced approach to' : 'strong inclination toward'} casual dating dynamics.`;
      case 'Storge':
        return `Demonstrates ${intensity} friendship-based love orientation with ${level.includes('Low') ? 'limited' : level.includes('Moderate') ? 'moderate' : 'strong'} preference for gradual relationship development.`;
      case 'Pragma':
        return `Shows ${intensity} practical relationship approach with ${level.includes('Low') ? 'minimal' : level.includes('Moderate') ? 'moderate' : 'strong'} emphasis on compatibility and shared goals.`;
      case 'Mania':
        return `Exhibits ${intensity} intense emotional attachment patterns with ${level.includes('Low') ? 'healthy' : level.includes('Moderate') ? 'moderate' : 'high'} emotional dependency tendencies.`;
      case 'Agape':
        return `Demonstrates ${intensity} selfless love orientation with ${level.includes('Low') ? 'balanced' : level.includes('Moderate') ? 'moderate' : 'strong'} altruistic giving behaviors.`;
      default:
        return `Shows ${intensity} characteristics in this love style dimension.`;
    }
  };

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* Primary Love Styles - align layout with Love Language: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow">
                {getStyleIcon(primaryStyle)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Love Style Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Primary Style: </span>
                <span className="text-pink-600 font-semibold">{primaryStyle}</span>
                {secondaryStyle && (
                  <>
                    {' | Secondary Style: '}
                    <span className="text-rose-600 font-semibold">{secondaryStyle}</span>
                  </>
                )}
              </div>
              {/* 风格特征简要说明 */}
              <div className="text-sm text-gray-600 mb-3">
                {primaryStyle === 'Eros' && 'You are passionate and intense in love, seeking deep emotional and physical connections with dramatic romantic experiences.'}
                {primaryStyle === 'Ludus' && 'You approach love as a playful game, enjoying the excitement of dating and flirting without heavy emotional commitment.'}
                {primaryStyle === 'Storge' && 'You build love gradually through friendship and shared experiences, valuing deep companionship over passionate intensity.'}
                {primaryStyle === 'Pragma' && 'You approach love practically, seeking compatibility and shared life goals over emotional intensity.'}
                {primaryStyle === 'Mania' && 'You experience love with intense, sometimes overwhelming emotions and strong attachment needs.'}
                {primaryStyle === 'Agape' && 'You express love through selfless giving and unconditional care, prioritizing your partner\'s happiness.'}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis || 'Your love style assessment reveals how you approach romantic relationships and express love.'}
              </p>
              {/* Debug info */}
              {!analysis && (
                <div className="mt-2 text-xs text-red-600 border border-red-200 p-2 rounded bg-red-50">
                  <strong>Debug:</strong> No analysis found. Available fields: {Object.keys(result).join(', ')}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Love Style Dimensions Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">💕</span>
            Love Style Dimensions Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <div key={style.name} className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{style.name}</h4>
                </div>
                  <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Alignment level</span>
                  <span className="text-sm font-medium text-gray-900">{levelOf(style.percent)}</span>
                  </div>
                <div className="mb-3">
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-700",
                        style.percent >= 80 ? "bg-gradient-to-r from-pink-600 to-pink-500" :
                        style.percent >= 60 ? "bg-gradient-to-r from-pink-500 to-pink-400" :
                        "bg-gradient-to-r from-pink-300 to-pink-400"
                      )}
                      style={{ width: `${style.percent}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{getProfessionalDescription(style.name, style.percent)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Professional Analysis - 垂直分布 */}
        <div className="space-y-6">
          {/* Psychological Profile */}
          {Object.keys(psychologicalProfile).length > 0 && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                Psychological Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {psychologicalProfile.emotionalExpression && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Emotional Expression</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{psychologicalProfile.emotionalExpression}</p>
                  </div>
                )}
                {psychologicalProfile.attachmentStyle && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Attachment Style</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{psychologicalProfile.attachmentStyle}</p>
                  </div>
                )}
                {psychologicalProfile.selfAwareness && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Self-Awareness</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{psychologicalProfile.selfAwareness}</p>
                  </div>
                )}
                {psychologicalProfile.emotionalRegulation && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Emotional Regulation</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{psychologicalProfile.emotionalRegulation}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Developmental Insights */}
          {Object.keys(developmentalInsights).length > 0 && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🌱</span>
                Developmental Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {developmentalInsights.backgroundInfluence && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Background Influence</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{developmentalInsights.backgroundInfluence}</p>
                  </div>
                )}
                {developmentalInsights.culturalFactors && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Cultural Factors</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{developmentalInsights.culturalFactors}</p>
                  </div>
                )}
                {developmentalInsights.growthPotential && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Growth Potential</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{developmentalInsights.growthPotential}</p>
                  </div>
                )}
                {developmentalInsights.lifeStageConsiderations && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Life Stage Considerations</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{developmentalInsights.lifeStageConsiderations}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Relationship Dynamics */}
          {Object.keys(relationshipDynamicsDetailed).length > 0 && (
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">⚖️</span>
                Relationship Dynamics
          </h3>
              <div className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                <div className="space-y-3 text-sm text-gray-700">
                  {relationshipDynamicsDetailed.powerBalance && (
                    <div>
                      <span className="font-medium text-pink-900">Power Balance:</span>
                      <p className="mt-1">{relationshipDynamicsDetailed.powerBalance}</p>
                    </div>
                  )}
                  {relationshipDynamicsDetailed.boundarySetting && (
                    <div>
                      <span className="font-medium text-pink-900">Boundary Setting:</span>
                      <p className="mt-1">{relationshipDynamicsDetailed.boundarySetting}</p>
                    </div>
                  )}
                  {relationshipDynamicsDetailed.conflictPatterns && (
                    <div>
                      <span className="font-medium text-pink-900">Conflict Patterns:</span>
                      <p className="mt-1">{relationshipDynamicsDetailed.conflictPatterns}</p>
                    </div>
                  )}
                  {relationshipDynamicsDetailed.intimacyNeeds && (
                    <div>
                      <span className="font-medium text-pink-900">Intimacy Needs:</span>
                      <p className="mt-1">{relationshipDynamicsDetailed.intimacyNeeds}</p>
                    </div>
                  )}
                </div>
          </div>
        </Card>
          )}

          {/* Predictive Insights */}
          {Object.keys(predictiveInsights).length > 0 && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🔮</span>
                Predictive Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {predictiveInsights.relationshipForecasting && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Relationship Forecasting</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{predictiveInsights.relationshipForecasting}</p>
                  </div>
                )}
                {predictiveInsights.compatibilityMatrix && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Compatibility Matrix</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{predictiveInsights.compatibilityMatrix}</p>
                  </div>
                )}
                {predictiveInsights.growthRoadmap && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Growth Roadmap</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{predictiveInsights.growthRoadmap}</p>
                  </div>
                )}
                {predictiveInsights.interventionStrategies && (
                  <div className="p-4 rounded-lg bg-pink-50 border border-pink-200">
                    <h4 className="font-medium text-pink-900 text-sm mb-2">Intervention Strategies</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{predictiveInsights.interventionStrategies}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

      </div>

      {/* Related content - consistent UI spacing */}
      <ContextualLinks context="result" testType="love_style" className="mt-4" />
      <FeedbackFloatingWidget testContext={{ testType: "love-style" }} />
    </div>
  );
};