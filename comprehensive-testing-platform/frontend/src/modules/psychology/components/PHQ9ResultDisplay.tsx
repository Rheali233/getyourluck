import React from 'react';
import { Card } from '@/components/ui/Card';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { PHQ9Result } from '../types';
import { cn } from '@/utils/classNames';
import { FeedbackFloatingWidget } from '@/components/ui';
import { ContextualLinks } from '@/components/InternalLinks';

export interface PHQ9ResultDisplayProps extends BaseComponentProps {
  result: PHQ9Result;
}

export const PHQ9ResultDisplay: React.FC<PHQ9ResultDisplayProps> = ({
  className,
  testId = 'phq9-result-display',
  result,
  ...props
}) => {
  // 验证结果是否有效（AI分析失败时不应该到达这里，但作为安全措施）
  if (!result || result.totalScore === undefined || !result.physicalAnalysis || !result.psychologicalAnalysis) {
    return (
      <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis Not Available</h2>
            <p className="text-gray-600 mb-4">
              Unable to generate AI analysis for your PHQ-9 test results. Please try submitting again.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // 使用实际结果，不提供AI分析字段的默认值
  const safeResult: PHQ9Result = {
    totalScore: result.totalScore,
    severity: result.severity || 'minimal',
    riskLevel: result.riskLevel || 'low',
    riskLevelName: result.riskLevelName || 'Minimal Risk',
    riskDescription: result.riskDescription || '',
    lifestyleInterventions: result.lifestyleInterventions || {
      sleepHygiene: '',
      physicalActivity: '',
      nutrition: '',
      socialSupport: ''
    },
    followUpAdvice: result.followUpAdvice || '',
    physicalAnalysis: result.physicalAnalysis,
    psychologicalAnalysis: result.psychologicalAnalysis
  };

  // Get AI-generated professional analysis
  const professionalAnalysis = {
    physicalAnalysis: safeResult.physicalAnalysis,
    psychologicalAnalysis: safeResult.psychologicalAnalysis
  };

  return (
    <div className={cn("min-h-screen py-8 px-4", className)} data-testid={testId} {...props}>
      <div id="mainContent" className="max-w-6xl mx-auto space-y-8">
        
        {/* 1. Overall Assessment - align layout with DISC: left icon, right content */}
        <Card className="p-6 bg-transparent border-0">
          <div className="grid grid-cols-[64px_1fr] gap-6 items-start">
            {/* Left: Icon (square, slightly lower) */}
            <div className="flex items-start justify-center">
              <div className="w-16 h-16 mt-2 shrink-0 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow">
                {safeResult.severity === 'minimal' ? '😊' : 
                 safeResult.severity === 'mild' ? '😐' : 
                 safeResult.severity === 'moderate' ? '😔' : 
                 safeResult.severity === 'moderately_severe' ? '😢' : 
                 safeResult.severity === 'severe' ? '😭' : '😊'}
              </div>
            </div>

            {/* Right: Title + analysis (shifted left, aligned with container padding) */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">PHQ-9 Depression Screening</h2>
              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Risk Level: </span>
                <span className="text-blue-600 font-semibold">
                  {safeResult.riskLevelName}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {safeResult.riskDescription}
              </p>
            </div>
          </div>
        </Card>

        {/* 2. Symptom Analysis */}
        <Card className="p-6 bg-transparent border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🔍</span>
            Detailed Symptom Analysis
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Physical Analysis */}
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏃</span>
                Physical Manifestations
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {professionalAnalysis.physicalAnalysis}
              </p>
            </div>

            {/* Psychological Analysis */}
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🧠</span>
                Psychological Patterns
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {professionalAnalysis.psychologicalAnalysis}
              </p>
            </div>
          </div>
        </Card>

        {/* 3. Advice Module */}
        <Card className="p-6 bg-transparent border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">💙</span>
            Professional Advice
          </h2>
          <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-700 leading-relaxed">{safeResult.followUpAdvice}</p>
          </div>
        </Card>

        {/* 4. Lifestyle Interventions */}
        <Card className="p-6 bg-transparent border-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-2">🌱</span>
            Lifestyle Interventions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">😴</span>
                Sleep Hygiene
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {safeResult.lifestyleInterventions.sleepHygiene}
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏃</span>
                Physical Activity
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {safeResult.lifestyleInterventions.physicalActivity}
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🥗</span>
                Nutrition
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {safeResult.lifestyleInterventions.nutrition}
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🤝</span>
                Social Support
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {safeResult.lifestyleInterventions.socialSupport}
              </p>
            </div>
          </div>
        </Card>


        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-4xl mx-auto">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> This test result is for reference only and cannot replace professional medical diagnosis.
            If you experience persistent depressive emotions or need help, please consult a mental health expert or doctor promptly.
            Remember, seeking help is a brave act, you are not alone.
          </p>
        </div>
        {/* Related content - consistent UI spacing */}
        <ContextualLinks context="result" testType="phq9" className="mt-4" />
      </div>
      <FeedbackFloatingWidget
        containerSelector="#mainContent"
        testContext={{
          testType: 'psychology',
          testId: 'phq9',
        }}
      />
    </div>
  );
};