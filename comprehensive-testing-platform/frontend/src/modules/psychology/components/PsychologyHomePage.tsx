/**
 * Psychology Module Homepage Component
 * Provides selection and introduction for four test types
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Card, TestNavigation } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { TestType } from '../types';
import { ProgressRecoveryPrompt } from './ProgressRecoveryPrompt';

import { cn } from '@/utils/classNames';

export interface PsychologyHomePageProps extends BaseComponentProps {
  onTestSelect?: (testType: TestType) => void;
}

export const PsychologyHomePage: React.FC<PsychologyHomePageProps> = ({
  className,
  testId = 'psychology-home-page',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();


  // Ensure page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testTypes = [
    {
      type: TestType.MBTI,
      name: 'MBTI Personality Test',
      description: 'Discover your personality type and understand your true self',
      icon: '🧠',
      color: 'from-blue-500 to-indigo-500',
      duration: '15-20 min',
      questions: '64 questions',
      basis: 'Jungian Theory',
      participants: '2.5M+',
      rating: 4.8
    },
    {
      type: TestType.PHQ9,
      name: 'PHQ-9 Depression Screening',
      description: 'Professional depression assessment and mental health evaluation',
      icon: '💙',
      color: 'from-blue-500 to-indigo-500',
      duration: '5-10 min',
      questions: '9 questions',
      basis: 'DSM-5 Standard',
      participants: '1.8M+',
      rating: 4.9
    },
    {
      type: TestType.EQ,
      name: 'Emotional Intelligence Test',
      description: 'Measure your emotional intelligence and social skills',
      icon: '❤️',
      color: 'from-blue-500 to-indigo-500',
      duration: '10-15 min',
      questions: '50 questions',
      basis: 'Goleman Model',
      participants: '1.2M+',
      rating: 4.7
    },
    {
      type: TestType.HAPPINESS,
      name: 'Happiness Index Assessment',
      description: 'Evaluate your happiness level and life satisfaction',
      icon: '😊',
      color: 'from-blue-500 to-indigo-500',
      duration: '15-20 min',
      questions: '50 questions',
      basis: 'Positive Psychology',
      participants: '980K+',
      rating: 4.6
    }
  ];

  const handleTestSelect = (testType: TestType) => {
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/psychology/${testType}`);
    }
  };

  return (
    <div className={cn("min-h-screen bg-blue-50", className)} data-testid={testId} {...props}>
      {/* Top navigation */}
      <TestNavigation moduleName="Home" backPath="/" />
      <div className="max-w-6xl mx-auto py-8 px-4">
        
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Psychological Testing Center
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Professional psychological assessment tools to help you understand yourself better and achieve personal growth
          </p>
        </div>

        {/* Progress Recovery Prompts */}
        <div className="mb-6">
          {testTypes.map((test) => (
            <ProgressRecoveryPrompt
              key={test.type}
              testType={test.type}
              className="mb-3"
              onRecover={() => handleTestSelect(test.type)}
            />
          ))}
        </div>

        {/* Test Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testTypes.map((test) => (
            <div key={test.type} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative h-[340px]">
              {/* Content Area - Fixed height */}
              <div className="p-4 text-center h-[240px] flex flex-col justify-start">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{test.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{test.description}</p>
                
                {/* Test Information Tags */}
                <div className="space-y-2">
                  {/* Test Basis */}
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full font-semibold border border-blue-200">
                      {test.basis}
                    </span>
                  </div>
                  
                  {/* Test Stats */}
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
                      <span className="text-gray-600">👥</span>
                      <span className="text-gray-700 font-medium">{test.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <span className="text-yellow-600">⭐</span>
                      <span className="text-yellow-700 font-medium">{test.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Test Button - Absolutely positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button
                  onClick={() => handleTestSelect(test.type)}
                  className={cn("w-full py-2 text-sm bg-gradient-to-r hover:shadow-lg transition-all duration-300", test.color)}
                >
                  Start Test
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Test Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Honest Answers</h3>
              <p className="text-sm text-gray-600">Choose answers based on your true thoughts and feelings. There are no right or wrong answers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Management</h3>
              <p className="text-sm text-gray-600">You can pause during the test. We recommend completing it in a quiet environment.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Protection</h3>
              <p className="text-sm text-gray-600">All test data is processed anonymously with strict privacy protection.</p>
            </div>
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                The psychological tests provided on this platform are for self-understanding and reference purposes only. 
                They cannot replace professional psychological counseling or medical diagnosis. 
                If you experience persistent distress or need professional help, we recommend consulting a mental health expert or doctor. 
                Remember, seeking help is a courageous act, and you are not alone.
              </p>
            </div>
          </div>
        </Card>


      </div>
    </div>
  );
};
