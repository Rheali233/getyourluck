/**
 * Relationship AI Service
 * AI-powered analysis for relationship tests
 */

import type { TestSession, TestResult } from '../types';

export interface AIAnalysisRequest {
  testType: 'love_language' | 'love_style' | 'interpersonal';
  answers: Array<{ questionId: string; answer: string | number; timestamp: string }>;
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: TestResult;
  error?: string;
}


export class RelationshipAIService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
  }

  /**
   * Analyze test results using AI service ONLY
   */
  async analyzeTest(session: TestSession): Promise<TestResult> {
    try {
      console.log('Starting AI analysis for session:', session.id, 'test type:', session.testType);
      
      // Only use AI analysis - no fallback
      const aiResult = await this.analyzeWithAI(session);
      console.log('AI analysis result:', aiResult);
      
      if (aiResult.success && aiResult.data) {
        return aiResult.data;
      }

      // If AI fails, throw error - no fallback
      throw new Error(aiResult.error || 'AI analysis failed');
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }









  /**
   * Get test result from AI service
   */
  async getTestResult(_sessionId: string): Promise<TestResult> {
    try {
      // TODO: Implement result retrieval
      throw new Error('Not implemented yet');
    } catch (error) {
      throw new Error(`Failed to get test result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Submit user feedback
   */
  async submitFeedback(sessionId: string, feedback: 'like' | 'dislike'): Promise<void> {
    try {
      // TODO: Implement feedback submission
      console.log(`Feedback submitted: ${sessionId} - ${feedback}`);
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze test results using AI
   */
  private async analyzeWithAI(session: TestSession): Promise<AIAnalysisResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('AI API key not configured');
      }

      const prompt = this.buildAIPrompt(session);
      const response = await this.callDeepSeek(prompt);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: this.parseAIResponse(response.data, session.testType)
        };
      }
      
      return {
        success: false,
        error: response.error || 'AI analysis failed'
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Build AI prompt based on test type
   */
  private buildAIPrompt(session: TestSession): string {
    const { testType, answers } = session;
    
    switch (testType) {
      case 'love_language':
        return this.buildLoveLanguagePrompt(answers);
      case 'love_style':
        return this.buildLoveStylePrompt(answers);
      case 'interpersonal':
        return this.buildInterpersonalPrompt(answers);
      default:
        throw new Error(`Unsupported test type: ${testType}`);
    }
  }

  /**
   * Build Love Language test AI prompt
   */
  private buildLoveLanguagePrompt(answers: Array<{ questionId: string; answer: string | number; timestamp: string }>): string {
    return `
You are a professional relationship counselor and love language expert. Please conduct a comprehensive analysis of the user's love language test results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete love language analysis, including:

1. **Score calculation for five love languages** (Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch)
2. **Primary love language identification** (highest score)
3. **Secondary love language identification** (second highest score)
4. **Detailed interpretation** of the user's love language profile
5. **Personalized recommendations** (3-5 specific, actionable suggestions)
6. **Relationship improvement tips** (3-5 practical tips for better relationships)
7. **Test summary** (brief, personalized summary of results)

Requirements:
- Analysis must be based on Dr. Gary Chapman's love language theory
- Language must be warm, encouraging, and easy to understand
- Avoid academic or rigid expressions
- Use specific examples and metaphors from daily life
- Maintain a positive and constructive tone
- Provide actionable, practical advice
- CRITICAL: You must return ONLY valid JSON format, no additional text before or after
- The response must be parseable by JSON.parse()
- Do not include any markdown formatting, code blocks, or explanatory text

IMPORTANT: Return ONLY the JSON object, nothing else:
{
  "primaryType": "words_of_affirmation",
  "secondaryType": "quality_time",
  "scores": {
    "words_of_affirmation": 4.2,
    "quality_time": 3.8,
    "receiving_gifts": 2.5,
    "acts_of_service": 3.1,
    "physical_touch": 2.9
  },
  "interpretation": "Detailed interpretation of your love language profile...",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ],
  "relationshipAdvice": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "summary": "Personalized summary of your test results..."
}
`;
  }

  /**
   * Build Love Style test AI prompt
   */
  private buildLoveStylePrompt(answers: Array<{ questionId: string; answer: string | number; timestamp: string }>): string {
    return `
You are a professional relationship counselor and attachment theory expert. Please conduct a comprehensive analysis of the user's love style test results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete love style analysis, including:

1. **Dominant love style identification** (Secure, Anxious, Avoidant, or Disorganized)
2. **Secondary style characteristics** (if applicable)
3. **Detailed interpretation** of the user's love style
4. **Personalized recommendations** (3-5 specific, actionable suggestions)
5. **Relationship improvement tips** (3-5 practical tips for better relationships)
6. **Test summary** (brief, personalized summary of results)

Requirements:
- Analysis must be based on attachment theory and relationship psychology
- Language must be warm, encouraging, and easy to understand
- Avoid academic or rigid expressions
- Use specific examples and metaphors from daily life
- Maintain a positive and constructive tone
- Provide actionable, practical advice
- Must return in strict JSON format

Please return results in the following JSON format:
{
  "dominantStyle": "secure",
  "secondaryStyle": "anxious",
  "interpretation": "Detailed interpretation of your love style...",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ],
  "relationshipAdvice": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "summary": "Personalized summary of your test results..."
}
`;
  }

  /**
   * Build Interpersonal test AI prompt
   */
  private buildInterpersonalPrompt(answers: Array<{ questionId: string; answer: string | number; timestamp: string }>): string {
    return `
You are a professional relationship counselor and interpersonal communication expert. Please conduct a comprehensive analysis of the user's interpersonal relationship test results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete interpersonal relationship analysis, including:

1. **Communication style assessment** (assertive, passive, aggressive, or passive-aggressive)
2. **Conflict resolution approach** (collaborative, compromising, avoiding, or competing)
3. **Emotional intelligence evaluation** (self-awareness, self-regulation, empathy, social skills)
4. **Detailed interpretation** of the user's interpersonal profile
5. **Personalized recommendations** (3-5 specific, actionable suggestions)
6. **Relationship improvement tips** (3-5 practical tips for better relationships)
7. **Test summary** (brief, personalized summary of results)

Requirements:
- Analysis must be based on interpersonal communication theory and psychology
- Language must be warm, encouraging, and easy to understand
- Avoid academic or rigid expressions
- Use specific examples and metaphors from daily life
- Maintain a positive and constructive tone
- Provide actionable, practical advice
- Must return in strict JSON format

Please return results in the following JSON format:
{
  "communicationStyle": "assertive",
  "conflictResolution": "collaborative",
  "emotionalIntelligence": "high",
  "interpretation": "Detailed interpretation of your interpersonal profile...",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ],
  "relationshipAdvice": [
    "Practical tip 1",
    "Practical tip 2",
    "Practical tip 3"
  ],
  "summary": "Personalized summary of your test results..."
}
`;
  }

  /**
   * Call DeepSeek AI service
   */
  private async callDeepSeek(prompt: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        try {
          const parsedContent = JSON.parse(content);
          return { success: true, data: parsedContent };
        } catch (parseError) {
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
          return { success: false, error: `Failed to parse AI response: ${errorMessage}` };
        }
      } else {
        return { success: false, error: 'API response format error' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'API call failed' 
      };
    }
  }

  /**
   * Parse AI response and convert to TestResult
   */
  private parseAIResponse(response: any, testType: string): TestResult {
    try {
      switch (testType) {
        case 'love_language':
          return this.parseLoveLanguageAIResponse(response);
        case 'love_style':
          return this.parseLoveStyleAIResponse(response);
        case 'interpersonal':
          return this.parseInterpersonalAIResponse(response);
        default:
          throw new Error(`Unsupported test type: ${testType}`);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Parse Love Language AI response
   */
  private parseLoveLanguageAIResponse(response: any): TestResult {
    return {
      sessionId: '',
      testType: 'love_language',
      scores: response.scores || {},
      primaryType: response.primaryType || 'words_of_affirmation',
      secondaryType: response.secondaryType || 'quality_time',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [],
      areasForGrowth: [],
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Love Style AI response
   */
  private parseLoveStyleAIResponse(response: any): TestResult {
    return {
      sessionId: '',
      testType: 'love_style',
      scores: {},
      primaryType: response.dominantStyle || 'secure',
      secondaryType: response.secondaryStyle || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [],
      areasForGrowth: [],
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Interpersonal AI response
   */
  private parseInterpersonalAIResponse(response: any): TestResult {
    return {
      sessionId: '',
      testType: 'interpersonal',
      scores: {},
      primaryType: response.communicationStyle || 'assertive',
      secondaryType: response.conflictResolution || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [],
      areasForGrowth: [],
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }


}

export const relationshipAIService = new RelationshipAIService(
  import.meta.env.VITE_DEEPSEEK_API_KEY || ''
);
