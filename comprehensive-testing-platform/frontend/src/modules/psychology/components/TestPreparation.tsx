/**
 * Test Preparation Interface Component
 * Displays test introduction, basis, and precautions before starting the test
 */

import React from 'react';
import { Button, Card } from '@/components/ui';
import { TestNavigation } from '@/components/ui';
import type { BaseComponentProps } from '@/types/componentTypes';
import { TestType } from '../types';
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
  const getTestInfo = (type: TestType) => {
    switch (type) {
      case TestType.MBTI:
        return {
          name: 'MBTI Personality Test',
        description: 'Modern personality assessment tool based on Carl G. Jung\'s psychological type theory',
          duration: '15-20 minutes',
        questions: '64 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Carl G. Jung\'s Psychological Type Theory (1921): Proposes that personality consists of four dimensions: psychological energy direction (E/I), perception method (S/N), judgment method (T/F), and life attitude (J/P).',
                'Isabel Briggs Myers and Katharine Cook Briggs (1940s): Developed the MBTI tool based on Jung\'s theory, measuring individual type preferences through questionnaires.',
                'MBTI Core Assumption: Personality differences stem from different preference combinations across four dimensions, forming 16 typical types.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure four preference dimensions:',
                '• E–I (Extraversion–Introversion): Focus on energy source, external interaction vs internal reflection',
                '• S–N (Sensing–Intuition): Information acquisition method, concrete details vs abstract patterns', 
                '• T–F (Thinking–Feeling): Decision-making method, logical objectivity vs values and interpersonal',
                '• J–P (Judging–Perceiving): Lifestyle, orderly planning vs flexible openness'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Internal Consistency: MBTI four-dimension scales have α coefficients between 0.70–0.90 (Myers & McCaulley, 1985)',
                'Test-Retest Reliability: Across 4 weeks to 5 years, test-retest consistency rates range between 75%–90%',
                'Validity: Correlation studies with the Big Five personality model show significant correlations between MBTI dimensions and some OCEAN model dimensions (McCrae & Costa, 1989)'
              ]
            }
          ],
          notice: 'MBTI emphasizes preferences rather than abilities or health levels; results do not represent superiority or inferiority. Suitable for career development, team building, personal growth, and educational counseling; not suitable for clinical diagnosis.'
        };
      case TestType.PHQ9:
        return {
          name: 'PHQ-9 Depression Screening',
          description: 'Standardized depression symptom assessment scale based on DSM diagnostic criteria',
          duration: '5-10 minutes',
          questions: '9 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'DSM-IV Depression Diagnostic Criteria: Based on the American Psychiatric Association\'s Diagnostic and Statistical Manual of Mental Disorders, Fourth Edition, providing standardized criteria for clinical depression diagnosis.',
                'PHQ-9 Scale Development: Developed by Kroenke et al. in 2001, specifically designed for depression symptom screening in primary care and community settings.',
                'Symptom Assessment Scope: Evaluates the frequency and severity of 9 core depression symptoms over the past two weeks, including emotional, cognitive, physical, and behavioral symptoms.',
                'Clinical Application Value: Serves as a preliminary screening tool for depression, helping identify individuals who may need further professional evaluation.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 4-point scale to measure nine core symptoms:',
                '• Loss of interest/pleasure: Losing interest in daily activities or inability to experience pleasure',
                '• Depressed mood/hopelessness: Persistent feelings of sadness, emptiness, or hopelessness',
                '• Sleep problems: Difficulty falling asleep, restless sleep, or excessive sleeping',
                '• Fatigue/energy loss: Feeling tired or lacking energy',
                '• Appetite/weight changes: Decreased or increased appetite, significant weight changes',
                '• Low self-esteem: Feeling worthless or excessive guilt',
                '• Concentration/decision difficulties: Trouble thinking, concentrating, or making decisions',
                '• Psychomotor changes: Psychomotor agitation or retardation',
                '• Suicidal thoughts: Thoughts of death or self-harm'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Internal Consistency: PHQ-9 scale has a Cronbach\'s α coefficient of 0.89, indicating excellent internal consistency.',
                'Test-Retest Reliability: Test-retest correlation coefficient of 0.84 across different time points, demonstrating scale stability.',
                'Criterion Validity: Good correlation with clinician-diagnosed depressive disorders (r=0.71).',
                'Sensitivity: 88% sensitivity and 88% specificity in identifying major depressive disorder.',
                'Cross-Cultural Validity: Validated in multiple countries and regions, demonstrating good cross-cultural applicability.'
              ]
            }
          ],
          notice: 'PHQ-9 test results are for screening purposes only and cannot replace professional medical diagnosis. Test results reflect your symptom experience over the past two weeks. If you experience persistent distress or severe symptoms, please seek professional mental health services promptly. This assessment aims to help you understand your mental health status and provide reference for subsequent professional evaluation.'
        };
      case TestType.EQ:
        return {
          name: 'Emotional Intelligence Test',
        description: 'Scientific assessment tool based on Daniel Goleman\'s five core dimensions of emotional intelligence',
        duration: '20-25 minutes',
        questions: '50 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Daniel Goleman\'s Emotional Intelligence Theory (1995): Defines emotional intelligence as the ability to handle personal emotions and interpersonal relationships, systematically divided into five key areas.',
                'Self-Awareness: Core is "knowing oneself", measuring awareness of one\'s own emotions, values, abilities, and goals.',
                'Self-Regulation: Core is "controlling oneself", measuring the ability to manage emotions, control impulses, cope with stress, and adapt to changes.',
                'Motivation: Core is "driving oneself", measuring intrinsic drive, achievement desire, and optimism, stemming from passion for goals and work.',
                'Empathy: Core is "understanding others", measuring the ability to perceive, understand, and respond to others\' emotions, forming the foundation for healthy interpersonal relationships.',
                'Social Skills: Core is "handling interpersonal relationships", measuring communication, influence, leadership, and conflict resolution abilities.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment uses a Likert 5-point scale to measure five core dimensions:',
                '• Self-Awareness: Emotional awareness, self-reflection, value recognition, intrinsic motivation identification',
                '• Self-Regulation: Emotional control, impulse management, stress response, adaptive adjustment',
                '• Motivation: Intrinsic drive, goal orientation, optimism, achievement motivation',
                '• Empathy: Emotion recognition, perspective understanding, emotional response, social perception',
                '• Social Skills: Communication expression, relationship building, conflict resolution, teamwork'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Internal Consistency: Uses reverse-scoring item design to effectively avoid respondents\' "yes" bias, improving scale reliability.',
                'Content Validity: Each core dimension is subdivided into multiple facets, comprehensively assessing various sub-abilities of emotional intelligence, ensuring measurement content completeness.',
                'Ecological Validity: Incorporates localized elements in the question bank, aligning with Chinese cultural context, improving measurement accuracy in real-life scenarios.',
                'Cross-Cultural Adaptability: Design includes cross-cultural replacement strategies, ensuring measurement equivalence across different cultural backgrounds.'
              ]
            }
          ],
          notice: 'Emotional intelligence test results reflect your current emotional intelligence level, not a fixed ability. Emotional intelligence can be significantly improved through learning and practice; test results will provide specific improvement suggestions and practical guidance.'
        };
      case TestType.HAPPINESS:
        return {
          name: 'Happiness Index Assessment',
        description: 'Comprehensive life satisfaction assessment tool based on the positive psychology PERMA model',
        duration: '15-20 minutes',
        questions: '50 questions',
          theoretical_basis: [
            {
              title: 'Theoretical Basis',
              content: [
                'Positive Psychology Theoretical Framework: Founded by Martin Seligman in 1998, focusing on human strengths, virtues, and happiness, rather than the pathological orientation of traditional psychology.',
                'PERMA Model (2011): Seligman\'s theory of five elements of happiness, including Positive Emotion, Engagement, Relationships, Meaning, and Accomplishment.',
                'Life Satisfaction Theory: Based on Diener et al.\'s subjective well-being research, emphasizing individuals\' cognitive evaluation and emotional experience of overall life quality.',
                'Broaden-and-Build Theory: Proposed by Fredrickson, suggesting that positive emotions broaden thought-action repertoires and build personal resources.'
              ]
            },
            {
              title: 'Scale Design',
              content: [
                'This assessment is based on the PERMA five-element model, using a Likert 5-point scale to measure:',
                '• Positive Emotion (P): Positive emotional experiences, life satisfaction, optimistic attitude, gratitude mindset',
                '• Engagement (E): Focus, flow experience, hobbies and interests, skill application',
                '• Relationships (R): Social support, intimate relationships, sense of belonging, social connection',
                '• Meaning (M): Life goals, values, sense of purpose, meaning in life',
                '• Accomplishment (A): Goal achievement, ability recognition, sense of progress, self-efficacy'
              ]
            },
            {
              title: 'Reliability and Validity',
              content: [
                'Content Validity: Based on the PERMA theoretical framework, ensuring scale content covers all core dimensions of happiness, with theoretical completeness in measurement content.',
                'Construct Validity: Validates the five-factor structure through exploratory factor analysis, with moderate correlations between dimensions, being relatively independent yet forming a whole.',
                'Ecological Validity: Question design closely relates to daily life scenarios, reflecting real-life experiences, improving measurement result practicality.',
                'Cross-Cultural Adaptability: Considers happiness perception differences across cultural backgrounds, designing culturally inclusive measurement items.'
              ]
            }
          ],
          notice: 'Happiness index assessment results reflect your current life satisfaction and happiness level. Happiness is a dynamic process that can be improved through positive actions and mindset adjustments. Test results will provide specific life improvement suggestions and action guidance.'
        };
      default:
        return {
          name: 'Unknown Test',
          description: '',
          duration: '',
          questions: '',
          theoretical_basis: [],
          notice: ''
        };
    }
  };

  const testInfo = getTestInfo(testType);

  return (
    <div className={cn("min-h-screen bg-blue-50", className)} data-testid={testId} {...props}>
      {/* Top Navigation */}
      <TestNavigation 
        moduleName="Psychological Testing Center"
        backPath="/psychology"
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
              className="px-12 py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
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

export default TestPreparation;
