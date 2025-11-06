/**
 * Reading Result Page
 * 解读结果页面
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarotStore } from '../stores/useTarotStore';
import { Card, Button, FeedbackFloatingWidget } from '@/components/ui';
import ErrorMessage from '@/components/ui/Alert';
import { TarotTestContainer } from './TarotTestContainer';
import { ContextualLinks } from '@/components/InternalLinks';

export const ReadingResultPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentSession,
    aiReading,
    error
  } = useTarotStore();

  // 简化弹窗逻辑 - 现在弹窗在 CardDrawingPage 中显示
  // 这里只保留基本的错误处理

  // showAIReading 状态已移除，AI分析现在直接显示

  // 根据问题分类获取问题描述
  const getQuestionDescription = (category: string) => {
    const descriptions: Record<string, string> = {
      'love': 'Love & Relationships - Seeking guidance about your romantic life and relationships',
      'career': 'Career & Work - Looking for direction in your professional life and career path',
      'finance': 'Finance & Money - Seeking advice about financial matters and money decisions',
      'health': 'Health & Wellness - Looking for guidance about your physical and mental well-being',
      'spiritual': 'Spiritual Growth - Seeking deeper understanding and spiritual development',
      'general': 'General Guidance - Looking for overall life direction and guidance'
    };
    return descriptions[category] || 'General guidance';
  };

  // 获取用户的具体问题
  const getUserQuestion = () => {
    if (currentSession?.questionText) {
      return currentSession.questionText;
    }
    return getQuestionDescription(currentSession?.questionCategory || 'general');
  };

  // AI解读现在通过统一测试系统自动处理，不需要手动调用

  // handleGetAIReading 方法已移除，AI分析现在自动显示

  // 弹窗现在在 CardDrawingPage 中显示，这里不需要显示弹窗

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentSession) {
    return (
      <TarotTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-violet-900 mb-4">No Reading Found</h1>
            <p className="text-violet-800 mb-6">Please start a new tarot reading.</p>
            <Button
              onClick={() => navigate('/tests/tarot')}
              className="bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start New Reading
            </Button>
          </div>
        </div>
      </TarotTestContainer>
    );
  }

  return (
    <TarotTestContainer>
      {/* Main Title and Description */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-violet-900">
            Your Tarot Reading
          </h1>
          <button 
            onClick={() => navigate('/tests/tarot')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 text-violet-900 font-semibold transition hover:bg-white/80"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tarot Home
          </button>
        </div>
        <p className="text-xl text-violet-800 max-w-4xl">
          Review your cards, reflect on the guidance, and return to the tarot home whenever you are ready for another spread.
        </p>
      </div>
      {/* 模块1: Your Question & Overall Interpretation */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-violet-900 mb-6">Your Question & Overall Interpretation</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-violet-900 mb-3">Your Question</h3>
            <p className="text-violet-800 text-lg">
              {getUserQuestion()}
            </p>
          </div>
          
          {aiReading?.overall_interpretation && (
            <div>
              <h3 className="text-lg font-bold text-violet-900 mb-3">Overall Interpretation</h3>
              <p className="text-violet-800 text-lg leading-relaxed">
                {aiReading.overall_interpretation}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* 模块2: Your Cards & Card Interpretations */}
      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-violet-900 mb-6">Your Cards & Card Interpretations</h2>
        
        <div className="space-y-6">
          {/* 卡牌展示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSession.drawnCards.map((drawnCard, index) => (
              <div key={index} className="bg-violet-50 rounded-lg border border-violet-200 p-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎴</div>
                  <h3 className="text-lg font-bold text-violet-900 mb-2">
                    {drawnCard.card.name_en}
                    {drawnCard.isReversed && ' (Reversed)'}
                  </h3>
                  <p className="text-violet-800 text-sm mb-3">
                    Position: {drawnCard.positionMeaning}
                  </p>
                  <div className="text-xs text-violet-700">
                    {drawnCard.isReversed ? drawnCard.card.meaning_reversed_en : drawnCard.card.meaning_upright_en}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* AI卡牌解读 */}
          {aiReading?.card_interpretations && aiReading.card_interpretations.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-violet-900 mb-4">Detailed Card Interpretations</h3>
              <div className="space-y-4">
                {aiReading.card_interpretations.map((interpretation, index) => (
                  <div key={index} className="bg-violet-50 rounded-lg border border-violet-200 p-4">
                    <h4 className="text-md font-bold text-violet-900 mb-2">
                      {interpretation.card_name} - Position {interpretation.position}
                    </h4>
                    <p className="text-violet-800 mb-2">{interpretation.interpretation}</p>
                    <p className="text-violet-700 text-sm italic">💡 {interpretation.advice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 模块3: Synthesis */}
      {aiReading?.synthesis && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-violet-900 mb-4">Synthesis</h2>
          <p className="text-violet-800 text-lg leading-relaxed">
            {aiReading.synthesis}
          </p>
        </Card>
      )}

      {/* 模块4: Guidance & Insights */}
      {(aiReading?.action_guidance || aiReading?.timing_advice || aiReading?.emotional_insights || aiReading?.spiritual_guidance) && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-violet-900 mb-6">Guidance & Insights</h2>
          
          <div className="space-y-6">
            {aiReading?.action_guidance && aiReading.action_guidance.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Action Guidance</h3>
                <div className="space-y-2">
                  {aiReading.action_guidance.map((guidance, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-violet-600 mt-1">•</span>
                      <p className="text-violet-800">{guidance}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {aiReading?.timing_advice && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Timing Advice</h3>
                <p className="text-violet-800">{aiReading.timing_advice}</p>
              </div>
            )}
            
            {aiReading?.emotional_insights && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Emotional Insights</h3>
                <p className="text-violet-800">{aiReading.emotional_insights}</p>
              </div>
            )}
            
            {aiReading?.spiritual_guidance && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Spiritual Guidance</h3>
                <p className="text-violet-800">{aiReading.spiritual_guidance}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 模块5: Awareness & Opportunities */}
      {(aiReading?.warning_signs || aiReading?.opportunities) && (
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-violet-900 mb-6">Awareness & Opportunities</h2>
          
          <div className="space-y-6">
            {aiReading?.warning_signs && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Things to Be Aware Of</h3>
                <p className="text-violet-800">{aiReading.warning_signs}</p>
              </div>
            )}
            
            {aiReading?.opportunities && (
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-3">Opportunities</h3>
                <p className="text-violet-800">{aiReading.opportunities}</p>
              </div>
            )}
          </div>
        </Card>
      )}
      {/* Related content - consistent UI spacing */}
      <ContextualLinks context="result" testType="tarot" className="mt-4" />
      <FeedbackFloatingWidget
        testContext={{ testType: 'tarot', testId: 'reading-result' }}
      />
    </TarotTestContainer>
  );
};
