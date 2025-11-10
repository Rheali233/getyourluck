/**
 * 统一Prompt构建器
 * 确保所有测试类型使用一致的语言风格、格式和角色定义
 */

export interface UserAnswer {
  questionId: string;
  answer: string | number;
  score?: number;
}

export interface TestContext {
  testType: string;
  language?: string;
  userId?: string;
  sessionId?: string;
}

export interface PromptConfig {
  testType: string;
  theory?: string;
  description?: string;
  instructions?: string[];
  schema: any;
  specialRequirements?: string[];
}

export class UnifiedPromptBuilder {
  // 统一的系统角色定义
  private static readonly UNIFIED_SYSTEM_ROLE = "You are a warm, supportive, and professional psychological and career assessment analyst. Use gentle, encouraging language that acknowledges the person's courage in taking assessments while providing professional insights. Always maintain a hopeful and understanding tone. Provide analysis in English only.";

  // 统一的prompt开头模板
  private static readonly UNIFIED_PROMPT_TEMPLATE = `Please analyze the following {testType} test answers{theoryContext} and provide a warm, supportive, and comprehensive assessment in JSON format. Use a gentle, encouraging tone that acknowledges the person's courage in taking this assessment while providing professional insights.

Test Context: {testType}, Language: {language}

Answers:
{answers}

{specialInstructions}

Please provide your analysis in the following JSON format:
{schema}

IMPORTANT INSTRUCTIONS:
1. Return ONLY a valid JSON object that matches the schema below
2. Do not include any prose, markdown, or code fences
3. Ensure every field is present and non-empty
4. Base all content on the provided answers
5. Use warm, supportive language while maintaining professional accuracy
6. Provide personalized interpretations based on actual responses

Rules:
1) Output ONLY the JSON object, no extra text.
2) Ensure every field is present and non-empty.
3) Base content on the provided answers.
4) Use warm, encouraging language throughout.`;

  // 测试类型配置
  private static readonly TEST_CONFIGS: Record<string, PromptConfig> = {
    mbti: {
      testType: "MBTI",
      theory: "Jung's cognitive functions",
      description: "personality assessment",
      instructions: [
        "Analyze based on cognitive function stack and behavioral patterns",
        "Provide detailed relationship performance analysis",
        "Include career suggestions based on personality type",
        "CRITICAL: For relationshipCompatibility, analyze ALL 15 other MBTI types and group them into three categories: highlyCompatible (4-6 types), moderatelyCompatible (4-6 types), and potentiallyChallenging (3-7 types) based on MBTI compatibility theory",
        "Each compatibility entry must include type, name, and reasons array with 2-4 specific compatibility factors"
      ],
      schema: {
        type: "INTJ",
        personalityType: "INTJ",
        typeName: "The Architect",
        typeDescription: "Comprehensive description of the personality type based on cognitive functions",
        detailedAnalysis: "Detailed analysis of the personality type including cognitive function stack and behavioral patterns",
        dimensions: [
          {
            name: "Extraversion vs Introversion",
            leftLabel: "E",
            rightLabel: "I",
            score: 20,
            description: "Energy source preference - whether you gain energy from external world (E) or internal world (I)"
          },
          {
            name: "Sensing vs Intuition",
            leftLabel: "S",
            rightLabel: "N",
            score: 18,
            description: "Information processing preference - whether you focus on concrete details (S) or abstract possibilities (N)"
          },
          {
            name: "Thinking vs Feeling",
            leftLabel: "T",
            rightLabel: "F",
            score: 22,
            description: "Decision-making preference - whether you prioritize logic and objectivity (T) or values and harmony (F)"
          },
          {
            name: "Judging vs Perceiving",
            leftLabel: "J",
            rightLabel: "P",
            score: 19,
            description: "Lifestyle preference - whether you prefer structure and closure (J) or flexibility and openness (P)"
          }
        ],
        strengths: ["Specific personality strengths based on cognitive functions and behavioral patterns"],
        blindSpots: ["Specific blind spots and areas for development based on personality type"],
        careerSuggestions: ["Specific career recommendations based on personality type and cognitive preferences"],
        relationshipPerformance: {
          workplace: {
            leadershipStyle: "Specific leadership approach and management style",
            teamCollaboration: "How this type works in teams and collaborative environments",
            decisionMaking: "Decision-making process and approach to problem-solving"
          },
          family: {
            role: "Typical family role and responsibilities",
            communication: "Communication style and preferences in family settings",
            emotionalExpression: "How emotions are expressed and handled in family relationships"
          },
          friendship: {
            preferences: "Friendship preferences and social needs",
            socialPattern: "Social behavior patterns and interaction style",
            supportStyle: "How this type provides and receives support in friendships"
          },
          romance: {
            datingStyle: "Approach to dating and romantic relationships",
            emotionalNeeds: "Emotional needs and expression in romantic relationships",
            relationshipPattern: "Typical relationship patterns and dynamics"
          }
        },
        relationshipCompatibility: {
          highlyCompatible: [
            {
              type: "INFP",
              name: "Mediator", 
              reasons: ["Specific compatibility factors with INFP type"]
            },
            {
              type: "ENFJ",
              name: "Protagonist",
              reasons: ["Specific compatibility factors with ENFJ type"]
            }
          ],
          moderatelyCompatible: [
            {
              type: "ENTP", 
              name: "Debater",
              reasons: ["Specific compatibility factors with ENTP type"]
            },
            {
              type: "INFJ",
              name: "Advocate", 
              reasons: ["Specific compatibility factors with INFJ type"]
            }
          ],
          potentiallyChallenging: [
            {
              type: "ISTJ",
              name: "Logistician",
              reasons: ["Specific compatibility factors with ISTJ type"]
            },
            {
              type: "ESTJ", 
              name: "Executive",
              reasons: ["Specific compatibility factors with ESTJ type"]
            }
          ]
        }
      }
    },
    phq9: {
      testType: "PHQ-9",
      theory: "depression screening",
      description: "depression screening test",
      instructions: [
        "Calculate totalScore from the sum of all answer values (0-3 scale)",
        "Use actual scores from each question, not example values",
        "Provide personalized interpretations based on the actual symptom pattern",
        "Use warm, supportive language while maintaining clinical accuracy"
      ],
      specialRequirements: [
        "Focus on clinical accuracy and evidence-based recommendations",
        "Provide specific actionable lifestyle interventions",
        "Include physical and psychological analysis"
      ],
      schema: {
        totalScore: "[calculated from sum of all answers]",
        severity: "[minimal/mild/moderate/moderately_severe/severe based on total score]",
        riskLevel: "[low/moderate/high based on total score and symptom pattern]",
        riskLevelName: "[descriptive name based on severity]",
        riskDescription: "[personalized description based on actual scores and symptoms]",
        lifestyleInterventions: {
          sleepHygiene: "specific actionable tips for sleep improvement (as a single string, not array)",
          physicalActivity: "specific actionable exercise recommendations (as a single string, not array)",
          nutrition: "specific dietary recommendations (as a single string, not array)",
          socialSupport: "specific actionable social connection strategies (as a single string, not array)"
        },
        followUpAdvice: "personalized follow-up advice based on overall assessment",
        physicalAnalysis: "professional analysis of physical manifestations of depression, focusing on how physical symptoms relate to emotional state and daily functioning, written in warm and supportive tone",
        psychologicalAnalysis: "professional analysis of psychological patterns and emotional experiences, focusing on cognitive and emotional aspects of depression, written in warm and supportive tone"
      }
    },
    eq: {
      testType: "EQ",
      theory: "Goleman's four core dimensions",
      description: "emotional intelligence assessment",
      instructions: [
        "Analyze emotional intelligence based on Goleman's 4 core dimensions: Self-Awareness, Self-Management, Social Awareness, and Relationship Management.",
        "Provide qualitative assessment and recommendations based on the answer patterns and responses.",
        "Focus on behavioral patterns, emotional responses, and interpersonal dynamics revealed in the answers.",
        "Write in warm, encouraging English, personalized to the provided answers."
      ],
      schema: {
        overallLevel: "[Needs Improvement/Average/Good/Very Good/Excellent based on overall emotional intelligence patterns]",
        levelName: "[Use the exact same value as overallLevel: Needs Improvement/Average/Good/Very Good/Excellent]",
        overallAnalysis: "[personalized overall analysis of emotional intelligence patterns, at least 300 characters]",
        dimensions: [
          {
            name: "Self-Awareness",
            level: "[Needs Improvement/Average/Good/Very Good/Excellent based on self-awareness patterns]",
            description: "[at least 120 characters personalized analysis of self-awareness based on answers]",
            strengths: ["[2-4 specific self-awareness strengths observed in responses]"]
          },
          {
            name: "Self-Management", 
            level: "[Needs Improvement/Average/Good/Very Good/Excellent based on self-management patterns]",
            description: "[at least 120 characters personalized analysis of self-management based on answers]",
            strengths: ["[2-4 specific self-management strengths observed in responses]"]
          },
          {
            name: "Social Awareness",
            level: "[Needs Improvement/Average/Good/Very Good/Excellent based on social awareness patterns]", 
            description: "[at least 120 characters personalized analysis of social awareness based on answers]",
            strengths: ["[2-4 specific social awareness strengths observed in responses]"]
          },
          {
            name: "Relationship Management",
            level: "[Needs Improvement/Average/Good/Very Good/Excellent based on relationship management patterns]",
            description: "[at least 120 characters personalized analysis of relationship management based on answers]",
            strengths: ["[2-4 specific relationship management strengths observed in responses]"]
          }
        ],
        improvementPlan: {
          shortTerm: ["[3-5 actionable short-term emotional intelligence development items]"],
          longTerm: ["[3-5 actionable long-term emotional intelligence strategies]"],
          dailyPractices: ["[5-7 practical daily practices for emotional intelligence development]"]
        }
      },
      specialRequirements: [
        "CRITICAL: Analyze based on Goleman's 4 core dimensions of emotional intelligence",
        "CRITICAL: Focus on qualitative patterns and behavioral indicators in the answers",
        "CRITICAL: Include all 4 dimensions in the dimensions array with level, description (>=120 chars) and strengths (2-4 items)",
        "CRITICAL: improvementPlan must include shortTerm, longTerm and dailyPractices arrays with required item counts",
        "CRITICAL: levelName must use the exact same standardized values as overallLevel: Needs Improvement/Average/Good/Very Good/Excellent",
        "CRITICAL: Base analysis on emotional intelligence theory and observed patterns, not numerical calculations",
        "Output must be valid JSON matching the schema exactly - no additional text outside JSON",
        "If any required field is missing, the response will be rejected as incomplete"
      ]
    },
    happiness: {
      testType: "Happiness Index",
      theory: "Seligman's PERMA model",
      description: "happiness and well-being assessment",
      instructions: [
        "You MUST NOT calculate scores. Scores and levels are computed by the system.",
        "Provide ONLY textual analysis and recommendations based on Seligman's PERMA model.",
        "Write in warm, encouraging English, personalized to the provided answers."
      ],
      schema: {
        overallAnalysis: "[personalized overall analysis, at least 300 characters]",
        domains: [
          {
            name: "Positive Emotions",
            score: 0,
            maxScore: 20,
            description: "[at least 120 characters personalized analysis for this dimension]",
            currentStatus: "[current status analysis for this dimension]",
            improvementAreas: ["[2-4 specific improvement areas]"],
            positiveAspects: ["[2-4 specific strengths]"]
          },
          {
            name: "Engagement",
            score: 0,
            maxScore: 20,
            description: "[at least 120 characters personalized analysis for this dimension]",
            currentStatus: "[current status analysis for this dimension]",
            improvementAreas: ["[2-4 specific improvement areas]"],
            positiveAspects: ["[2-4 specific strengths]"]
          },
          {
            name: "Relationships",
            score: 0,
            maxScore: 20,
            description: "[at least 120 characters personalized analysis for this dimension]",
            currentStatus: "[current status analysis for this dimension]",
            improvementAreas: ["[2-4 specific improvement areas]"],
            positiveAspects: ["[2-4 specific strengths]"]
          },
          {
            name: "Meaning",
            score: 0,
            maxScore: 20,
            description: "[at least 120 characters personalized analysis for this dimension]",
            currentStatus: "[current status analysis for this dimension]",
            improvementAreas: ["[2-4 specific improvement areas]"],
            positiveAspects: ["[2-4 specific strengths]"]
          },
          {
            name: "Accomplishment",
            score: 0,
            maxScore: 20,
            description: "[at least 120 characters personalized analysis for this dimension]",
            currentStatus: "[current status analysis for this dimension]",
            improvementAreas: ["[2-4 specific improvement areas]"],
            positiveAspects: ["[2-4 specific strengths]"]
          }
        ],
        improvementPlan: {
          immediate: ["[3-5 actionable immediate actions]"],
          shortTerm: ["[3-5 actionable short-term strategies]"],
          longTerm: ["[3-5 actionable long-term strategies]"],
          dailyHabits: ["[5-7 practical daily habits]"]
        }
      },
      specialRequirements: [
        "CRITICAL: Do NOT output any numeric scores. Only textual analysis is allowed.",
        "CRITICAL: Include all 5 domains under domains array: Positive Emotions, Engagement, Relationships, Meaning, Accomplishment",
        "CRITICAL: Each domain must include name, description (>=120 chars), currentStatus, improvementAreas (2-4 items), and positiveAspects (2-4 items)",
        "CRITICAL: improvementPlan must include immediate, shortTerm, longTerm and dailyHabits arrays with required item counts",
        "Output must be valid JSON matching the schema exactly - no additional text outside JSON",
        "If any required field is missing, the response will be rejected as incomplete"
      ]
    },
    loveLanguage: {
      testType: "Love Language",
      theory: "Gary Chapman's Five Love Languages theory",
      description: "love language preferences assessment",
      instructions: [
        "Analyze based on Chapman's Five Love Languages theory",
        "Provide practical relationship applications",
        "For each of the five dimensions, write one concise interpretation paragraph in loveLanguageDetails[dimension].description (2–3 sentences, concrete, no generic phrases)"
      ],
      specialRequirements: [
        "Return loveLanguageDetails for ALL five dimensions: Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch",
        "Each loveLanguageDetails[dimension].description must be 2–3 sentences (~50–80 words), specific and contextual; avoid placeholders like 'Basic guidance...' or vague lines like 'Feeling loved...'",
        "Descriptions must be consistent with allScores; do not contradict the score ordering",
        "Do NOT use rank labels or phrases like 'highest scores', 'your secondary love language', 'top two'; write neutral, dimension-focused interpretations",
        "Output valid JSON only, no extra commentary"
      ],
      schema: {
        primaryLanguage: "Words of Affirmation",
        secondaryLanguage: "Quality Time",
        analysis: "Brief analysis of love language preferences (2-3 sentences)",
        primaryScore: 25,
        secondaryScore: 20,
        allScores: {
          "Words of Affirmation": 25,
          "Quality Time": 20,
          "Receiving Gifts": 15,
          "Acts of Service": 12,
          "Physical Touch": 8
        },
        loveLanguageDetails: {
          "Words of Affirmation": {
            description: "Brief interpretation (2-3 sentences)"
          },
          "Quality Time": {
            description: "Brief interpretation (2-3 sentences)"
          },
          "Receiving Gifts": {
            description: "Brief interpretation (2-3 sentences)"
          },
          "Acts of Service": {
            description: "Brief interpretation (2-3 sentences)"
          },
          "Physical Touch": {
            description: "Brief interpretation (2-3 sentences)"
          }
        },
        communicationTips: ["2-3 specific communication strategies"],
        giftSuggestions: ["2-3 specific gift ideas"],
        partnerGuidance: ["2-3 specific guidance items"]
      }
    },
    loveStyle: {
      testType: "Love Style",
      theory: "John Alan Lee's six love styles theory",
      description: "comprehensive love style assessment with psychological profiling",
      instructions: [
        "Analyze based on John Alan Lee's six love styles theory with deep psychological insights",
        "Provide comprehensive psychological profile including attachment patterns and emotional expression",
        "Include developmental background influences and cultural factors affecting love style",
        "Analyze relationship dynamics including power balance, boundary setting, and conflict patterns",
        "Provide predictive insights for different relationship scenarios and compatibility analysis",
        "Include specific intervention strategies and growth pathways for relationship improvement",
        "For each of the six love styles (Eros, Ludus, Storge, Pragma, Mania, Agape), write interpretation in loveStyleDetails[style].description (≤100 words, focused on current alignment level)",
        "Map percentage to fixed preference intensity labels: 0–39% = Low preference, 40–59% = Moderate preference, 60–79% = High preference, 80–100% = Very high preference",
        "Use 'Style alignment level' wording instead of 'preference'; labels: Low/Moderate/High/Very high",
        "Use the above labels consistently across all sections; do not invent alternative wording",
        "Avoid boilerplate or templated openings in the overall analysis. Do NOT start with phrases like 'Your love style reflects a beautiful balance', 'You demonstrate remarkable ...', or similar clichés",
        "Overall analysis must be 120–180 words, written in warm, conversational language that describes the user's comprehensive relationship characteristics",
        "Base the analysis on the six dimensions' actual scores, describing how the user behaves in romantic relationships: how they express love, handle conflicts, build intimacy, dating preferences, communication styles, etc",
        "Use specific, vivid details and scenarios that help users visualize themselves in romantic contexts",
        "Avoid academic terminology and template phrases. Write as if describing a friend's relationship patterns",
        "Use varied sentence structures and natural language flow. Avoid repetitive phrasing patterns",
        "You MUST NOT recalculate or reorder styles. Mirror the provided computed results. Base analysis on all six dimensions' alignment levels"
      ],
      specialRequirements: [
        "Return loveStyleDetails for ALL six love styles: Eros, Ludus, Storge, Pragma, Mania, Agape",
        "Each loveStyleDetails[style].description must be ≤100 words, written in warm, specific language that describes how this love style manifests in the user's actual relationship behaviors",
        "Focus on concrete relationship scenarios: how they date, communicate, handle conflicts, express affection, build trust, etc. Use varied, natural language patterns",
        "Avoid generic definitions and repetitive phrasing. Describe specific behaviors through diverse, engaging language that feels conversational",
        "Descriptions must be consistent with allScores; do not contradict the score ordering",
        "Do NOT use rank labels or phrases like 'highest scores', 'your secondary love style', 'top two'; write neutral, dimension-focused interpretations",
        "Overall analysis must avoid promotional or sentimental language; prohibited examples: 'beautiful balance', 'remarkable consistency', 'strong capacity', 'genuine connection'. Prefer precise, observational wording",
        "Psychological Profile: Use vivid, specific examples of how emotions are expressed in real relationship scenarios. Instead of 'You express emotions openly', describe 'When your partner forgets an anniversary, you feel hurt but calmly explain why it matters to you, then suggest a way to make it special together'",
        "Developmental Insights: Share concrete stories and examples. Instead of 'Your upbringing shaped your approach', describe 'Growing up watching your parents argue about money taught you to discuss finances openly with partners before they become problems'",
        "Relationship Dynamics: Use specific scenarios and examples. Instead of 'You establish boundaries', describe 'When a partner tries to read your messages, you explain that privacy builds trust and suggest checking in about concerns instead'",
        "Predictive Insights: Provide specific, actionable strategies with concrete examples. Instead of 'Practice communication', describe 'Try the 5-minute daily check-in: share one thing that made you feel loved today and one thing you need from your partner tomorrow'",
        "Output valid JSON only, no extra commentary",
        "STRICT CONSISTENCY: Overall analysis must reference all six dimensions based on their alignment levels, not just primary/secondary",
        "STRICT CONSISTENCY: Per-dimension interpretations must align with provided alignment levels and must not use conflicting terms"
      ],
      schema: {
        primaryStyle: "Eros",
        secondaryStyle: "Storge",
        analysis: "Comprehensive analysis of love style based on Lee's theory",
        computed: {
          primaryStyle: "Eros",
          secondaryStyle: "Storge",
          levelBoundaries: {
            low: "0-39",
            moderate: "40-59",
            high: "60-79",
            veryHigh: "80-100"
          },
          allStyles: [
            {
              dimension: "Eros",
              percentage: 72,
              alignmentLevel: "High alignment"
            }
          ]
        },
        allScores: {
          "Eros": 8,
          "Ludus": 5,
          "Storge": 6,
          "Pragma": 4,
          "Mania": 3,
          "Agape": 4
        },
        loveStyleDetails: {
          "Eros": {
            description: "Passionate, romantic love characterized by intense emotions and physical attraction",
            characteristics: ["Specific characteristics of Eros love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          },
          "Ludus": {
            description: "Playful, game-like love that enjoys the thrill of dating and flirting",
            characteristics: ["Specific characteristics of Ludus love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          },
          "Storge": {
            description: "Friendship-based love that develops gradually from shared experiences",
            characteristics: ["Specific characteristics of Storge love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          },
          "Pragma": {
            description: "Practical, logical love that seeks compatibility and shared life goals",
            characteristics: ["Specific characteristics of Pragma love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          },
          "Mania": {
            description: "Obsessive, intense love with strong emotional attachment and dependency",
            characteristics: ["Specific characteristics of Mania love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          },
          "Agape": {
            description: "Selfless, unconditional love expressed through giving and care",
            characteristics: ["Specific characteristics of Agape love style"],
            strengths: ["Specific strengths of this love style"],
            challenges: ["Specific challenges of this love style"]
          }
        },
        psychologicalProfile: {
          emotionalExpression: "Specific examples of how emotions are expressed in real relationship scenarios (e.g., 'When your partner forgets an anniversary, you feel hurt but calmly explain why it matters, then suggest making it special together')",
          attachmentStyle: "Concrete relationship patterns with real scenarios (e.g., 'You prefer to text good morning every day because it makes you feel connected, but you're comfortable if your partner needs space for a few hours')",
          selfAwareness: "Specific examples of understanding relationship needs (e.g., 'You know you need alone time after work, so you ask your partner to give you 30 minutes before discussing the day')",
          emotionalRegulation: "Concrete examples of handling emotions and conflicts (e.g., 'When you're angry, you take a 10-minute walk before discussing the issue, then use 'I feel' statements')"
        },
        developmentalInsights: {
          backgroundInfluence: "Specific stories from upbringing that shaped relationship patterns (e.g., 'Growing up watching your parents argue about money taught you to discuss finances openly with partners before they become problems')",
          culturalFactors: "Concrete cultural influences with examples (e.g., 'Your family's emphasis on respect means you always ask before making plans that affect your partner, even small ones')",
          growthPotential: "Specific, actionable steps for developing other love styles (e.g., 'Try surprising your partner with a spontaneous date night once a month to develop more playful tendencies')",
          lifeStageConsiderations: "Age-appropriate relationship examples (e.g., 'In your 20s, you might prioritize adventure and exploration; in your 30s, you focus more on building a stable foundation together')"
        },
        relationshipDynamics: {
          powerBalance: "Specific examples of power dynamics (e.g., 'You naturally take charge of planning vacations because you enjoy research, while your partner handles daily household decisions')",
          boundarySetting: "Concrete boundary scenarios (e.g., 'When a partner tries to read your messages, you explain that privacy builds trust and suggest checking in about concerns instead')",
          conflictPatterns: "Real conflict examples (e.g., 'During arguments, you prefer to step away for 15 minutes to cool down, then return to discuss the issue calmly')",
          intimacyNeeds: "Specific intimacy scenarios (e.g., 'You need physical touch daily to feel connected, so you make sure to hug your partner before leaving for work each morning')"
        },
        predictiveInsights: {
          relationshipForecasting: "Specific predictions with examples (e.g., 'In new relationships, you'll likely suggest coffee dates first to build comfort, then progress to more adventurous activities')",
          compatibilityMatrix: "Concrete compatibility examples (e.g., 'You'll work well with partners who appreciate your planning nature but may need to communicate clearly with those who prefer spontaneity')",
          growthRoadmap: "Specific, actionable strategies (e.g., 'Try the 5-minute daily check-in: share one thing that made you feel loved today and one thing you need from your partner tomorrow')",
          interventionStrategies: "Concrete improvement strategies (e.g., 'When feeling disconnected, suggest cooking together while sharing stories from your day, as shared activities help you reconnect')"
        },
        communicationPatterns: ["Specific communication patterns and preferences in relationships, with concrete examples"],
        compatibilityInsights: ["Specific compatibility insights with other love styles, explained through relationship scenarios"],
        growthAreas: ["Specific areas for developing other love styles, with practical examples and actionable steps"],
        relationshipAdvice: ["Specific advice for maintaining healthy relationships, with concrete examples and scenarios"]
      }
    },
    interpersonal: {
      testType: "Interpersonal Skills",
      theory: "interpersonal communication and relationship skills",
      description: "interpersonal skills assessment",
      instructions: [
        "Analyze interpersonal communication and relationship skills across multiple dimensions",
        "Map percentage to fixed level labels: 0–39% = Low level, 40–59% = Moderate level, 60–79% = High level, 80–100% = Very high level",
        "Use 'Level' wording consistently; labels: Low/Moderate/High/Very high",
        "Overall analysis must be 120–180 words, written in warm, conversational language with varied sentence structures",
        "Avoid praise or congratulatory openings (e.g., 'I want to acknowledge the courage', 'It takes courage', 'proud of you'). Start directly with observable patterns and implications",
        "Base the analysis on actual scores and levels; DO NOT recalculate or reorder dimensions",
        "You MUST use EXACTLY these four dimension names in allDimensions and dimensionDetails: Communication Skills; Conflict Resolution; Teamwork & Collaboration; Emotional Intelligence",
        "Do NOT invent extra dimensions or rename them (e.g., use 'Conflict Resolution' not 'Conflict Management'; use 'Emotional Intelligence' not 'Empathy & Understanding')",
        "Keys in dimensionDetails must exactly match the names in allDimensions",
        "For each dimension, provide a concise (≤80 words) evidence-based description of observable skills and tendencies in professional and personal contexts",
        "Avoid template phrases; use specific yet neutral language that feels practical and professional",
        "Provide four professional analysis sections: psychologicalProfile, developmentalInsights, relationshipDynamics, predictiveInsights",
        "Output valid JSON only and keep wording consistent with computed levels"
      ],
      schema: {
        overallScore: 85,
        maxScore: 100,
        level: "High level",
        analysis: "Comprehensive analysis of interpersonal skills",
        // Aggregated dimension list for strict consistency
        allDimensions: [
          { dimension: "Communication Skills", percentage: 78, level: "High level" },
          { dimension: "Conflict Resolution", percentage: 65, level: "High level" },
          { dimension: "Teamwork & Collaboration", percentage: 58, level: "Moderate level" },
          { dimension: "Emotional Intelligence", percentage: 82, level: "Very high level" }
        ],
        // Per-dimension details (≤80 words each)
        dimensionDetails: {
          "Communication Skills": {
            description: "Concise description of communication strengths and common patterns (≤80 words)",
            strengths: ["Specific strengths"],
            improvementAreas: ["Specific improvement areas"]
          },
          "Conflict Resolution": {
            description: "Concise description of conflict management approach (≤80 words)",
            strengths: ["Specific strengths"],
            improvementAreas: ["Specific improvement areas"]
          },
          "Teamwork & Collaboration": {
            description: "Concise description of teamwork behaviors (≤80 words)",
            strengths: ["Specific strengths"],
            improvementAreas: ["Specific improvement areas"]
          },
          "Emotional Intelligence": {
            description: "Concise description of EI behaviors (≤80 words)",
            strengths: ["Specific strengths"],
            improvementAreas: ["Specific improvement areas"]
          }
        },
        // removed top-level strengths/areasForImprovement to align with frontend removal
        // Professional analysis modules
        psychologicalProfile: {
          communicationStyle: "How communication style presents in real interactions, with specific examples",
          empathyPatterns: "How empathy shows up in conversations and support",
          selfAwareness: "Awareness of interpersonal impact and adjustment",
          emotionRegulation: "How emotions are regulated during difficult interactions"
        },
        developmentalInsights: {
          backgroundInfluence: "Upbringing or experience shaping interpersonal habits (examples)",
          culturalFactors: "Cultural norms impacting communication and boundaries",
          growthPotential: "Concrete skills that could be developed next",
          lifeStageConsiderations: "How current life/work stage affects interpersonal expression"
        },
        relationshipDynamics: {
          collaborationPatterns: "Typical teamwork and collaboration patterns",
          boundarySetting: "Boundary preferences and enforcement style",
          conflictPatterns: "Typical conflict triggers and resolution approaches",
          trustBuilding: "How trust is built and maintained in relationships"
        },
        predictiveInsights: {
          workplaceForecasting: "Predictions for workplace interactions and outcomes",
          compatibilityMatrix: "Collaboration compatibility with different personalities/styles",
          growthRoadmap: "Stepwise, actionable roadmap for skill growth",
          interventionStrategies: "Concrete strategies and exercises to improve interpersonal skills"
        }
      }
    },
    holland: {
      testType: "Holland Code",
      theory: "John Holland's RIASEC theory",
      description: "career interest assessment",
      instructions: [
        "Analyze based on Holland's RIASEC theory",
        "Provide specific career recommendations",
        "Include work environment and skill development suggestions"
      ],
      schema: {
        primaryCode: "I",
        secondaryCode: "A",
        tertiaryCode: "S",
        analysis: "Comprehensive analysis of career interests based on Holland's RIASEC theory",
        hollandTypes: {
          "Realistic": {
            score: 15,
            description: "Practical, hands-on, and mechanical interests",
            characteristics: ["Specific realistic type characteristics"]
          }
        },
        specificCareers: ["Specific career recommendations based on Holland code"],
        workEnvironment: "Detailed description of preferred work environment based on Holland types",
        skills: ["Specific skills that align with Holland type interests"],
        growthAreas: ["Specific areas for career development and skill building"],
        careerPathways: ["Specific career pathways and progression opportunities"],
        educationRecommendations: ["Specific education and training recommendations"],
        jobSearchStrategy: ["Specific job search strategies based on Holland type"]
      }
    },
    disc: {
      testType: "DISC",
      theory: "William Marston's DISC theory",
      description: "behavior style assessment",
      instructions: [
        "Analyze based on DISC theory",
        "Provide workplace and communication insights",
        "Include team dynamics and leadership suggestions"
      ],
      schema: {
        primaryStyle: "D",
        secondaryStyle: "I",
        analysis: "Comprehensive analysis of behavior style based on DISC theory",
        discStyles: {
          "Dominance": {
            score: 25,
            description: "Direct, results-oriented, and decisive behavior style",
            characteristics: ["Specific dominance style characteristics"],
            strengths: ["Specific dominance style strengths"],
            challenges: ["Specific dominance style challenges"],
            workStyle: "Specific work style preferences for dominance type",
            communicationStyle: "Specific communication style for dominance type"
          }
        },
        workStyle: "Specific work style preferences and approach based on DISC profile",
        communicationStyle: "Specific communication style and approach for this behavior type",
        teamRole: "Specific team role and collaboration preferences",
        leadershipStyle: "Specific leadership approach and management style",
        stressBehaviors: ["How this style typically responds to stress and pressure"],
        developmentAreas: ["Specific areas for personal and professional development"],
        motivationFactors: ["Specific motivation factors and workplace insights based on DISC profile"]
      }
    },
    leadership: {
      testType: "Leadership Assessment",
      theory: "leadership and management theory",
      description: "leadership assessment",
      instructions: [
        "Analyze leadership capabilities and management approach",
        "Provide specific leadership development recommendations",
        "Include organizational impact and development insights"
      ],
      schema: {
        overallScore: 80,
        maxScore: 100,
        leadershipLevel: "intermediate",
        analysis: "Comprehensive analysis of leadership capabilities",
        leadershipDimensions: [
          {
            name: "Vision & Strategic Thinking",
            level: "High",
            description: "Ability to create and communicate a compelling vision, think strategically, and plan for the future",
            strengths: [
              "Specific vision and strategic thinking strengths",
              "Additional strategic capabilities and talents",
              "Vision communication and inspiration skills"
            ],
            improvementAreas: [
              "Specific areas for vision and strategic thinking development",
              "Additional strategic planning improvements",
              "Vision communication enhancement opportunities"
            ]
          },
          {
            name: "Communication & Influence",
            level: "Good",
            description: "Ability to communicate effectively, inspire others, and influence without authority",
            strengths: [
              "Specific communication and influence strengths",
              "Additional communication skills and abilities",
              "Influence and persuasion capabilities"
            ],
            improvementAreas: [
              "Specific areas for communication and influence development",
              "Additional communication skill improvements",
              "Influence and persuasion enhancement opportunities"
            ]
          },
          {
            name: "Team Building & Development",
            level: "High",
            description: "Ability to build high-performing teams, develop talent, and create collaborative environments",
            strengths: [
              "Specific team building and development strengths",
              "Additional team leadership capabilities",
              "Talent development and coaching skills"
            ],
            improvementAreas: [
              "Specific areas for team building and development",
              "Additional team leadership improvements",
              "Talent development enhancement opportunities"
            ]
          },
          {
            name: "Decision Making & Problem Solving",
            level: "High",
            description: "Ability to make sound decisions, solve complex problems, and manage uncertainty",
            strengths: [
              "Specific decision making and problem solving strengths",
              "Additional analytical and decision capabilities",
              "Problem-solving and critical thinking skills"
            ],
            improvementAreas: [
              "Specific areas for decision making and problem solving development",
              "Additional decision-making improvements",
              "Problem-solving enhancement opportunities"
            ]
          }
        ],
        strengths: ["Specific leadership strengths based on overall assessment"],
        leadershipChallenges: ["Specific leadership challenges and how to address them"],
        developmentPlan: ["Specific development plan for leadership growth"],
        mentoringAdvice: ["Specific advice for mentoring and developing others"],
        organizationalImpact: ["Specific ways to create positive organizational impact"],
        recommendations: ["Specific actionable recommendations for leadership development"]
      }
    },
    vark: {
      testType: "VARK",
      theory: "learning style preferences",
      description: "learning style assessment",
      instructions: [
        "Analyze preferences across Visual, Auditory, Read/Write, and Kinesthetic dimensions",
        "Compute scores for V, A, R, K",
        "Determine primaryStyle and secondaryStyle from the scores",
        "Provide comprehensive learning profile (strengths, preferences, adaptability)",
        "Provide concrete strategies and environment setup",
        "Provide learning effectiveness (conditions, performance, improvement)",
        "STRICT: Return a single JSON object that matches the schema exactly (field names and casing must match)",
        "STRICT: Do NOT wrap under analysis/result/data; no aliases such as learningStyleProfile/scoreBreakdown/modality_breakdown",
        "STRICT: All fields are required and must be non-empty; arrays: 2–6 concise English items",
        "STRICT: Output JSON only (no markdown, no prose)"
      ],
      schema: {
        primaryStyle: "Kinesthetic",
        secondaryStyle: "Visual",
        scores: { V: 8, A: 6, R: 4, K: 11 },
        analysis: "One-paragraph English synthesis of the learning profile.",
        recommendations: ["Actionable, concrete study recommendations"],
        learningProfile: {
          cognitiveStrengths: ["Strength 1", "Strength 2"],
          learningPreferences: {
            methods: ["Preferred methods"],
            environments: ["Environment setups"],
            timePatterns: ["Time patterns"]
          },
          adaptability: {
            strengths: ["Adaptability strengths"],
            challenges: ["Challenges"],
            strategies: ["Strategies"]
          }
        },
        learningStrategiesImplementation: {
          coreStrategies: ["Core strategies"],
          practicalTips: ["Practical tips"],
          environmentSetup: {
            physical: ["Physical env"],
            social: ["Social setup"],
            technology: ["Tools/tech"],
            schedule: ["Scheduling"]
          }
        },
        learningEffectiveness: {
          optimalConditions: ["Optimal conditions"],
          expectedPerformance: "Performance description",
          improvementAreas: ["Areas for improvement"]
        },
        metadata: { totalQuestions: 16 }
      }
    },
    // raven and cognitive removed
    // ==================== 占星模块配置 ====================
    fortune: {
      testType: "Astrological Fortune Reading",
      theory: "astrological principles and planetary influences",
      description: "personalized fortune reading based on zodiac sign and timeframe",
      instructions: [
        "Analyze based on traditional astrological principles and planetary positions",
        "Provide personalized insights for the specific zodiac sign and timeframe",
        "Include practical advice and guidance for daily life",
        "Use warm, mystical language that inspires hope and positivity"
      ],
      schema: {
        zodiacSign: "aries",
        timeframe: "daily",
        overall: {
          score: 8,
          description: "Comprehensive overall fortune description for the timeframe"
        },
        love: {
          score: 7,
          description: "Romantic and relationship insights for the timeframe"
        },
        career: {
          score: 8,
          description: "Professional and career guidance for the timeframe"
        },
        wealth: {
          score: 6,
          description: "Financial and material aspects for the timeframe"
        },
        health: {
          score: 7,
          description: "Physical and mental well-being guidance for the timeframe"
        },
        luckyElements: {
          colors: ["Red", "Gold"],
          numbers: [7, 14, 21],
          directions: ["North", "East"]
        },
        advice: "Personalized advice and guidance for the timeframe",
        createdAt: "2024-01-01T00:00:00.000Z"
      }
    },
    compatibility: {
      testType: "Astrological Compatibility Analysis",
      theory: "astrological compatibility principles and elemental relationships",
      description: "compatibility analysis between two zodiac signs",
      instructions: [
        "Analyze based on elemental compatibility and astrological principles",
        "Consider the specific relationship type (love, friendship, work)",
        "Provide balanced insights on both strengths and challenges",
        "Include practical advice for improving the relationship",
        "Provide detailed descriptions of each sign's elemental nature and quality traits",
        "Include comprehensive zodiac sign comparison with personality insights"
      ],
      schema: {
        sign1: "aries",
        sign2: "leo",
        relationType: "love",
        overallScore: 85,
        specificScore: 80,
        strengths: [
          "Specific strength 1 based on astrological compatibility",
          "Specific strength 2 based on elemental harmony"
        ],
        challenges: [
          "Specific challenge 1 based on astrological differences",
          "Specific challenge 2 based on conflicting energies"
        ],
        advice: "Personalized advice for improving the relationship",
        elementCompatibility: "Fire + Fire",
        qualityCompatibility: "Cardinal + Fixed",
        zodiacSignComparison: {
          sign1: {
            name: "Aries",
            symbol: "♈",
            element: "fire",
            quality: "cardinal",
            rulingPlanet: "Mars",
            dateRange: "03-21 - 04-19",
            keyTraits: ["energetic", "confident", "pioneering", "impulsive", "competitive"],
            elementalNature: "Detailed description of how fire element manifests in this sign's personality and relationships",
            qualityTraits: "Detailed description of how cardinal quality influences this sign's behavior and approach to relationships"
          },
          sign2: {
            name: "Leo",
            symbol: "♌",
            element: "fire",
            quality: "fixed",
            rulingPlanet: "Sun",
            dateRange: "07-23 - 08-22",
            keyTraits: ["confident", "generous", "dramatic", "proud", "creative"],
            elementalNature: "Detailed description of how fire element manifests in this sign's personality and relationships",
            qualityTraits: "Detailed description of how fixed quality influences this sign's behavior and approach to relationships"
          }
        },
        createdAt: "2024-01-01T00:00:00.000Z"
      }
    },
    birth_chart: {
      testType: "Birth Chart Analysis",
      theory: "natal astrology and planetary positions at birth",
      description: "comprehensive birth chart analysis based on birth data",
      instructions: [
        "Analyze based on traditional natal astrology principles",
        "Focus on core planetary influences (Sun, Moon, Rising)",
        "Provide concise insights into personality and life path",
        "Include practical guidance for personal growth"
      ],
      schema: {
        sunSign: "aries",
        moonSign: "cancer",
        risingSign: "leo",
        planetaryPositions: {
          sun: "Aries",
          moon: "Cancer",
          mercury: "Aries",
          venus: "Taurus",
          mars: "Gemini"
        },
        personalityProfile: {
          coreTraits: ["Trait 1", "Trait 2"],
          strengths: ["Strength 1", "Strength 2"],
          challenges: ["Challenge 1", "Challenge 2"],
          lifePurpose: "Brief life purpose (2-3 sentences)"
        },
        corePlanetaryInterpretations: {
          sunInterpretation: "Concise interpretation of Sun sign influence (2-3 sentences)",
          moonInterpretation: "Concise interpretation of Moon sign influence (2-3 sentences)",
          risingInterpretation: "Concise interpretation of Rising sign influence (2-3 sentences)"
        },
        lifeGuidance: {
          career: "Brief career guidance (2-3 sentences)",
          relationships: "Brief relationship guidance (2-3 sentences)",
          personalGrowth: "Brief personal growth guidance (2-3 sentences)",
          challenges: "Brief challenges and how to navigate them (2-3 sentences)"
        },
        createdAt: "2024-01-01T00:00:00.000Z"
      }
    },
    // ==================== 塔罗牌模块配置 ====================
    tarot: {
      testType: "Tarot Card Reading",
      theory: "traditional tarot symbolism and intuitive interpretation",
      description: "comprehensive tarot card reading and analysis",
      instructions: [
        "Analyze based on traditional tarot symbolism and card meanings",
        "Consider card positions, reversals, and elemental influences",
        "Provide personalized insights based on the user's question and context",
        "Include practical guidance and actionable advice",
        "Use mystical yet accessible language that inspires and guides"
      ],
      schema: {
        sessionId: "tarot_session_123",
        overall_interpretation: "Comprehensive interpretation of the entire reading, weaving together all cards and their positions to tell a cohesive story about the user's situation and guidance",
        card_interpretations: [
          {
            position: 1,
            card_name: "The Fool",
            interpretation: "Detailed interpretation of this specific card in its position, considering both upright/reversed meaning and the position's significance",
            advice: "Specific actionable advice based on this card's message for the user's situation"
          }
        ],
        synthesis: "Deep synthesis of how all cards work together, highlighting patterns, themes, and the overall message of the reading",
        action_guidance: [
          "Specific actionable step 1 based on the reading",
          "Specific actionable step 2 based on the reading",
          "Specific actionable step 3 based on the reading"
        ],
        timing_advice: "Guidance on timing and when to take action based on the cards drawn",
        emotional_insights: "Deep emotional insights and intuitive guidance based on the card combinations",
        spiritual_guidance: "Spiritual or higher-level guidance that transcends the immediate situation",
        warning_signs: "Any cautionary guidance or things to be aware of based on the cards",
        opportunities: "Positive opportunities and potential outcomes suggested by the cards",
        generated_at: "2024-01-01T00:00:00.000Z"
      }
    }
  };

  /**
   * 标准化测试类型名称
   */
  private static normalizeTestType(testType: string): string {
    const typeMap: Record<string, string> = {
      'love_language': 'loveLanguage',
      'love_style': 'loveStyle',
      'learning_ability': 'learningAbility',
      'career_guidance': 'careerGuidance'
    };
    
    return typeMap[testType.toLowerCase()] || testType.toLowerCase();
  }

  /**
   * 构建统一的prompt
   */
  static buildPrompt(answers: UserAnswer[], context: TestContext, testType: string): string {
    // 处理不同的testType命名格式
    const normalizedTestType = this.normalizeTestType(testType);
    const config = this.TEST_CONFIGS[normalizedTestType];
    if (!config) {
      throw new Error(`Unknown test type: ${testType}`);
    }

    // 根据测试类型构建不同的answerText格式
    let answerText: string;
    if (testType.toLowerCase() === 'tarot') {
      // 塔罗牌特殊处理：answer是包含卡牌信息的对象
      answerText = answers.map(a => {
        const answer = a.answer as any;
        return `Card ${a.questionId}: ${answer.card?.name_en || 'Unknown'} (Position: ${answer.position}, Reversed: ${answer.isReversed}, Spread: ${answer.spreadType}, Question: ${answer.questionText || 'General guidance'}, Category: ${answer.questionCategory || 'general'})`;
      }).join('\n');
    } else {
      // 其他测试类型使用默认格式
      answerText = answers.map(a => `Question ${a.questionId}: ${a.answer}`).join('\n');
    }
    
    const theoryContext = config.theory ? ` based on ${config.theory}` : '';
    
    const specialInstructions = this.buildSpecialInstructions(config);
    
    // 添加格式强调
    const formatInstructions = `
IMPORTANT FORMAT RULES:
1. Your response MUST be a single valid JSON object matching the schema exactly.
2. Do not include any text before or after the JSON.
3. All strings must be in English.
4. All arrays must have at least the minimum number of items specified.
5. Do not add extra fields not in the schema.
6. If any required field is missing, the response will be invalid.

Example of correct response format:
${JSON.stringify(config.schema, null, 2).replace(/"/g, '\\"')}
`;
    
    const prompt = this.UNIFIED_PROMPT_TEMPLATE
      .replace('{testType}', config.testType)
      .replace('{theoryContext}', theoryContext)
      .replace('{language}', context.language || 'en')
      .replace('{answers}', answerText)
      .replace('{specialInstructions}', specialInstructions)
      .replace('{schema}', JSON.stringify(config.schema, null, 2))
      .replace('{formatInstructions}', formatInstructions);  // 新增这一行

    return prompt;
  }

  /**
   * 构建特殊指令
   */
  private static buildSpecialInstructions(config: PromptConfig): string {
    let instructions = '';
    
    if (config.instructions && config.instructions.length > 0) {
      instructions += 'SPECIAL INSTRUCTIONS:\n';
      config.instructions.forEach((instruction, index) => {
        instructions += `${index + 1}. ${instruction}\n`;
      });
      instructions += '\n';
    }
    
    if (config.specialRequirements && config.specialRequirements.length > 0) {
      instructions += 'ADDITIONAL REQUIREMENTS:\n';
      config.specialRequirements.forEach((requirement, index) => {
        instructions += `${index + 1}. ${requirement}\n`;
      });
      instructions += '\n';
    }
    
    return instructions;
  }

  /**
   * 获取系统角色
   */
  static getSystemRole(): string {
    return this.UNIFIED_SYSTEM_ROLE;
  }

  /**
   * 验证prompt一致性
   */
  static validatePromptConsistency(prompt: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // 检查是否包含系统角色
    if (!prompt.includes('warm, supportive, and professional')) {
      issues.push('Missing unified system role language');
      suggestions.push('Include warm, supportive, and professional language');
    }

    // 检查是否包含JSON格式要求
    if (!prompt.includes('Return ONLY a valid JSON object')) {
      issues.push('Missing strict JSON format requirement');
      suggestions.push('Add strict JSON format requirement');
    }

    // 检查是否包含温暖语调指导
    if (!prompt.includes('gentle, encouraging tone')) {
      issues.push('Missing warm tone guidance');
      suggestions.push('Include gentle, encouraging tone guidance');
    }

    // 检查是否包含规则说明
    if (!prompt.includes('Rules:')) {
      issues.push('Missing rules section');
      suggestions.push('Add comprehensive rules section');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * 获取所有支持的测试类型
   */
  static getSupportedTestTypes(): string[] {
    return Object.keys(this.TEST_CONFIGS);
  }

  /**
   * 获取测试配置
   */
  static getTestConfig(testType: string): PromptConfig | null {
    return this.TEST_CONFIGS[testType.toLowerCase()] || null;
  }
}
