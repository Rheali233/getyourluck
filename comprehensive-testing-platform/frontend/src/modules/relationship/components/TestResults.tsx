/**
 * Test Results Component
 * Relationship test results display with charts following development standards
 */

import React from 'react';
import { Button, Card } from '@/components/ui';

import type { TestResultsProps } from '../types';
import { cn } from '@/utils/classNames';

export const TestResults: React.FC<TestResultsProps> = ({
  className,
  testId = 'test-results',
  result,
  testType,
  onRetakeTest,
  onShareResult,
  ...props
}) => {
  // Get test type display name
  const getTestTypeDisplayName = (type: string) => {
    switch (type) {
      case 'love_language':
        return 'Love Language Test Results';
      case 'love_style':
        return 'Love Style Assessment Results';
      case 'interpersonal':
        return 'Interpersonal Skills Results';
      default:
        return 'Test Results';
    }
  };

  // Get primary type display name
  const getPrimaryTypeDisplayName = (type: string) => {
    switch (type) {
      case 'words_of_affirmation':
        return 'Words of Affirmation';
      case 'quality_time':
        return 'Quality Time';
      case 'receiving_gifts':
        return 'Receiving Gifts';
      case 'acts_of_service':
        return 'Acts of Service';
      case 'physical_touch':
        return 'Physical Touch';
      case 'eros':
        return 'Passionate Love (Eros)';
      case 'ludus':
        return 'Playful Love (Ludus)';
      case 'storge':
        return 'Friendship Love (Storge)';
      case 'mania':
        return 'Possessive Love (Mania)';
      case 'pragma':
        return 'Practical Love (Pragma)';
      case 'agape':
        return 'Altruistic Love (Agape)';
      case 'social_initiative':
        return 'Social Initiative';
      case 'emotional_support':
        return 'Emotional Support';
      case 'conflict_resolution':
        return 'Conflict Resolution';
      case 'boundary_setting':
        return 'Boundary Setting';
      // Interpersonal Communication Styles
      case 'assertive':
        return 'Assertive';
      case 'passive':
        return 'Passive';
      case 'aggressive':
        return 'Aggressive';
      case 'passive_aggressive':
        return 'Passive-Aggressive';
      // Conflict Resolution Approaches
      case 'collaborative':
        return 'Collaborative';
      case 'compromising':
        return 'Compromising';
      case 'avoiding':
        return 'Avoiding';
      case 'competing':
        return 'Competing';
      default:
        return type;
    }
  };

  return (
    <div
      className={cn("min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-8 px-4", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {getTestTypeDisplayName(testType)}
          </h1>
          <p className="text-lg text-gray-600">
            Congratulations on completing your assessment!
          </p>
        </div>

        {/* Loading State */}
        {!result && (
          <Card className="bg-white shadow-lg p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Generating Your Results</h3>
            <p className="text-gray-600">Please wait while we analyze your answers and create your personalized report...</p>
          </Card>
        )}

        {/* Error State */}
        {!result && (
          <Card className="bg-red-50 border border-red-200 p-6 mb-8">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">No Results Available</h3>
              <p className="text-red-600 mb-4">Unable to load test results. Please try taking the test again.</p>
              <Button
                onClick={onRetakeTest}
                variant="outline"
                size="small"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Your Love Language Profile - Enhanced Layout */}
        {testType === 'love_language' && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Love Language Profile
            </h2>
            
            {/* AI Generated Summary */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {result.summary || `Based on your ${testType} test results, you have completed a comprehensive assessment that reveals your unique relationship communication patterns. Your primary love language is ${result.primaryType}, with ${result.secondaryType} as your secondary preference. This understanding will help you build stronger, more meaningful connections with your partner.`}
              </p>
            </div>
            
            {/* Primary Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Primary Love Language
              </h3>
              {result.primaryType && (
                <div>
                  <h4 className="text-xl font-bold text-pink-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.primaryType)}
                  </h4>
                  
                  {/* AI Generated Analysis */}
                  {result.interpretation && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-pink-800 mb-2">Expression Patterns</h5>
                        <p className="text-gray-700 text-sm">
                          {result.interpretation.includes('express') ? 
                            result.interpretation : 
                            'Your primary love language shapes how you naturally show affection and care to your partner.'
                          }
                        </p>
                      </div>
                      
                      {result.strengths && result.strengths.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">Relationship Benefits</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.areasForGrowth && result.areasForGrowth.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Communication Insights</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.areasForGrowth.map((area, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">→</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Secondary Type */}
            {result.secondaryType && result.secondaryType !== result.primaryType && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Secondary Love Language
                </h3>
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.secondaryType)}
                  </h4>
                  
                  {/* Secondary Language Insights */}
                  <div className="mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Complementary Characteristics</h5>
                      <p className="text-gray-700 text-sm">
                        This secondary love language adds depth to your relationship approach and provides 
                        additional ways to connect with your partner. It may emerge in specific 
                        situations or when your primary language needs are well-met.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* Love Style Profile - Simplified Layout (No Chart) */}
        {testType === 'love_style' && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Love Style Profile
            </h2>
            
            {/* AI Generated Summary */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {result.summary || `Based on your ${testType} test results, you have completed a comprehensive assessment that reveals your unique relationship attachment patterns. Your dominant love style is ${result.primaryType}, with ${result.secondaryType} as your secondary characteristic. This understanding will help you build healthier, more secure relationships.`}
              </p>
            </div>
            
            {/* Primary Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Dominant Love Style
              </h3>
              {result.primaryType && (
                <div>
                  <h4 className="text-xl font-bold text-purple-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.primaryType)}
                  </h4>
                  
                  {/* AI Generated Analysis */}
                  {result.interpretation && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-2">Behavioral Patterns</h5>
                        <p className="text-gray-700 text-sm">
                          {result.interpretation.includes('behavioral') ? 
                            result.interpretation : 
                            'Your dominant love style shapes how you approach relationships, communicate with partners, and express emotional needs.'
                          }
                        </p>
                      </div>
                      
                      {result.strengths && result.strengths.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">Strengths & Advantages</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.areasForGrowth && result.areasForGrowth.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Growth Opportunities</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.areasForGrowth.map((area, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">→</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Secondary Type */}
            {result.secondaryType && result.secondaryType !== result.primaryType && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Secondary Love Style
                </h3>
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.secondaryType)}
                  </h4>
                  
                  {/* Secondary Style Insights */}
                  <div className="mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Complementary Characteristics</h5>
                      <p className="text-gray-700 text-sm">
                        This secondary style adds depth to your relationship approach and provides 
                        additional ways to connect with your partner. It may emerge in specific 
                        situations or with certain types of partners.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
        
        {/* Interpersonal Skills Profile - Enhanced Layout */}
        {testType === 'interpersonal' && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Your Interpersonal Skills Profile
            </h2>
            
            {/* AI Generated Summary */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {result.summary || `Based on your ${testType} test results, you have completed a comprehensive assessment that reveals your unique interpersonal communication patterns. Your primary communication style is ${result.primaryType}, with ${result.secondaryType} as your conflict resolution approach. This understanding will help you build stronger, more effective relationships.`}
              </p>
            </div>
            
            {/* Communication Style */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Communication Style
              </h3>
              {result.primaryType && (
                <div>
                  <h4 className="text-xl font-bold text-green-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.primaryType)}
                  </h4>
                  
                  {/* AI Generated Analysis */}
                  {result.interpretation && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Communication Patterns</h5>
                        <p className="text-gray-700 text-sm">
                          {result.interpretation.includes('communicate') ? 
                            result.interpretation : 
                            'Your communication style shapes how you express yourself, listen to others, and navigate social interactions.'
                          }
                        </p>
                      </div>
                      
                      {result.strengths && result.strengths.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Relationship Strengths</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.areasForGrowth && result.areasForGrowth.length > 0 && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-orange-800 mb-2">Growth Opportunities</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.areasForGrowth.map((area, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-orange-600 mr-2">→</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Conflict Resolution Approach */}
            {result.secondaryType && result.secondaryType !== result.primaryType && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Conflict Resolution Approach
                </h3>
                <div>
                  <h4 className="text-lg font-bold text-purple-700 mb-2 text-center">
                    {getPrimaryTypeDisplayName(result.secondaryType)}
                  </h4>
                  
                  {/* AI Generated Analysis for Conflict Resolution */}
                  {result.interpretation && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-800 mb-2">Conflict Behavior Patterns</h5>
                        <p className="text-gray-700 text-sm">
                          {result.interpretation.includes('conflict') ? 
                            result.interpretation : 
                            'Your conflict resolution approach shapes how you handle disagreements and challenges in relationships.'
                          }
                        </p>
                      </div>
                      
                      {result.strengths && result.strengths.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-green-800 mb-2">Conflict Resolution Strengths</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">✓</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.areasForGrowth && result.areasForGrowth.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-blue-800 mb-2">Conflict Resolution Growth Areas</h5>
                          <ul className="text-gray-700 text-sm space-y-1">
                            {result.areasForGrowth.map((area, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">→</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Emotional Intelligence Assessment */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Emotional Intelligence Assessment
              </h3>
              
              {/* AI Generated Analysis for Emotional Intelligence */}
              {result.interpretation && (
                <div className="mt-4 space-y-3">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-indigo-800 mb-2">Emotional Intelligence Patterns</h5>
                    <p className="text-gray-700 text-sm">
                      {result.interpretation.includes('emotional') ? 
                        result.interpretation : 
                        'Your emotional intelligence shapes how you understand, manage, and express emotions in relationships.'
                      }
                    </p>
                  </div>
                  
                  {result.strengths && result.strengths.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">Emotional Intelligence Strengths</h5>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {result.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.areasForGrowth && result.areasForGrowth.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Emotional Intelligence Growth Areas</h5>
                      <ul className="text-gray-700 text-sm space-y-1">
                        {result.areasForGrowth.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">→</span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Core EI Dimensions Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Self-Awareness */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-indigo-800 mb-2">Self-Awareness</h5>
                  <p className="text-gray-700 text-sm">
                    Your ability to recognize and understand your own emotions, strengths, and areas for growth.
                  </p>
                </div>
                
                {/* Self-Regulation */}
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-teal-800 mb-2">Self-Regulation</h5>
                  <p className="text-gray-700 text-sm">
                    Your capacity to manage and control your emotional responses in various situations.
                  </p>
                </div>
                
                {/* Empathy */}
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-rose-800 mb-2">Empathy</h5>
                  <p className="text-gray-700 text-sm">
                    Your ability to understand and share the feelings of others, building deeper connections.
                  </p>
                </div>
                
                {/* Social Skills */}
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-amber-800 mb-2">Social Skills</h5>
                  <p className="text-gray-700 text-sm">
                    Your effectiveness in building relationships, managing conflicts, and working with others.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}



        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Relationship Advice */}
        {result.relationshipAdvice && result.relationshipAdvice.length > 0 && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Relationship Improvement Tips
            </h3>
            <div className="space-y-3">
              {result.relationshipAdvice.map((advice, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{advice}</span>
                </div>
              ))}
            </div>
          </Card>
        )}


      </div>
    </div>
  );
};
