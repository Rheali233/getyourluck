/**
 * Relationship AI Service
 * AI-powered analysis for relationship tests
 */

import type { TestSession, TestResult, AIAnalysisResponse } from '../types';


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
      // Only use AI analysis - no fallback
      const aiResult = await this.analyzeWithAI(session);
      
      if (aiResult.success && aiResult.data) {
        return aiResult.data;
      }

      // If AI fails, throw error - no fallback
      throw new Error(aiResult.error || 'AI analysis failed');
    } catch (error) {
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
  async submitFeedback(_sessionId: string, _feedback: 'like' | 'dislike'): Promise<void> {
    try {
      // TODO: Implement feedback submission
      // _sessionId and _feedback will be used when implementing the actual feedback logic
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

1. **Primary love language identification** (dominant preference)
2. **Secondary love language identification** (secondary preference)
3. **Detailed interpretation** of the user's love language profile
4. **Personalized recommendations** (3-5 specific, actionable suggestions)
5. **Relationship improvement tips** (3-5 practical tips for better relationships)
6. **Test summary** (brief, personalized summary of results)

**IMPORTANT: For each love language (primary and secondary), provide:**
- **Expression patterns** - How this person naturally shows love to others
- **Reception preferences** - How they prefer to receive love and affection
- **Relationship benefits** - What positive impact this brings to relationships
- **Potential misunderstandings** - How others might misinterpret their needs
- **Partner communication tips** - How partners can better connect with them
- **Daily application examples** - Specific ways to practice this love language

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
  "primaryLanguageAnalysis": {
    "expressionPatterns": "How this person naturally shows love...",
    "receptionPreferences": "How they prefer to receive love...",
    "relationshipBenefits": "What positive impact this brings...",
    "potentialMisunderstandings": "How others might misinterpret...",
    "partnerCommunicationTips": "How partners can better connect...",
    "dailyApplicationExamples": "Specific ways to practice..."
  },
  "secondaryLanguageAnalysis": {
    "expressionPatterns": "Secondary expression patterns...",
    "receptionPreferences": "Secondary reception preferences...",
    "relationshipBenefits": "Additional relationship benefits...",
    "potentialMisunderstandings": "Secondary misunderstandings...",
    "partnerCommunicationTips": "Additional communication tips...",
    "dailyApplicationExamples": "Secondary application examples..."
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

**IMPORTANT: For each love style (dominant and secondary), provide:**
- **Behavioral patterns and tendencies** - How this style manifests in daily interactions
- **Strengths and advantages** - What positive qualities this brings to relationships
- **Potential challenges** - Areas that might need attention or growth
- **Partner expectations** - What this person typically expects from their romantic partner
- **Communication style** - How they prefer to express and receive love
- **Relationship dynamics** - How this style affects relationship patterns

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
  "dominantStyleAnalysis": {
    "behavioralPatterns": "How this style manifests in daily interactions...",
    "strengths": "Positive qualities this brings to relationships...",
    "challenges": "Areas that might need attention or growth...",
    "partnerExpectations": "What this person typically expects from their romantic partner...",
    "communicationStyle": "How they prefer to express and receive love...",
    "relationshipDynamics": "How this style affects relationship patterns..."
  },
  "secondaryStyleAnalysis": {
    "behavioralPatterns": "How this secondary style manifests...",
    "strengths": "Additional positive qualities...",
    "challenges": "Secondary areas for growth...",
    "partnerExpectations": "Additional expectations from partner...",
    "communicationStyle": "Secondary communication preferences...",
    "relationshipDynamics": "How secondary style influences relationships..."
  },
  "interpretation": "Overall interpretation of your love style combination...",
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

**IMPORTANT: For each interpersonal skill area, provide detailed analysis:**

**Communication Style Analysis:**
- **Behavioral patterns** - How this person typically communicates in relationships
- **Communication strengths** - What positive qualities they bring to interactions
- **Communication growth areas** - Specific areas where they can improve

**Conflict Resolution Analysis:**
- **Conflict behavior patterns** - How they handle disagreements and challenges
- **Conflict resolution strengths** - What positive qualities they bring to conflict situations
- **Conflict resolution growth areas** - Specific areas where they can improve

**Emotional Intelligence Analysis:**
- **Emotional response patterns** - How they manage and express emotions
- **Emotional intelligence strengths** - What positive qualities they bring to emotional situations
- **Emotional intelligence growth areas** - Specific areas where they can improve

**Overall Relationship Impact:**
- **Partner interaction tips** - How partners can better communicate with them
- **Social dynamics** - How their style affects group and one-on-one relationships

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
  "interpersonalAnalysis": {
    "communicationPatterns": "Detailed analysis of how this person typically communicates...",
    "communicationStrengths": "Specific positive qualities in communication...",
    "communicationGrowthAreas": "Specific areas for communication improvement...",
    "conflictBehavior": "Detailed analysis of how they handle disagreements...",
    "conflictStrengths": "Specific positive qualities in conflict resolution...",
    "conflictGrowthAreas": "Specific areas for conflict resolution improvement...",
    "emotionalResponses": "Detailed analysis of how they manage emotions...",
    "emotionalStrengths": "Specific positive qualities in emotional intelligence...",
    "emotionalGrowthAreas": "Specific areas for emotional intelligence improvement..."
  },
  "interpretation": "Comprehensive interpretation of your interpersonal profile...",
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
   * Sanitize AI text to extract valid JSON string
   * - 去除markdown代码块围栏
   * - 截取首尾花括号中的JSON主体
   */
  private sanitizeJsonString(content: string): string {
    if (!content) return content;

    let cleaned = content.trim();

    // 去除三引号代码块 ```json ... ``` 或 ``` ... ```
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/g, '').replace(/\s*```\s*$/g, '').trim();

    // 若仍包含多余说明文字，尝试截取第一个{到最后一个}
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1).trim();
    }

    return cleaned;
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
        const content = data.choices[0].message.content as string;
        
        try {
          // 先尝试直接解析
          let parsedContent = null as any;
          try {
            parsedContent = JSON.parse(content);
          } catch (_) {
            // 失败则进行清洗后再解析
            const sanitized = this.sanitizeJsonString(content);
            parsedContent = JSON.parse(sanitized);
          }
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
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Parse Love Language AI response
   */
  private parseLoveLanguageAIResponse(response: any): TestResult {
    // Extract detailed analysis for primary and secondary love languages
    const primaryAnalysis = response.primaryLanguageAnalysis || {};
    const secondaryAnalysis = response.secondaryLanguageAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'love_language',
      scores: {}, // No scores needed for text-only display
      primaryType: response.primaryType || 'words_of_affirmation',
      secondaryType: response.secondaryType || 'quality_time',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        primaryAnalysis.relationshipBenefits || 'Strong love expression skills',
        secondaryAnalysis.relationshipBenefits || 'Additional love language abilities'
      ].filter(Boolean),
      areasForGrowth: [
        primaryAnalysis.potentialMisunderstandings || 'Communication improvement areas',
        secondaryAnalysis.potentialMisunderstandings || 'Additional growth opportunities'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Love Style AI response
   */
  private parseLoveStyleAIResponse(response: any): TestResult {
    // Extract detailed analysis for dominant and secondary styles
    const dominantAnalysis = response.dominantStyleAnalysis || {};
    const secondaryAnalysis = response.secondaryStyleAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'love_style',
      scores: {}, // No scores needed for text-only display
      primaryType: response.dominantStyle || response.primaryType || 'secure',
      secondaryType: response.secondaryStyle || response.secondaryType || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        dominantAnalysis.strengths || 'Strong emotional foundation',
        secondaryAnalysis.strengths || 'Additional relationship skills'
      ].filter(Boolean),
      areasForGrowth: [
        dominantAnalysis.challenges || 'Personal development areas',
        secondaryAnalysis.challenges || 'Growth opportunities'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse Interpersonal AI response
   */
  private parseInterpersonalAIResponse(response: any): TestResult {
    // Extract detailed interpersonal analysis
    const interpersonalAnalysis = response.interpersonalAnalysis || {};
    
    return {
      sessionId: '',
      testType: 'interpersonal',
      scores: {}, // No scores needed for text-only display
      primaryType: response.communicationStyle || 'assertive',
      secondaryType: response.conflictResolution || '',
      interpretation: response.interpretation || '',
      recommendations: response.recommendations || [],
      strengths: [
        interpersonalAnalysis.communicationStrengths || 'Strong communication skills',
        interpersonalAnalysis.conflictStrengths || 'Effective conflict resolution',
        interpersonalAnalysis.emotionalStrengths || 'Good emotional intelligence'
      ].filter(Boolean),
      areasForGrowth: [
        interpersonalAnalysis.communicationGrowthAreas || 'Communication improvement areas',
        interpersonalAnalysis.conflictGrowthAreas || 'Conflict resolution development',
        interpersonalAnalysis.emotionalGrowthAreas || 'Emotional intelligence growth'
      ].filter(Boolean),
      relationshipAdvice: response.relationshipAdvice || [],
      summary: response.summary || '',
      completedAt: new Date().toISOString()
    };
  }


}

export const relationshipAIService = new RelationshipAIService(
  import.meta.env.VITE_DEEPSEEK_API_KEY || ''
);
