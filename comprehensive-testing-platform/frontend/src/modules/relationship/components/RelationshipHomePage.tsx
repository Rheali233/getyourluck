/**
 * Relationship Module Home Page
 * Main entry point for relationship testing module
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, TestNavigation } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { TestType } from '../types';
import { cn } from '@/utils/classNames';

export interface RelationshipHomePageProps extends BaseComponentProps {
  onTestSelect?: (testType: TestType) => void;
}

export const RelationshipHomePage: React.FC<RelationshipHomePageProps> = ({
  className,
  testId = 'relationship-homepage',
  onTestSelect,
  ...props
}) => {
  const navigate = useNavigate();

  // Ensure page scrolls to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Test type information
  const testTypes = [
    {
      type: TestType.LOVE_LANGUAGE,
      title: 'Love Language Test',
      description: 'Discover how you prefer to give and receive love',
      duration: '10-15 min',
      questions: 30,
      icon: '💝',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      type: TestType.LOVE_STYLE,
      title: 'Love Style Assessment',
      description: 'Understand your unique approach to romantic relationships',
      duration: '15-20 min',
      questions: 42,
      icon: '💕',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      type: TestType.INTERPERSONAL,
      title: 'Interpersonal Skills Test',
      description: 'Evaluate and improve your social communication skills',
      duration: '12-18 min',
      questions: 36,
      icon: '🤝',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  const handleTestSelect = (testType: TestType) => {
    if (onTestSelect) {
      onTestSelect(testType);
    } else {
      // Default navigation to test page
      navigate(`/relationship/${testType}`);
    }
  };

  return (
    <div
      className={cn("min-h-screen bg-pink-50", className)}
      data-testid={testId}
      {...props}
    >
      {/* Top navigation */}
      <TestNavigation moduleName="Home" backPath="/" />
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Discover Your Relationship Patterns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take scientifically-backed assessments to understand your love language, 
            relationship style, and interpersonal skills. Get personalized insights 
            to strengthen your connections.
          </p>
        </div>

        {/* Test Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testTypes.map((test) => (
            <div key={test.type} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative h-[340px]">
              {/* Content Area - Fixed height */}
              <div className="p-4 text-center h-[240px] flex flex-col justify-start">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {test.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {test.description}
                </p>
                
                {/* Test Information Tags */}
                <div className="space-y-2">
                  {/* Test Basis */}
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 rounded-full font-semibold border border-pink-200">
                      Relationship Theory
                    </span>
                  </div>
                  
                  {/* Test Stats */}
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
                      <span className="text-gray-600">👥</span>
                      <span className="text-gray-700 font-medium">1.5M+</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <span className="text-yellow-600">⭐</span>
                      <span className="text-yellow-700 font-medium">4.7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Test Button - Absolutely positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <Button
                  onClick={() => handleTestSelect(test.type)}
                  className="w-full py-2 text-sm bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg transition-all duration-300"
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
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Honest Reflection</h3>
              <p className="text-sm text-gray-600">Answer based on your true feelings and experiences in relationships.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Take Your Time</h3>
              <p className="text-sm text-gray-600">There's no time limit. Complete the test when you feel relaxed and focused.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-sm text-gray-600">Your responses are completely anonymous and securely protected.</p>
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
                The relationship tests provided on this platform are for self-understanding and personal growth purposes only. 
                They cannot replace professional relationship counseling or therapy. 
                If you're experiencing significant relationship challenges, we recommend consulting a qualified relationship counselor or therapist. 
                Remember, seeking help is a sign of strength, and healthy relationships are built on open communication and mutual respect.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
