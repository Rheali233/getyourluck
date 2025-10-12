import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestResult } from '@/modules/testing/types/TestTypes';

export interface VARKResultDisplayProps extends BaseComponentProps {
  result: TestResult;
  onShare?: () => void;
}

export const VARKResultDisplay: React.FC<VARKResultDisplayProps> = ({
  className,
  testId = 'vark-result-display',
  result,
  onShare
}) => {
  // Extract data from TestResult format
  let primaryStyle = (result as any).primaryStyle || (result as any).dominantStyle || result.data?.dominantStyle || 'Unknown';
  let secondaryStyle = (result as any).secondaryStyle || result.data?.secondaryStyle || '';
  const rootScores: Record<string, number> = (result as any).scores || (result as any).allScores || result.data?.allScores || {};
  const analysis = (result as any).analysis || result.data?.analysis || '';
  const meta = (result as any).metadata || result.data?.metadata || {};
  const recommendations = (result as any).recommendations || result.data?.recommendations || [];
  const studyTips = (result as any).studyTips || result.data?.studyTips || [];
  
  
  // 新的5个核心模块数据提取
  const learningProfile = (result as any).learningProfile || result.data?.learningProfile || {};
  const learningStrategiesImplementation = (result as any).learningStrategiesImplementation || result.data?.learningStrategiesImplementation || {};
  const learningEffectiveness = (result as any).learningEffectiveness || result.data?.learningEffectiveness || {};
  
  // 兼容旧格式数据
  const cognitiveProfile = (result as any).cognitiveProfile || result.data?.cognitiveProfile || {};
  const learningPreferences = (result as any).learningPreferences || result.data?.learningPreferences || {};
  const contextualInsights = (result as any).contextualInsights || result.data?.contextualInsights || {};
  const effectivenessPrediction = (result as any).effectivenessPrediction || result.data?.effectivenessPrediction || {};

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'Visual': return '👁️';
      case 'Auditory': return '👂';
      case 'Read/Write': return '📖';
      case 'Kinesthetic': return '✋';
      case 'Multimodal': return '🔄';
      default: return '🎓';
    }
  };

  // 处理风格数据，确保有百分比和等级
  const rawStyles = [
    { name: 'Visual', score: rootScores['V'] || rootScores['Visual'] || 0 },
    { name: 'Auditory', score: rootScores['A'] || rootScores['Auditory'] || 0 },
    { name: 'Read/Write', score: rootScores['R'] || rootScores['Reading'] || 0 },
    { name: 'Kinesthetic', score: rootScores['K'] || rootScores['Kinesthetic'] || 0 },
  ];
  
  // 动态分母：使用 metadata.totalQuestions 推断每维题数；每题满分4分
  const questionsPerDimension = Math.max(1, Math.round(((meta as any).totalQuestions || 16) / 4));
  const maxPerDimension = questionsPerDimension * 4;
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

  // Learning preference strength labels
  const levelOf = (p: number) => (
    p >= 80 ? 'Very strong preference' :
    p >= 60 ? 'Strong preference' :
    p >= 40 ? 'Moderate preference' :
    'Weak preference'
  );

  // 限制描述长度（100个单词以内）
  const limitWords = (text: any, maxWords = 100): string => {
    if (!text) return '';
    const s = String(text).trim();
    if (!s) return '';
    const words = s.split(/\s+/);
    if (words.length <= maxWords) return s;
    return words.slice(0, maxWords).join(' ') + '…';
  };

  // 专业科学描述 - 根据评分结果描述特征和倾向
  const getProfessionalDescription = (name: string, percent: number): string => {
    const level = levelOf(percent);
    const intensity = level.includes('Very strong') ? 'highly' : level.includes('Strong') ? 'moderately' : level.includes('Moderate') ? 'somewhat' : 'minimally';
    
    switch (name) {
      case 'Visual':
        return `Shows ${intensity} visual learning tendencies with ${level.includes('Weak') ? 'limited' : level.includes('Moderate') ? 'balanced' : 'strong'} preference for diagrams, charts, and spatial information processing.`;
      case 'Auditory':
        return `Exhibits ${intensity} auditory learning patterns with ${level.includes('Weak') ? 'preference for' : level.includes('Moderate') ? 'balanced approach to' : 'strong inclination toward'} listening-based information processing.`;
      case 'Read/Write':
        return `Demonstrates ${intensity} reading/writing orientation with ${level.includes('Weak') ? 'limited' : level.includes('Moderate') ? 'moderate' : 'strong'} preference for text-based learning materials.`;
      case 'Kinesthetic':
        return `Shows ${intensity} kinesthetic learning approach with ${level.includes('Weak') ? 'minimal' : level.includes('Moderate') ? 'moderate' : 'strong'} emphasis on hands-on and experiential learning.`;
      default:
        return `Shows ${intensity} characteristics in this learning style dimension.`;
    }
  };


  return (
    <div className={cn('min-h-screen py-8 px-4', className)} data-testid={testId}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* Primary Learning Styles - align layout with Love Style: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow">
                {getStyleIcon(primaryStyle)}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Learning Style Assessment</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Primary Style: </span>
                <span className="text-cyan-600 font-semibold">{primaryStyle}</span>
                {secondaryStyle && secondaryStyle !== primaryStyle && (
                  <>
                    {' | Secondary Style: '}
                    <span className="text-sky-600 font-semibold">{secondaryStyle}</span>
                  </>
                )}
              </div>
              {/* 学习风格特征简要说明 */}
              <div className="text-sm text-gray-600 mb-3">
                {primaryStyle === 'Visual' && 'You learn best through visual aids, diagrams, charts, and spatial representations. You prefer to see information rather than hear or read it.'}
                {primaryStyle === 'Auditory' && 'You learn most effectively through listening, discussions, and verbal explanations. You prefer to hear information and process it through sound.'}
                {primaryStyle === 'Read/Write' && 'You learn best through reading and writing activities. You prefer text-based materials and enjoy taking detailed notes.'}
                {primaryStyle === 'Kinesthetic' && 'You learn most effectively through hands-on activities, movement, and physical experience. You prefer to learn by doing rather than observing.'}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {limitWords(analysis) || 'Your learning style assessment reveals how you process and retain information most effectively.'}
              </p>
            </div>
          </div>
        </Card>

        {/* 维度分析卡片 - 完全参照Love Style的布局和样式 */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-sky-900 flex items-center">
            <span className="text-2xl mr-2">🎓</span>
            Learning Style Dimensions Analysis
          </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {styles.map((style) => (
              <div key={style.name} className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-sky-900">{style.name}</h4>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-sky-600">Preference level</span>
                  <span className="text-sm font-medium text-sky-900">{levelOf(style.percent)}</span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-700",
                        style.percent >= 80 ? "bg-gradient-to-r from-cyan-600 to-cyan-500" :
                        style.percent >= 60 ? "bg-gradient-to-r from-cyan-500 to-cyan-400" :
                        style.percent >= 40 ? "bg-gradient-to-r from-sky-500 to-sky-400" :
                        "bg-gradient-to-r from-sky-300 to-sky-400"
                      )}
                      style={{ width: `${style.percent}%` }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-sky-700">{getProfessionalDescription(style.name, style.percent)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 5个核心模块 - 重新组织 */}
        <div className="space-y-6">
          {/* 模块3: Learning Profile Analysis (学习特征分析) */}
          {(Object.keys(learningProfile).length > 0 || Object.keys(cognitiveProfile).length > 0) && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                Learning Profile
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 认知特征 */}
                {(learningProfile.cognitiveStrengths || cognitiveProfile.learningStrengths) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">💪</span>
                      Cognitive Strengths
                    </h4>
                    <div className="space-y-3">
                      {(learningProfile.cognitiveStrengths || cognitiveProfile.learningStrengths || []).map((strength: string, index: number) => (
                        <p key={index} className="text-sm text-sky-700 leading-relaxed">
                          {strength}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 学习偏好 */}
                {(learningProfile.learningPreferences || learningPreferences) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">📚</span>
                      Learning Preferences
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(learningProfile.learningPreferences || learningPreferences).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold text-sky-900 mb-1 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</h5>
                          <p className="text-sky-700 text-sm leading-relaxed">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 适应性 */}
                {(learningProfile.adaptability || contextualInsights) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🔄</span>
                      Adaptability
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(learningProfile.adaptability || contextualInsights).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold text-sky-900 mb-1 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</h5>
                          <p className="text-sky-700 text-sm leading-relaxed">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* 模块4: Learning Strategies (学习策略) */}
          {(Object.keys(learningStrategiesImplementation).length > 0 || recommendations.length > 0 || studyTips.length > 0) && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Learning Strategies
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 核心策略 */}
                {(learningStrategiesImplementation.coreStrategies || recommendations) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">💡</span>
                      Core Strategies
                    </h4>
                    <div className="space-y-3">
                      {(learningStrategiesImplementation.coreStrategies || recommendations).slice(0, 6).map((strategy: string, index: number) => (
                        <p key={index} className="text-sm text-sky-700 leading-relaxed">
                          {strategy}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 实用技巧 */}
                {(learningStrategiesImplementation.practicalTips || studyTips) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">📝</span>
                      Study Tips
                    </h4>
                    <div className="space-y-3">
                      {(learningStrategiesImplementation.practicalTips || studyTips).slice(0, 6).map((tip: string, index: number) => (
                        <p key={index} className="text-sm text-sky-700 leading-relaxed">
                          {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 环境设置 */}
                {learningStrategiesImplementation.environmentSetup && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🏠</span>
                      Environment
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(learningStrategiesImplementation.environmentSetup).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold text-sky-900 mb-1 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</h5>
                          <p className="text-sky-700 text-sm leading-relaxed">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* 模块5: Learning Effectiveness (学习效果) */}
          {(Object.keys(learningEffectiveness).length > 0 || Object.keys(effectivenessPrediction).length > 0) && (
            <Card className="p-6 bg-transparent border-0">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Learning Effectiveness
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 效果预测 */}
                {(learningEffectiveness.optimalConditions || effectivenessPrediction.optimalConditions) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">⚡</span>
                      Optimal Conditions
                    </h4>
                    <div className="space-y-3">
                      {(learningEffectiveness.optimalConditions || effectivenessPrediction.optimalConditions || []).slice(0, 4).map((condition: string, index: number) => (
                        <p key={index} className="text-sm text-sky-700 leading-relaxed">
                          {condition}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 预期表现 */}
                {(learningEffectiveness.expectedPerformance || effectivenessPrediction.expectedPerformance) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">📈</span>
                      Performance
                    </h4>
                    <p className="text-sm text-sky-700 leading-relaxed">
                      {learningEffectiveness.expectedPerformance || effectivenessPrediction.expectedPerformance}
                    </p>
                  </div>
                )}
                
                {/* 改进领域 */}
                {(learningEffectiveness.improvementAreas || effectivenessPrediction.improvementAreas) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-sky-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🔧</span>
                      Improvement
                    </h4>
                    <div className="space-y-3">
                      {(learningEffectiveness.improvementAreas || effectivenessPrediction.improvementAreas || []).slice(0, 4).map((area: string, index: number) => (
                        <p key={index} className="text-sm text-sky-700 leading-relaxed">
                          {area}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center space-x-4">
          {onShare && (
            <button
              onClick={onShare}
              className="px-8 py-3 rounded-xl font-semibold border-2 border-sky-500 text-sky-600 hover:bg-sky-50 transition-all duration-200"
            >
              Share Results
            </button>
          )}
        </div>
      </div>
      
      <FeedbackFloatingWidget testContext={{ testType: "vark" }} />
    </div>
  );
};
