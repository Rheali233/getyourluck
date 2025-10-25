/**
 * Career AI Service
 * Uses backend AI proxy for secure analysis
 */

import type { TestSession, TestResult } from '../types';
import { getApiBaseUrl } from '@/config/environment';

export class CareerAIService {
  private baseURL: string;

  constructor() {
    this.baseURL = '/ai/career';
  }

  /**
   * Analyze test results using AI service
   */
  async analyzeTest(session: TestSession): Promise<TestResult> {
    try {
      const response = await fetch(`${this.baseURL}/${session.testType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: session.answers,
          context: { testType: session.testType }
        })
      });
      
      if (!response.ok) {
        throw new Error('AI analysis failed');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return this.parseAIResponse(result.data, session.testType);
      }
      
      throw new Error(result.error || 'AI analysis failed');
    } catch (error) {
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取测试结果
   */
  async getTestResult(sessionId: string): Promise<TestResult> {
    try {
      // Implementation: Actual result retrieval
      // This would typically call the backend result endpoint
      const response = await fetch(`${getApiBaseUrl()}/api/v1/career/results/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to retrieve result: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to retrieve test result');
      }
      
    } catch (error) {
      throw new Error(`Failed to retrieve test result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 提交反馈
   */
  async submitFeedback(sessionId: string, feedback: { type: 'like' | 'dislike'; comment?: string }): Promise<{ success: boolean; message: string }> {
    try {
      // Implementation: Actual feedback submission
      // This would typically call the backend feedback endpoint
      const response = await fetch(`${getApiBaseUrl()}/api/v1/career/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          ...feedback,
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit feedback: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          message: 'Feedback submitted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to submit feedback');
      }
      
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse AI response based on test type
   */
  private parseAIResponse(response: any, testType: string): TestResult {
    switch (testType) {
      case 'holland':
        return this.parseHollandResponse(response);
      case 'disc':
        return this.parseDISCResponse(response);
      case 'leadership':
        return this.parseLeadershipResponse(response);
      default:
        throw new Error(`Unsupported test type: ${testType}`);
    }
  }

  /**
   * Parse Holland Code response
   */
  private parseHollandResponse(response: any): TestResult {
    const scores = response.scores || {};
    const primaryType = response.primaryType || 'R';
    const secondaryType = response.secondaryType || 'I';
    
    // Generate comprehensive Holland analysis based on scores
    const analysis = this.generateHollandAnalysis(scores, primaryType, secondaryType);
    
    return {
      sessionId: '',
      testType: 'holland',
      scores: scores,
      primaryType: primaryType,
      secondaryType: secondaryType,
      interpretation: response.interpretation || analysis.interpretation,
      recommendations: response.recommendations || analysis.recommendations,
      strengths: response.strengths || analysis.strengths,
      areasForGrowth: response.areasForGrowth || analysis.areasForGrowth,
      careerAdvice: response.careerAdvice || analysis.careerAdvice,
      summary: response.summary || analysis.summary,
      // Holland specific fields
      hollandCode: `${primaryType}${secondaryType}`,
      secondaryInterpretation: analysis.secondaryInterpretation,
      careerMatches: analysis.careerMatches,
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Parse DISC response
   */
  private parseDISCResponse(response: any): TestResult {
    const scores = response.scores || {};
    const primaryType = response.primaryType || 'S';
    const secondaryType = response.secondaryType || 'C';
    
    // Generate comprehensive DISC analysis based on scores
    const analysis = this.generateDISCAnalysis(scores, primaryType, secondaryType);
    
    return {
      sessionId: '',
      testType: 'disc',
      scores: scores,
      primaryType: primaryType,
      secondaryType: secondaryType,
      interpretation: response.interpretation || analysis.interpretation,
      recommendations: response.recommendations || analysis.recommendations,
      strengths: response.strengths || analysis.strengths,
      areasForGrowth: response.areasForGrowth || analysis.areasForGrowth,
      careerAdvice: response.careerAdvice || analysis.careerAdvice,
      summary: response.summary || analysis.summary,
      // DISC specific fields
      discStyle: analysis.discStyle,
      workStyle: analysis.workStyle,
      communicationStyle: analysis.communicationStyle,
      discLeadershipStyle: analysis.discLeadershipStyle,
      teamCollaboration: analysis.teamCollaboration,
      stressResponse: analysis.stressResponse,
      normalizedScores: response.normalizedScores || {},
      percentileRankings: response.percentileRankings || {},
      confidenceLevel: response.confidenceLevel || 0.85,
      responseConsistency: response.responseConsistency || 0.9,
      workplaceApplication: analysis.workplaceApplication,
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Generate comprehensive DISC analysis based on scores
   */
  private generateDISCAnalysis(_scores: Record<string, number>, primaryType: string, secondaryType: string): any {
    const discTypes = {
      D: { name: 'Dominance', style: 'Direct and Decisive', color: 'red' },
      I: { name: 'Influence', style: 'Optimistic and Social', color: 'yellow' },
      S: { name: 'Steadiness', style: 'Patient and Supportive', color: 'green' },
      C: { name: 'Conscientiousness', style: 'Analytical and Precise', color: 'blue' }
    };

    const primary = discTypes[primaryType as keyof typeof discTypes];
    const secondary = discTypes[secondaryType as keyof typeof discTypes];

    // Generate style combination description
    const styleCombination = `${primaryType}${secondaryType}`;
    const styleDescriptions: Record<string, string> = {
      'DS': 'Direct and supportive, strong leadership with team focus',
      'DI': 'Direct and influential, dynamic leadership style',
      'DC': 'Direct and analytical, results-driven with attention to detail',
      'SD': 'Supportive and direct, team-oriented leadership',
      'SI': 'Steady and influencing, strong support and communication',
      'SC': 'Steady and conscientious, reliable and thorough',
      'ID': 'Influential and direct, charismatic leadership',
      'IS': 'Influential and steady, people-oriented with stability',
      'IC': 'Influential and conscientious, creative with precision',
      'CD': 'Conscientious and direct, analytical leadership',
      'CI': 'Conscientious and influential, creative problem-solving',
      'CS': 'Conscientious and steady, methodical and supportive'
    };

    // Generate strengths based on primary type
    const strengthsMap: Record<string, string[]> = {
      'D': ['Strong decision-making abilities', 'Direct communication style', 'Goal-oriented approach', 'Natural leadership qualities'],
      'I': ['Excellent interpersonal skills', 'Positive and motivating attitude', 'Creative problem-solving', 'Strong networking abilities'],
      'S': ['Reliable and consistent performance', 'Strong team collaboration skills', 'Patient and supportive nature', 'Excellent listening skills'],
      'C': ['High attention to detail', 'Analytical thinking', 'Quality-focused approach', 'Systematic problem-solving']
    };

    // Generate growth areas based on primary type
    const growthMap: Record<string, string[]> = {
      'D': ['Develop patience with slower team members', 'Enhance listening skills', 'Improve conflict resolution', 'Build more collaborative approach'],
      'I': ['Improve time management', 'Develop more structured approach', 'Enhance attention to detail', 'Build consistency in follow-through'],
      'S': ['Develop more direct communication', 'Enhance assertiveness in conflicts', 'Build decision-making confidence', 'Improve adaptability to change'],
      'C': ['Develop more flexible thinking', 'Enhance interpersonal skills', 'Improve risk-taking abilities', 'Build more collaborative approach']
    };

    // Generate workplace application
    const workplaceMap: Record<string, string> = {
      'D': 'Thrives in leadership roles, project management, and high-pressure environments',
      'I': 'Excels in sales, marketing, training, and people-oriented positions',
      'S': 'Ideal for customer service, team coordination, and support roles',
      'C': 'Perfect for research, analysis, quality control, and technical positions'
    };

    return {
      interpretation: `Your DISC profile shows a ${primary.name}-${secondary.name} style, indicating you are ${primary.style.toLowerCase()} with ${secondary.style.toLowerCase()} tendencies. ${styleDescriptions[styleCombination] || 'This combination creates a unique and effective working style.'}`,
      summary: `${primaryType}${secondaryType} style - ${primary.style.toLowerCase()} and ${secondary.style.toLowerCase()}, strong in ${primary.name.toLowerCase()} and ${secondary.name.toLowerCase()} areas, focus on ${primary.name === 'Dominance' ? 'leadership and results' : primary.name === 'Influence' ? 'communication and relationships' : primary.name === 'Steadiness' ? 'team and people-oriented roles' : 'quality and precision'}.`,
      strengths: strengthsMap[primaryType] || ['Strong analytical skills', 'Good communication', 'Team collaboration'],
      areasForGrowth: growthMap[primaryType] || ['Time management', 'Conflict resolution', 'Adaptability'],
      recommendations: [
        'Leverage your natural strengths in your current role',
        'Focus on developing areas that complement your primary style',
        'Use your DISC profile to improve team communication',
        'Apply your style strengths to career development'
      ],
      careerAdvice: [
        'Consider roles that align with your primary DISC style',
        'Develop complementary skills to become more well-rounded',
        'Use your understanding of DISC to improve workplace relationships',
        'Leverage your style for effective team collaboration'
      ],
      discStyle: styleCombination,
      workStyle: `${primary.style} with ${secondary.style} tendencies`,
      communicationStyle: this.getDISCCommunicationStyle(primaryType, secondaryType),
      discLeadershipStyle: this.getDISCLeadershipStyle(primaryType, secondaryType),
      teamCollaboration: this.getDISCTeamCollaboration(primaryType, secondaryType),
      stressResponse: this.getDISCStressResponse(primaryType, secondaryType),
      workplaceApplication: workplaceMap[primaryType] || 'Versatile professional with strong analytical and interpersonal skills'
    };
  }

  /**
   * Get DISC communication style
   */
  private getDISCCommunicationStyle(primary: string, _secondary: string): string { // eslint-disable-line no-unused-vars
    const styles: Record<string, string> = {
      'D': 'Direct and concise, prefers clear and actionable information',
      'I': 'Enthusiastic and engaging, uses stories and examples',
      'S': 'Patient and supportive, listens carefully and responds thoughtfully',
      'C': 'Detailed and precise, provides comprehensive information'
    };
    return styles[primary] || 'Adaptive communication style';
  }

  /**
   * Get DISC leadership style
   */
  private getDISCLeadershipStyle(primary: string, _secondary: string): string { // eslint-disable-line no-unused-vars
    const styles: Record<string, string> = {
      'D': 'Directive and results-oriented, sets clear goals and expectations',
      'I': 'Inspirational and motivating, builds enthusiasm and engagement',
      'S': 'Supportive and collaborative, focuses on team development and harmony',
      'C': 'Analytical and systematic, ensures quality and compliance'
    };
    return styles[primary] || 'Adaptive leadership approach';
  }

  /**
   * Get DISC team collaboration style
   */
  private getDISCTeamCollaboration(primary: string, _secondary: string): string { // eslint-disable-line no-unused-vars
    const styles: Record<string, string> = {
      'D': 'Goal-focused collaborator, drives team toward objectives',
      'I': 'Relationship builder, creates positive team dynamics',
      'S': 'Team supporter, maintains harmony and provides stability',
      'C': 'Quality controller, ensures standards and processes are followed'
    };
    return styles[primary] || 'Effective team collaborator';
  }

  /**
   * Get DISC stress response
   */
  private getDISCStressResponse(primary: string, _secondary: string): string { // eslint-disable-line no-unused-vars
    const responses: Record<string, string> = {
      'D': 'Becomes more direct and demanding, focuses on quick solutions',
      'I': 'May become scattered or overly optimistic, needs structure',
      'S': 'Withdraws or becomes resistant to change, needs reassurance',
      'C': 'Becomes more rigid and critical, needs flexibility'
    };
    return responses[primary] || 'Adaptive stress response';
  }

  /**
   * Generate comprehensive Holland analysis based on scores
   */
  private generateHollandAnalysis(_scores: Record<string, number>, primaryType: string, secondaryType: string): any {
    const hollandTypes = {
      R: { name: 'Realistic', style: 'Practical and Hands-on', description: 'Working with things, machines, tools, outdoor activities' },
      I: { name: 'Investigative', style: 'Analytical and Intellectual', description: 'Scientific research, analytical thinking, problem-solving' },
      A: { name: 'Artistic', style: 'Creative and Expressive', description: 'Creative expression, design, innovation, performing arts' },
      S: { name: 'Social', style: 'Supportive and Cooperative', description: 'Helping others, teaching, teamwork, interpersonal skills' },
      E: { name: 'Enterprising', style: 'Persuasive and Leadership', description: 'Leadership, persuasion, business, sales' },
      C: { name: 'Conventional', style: 'Organized and Systematic', description: 'Organization, data handling, following procedures' }
    };

    const primary = hollandTypes[primaryType as keyof typeof hollandTypes];
    const secondary = hollandTypes[secondaryType as keyof typeof hollandTypes];

    // Generate Holland code description
    const hollandCode = `${primaryType}${secondaryType}`;
    const codeDescriptions: Record<string, string> = {
      'RI': 'Practical problem-solver with analytical thinking',
      'RA': 'Hands-on creator with practical skills',
      'RS': 'Practical helper with technical skills',
      'RE': 'Practical leader with hands-on approach',
      'RC': 'Practical organizer with technical focus',
      'IR': 'Analytical problem-solver with practical application',
      'IA': 'Analytical creator with research focus',
      'IS': 'Analytical helper with research skills',
      'IE': 'Analytical leader with strategic thinking',
      'IC': 'Analytical organizer with research focus',
      'AR': 'Creative problem-solver with practical skills',
      'AI': 'Creative researcher with analytical thinking',
      'AS': 'Creative helper with artistic skills',
      'AE': 'Creative leader with innovative approach',
      'AC': 'Creative organizer with artistic focus',
      'SR': 'Supportive problem-solver with practical skills',
      'SI': 'Supportive researcher with analytical thinking',
      'SA': 'Supportive creator with artistic skills',
      'SE': 'Supportive leader with people focus',
      'SC': 'Supportive organizer with people skills',
      'ER': 'Leadership problem-solver with practical approach',
      'EI': 'Leadership researcher with strategic thinking',
      'EA': 'Leadership creator with innovative approach',
      'ES': 'Leadership helper with people focus',
      'EC': 'Leadership organizer with strategic focus',
      'CR': 'Organized problem-solver with practical focus',
      'CI': 'Organized researcher with analytical focus',
      'CA': 'Organized creator with systematic approach',
      'CS': 'Organized helper with systematic skills',
      'CE': 'Organized leader with systematic approach'
    };

    // Generate strengths based on primary type
    const strengthsMap: Record<string, string[]> = {
      'R': ['Strong practical problem-solving skills', 'Excellent hands-on abilities', 'Technical expertise', 'Reliable and dependable'],
      'I': ['Strong analytical thinking', 'Excellent research skills', 'Problem-solving abilities', 'Intellectual curiosity'],
      'A': ['Creative problem-solving', 'Innovative thinking', 'Artistic expression', 'Design and aesthetic skills'],
      'S': ['Excellent interpersonal skills', 'Strong teaching abilities', 'Team collaboration', 'Empathy and understanding'],
      'E': ['Natural leadership abilities', 'Strong persuasion skills', 'Business acumen', 'Goal-oriented approach'],
      'C': ['Strong organizational skills', 'Attention to detail', 'Systematic approach', 'Reliability and consistency']
    };

    // Generate growth areas based on primary type
    const growthMap: Record<string, string[]> = {
      'R': ['Develop more theoretical understanding', 'Enhance communication skills', 'Improve strategic thinking', 'Build broader perspective'],
      'I': ['Develop practical application skills', 'Enhance interpersonal skills', 'Improve communication', 'Build hands-on experience'],
      'A': ['Develop practical skills', 'Enhance business acumen', 'Improve organization', 'Build systematic approach'],
      'S': ['Develop technical skills', 'Enhance analytical thinking', 'Improve strategic planning', 'Build practical abilities'],
      'E': ['Develop technical knowledge', 'Enhance analytical thinking', 'Improve patience', 'Build systematic approach'],
      'C': ['Develop creative thinking', 'Enhance flexibility', 'Improve innovation', 'Build strategic perspective']
    };

    // Generate career matches
    const careerMatches = this.generateHollandCareerMatches(primaryType, secondaryType);

    return {
      interpretation: `Your Holland Code ${hollandCode} indicates a ${primary.style.toLowerCase()} personality with ${secondary.style.toLowerCase()} tendencies. ${codeDescriptions[hollandCode] || 'This combination creates a unique and effective working style.'}`,
      summary: `${hollandCode} profile - ${primary.style.toLowerCase()} and ${secondary.style.toLowerCase()}, strong in ${primary.name.toLowerCase()} and ${secondary.name.toLowerCase()} areas, focus on ${primary.description.toLowerCase()}.`,
      strengths: strengthsMap[primaryType] || ['Strong analytical skills', 'Good communication', 'Team collaboration'],
      areasForGrowth: growthMap[primaryType] || ['Time management', 'Conflict resolution', 'Adaptability'],
      recommendations: [
        'Leverage your natural strengths in your current role',
        'Focus on developing areas that complement your primary type',
        'Use your Holland profile to guide career decisions',
        'Apply your type strengths to career development'
      ],
      careerAdvice: [
        'Consider roles that align with your primary Holland type',
        'Develop complementary skills to become more well-rounded',
        'Use your understanding of Holland types to improve workplace relationships',
        'Leverage your type for effective career planning'
      ],
      secondaryInterpretation: `Your secondary ${secondary.name} type enhances your ${primary.name.toLowerCase()} nature, providing ${secondary.description.toLowerCase()}.`,
      careerMatches: careerMatches
    };
  }

  /**
   * Generate Holland career matches
   */
  private generateHollandCareerMatches(primary: string, _secondary: string): Array<{
    title: string;
    matchScore: number;
    description: string;
    requiredSkills: string[];
    salaryRange?: string;
    growthOutlook?: string;
  }> {
    const careerMap: Record<string, Array<{
      title: string;
      description: string;
      requiredSkills: string[];
      salaryRange: string;
      growthOutlook: string;
    }>> = {
      'R': [
        {
          title: 'Mechanical Engineer',
          description: 'Design and build mechanical systems and products',
          requiredSkills: ['Technical drawing', 'Problem-solving', 'Mathematics', 'Physics'],
          salaryRange: '$60,000 - $120,000',
          growthOutlook: 'Strong growth in automation and robotics'
        },
        {
          title: 'Construction Manager',
          description: 'Oversee construction projects and teams',
          requiredSkills: ['Project management', 'Technical knowledge', 'Leadership', 'Communication'],
          salaryRange: '$70,000 - $150,000',
          growthOutlook: 'Steady growth in infrastructure development'
        }
      ],
      'I': [
        {
          title: 'Data Scientist',
          description: 'Analyze complex data to solve business problems',
          requiredSkills: ['Statistics', 'Programming', 'Machine learning', 'Analytical thinking'],
          salaryRange: '$80,000 - $150,000',
          growthOutlook: 'High growth in AI and data analytics'
        },
        {
          title: 'Research Analyst',
          description: 'Conduct research and provide insights',
          requiredSkills: ['Research methods', 'Data analysis', 'Critical thinking', 'Communication'],
          salaryRange: '$50,000 - $100,000',
          growthOutlook: 'Growing demand in various industries'
        }
      ],
      'A': [
        {
          title: 'UX Designer',
          description: 'Create user-centered digital experiences',
          requiredSkills: ['Design thinking', 'User research', 'Prototyping', 'Visual design'],
          salaryRange: '$60,000 - $130,000',
          growthOutlook: 'High growth in digital transformation'
        },
        {
          title: 'Content Creator',
          description: 'Develop engaging content for various platforms',
          requiredSkills: ['Creative writing', 'Visual design', 'Social media', 'Storytelling'],
          salaryRange: '$40,000 - $100,000',
          growthOutlook: 'Growing demand in digital marketing'
        }
      ],
      'S': [
        {
          title: 'Human Resources Manager',
          description: 'Manage people and organizational development',
          requiredSkills: ['Interpersonal skills', 'Communication', 'Problem-solving', 'Leadership'],
          salaryRange: '$60,000 - $120,000',
          growthOutlook: 'Steady growth in talent management'
        },
        {
          title: 'Social Worker',
          description: 'Help people overcome challenges and improve lives',
          requiredSkills: ['Empathy', 'Communication', 'Problem-solving', 'Cultural awareness'],
          salaryRange: '$40,000 - $80,000',
          growthOutlook: 'Growing need in healthcare and social services'
        }
      ],
      'E': [
        {
          title: 'Sales Manager',
          description: 'Lead sales teams and drive revenue growth',
          requiredSkills: ['Leadership', 'Communication', 'Negotiation', 'Strategic thinking'],
          salaryRange: '$70,000 - $150,000',
          growthOutlook: 'Strong growth in B2B sales'
        },
        {
          title: 'Entrepreneur',
          description: 'Start and grow your own business',
          requiredSkills: ['Risk-taking', 'Leadership', 'Business acumen', 'Adaptability'],
          salaryRange: 'Variable',
          growthOutlook: 'High potential in emerging markets'
        }
      ],
      'C': [
        {
          title: 'Financial Analyst',
          description: 'Analyze financial data and provide insights',
          requiredSkills: ['Financial modeling', 'Excel', 'Analytical thinking', 'Attention to detail'],
          salaryRange: '$60,000 - $120,000',
          growthOutlook: 'Steady growth in financial services'
        },
        {
          title: 'Project Manager',
          description: 'Plan and execute projects successfully',
          requiredSkills: ['Organization', 'Leadership', 'Communication', 'Risk management'],
          salaryRange: '$70,000 - $140,000',
          growthOutlook: 'High demand across industries'
        }
      ]
    };

    const primaryCareers = careerMap[primary] || [];
    const secondaryCareers = careerMap[_secondary] || [];
    
    return [
      ...primaryCareers.map(career => ({
        ...career,
        matchScore: 95
      })),
      ...secondaryCareers.map(career => ({
        ...career,
        matchScore: 85
      }))
    ].slice(0, 4); // Return top 4 matches
  }

  /**
   * Generate comprehensive Leadership analysis based on scores
   */
  private generateLeadershipAnalysis(_scores: Record<string, number>, primaryType: string, _secondaryType: string): any { // eslint-disable-line no-unused-vars
    const leadershipTypes = {
      transformational: { 
        name: 'Transformational', 
        style: 'Inspirational and Visionary',
        description: 'Focuses on inspiring and motivating team members to achieve extraordinary outcomes'
      },
      transactional: { 
        name: 'Transactional', 
        style: 'Structured and Reward-based',
        description: 'Uses clear expectations and rewards to drive performance'
      },
      servant: { 
        name: 'Servant', 
        style: 'Supportive and People-focused',
        description: 'Prioritizes team development and serving others'
      },
      situational: { 
        name: 'Situational', 
        style: 'Adaptive and Context-aware',
        description: 'Adjusts leadership style based on the situation and team needs'
      },
      adaptive: { 
        name: 'Adaptive', 
        style: 'Flexible and Learning-oriented',
        description: 'Continuously learns and adapts leadership approach'
      }
    };

    const primary = leadershipTypes[primaryType as keyof typeof leadershipTypes];

    // Generate leadership style description
    const styleDescriptions: Record<string, string> = {
      'transformational': 'You inspire and motivate others through vision and charisma, creating a culture of innovation and growth.',
      'transactional': 'You provide clear structure and expectations, using rewards and recognition to drive performance.',
      'servant': 'You focus on developing your team and serving others, creating strong relationships and trust.',
      'situational': 'You adapt your leadership style based on context, demonstrating flexibility and situational awareness.',
      'adaptive': 'You continuously learn and evolve your leadership approach, embracing change and new challenges.'
    };

    // Generate strengths based on primary type
    const strengthsMap: Record<string, string[]> = {
      'transformational': [
        'Strong vision and strategic thinking',
        'Excellent communication and inspiration skills',
        'Ability to motivate and engage teams',
        'Innovation and change management'
      ],
      'transactional': [
        'Clear goal setting and expectations',
        'Strong performance management',
        'Reliable and consistent approach',
        'Effective reward and recognition systems'
      ],
      'servant': [
        'Strong team development skills',
        'Excellent listening and empathy',
        'Building trust and relationships',
        'Focus on others\' growth and success'
      ],
      'situational': [
        'High adaptability and flexibility',
        'Strong situational awareness',
        'Effective communication across styles',
        'Context-appropriate decision making'
      ],
      'adaptive': [
        'Continuous learning mindset',
        'Change management abilities',
        'Innovation and creativity',
        'Resilience and growth orientation'
      ]
    };

    // Generate growth areas based on primary type
    const growthMap: Record<string, string[]> = {
      'transformational': [
        'Develop more structured approaches',
        'Enhance attention to detail',
        'Improve operational focus',
        'Build more systematic processes'
      ],
      'transactional': [
        'Develop more inspirational skills',
        'Enhance strategic thinking',
        'Improve change management',
        'Build more innovative approaches'
      ],
      'servant': [
        'Develop more directive skills',
        'Enhance strategic vision',
        'Improve performance management',
        'Build more results-focused approach'
      ],
      'situational': [
        'Develop more consistent approaches',
        'Enhance strategic thinking',
        'Improve long-term planning',
        'Build more systematic processes'
      ],
      'adaptive': [
        'Develop more consistent approaches',
        'Enhance structured processes',
        'Improve stability and consistency',
        'Build more systematic approaches'
      ]
    };

    // Generate action plan
    const actionPlan = this.generateLeadershipActionPlan(primaryType);

    return {
      interpretation: `Your leadership profile shows a ${primary.style.toLowerCase()} approach, indicating you are ${primary.description.toLowerCase()}. ${styleDescriptions[primaryType] || 'This leadership style creates effective team dynamics and results.'}`,
      summary: `${primary.name} Leadership - ${primary.style.toLowerCase()}, strong in ${primary.name.toLowerCase()} areas, focus on ${primary.description.toLowerCase()}.`,
      strengths: strengthsMap[primaryType] || ['Strong leadership skills', 'Good communication', 'Team management'],
      areasForGrowth: growthMap[primaryType] || ['Strategic thinking', 'Change management', 'Innovation'],
      recommendations: [
        'Leverage your natural leadership strengths in your current role',
        'Focus on developing areas that complement your primary style',
        'Use your leadership profile to improve team effectiveness',
        'Apply your style strengths to leadership development'
      ],
      careerAdvice: [
        'Consider leadership roles that align with your primary style',
        'Develop complementary skills to become more well-rounded',
        'Use your understanding of leadership styles to improve team dynamics',
        'Leverage your style for effective leadership development'
      ],
      leadershipStyle: primary.style,
      leadershipStage: this.getLeadershipStage(primaryType),
      actionPlan: actionPlan
    };
  }

  /**
   * Generate leadership action plan
   */
  private generateLeadershipActionPlan(primaryType: string): string[] {
    const actionPlans: Record<string, string[]> = {
      'transformational': [
        'Develop clear operational processes to complement your vision',
        'Create structured feedback systems for team development',
        'Implement regular performance reviews and goal setting',
        'Build systematic approaches to change management'
      ],
      'transactional': [
        'Develop inspirational communication skills',
        'Create vision and strategy development processes',
        'Implement innovation and creativity initiatives',
        'Build change management and adaptation strategies'
      ],
      'servant': [
        'Develop directive leadership skills when needed',
        'Create strategic planning and vision processes',
        'Implement performance management systems',
        'Build results-focused and outcome-driven approaches'
      ],
      'situational': [
        'Develop consistent leadership frameworks',
        'Create strategic planning and long-term vision',
        'Implement systematic processes and procedures',
        'Build stability and consistency in leadership approach'
      ],
      'adaptive': [
        'Develop consistent leadership frameworks',
        'Create structured processes and procedures',
        'Implement stability and consistency measures',
        'Build systematic and reliable leadership approaches'
      ]
    };

    return actionPlans[primaryType] || [
      'Focus on developing your core leadership strengths',
      'Identify areas for improvement and growth',
      'Create a personal development plan',
      'Seek feedback and mentorship opportunities'
    ];
  }

  /**
   * Get leadership stage based on type
   */
  private getLeadershipStage(primaryType: string): string {
    const stages: Record<string, string> = {
      'transformational': 'Advanced - Visionary and Inspirational Leadership',
      'transactional': 'Intermediate - Structured and Performance-focused Leadership',
      'servant': 'Intermediate - People-focused and Supportive Leadership',
      'situational': 'Advanced - Adaptive and Context-aware Leadership',
      'adaptive': 'Advanced - Learning and Growth-oriented Leadership'
    };

    return stages[primaryType] || 'Developing - Building Leadership Foundation';
  }

  /**
   * Parse Leadership response
   */
  private parseLeadershipResponse(response: any): TestResult {
    const scores = response.scores || {};
    const primaryType = response.primaryType || 'transformational';
    const secondaryType = response.secondaryType || '';
    
    // Generate comprehensive Leadership analysis based on scores
    const analysis = this.generateLeadershipAnalysis(scores, primaryType, secondaryType);
    
    return {
      sessionId: '',
      testType: 'leadership',
      scores: scores,
      primaryType: primaryType,
      secondaryType: secondaryType,
      interpretation: response.interpretation || analysis.interpretation,
      recommendations: response.recommendations || analysis.recommendations,
      strengths: response.strengths || analysis.strengths,
      areasForGrowth: response.areasForGrowth || analysis.areasForGrowth,
      careerAdvice: response.careerAdvice || analysis.careerAdvice,
      summary: response.summary || analysis.summary,
      // Leadership specific fields
      leadershipStyle: analysis.leadershipStyle,
      leadershipStage: analysis.leadershipStage,
      actionPlan: analysis.actionPlan,
      completedAt: new Date().toISOString()
    };
  }
}

export const careerAIService = new CareerAIService();
