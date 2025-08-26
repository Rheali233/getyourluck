/**
 * Psychological Test AI Analysis Service
 * Uses DeepSeek AI to generate personalized test result analysis
 */

import type { 
  MBTIResult, 
  PHQ9Result, 
  EQResult, 
  HappinessResult,
  UserAnswer 
} from '../types';

export interface AIAnalysisRequest {
  testType: 'mbti' | 'phq9' | 'eq' | 'happiness';
  answers: UserAnswer[];
}

export interface AIAnalysisResponse {
  success: boolean;
  data?: MBTIResult | PHQ9Result | EQResult | HappinessResult;
  error?: string;
}

export class PsychologyAIService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
  }

  /**
   * Analyze MBTI test results
   */
  async analyzeMBTI(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildMBTIPrompt(answers, 'en');
      const response = await this.callDeepSeek(prompt);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: this.parseMBTIResponse(response.data)
        };
      }
      
      return {
        success: false,
        error: response.error || 'MBTI analysis failed'
      };
    } catch (error) {
      console.error('MBTI analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze PHQ-9 test results
   */
  async analyzePHQ9(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildPHQ9Prompt(answers, 'en');
      const response = await this.callDeepSeek(prompt);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: this.parsePHQ9Response(response.data)
        };
      }
      
      return {
        success: false,
        error: response.error || 'PHQ-9 analysis failed'
      };
    } catch (error) {
      console.error('PHQ-9 analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze emotional intelligence test results
   */
  async analyzeEQ(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildEQPrompt(answers, 'en');
      const response = await this.callDeepSeek(prompt);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: this.parseEQResponse(response.data)
        };
      }
      
      return {
        success: false,
        error: response.error || 'Emotional intelligence analysis failed'
      };
    } catch (error) {
      console.error('Emotional intelligence analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze happiness index test results
   */
  async analyzeHappiness(answers: UserAnswer[]): Promise<AIAnalysisResponse> {
    try {
      const prompt = this.buildHappinessPrompt(answers, 'en');
      const response = await this.callDeepSeek(prompt);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: this.parseHappinessResponse(response.data)
        };
      }
      
      return {
        success: false,
        error: response.error || 'Happiness index analysis failed'
      };
    } catch (error) {
      console.error('Happiness index analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Call DeepSeek API
   */
  private async callDeepSeek(prompt: string): Promise<{ success: boolean; data?: string; error?: string }> {
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
        return {
          success: true,
          data: data.choices[0].message.content
        };
      } else {
        return {
          success: false,
          error: 'API response format error'
        };
      }
    } catch (error) {
      console.error('DeepSeek API call error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API call failed'
      };
    }
  }

  /**
   * Build MBTI analysis prompt
   */
  private buildMBTIPrompt(answers: UserAnswer[], _language: 'zh' | 'en'): string {
    return `
You are a professional MBTI personality analysis expert. Please conduct a complete MBTI personality analysis based on the user's answer results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete MBTI analysis, including:

1. Score calculation for four dimensions (E/I, S/N, T/F, J/P)
2. Determine the specific type among the 16 personality types
3. Detailed description of personality characteristics
4. Detailed type interpretation (use warm and friendly language, combine daily life examples, vividly describe the characteristics, advantages and charm of this personality type, avoid academic expression)
5. Strength analysis (3-5, described in warm and encouraging language, avoid rigid academic expression)
6. Potential blind spot analysis (3-5, expressed in a friendly reminder manner, not too negative or rigid)
7. Suitable careers (3-5, only return career names, do not attach any explanation or reason)
  7. Performance analysis in different relationships:
   - Workplace performance: leadership style, team collaboration, decision-making methods
   - Family performance: family role, communication style, emotional expression
   - Friendship performance: friendship preferences, social patterns, support methods
   - Romantic performance: dating style, emotional needs, relationship patterns
  8. Relationship matching analysis with the other 15 MBTI types:
     - Provide specific matching reasons for each other type
     - Analyze according to two dimensions: "compatibility points" and "challenges":
       * Compatibility points: 2-3 brief descriptions of where both parties match well
       * Challenges: 1-2 brief descriptions of potential challenges or areas to pay attention to
     - The language of matching reasons must be friendly, warm, and easy to understand, avoiding academic and rigid expressions
     - Use examples and metaphors from daily life to explain matching reasons, maintaining a positive tone
     - Avoid repeating type names (such as "INTJ", "INTP", etc.), use more natural expressions
     - Match degree is classified according to the following standards:
       * Highly compatible: values align, easy to get along
       * Generally compatible: complementary but need adjustment
       * May have friction: significant differences in values and thinking

Requirements:
- Analysis based on standard MBTI theory
- Language must be friendly, warm, and easy to understand, avoiding academic and rigid expressions
- Use examples and metaphors from daily life to explain personality characteristics
- Maintain a positive tone, use encouraging language
- Avoid stereotypes and absolute statements
- Must return in strict JSON format, do not include any other text
- Ensure all property names use double quotes
- Do not use single quotes or unquoted property names
- Do not add any explanatory text before or after the JSON

Please return results in the following JSON format:
{
  "personalityType": "ENTP",
  "typeName": "Debater",
  "typeDescription": "Detailed description...",
  "detailedAnalysis": "Use warm and friendly language, combined with daily life examples, to vividly describe the characteristics, advantages, and charm of this personality type. For example: 'You are like a meticulous gardener, quietly cultivating the soil of real life, guarding every commitment with patience and persistence.' Avoid using theoretical terms like cognitive functions, behavioral patterns, etc., use specific metaphors and examples to describe.",
  "dimensions": [
    {
      "name": "Extraversion/Introversion",
      "leftLabel": "Extraversion (E)",
      "rightLabel": "Introversion (I)",
      "score": 53,
      "description": "Description..."
    }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "blindSpots": ["Potential blind spot 1", "Potential blind spot 2", "Potential blind spot 3"],
  "careerSuggestions": ["Accountant", "Project Manager", "Data Analyst"],
  "relationshipPerformance": {
    "workplace": {
      "leadershipStyle": "Leadership style description",
      "teamCollaboration": "Team collaboration method",
      "decisionMaking": "Decision-making method"
    },
    "family": {
      "role": "Family role",
      "communication": "Communication style",
      "emotionalExpression": "Emotional expression"
    },
    "friendship": {
      "preferences": "Friendship preferences",
      "socialPattern": "Social pattern",
      "supportStyle": "Support style"
    },
    "romance": {
      "datingStyle": "Dating style",
      "emotionalNeeds": "Emotional needs",
      "relationshipPattern": "Relationship pattern"
    }
  },
  "relationshipCompatibility": {
    "ENTJ": {
      "reasons": ["Compatibility: Both value responsibility, rules, and practical actions; life rhythms match.", "Challenges: Both tend to be conservative, may lack variety and freshness."]
    },
    "ENTP": {
        "reasons": ["Compatibility: Both pursue innovation and exploration; active thinking, good at problem analysis.", "Challenges: Different decision-making styles, one emphasizes planning, the other emphasizes flexibility."]
      },
      "ISFJ": {
        "reasons": ["Compatibility: Both focus on details and quality; similar values, value tradition.", "Challenges: Different communication styles, one direct, one tactful."]
      },
      "ISTP": {
        "reasons": ["Compatibility: Both practical and reliable, strong in action; prefer independent work.", "Challenges: Different emotional expression styles, need more understanding."]
      }
  }
}
`;
  }

  /**
   * Build PHQ-9 analysis prompt
   */
  private buildPHQ9Prompt(answers: UserAnswer[], _language: 'zh' | 'en'): string {
    return `
You are a professional mental health assessor. Please conduct a scientific analysis based on the user's PHQ-9 scale answer results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete PHQ-9 analysis, including:

1. Calculate total score according to standard PHQ-9 scoring method
2. Determine depression level assessment based on score range
3. Detailed analysis of each symptom dimension
4. Mental health status assessment and recommendations
5. Lifestyle improvement suggestions
6. Professional help suggestions (if applicable)

Requirements:
- Strictly follow PHQ-9 standards for assessment
- Language should be cautious, professional, and caring
- Avoid diagnostic language, emphasize screening nature
- Provide professional suggestions for high-risk users
- Maintain hope and positive tone

Please return results in the following JSON format:
{
  "totalScore": 8,
  "riskLevel": "mild",
  "riskLevelName": "Mild Depression",
  "riskDescription": "Description...",
  "symptoms": [
    {
      "name": "Symptom Name",
      "score": 2,
      "description": "Symptom description..."
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "professionalHelp": {
    "needed": false,
    "urgency": "low",
    "suggestions": ["Suggestion 1", "Suggestion 2"],
    "resources": []
  },
  "lifestyleTips": ["Lifestyle suggestion 1", "Suggestion 2", "Suggestion 3"],
  "followUpAdvice": "Follow-up advice..."
}
`;
  }

  /**
   * Build emotional intelligence analysis prompt
   */
  private buildEQPrompt(answers: UserAnswer[], _language: 'zh' | 'en'): string {
    return `
You are an emotional intelligence research expert. Please conduct a comprehensive analysis based on the user's emotional intelligence test answer results.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete emotional intelligence analysis, including:

1. Overall emotional intelligence score and level assessment
2. Sub-item analysis of five dimensions (self-awareness, self-management, motivation, empathy, social skills)
3. Emotional management ability assessment
4. Social skills and interpersonal relationship analysis
5. Specific suggestions and methods for emotional intelligence improvement
6. Practical guidance in daily life

Please return results in the following JSON format:
{
  "totalScore": 208,
  "maxScore": 250,
  "overallLevel": "advanced",
  "levelName": "Advanced EQ",
  "levelDescription": "Description...",
  "dimensions": [
    {
      "name": "Self-awareness",
      "score": 45,
      "maxScore": 50,
      "description": "Description...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvementAreas": ["Improvement area 1", "Improvement area 2"]
    },
    {
      "name": "Self-management",
      "score": 42,
      "maxScore": 50,
      "description": "Description...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvementAreas": ["Improvement area 1", "Improvement area 2"]
    },
    {
      "name": "Motivation",
      "score": 38,
      "maxScore": 50,
      "description": "Description...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvementAreas": ["Improvement area 1", "Improvement area 2"]
    },
    {
      "name": "Empathy",
      "score": 40,
      "maxScore": 50,
      "description": "Description...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvementAreas": ["Improvement area 1", "Improvement area 2"]
    },
    {
      "name": "Social Skills",
      "score": 43,
      "maxScore": 50,
      "description": "Description...",
      "strengths": ["Strength 1", "Strength 2"],
      "improvementAreas": ["Improvement area 1", "Improvement area 2"]
    }
  ],
  "overallAnalysis": "Overall analysis...",
  "improvementPlan": {
    "shortTerm": ["Short-term goal 1", "Short-term goal 2"],
    "longTerm": ["Long-term goal 1", "Long-term goal 2"],
    "dailyPractices": ["Daily practice 1", "Daily practice 2"]
  },
  "careerImplications": ["Career implication 1", "Career implication 2", "Career implication 3"],
  "relationshipInsights": ["Relationship insight 1", "Relationship insight 2", "Relationship insight 3"]
}
`;
  }

  /**
   * Build happiness index analysis prompt
   */
  private buildHappinessPrompt(answers: UserAnswer[], _language: 'zh' | 'en'): string {
    return `
      You are a professional positive psychology expert, specializing in PERMA model and happiness index assessment. Please conduct a comprehensive analysis based on the user's happiness index test answer results, using specific, life-close language.

User answer data:
${answers.map((answer, index) => `Question ${index + 1}: ${answer.answer}`).join('\n')}

Please provide a complete happiness index analysis, based on the five core dimensions of the PERMA model, using the warmest and most caring language:

      1. **Overall happiness index score and level assessment** (50-250 points, 5 levels)
       - Describe the user's happiness level in professional and friendly language
       - Avoid rigid numerical descriptions, use specific life scenarios and metaphors
       
      2. **Overall happiness analysis** (overallAnalysis field)
       - This is the main description text at the top of the page, should be concise and clear
       - Summarize the user's overall happiness status in gentle and friendly language
       - Avoid overly detailed analysis, maintain generality
       - Length controlled within 2-3 sentences, suitable as page opening

      3. **Detailed analysis of each dimension** (using the warmest, most specific, and most life-close language):
       - P (Positive emotion): optimism, gratitude, happiness frequency, enjoyment of life, etc.
       - E (Engagement): flow experience, concentration, challenge-skill matching, learning interest, etc.
       - R (Relationships): social support, sense of belonging, intimate relationships, social interaction, etc.
       - M (Meaning): sense of purpose, existential value, serving others, sense of mission, etc.
       - A (Accomplishment): goal achievement, sense of pride, return on effort, sense of control, etc.

      4. **Advantage areas and improvement space for happiness
       - Strength description: Use professional language like "excellent performance", "commendable" etc.
       - Improvement areas: Use constructive expressions like "can be further improved", "suggest focusing on" etc.

      5. **Scientific methods and suggestions to enhance happiness**
       - Use professional language like "suggest trying", "can consider" etc.
       - Combine with specific life scenarios, such as "when waking up in the morning", "during commute" etc.
       - Each suggestion must include specific time, location, action, and expected effect
       - Avoid abstract concepts, must be specific actions that can be executed immediately

      6. **Specific action plan for quality of life improvement**
       - Use constructive language like "starting today", "can be implemented gradually" etc.
       - Each suggestion must be specific and feasible, avoid abstract concepts
       - Must include specific steps, time schedule, and measurement criteria
       - Suggestions should target different life scenarios (work, family, social, personal growth)

      7. **Long-term Happiness Maintenance Strategies**
       - Use constructive language like "can plan for the future", "believe it can be achieved through effort"
       - Must include specific milestones, time nodes, and evaluation methods
       - Suggestions should cover multiple dimensions such as psychological, physical, social, and professional
       - Each long-term strategy must have corresponding short-term action steps

            Requirements:
       - Analyze based on PERMA positive psychology theory
       - Language should be professional, specific, friendly, and full of constructive suggestions
       - Avoid overly pretentious or overly academic expressions
       - Provide suggestions with specific time, place, and action
       - Use vivid metaphors and examples to explain concepts
       - Maintain a positive tone and express improvement suggestions in a professional way
       - Focus on life balance and overall happiness
       - Provide personalized analysis and suggestions for each dimension
       
      Special Requirements:
       - All suggestions must be specific and executable, containing clear time, place, action, and expected effects
       - Avoid abstract concepts like "maintain a positive mindset", "cultivate hobbies", etc., must be transformed into specific actions
       - Each suggestion must have clear execution steps and measurement criteria
       - Suggestions should provide diverse options for different life scenarios
       - Long-term strategies must have corresponding short-term action steps to ensure operability

Please return results in the following JSON format:
{
  "totalScore": 180,
  "maxScore": 250,
  "happinessLevel": "high",
  "levelName": "High Happiness",
  "levelDescription": "Your happiness index is at a high level with good performance across all five PERMA dimensions.",
  "domains": [
    {
      "name": "Positive Emotion",
      "score": 38,
      "maxScore": 50,
      "description": "You perform well in positive emotions, maintaining optimism and gratitude.",
      "currentStatus": "Positive emotions are stable, able to find beauty in life",
      "improvementAreas": ["Can increase frequency of positive emotion expression", "Cultivate more diverse sources of happiness"],
      "positiveAspects": ["Optimism", "Gratitude", "Emotional resilience"]
    },
    {
      "name": "Engagement",
      "score": 35,
      "maxScore": 50,
      "description": "You perform moderately in engagement, with certain focus and learning interest.",
      "currentStatus": "Able to engage in work, but flow experience can be improved",
      "improvementAreas": ["Improve focus", "Seek more flow experiences"],
      "positiveAspects": ["Learning interest", "Goal consistency", "Personal strengths utilization"]
    },
    {
      "name": "Relationships",
      "score": 42,
      "maxScore": 50,
      "description": "You perform excellently in relationships, with a good social support network.",
      "currentStatus": "Good social relationships, suggest deepening existing relationships",
      "improvementAreas": ["Can expand social circle", "Deepen existing relationships"],
      "positiveAspects": ["Social support", "Intimate relationships", "Social skills"]
    },
    {
      "name": "Meaning",
      "score": 33,
      "maxScore": 50,
      "description": "You perform moderately in meaning, with certain sense of purpose and values.",
      "currentStatus": "Has basic sense of purpose, but sense of mission can be strengthened",
      "improvementAreas": ["Clarify life mission", "Enhance service to others awareness"],
      "positiveAspects": ["Sense of purpose", "Values", "Sense of achievement"]
    },
    {
      "name": "Accomplishment",
      "score": 32,
      "maxScore": 50,
      "description": "You perform moderately in accomplishment, with certain goal achievement ability.",
      "currentStatus": "Able to complete basic goals, but self-efficacy can be improved",
      "improvementAreas": ["Improve self-efficacy", "Enhance resilience"],
      "positiveAspects": ["Goal achievement", "Effort reward", "Sense of progress"]
    }
  ],
  "overallAnalysis": "Based on your test results, your happiness index is at a medium level, with certain performance in all five PERMA dimensions. Through continuous effort and positive mindset adjustment, your happiness will be further improved.",
  "improvementPlan": {
    "immediate": [
      "After waking up every morning, spend 5 minutes recording 3 specific things you feel grateful for, such as: family's smile, sunlight through the window, a cup of hot tea",
      "Set a specific small goal for this week: give family a hug every day, or actively contact a friend to share happiness",
      "Actively contact a friend you haven't seen for a long time, share your recent small happiness, such as new skills learned or warm moments encountered"
    ],
    "shortTerm": [
      "Cultivate a new hobby: spend 3-4 hours per week learning new skills, such as painting, photography or cooking, to make life more colorful and fulfilling",
      "Create a monthly learning plan: choose a positive psychology book, read 30 minutes daily, and record 3 key takeaways",
      "Participate in community activities: join 2-3 community activities monthly, such as volunteer service, interest groups or knowledge sharing sessions, to expand social circle"
    ],
    "longTerm": [
      "Clarify life mission and values: reflect on life goals quarterly, create 3-5 year development plan, regularly evaluate and adjust",
      "Establish long-term career development plan: create career goal timeline, evaluate progress semi-annually, continuously learn new skills, seek development opportunities",
      "Cultivate deep relationships: invest time to build and maintain important relationships, regularly have deep conversations with friends and family, participate in community building"
    ],
    "dailyHabits": [
      "Morning gratitude practice: after getting up daily, say 3 positive things to yourself in the mirror, cultivate self-acceptance and confidence",
      "Focus work 25 minutes: use Pomodoro technique, focus work for 25 minutes, then rest 5 minutes, improve work efficiency and satisfaction",
      "Bedtime reflection summary: spend 10 minutes before sleep reviewing today's gains, record 3 things worth thanking, cultivate positive mindset"
    ]
  },
  "lifeBalanceAssessment": {
    "workLifeBalance": "Work-life balance is basically good, suggest increasing leisure time",
    "socialConnections": "Social relationships are good, suggest deepening existing relationships",
    "personalGrowth": "Personal growth has progress, suggest setting clearer goals",
    "healthWellness": "Physical and mental health condition is good, suggest increasing exercise frequency"
  },
  "gratitudePractices": ["Gratitude journal", "Thank you letter", "Gratitude meditation", "Gratitude walk"],
  "mindfulnessTips": ["Mindful breathing", "Body scan", "Mindful eating", "Mindful walking"],
  "communityEngagement": ["Participate in volunteer service", "Join interest groups", "Community activity participation", "Knowledge sharing"]
}
`;
  }

  /**
   * Parse MBTI AI response
   */
  private parseMBTIResponse(aiResponse: string): MBTIResult {
    try {
      // Debug information (commented out in production)
// console.log('AI raw response:', aiResponse);
      
      // Try multiple methods to extract JSON
      let jsonString = '';
      
      // Method 1: Try to match complete JSON object
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
        // console.log('Extracted JSON string:', jsonString);
        
        // Try to clean and fix common JSON issues
        jsonString = this.cleanJSONString(jsonString);
        
        const parsed = JSON.parse(jsonString);
        // console.log('Parsed successfully:', parsed);
        return this.validateMBTIResult(parsed);
      }
      
      // Method 2: If first method fails, try to find JSON start and end
      const startIndex = aiResponse.indexOf('{');
      const endIndex = aiResponse.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonString = aiResponse.substring(startIndex, endIndex + 1);
        // console.log('Method 2 extracted JSON:', jsonString);
        
        jsonString = this.cleanJSONString(jsonString);
        const parsed = JSON.parse(jsonString);
        // console.log('Method 2 parsed successfully:', parsed);
        return this.validateMBTIResult(parsed);
      }
      
      console.warn('Unable to extract JSON, returning default result');
      return this.getDefaultMBTIResult();
      
    } catch (error) {
      console.error('MBTI response parsing failed:', error);
      console.error('Original response:', aiResponse);
      return this.getDefaultMBTIResult();
    }
  }

  /**
   * Parse PHQ-9 AI response
   */
  private parsePHQ9Response(aiResponse: string): PHQ9Result {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validatePHQ9Result(parsed);
      }
      
      return this.getDefaultPHQ9Result();
    } catch (error) {
      console.error('PHQ-9 response parsing failed:', error);
      return this.getDefaultPHQ9Result();
    }
  }

  /**
   * Parse emotional intelligence AI response
   */
  private parseEQResponse(aiResponse: string): EQResult {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateEQResult(parsed);
      }
      
      return this.getDefaultEQResult();
    } catch (error) {
      console.error('EQ response parsing failed:', error);
      return this.getDefaultEQResult();
    }
  }

  /**
   * Parse happiness index AI response
   */
  private parseHappinessResponse(aiResponse: string): HappinessResult {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateHappinessResult(parsed);
      }
      
      return this.getDefaultHappinessResult();
    } catch (error) {
      console.error('Happiness index response parsing failed:', error);
      return this.getDefaultHappinessResult();
    }
  }

  /**
   * Clean and fix common issues in JSON strings
   */
  private cleanJSONString(jsonString: string): string {
    try {
      // Remove potential markdown code block markers
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      
      // Fix common JSON formatting issues
      jsonString = jsonString
        // Fix single quotes
        .replace(/'/g, '"')
        // Fix unquoted property names
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix newlines and tabs
        .replace(/[\n\r\t]/g, ' ')
        // Clean up extra spaces
        .replace(/\s+/g, ' ')
        .trim();
      
      // console.log('Cleaned JSON:', jsonString);
      return jsonString;
    } catch (error) {
      console.error('JSON cleaning failed:', error);
      return jsonString;
    }
  }

  // Validation and default result methods will be implemented later...
  private validateMBTIResult(result: any): MBTIResult {
    // Validate MBTI result validity, ensure all required fields exist
    const validated: MBTIResult = {
      personalityType: result.personalityType || 'INTJ',
      typeName: result.typeName || 'Architect',
      typeDescription: result.typeDescription || 'MBTI personality type analysis result',
      detailedAnalysis: result.detailedAnalysis || 'Detailed personality analysis based on MBTI theory',
      dimensions: Array.isArray(result.dimensions) ? result.dimensions : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : ['Strong analytical ability', 'Clear goal orientation', 'Strong independence'],
      blindSpots: Array.isArray(result.blindSpots) ? result.blindSpots : ['May be too perfectionistic', 'Emotional expression needs improvement', 'Flexibility needs enhancement'],
      careerSuggestions: Array.isArray(result.careerSuggestions) && result.careerSuggestions.length > 0 
        ? result.careerSuggestions 
        : ['Data Analyst', 'Project Manager', 'Systems Analyst'],
      relationshipPerformance: {
        workplace: {
          leadershipStyle: result.relationshipPerformance?.workplace?.leadershipStyle || 'Goal-oriented leadership',
          teamCollaboration: result.relationshipPerformance?.workplace?.teamCollaboration || 'Efficiency-focused collaboration',
          decisionMaking: result.relationshipPerformance?.workplace?.decisionMaking || 'Logic-based decision making'
        },
        family: {
          role: result.relationshipPerformance?.family?.role || 'Responsibility bearer',
          communication: result.relationshipPerformance?.family?.communication || 'Direct and effective communication',
          emotionalExpression: result.relationshipPerformance?.family?.emotionalExpression || 'Expressing care through actions'
        },
        friendship: {
          preferences: result.relationshipPerformance?.friendship?.preferences || 'Deep friendships',
          socialPattern: result.relationshipPerformance?.friendship?.socialPattern || 'Small circle socializing',
          supportStyle: result.relationshipPerformance?.friendship?.supportStyle || 'Practical assistance'
        },
        romance: {
          datingStyle: result.relationshipPerformance?.romance?.datingStyle || 'Serious and responsible',
          emotionalNeeds: result.relationshipPerformance?.romance?.emotionalNeeds || 'Stable and reliable',
          relationshipPattern: result.relationshipPerformance?.romance?.relationshipPattern || 'Long-term commitment'
        }
      },
      relationshipCompatibility: result.relationshipCompatibility || {}
    };

    return validated;
  }

  private validatePHQ9Result(result: any): PHQ9Result {
    return result as PHQ9Result;
  }

  private validateEQResult(result: any): EQResult {
    return result as EQResult;
  }

  private validateHappinessResult(result: any): HappinessResult {
    // Validate happiness index result basic structure
    const validated: HappinessResult = {
      totalScore: this.validateNumber(result.totalScore, 50, 250, 150),
      maxScore: this.validateNumber(result.maxScore, 250, 250, 250),
      happinessLevel: this.validateHappinessLevel(result.happinessLevel),
      levelName: result.levelName || 'Moderate Happiness',
      levelDescription: result.levelDescription || 'Your happiness index analysis results',
      domains: this.validateHappinessDomains(result.domains),
      overallAnalysis: result.overallAnalysis || 'Happiness index analysis based on PERMA model',
      improvementPlan: this.validateImprovementPlan(result.improvementPlan),
      lifeBalanceAssessment: this.validateLifeBalanceAssessment(result.lifeBalanceAssessment),
      gratitudePractices: this.validateStringArray(result.gratitudePractices),
      mindfulnessTips: this.validateStringArray(result.mindfulnessTips),
      communityEngagement: this.validateStringArray(result.communityEngagement)
    };

    return validated;
  }

  private validateHappinessLevel(level: any): 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' {
    const validLevels = ['very_low', 'low', 'moderate', 'high', 'very_high'] as const;
    return validLevels.includes(level as any) ? level : 'moderate';
  }

  private validateHappinessDomains(domains: any[]): any[] {
    if (!Array.isArray(domains) || domains.length === 0) {
      return [];
    }

    return domains.map(domain => ({
      name: domain.name || 'Unknown Dimension',
      score: this.validateNumber(domain.score, 0, 50, 30),
      maxScore: this.validateNumber(domain.maxScore, 50, 50, 50),
      description: domain.description || 'Performance analysis of this dimension',
      currentStatus: domain.currentStatus || 'Current status analysis',
      improvementAreas: this.validateStringArray(domain.improvementAreas),
      positiveAspects: this.validateStringArray(domain.positiveAspects)
    }));
  }

  private validateImprovementPlan(plan: any): any {
    if (!plan) {
      return {
        immediate: [],
        shortTerm: [],
        longTerm: [],
        dailyHabits: []
      };
    }

    return {
      immediate: this.validateStringArray(plan.immediate),
      shortTerm: this.validateStringArray(plan.shortTerm),
      longTerm: this.validateStringArray(plan.longTerm),
      dailyHabits: this.validateStringArray(plan.dailyHabits)
    };
  }

  private validateLifeBalanceAssessment(assessment: any): any {
    if (!assessment) {
      return {
        workLifeBalance: 'Work-life balance assessment',
        socialConnections: 'Social connections assessment',
        personalGrowth: 'Personal growth assessment',
        healthWellness: 'Health and wellness assessment'
      };
    }

    return {
      workLifeBalance: assessment.workLifeBalance || 'Work-life balance assessment',
      socialConnections: assessment.socialConnections || 'Social connections assessment',
      personalGrowth: assessment.personalGrowth || 'Personal growth assessment',
      healthWellness: assessment.healthWellness || 'Health and wellness assessment'
    };
  }

  private validateNumber(value: any, min: number, max: number, defaultValue: number): number {
    const num = Number(value);
    if (isNaN(num) || num < min || num > max) {
      return defaultValue;
    }
    return num;
  }

  private validateStringArray(value: any): string[] {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter(item => typeof item === 'string' && item.trim() !== '');
  }

  private getDefaultMBTIResult(): MBTIResult {
    // Return default MBTI result
    return {
      personalityType: 'INTJ',
      typeName: 'Architect',
      typeDescription: 'Default MBTI Analysis',
      detailedAnalysis: 'Default detailed analysis based on MBTI theory',
      dimensions: [],
      strengths: [],
      blindSpots: [],
      careerSuggestions: [],
      relationshipPerformance: {
        workplace: {
          leadershipStyle: 'Default Workplace Performance',
          teamCollaboration: 'Default Team Collaboration',
          decisionMaking: 'Default Decision Making'
        },
        family: {
          role: 'Default Family Role',
          communication: 'Default Communication Style',
          emotionalExpression: 'Default Emotional Expression'
        },
        friendship: {
          preferences: 'Default Friendship Preferences',
          socialPattern: 'Default Social Pattern',
          supportStyle: 'Default Support Style'
        },
        romance: {
          datingStyle: 'Default Dating Style',
          emotionalNeeds: 'Default Emotional Needs',
          relationshipPattern: 'Default Relationship Pattern'
        }
      },
      relationshipCompatibility: {
        'ENTJ': {
          reasons: ['Cognitive function complementarity', 'Goal-oriented execution']
        },
        'ENFP': {
          reasons: ['Innovative thinking', 'Emotional resonance']
        }
      }
    };
  }

  private getDefaultPHQ9Result(): PHQ9Result {
    return {
      totalScore: 0,
      riskLevel: 'minimal',
      riskLevelName: 'No Depression',
      riskDescription: 'Default PHQ-9 Analysis',
      symptoms: [],
      recommendations: [],
      professionalHelp: {
        needed: false,
        urgency: 'low',
        suggestions: [],
        resources: []
      },
      lifestyleTips: [],
      followUpAdvice: ''
    };
  }

  private getDefaultEQResult(): EQResult {
    return {
      totalScore: 200,
      maxScore: 250,
      overallLevel: 'intermediate',
      levelName: 'Intermediate EQ',
      levelDescription: 'Your EQ level is in the moderate range, showing balanced performance across the five core dimensions with good development potential.',
      dimensions: [
        {
          name: 'Self-Awareness',
          score: 40,
          maxScore: 50,
          description: 'Good self-awareness',
          strengths: [
            'Good emotion recognition',
            'Aware of strengths and weaknesses'
          ],
          improvementAreas: [
            'Can understand emotion causes better',
            'Increase self-reflection frequency'
          ]
        },
        {
          name: 'Self-Regulation',
          score: 38,
          maxScore: 50,
          description: 'Some self-regulation ability',
          strengths: [
            'Basic emotion control',
            'Some stress coping ability'
          ],
          improvementAreas: [
            'Need better impulse control',
            'Can improve emotional recovery speed'
          ]
        },
        {
          name: 'Motivation',
          score: 42,
          maxScore: 50,
          description: 'Strong internal motivation',
          strengths: [
            'Strong intrinsic motivation',
            'Clear goal orientation'
          ],
          improvementAreas: [
            'Can improve persistence',
            'Can strengthen resilience to setbacks'
          ]
        },
        {
          name: 'Empathy',
          score: 40,
          maxScore: 50,
          description: 'Good empathy ability',
          strengths: [
            'Good emotion perception',
            'Care about others feelings'
          ],
          improvementAreas: [
            'Can better identify emotional signals',
            'Improve appropriateness of emotional responses'
          ]
        },
        {
          name: 'Social Skills',
          score: 40,
          maxScore: 50,
          description: 'Good social skills',
          strengths: [
            'Good communication skills',
            'Strong teamwork awareness'
          ],
          improvementAreas: [
            'Can improve influence',
            'Conflict resolution skills need improvement'
          ]
        }
      ],
      overallAnalysis: 'Good overall EQ level with solid foundation across all dimensions.',
      improvementPlan: {
        shortTerm: [
          'Daily 10-minute emotion awareness practice',
          'Learn basic emotion regulation techniques',
          'Actively listen to others emotional expressions'
        ],
        longTerm: [
          'Establish comprehensive stress management system',
          'Develop deeper empathy abilities',
          'Improve relationship quality'
        ],
        dailyPractices: [
          'Emotion journaling',
          'Deep breathing exercises',
          'Active communication practice'
        ]
      },
      careerImplications: [
        'Suitable for collaborative work environments',
        'Can excel in goal-oriented positions',
        'Communication skills aid career development'
      ],
      relationshipInsights: [
        'Genuine and friendly in relationships',
        'Can understand others emotional needs',
        'Recommend more practice in conflict resolution'
      ]
    };
  }

  private getDefaultHappinessResult(): HappinessResult {
    return {
      totalScore: 150,
      maxScore: 250,
      happinessLevel: 'moderate',
      levelName: 'Moderate Happiness',
             levelDescription: 'Your happiness index is at a moderate level with some performance across all five PERMA dimensions. Through continuous effort and positive mindset adjustments, your happiness will improve significantly.',
      domains: [
        {
          name: 'Positive Emotion',
          score: 30,
          maxScore: 50,
          description: 'You show moderate performance in positive emotions with basic optimism.',
          currentStatus: 'Positive emotions are generally stable',
          improvementAreas: [
            'Can increase frequency of positive emotion expression',
            'Cultivate more diverse sources of happiness'
          ],
          positiveAspects: [
            'Optimism',
            'Gratitude',
            'Emotional resilience'
          ]
        },
        {
          name: 'Engagement',
          score: 28,
          maxScore: 50,
          description: 'You show moderate engagement with some focus and learning interest.',
          currentStatus: 'Can engage in work but flow experience can be improved',
          improvementAreas: [
            'Improve focus',
            'Seek more flow experiences'
          ],
          positiveAspects: [
            'Learning interest',
            'Goal alignment',
            'Personal strengths utilization'
          ]
        },
        {
          name: 'Relationships',
          score: 32,
          maxScore: 50,
          description: 'You show good performance in relationships with basic social support network.',
          currentStatus: 'Interpersonal relationships are generally harmonious',
          improvementAreas: [
            'Can expand social circle',
            'Deepen existing relationships'
          ],
          positiveAspects: [
            'Social support',
            'Intimate relationships',
            'Social skills'
          ]
        },
        {
          name: 'Meaning',
          score: 25,
          maxScore: 50,
          description: 'You show moderate sense of meaning with some goal orientation and values.',
          currentStatus: 'Has basic goal orientation but mission can be strengthened',
          improvementAreas: [
            'Clarify life mission',
            'Enhance awareness of serving others'
          ],
          positiveAspects: [
            'Goal orientation',
            'Values',
            'Sense of achievement'
          ]
        },
        {
          name: 'Accomplishment',
          score: 35,
          maxScore: 50,
          description: 'You show good performance in achievement with some goal attainment ability.',
          currentStatus: 'Can complete basic goals but self-efficacy can be improved',
          improvementAreas: [
            'Improve self-efficacy',
            'Enhance resilience'
          ],
          positiveAspects: [
            'Goal achievement',
            'Effort reward',
            'Sense of progress'
          ]
        }
      ],
             overallAnalysis: 'Overall, you are a person with moderate happiness, which is already great! In relationships and achievement, you perform excellently, providing you with warm emotional support and a sense of accomplishment. In positive emotions, engagement, and meaning, there is still room for improvement. You can further enhance your overall happiness by cultivating gratitude, seeking flow experiences, and clarifying your life mission.',
      improvementPlan: {
          immediate: [
            'When you wake up in the morning, record 3 small things that make you feel grateful',
            'Set a warm small goal for this week, such as giving your family a hug',
            'Actively contact a friend you haven\'t seen for a while, share your recent little joys'
          ],
          shortTerm: [
            'Cultivate a new hobby',
            'Create monthly learning plan',
            'Participate in community activities'
          ],
          longTerm: [
            'Clarify life mission and values',
            'Establish long-term career development plan',
            'Develop deep thinking habits'
          ],
          dailyHabits: [
            'Morning gratitude practice',
            'Focus on work for 25 minutes',
            'Evening reflection and summary'
          ]
        },
      lifeBalanceAssessment: {
         workLifeBalance: 'Work-life balance is generally good, consider adding leisure time',
         socialConnections: 'Social relationships are good, consider deepening existing ones',
         personalGrowth: 'Personal growth is progressing, consider setting clearer goals',
         healthWellness: 'Physical and mental health is good, consider increasing exercise frequency'
       },
      gratitudePractices: [
         'Gratitude journal',
         'Thank you letter',
         'Gratitude meditation',
         'Gratitude walk'
       ],
      mindfulnessTips: [
         'Mindful breathing',
         'Body scan',
         'Mindful eating',
         'Mindful walking'
       ],
      communityEngagement: [
         'Participate in volunteer service',
         'Join interest groups',
         'Community activity participation',
         'Knowledge sharing'
       ]
    };
  }
}

// Create service instance
export const psychologyAIService = new PsychologyAIService(
  import.meta.env.VITE_DEEPSEEK_API_KEY || ''
);
