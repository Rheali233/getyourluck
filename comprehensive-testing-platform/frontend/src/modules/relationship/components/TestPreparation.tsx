/**
 * Test Preparation Component
 * Relationship test preparation interface following development standards
 */

import React from 'react';
import { Button, Card, TestNavigation } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import type { TestType } from '../types';
import { cn } from '@/utils/classNames';

export interface TestPreparationProps extends BaseComponentProps {
  testType: TestType;
  onStartTest: () => void;
}

export const TestPreparation: React.FC<TestPreparationProps> = ({
  className,
  testId = 'test-preparation',
  testType,
  onStartTest,
  ...props
}) => {
  // Get test information based on type
  const getTestInfo = (type: TestType) => {
    switch (type) {
      case 'love_language':
        return {
          name: 'Love Language Test',
          description: 'Discover your primary love language and learn how to express and receive love more effectively',
          duration: '10-15 minutes',
          questions: '30 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Gary Chapman\'s Five Love Languages Theory (1992): Proposes that individuals have primary ways of expressing and receiving love, including Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, and Physical Touch.',
                'Relationship Psychology Research: Based on extensive research in couples therapy and relationship counseling, identifying common patterns in how people express affection and feel loved.',
                'Cross-Cultural Validation: The theory has been validated across different cultures and relationship types, showing universal patterns in love expression preferences.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure five love language dimensions:',
                '• Words of Affirmation: Verbal expressions of love, appreciation, and encouragement',
                '• Quality Time: Undivided attention and meaningful time spent together',
                '• Receiving Gifts: Thoughtful presents and symbolic tokens of affection',
                '• Acts of Service: Helpful actions and support in daily life',
                '• Physical Touch: Physical affection, hugs, and intimate contact'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Clinical Validation: Widely used in couples therapy and relationship counseling with proven effectiveness',
                'Research Support: Multiple studies have validated the five love languages framework in diverse populations',
                'Practical Application: Successfully applied in improving communication and satisfaction in romantic, family, and friendship relationships'
              ]
            }
          ],
          notice: 'Love Language assessment helps identify communication preferences and does not indicate relationship health or compatibility. Results are for personal growth and relationship improvement purposes only. Not suitable for clinical diagnosis or relationship therapy replacement.'
        };
      case 'love_style':
        return {
          name: 'Love Style Assessment',
          description: 'Explore your unique approach to romantic relationships and understand your love patterns',
          duration: '15-20 minutes',
          questions: '42 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'John Alan Lee\'s Love Styles Theory (1973): Identifies six distinct approaches to romantic relationships: Eros (passionate love), Ludus (playful love), Storge (friendship love), Mania (obsessive love), Pragma (practical love), and Agape (selfless love).',
                'Relationship Psychology Research: Based on extensive studies of romantic relationship patterns and attachment styles across different cultures and age groups.',
                'Modern Relationship Dynamics: Updated to reflect contemporary relationship patterns and digital age dating behaviors.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure six love style dimensions:',
                '• Eros: Passionate, intense romantic love with strong physical and emotional attraction',
                '• Ludus: Playful, fun-loving approach to relationships and dating',
                '• Storge: Friendship-based love that develops gradually from companionship',
                '• Mania: Intense, obsessive love with emotional highs and lows',
                '• Pragma: Practical, logical approach to finding compatible partners',
                '• Agape: Selfless, unconditional love focused on partner\'s well-being'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Research Validation: Multiple studies have confirmed the reliability of the six love styles framework',
                'Cross-Cultural Application: Successfully applied across different cultural contexts and relationship types',
                'Clinical Utility: Used in relationship counseling to help couples understand compatibility and communication patterns'
              ]
            }
          ],
          notice: 'Love Style assessment reveals relationship patterns and preferences, not relationship success or failure. Understanding your style can help improve communication and compatibility awareness. Results are for personal growth and relationship improvement purposes only.'
        };
      case 'interpersonal':
        return {
          name: 'Interpersonal Skills Evaluation',
          description: 'Assess your social skills and learn strategies to improve your relationships',
          duration: '12-18 minutes',
          questions: '36 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Social Skills Theory: Based on research in social psychology and communication studies, identifying key components of effective interpersonal relationships.',
                'Emotional Intelligence Framework: Incorporates Daniel Goleman\'s work on social awareness and relationship management.',
                'Communication Studies: Draws from research on verbal and non-verbal communication, conflict resolution, and boundary setting.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure key interpersonal skill areas:',
                '• Communication Skills: Verbal expression, active listening, and clarity in conveying messages',
                '• Conflict Resolution: Ability to handle disagreements constructively and find mutually beneficial solutions',
                '• Empathy and Understanding: Capacity to recognize and respond to others\' emotions and perspectives',
                '• Boundary Setting: Ability to establish and maintain healthy personal and professional boundaries'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Research-Based: Developed from validated social skills assessment tools and research findings',
                'Practical Application: Successfully used in workplace training, relationship counseling, and personal development programs',
                'Continuous Improvement: Regularly updated based on new research in social psychology and communication studies'
              ]
            }
          ],
          notice: 'Interpersonal skills assessment evaluates current social abilities and identifies areas for growth. Results are for personal development and skill improvement purposes only. Not suitable for clinical assessment or professional evaluation.'
        };
      default:
        return {
          name: 'Relationship Test',
          description: 'A comprehensive assessment of your relationship skills and patterns',
          duration: '15-20 minutes',
          questions: '30 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Relationship Psychology: Based on comprehensive research in interpersonal relationships, communication, and emotional intelligence.',
                'Evidence-Based Assessment: Incorporates validated tools and frameworks from relationship counseling and social psychology research.',
                'Holistic Approach: Evaluates multiple aspects of relationship skills including communication, empathy, conflict resolution, and boundary setting.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure key relationship skill areas:',
                '• Communication Effectiveness: Ability to express thoughts and feelings clearly',
                '• Emotional Intelligence: Understanding and managing emotions in relationships',
                '• Conflict Management: Handling disagreements and finding solutions',
                '• Relationship Building: Creating and maintaining meaningful connections'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Research Foundation: Based on validated relationship assessment tools and psychological research',
                'Practical Application: Successfully used in relationship counseling and personal development programs',
                'Continuous Validation: Regularly updated based on new research findings and user feedback'
              ]
            }
          ],
          notice: 'Relationship assessment provides insights into your relationship patterns and skills. Results are for personal growth and relationship improvement purposes only. Not suitable for clinical diagnosis or professional evaluation.'
        };
    }
  };

  const testInfo = getTestInfo(testType);

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-pink-50 to-rose-50", className)} data-testid={testId} {...props}>
      {/* Top Navigation */}
      <TestNavigation 
        moduleName="Relationship Testing Center"
        backPath="/relationship"
      />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Test Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">{testInfo.name}</h1>
          <p className="text-lg text-gray-700">{testInfo.description}</p>
        </div>

        {/* Test Preparation */}
        <Card className="p-6 mb-8 bg-white">
          <h2 className="text-xl font-bold text-black mb-6 flex items-center">
            <span className="text-2xl mr-3">📋</span>
            Test Preparation
          </h2>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl mr-3">⏱️</span>
              <div>
                <h3 className="text-lg font-semibold text-black">Estimated Time</h3>
                <p className="text-gray-700">{testInfo.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-black">Number of Questions</h3>
                <p className="text-gray-700">{testInfo.questions}</p>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-black mb-3">Answering Suggestions</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Answer honestly based on your first impression, avoid overthinking
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Choose a quiet, undisturbed environment
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    There are no right or wrong answers, choose the option that best fits your situation
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-3">Privacy Protection</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🔒</span>
                    All test data is processed anonymously
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🔒</span>
                    Results are for personal reference only and won\'t be accessed by third parties
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🔒</span>
                    You can exit the test anytime, data won\'t be saved
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="text-center pt-6">
            <Button
              onClick={onStartTest}
              className="px-12 py-4 text-lg bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Formal Test
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Clicking the button will begin the formal test, please ensure you have sufficient time to complete it
            </p>
          </div>
        </Card>

        {/* Theoretical Basis and Design Explanation */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">📚</span>
            Theoretical Basis and Design Explanation
          </h2>
          
          <div className="space-y-6">
            {testInfo.theoretical_basis.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-gray-700 leading-relaxed text-sm">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Notice */}
        <Card className="p-6 bg-yellow-50 border border-yellow-200 mb-8">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Notice</h3>
              <p className="text-yellow-700 leading-relaxed text-sm">
                {testInfo.notice}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
