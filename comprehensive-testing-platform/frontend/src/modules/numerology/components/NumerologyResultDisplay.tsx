/**
 * Numerology Result Display Component
 * 命理分析结果展示组件
 */

import React from 'react';
import { Card, Button, FeedbackFloatingWidget } from '@/components/ui';
import type { NumerologyAnalysis } from '../types';
import { ContextualLinks } from '@/components/InternalLinks';

interface NumerologyResultDisplayProps {
  analysis: NumerologyAnalysis;
  onBack?: () => void;
  onNewAnalysis?: () => void;
  className?: string;
}

export const NumerologyResultDisplay: React.FC<NumerologyResultDisplayProps> = ({
  analysis,
  onBack,
  onNewAnalysis,
  className
}) => {
  const renderFiveElements = () => {
    const elements = analysis?.fiveElements?.elements || {};
    const hasData = Object.keys(elements).length > 0;
    if (!analysis?.fiveElements || !hasData) return null;

    return (
      <div className="space-y-4">
        <h3 id="five-elements-title" className="text-xl font-bold text-red-900 mb-4">Five Elements Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(elements).map(([element, value]) => (
            <div key={element} className="text-center">
              <div className="text-2xl mb-2" aria-hidden="true">
                {element === 'metal' && '⚡'}
                {element === 'wood' && '🌳'}
                {element === 'water' && '💧'}
                {element === 'fire' && '🔥'}
                {element === 'earth' && '🏔️'}
              </div>
              <div className="text-red-900 font-medium capitalize">{String(element)}</div>
              <div className="text-red-800">{String(value)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">
            <span className="font-bold text-red-900">Dominant Element:</span> {analysis.fiveElements.dominantElement}
          </p>
          <p className="text-red-800">
            <span className="font-bold text-red-900">Weak Element:</span> {analysis.fiveElements.weakElement}
          </p>
          <p className="text-red-800">
            <span className="font-bold text-red-900">Balance:</span> {analysis.fiveElements.balance}
          </p>
        </div>
      </div>
    );
  };

  const renderZodiacInfo = () => {
    const zodiac = analysis?.zodiac;
    const fortune = analysis?.zodiacFortune;
    if (!zodiac || !fortune) return null;

    return (
      <div className="space-y-4">
        <h3 id="zodiac-info-title" className="text-xl font-bold text-red-900 mb-4">Zodiac Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2" aria-hidden="true">
                {zodiac.animal === 'rat' && '🐭'}
                {zodiac.animal === 'ox' && '🐂'}
                {zodiac.animal === 'tiger' && '🐅'}
                {zodiac.animal === 'rabbit' && '🐰'}
                {zodiac.animal === 'dragon' && '🐲'}
                {zodiac.animal === 'snake' && '🐍'}
                {zodiac.animal === 'horse' && '🐴'}
                {zodiac.animal === 'goat' && '🐐'}
                {zodiac.animal === 'monkey' && '🐵'}
                {zodiac.animal === 'rooster' && '🐓'}
                {zodiac.animal === 'dog' && '🐕'}
                {zodiac.animal === 'pig' && '🐷'}
              </div>
              <div className="text-red-900 font-bold text-xl capitalize">{zodiac.animal}</div>
            </div>
            <div className="space-y-2">
              <p className="text-red-800">
                <span className="font-bold text-red-900">Element:</span> {zodiac.element}
              </p>
              <p className="text-red-800">
                <span className="font-bold text-red-900">Year:</span> {zodiac.year}
              </p>
              {zodiac.isCurrentYear && (
                <p className="text-red-700 font-bold">Current Year</p>
              )}
              {zodiac.isConflictYear && (
                <p className="text-red-700 font-bold">Conflict Year</p>
              )}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="text-lg font-bold text-red-900 mb-3">Fortune</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-800">Overall:</span>
                <span className="text-red-900">{fortune.overall}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Career:</span>
                <span className="text-red-900">{fortune.career}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Wealth:</span>
                <span className="text-red-900">{fortune.wealth}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Love:</span>
                <span className="text-red-900">{fortune.love}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Health:</span>
                <span className="text-red-900">{fortune.health}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNameAnalysis = () => {
    const nameAnalysis = analysis?.nameAnalysis;
    if (!nameAnalysis) return null;

    return (
      <div className="space-y-4">
        <h3 id="name-analysis-title" className="text-xl font-bold text-red-900 mb-4">Name Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="text-lg font-bold text-red-900 mb-3">Five Grids</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-red-800">Heaven Grid:</span>
                <span className="text-red-900">{nameAnalysis.fiveGrids.heavenGrid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Person Grid:</span>
                <span className="text-red-900">{nameAnalysis.fiveGrids.personGrid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Earth Grid:</span>
                <span className="text-red-900">{nameAnalysis.fiveGrids.earthGrid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Outer Grid:</span>
                <span className="text-red-900">{nameAnalysis.fiveGrids.outerGrid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Total Grid:</span>
                <span className="text-red-900">{nameAnalysis.fiveGrids.totalGrid}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="text-lg font-bold text-red-900 mb-3">Three Talents</h4>
            <div className="space-y-2">
              <p className="text-red-800">
                <span className="font-bold text-red-900">Configuration:</span> {nameAnalysis.threeTalents.configuration}
              </p>
              <p className="text-red-800">
                <span className="font-bold text-red-900">Overall Score:</span> {nameAnalysis.overallScore}/100
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLuckyElements = () => {
    const lucky = analysis?.luckyElements;
    if (!lucky) return null;

    return (
      <div className="space-y-4">
        <h3 id="lucky-elements-title" className="text-xl font-bold text-red-900 mb-4">Lucky Elements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <div className="text-2xl mb-2" aria-hidden="true">🎨</div>
            <div className="text-red-900 font-bold mb-2">Colors</div>
            <div className="text-red-800 text-sm">
              {Array.isArray(lucky.colors) ? lucky.colors.join(', ') : ''}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <div className="text-2xl mb-2" aria-hidden="true">🔢</div>
            <div className="text-red-900 font-bold mb-2">Numbers</div>
            <div className="text-red-800 text-sm">
              {Array.isArray(lucky.numbers) ? lucky.numbers.join(', ') : ''}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <div className="text-2xl mb-2" aria-hidden="true">🧭</div>
            <div className="text-red-900 font-bold mb-2">Directions</div>
            <div className="text-red-800 text-sm">
              {Array.isArray(lucky.directions) ? lucky.directions.join(', ') : ''}
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <div className="text-2xl mb-2" aria-hidden="true">🌸</div>
            <div className="text-red-900 font-bold mb-2">Seasons</div>
            <div className="text-red-800 text-sm">
              {Array.isArray(lucky.seasons) ? lucky.seasons.join(', ') : ''}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${className}`}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
      {/* 整体解读 - align layout with DISC: left icon, right content */}
      {analysis?.overallInterpretation && (
        <section aria-labelledby="overall-interpretation-title">
          <Card className="p-6 bg-transparent border-0">
            <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
              {/* Left: Icon (square, slightly lower) */}
              <div className="flex items-start justify-center">
                <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow">
                  🔮
                </div>
              </div>

              {/* Right: Title + analysis (shifted left, aligned with container padding) */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Numerology Analysis</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {analysis.overallInterpretation}
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 五行分析 */}
      {analysis?.fiveElements && (
        <section aria-labelledby="five-elements-title">
          <Card className="p-6 bg-transparent border-0">
            {renderFiveElements()}
          </Card>
        </section>
      )}

      {/* 生肖信息 */}
      {(analysis?.zodiac && analysis?.zodiacFortune) && (
        <section aria-labelledby="zodiac-info-title">
          <Card className="p-6 bg-transparent border-0">
            {renderZodiacInfo()}
          </Card>
        </section>
      )}

      {/* 姓名分析 */}
      {analysis?.nameAnalysis && (
        <section aria-labelledby="name-analysis-title">
          <Card className="p-6 bg-transparent border-0">
            {renderNameAnalysis()}
          </Card>
        </section>
      )}

      {/* 幸运元素 */}
      {analysis?.luckyElements && (
        <section aria-labelledby="lucky-elements-title">
          <Card className="p-6 bg-transparent border-0">
            {renderLuckyElements()}
          </Card>
        </section>
      )}

      {/* 改运建议 */}
      {Array.isArray(analysis?.improvementSuggestions) && analysis.improvementSuggestions.length > 0 && (
        <section aria-labelledby="improvement-suggestions-title">
          <Card className="p-6 bg-transparent border-0">
            <h2 id="improvement-suggestions-title" className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-2">💡</span>
              Improvement Suggestions
            </h2>
            <div className="p-6 bg-purple-50 rounded-lg border border-emerald-200">
              <ul className="space-y-2">
                {analysis.improvementSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-purple-800 flex items-start">
                    <span className="text-purple-600 mr-2 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center space-x-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Back
          </Button>
        )}
        {onNewAnalysis && (
          <Button
            onClick={onNewAnalysis}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white rounded-lg transition-all duration-200 font-medium"
          >
            New Analysis
          </Button>
        )}
      </div>
      {/* Related content - consistent UI spacing */}
      <ContextualLinks context="result" testType="numerology" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        testContext={{ testType: 'numerology', testId: 'numerology-result' }}
      />
    </div>
  );
};
