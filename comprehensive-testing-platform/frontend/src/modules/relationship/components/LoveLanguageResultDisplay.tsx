/**
 * Love Language Result Display Component
 * 爱情语言测试结果显示组件
 * 使用粉/玫色调主题
 */

import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import { ContextualLinks } from '@/components/InternalLinks';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestResult } from '@/modules/testing/types/TestTypes';

export interface LoveLanguageResultDisplayProps extends BaseComponentProps {
  result: TestResult;
  onReset: () => void;
  onShare?: () => void;
}

export const LoveLanguageResultDisplay: React.FC<LoveLanguageResultDisplayProps> = ({
  className,
  testId = 'love-language-result-display',
  result,
  // remove unused props to satisfy lints
  ...props
}) => {
  
  // Extract data from TestResult format
  // 读取根层字段并兜底
  let primaryLanguage = (result as any).primaryType || (result as any).primaryLanguage || result.data?.primaryLanguage || 'Unknown';
  let secondaryLanguage = (result as any).secondaryType || (result as any).secondaryLanguage || result.data?.secondaryLanguage || '';
  // 统一根层读取，兼容 allScores/scores
  const rootScores: Record<string, number> = (result as any).scores || (result as any).allScores || result.data?.allScores || {};
  const analysis = (result as any).analysis || result.data?.analysis || result.data?.interpretation || (result as any).interpretation || '';
  const meta = (result as any).metadata || result.data?.metadata || {};
  const recommendations = result.recommendations || result.data?.communicationTips || [];
  const loveLanguageDetails = (result as any).loveLanguageDetails || result.data?.loveLanguageDetails || {};
  const communicationTips: string[] = (result as any).communicationTips || result.data?.communicationTips || [];
  const growthAreas: string[] = (result as any).growthAreas || result.data?.growthAreas || [];
  const giftSuggestions: string[] = (result as any).giftSuggestions || result.data?.giftSuggestions || [];
  const dateIdeas: string[] = (result as any).dateIdeas || result.data?.dateIdeas || [];
  
  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'Words of Affirmation': return '💬';
      case 'Acts of Service': return '🤝';
      case 'Receiving Gifts': return '🎁';
      case 'Quality Time': return '⏰';
      case 'Physical Touch': return '🤗';
      default: return '💕';
    }
  };

  // 颜色在下方进度条直接内联判断，这里不再单独维护映射

  // 维度与分数
  const rawLanguages = [
    { name: 'Words of Affirmation', score: rootScores['Words of Affirmation'] || 0 },
    { name: 'Acts of Service', score: rootScores['Acts of Service'] || 0 },
    { name: 'Receiving Gifts', score: rootScores['Receiving Gifts'] || 0 },
    { name: 'Quality Time', score: rootScores['Quality Time'] || 0 },
    { name: 'Physical Touch', score: rootScores['Physical Touch'] || 0 },
  ];
  // 动态分母：使用 metadata.totalQuestions 推断每维题数
  const questionsPerDimension = Math.max(1, Math.round(((meta as any).totalQuestions || 30) / 5));
  const maxPerDimension = questionsPerDimension * 5;
  const languages = rawLanguages
    .map(l => ({ ...l, percent: Math.max(0, Math.min(100, Math.round((l.score / maxPerDimension) * 100))) }))
    .sort((a, b) => b.percent - a.percent);

  // Preference strength labels (no growth implication)
  // Thresholds aligned with Likert scale semantics: 60% = average 3.0 (Neutral)
  const levelOf = (p: number) => (
    p >= 80 ? 'Very high preference' :    // 80-100%: Average 4.0+ out of 5 (Agree+)
    p >= 60 ? 'High preference' :         // 60-79%: Average 3.0-3.9 out of 5 (Neutral to Agree)
    p >= 40 ? 'Moderate preference' :     // 40-59%: Average 2.0-2.9 out of 5 (Disagree to Neutral)
    'Low preference'                      // 0-39%: Average 0-1.9 out of 5 (Strongly Disagree to Disagree)
  );

  // AI interpretation getter per dimension with safe fallback
  const getInterpretation = (name: string, percent: number): string | null => {
    const details: any = (loveLanguageDetails as any)?.[name] || {};
    const desc: string | undefined = details.description;
    const isPlaceholder = !!desc && (/^Basic guidance for /i.test(desc) || /^Feeling loved /i.test(desc) || /^Feeling valued /i.test(desc));
    if (desc && !isPlaceholder) return desc;
    const level = levelOf(percent);
    switch (name) {
      case 'Words of Affirmation':
        return level === 'Low preference'
          ? 'Verbal compliments have limited impact for you; actions or shared time may speak louder.'
          : level === 'Moderate preference'
          ? 'Sincere, specific words help when combined with other expressions.'
          : level === 'High preference'
          ? 'Genuine encouragement and concrete appreciation strongly nourish your bond.'
          : 'Consistent, meaningful affirmations are your primary fuel for feeling loved.';
      case 'Acts of Service':
        return level === 'Low preference'
          ? 'Practical help is not your main signal; other languages likely matter more.'
          : level === 'Moderate preference'
          ? 'Supportive actions help in busy times but are not always essential.'
          : level === 'High preference'
          ? 'Follow‑through and visible help make you feel truly cared for.'
          : 'Reliability and helpful actions are central to how you receive love.';
      case 'Receiving Gifts':
        return level === 'Low preference'
          ? 'Objects alone rarely convey love for you; shared experiences matter more.'
          : level === 'Moderate preference'
          ? 'Thoughtful tokens can enhance connection when meaningful.'
          : level === 'High preference'
          ? 'Symbolic gifts that reflect understanding feel deeply touching.'
          : 'Rituals and keepsakes strongly anchor your sense of being cherished.';
      case 'Quality Time':
        return level === 'Low preference'
          ? 'Length of time together is less crucial than other expressions.'
          : level === 'Moderate preference'
          ? 'Focused time helps in key moments; depth over duration.'
          : level === 'High preference'
          ? 'Undistracted presence and shared experiences recharge you.'
          : 'Complete attention and meaningful time are your top love signals.';
      case 'Physical Touch':
        return level === 'Low preference'
          ? 'Touch is not your primary cue; space and boundaries may be valued.'
          : level === 'Moderate preference'
          ? 'Warm, context‑appropriate touch adds comfort when suitable.'
          : level === 'High preference'
          ? 'Timely touch communicates safety and support strongly.'
          : 'Frequent, affectionate touch is essential to feeling connected.';
      default:
        return null;
    }
  };

  // 若后端未给primary/secondary或为Unknown，用分数计算兜底
  if (!primaryLanguage || primaryLanguage === 'Unknown') {
    const top = languages[0];
    if (top && top.percent > 0) primaryLanguage = top.name as any;
  }
  if (!secondaryLanguage) {
    const second = languages[1];
    if (second && second.percent > 0) secondaryLanguage = second.name as any;
  }

  // 细节模块已删除，不再需要该工具函数

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">

        {/* Primary Language - align layout with DISC: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-pink-500 to-teal-500 text-white shadow">
                {getLanguageIcon(primaryLanguage)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Love Language Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Love Languages: </span>
                <span className="text-pink-600 font-semibold">{primaryLanguage}</span>
                {secondaryLanguage && (
                  <>
                    {' , '}
                    <span className="text-teal-600 font-semibold">{secondaryLanguage}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis || 'AI analysis will provide detailed interpretation for Words of Affirmation love language'}
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

        {/* Language Scores */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📊</span>
            Love Language Dimensions Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languages.map((language) => (
              <div key={language.name} className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {language.name}
                  </h4>
                </div>
                {/* Level row (DISC-style): label left, value right */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Level</span>
                  <span className="text-sm font-medium text-gray-900">{levelOf(language.percent)}</span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-white/60 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-700",
                    language.percent >= 80 ? "bg-gradient-to-r from-pink-600 to-pink-500" :
                    language.percent >= 60 ? "bg-gradient-to-r from-pink-500 to-pink-400" :
                    "bg-gradient-to-r from-pink-300 to-pink-400"
                  )}
                  style={{ width: `${language.percent}%` }}
                />
                  </div>
                </div>
                {/* Percentage hint removed per unified style */}
                {/* 去掉排名显示 */}
                <div className="hidden" />

                {/* 维度解释（不再展示逐维度 Do 列表，避免与 Guidance 重复） */}
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{getInterpretation(language.name, language.percent)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Details for primary and secondary languages */}
        {/* Details section removed per request */}

        {/* Guidance + Ideas (merged, remove Relationship Insights) */}
        {(communicationTips.length > 0 || growthAreas.length > 0 || giftSuggestions.length > 0 || dateIdeas.length > 0) && (
          <Card className="p-6 bg-transparent border-0">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
              <span className="text-2xl mr-2">🧭</span>
              Guidance & Ideas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communicationTips.length > 0 && (
                <div className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Communication Tips</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {communicationTips.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              )}
              {growthAreas.length > 0 && (
                <div className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Growth Plan</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {growthAreas.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              )}
              {giftSuggestions.length > 0 && (
                <div className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Gift Suggestions</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {giftSuggestions.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              )}
              {dateIdeas.length > 0 && (
                <div className="p-6 rounded-lg bg-pink-50 border border-pink-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Date Ideas</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {dateIdeas.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Next steps removed per request */}

        {/* Disclaimer - align tone with PHQ-9 page */}
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This assessment offers guidance for relationship understanding and growth. It is not a
            substitute for professional counseling or therapy. For complex relationship challenges, consider consulting a qualified
            relationship counselor.
          </p>
        </div>

        {/* Recommendations */}
        {(recommendations && recommendations.length > 0) && (
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Personalized Recommendations
          </h3>
            <div className="p-6 bg-pink-50 rounded-lg border border-pink-200">
            <ul className="space-y-2">
                {recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="text-sm text-pink-800 flex items-start">
                  <span className="text-pink-600 mr-2 mt-0.5">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </Card>
        )}

        {/* Action buttons removed per request */}
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="love_language" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'relationship',
          testId: 'love-language',
        }}
      />
    </div>
  );
};
