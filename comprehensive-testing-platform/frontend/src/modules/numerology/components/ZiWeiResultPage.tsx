/**
 * ZiWei Analysis Result Page
 * 紫微斗数分析结果页面
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NumerologyTestContainer } from './NumerologyTestContainer';
import { Card, Button } from '@/components/ui';
import { FeedbackFloatingWidget } from '@/components/ui/FeedbackFloatingWidget';
import { useNumerologyStore } from '../stores/useNumerologyStore';

export const ZiWeiResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisResult, isLoading, error } = useNumerologyStore();

  if (isLoading) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-white mb-4">Analyzing Your ZiWei Chart</h2>
            <p className="text-gray-200">Please wait while we calculate your ZiWei DouShu chart...</p>
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
              onClick={() => navigate('/numerology/ziwei')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Try Again
            </Button>
          </div>
        </div>
      </NumerologyTestContainer>
    );
  }

  if (!analysisResult || !analysisResult.ziWeiChart) {
    return (
      <NumerologyTestContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">ZiWei Analysis Not Available</h2>
            <p className="text-gray-200 mb-6">The ZiWei analysis data is not available. Please try again.</p>
            <Button
              onClick={() => navigate('/numerology/ziwei')}
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
              ZiWei Analysis Report
            </h1>
            <button onClick={() => navigate('/numerology')} className="inline-flex items-center px-4 py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-white/90 transition ml-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Center
            </button>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl">
            Comprehensive life guidance based on your birth chart
          </p>
      </div>

        {/* 整体解读 */}
      {analysisResult.overallInterpretation && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Interpretation</h2>
            
            {/* Life Guidance内容 */}
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">{analysisResult.overallInterpretation}</p>
            </div>
            
            {/* Pattern Analysis内容 */}
            {analysisResult.patterns && (
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-bold">Main Pattern：</span>
                    {analysisResult.patterns.mainPattern || 'Pattern analysis not available'}
                  </p>
                </div>
                
                {analysisResult.patterns.specialPatterns && analysisResult.patterns.specialPatterns.length > 0 && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-bold">Special Patterns：</span>
                      {analysisResult.patterns.specialPatterns.join('、')}
                    </p>
                  </div>
                )}
              </div>
            )}
        </Card>
      )}

        {/* 紫微斗数命盘 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ZiWei Chart</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          The twelve palaces of your ZiWei chart reveal different aspects of your life, each containing specific stars and elements that influence your personality, relationships, career, wealth, and overall destiny patterns.
        </p>
          
          {/* 所有宫位信息网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Life Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Life Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.lifePalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Parents Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Parents Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.parentsPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Fortune Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Fortune Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.fortunePalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Property Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Property Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.propertyPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Career Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Career Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.careerPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Friends Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Friends Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.friendsPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Marriage Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Marriage Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.marriagePalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Children Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Children Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.childrenPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Wealth Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Wealth Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.wealthPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Health Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Health Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.healthPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Travel Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Travel Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.travelPalace || 'Analysis not available'}
              </div>
            </div>
            
            {/* Siblings Palace */}
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="text-gray-900 font-bold mb-2">Siblings Palace</div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {analysisResult.ziWeiChart.siblingsPalace || 'Analysis not available'}
              </div>
            </div>
        </div>
      </Card>



        {/* 星曜分析 */}
        {analysisResult.starAnalysis && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Star Analysis</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The distribution of main stars across the twelve palaces reveals your core personality traits and life patterns. Each star carries specific energies and influences that shape your destiny and character development.
            </p>
            
            {/* Star Chart - 参照BaZi Chart布局 */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {analysisResult.starAnalysis.mainStars && Object.entries(analysisResult.starAnalysis.mainStars).map(([palace, stars]) => {
                  const palaceNames: { [key: string]: { name: string; icon: string } } = {
                    life: { name: 'Life Palace', icon: '👑' },
                    wealth: { name: 'Wealth Palace', icon: '💰' },
                    career: { name: 'Career Palace', icon: '💼' },
                    marriage: { name: 'Marriage Palace', icon: '💕' }
                  };
                  
                  const palaceInfo = palaceNames[palace] || { name: `${palace.charAt(0).toUpperCase() + palace.slice(1)} Palace`, icon: '⭐' };
                  
                  return (
                    <div key={palace} className="bg-red-50 rounded-lg p-6 text-center border border-red-200">
                      <div className="text-3xl mb-3">{palaceInfo.icon}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{palaceInfo.name}</h4>
                      <div className="text-gray-700">
                        <div className="text-sm">{Array.isArray(stars) ? stars.join(', ') : stars}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
          
            {/* Star Meanings */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Star Interpretations</h3>
              <div className="space-y-2">
                {analysisResult.starAnalysis.starMeanings ? (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {analysisResult.starAnalysis.starMeanings}
                  </p>
                ) : (
                  <p className="text-gray-700 text-sm">Star meanings not available</p>
                )}
              </div>
          </div>
          </Card>
        )}

        {/* 四化分析 */}
        {analysisResult.fourTransformations && (
          <Card className="bg-white p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Four Transformations</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The Four Transformations represent the dynamic changes and transformations in your life. These transformations reveal how your energy flows and transforms across different life areas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-gray-900 font-bold mb-2">Hua Lu</div>
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {analysisResult.fourTransformations.huaLu?.strength || 'Not specified'}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {analysisResult.fourTransformations.huaLu?.analysis || 'Analysis not available'}
                </div>
          </div>
          
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">👑</div>
                <div className="text-gray-900 font-bold mb-2">Hua Quan</div>
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {analysisResult.fourTransformations.huaQuan?.strength || 'Not specified'}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {analysisResult.fourTransformations.huaQuan?.analysis || 'Analysis not available'}
                </div>
          </div>
          
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-gray-900 font-bold mb-2">Hua Ke</div>
                <div className="mb-3">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    {analysisResult.fourTransformations.huaKe?.strength || 'Not specified'}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {analysisResult.fourTransformations.huaKe?.analysis || 'Analysis not available'}
                </div>
          </div>
          
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <div className="text-gray-900 font-bold mb-2">Hua Ji</div>
                <div className="mb-3">
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    {analysisResult.fourTransformations.huaJi?.strength || 'Not specified'}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {analysisResult.fourTransformations.huaJi?.analysis || 'Analysis not available'}
                </div>
          </div>
        </div>
      </Card>
        )}



        {/* 人生指导与改运建议 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Advices</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Based on your ZiWei chart analysis, here are personalized advices to help you navigate life's challenges and maximize your potential for success and fulfillment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Career Guidance */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Career Advices</h3>
            <div className="space-y-2">
              {analysisResult.careerGuidance && analysisResult.careerGuidance.length > 0 ? (
                analysisResult.careerGuidance.map((guidance, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                      <p className="text-gray-700">{guidance}</p>
                  </div>
                ))
              ) : (
                  <p className="text-gray-700">Career Advices not available</p>
              )}
            </div>
          </div>
          
            {/* Relationship Advice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Relationship Advices</h3>
            <div className="space-y-2">
              {analysisResult.relationshipAdvice && analysisResult.relationshipAdvice.length > 0 ? (
                analysisResult.relationshipAdvice.map((advice, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">•</span>
                      <p className="text-gray-700">{advice}</p>
                  </div>
                ))
              ) : (
                  <p className="text-gray-700">Relationship advices not available</p>
              )}
              </div>
            </div>
          </div>
          
          {/* Improvement Suggestions */}
          {analysisResult.improvementSuggestions && analysisResult.improvementSuggestions.length > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Life Improvements</h3>
              <div className="space-y-2">
                {analysisResult.improvementSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-red-400 mt-1">💡</span>
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                ))}
          </div>
        </div>
          )}
      </Card>

        {/* 幸运元素 */}
        <Card className="bg-white p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lucky Elements</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            These lucky elements are specifically aligned with your chart's energy and can enhance your fortune, attract positive opportunities, and support your personal growth and success.
          </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">🎨</div>
              <div className="text-gray-900 font-bold mb-2">Lucky Colors</div>
              <div className="text-gray-700 text-sm">
                {analysisResult.luckyElements?.colors?.join(', ') || 'None specified'}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">🔢</div>
              <div className="text-gray-900 font-bold mb-2">Lucky Numbers</div>
              <div className="text-gray-700 text-sm">
                {analysisResult.luckyElements?.numbers?.join(', ') || 'None specified'}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">🧭</div>
              <div className="text-gray-900 font-bold mb-2">Lucky Directions</div>
              <div className="text-gray-700 text-sm">
                {analysisResult.luckyElements?.directions?.join(', ') || 'None specified'}
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">🌸</div>
              <div className="text-gray-900 font-bold mb-2">Lucky Seasons</div>
              <div className="text-gray-700 text-sm">
                {analysisResult.luckyElements?.seasons?.join(', ') || 'None specified'}
            </div>
          </div>
        </div>
      </Card>

          </div>

      {/* Feedback Widget */}
      <FeedbackFloatingWidget testContext={{ testType: 'ziwei-analysis' }} />
    </NumerologyTestContainer>
  );
};
