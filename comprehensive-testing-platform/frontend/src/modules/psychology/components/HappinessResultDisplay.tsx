/**
 * Happiness Index Domain Analysis Result Display Component
 * Psychology test result display component following unified development standards
 * Includes five-domain analysis and quality of life improvement plan
 */

import React from 'react';
import { Card } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface HappinessDomain {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  currentStatus: string;
  improvementAreas: string[];
  positiveAspects: string[];
}

export interface HappinessResult {
  totalScore: number;
  maxScore: number;
  happinessLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  levelName: string;
  levelDescription: string;
  domains: HappinessDomain[];
  overallAnalysis: string;
  improvementPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    dailyHabits: string[];
  };
  lifeBalanceAssessment: {
    workLifeBalance: string;
    socialConnections: string;
    personalGrowth: string;
    healthWellness: string;
  };
  gratitudePractices: string[];
  mindfulnessTips: string[];
  communityEngagement: string[];
}

export interface HappinessResultDisplayProps extends BaseComponentProps {
  result: HappinessResult;
  onReset: () => void;
  onStartJourney?: () => void;
}

export const HappinessResultDisplay: React.FC<HappinessResultDisplayProps> = ({
  className,
  testId = 'happiness-result-display',
  result,
  onReset,
  onStartJourney,
  ...props
}) => {
  const getHappinessLevelColor = (level: string) => {
    switch (level) {
      case 'very_low': return 'text-red-600 bg-red-50 border-red-200';
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'very_high': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHappinessLevelIcon = (level: string) => {
    switch (level) {
      case 'very_low': return '😢';
      case 'low': return '😔';
      case 'moderate': return '😐';
      case 'high': return '😊';
      case 'very_high': return '😄';
      default: return '😐';
    }
  };

  const renderDomainChart = (domain: HappinessDomain) => {
    const percentage = (domain.score / domain.maxScore) * 100;

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Score</span>
          <span className="text-sm font-medium text-gray-900">
            {domain.score}/{domain.maxScore}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {percentage < 40 ? 'Needs Attention' : 
           percentage < 60 ? 'Room for Improvement' : 
           percentage < 80 ? 'Good Performance' : 'Excellent'}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen bg-blue-50 py-8 px-4", className)} data-testid={testId} {...props}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Overall Happiness Index */}
        <Card className="p-8 text-center bg-white/80 backdrop-blur-sm">
          <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto text-4xl shadow-lg", 
            getHappinessLevelColor(result.happinessLevel).split(' ')[0] === 'text-red-600' ? 'bg-red-100' :
            getHappinessLevelColor(result.happinessLevel).split(' ')[0] === 'text-orange-600' ? 'bg-orange-100' :
            getHappinessLevelColor(result.happinessLevel).split(' ')[0] === 'text-yellow-600' ? 'bg-yellow-100' :
            getHappinessLevelColor(result.happinessLevel).split(' ')[0] === 'text-blue-600' ? 'bg-blue-100' :
            getHappinessLevelColor(result.happinessLevel).split(' ')[0] === 'text-green-600' ? 'bg-green-100' : 'bg-gray-100'
          )}>
            {getHappinessLevelIcon(result.happinessLevel)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.levelName}</h2>
          <div className={cn("inline-block px-6 py-2 rounded-full text-sm font-medium border mb-4", getHappinessLevelColor(result.happinessLevel))}>
            Happiness Index: {result.totalScore}/{result.maxScore} points
          </div>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            {result.overallAnalysis.replace(/亲爱的朋友，|我们|让我们一起|相信您一定可以做到的！/g, '').trim()}
          </p>
        </Card>

        {/* Five Domain Analysis */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">🏠</span>
            Life Domain Happiness Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.domains.map((domain, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">{domain.name}</h4>
                {renderDomainChart(domain)}
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{domain.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-green-700 text-sm mb-2">Current Status:</h5>
                    <p className="text-xs text-green-600 leading-relaxed">{domain.currentStatus}</p>
                  </div>
                  
                  {/* Positive aspects and improvement areas arranged horizontally */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <h5 className="font-medium text-blue-700 text-sm mb-2">Positive Aspects:</h5>
                      <ul className="space-y-1">
                        {domain.positiveAspects.map((aspect, idx) => (
                          <li key={idx} className="text-xs text-blue-600">• {aspect}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-orange-700 text-sm mb-2">Improvement Areas:</h5>
                      <ul className="space-y-1">
                        {domain.improvementAreas.map((area, idx) => (
                          <li key={idx} className="text-xs text-orange-600">• {area}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>





        {/* Happiness Improvement Plan */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Happiness Improvement Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-left">Immediate Actions</h4>
              <ul className="space-y-2">
                {result.improvementPlan.immediate.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 text-lg">•</span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {action.includes('在早晨醒来时') ? 'When you wake up in the morning, spend 3 minutes recording 3 small things you are grateful for, such as sunshine, family smiles, or a cup of hot tea' :
                       action.includes('为本周设定一个温暖的小目标') ? 'Set a warm small goal for this week: give your family a hug every day, or actively contact a friend to share happiness' :
                       action.includes('主动联系一位好久不见的朋友') ? 'Actively contact a friend you haven\'t seen for a long time, share your recent small joys, such as new skills learned or warm moments encountered' :
                       action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-left">Short-term Goals</h4>
              <ul className="space-y-2">
                {result.improvementPlan.shortTerm.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 text-lg">•</span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {goal.includes('培养一个兴趣爱好') ? 'Cultivate a hobby: spend 2-3 hours per week learning new skills, such as painting, photography, or cooking, to make life more colorful' :
                       goal.includes('改善睡眠质量') ? 'Improve sleep quality: establish regular sleep schedule, avoid using electronic devices 1 hour before bed, you can read or listen to light music' :
                       goal.includes('增加运动频率') ? 'Increase exercise frequency: do aerobic exercise 3-4 times per week, 30 minutes each time, such as brisk walking, swimming, or yoga, to enhance physical vitality' :
                       goal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-left">Long-term Plans</h4>
              <ul className="space-y-2">
                {result.improvementPlan.longTerm.map((plan, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 text-lg">•</span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {plan.includes('建立职业发展规划') ? 'Establish career development plan: set 3-5 year career goals, regularly evaluate progress, continuously learn new skills, seek career development opportunities' :
                       plan.includes('培养深度人际关系') ? 'Cultivate deep interpersonal relationships: invest time in building and maintaining important relationships, regularly have in-depth communication with friends and family, participate in community activities' :
                       plan.includes('发展个人兴趣爱好') ? 'Develop personal hobbies: turn hobbies into professional skills, join relevant communities, share experiences and achievements with others' :
                       plan}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 text-left">Daily Habits</h4>
              <ul className="space-y-2">
                {result.improvementPlan.dailyHabits.map((habit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2 text-lg">•</span>
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {habit.includes('每天记录感恩日记') ? 'Keep a gratitude diary daily: spend 5 minutes before bed writing down 3 beautiful things you encountered today, cultivate positive mindset' :
                       habit.includes('保持规律作息') ? 'Maintain regular schedule: wake up and sleep at fixed times every day, ensure 7-8 hours of quality sleep, improve physical and mental state' :
                       habit.includes('定期运动锻炼') ? 'Regular exercise: exercise at least 3 times per week, 30-45 minutes each time, choose your preferred exercise method, maintain physical vitality' :
                       habit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>







        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 max-w-3xl mx-auto">
          <p className="leading-relaxed">
            <strong>Important Reminder:</strong> The happiness index test results are for reference only, intended to help you understand your current life satisfaction.
            Happiness can be enhanced through positive actions and mindset adjustments. If you experience persistent distress,
            we recommend seeking professional psychological counseling or life coaching.
          </p>
        </div>
      </div>
    </div>
  );
};
