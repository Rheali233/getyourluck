/**
 * Chinese Zodiac Fortune Result Page
 * 生肖运势分析结果页面
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Button, Card, FeedbackFloatingWidget } from '@/components/ui';
import { useNumerologyStore } from '../stores/useNumerologyStore';

export const ZodiacResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult, isLoading, error } = useNumerologyStore();

  // 根据评分生成详细解读
  const getFortuneAnalysis = (type: 'career' | 'wealth' | 'love' | 'health', score: number) => {
    // 优先使用AI返回的详细解读
    const aiAnalysis = analysisResult?.fortuneAnalysis?.currentPeriod;
    if (aiAnalysis) {
      switch (type) {
        case 'career':
          return aiAnalysis.careerDescription || getFallbackAnalysis(type, score);
        case 'wealth':
          return aiAnalysis.wealthDescription || getFallbackAnalysis(type, score);
        case 'love':
          return aiAnalysis.loveDescription || getFallbackAnalysis(type, score);
        case 'health':
          return aiAnalysis.healthDescription || getFallbackAnalysis(type, score);
        default:
          return getFallbackAnalysis(type, score);
      }
    }
    
    // 如果没有AI解读，使用fallback解读
    return getFallbackAnalysis(type, score);
  };

  // Fallback解读函数
  const getFallbackAnalysis = (type: 'career' | 'wealth' | 'love' | 'health', score: number) => {
    const analyses = {
      career: {
        high: "Exceptional career opportunities await! Your professional path is illuminated with success indicators. Leadership roles, promotions, or new ventures are highly favorable. Network strategically and seize opportunities that align with your zodiac characteristics.",
        medium: "Steady career progress is indicated. While major breakthroughs may require patience, consistent effort will yield positive results. Focus on skill development and building relationships within your industry.",
        low: "Career challenges require careful navigation. Avoid impulsive decisions and focus on stability. This period favors skill-building and strategic planning over immediate advancement."
      },
      wealth: {
        high: "Financial prosperity is strongly indicated! Investment opportunities, unexpected income, or business ventures show excellent potential. Your zodiac energy supports wealth accumulation and financial growth.",
        medium: "Moderate financial stability is expected. Focus on prudent money management and avoid risky investments. Steady income growth through consistent effort is more likely than windfalls.",
        low: "Financial caution is advised. Avoid major purchases or investments during this period. Focus on budgeting, debt reduction, and building emergency funds rather than seeking quick gains."
      },
      love: {
        high: "Love and relationships shine brightly! Romantic opportunities, deepening connections, or harmonious partnerships are strongly favored. Your zodiac energy attracts positive relationships and emotional fulfillment.",
        medium: "Relationships show steady potential. Existing partnerships may deepen, while new connections require patience to develop. Focus on communication and understanding rather than rushing into commitments.",
        low: "Relationship challenges may arise. Avoid conflicts and focus on understanding rather than confrontation. This period favors self-reflection and personal growth over seeking new romantic connections."
      },
      health: {
        high: "Excellent health fortune is indicated! Your vitality and energy levels are strong. This is an ideal time for starting new fitness routines, preventive care, or wellness practices that align with your zodiac characteristics.",
        medium: "Generally stable health with minor fluctuations expected. Maintain regular routines and pay attention to stress management. Preventive care and balanced lifestyle choices will serve you well.",
        low: "Health requires extra attention and care. Focus on rest, stress reduction, and preventive measures. Avoid overexertion and prioritize wellness routines that support your zodiac energy."
      }
    };

    if (score >= 8) return analyses[type].high;
    if (score >= 5) return analyses[type].medium;
    return analyses[type].low;
  };

  if (isLoading) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🐲</div>
            <h2 className="text-2xl font-bold text-white mb-4">Analyzing Your Zodiac Fortune</h2>
            <p className="text-gray-200">Please wait while we calculate your Chinese zodiac fortune...</p>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (error) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Analysis Error</h2>
            <p className="text-gray-200 mb-6">{error}</p>
            <Button
              onClick={() => navigate('/tests/numerology/zodiac')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Try Again
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (!analysisResult) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Analysis Found</h2>
            <p className="text-gray-200 mb-6">Please start a new zodiac fortune analysis.</p>
            <Button
              onClick={() => navigate('/tests/numerology/zodiac')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Start New Analysis
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  return (
    <NumerologyTestContainer>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        {/* 结果页面头部 */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Chinese Zodiac Fortune Report
            </h1>
            <button onClick={() => navigate('/tests/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            Discover your destiny through the ancient wisdom of Chinese zodiac fortune analysis
          </p>
        </div>

        {/* 模块1: Overall Interpretation */}
        {analysisResult?.overallInterpretation && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Interpretation</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {analysisResult.overallInterpretation}
            </p>
            
            {/* Guardian Animals */}
            {analysisResult.zodiacFortune?.guardianAnimals && analysisResult.zodiacFortune.guardianAnimals.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-3">🛡️</span>
                  Guardian Animals
                </h3>
                <div className="text-gray-700">
                  <div className="text-sm mb-2">
                    {analysisResult.zodiacFortune.guardianAnimals.join(', ')}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Compatible zodiac animals that bring harmony and support
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* 模块2: Fortune Ratings */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fortune Ratings</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Your fortune ratings across different life areas provide insights into where opportunities and challenges may arise during this period.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Career Fortune */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-3">💼</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Career Fortune</h4>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(analysisResult?.zodiacFortune?.career || 0) * 10}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{analysisResult?.zodiacFortune?.career || 0}/10</div>
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed text-left">
                  {getFortuneAnalysis('career', analysisResult?.zodiacFortune?.career || 0)}
                </div>
              </div>

              {/* Wealth Fortune */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-3">💰</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Wealth Fortune</h4>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(analysisResult?.zodiacFortune?.wealth || 0) * 10}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{analysisResult?.zodiacFortune?.wealth || 0}/10</div>
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed text-left">
                  {getFortuneAnalysis('wealth', analysisResult?.zodiacFortune?.wealth || 0)}
                </div>
              </div>

              {/* Love Fortune */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-3">💕</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Love Fortune</h4>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(analysisResult?.zodiacFortune?.love || 0) * 10}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{analysisResult?.zodiacFortune?.love || 0}/10</div>
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed text-left">
                  {getFortuneAnalysis('love', analysisResult?.zodiacFortune?.love || 0)}
                </div>
              </div>

              {/* Health Fortune */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="text-center mb-4">
                  <div className="text-2xl mb-3">🏥</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Health Fortune</h4>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(analysisResult?.zodiacFortune?.health || 0) * 10}%` }}
                      ></div>
                    </div>
                    <div className="text-gray-800 font-bold text-lg">{analysisResult?.zodiacFortune?.health || 0}/10</div>
                  </div>
                </div>
                <div className="text-gray-700 text-sm leading-relaxed text-left">
                  {getFortuneAnalysis('health', analysisResult?.zodiacFortune?.health || 0)}
                </div>
              </div>
          </div>
        </Card>

        {/* 模块3: Lucky Elements */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lucky Elements</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            These lucky elements can enhance your fortune and bring positive energy to your life. Incorporate them into your daily activities, clothing choices, and environment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Colors</h3>
              <div className="space-y-2">
                {analysisResult?.luckyElements?.colors?.map((color, index) => (
                  <div key={index} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-gray-800 border border-red-200 mr-2 mb-2">
                    {color}
                  </div>
                )) || <div className="text-gray-600 text-sm">None specified</div>}
              </div>
              <div className="text-gray-600 text-sm mt-3">
                Wear these colors or use them in your environment to attract positive energy
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <div className="text-3xl mb-3">🔢</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Numbers</h3>
              <div className="space-y-2">
                {analysisResult?.luckyElements?.numbers?.map((number, index) => (
                  <div key={index} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-gray-800 border border-red-200 mr-2 mb-2">
                    {number}
                  </div>
                )) || <div className="text-gray-600 text-sm">None specified</div>}
              </div>
              <div className="text-gray-600 text-sm mt-3">
                Use these numbers in important decisions, addresses, or phone numbers
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <div className="text-3xl mb-3">🧭</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Directions</h3>
              <div className="space-y-2">
                {analysisResult?.luckyElements?.directions?.map((direction, index) => (
                  <div key={index} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-gray-800 border border-red-200 mr-2 mb-2">
                    {direction}
                  </div>
                )) || <div className="text-gray-600 text-sm">None specified</div>}
              </div>
              <div className="text-gray-600 text-sm mt-3">
                Face these directions when making important decisions or sleeping
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
              <div className="text-3xl mb-3">🌸</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Seasons</h3>
              <div className="space-y-2">
                {analysisResult?.luckyElements?.seasons?.map((season, index) => (
                  <div key={index} className="inline-block bg-white px-3 py-1 rounded-full text-sm text-gray-800 border border-red-200 mr-2 mb-2">
                    {season}
                  </div>
                )) || <div className="text-gray-600 text-sm">None specified</div>}
              </div>
              <div className="text-gray-600 text-sm mt-3">
                These seasons bring enhanced fortune and opportunities
              </div>
            </div>
          </div>
        </Card>

        {/* 模块4: Relationship Advice */}
        {analysisResult?.relationshipAdvice && analysisResult?.relationshipAdvice.length > 0 && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Relationship Advice</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Guidance for building and maintaining harmonious relationships based on your zodiac characteristics.
            </p>
            
            <div className="space-y-4">
              {analysisResult?.relationshipAdvice.map((advice, index) => (
                <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-500 mt-1">💕</div>
                    <p className="text-gray-800 leading-relaxed">{advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 模块5: Health Tips */}
        {analysisResult?.healthTips && analysisResult?.healthTips.length > 0 && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Tips</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Wellness recommendations based on your zodiac characteristics and current health fortune.
            </p>
            
            <div className="space-y-4">
              {analysisResult?.healthTips.map((tip, index) => (
                <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-500 mt-1">🏥</div>
                    <p className="text-gray-800 leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>

      {/* Feedback Widget */}
      <FeedbackFloatingWidget testContext={{ testType: 'zodiac-fortune' }} />
    </NumerologyTestContainer>
  );
};
