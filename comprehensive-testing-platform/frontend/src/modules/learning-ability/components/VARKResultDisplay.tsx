import React from 'react';
import { Card, FeedbackFloatingWidget } from '@/components/ui';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestResult } from '@/modules/testing/types/TestTypes';
import { ContextualLinks } from '@/components/InternalLinks';

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
  const interpretation = (result as any).interpretation || result.data?.interpretation || '';
  const meta = (result as any).metadata || result.data?.metadata || {};
  const recommendations = (result as any).recommendations || result.data?.recommendations || [];
  const studyTips = (result as any).studyTips || result.data?.studyTips || [];
  const learningStrategies = (result as any).learningStrategies || result.data?.learningStrategies || [];
  
  
  // 核心模块数据提取
  const learningProfile = (result as any).learningProfile || result.data?.learningProfile || {};
  const learningStrategiesImplementation = (result as any).learningStrategiesImplementation || result.data?.learningStrategiesImplementation || {};
  
  // 兼容旧格式数据
  const cognitiveProfile = (result as any).cognitiveProfile || result.data?.cognitiveProfile || {};
  const learningPreferences = (result as any).learningPreferences || result.data?.learningPreferences || {};
  const contextualInsights = (result as any).contextualInsights || result.data?.contextualInsights || {};

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




  return (
    <div className={cn('min-h-screen py-8 px-4 bg-gradient-to-br from-cyan-100 via-sky-200 to-cyan-200', className)} data-testid={testId}>
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
                <span className="text-gray-900 font-semibold">{primaryStyle}</span>
                {secondaryStyle && secondaryStyle !== primaryStyle && (
                  <>
                    {' | Secondary Style: '}
                    <span className="text-gray-900 font-semibold">{secondaryStyle}</span>
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
                {interpretation || 'Your learning style assessment reveals how you process and retain information most effectively.'}
              </p>
            </div>
          </div>
        </Card>

        {/* 维度分析卡片 - 使用AI个性化分析 */}
        <Card className="p-6 bg-transparent border-0">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🎓</span>
            Learning Style Dimensions Analysis
          </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {styles.map((style) => {
              // 使用AI生成的个性化分析
              const dimensionsAnalysis = (result as any).dimensionsAnalysis;
              let analysis = null;
              
              if (dimensionsAnalysis && typeof dimensionsAnalysis === 'object') {
                // 直接通过键获取AI生成的分析
                analysis = dimensionsAnalysis[style.name];
              }
              
              return (
                <div key={style.name} className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                  <div className="mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{style.name}</h4>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Preference level</span>
                    <span className="text-sm font-medium text-gray-900">{levelOf(style.percent)}</span>
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
                    <p className="text-sm text-gray-700">
                      {analysis || 'AI analysis not available for this learning style dimension.'}
                    </p>
                  </div>
                </div>
              );
            })}
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
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">💪</span>
                      Cognitive Strengths
                    </h4>
                    <div className="space-y-3">
                      {(learningProfile.cognitiveStrengths || cognitiveProfile.learningStrengths || []).map((strength: string, index: number) => (
                        <p key={index} className="text-sm text-gray-700 leading-relaxed">
                          {strength}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 学习偏好 */}
                {(learningProfile.learningPreferences || learningPreferences) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">📚</span>
                      Learning Preferences
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(learningProfile.learningPreferences || learningPreferences).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold text-gray-900 mb-1 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 适应性 */}
                {(learningProfile.adaptability || contextualInsights) && (
                  <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-xl mr-2">🔄</span>
                      Adaptability
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(learningProfile.adaptability || contextualInsights).map(([key, value]) => (
                        <div key={key}>
                          <h5 className="font-semibold text-gray-900 mb-1 capitalize">{String(key).replace(/([A-Z])/g, ' $1').trim()}</h5>
                          <p className="text-gray-700 text-sm leading-relaxed">{Array.isArray(value) ? value.join(', ') : String(value)}</p>
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
                <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">💡</span>
                    Core Strategies
                  </h4>
                  <div className="space-y-3">
                    {(learningStrategies || learningStrategiesImplementation.coreStrategies || recommendations || [
                      `Focus on ${primaryStyle.toLowerCase()} learning methods to maximize your learning efficiency`,
                      `Create structured study environments that support your ${primaryStyle.toLowerCase()} preferences`,
                      `Use multi-sensory approaches when possible to reinforce learning`,
                      `Practice active recall techniques aligned with your learning style`,
                      `Set up dedicated study spaces optimized for your learning preferences`
                    ]).slice(0, 6).map((strategy: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed">
                        {strategy}
                      </p>
                    ))}
                  </div>
                </div>
                
                {/* 实用技巧 */}
                <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">📝</span>
                    Study Tips
                  </h4>
                  <div className="space-y-3">
                    {(learningStrategiesImplementation.practicalTips || studyTips || [
                      `Break down complex information into ${primaryStyle.toLowerCase()} formats for better comprehension`,
                      `Use ${primaryStyle.toLowerCase()} study aids and tools to enhance retention`,
                      `Take regular breaks and vary your study methods to maintain engagement`,
                      `Review material using ${primaryStyle.toLowerCase()}-preferred techniques`,
                      `Connect new information to existing knowledge using your learning style strengths`
                    ]).slice(0, 6).map((tip: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
                
                {/* 环境设置 */}
                <div className="p-6 rounded-lg bg-cyan-50 border border-cyan-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">🏠</span>
                    Environment
                  </h4>
                  <div className="space-y-3">
                    {(learningProfile.learningPreferences?.environments || learningStrategiesImplementation.environmentSetup || [
                      `Create a ${primaryStyle.toLowerCase()}-friendly study space with appropriate lighting and materials`,
                      `Minimize distractions and ensure comfortable seating for extended study sessions`,
                      `Organize materials in a way that supports your ${primaryStyle.toLowerCase()} learning preferences`,
                      `Consider background noise levels that work best for your learning style`
                    ]).map((environment: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700 leading-relaxed">
                        {environment}
                      </p>
                    ))}
                  </div>
                </div>
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
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="vark" className="mt-4" />
      </div>
      
      <FeedbackFloatingWidget testContext={{ testType: "vark" }} />
    </div>
  );
};
